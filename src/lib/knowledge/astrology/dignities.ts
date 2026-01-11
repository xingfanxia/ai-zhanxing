/**
 * Complete Essential Dignities System
 * Contains domiciles, exaltations, detriments, falls, triplicities, terms, and faces
 */

// Type definitions
export type TraditionalPlanet = 'Sun' | 'Moon' | 'Mercury' | 'Venus' | 'Mars' | 'Jupiter' | 'Saturn';
export type SignName = 'Aries' | 'Taurus' | 'Gemini' | 'Cancer' | 'Leo' | 'Virgo' | 'Libra' | 'Scorpio' | 'Sagittarius' | 'Capricorn' | 'Aquarius' | 'Pisces';

// Domicile (Rulership) - Planet at home
export const DOMICILES: Record<TraditionalPlanet, { signs: SignName[]; dayHouse?: SignName; nightHouse?: SignName }> = {
  Sun: { signs: ['Leo'], dayHouse: 'Leo' },
  Moon: { signs: ['Cancer'], nightHouse: 'Cancer' },
  Mercury: { signs: ['Gemini', 'Virgo'], dayHouse: 'Virgo', nightHouse: 'Gemini' },
  Venus: { signs: ['Taurus', 'Libra'], dayHouse: 'Libra', nightHouse: 'Taurus' },
  Mars: { signs: ['Aries', 'Scorpio'], dayHouse: 'Aries', nightHouse: 'Scorpio' },
  Jupiter: { signs: ['Sagittarius', 'Pisces'], dayHouse: 'Sagittarius', nightHouse: 'Pisces' },
  Saturn: { signs: ['Capricorn', 'Aquarius'], dayHouse: 'Aquarius', nightHouse: 'Capricorn' }
};

// Modern rulership additions (for reference)
export const MODERN_RULERS: Record<string, SignName> = {
  Uranus: 'Aquarius',
  Neptune: 'Pisces',
  Pluto: 'Scorpio'
};

// Exaltation - Planet honored/exalted (with exact degree)
export const EXALTATIONS: Record<TraditionalPlanet, { sign: SignName; degree: number }> = {
  Sun: { sign: 'Aries', degree: 19 },
  Moon: { sign: 'Taurus', degree: 3 },
  Mercury: { sign: 'Virgo', degree: 15 },
  Venus: { sign: 'Pisces', degree: 27 },
  Mars: { sign: 'Capricorn', degree: 28 },
  Jupiter: { sign: 'Cancer', degree: 15 },
  Saturn: { sign: 'Libra', degree: 21 }
};

// Detriment - Planet in exile (opposite to domicile)
export const DETRIMENTS: Record<TraditionalPlanet, SignName[]> = {
  Sun: ['Aquarius'],
  Moon: ['Capricorn'],
  Mercury: ['Sagittarius', 'Pisces'],
  Venus: ['Aries', 'Scorpio'],
  Mars: ['Taurus', 'Libra'],
  Jupiter: ['Gemini', 'Virgo'],
  Saturn: ['Cancer', 'Leo']
};

// Fall - Planet debilitated (opposite to exaltation)
export const FALLS: Record<TraditionalPlanet, SignName> = {
  Sun: 'Libra',
  Moon: 'Scorpio',
  Mercury: 'Pisces',
  Venus: 'Virgo',
  Mars: 'Cancer',
  Jupiter: 'Capricorn',
  Saturn: 'Aries'
};

// Triplicity Rulers (Dorothean System)
export interface TriplicityRulers {
  signs: SignName[];
  day: TraditionalPlanet;
  night: TraditionalPlanet;
  participating: TraditionalPlanet;
}

export const TRIPLICITIES: Record<string, TriplicityRulers> = {
  Fire: { signs: ['Aries', 'Leo', 'Sagittarius'], day: 'Sun', night: 'Jupiter', participating: 'Saturn' },
  Earth: { signs: ['Taurus', 'Virgo', 'Capricorn'], day: 'Venus', night: 'Moon', participating: 'Mars' },
  Air: { signs: ['Gemini', 'Libra', 'Aquarius'], day: 'Saturn', night: 'Mercury', participating: 'Jupiter' },
  Water: { signs: ['Cancer', 'Scorpio', 'Pisces'], day: 'Venus', night: 'Mars', participating: 'Moon' }
};

// Egyptian Terms (Bounds) - Complete table
export interface Term {
  end: number;
  ruler: TraditionalPlanet;
}

