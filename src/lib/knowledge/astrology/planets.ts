/**
 * Complete Planets Knowledge Base
 * Contains all celestial bodies used in astrology with comprehensive data
 */

// Type definitions
export interface RetrogradeInfo {
  frequency: string;
  duration: string;
  percentage?: number;
}

export interface PlanetDignities {
  domicile: string[];
  exaltation?: { sign: string; degree?: number };
  detriment: string[];
  fall?: string;
}

export interface RetrogradeEffects {
  natal: string;
  transit: string;
}

export interface PlanetReturn {
  ages: number[];
  meaning: string;
}

export interface Planet {
  name: string;
  nameZh: string;
  symbol: string;
  unicode: string;
  type: 'Personal' | 'Luminary' | 'Social' | 'Transpersonal' | 'Mathematical' | 'Centaur';
  orbitalPeriod: string;
  timePerSign: string;
  speed?: string;
  retrograde: boolean | RetrogradeInfo;
  gender: 'Masculine' | 'Feminine' | 'Neutral';
  sect?: 'Diurnal' | 'Nocturnal' | 'Variable';
  keywords: string[];
  dignities?: PlanetDignities;
  triplicityRuler?: { element: string; type: string };
  retrogradeEffects?: RetrogradeEffects;
  return?: PlanetReturn;
}

// Personal Planets (Luminaries)
export const SUN: Planet = {
  name: 'Sun', nameZh: '太阳', symbol: '☉', unicode: 'U+2609',
  type: 'Luminary', orbitalPeriod: '365.25 days', timePerSign: '~30 days', speed: '~1° per day',
  retrograde: false, gender: 'Masculine', sect: 'Diurnal',
  keywords: ['Identity', 'ego', 'vitality', 'willpower', 'self-expression', 'creativity', 'leadership', 'purpose', 'consciousness', 'father figure', 'authority', 'confidence', 'life force', 'core self', 'individuality'],
  dignities: { domicile: ['Leo'], exaltation: { sign: 'Aries', degree: 19 }, detriment: ['Aquarius'], fall: 'Libra' },
  triplicityRuler: { element: 'Fire', type: 'Day' }
};

export const MOON: Planet = {
  name: 'Moon', nameZh: '月亮', symbol: '☽', unicode: 'U+263D',
  type: 'Luminary', orbitalPeriod: '27.3 days', timePerSign: '~2.5 days', speed: '~13° per day',
  retrograde: false, gender: 'Feminine', sect: 'Nocturnal',
  keywords: ['Emotions', 'instincts', 'habits', 'nurturing', 'mother', 'security', 'memory', 'receptivity', 'subconscious', 'moods', 'needs', 'comfort', 'intuition', 'domestic life', 'inner child'],
  dignities: { domicile: ['Cancer'], exaltation: { sign: 'Taurus', degree: 3 }, detriment: ['Capricorn'], fall: 'Scorpio' },
  triplicityRuler: { element: 'Earth', type: 'Night' }
};

// Personal Planets
export const MERCURY: Planet = {
  name: 'Mercury', nameZh: '水星', symbol: '☿', unicode: 'U+263F',
  type: 'Personal', orbitalPeriod: '88 days', timePerSign: '14-30 days', speed: '~1.5° per day',
  retrograde: { frequency: '3-4x yearly', duration: '~3 weeks' },
  gender: 'Neutral', sect: 'Variable',
  keywords: ['Communication', 'intellect', 'thinking', 'learning', 'writing', 'speech', 'reasoning', 'curiosity', 'adaptability', 'siblings', 'short trips', 'commerce', 'dexterity', 'perception', 'information'],
  dignities: { domicile: ['Gemini', 'Virgo'], exaltation: { sign: 'Virgo', degree: 15 }, detriment: ['Sagittarius', 'Pisces'], fall: 'Pisces' },
  triplicityRuler: { element: 'Air', type: 'Night' },
  retrogradeEffects: {
    natal: 'Inward-focused thinking, unconventional communication style',
    transit: 'Communication delays, technology issues, travel disruptions, time to review'
  }
};

