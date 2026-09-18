const fs = require('fs');

// Read raw places
const fileContent = fs.readFileSync('./src/data/indianPlacesData.ts', 'utf8');
const placeMatches = [...fileContent.matchAll(/\{\s*state:\s*['"]([^'"]+)['"],\s*place:\s*['"]([^'"]+)['"],\s*significance:\s*['"`]([\s\S]*?)['"`]\s*\}/g)];

console.log(`Found ${placeMatches.length} raw places in indianPlacesData.ts`);

const rawList = placeMatches.map(m => ({
  state: m[1].trim(),
  place: m[2].trim(),
  fallbackSignificance: m[3].replace(/\s+/g, ' ').trim()
}));

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function getWikiInfo(placeName, stateName) {
  const cleanTerm = placeName
    .replace(/\(.*?\)/g, '')
    .replace(/&/g, 'and')
    .replace(/^(XYZ Temple|Sri|The)\s+/i, '')
    .trim();

  // Try direct search
  const queries = [
    `${cleanTerm} ${stateName}`,
    cleanTerm,
    placeName
  ];

  for (const q of queries) {
    try {
      const sUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(q)}&utf8=&format=json`;
      const sRes = await fetch(sUrl, { headers: { 'User-Agent': 'TravelSphereApp/1.0 (info@travelsphere.app)' } }).then(r => r.json());
      const hit = sRes?.query?.search?.[0];
      if (!hit) continue;

      const pUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(hit.title)}&prop=extracts|pageimages&exintro=true&explaintext=true&exsentences=5&pithumbsize=1280&format=json`;
      const pRes = await fetch(pUrl, { headers: { 'User-Agent': 'TravelSphereApp/1.0 (info@travelsphere.app)' } }).then(r => r.json());
      const page = Object.values(pRes?.query?.pages || {})[0];
      
      const image = page?.thumbnail?.source || null;
      let extract = page?.extract ? page.extract.replace(/\n+/g, ' ').trim() : null;
      
      // Clean up extract
      if (extract) {
        // Strip trailing citations or references like [1], [2]
        extract = extract.replace(/\[\d+\]/g, '').trim();
      }

      if (image || extract) {
        return {
          wikiTitle: hit.title,
          image,
          extract
        };
      }
    } catch (err) {
      // Continue to next query
    }
  }

  return { wikiTitle: cleanTerm, image: null, extract: null };
}

(async () => {
  const results = [];
  const total = rawList.length;
  console.log(`Starting enrichment for ${total} places...`);

  for (let i = 0; i < total; i++) {
    const item = rawList[i];
    const wiki = await getWikiInfo(item.place, item.state);
    
    // Format up to 5 sentences: if extract has >= 2 sentences use it, else expand fallback
    let finalSignificance = wiki.extract;
    if (!finalSignificance || finalSignificance.length < 50) {
      finalSignificance = item.fallbackSignificance;
    } else {
      // Limit to 5 sentences
      const sentences = finalSignificance.match(/[^.!?]+[.!?]+/g) || [finalSignificance];
      finalSignificance = sentences.slice(0, 5).join(' ').trim();
    }

    results.push({
      state: item.state,
      place: item.place,
      significance: finalSignificance,
      imageUrl: wiki.image || null,
      wikiTitle: wiki.wikiTitle || item.place
    });

    fs.writeFileSync('./src/data/wikiPlacesEnriched.json', JSON.stringify(results, null, 2), 'utf8');

    if ((i + 1) % 5 === 0 || i === total - 1) {
      console.log(`Processed ${i + 1}/${total} places... (Latest: ${item.place} => ${wiki.image ? 'IMG OK' : 'NO IMG'})`);
    }

    await sleep(20); // Faster processing
  }

  fs.writeFileSync('./src/data/wikiPlacesEnriched.json', JSON.stringify(results, null, 2), 'utf8');
  console.log('Enrichment completed! Saved to ./src/data/wikiPlacesEnriched.json');
})();
