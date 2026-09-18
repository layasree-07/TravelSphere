export type CategoryType = 'All' | 'Adventure' | 'Cultural' | 'Luxury' | 'Romantic' | 'Wildlife' | 'Beach' | 'Spiritual' | 'Nature';

export interface ItineraryDay {
  day: number;
  title: string;
  activities: string;
  meals: string;
  stay: string;
}

export interface TourPackage {
  id: string;
  title: string;
  destinationId: string;
  destinationName: string;
  country: string;
  region: string;
  durationDays: number;
  durationNights: number;
  price: number;
  originalPrice?: number;
  category: CategoryType;
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  itinerary: ItineraryDay[];
  rating: number;
  reviewsCount: number;
  image: string;
  availableDates: string[];
  maxGuests: number;
  difficulty?: 'Easy' | 'Moderate' | 'Challenging';
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  state?: string;
  continent: 'Asia' | 'Europe' | 'Africa' | 'Americas' | 'Oceania';
  imageUrl: string;
  rating: number;
  reviewCount: number;
  description: string;
  significance?: string;
  bestTimeToVisit: string;
  climate: string;
  startingPrice: number;
  tags: string[];
  featured: boolean;
  googleMapsUrl?: string;
  verifiedByAi?: boolean;
  verifiedNotes?: string;
  addedByUser?: boolean;
}

export interface PlaceVerificationResult {
  isValid: boolean;
  confidence: number;
  verificationStatus: 'VERIFIED_ACCURATE' | 'CORRECTIONS_SUGGESTED' | 'INVALID_OR_NOT_FOUND';
  placeName: string;
  state: string;
  country: string;
  significance: string;
  userSignificanceAnalysis?: {
    status: 'VERIFIED_ACCURATE' | 'MISMATCH_DETECTED' | 'MISSING_OR_VAGUE' | 'INVALID';
    feedback: string;
    suggestedSignificance?: string;
  };
  googleMapsUrl: string;
  suggestedTags: string[];
  suggestedSeason?: string;
  suggestedClimate?: string;
  aiExplanation: string;
  correctedPlaceName?: string;
  correctedState?: string;
  corrections?: string;
  suggestedImageUrl?: string;
}

export interface LeadTraveler {
  fullName: string;
  email: string;
  phone: string;
  nationality: string;
}

export interface Booking {
  id: string; // e.g. TS-2026-4821
  packageId: string;
  packageTitle: string;
  destinationName: string;
  country: string;
  imageUrl: string;
  travelDate: string;
  travelersCount: number;
  leadTraveler: LeadTraveler;
  totalAmount: number;
  status: 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled';
  paymentMethod: 'Credit Card' | 'PayPal' | 'UPI / NetBanking';
  paymentStatus: 'Paid' | 'Refunded';
  transactionId: string;
  bookingDate: string;
  specialRequests?: string;
}

export interface DbTableColumn {
  name: string;
  type: string;
  isKey?: boolean;
  nullable?: boolean;
}

export interface DbTableSchema {
  tableName: string;
  description: string;
  columns: DbTableColumn[];
}
