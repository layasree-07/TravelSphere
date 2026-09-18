const fs = require('fs');
const path = require('path');

const enriched = JSON.parse(fs.readFileSync('./src/data/wikiPlacesEnriched.json', 'utf8'));
console.log(`Loaded ${enriched.length} enriched places from wikiPlacesEnriched.json`);

// 1. Build RAW_INDIAN_PLACES array code
const rawPlacesCode = enriched.map(item => {
  const safeSig = JSON.stringify(item.significance);
  const safePlace = JSON.stringify(item.place);
  const safeState = JSON.stringify(item.state);
  const safeImg = JSON.stringify(item.imageUrl);
  const safeWiki = JSON.stringify(item.wikiTitle || item.place);
  return `  {
    state: ${safeState},
    place: ${safePlace},
    significance: ${safeSig},
    imageUrl: ${safeImg},
    wikiTitle: ${safeWiki}
  }`;
}).join(',\n');

// 2. Read existing indianPlacesData.ts
const indianPlacesPath = './src/data/indianPlacesData.ts';
let indianPlacesCode = fs.readFileSync(indianPlacesPath, 'utf8');

// Replace IndianPlaceRaw interface
indianPlacesCode = indianPlacesCode.replace(
  /export interface IndianPlaceRaw \{[\s\S]*?\}/,
  `export interface IndianPlaceRaw {
  state: string;
  place: string;
  significance: string;
  imageUrl: string;
  wikiTitle?: string;
}`
);

// Replace RAW_INDIAN_PLACES definition
const rawStartMarker = 'export const RAW_INDIAN_PLACES: IndianPlaceRaw[] = [';
const rawStartIndex = indianPlacesCode.indexOf(rawStartMarker);
if (rawStartIndex === -1) {
  throw new Error('Could not find RAW_INDIAN_PLACES start marker in indianPlacesData.ts');
}

// Find matching closing bracket before `// Helper to assign reliable, authentic high-res images` or `export function getPlaceImage`
const getPlaceImgMarker = 'export function getPlaceImage';
const getPlaceImgIndex = indianPlacesCode.indexOf(getPlaceImgMarker);
if (getPlaceImgIndex === -1) {
  throw new Error('Could not find getPlaceImage marker');
}

// Extract before RAW_INDIAN_PLACES and after RAW_INDIAN_PLACES
const beforeRaw = indianPlacesCode.slice(0, rawStartIndex);
const afterRaw = indianPlacesCode.slice(getPlaceImgIndex);

const updatedPlacesCode = `${beforeRaw}export const RAW_INDIAN_PLACES: IndianPlaceRaw[] = [\n${rawPlacesCode}\n];\n\n// Fast lookup map of authentic Wikipedia images by place name\nexport const WIKI_PLACE_IMAGES: Record<string, string> = {\n${enriched.map(x => `  ${JSON.stringify(x.place.toLowerCase())}: ${JSON.stringify(x.imageUrl)}`).join(',\n')}\n};\n\n${afterRaw}`;

// In getPlaceImage, prepend lookup from WIKI_PLACE_IMAGES and RAW_INDIAN_PLACES
const updatedGetPlaceImage = updatedPlacesCode.replace(
  'export function getPlaceImage(placeName: string, stateName?: string): string {',
  `export function getPlaceImage(placeName: string, stateName?: string): string {
  const p = (placeName || '').toLowerCase().trim();
  
  // Direct match from verified Wikipedia dataset
  if (WIKI_PLACE_IMAGES[p]) {
    return WIKI_PLACE_IMAGES[p];
  }
  for (const [key, url] of Object.entries(WIKI_PLACE_IMAGES)) {
    if (p.includes(key) || key.includes(p)) {
      return url;
    }
  }`
);

// In INDIAN_DESTINATIONS, ensure imageUrl uses item.imageUrl first
const finalIndianPlacesCode = updatedGetPlaceImage.replace(
  'imageUrl: getPlaceImage(item.place, item.state),',
  'imageUrl: item.imageUrl || getPlaceImage(item.place, item.state),'
);

fs.writeFileSync(indianPlacesPath, finalIndianPlacesCode, 'utf8');
console.log('Successfully updated src/data/indianPlacesData.ts!');
