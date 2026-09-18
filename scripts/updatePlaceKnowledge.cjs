const fs = require('fs');

const enriched = JSON.parse(fs.readFileSync('./src/data/wikiPlacesEnriched.json', 'utf8'));
let placeKnowledgeCode = fs.readFileSync('./server/placeKnowledge.ts', 'utf8');

// Build map from canonicalName or simplified name to enriched data
const enrichedMap = new Map();
for (const item of enriched) {
  enrichedMap.set(item.place.toLowerCase().trim(), item);
  // Also stripped name without parentheses
  const simplified = item.place.replace(/\([^)]*\)/g, '').toLowerCase().trim();
  enrichedMap.set(simplified, item);
}

let replacedImages = 0;
let replacedSigs = 0;

// Replace images in KNOWN_LANDMARKS where Unsplash is used
for (const item of enriched) {
  const pName = item.place.toLowerCase();
  const simpleName = item.place.replace(/\([^)]*\)/g, '').trim().toLowerCase();

  // Regex to match landmark blocks with canonicalName containing place or simpleName
  // We can also find canonicalName: '...' lines
}

// Let's iterate through KNOWN_LANDMARKS lines in placeKnowledgeCode
const lines = placeKnowledgeCode.split('\n');
let currentLandmark = null;
let updatedLines = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  if (line.includes("canonicalName:")) {
    const match = line.match(/canonicalName:\s*['"]([^'"]+)['"]/);
    if (match) {
      const cName = match[1];
      const matchKey = cName.toLowerCase();
      const simpleKey = cName.replace(/\([^)]*\)/g, '').toLowerCase().trim();
      
      let matchedEnriched = null;
      for (const item of enriched) {
        const itemP = item.place.toLowerCase();
        const itemSimple = item.place.replace(/\([^)]*\)/g, '').toLowerCase().trim();
        if (matchKey.includes(itemSimple) || itemP.includes(simpleKey) || itemSimple.includes(simpleKey)) {
          matchedEnriched = item;
          break;
        }
      }
      currentLandmark = matchedEnriched;
    }
  }

  if (currentLandmark && line.includes("imageUrl:") && line.includes("unsplash.com")) {
    if (currentLandmark.imageUrl) {
      const newLine = line.replace(/imageUrl:\s*['"][^'"]+['"]/, `imageUrl: ${JSON.stringify(currentLandmark.imageUrl)}`);
      updatedLines.push(newLine);
      replacedImages++;
      continue;
    }
  }

  if (currentLandmark && line.includes("significance:") && currentLandmark.significance) {
    // Check if current significance is under 30 words and currentLandmark has a full 3-5 sentence extract
    const matchSig = line.match(/significance:\s*(['"`].*['"`]),?$/);
    if (matchSig && matchSig[1].length < 100 && currentLandmark.significance.length > 100) {
      const newLine = `    significance: ${JSON.stringify(currentLandmark.significance)},`;
      updatedLines.push(newLine);
      replacedSigs++;
      continue;
    }
  }

  if (line.trim() === '},') {
    currentLandmark = null;
  }

  updatedLines.push(line);
}

fs.writeFileSync('./server/placeKnowledge.ts', updatedLines.join('\n'), 'utf8');
console.log(`Updated placeKnowledge.ts! Replaced images: ${replacedImages}, Replaced significance: ${replacedSigs}`);
