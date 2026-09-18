export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  phone?: string;
  nationality?: string;
  memberTier: 'Explorer' | 'Silver' | 'Gold' | 'Platinum';
  joinedDate: string;
}

export interface VisitedPlaceRecord {
  id: string;
  userId: string;
  userEmail: string;
  destinationId: string;
  destinationName: string;
  state?: string;
  country: string;
  imageUrl?: string;
  visitedDate: string;
  rating?: number; // 1 to 5
  notes?: string;
  createdAt: string;
}
