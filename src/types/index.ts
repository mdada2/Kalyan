export type DayKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat';

export interface DayData {
  openPana: string;
  jodi: string;
  closePana: string;
}

export interface WeekRecord {
  week: string;
  mon: DayData;
  tue: DayData;
  wed: DayData;
  thu: DayData;
  fri: DayData;
  sat: DayData;
}

export type Language = 'mr' | 'en';

export interface FormulaStep {
  title: string;
  calculation: string;
  result: string;
  note?: string;
}

export interface PredictionResult {
  targetDay: DayKey;
  targetWeek: string;
  formulaId: string;
  formulaName: string;
  primaryOTC: number[]; // 4 digits
  confidence: number; // percentage
  strongJodis: string[];
  supportJodis: string[];
  singlePanas: { ank: number; panas: string[] }[];
  doublePanas: { ank: number; panas: string[] }[];
  derivationSteps: FormulaStep[];
  lineAnalysis: string;
  historicalHitRate?: number;
}

export interface BacktestSummary {
  totalTested: number;
  openHits: number;
  closeHits: number;
  otcHits: number; // Either open or close hit
  jodiHits: number;
  panaHits: number;
  otcHitRate: number;
  jodiHitRate: number;
  recentResults: {
    week: string;
    day: DayKey;
    actualJodi: string;
    actualOpenPana: string;
    actualClosePana: string;
    predictedOTC: number[];
    predictedJodis: string[];
    isOtcHit: boolean;
    isJodiHit: boolean;
    hitDetails: string;
  }[];
}

export interface DigitFrequency {
  digit: number;
  openCount: number;
  closeCount: number;
  totalCount: number;
  percentage: number;
  lastSeenDaysAgo: number;
  status: 'hot' | 'cold' | 'normal';
}
