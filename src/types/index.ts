import { Timestamp } from 'firebase/firestore';

export type UserRole = 'admin' | 'user';

export interface User {
  uid: string;
  email: string;
  role: UserRole;
  displayName?: string;
  createdAt: Timestamp;
}

export interface Letter {
  id: string;
  category: 'sad' | 'doubt' | 'distance' | 'argument' | 'happy';
  title: string;
  content: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ReasonCard {
  id: string;
  title: string;
  description: string;
  order: number;
  createdAt: Timestamp;
}

export interface Reason {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

export interface FeelingArticle {
  id: string;
  title: string;
  content: string;
  emotionType: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  imageUrl?: string;
  order: number;
  createdAt: Timestamp;
}

export interface FutureDream {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl?: string;
  order: number;
  createdAt: Timestamp;
}

export interface Surprise {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  unlockDate?: Timestamp;
  isUnlocked: boolean;
  clickCount?: number;
  clicksToUnlock?: number;
  createdAt: Timestamp;
}

export interface SecretRoomContent {
  id: string;
  title: string;
  content: string;
  mediaUrls: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
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
  createdAt: Timestamp;
}

export interface CrisisSupport {
  id: string;
  title: string;
  content: string;
  severity: 'mild' | 'moderate' | 'severe';
  order: number;
  createdAt: Timestamp;
}

export interface FinalLetter {
  id: string;
  content: string;
  lastUpdated: Timestamp;
}

export interface DailyQuote {
  id: string;
  quote: string;
  author?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}