export const VENUS: Planet = {
  name: 'Venus', nameZh: '金星', symbol: '♀', unicode: 'U+2640',
  type: 'Personal', orbitalPeriod: '225 days', timePerSign: '~18-19 days', speed: '~1.2° per day',
  retrograde: { frequency: 'Every 18 months', duration: '~40-43 days' },
  gender: 'Feminine', sect: 'Nocturnal',
  keywords: ['Love', 'beauty', 'attraction', 'relationships', 'values', 'pleasure', 'harmony', 'art', 'aesthetics', 'money', 'possessions', 'sensuality', 'diplomacy', 'partnership', 'affection'],
  dignities: { domicile: ['Taurus', 'Libra'], exaltation: { sign: 'Pisces', degree: 27 }, detriment: ['Aries', 'Scorpio'], fall: 'Virgo' },
  triplicityRuler: { element: 'Earth', type: 'Day' },
  retrogradeEffects: {
    natal: 'Unconventional approach to love/beauty, past-life relationship themes',
    transit: 'Re-evaluation of relationships and values, ex-partners may reappear'
  }
};

export const MARS: Planet = {
  name: 'Mars', nameZh: '火星', symbol: '♂', unicode: 'U+2642',
  type: 'Personal', orbitalPeriod: '687 days', timePerSign: '~6-7 weeks', speed: '~0.5° per day',
  retrograde: { frequency: 'Every ~26 months', duration: '~8-10 weeks' },
  gender: 'Masculine', sect: 'Nocturnal',
  keywords: ['Action', 'energy', 'drive', 'ambition', 'aggression', 'passion', 'courage', 'assertion', 'sexuality', 'conflict', 'competition', 'initiative', 'physical strength', 'anger', 'desire'],
  dignities: { domicile: ['Aries', 'Scorpio'], exaltation: { sign: 'Capricorn', degree: 28 }, detriment: ['Libra', 'Taurus'], fall: 'Cancer' },
  retrogradeEffects: {
    natal: 'Internalized anger/drive, unconventional approach to action',
    transit: 'Lowered energy, frustrated action, revisiting old conflicts'
  }
};

// Social Planets
export const JUPITER: Planet = {
  name: 'Jupiter', nameZh: '木星', symbol: '♃', unicode: 'U+2643',
  type: 'Social', orbitalPeriod: '12 years', timePerSign: '~1 year',
  retrograde: { frequency: 'Annually', duration: '~4 months', percentage: 33 },
  gender: 'Masculine', sect: 'Diurnal',
  keywords: ['Expansion', 'abundance', 'luck', 'growth', 'optimism', 'faith', 'philosophy', 'higher learning', 'travel', 'wisdom', 'generosity', 'tolerance', 'excess', 'morality', 'opportunity'],
  dignities: { domicile: ['Sagittarius', 'Pisces'], exaltation: { sign: 'Cancer', degree: 15 }, detriment: ['Gemini', 'Virgo'], fall: 'Capricorn' },
  return: { ages: [12, 24, 36, 48, 60, 72, 84], meaning: 'Expansion, growth, new opportunities' }
};

export const SATURN: Planet = {
  name: 'Saturn', nameZh: '土星', symbol: '♄', unicode: 'U+2644',
  type: 'Social', orbitalPeriod: '29.5 years', timePerSign: '~2.5 years',
  retrograde: { frequency: 'Annually', duration: '~4.5 months', percentage: 36 },
  gender: 'Masculine', sect: 'Nocturnal',
  keywords: ['Structure', 'discipline', 'responsibility', 'limitation', 'time', 'karma', 'maturity', 'authority', 'boundaries', 'patience', 'lessons', 'restriction', 'mastery', 'perseverance', 'achievement'],
  dignities: { domicile: ['Capricorn', 'Aquarius'], exaltation: { sign: 'Libra', degree: 21 }, detriment: ['Cancer', 'Leo'], fall: 'Aries' },
  return: { ages: [29, 58, 87], meaning: 'Major life threshold, cosmic report card, maturation' }
};

