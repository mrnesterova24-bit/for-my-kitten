import fs from 'fs';
import path from 'path';

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
  text: string;
  date: string;
}

export interface Feeling {
  id: string;
  title: string;
  description: string;
  date: string;
  imageUrl?: string;
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

// Helper functions
const readData = <T>(filename: string): T[] => {
  ensureDataDir();
  const filePath = getDataFilePath(filename);
  
  if (!fs.existsSync(filePath)) {
    return [];
  }
  
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data) || [];
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
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    throw error;
  }
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

// Initialize with sample data if files don't exist
export const initializeSampleData = () => {
  ensureDataDir();
  
  // Check if files exist, if not create with sample data
  const files = [
    { name: 'daily-quotes.json', data: [] },
    { name: 'reasons.json', data: [] },
    { name: 'feelings.json', data: [] },
    { name: 'timeline.json', data: [] },
    { name: 'future.json', data: [] },
    { name: 'rituals.json', data: [] }
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