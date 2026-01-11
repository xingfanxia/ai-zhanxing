/**
 * Tarot Knowledge Base - Main Export
 * Complete 78-card deck with trilingual support (en/zh/ja)
 */

// Type exports
export * from './types';

// Major Arcana (22 cards)
import { majorArcana } from './major-arcana';
import { majorArcanaContinued } from './major-arcana-continued';

// Minor Arcana (56 cards)
import { wandsCards } from './minor-arcana-wands';
import { cupsCards } from './minor-arcana-cups';
import { swordsCards } from './minor-arcana-swords';
import { pentaclesCards } from './minor-arcana-pentacles';

// Spreads
import {
  singleCardSpread,
  threeCardSpread,
  celticCrossSpread,
  relationshipSpread,
  careerSpread,
  yesNoSpread,
  horseshoeSpread,
  allSpreads
} from './spreads';

// Terminology
import {
  CORE_TERMS,
  SUIT_NAMES,
  SUIT_ALTERNATIVES,
  COURT_TITLES,
  ELEMENT_NAMES,
  ELEMENT_SUIT_MAP,
  SUIT_ELEMENT_MAP,
  NUMBER_NAMES,
  YES_NO_TERMS,
  CONTEXT_TERMS,
  TIME_TERMS
} from './terminology';

// Re-export individual modules
export { majorArcana } from './major-arcana';
export { majorArcanaContinued } from './major-arcana-continued';
export { wandsCards } from './minor-arcana-wands';
export { cupsCards } from './minor-arcana-cups';
export { swordsCards } from './minor-arcana-swords';
export { pentaclesCards } from './minor-arcana-pentacles';
export * from './spreads';
export * from './terminology';

/** Complete Major Arcana (cards 0-21) */
export const allMajorArcana = [...majorArcana, ...majorArcanaContinued];

/** Complete Minor Arcana organized by suit */
export const minorArcana = {
  wands: wandsCards,
  cups: cupsCards,
  swords: swordsCards,
  pentacles: pentaclesCards
};

/** All Minor Arcana cards flattened */
export const allMinorArcana = [
  ...wandsCards,
  ...cupsCards,
  ...swordsCards,
  ...pentaclesCards
];

/** Complete 78-card deck */
export const fullDeck = [...allMajorArcana, ...allMinorArcana];

/** Complete spreads collection */
export const spreads = {
  singleCard: singleCardSpread,
  threeCard: threeCardSpread,
  celticCross: celticCrossSpread,
  relationship: relationshipSpread,
  career: careerSpread,
  yesNo: yesNoSpread,
  horseshoe: horseshoeSpread,
  all: allSpreads
};

/** Complete terminology collection */
export const terminology = {
  core: CORE_TERMS,
  suits: SUIT_NAMES,
  suitAlternatives: SUIT_ALTERNATIVES,
  courtTitles: COURT_TITLES,
  elements: ELEMENT_NAMES,
  elementToSuit: ELEMENT_SUIT_MAP,
  suitToElement: SUIT_ELEMENT_MAP,
  numbers: NUMBER_NAMES,
  yesNo: YES_NO_TERMS,
  contexts: CONTEXT_TERMS,
  time: TIME_TERMS
};

/** Complete knowledge base */
export const tarotKnowledgeBase = {
  majorArcana: allMajorArcana,
  minorArcana,
  allCards: fullDeck,
  spreads,
  terminology
};

// Utility functions

/** Get card by number and suit (for minor) or just number (for major) */
export function getCard(number: number, suit?: string) {
  if (!suit) {
    return allMajorArcana.find(c => c.number === number);
  }
  const suitCards = minorArcana[suit as keyof typeof minorArcana];
  return suitCards?.find(c => c.number === number);
}

/** Get all cards of a specific suit */
export function getCardsBySuit(suit: string) {
  return minorArcana[suit as keyof typeof minorArcana] || [];
}

/** Get spread by ID */
export function getSpread(id: string) {
  return allSpreads.find(s => s.id === id);
}

/** Get random card(s) for a reading */
export function drawCards(count: number = 1, allowReversed: boolean = true) {
  const shuffled = [...fullDeck].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map(card => ({
    card,
    reversed: allowReversed ? Math.random() > 0.5 : false
  }));
}

export default tarotKnowledgeBase;
