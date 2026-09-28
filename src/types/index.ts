/**
 * Data Model for Unsaid (Section 10 & Section 6)
 * Prototype data structures designed for clean future migration to Supabase/RLS.
 */

export interface UserSettings {
  appLockEnabled: boolean;
  pinCode?: string;
  discreetNotifications: boolean;
  reducedMotion: boolean;
  language: 'en' | 'hi' | 'hinglish';
}

export interface User {
  id: string;
  displayName: string;
  phone: string;
  ageConfirmed: boolean;
  settings: UserSettings;
}

export type PairStatus = 'pending' | 'active' | 'ended';

export interface Pair {
  id: string;
  userA: string;
  userB: string;
  status: PairStatus;
  inviteCode: string;
  createdAt: string;
}

export interface Topic {
  id: string;
  name: string;
  sensitive: boolean;
  order: number;
  description: string;
  gateTitle?: string;
  gateBody?: string;
}

export type QuestionType = 'single' | 'scale' | 'multi';

export interface Question {
  id: string;
  topicId: string;
  text: string;
  type: QuestionType;
  options: string[];
  scaleMin?: number;
  scaleMax?: number;
  scaleLabels?: { min: string; max: string };
  partialCredit?: Record<string, Record<string, number>>;
  allowInPerson: boolean;
  allowPreferNot: boolean;
  suggestedAskText: string;
  suggestedAskTip: string;
  sensitiveTopicGate?: boolean;
}

export interface Answer {
  userId: string;
  questionId: string;
  value?: any; // string | number | string[]
  skipped: boolean;
  inPerson: boolean;
  preferNot: boolean;
  importance: 1 | 2 | 3; // Low = 1, Medium = 2, High = 3
  dealbreaker: boolean;
  note?: string;
  noteShared: boolean;
  updatedAt?: string;
}

export interface TopicConsent {
  pairId: string;
  userId: string;
  topicId: string;
  optedIn: boolean;
}

export interface TopicShare {
  userId: string;
  topicId: string;
  showAnswers: boolean;
}

export type CompatibilityBand =
  | 'Strong match'
  | 'Some gaps'
  | 'Talk about this'
  | 'Not answered yet'
  | 'Talk in person';

export interface ChartResult {
  pairId: string;
  topicId: string;
  band: CompatibilityBand;
  coverage: number; // percentage of questions answered (0 to 1)
  alignment: number; // calculated weighted average (0 to 1)
  dealbreakerConflict: boolean;
  flags: string[];
  updatedAfterTalk?: boolean;
}

export type AskStatus = 'suggested' | 'saved' | 'talked' | 'notNow';

export interface AskItem {
  pairId: string;
  questionId: string;
  suggestedText: string;
  tip: string;
  gapScore: number;
  dealbreakerConflict: boolean;
  status: AskStatus;
}

export type ScreenName =
  | 'WELCOME'
  | 'HOW_IT_WORKS'
  | 'PRIVACY_PROMISES'
  | 'SIGN_UP'
  | 'PAIRING'
  | 'CHOOSE_TOPICS'
  | 'HEAVY_GATE'
  | 'QUESTIONNAIRE'
  | 'WAITING_FOR_PARTNER'
  | 'REVEAL'
  | 'COMPATIBILITY_CHART'
  | 'TOPIC_DETAIL'
  | 'ASK_WHAT_MATTERS'
  | 'NEXT_CHAI'
  | 'UPDATE_ANSWERS'
  | 'SETTINGS';