// Transpersonal Planets
export const URANUS: Planet = {
  name: 'Uranus', nameZh: '天王星', symbol: '♅', unicode: 'U+2645',
  type: 'Transpersonal', orbitalPeriod: '84 years', timePerSign: '~7 years',
  retrograde: { frequency: 'Annually', duration: '~155 days', percentage: 41 },
  gender: 'Masculine',
  keywords: ['Revolution', 'innovation', 'freedom', 'rebellion', 'awakening', 'originality', 'disruption', 'independence', 'sudden change', 'technology', 'genius', 'eccentricity', 'liberation', 'electricity'],
  dignities: { domicile: ['Aquarius'], exaltation: { sign: 'Scorpio' }, detriment: ['Leo'], fall: 'Taurus' }
};

export const NEPTUNE: Planet = {
  name: 'Neptune', nameZh: '海王星', symbol: '♆', unicode: 'U+2646',
  type: 'Transpersonal', orbitalPeriod: '165 years', timePerSign: '~14 years',
  retrograde: { frequency: 'Annually', duration: '~160 days', percentage: 42 },
  gender: 'Feminine',
  keywords: ['Dreams', 'illusion', 'spirituality', 'imagination', 'compassion', 'dissolution', 'transcendence', 'mysticism', 'deception', 'inspiration', 'fantasy', 'intuition', 'sacrifice', 'artistry'],
  dignities: { domicile: ['Pisces'], detriment: ['Virgo'] }
};

export const PLUTO: Planet = {
  name: 'Pluto', nameZh: '冥王星', symbol: '♇', unicode: 'U+2647',
  type: 'Transpersonal', orbitalPeriod: '248 years', timePerSign: '11-31 years',
  retrograde: { frequency: 'Annually', duration: '~165 days', percentage: 43 },
  gender: 'Masculine',
  keywords: ['Transformation', 'power', 'death/rebirth', 'intensity', 'depth', 'obsession', 'control', 'regeneration', 'shadow', 'secrets', 'extremes', 'purging', 'evolution', 'plutocracy'],
  dignities: { domicile: ['Scorpio'], detriment: ['Taurus'] }
};

// Minor Bodies
export interface Chiron {
  name: string;
  nameZh: string;
  symbol: string;
  classification: string;
  orbitalPeriod: string;
  timePerSign: string;
  retrograde: RetrogradeInfo;
  keywords: string[];
  return: PlanetReturn;
  archetype: string;
}

export const CHIRON: Chiron = {
  name: 'Chiron', nameZh: '凯龙星', symbol: '⚷',
  classification: 'Centaur (asteroid/comet hybrid)',
  orbitalPeriod: '50-51 years', timePerSign: '4-8 years',
  retrograde: { frequency: 'Annually', duration: '~5 months' },
  keywords: ['Wounded healer', 'core wounds', 'healing powers', 'teacher/mentor', 'transformation through pain', 'wisdom through suffering', 'vulnerability', 'inner child wounds'],
  return: { ages: [50], meaning: 'Core wounds resurface for deeper healing; call to become teacher/healer' },
  archetype: 'Greek centaur who was wise healer and mentor to heroes; wounded by poisoned arrow that could not heal'
};

// Lunar Nodes
export interface LunarNode {
  name: string;
  nameZh: string;
  altNames: string[];
  symbol: string;
  type: string;
  orbitalCycle?: string;
  movement?: string;
  relationship?: string;
  keywords: string[];
  return?: PlanetReturn;
}

