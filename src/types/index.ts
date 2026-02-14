export type UserRole = 'admin' | 'user';

export interface User {
  uid: string;
  email: string;
  role: UserRole;
  displayName?: string;
  createdAt: string;
}

export interface Letter {
  id: string;
  category: 'sad' | 'doubt' | 'distance' | 'argument' | 'happy';
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReasonCard {
  id: string;
  title: string;
  description: string;
  order: number;
  createdAt: string;
}

export interface Reason {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Feeling {
  id: string;
  title: string;
  content: string;
  emotionType: string;
  createdAt: string;
  updatedAt?: string;
}

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  imageUrl?: string;
  order: number;
  createdAt: string;
}

export interface FutureDream {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl?: string;
  order: number;
  createdAt: string;
}

export interface Surprise {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  unlockDate?: string;
  isUnlocked: boolean;
  clickCount?: number;
  clicksToUnlock?: number;
  createdAt: string;
}

export interface SecretRoomContent {
  id: string;
  title: string;
  content: string;
  mediaUrls: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface SecretRoomPhoto {
  id: string;
  url: string;
}

export interface Ritual {
  id: string;
  title: string;
  description: string;
  type: 'joke' | 'phrase' | 'tradition';
  createdAt: string;
  updatedAt?: string;
}

export interface DistanceMessage {
  id: string;
  title: string;
  content: string;
  order: number;
  createdAt: string;
}

export interface CrisisSupport {
  id: string;
  title: string;
  content: string;
  severity: 'mild' | 'moderate' | 'severe';
  order: number;
  createdAt: string;
}

export interface FinalLetter {
  id: string;
  content: string;
  lastUpdated: string;
}

export interface DailyQuote {
  id: string;
  quote: string;
  author?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface Meme {
  id: string;
  type: 'image' | 'reel';
  title?: string;
  caption?: string;
  imageUrl?: string;
  reelUrl?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Pun {
  id: string;
  text: string;
  category?: string;
  createdAt: string;
  updatedAt?: string;
}
