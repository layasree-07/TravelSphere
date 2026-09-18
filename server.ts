import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import { verifyPlaceKnowledge, isEducationalOrNonTouristPlace } from "./server/placeKnowledge";
import { getDatabaseDestinations, updatePlaceInDatabase } from "./server/destinationsDb";
import { fetchWikipediaPlaceDetails } from "./server/wikipediaService";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini AI client with telemetry user-agent header
let aiClient: GoogleGenAI | null = null;
let geminiAccessBlocked = false;

function getGeminiClient(): GoogleGenAI | null {
  if (geminiAccessBlocked) return null;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    aiConfigured: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString()
  });
});

// Wikipedia Landmark & Media Query Endpoint
app.get("/api/wiki-place", async (req, res) => {
  const query = (req.query.q as string) || (req.query.title as string) || "";
  const state = (req.query.state as string) || "";
  if (!query) {
    return res.status(400).json({ error: "Query parameter 'q' or 'title' is required." });
  }
  const wikiData = await fetchWikipediaPlaceDetails(query, state);
  return res.json(wikiData);
});

// AI Verification Endpoint for Places and Destinations
app.post("/api/verify-place", async (req, res) => {
  const { placeName, state, country = "India", significance = "" } = req.body;

  if (!placeName || typeof placeName !== "string") {
    return res.status(400).json({ error: "placeName is required." });
  }

  const gMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${placeName}, ${state || ''}, ${country}`)}`;

  // CRITICAL CHECK: Reject educational institutes, colleges, schools, academies, coaching, and private campuses
  if (isEducationalOrNonTouristPlace(placeName)) {
    return res.json({
      isValid: false,
      confidence: 99,
      verificationStatus: "INVALID_OR_NOT_FOUND",
      placeName: placeName.trim(),
      state: state || "",
      country,
      significance: "Educational institutes, colleges, and private campuses cannot be added as tourist destinations.",
      userSignificanceAnalysis: {
        status: "INVALID",
        feedback: `"${placeName}" is an educational institution or private academic campus. TravelSphere is strictly for public tourist attractions, scenic viewpoints, nature reserves, and cultural monuments that anyone from the general public can visit.`
      },
      suggestedTags: ["Educational Institute", "Not A Tourist Spot"],
      suggestedSeason: "Not Applicable",
      suggestedClimate: "Not Applicable",
      aiExplanation: `"${placeName}" is an educational institution or private school/college campus. TravelSphere exclusively accepts public tourist spots that anyone can visit (such as monuments, parks, waterfalls, temples, and beaches). Educational institutes are strictly blocked from being added to the travel database.`,
      googleMapsUrl: gMapsUrl
    });
  }

  try {
    const ai = getGeminiClient();

    if (ai) {
      const prompt = `You are an expert geographical and tourism verification AI for a public travel booking portal (TravelSphere).
Evaluate the following submitted travel place / destination:
- Place Name: "${placeName}"
- State / Region: "${state || 'Not specified'}"
- Country: "${country}"
- User-Provided Significance: "${significance}"

CRITICAL MANDATORY POLICY - TOURIST DESTINATIONS ONLY:
1. TravelSphere only allows public tourist attractions, scenic spots, historical monuments, national parks, waterfalls, beaches, temples, hill stations, museums, and cultural landmarks that ANY member of the general public can visit.
2. Educational institutes, universities, colleges, schools, coaching centers, academic campuses, corporate headquarters, and private residential buildings MUST ALWAYS BE REJECTED with "isValid": false and "verificationStatus": "INVALID_OR_NOT_FOUND".
   (Exception: ancient archaeological ruins of historical world heritage universities like Nalanda Archaeological Ruins are allowed).
3. If this is a real public tourist spot, verify its authentic significance (up to 5 sentences covering historical origin, architectural style, cultural/spiritual importance, landscape geography, and visitor appeal), correct state/province, tags, season, and climate.

Return ONLY valid JSON with no markdown wrapping or code fences, with this exact schema:
{
  "isValid": true or false,
  "confidence": number between 0 and 100,
  "verificationStatus": "VERIFIED_ACCURATE" or "CORRECTIONS_SUGGESTED" or "INVALID_OR_NOT_FOUND",
  "placeName": "canonical name of the place",
  "state": "correct state name",
  "country": "correct country",
  "significance": "comprehensive verified significance of up to 5 sentences",
  "suggestedTags": ["Tag1", "Tag2", "Tag3"],
  "suggestedSeason": "e.g. October – March",
  "suggestedClimate": "brief climate note",
  "aiExplanation": "clear, friendly explanation of verification findings",
  "corrections": "any corrections made to spelling, state, or facts, or null if none"
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          temperature: 0.1,
          responseMimeType: "application/json",
        },
      });

      const responseText = response.text || "{}";
      const parsed = JSON.parse(responseText);

      // Extra safeguard against educational institutes returned by AI
      if (parsed.isValid && (isEducationalOrNonTouristPlace(parsed.placeName || '') || isEducationalOrNonTouristPlace(parsed.significance || ''))) {
        parsed.isValid = false;
        parsed.verificationStatus = "INVALID_OR_NOT_FOUND";
        parsed.aiExplanation = `"${placeName}" is an educational institution. Only public tourist attractions that anyone can visit can be added.`;
      }

      if (parsed.isValid) {
        // Retrieve authentic Wikipedia image and media
        try {
          const wikiData = await fetchWikipediaPlaceDetails(parsed.placeName || placeName, parsed.state || state);
          if (wikiData.imageUrl) {
            parsed.suggestedImageUrl = wikiData.imageUrl;
          }
          if (wikiData.wikiUrl) {
            parsed.wikipediaUrl = wikiData.wikiUrl;
          }
          if (wikiData.extract && (!parsed.significance || parsed.significance.length < 50)) {
            parsed.significance = wikiData.extract;
          }
        } catch (wikiErr) {
          console.warn("Wikipedia lookup error in AI branch:", wikiErr);
        }
      }

      return res.json({
        ...parsed,
        googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${parsed.placeName || placeName}, ${parsed.state || state}, ${parsed.country || country}`)}`
      });
    }
  } catch (error: any) {
    if (error?.status === 403 || String(error?.message).includes('PERMISSION_DENIED')) {
      geminiAccessBlocked = true;
    }
    console.warn("Gemini API call failed or unavailable, using geographical knowledge verification:", error?.message || error);
  }

  // Knowledge base verification engine (performs real landmark fact-checking, detects state mismatches & fake names)
  const verificationResult = await verifyPlaceKnowledge(placeName, state || "", country || "India", significance || "");
  
  if (verificationResult.isValid) {
    try {
      const wikiData = await fetchWikipediaPlaceDetails(verificationResult.placeName || placeName, verificationResult.state || state);
      if (wikiData.imageUrl) {
        verificationResult.suggestedImageUrl = wikiData.imageUrl;
      }
      if (wikiData.extract && (!verificationResult.significance || verificationResult.significance.length < 50)) {
        verificationResult.significance = wikiData.extract;
      }
    } catch (wikiErr) {
      console.warn("Wikipedia lookup error in fallback branch:", wikiErr);
    }
  }

  return res.json(verificationResult);
});

// Database API: Get all custom/updated destinations from persistent database
app.get("/api/destinations", async (_req, res) => {
  try {
    const destinations = await getDatabaseDestinations();
    return res.json({ destinations });
  } catch (error: any) {
    return res.status(500).json({ error: "Failed to read destinations database." });
  }
});

// Database API: Add or update a place in the destinations database
app.post("/api/destinations", async (req, res) => {
  try {
    const destination = req.body;

    if (!destination || !destination.name || typeof destination.name !== "string") {
      return res.status(400).json({ error: "Destination name is required." });
    }

    // Strict validation: Only AI-verified authentic places can be added/updated in the database
    if (!destination.verifiedByAi) {
      return res.status(403).json({
        error: "Forbidden: Only authentic places verified by AI can be added or updated in the database."
      });
    }

    const result = await updatePlaceInDatabase(destination);
    return res.json({
      success: true,
      destination: result.destination,
      isNew: result.isNew,
      message: result.isNew 
        ? `Destination "${result.destination.name}" successfully added to database.`
        : `Database record for "${result.destination.name}" successfully updated with verified facts.`
    });
  } catch (error: any) {
    console.error("Error saving destination to database:", error);
    return res.status(500).json({ error: "Internal server error updating database." });
  }
});

// Vite middleware in dev; static file serving in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
