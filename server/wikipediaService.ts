/**
 * Wikipedia & Wikimedia Service
 * Fetches authentic Wikipedia images (Wikimedia Commons high-resolution thumbnails)
 * and rich encyclopedic extracts up to 5 sentences.
 */

interface WikiPlaceResult {
  title: string;
  imageUrl: string | null;
  extract: string | null;
  wikiUrl: string;
}

const wikiCache = new Map<string, WikiPlaceResult>();

export async function fetchWikipediaPlaceDetails(
  placeName: string,
  stateName?: string
): Promise<WikiPlaceResult> {
  const cacheKey = `${placeName.toLowerCase()}||${(stateName || '').toLowerCase()}`;
  if (wikiCache.has(cacheKey)) {
    return wikiCache.get(cacheKey)!;
  }

  // Strip extraneous keywords or parentheticals for search
  const cleanTerm = placeName
    .replace(/\(.*?\)/g, '')
    .replace(/&/g, 'and')
    .replace(/^(The|Sri)\s+/i, '')
    .trim();

  const queries = [
    stateName ? `${cleanTerm} ${stateName}` : cleanTerm,
    cleanTerm,
    placeName
  ];

  for (const q of queries) {
    try {
      const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
        q
      )}&utf8=&format=json`;

      const sRes = await fetch(searchUrl, {
        headers: {
          'User-Agent': 'TravelSphereApp/1.0 (contact@travelsphere.app)'
        }
      }).then((r) => r.json());

      const topHit = sRes?.query?.search?.[0];
      if (!topHit || !topHit.title) continue;

      const pageUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(
        topHit.title
      )}&prop=extracts|pageimages&exintro=true&explaintext=true&exsentences=5&pithumbsize=1280&format=json`;

      const pRes = await fetch(pageUrl, {
        headers: {
          'User-Agent': 'TravelSphereApp/1.0 (contact@travelsphere.app)'
        }
      }).then((r) => r.json());

      const page = Object.values(pRes?.query?.pages || {})[0] as any;
      if (!page || page.missing) continue;

      const imageUrl = page.thumbnail?.source || null;
      let extract = page.extract ? page.extract.replace(/\n+/g, ' ').trim() : null;

      if (extract) {
        // Remove citations like [1], [2]
        extract = extract.replace(/\[\d+\]/g, '').trim();
        // Limit strictly to up to 5 sentences
        const sentences = extract.match(/[^.!?]+[.!?]+/g) || [extract];
        extract = sentences.slice(0, 5).join(' ').trim();
      }

      if (imageUrl || extract) {
        const result: WikiPlaceResult = {
          title: topHit.title,
          imageUrl,
          extract,
          wikiUrl: `https://en.wikipedia.org/wiki/${encodeURIComponent(topHit.title)}`
        };
        wikiCache.set(cacheKey, result);
        return result;
      }
    } catch (err) {
      console.warn(`[WikipediaService] Query failed for "${q}":`, err);
    }
  }

  const fallback: WikiPlaceResult = {
    title: placeName,
    imageUrl: null,
    extract: null,
    wikiUrl: `https://en.wikipedia.org/wiki/${encodeURIComponent(placeName)}`
  };
  wikiCache.set(cacheKey, fallback);
  return fallback;
}
