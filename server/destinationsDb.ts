import fs from 'fs';
import path from 'path';

export interface SavedDestination {
  id: string;
  name: string;
  state?: string;
  country: string;
  continent: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  description: string;
  significance?: string;
  bestTimeToVisit: string;
  climate: string;
  startingPrice: number;
  tags: string[];
  featured?: boolean;
  googleMapsUrl: string;
  verifiedByAi: boolean;
  verifiedNotes?: string;
  addedByUser?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'destinations.json');

// Ensure database directory and file exist
function ensureDbFile(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2), 'utf-8');
    }
  } catch (err) {
    console.error('Failed to initialize destinations database file:', err);
  }
}

// Retrieve all saved destinations from persistent file database
export async function getDatabaseDestinations(): Promise<SavedDestination[]> {
  ensureDbFile();
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw) as SavedDestination[];
  } catch (err) {
    console.warn('Error reading destinations database, returning empty list:', err);
    return [];
  }
}

// Insert or update destination in the database
export async function updatePlaceInDatabase(dest: SavedDestination): Promise<{ destination: SavedDestination; isNew: boolean }> {
  ensureDbFile();
  const currentList = await getDatabaseDestinations();
  const now = new Date().toISOString();

  const destNameLower = (dest.name || '').trim().toLowerCase();
  const destStateLower = (dest.state || '').trim().toLowerCase();

  const existingIndex = currentList.findIndex((item) => {
    if (item.id === dest.id) return true;
    const itemNameLower = (item.name || '').trim().toLowerCase();
    const itemStateLower = (item.state || '').trim().toLowerCase();
    return itemNameLower === destNameLower && (itemStateLower === destStateLower || !destStateLower);
  });

  if (existingIndex >= 0) {
    // Update existing record of that place in database
    const existing = currentList[existingIndex];
    const updatedRecord: SavedDestination = {
      ...existing,
      ...dest,
      id: existing.id, // preserve persistent id
      updatedAt: now,
      createdAt: existing.createdAt || now,
    };
    currentList[existingIndex] = updatedRecord;

    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(currentList, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error updating destination record in file database:', err);
    }

    return { destination: updatedRecord, isNew: false };
  } else {
    // Insert new record into database
    const newRecord: SavedDestination = {
      ...dest,
      createdAt: now,
      updatedAt: now,
    };
    currentList.unshift(newRecord);

    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(currentList, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error inserting new destination record into file database:', err);
    }

    return { destination: newRecord, isNew: true };
  }
}