export const EGYPTIAN_TERMS: Record<SignName, Term[]> = {
  Aries: [{ end: 6, ruler: 'Jupiter' }, { end: 12, ruler: 'Venus' }, { end: 20, ruler: 'Mercury' }, { end: 25, ruler: 'Mars' }, { end: 30, ruler: 'Saturn' }],
  Taurus: [{ end: 8, ruler: 'Venus' }, { end: 14, ruler: 'Mercury' }, { end: 22, ruler: 'Jupiter' }, { end: 27, ruler: 'Saturn' }, { end: 30, ruler: 'Mars' }],
  Gemini: [{ end: 6, ruler: 'Mercury' }, { end: 12, ruler: 'Jupiter' }, { end: 17, ruler: 'Venus' }, { end: 24, ruler: 'Mars' }, { end: 30, ruler: 'Saturn' }],
  Cancer: [{ end: 7, ruler: 'Mars' }, { end: 13, ruler: 'Venus' }, { end: 19, ruler: 'Mercury' }, { end: 26, ruler: 'Jupiter' }, { end: 30, ruler: 'Saturn' }],
  Leo: [{ end: 6, ruler: 'Jupiter' }, { end: 11, ruler: 'Venus' }, { end: 18, ruler: 'Saturn' }, { end: 24, ruler: 'Mercury' }, { end: 30, ruler: 'Mars' }],
  Virgo: [{ end: 7, ruler: 'Mercury' }, { end: 17, ruler: 'Venus' }, { end: 21, ruler: 'Jupiter' }, { end: 28, ruler: 'Mars' }, { end: 30, ruler: 'Saturn' }],
  Libra: [{ end: 6, ruler: 'Saturn' }, { end: 14, ruler: 'Mercury' }, { end: 21, ruler: 'Jupiter' }, { end: 28, ruler: 'Venus' }, { end: 30, ruler: 'Mars' }],
  Scorpio: [{ end: 7, ruler: 'Mars' }, { end: 11, ruler: 'Venus' }, { end: 19, ruler: 'Mercury' }, { end: 24, ruler: 'Jupiter' }, { end: 30, ruler: 'Saturn' }],
  Sagittarius: [{ end: 12, ruler: 'Jupiter' }, { end: 17, ruler: 'Venus' }, { end: 21, ruler: 'Mercury' }, { end: 26, ruler: 'Saturn' }, { end: 30, ruler: 'Mars' }],
  Capricorn: [{ end: 7, ruler: 'Mercury' }, { end: 14, ruler: 'Jupiter' }, { end: 22, ruler: 'Venus' }, { end: 26, ruler: 'Saturn' }, { end: 30, ruler: 'Mars' }],
  Aquarius: [{ end: 7, ruler: 'Mercury' }, { end: 13, ruler: 'Venus' }, { end: 20, ruler: 'Jupiter' }, { end: 25, ruler: 'Mars' }, { end: 30, ruler: 'Saturn' }],
  Pisces: [{ end: 12, ruler: 'Venus' }, { end: 16, ruler: 'Jupiter' }, { end: 19, ruler: 'Mercury' }, { end: 28, ruler: 'Mars' }, { end: 30, ruler: 'Saturn' }]
};

// Chaldean Faces (Decans) - Each sign has 3 faces of 10 degrees each
export const CHALDEAN_FACES: Record<SignName, [TraditionalPlanet, TraditionalPlanet, TraditionalPlanet]> = {
  Aries: ['Mars', 'Sun', 'Venus'],
  Taurus: ['Mercury', 'Moon', 'Saturn'],
  Gemini: ['Jupiter', 'Mars', 'Sun'],
  Cancer: ['Venus', 'Mercury', 'Moon'],
  Leo: ['Saturn', 'Jupiter', 'Mars'],
  Virgo: ['Sun', 'Venus', 'Mercury'],
  Libra: ['Moon', 'Saturn', 'Jupiter'],
  Scorpio: ['Mars', 'Sun', 'Venus'],
  Sagittarius: ['Mercury', 'Moon', 'Saturn'],
  Capricorn: ['Jupiter', 'Mars', 'Sun'],
  Aquarius: ['Venus', 'Mercury', 'Moon'],
  Pisces: ['Saturn', 'Jupiter', 'Mars']
};

// Dignity Point Values (for scoring)
export const DIGNITY_POINTS = {
  domicile: 5,      // Planet in its own sign
  exaltation: 4,    // Planet exalted
  triplicity: 3,    // Planet rules the triplicity
  term: 2,          // Planet in its own term/bound
  face: 1,          // Planet in its own face/decan
  detriment: -5,    // Planet in detriment (opposite domicile)
  fall: -4,         // Planet in fall (opposite exaltation)
  peregrine: -5     // Planet with no essential dignity
};

