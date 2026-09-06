export interface EmotionItem {
  name: string;
  intensity: number; // 1-10
}

export interface ReflectionData {
  summary: string;
  emotions: EmotionItem[];
  themes: string[];
  observations: string[];
  possible_patterns: string[];
  reflection_question: string;
  encouragement: string;
}

export interface JournalEntry {
  id: string;
  uid: string;
  content: string;
  createdAt: string; // ISO string
  summary: string;
  emotions: EmotionItem[];
  themes: string[];
  observations: string[];
  possiblePatterns: string[];
  reflectionQuestion: string;
  encouragement: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'echo';
  text: string;
  timestamp: string;
  referencedEntries?: string[];
}

export interface ThemeFrequency {
  theme: string;
  count: number;
  percentage: number;
}

export interface PatternCard {
  id: string;
  title: string;
  explanation: string;
  relatedEntriesCount: number;
  lastObservedDate: string;
}

export interface ThoughtShift {
  topic: string;
  thenQuote: string;
  nowQuote: string;
  explanation: string;
}

export interface PatternsSummary {
  recurringThemes: ThemeFrequency[];
  recentPatterns: PatternCard[];
  biggestShift: ThoughtShift | null;
}

export interface AuthUser {
  uid: string;
  email?: string | null;
  displayName?: string | null;
  isDemo?: boolean;
}

export type ScreenType = 
  | 'landing' 
  | 'auth' 
  | 'journal' 
  | 'reflection' 
  | 'conversation' 
  | 'patterns' 
  | 'history' 
  | 'entry_detail' 
  | 'settings';

