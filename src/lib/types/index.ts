/**
 * AI Zhanxing - Core Type Definitions
 *
 * Types for astrology (Ziwei Doushu, Western Astrology) and tarot readings
 */

// ==================== Reading Types ====================

/** Types of divination readings supported */
export type ReadingType = 'ziwei' | 'western' | 'tarot';

/** Reading status */
export type ReadingStatus = 'pending' | 'processing' | 'completed' | 'error';

// ==================== Common Types ====================

/** Gender */
export type Gender = 'male' | 'female';

/** Calendar type for birth data */
export type CalendarType = 'solar' | 'lunar';

/** Basic birth information shared across reading types */
export interface BirthInfo {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute?: number;
  gender: Gender;
  calendarType?: CalendarType;
  timezone?: string;
  location?: {
    city?: string;
    latitude?: number;
    longitude?: number;
  };
}

// ==================== Ziwei Doushu Types ====================

/** Ziwei Doushu Palace names */
export type ZiweiPalace =
  | '命宫' | '兄弟宫' | '夫妻宫' | '子女宫'
  | '财帛宫' | '疾厄宫' | '迁移宫' | '交友宫'
  | '事业宫' | '田宅宫' | '福德宫' | '父母宫';

/** Ziwei major stars */
export type ZiweiMainStar =
  | '紫微' | '天机' | '太阳' | '武曲' | '天同' | '廉贞'
  | '天府' | '太阴' | '贪狼' | '巨门' | '天相' | '天梁'
  | '七杀' | '破军';

/** Palace data structure */
export interface ZiweiPalaceData {
  name: ZiweiPalace;
  earthlyBranch: string;
  mainStars: ZiweiMainStar[];
  auxiliaryStars: string[];
  transformations?: string[];
}

/** Ziwei chart structure */
export interface ZiweiChart {
  birthInfo: BirthInfo;
  palaces: ZiweiPalaceData[];
  mingGong: ZiweiPalace;
  shenGong: ZiweiPalace;
  bodyPalace: ZiweiPalace;
  lifeElement: string;
  bodyElement: string;
}

// ==================== Western Astrology Types ====================

/** Zodiac signs */
export type ZodiacSign =
  | 'aries' | 'taurus' | 'gemini' | 'cancer'
  | 'leo' | 'virgo' | 'libra' | 'scorpio'
  | 'sagittarius' | 'capricorn' | 'aquarius' | 'pisces';

/** Astrological houses */
export type AstroHouse = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

/** Planets */
export type Planet =
  | 'sun' | 'moon' | 'mercury' | 'venus' | 'mars'
  | 'jupiter' | 'saturn' | 'uranus' | 'neptune' | 'pluto'
  | 'ascendant' | 'midheaven' | 'north_node' | 'chiron';

/** Aspect types */
export type AspectType =
  | 'conjunction' | 'opposition' | 'trine' | 'square' | 'sextile'
  | 'quincunx' | 'semisextile' | 'semisquare' | 'sesquiquadrate';

/** Planet position in chart */
export interface PlanetPosition {
  planet: Planet;
  sign: ZodiacSign;
  house: AstroHouse;
  degree: number;
  minute: number;
  retrograde: boolean;
}

/** Aspect between planets */
export interface Aspect {
  planet1: Planet;
  planet2: Planet;
  type: AspectType;
  orb: number;
  applying: boolean;
}

/** Western astrology birth chart */
export interface WesternChart {
  birthInfo: BirthInfo;
  positions: PlanetPosition[];
  aspects: Aspect[];
  houseCusps: Record<AstroHouse, { sign: ZodiacSign; degree: number }>;
  ascendant: { sign: ZodiacSign; degree: number };
  midheaven: { sign: ZodiacSign; degree: number };
}

// ==================== Tarot Types ====================

/** Major Arcana cards */
export type MajorArcana =
  | 'fool' | 'magician' | 'high_priestess' | 'empress' | 'emperor'
  | 'hierophant' | 'lovers' | 'chariot' | 'strength' | 'hermit'
  | 'wheel_of_fortune' | 'justice' | 'hanged_man' | 'death'
  | 'temperance' | 'devil' | 'tower' | 'star' | 'moon' | 'sun'
  | 'judgement' | 'world';

/** Minor Arcana suits */
export type TarotSuit = 'wands' | 'cups' | 'swords' | 'pentacles';

/** Minor Arcana ranks */
export type TarotRank = 'ace' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'page' | 'knight' | 'queen' | 'king';

/** Card orientation */
export type CardOrientation = 'upright' | 'reversed';

/** Individual tarot card */
export interface TarotCard {
  id: string;
  name: string;
  isMajor: boolean;
  suit?: TarotSuit;
  rank?: TarotRank;
  majorArcana?: MajorArcana;
  orientation: CardOrientation;
  position?: string; // e.g., "Past", "Present", "Future"
  positionMeaning?: string;
}

/** Spread types */
export type TarotSpreadType = 'single' | 'three_card' | 'celtic_cross' | 'horseshoe' | 'custom';

/** Tarot reading structure */
export interface TarotReading {
  spreadType: TarotSpreadType;
  question?: string;
  cards: TarotCard[];
  timestamp: Date;
}

// ==================== Reading Result Types ====================

/** Base reading result */
export interface BaseReading {
  id: string;
  type: ReadingType;
  status: ReadingStatus;
  createdAt: Date;
  updatedAt: Date;
  userId?: string;
}

/** Ziwei reading result */
export interface ZiweiReading extends BaseReading {
  type: 'ziwei';
  chart: ZiweiChart;
  interpretation?: string;
}

/** Western astrology reading result */
export interface WesternReading extends BaseReading {
  type: 'western';
  chart: WesternChart;
  interpretation?: string;
}

/** Tarot reading result */
export interface TarotReadingResult extends BaseReading {
  type: 'tarot';
  reading: TarotReading;
  interpretation?: string;
}

/** Union type for all readings */
export type Reading = ZiweiReading | WesternReading | TarotReadingResult;

// ==================== Interpretation Types ====================

/** Interpretation section */
export interface InterpretationSection {
  title: string;
  content: string;
  rating?: number; // 1-10 scale
  tags?: string[];
}

/** Full interpretation structure */
export interface Interpretation {
  summary: string;
  sections: InterpretationSection[];
  advice?: string;
  warnings?: string[];
  luckyElements?: {
    colors?: string[];
    numbers?: number[];
    directions?: string[];
    timeFrames?: string[];
  };
}

// ==================== API Types ====================

/** Reading request */
export interface ReadingRequest {
  type: ReadingType;
  birthInfo?: BirthInfo;
  question?: string; // For tarot
  spreadType?: TarotSpreadType; // For tarot
}

/** Reading response */
export interface ReadingResponse {
  success: boolean;
  data?: Reading;
  interpretation?: Interpretation;
  error?: string;
}

// ==================== User Types ====================

/** User credits state */
export interface CreditsState {
  credits: number;
  checkedInToday: boolean;
}

/** Save limit state */
export interface SaveLimitState {
  used: number;
  max: number;
}
