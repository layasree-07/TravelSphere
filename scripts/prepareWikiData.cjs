const fs = require('fs');

async function getWiki(term) {
  const clean = term.replace(/\(.*?\)/g, '').trim();
  const sUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(clean)}&utf8=&format=json`;
  try {
    const sRes = await fetch(sUrl, { headers: { 'User-Agent': 'TravelSphereApp/1.0 (info@travelsphere.app)' } }).then(r => r.json());
    const title = sRes?.query?.search?.[0]?.title || clean;
    const pUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=extracts|pageimages&exintro=true&explaintext=true&exsentences=5&pithumbsize=1280&format=json`;
    const pRes = await fetch(pUrl, { headers: { 'User-Agent': 'TravelSphereApp/1.0 (info@travelsphere.app)' } }).then(r => r.json());
    const page = Object.values(pRes?.query?.pages || {})[0];
    return {
      title,
      image: page?.thumbnail?.source || null,
      extract: page?.extract ? page.extract.replace(/\n+/g, ' ').trim() : null
    };
  } catch (err) {
    return { title: clean, image: null, extract: null };
  }
}

// Quick check on a few
(async () => {
  const res = await getWiki('Chitrakote Falls');
  console.log('Chitrakote:', res);
})();