export const NORTH_NODE: LunarNode = {
  name: 'North Node', nameZh: '北交点',
  altNames: ['True Node', 'Ascending Node', "Dragon's Head", 'Rahu'],
  symbol: '☊', type: 'Mathematical',
  orbitalCycle: '18.6 years', movement: 'Retrograde (backwards through zodiac)',
  keywords: ['Destiny', 'life purpose', 'soul mission', 'karmic direction', 'growth edge', 'unfamiliar territory', 'what to develop', 'future evolution'],
  return: { ages: [18, 37, 56, 75], meaning: 'Major turning point; opportunity to align with soul purpose' }
};

export const SOUTH_NODE: LunarNode = {
  name: 'South Node', nameZh: '南交点',
  altNames: ['Descending Node', "Dragon's Tail", 'Ketu'],
  symbol: '☋', type: 'Mathematical',
  relationship: 'Always 180 degrees opposite North Node',
  keywords: ['Past life', 'karma', 'innate talents', 'comfort zone', 'what to release', 'default patterns', 'mastered territory', 'familiar habits', 'spiritual inheritance']
};

// Nodal Axis Interpretations
export interface NodalAxis {
  name: string;
  northNode: { destiny: string; release: string };
  southNode: { destiny: string; release: string };
}

export const NODAL_AXES: Record<string, NodalAxis> = {
  Aries_Libra: {
    name: 'Axis of Relationship / Me vs. We',
    northNode: { destiny: 'Independence, courage, self-assertion', release: 'People-pleasing, codependency' },
    southNode: { destiny: 'Partnership, compromise, diplomacy', release: 'Selfishness, going it alone' }
  },
  Taurus_Scorpio: {
    name: 'Axis of Possession / Resources & Transformation',
    northNode: { destiny: 'Stability, self-worth, simple pleasures', release: 'Crisis addiction, intensity' },
    southNode: { destiny: 'Transformation, intimacy, shared resources', release: 'Material attachment, comfort' }
  },
  Gemini_Sagittarius: {
    name: 'Axis of Knowledge / Local vs. Global',
    northNode: { destiny: 'Communication, curiosity, networking', release: 'Preachiness, dogmatism' },
    southNode: { destiny: 'Philosophy, travel, higher meaning', release: 'Gossip, scattered thinking' }
  },
  Cancer_Capricorn: {
    name: 'Axis of Security / Home vs. Career',
    northNode: { destiny: 'Emotional security, nurturing, home life', release: 'Workaholism, status obsession' },
    southNode: { destiny: 'Career, public role, achievement', release: 'Over-dependency, family hiding' }
  },
  Leo_Aquarius: {
    name: 'Axis of Self-Expression / Individual vs. Collective',
    northNode: { destiny: 'Creativity, heart-centered leadership', release: 'Detachment, hiding in groups' },
    southNode: { destiny: 'Community, innovation, humanitarian causes', release: 'Ego, need for spotlight' }
  },
  Virgo_Pisces: {
    name: 'Axis of Service / Practical vs. Spiritual',
    northNode: { destiny: 'Practical skills, health routines, discernment', release: 'Escapism, victimhood' },
    southNode: { destiny: 'Spirituality, artistic vision, surrender', release: 'Perfectionism, criticism' }
  }
};

// All planets collection
export const PLANETS: Record<string, Planet> = {
  Sun: SUN, Moon: MOON, Mercury: MERCURY, Venus: VENUS, Mars: MARS,
  Jupiter: JUPITER, Saturn: SATURN, Uranus: URANUS, Neptune: NEPTUNE, Pluto: PLUTO
};

// Planet order for calculations
export const PLANET_ORDER = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'] as const;
export const PERSONAL_PLANETS = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars'] as const;
export const SOCIAL_PLANETS = ['Jupiter', 'Saturn'] as const;
export const TRANSPERSONAL_PLANETS = ['Uranus', 'Neptune', 'Pluto'] as const;
