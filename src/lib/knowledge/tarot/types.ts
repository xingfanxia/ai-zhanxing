/**
 * Tarot Knowledge Base Type Definitions
 * Trilingual support: English, Chinese (Simplified), Japanese
 */

/** Multilingual text support for en/zh/ja */
export interface MultilingualText {
  en: string;
  zh: string;
  ja: string;
}

/** Yes/No tendency for card interpretations */
export type YesNoTendency = 'Yes' | 'No' | 'Maybe' | 'Strong Yes';

/** Tarot card suits */
export type Suit = 'wands' | 'cups' | 'swords' | 'pentacles';

/** Arcana types */
export type ArcanaType = 'major' | 'minor';

/** Court card ranks */
export type CourtRank = 'page' | 'knight' | 'queen' | 'king';

/** Elements */
export type Element = 'fire' | 'water' | 'air' | 'earth';

/** Astrological correspondences */
export interface AstrologyInfo {
  ruling: string;
  element: Element;
  decan?: string;
  dates?: string;
}

/** Numerology information */
export interface NumerologyInfo {
  number: number;
  meaning: string;
}

/** Context-specific interpretations */
export interface ContextInterpretation {
  upright: string;
  reversed: string;
}

/** Complete Tarot card definition */
export interface TarotCard {
  number: number;
  name: MultilingualText;
  arcana: ArcanaType;
  suit?: Suit;
  keywords: string[];
  upright: string;
  reversed: string;
  astrology: AstrologyInfo;
  numerology: NumerologyInfo;
  symbols: string[];
  love: ContextInterpretation;
  career: ContextInterpretation;
  health: string;
  yesNo: YesNoTendency;
  advice: string;
}

/** Minor Arcana card (simplified for numbered cards) */
export interface MinorArcanaCard {
  number: number;
  name: MultilingualText;
  arcana: 'minor';
  suit: Suit;
  keywords: string[];
  upright: string;
  reversed: string;
  decan: string;
  yesNo: YesNoTendency;
}

/** Court card definition */
export interface CourtCard extends MinorArcanaCard {
  rank: CourtRank;
  personality: string;
}

/** Spread position definition */
export interface SpreadPosition {
  number: number;
  name: MultilingualText;
  meaning: string;
}

/** Three card spread variation */
export interface ThreeCardVariation {
  name: MultilingualText;
  positions: SpreadPosition[];
}

/** Tarot spread definition */
export interface TarotSpread {
  id: string;
  name: MultilingualText;
  cardCount: number;
  positions: SpreadPosition[];
  bestFor: string[];
  description?: MultilingualText;
}

/** Three card spread with variations */
export interface ThreeCardSpread extends Omit<TarotSpread, 'positions'> {
  variations: ThreeCardVariation[];
}

/** Yes/No spread methods */
export interface YesNoSpread {
  id: string;
  name: MultilingualText;
  cardCount: string;
  methods: {
    singleCard: { upright: string; reversed: string };
    threeCard: { majorityUpright: string; majorityReversed: string };
  };
  yesCards: string[];
  noCards: string[];
  maybeCards: string[];
  bestFor: string[];
}

/** Complete knowledge base structure */
export interface TarotKnowledgeBase {
  majorArcana: TarotCard[];
  minorArcana: {
    wands: MinorArcanaCard[];
    cups: MinorArcanaCard[];
    swords: MinorArcanaCard[];
    pentacles: MinorArcanaCard[];
  };
  spreads: (TarotSpread | ThreeCardSpread | YesNoSpread)[];
  terminology: Record<string, MultilingualText>;
}