// Helper functions
export function getTermRuler(sign: SignName, degree: number): TraditionalPlanet {
  const terms = EGYPTIAN_TERMS[sign];
  for (const term of terms) {
    if (degree <= term.end) {
      return term.ruler;
    }
  }
  return terms[terms.length - 1].ruler;
}

export function getFaceRuler(sign: SignName, degree: number): TraditionalPlanet {
  const faces = CHALDEAN_FACES[sign];
  if (degree <= 10) return faces[0];
  if (degree <= 20) return faces[1];
  return faces[2];
}

export function getTriplicityRuler(sign: SignName, isDayChart: boolean): TraditionalPlanet {
  const element = getSignElement(sign);
  const triplicity = TRIPLICITIES[element];
  return isDayChart ? triplicity.day : triplicity.night;
}

export function getSignElement(sign: SignName): 'Fire' | 'Earth' | 'Air' | 'Water' {
  if (['Aries', 'Leo', 'Sagittarius'].includes(sign)) return 'Fire';
  if (['Taurus', 'Virgo', 'Capricorn'].includes(sign)) return 'Earth';
  if (['Gemini', 'Libra', 'Aquarius'].includes(sign)) return 'Air';
  return 'Water';
}

// Calculate essential dignity score for a planet
export interface DignityScore {
  total: number;
  domicile: boolean;
  exaltation: boolean;
  triplicity: boolean;
  term: boolean;
  face: boolean;
  detriment: boolean;
  fall: boolean;
  peregrine: boolean;
}

export function calculateDignityScore(
  planet: TraditionalPlanet,
  sign: SignName,
  degree: number,
  isDayChart: boolean
): DignityScore {
  let total = 0;
  const result: DignityScore = {
    total: 0,
    domicile: false,
    exaltation: false,
    triplicity: false,
    term: false,
    face: false,
    detriment: false,
    fall: false,
    peregrine: false
  };

  // Check domicile
  if (DOMICILES[planet].signs.includes(sign)) {
    total += DIGNITY_POINTS.domicile;
    result.domicile = true;
  }

  // Check exaltation
  if (EXALTATIONS[planet].sign === sign) {
    total += DIGNITY_POINTS.exaltation;
    result.exaltation = true;
  }

  // Check triplicity
  const triplicityRuler = getTriplicityRuler(sign, isDayChart);
  if (triplicityRuler === planet) {
    total += DIGNITY_POINTS.triplicity;
    result.triplicity = true;
  }

  // Check term
  const termRuler = getTermRuler(sign, degree);
  if (termRuler === planet) {
    total += DIGNITY_POINTS.term;
    result.term = true;
  }

  // Check face
  const faceRuler = getFaceRuler(sign, degree);
  if (faceRuler === planet) {
    total += DIGNITY_POINTS.face;
    result.face = true;
  }

  // Check detriment
  if (DETRIMENTS[planet].includes(sign)) {
    total += DIGNITY_POINTS.detriment;
    result.detriment = true;
  }

  // Check fall
  if (FALLS[planet] === sign) {
    total += DIGNITY_POINTS.fall;
    result.fall = true;
  }

  // Check peregrine (no dignity at all)
  const hasAnyDignity = result.domicile || result.exaltation || result.triplicity || result.term || result.face;
  if (!hasAnyDignity && !result.detriment && !result.fall) {
    total += DIGNITY_POINTS.peregrine;
    result.peregrine = true;
  }

  result.total = total;
  return result;
}

// Reception (mutual reception check)
export function checkMutualReception(planet1: TraditionalPlanet, sign1: SignName, planet2: TraditionalPlanet, sign2: SignName): boolean {
  const planet1RulesSIgn2 = DOMICILES[planet1].signs.includes(sign2);
  const planet2RulesSign1 = DOMICILES[planet2].signs.includes(sign1);
  return planet1RulesSIgn2 && planet2RulesSign1;
}

// Almuten (strongest planet in a sign by dignity)
export function findAlmuten(sign: SignName, degree: number, isDayChart: boolean): TraditionalPlanet {
  const planets: TraditionalPlanet[] = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'];
  let maxScore = -Infinity;
  let almuten: TraditionalPlanet = 'Sun';

  for (const planet of planets) {
    const score = calculateDignityScore(planet, sign, degree, isDayChart);
    if (score.total > maxScore) {
      maxScore = score.total;
      almuten = planet;
    }
  }

  return almuten;
}
