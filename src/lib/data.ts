import fs from 'fs';
import path from 'path';
import type { Meme } from '@/types';

// Data types
export interface DailyQuote {
  id: string;
  quote: string;
  author?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface Reason {
  id: string;
  title: string;
  description: string;
  order?: number;
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
  title: string;
  description: string;
  date: string;
  imageUrl?: string;
}

export interface FutureDream {
  id: string;
  title: string;
  description: string;
  category: 'dreams' | 'plans' | 'goals' | 'together';
  order: number;
  imageUrl?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Ritual {
  id: string;
  title: string;
  description: string;
  type: 'joke' | 'phrase' | 'tradition';
  createdAt: string;
  updatedAt?: string;
}

// Data file paths
const dataDir = path.join(process.cwd(), 'src', 'data');

const ensureDataDir = () => {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

const getDataFilePath = (filename: string) => path.join(dataDir, filename);

// Cache for faster access
const dataCache = new Map<string, any>();

// Helper functions
const readData = <T>(filename: string): T[] => {
  // Check cache first
  if (dataCache.has(filename)) {
    return dataCache.get(filename);
  }

  ensureDataDir();
  const filePath = getDataFilePath(filename);
  
  if (!fs.existsSync(filePath)) {
    return [];
  }
  
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    const parsedData = JSON.parse(data) || [];
    
    // Cache the data
    dataCache.set(filename, parsedData);
    
    return parsedData;
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return [];
  }
};

const writeData = <T>(filename: string, data: T[]): void => {
  ensureDataDir();
  const filePath = getDataFilePath(filename);
  
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    // Update cache
    dataCache.set(filename, data);
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    throw error;
  }
};

// Clear cache when data is updated
const clearCache = (filename: string) => {
  dataCache.delete(filename);
};

// Daily Quotes
export const getDailyQuotes = (): DailyQuote[] => {
  return readData<DailyQuote>('daily-quotes.json');
};

export const addDailyQuote = (quote: Omit<DailyQuote, 'id'>): DailyQuote => {
  const quotes = getDailyQuotes();
  const newQuote: DailyQuote = {
    ...quote,
    id: Date.now().toString()
  };
  quotes.push(newQuote);
  writeData('daily-quotes.json', quotes);
  return newQuote;
};

export const updateDailyQuote = (id: string, quote: Partial<DailyQuote>): DailyQuote => {
  const quotes = getDailyQuotes();
  const index = quotes.findIndex(q => q.id === id);
  
  if (index === -1) {
    throw new Error('Quote not found');
  }
  
  quotes[index] = { ...quotes[index], ...quote };
  writeData('daily-quotes.json', quotes);
  return quotes[index];
};

export const deleteDailyQuote = (id: string): void => {
  const quotes = getDailyQuotes();
  const filteredQuotes = quotes.filter(q => q.id !== id);
  writeData('daily-quotes.json', filteredQuotes);
};

// Reasons
export const getReasons = (): Reason[] => {
  return readData<Reason>('reasons.json');
};

export const addReason = (reason: Omit<Reason, 'id'>): Reason => {
  const reasons = getReasons();
  const newReason: Reason = {
    ...reason,
    id: Date.now().toString()
  };
  reasons.push(newReason);
  writeData('reasons.json', reasons);
  return newReason;
};

export const updateReason = (id: string, reason: Partial<Reason>): Reason => {
  const reasons = getReasons();
  const index = reasons.findIndex(r => r.id === id);
  
  if (index === -1) {
    throw new Error('Reason not found');
  }
  
  reasons[index] = { ...reasons[index], ...reason };
  writeData('reasons.json', reasons);
  return reasons[index];
};

export const deleteReason = (id: string): void => {
  const reasons = getReasons();
  const filteredReasons = reasons.filter(r => r.id !== id);
  writeData('reasons.json', filteredReasons);
};

// Feelings
export const getFeelings = (): Feeling[] => {
  return readData<Feeling>('feelings.json');
};

export const addFeeling = (feeling: Omit<Feeling, 'id'>): Feeling => {
  const feelings = getFeelings();
  const newFeeling: Feeling = {
    ...feeling,
    id: Date.now().toString()
  };
  feelings.push(newFeeling);
  writeData('feelings.json', feelings);
  return newFeeling;
};

export const updateFeeling = (id: string, feeling: Partial<Feeling>): Feeling => {
  const feelings = getFeelings();
  const index = feelings.findIndex(f => f.id === id);
  
  if (index === -1) {
    throw new Error('Feeling not found');
  }
  
  feelings[index] = { ...feelings[index], ...feeling };
  writeData('feelings.json', feelings);
  return feelings[index];
};

export const deleteFeeling = (id: string): void => {
  const feelings = getFeelings();
  const filteredFeelings = feelings.filter(f => f.id !== id);
  writeData('feelings.json', filteredFeelings);
};

// Timeline
export const getTimeline = (): TimelineEvent[] => {
  return readData<TimelineEvent>('timeline.json');
};

export const addTimelineEvent = (event: Omit<TimelineEvent, 'id'>): TimelineEvent => {
  const timeline = getTimeline();
  const newEvent: TimelineEvent = {
    ...event,
    id: Date.now().toString()
  };
  timeline.push(newEvent);
  writeData('timeline.json', timeline);
  return newEvent;
};

export const updateTimelineEvent = (id: string, event: Partial<TimelineEvent>): TimelineEvent => {
  const timeline = getTimeline();
  const index = timeline.findIndex(t => t.id === id);
  
  if (index === -1) {
    throw new Error('Timeline event not found');
  }
  
  timeline[index] = { ...timeline[index], ...event };
  writeData('timeline.json', timeline);
  return timeline[index];
};

export const deleteTimelineEvent = (id: string): void => {
  const timeline = getTimeline();
  const filteredTimeline = timeline.filter(t => t.id !== id);
  writeData('timeline.json', filteredTimeline);
};

// Future Dreams
export const getFutureDreams = (): FutureDream[] => {
  return readData<FutureDream>('future.json');
};

export const addFutureDream = (dream: Omit<FutureDream, 'id'>): FutureDream => {
  const dreams = getFutureDreams();
  const newDream: FutureDream = {
    ...dream,
    id: Date.now().toString()
  };
  dreams.push(newDream);
  writeData('future.json', dreams);
  return newDream;
};

export const updateFutureDream = (id: string, dream: Partial<FutureDream>): FutureDream => {
  const dreams = getFutureDreams();
  const index = dreams.findIndex(d => d.id === id);
  
  if (index === -1) {
    throw new Error('Future dream not found');
  }
  
  dreams[index] = { ...dreams[index], ...dream };
  writeData('future.json', dreams);
  return dreams[index];
};

export const deleteFutureDream = (id: string): void => {
  const dreams = getFutureDreams();
  const filteredDreams = dreams.filter(d => d.id !== id);
  writeData('future.json', filteredDreams);
};

// Rituals
export const getRituals = (): Ritual[] => {
  return readData<Ritual>('rituals.json');
};

export const addRitual = (ritual: Omit<Ritual, 'id'>): Ritual => {
  const rituals = getRituals();
  const newRitual: Ritual = {
    ...ritual,
    id: Date.now().toString()
  };
  rituals.push(newRitual);
  writeData('rituals.json', rituals);
  return newRitual;
};

export const updateRitual = (id: string, ritual: Partial<Ritual>): Ritual => {
  const rituals = getRituals();
  const index = rituals.findIndex(r => r.id === id);
  
  if (index === -1) {
    throw new Error('Ritual not found');
  }
  
  rituals[index] = { ...rituals[index], ...ritual };
  writeData('rituals.json', rituals);
  return rituals[index];
};

export const deleteRitual = (id: string): void => {
  const rituals = getRituals();
  const filteredRituals = rituals.filter(r => r.id !== id);
  writeData('rituals.json', filteredRituals);
};

// Letters (by category)
export interface Letter {
  id: string;
  category: 'sad' | 'doubt' | 'distance' | 'argument' | 'happy';
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export const getLetters = (): Letter[] => {
  return readData<Letter>('letters.json');
};

export const addLetter = (letter: Omit<Letter, 'id'>): Letter => {
  const letters = getLetters();
  const newLetter: Letter = {
    ...letter,
    id: Date.now().toString(),
  };
  letters.push(newLetter);
  writeData('letters.json', letters);
  return newLetter;
};

export const updateLetter = (id: string, letter: Partial<Letter>): Letter => {
  const letters = getLetters();
  const index = letters.findIndex(l => l.id === id);
  if (index === -1) throw new Error('Letter not found');
  letters[index] = { ...letters[index], ...letter, updatedAt: new Date().toISOString() };
  writeData('letters.json', letters);
  return letters[index];
};

export const deleteLetter = (id: string): void => {
  const letters = getLetters().filter(l => l.id !== id);
  writeData('letters.json', letters);
};

// Memes
export const getMemes = (): Meme[] => {
  const raw = readData<Meme & { type?: string }>('memes.json');
  return raw.map(m => ({ ...m, type: m.type === 'reel' ? 'reel' : 'image' }));
};

export const addMeme = (meme: Omit<Meme, 'id'>): Meme => {
  const list = getMemes();
  const newMeme: Meme = { ...meme, id: Date.now().toString() };
  list.push(newMeme);
  writeData('memes.json', list);
  return newMeme;
};

export const updateMeme = (id: string, meme: Partial<Meme>): Meme => {
  const list = getMemes();
  const i = list.findIndex(m => m.id === id);
  if (i === -1) throw new Error('Meme not found');
  list[i] = { ...list[i], ...meme, updatedAt: new Date().toISOString() };
  writeData('memes.json', list);
  return list[i];
};

export const deleteMeme = (id: string): void => {
  writeData('memes.json', getMemes().filter(m => m.id !== id));
};

// Puns (каламбуры)
export interface Pun {
  id: string;
  text: string;
  category?: string;
  createdAt: string;
  updatedAt?: string;
}

export const getPuns = (): Pun[] => readData<Pun>('puns.json');

export const addPun = (pun: Omit<Pun, 'id'>): Pun => {
  const list = getPuns();
  const newPun: Pun = { ...pun, id: Date.now().toString() };
  list.push(newPun);
  writeData('puns.json', list);
  return newPun;
};

export const updatePun = (id: string, pun: Partial<Pun>): Pun => {
  const list = getPuns();
  const i = list.findIndex(p => p.id === id);
  if (i === -1) throw new Error('Pun not found');
  list[i] = { ...list[i], ...pun, updatedAt: new Date().toISOString() };
  writeData('puns.json', list);
  return list[i];
};

export const deletePun = (id: string): void => {
  writeData('puns.json', getPuns().filter(p => p.id !== id));
};

// Data types for file-based storage
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
  updatedAt?: string;
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

export interface CrisisSupport {
  id: string;
  title: string;
  content: string;
  severity: 'mild' | 'moderate' | 'severe';
  order: number;
  createdAt: string;
  updatedAt?: string;
}

export interface DistanceMessage {
  id: string;
  title: string;
  content: string;
  order: number;
  createdAt: string;
  updatedAt?: string;
}

export interface FinalLetter {
  id: string;
  content: string;
  lastUpdated: string;
}

// Surprise functions
export const getSurprises = (): Surprise[] => {
  return readData<Surprise>('surprises.json');
};

export const addSurprise = (surprise: Omit<Surprise, 'id'>): Surprise => {
  const surprises = getSurprises();
  const newSurprise: Surprise = {
    ...surprise,
    id: Date.now().toString()
  };
  surprises.push(newSurprise);
  writeData('surprises.json', surprises);
  return newSurprise;
};

export const updateSurprise = (id: string, surprise: Partial<Surprise>): Surprise => {
  const surprises = getSurprises();
  const index = surprises.findIndex(s => s.id === id);
  
  if (index === -1) {
    throw new Error('Surprise not found');
  }
  
  surprises[index] = { ...surprises[index], ...surprise };
  writeData('surprises.json', surprises);
  return surprises[index];
};

export const deleteSurprise = (id: string): void => {
  const surprises = getSurprises();
  const filteredSurprises = surprises.filter(s => s.id !== id);
  writeData('surprises.json', filteredSurprises);
};

// Secret Room — только фотографии
export const getSecretRoomPhotos = (): SecretRoomPhoto[] => {
  return readData<SecretRoomPhoto>('secret-room.json');
};

export const addSecretRoomPhotos = (urls: string[]): SecretRoomPhoto[] => {
  const photos = getSecretRoomPhotos();
  const now = Date.now();
  urls.forEach((url, i) => {
    photos.push({ id: `${now}-${i}`, url });
  });
  writeData('secret-room.json', photos);
  return photos;
};

export const deleteSecretRoomPhoto = (id: string): void => {
  const photos = getSecretRoomPhotos().filter(p => p.id !== id);
  writeData('secret-room.json', photos);
};

// Crisis Support functions
export const getCrisisSupport = (): CrisisSupport[] => {
  return readData<CrisisSupport>('crisis.json');
};

export const addCrisisSupport = (support: Omit<CrisisSupport, 'id'>): CrisisSupport => {
  const supports = getCrisisSupport();
  const newSupport: CrisisSupport = {
    ...support,
    id: Date.now().toString()
  };
  supports.push(newSupport);
  writeData('crisis.json', supports);
  return newSupport;
};

export const updateCrisisSupport = (id: string, support: Partial<CrisisSupport>): CrisisSupport => {
  const supports = getCrisisSupport();
  const index = supports.findIndex(s => s.id === id);
  
  if (index === -1) {
    throw new Error('Crisis support not found');
  }
  
  supports[index] = { ...supports[index], ...support };
  writeData('crisis.json', supports);
  return supports[index];
};

export const deleteCrisisSupport = (id: string): void => {
  const supports = getCrisisSupport();
  const filteredSupports = supports.filter(s => s.id !== id);
  writeData('crisis.json', filteredSupports);
};

// Distance Messages functions
export const getDistanceMessages = (): DistanceMessage[] => {
  return readData<DistanceMessage>('distance.json');
};

export const addDistanceMessage = (message: Omit<DistanceMessage, 'id'>): DistanceMessage => {
  const messages = getDistanceMessages();
  const newMessage: DistanceMessage = {
    ...message,
    id: Date.now().toString()
  };
  messages.push(newMessage);
  writeData('distance.json', messages);
  return newMessage;
};

export const updateDistanceMessage = (id: string, message: Partial<DistanceMessage>): DistanceMessage => {
  const messages = getDistanceMessages();
  const index = messages.findIndex(m => m.id === id);
  
  if (index === -1) {
    throw new Error('Distance message not found');
  }
  
  messages[index] = { ...messages[index], ...message };
  writeData('distance.json', messages);
  return messages[index];
};

export const deleteDistanceMessage = (id: string): void => {
  const messages = getDistanceMessages();
  const filteredMessages = messages.filter(m => m.id !== id);
  writeData('distance.json', filteredMessages);
};

// Final Letter functions
export const getFinalLetter = (): FinalLetter | null => {
  const letters = readData<FinalLetter>('final-letter.json');
  return letters.length > 0 ? letters[0] : null;
};

export const addFinalLetter = (letter: Omit<FinalLetter, 'id'>): FinalLetter => {
  const newLetter: FinalLetter = {
    ...letter,
    id: Date.now().toString()
  };
  writeData('final-letter.json', [newLetter]);
  return newLetter;
};

export const updateFinalLetter = (letter: Partial<FinalLetter>): FinalLetter => {
  const currentLetter = getFinalLetter();
  if (!currentLetter) {
    throw new Error('Final letter not found');
  }
  
  const updatedLetter: FinalLetter = {
    ...currentLetter,
    ...letter,
    lastUpdated: new Date().toISOString()
  };
  writeData('final-letter.json', [updatedLetter]);
  return updatedLetter;
};

// Initialize with sample data if files don't exist
export const initializeSampleData = () => {
  ensureDataDir();
  
  // Check if files exist, if not create with sample data
  const files = [
    { name: 'daily-quotes.json', data: [] },
    { name: 'reasons.json', data: [] },
    { name: 'feelings.json', data: [] },
    { name: 'letters.json', data: [] },
    { name: 'timeline.json', data: [] },
    { name: 'future.json', data: [] },
    { name: 'rituals.json', data: [] },
    { name: 'surprises.json', data: [] },
    { name: 'secret-room.json', data: [] },
    { name: 'crisis.json', data: [] },
    { name: 'distance.json', data: [] },
    { name: 'final-letter.json', data: [] },
    { name: 'memes.json', data: [] },
    { name: 'puns.json', data: [] }
  ];
  
  files.forEach(({ name, data }) => {
    const filePath = getDataFilePath(name);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    }
  });
};

// Call initialization
initializeSampleData();
