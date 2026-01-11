/**
 * Complete Aspects Knowledge Base
 * Contains all major and minor aspects with orbs and interpretations
 */

// Type definitions
export type AspectEnergy = 'neutral' | 'harmonious' | 'challenging' | 'mildly_harmonious' | 'mildly_challenging' | 'creative';

export interface Aspect {
  name: string;
  nameZh: string;
  angle: number;
  symbol: string;
  energy: AspectEnergy;
  orb: number;
  description: string;
  keywords: string[];
}

// Major Aspects (Ptolemaic)
export const MAJOR_ASPECTS: Record<string, Aspect> = {
  conjunction: {
    name: 'Conjunction',
    nameZh: '合相',
    angle: 0,
    symbol: '☌',
    energy: 'neutral',
    orb: 10,
    description: 'Planets merge energy, creating intense focus. Can be harmonious or challenging depending on planets involved.',
    keywords: ['Unity', 'fusion', 'intensity', 'new beginnings', 'concentration', 'blending']
  },
  sextile: {
    name: 'Sextile',
    nameZh: '六分相',
    angle: 60,
    symbol: '⚹',
    energy: 'harmonious',
    orb: 6,
    description: 'Opportunity aspect that requires action to manifest. Easy flow between compatible elements.',
    keywords: ['Opportunity', 'talent', 'ease', 'skill', 'communication', 'creativity']
  },
  square: {
    name: 'Square',
    nameZh: '四分相',
    angle: 90,
    symbol: '□',
    energy: 'challenging',
    orb: 8,
    description: 'Tension that demands action and growth. Creates friction that motivates change.',
    keywords: ['Tension', 'challenge', 'action', 'conflict', 'motivation', 'growth']
  },
  trine: {
    name: 'Trine',
    nameZh: '三分相',
    angle: 120,
    symbol: '△',
    energy: 'harmonious',
    orb: 8,
    description: 'Natural talent and ease. Flow between same-element signs. Can lead to complacency.',
    keywords: ['Harmony', 'talent', 'ease', 'blessing', 'flow', 'natural ability']
  },
  opposition: {
    name: 'Opposition',
    nameZh: '对分相',
    angle: 180,
    symbol: '☍',
    energy: 'challenging',
    orb: 10,
    description: 'Polarity requiring balance and integration. Creates awareness through projection.',
    keywords: ['Polarity', 'awareness', 'balance', 'projection', 'relationships', 'integration']
  }
};

// Minor Aspects
export const MINOR_ASPECTS: Record<string, Aspect> = {
  semi_sextile: {
    name: 'Semi-Sextile',
    nameZh: '半六分相',
    angle: 30,
    symbol: '⚺',
    energy: 'mildly_harmonious',
    orb: 2,
    description: 'Subtle irritation between adjacent signs. Requires adjustment and adaptation.',
    keywords: ['Adjustment', 'growth', 'subtle tension', 'adaptation', 'refinement']
  },
  semi_square: {
    name: 'Semi-Square',
    nameZh: '半四分相',
    angle: 45,
    symbol: '∠',
    energy: 'mildly_challenging',
    orb: 2,
    description: 'Minor friction that creates motivation. Less intense than square but still activating.',
    keywords: ['Friction', 'irritation', 'motivation', 'minor challenge', 'agitation']
  },
  sesquiquadrate: {
    name: 'Sesquiquadrate',
    nameZh: '倍半四分相',
    angle: 135,
    symbol: '⚼',
    energy: 'challenging',
    orb: 2.5,
    description: 'Agitation that demands adjustment. Creates frustration that pushes for resolution.',
    keywords: ['Frustration', 'adjustment', 'agitation', 'stress', 'resolution needed']
  },
  quincunx: {
    name: 'Quincunx',
    nameZh: '梅花相',
    angle: 150,
    symbol: '⚻',
    energy: 'challenging',
    orb: 3,
    description: 'Requires constant adjustment between incompatible energies. Health and karmic implications.',
    keywords: ['Adjustment', 'health', 'karma', 'incompatibility', 'constant adaptation']
  },
  quintile: {
    name: 'Quintile',
    nameZh: '五分相',
    angle: 72,
    symbol: 'Q',
    energy: 'creative',
    orb: 1,
    description: 'Creative talent and unique gifts. Associated with genius and special abilities.',
    keywords: ['Creativity', 'talent', 'genius', 'unique gifts', 'artistic ability']
  },
  bi_quintile: {
    name: 'Bi-Quintile',
    nameZh: '双五分相',
    angle: 144,
    symbol: 'bQ',
    energy: 'creative',
    orb: 1,
    description: 'Creative manifestation and inspired action. Expressing unique talents in the world.',
    keywords: ['Creative expression', 'manifestation', 'inspiration', 'unique contribution']
  }
};

// All aspects combined
export const ALL_ASPECTS = { ...MAJOR_ASPECTS, ...MINOR_ASPECTS };

// Orb modifiers by planet type
export const ORB_MODIFIERS: Record<string, number> = {
  Sun: 1.2,       // Luminaries get 20% wider orbs
  Moon: 1.2,
  Mercury: 1.0,   // Personal planets standard
  Venus: 1.0,
  Mars: 1.0,
  Jupiter: 0.9,   // Social planets slightly tighter
  Saturn: 0.9,
  Uranus: 0.75,   // Outer planets tighter orbs
  Neptune: 0.75,
  Pluto: 0.75,
  Chiron: 0.6,    // Minor bodies tightest orbs
  NorthNode: 0.6,
  SouthNode: 0.6
};

// Sign aspect relationships (natural aspects by sign position)
export const SIGN_ASPECTS: Record<string, { sextile: string[]; square: string[]; trine: string[]; opposition: string }> = {
  Aries: { sextile: ['Gemini', 'Aquarius'], square: ['Cancer', 'Capricorn'], trine: ['Leo', 'Sagittarius'], opposition: 'Libra' },
  Taurus: { sextile: ['Cancer', 'Pisces'], square: ['Leo', 'Aquarius'], trine: ['Virgo', 'Capricorn'], opposition: 'Scorpio' },
  Gemini: { sextile: ['Aries', 'Leo'], square: ['Virgo', 'Pisces'], trine: ['Libra', 'Aquarius'], opposition: 'Sagittarius' },
  Cancer: { sextile: ['Taurus', 'Virgo'], square: ['Aries', 'Libra'], trine: ['Scorpio', 'Pisces'], opposition: 'Capricorn' },
  Leo: { sextile: ['Gemini', 'Libra'], square: ['Taurus', 'Scorpio'], trine: ['Aries', 'Sagittarius'], opposition: 'Aquarius' },
  Virgo: { sextile: ['Cancer', 'Scorpio'], square: ['Gemini', 'Sagittarius'], trine: ['Taurus', 'Capricorn'], opposition: 'Pisces' },
  Libra: { sextile: ['Leo', 'Sagittarius'], square: ['Cancer', 'Capricorn'], trine: ['Gemini', 'Aquarius'], opposition: 'Aries' },
  Scorpio: { sextile: ['Virgo', 'Capricorn'], square: ['Leo', 'Aquarius'], trine: ['Cancer', 'Pisces'], opposition: 'Taurus' },
  Sagittarius: { sextile: ['Libra', 'Aquarius'], square: ['Virgo', 'Pisces'], trine: ['Aries', 'Leo'], opposition: 'Gemini' },
  Capricorn: { sextile: ['Scorpio', 'Pisces'], square: ['Aries', 'Libra'], trine: ['Taurus', 'Virgo'], opposition: 'Cancer' },
  Aquarius: { sextile: ['Aries', 'Sagittarius'], square: ['Taurus', 'Scorpio'], trine: ['Gemini', 'Libra'], opposition: 'Leo' },
  Pisces: { sextile: ['Taurus', 'Capricorn'], square: ['Gemini', 'Sagittarius'], trine: ['Cancer', 'Scorpio'], opposition: 'Virgo' }
};

// Aspect patterns (configurations)
export interface AspectPattern {
  name: string;
  nameZh: string;
  aspects: string[];
  description: string;
  interpretation: string;
}

export const ASPECT_PATTERNS: Record<string, AspectPattern> = {
  grand_trine: {
    name: 'Grand Trine',
    nameZh: '大三角',
    aspects: ['trine', 'trine', 'trine'],
    description: 'Three planets in trine aspect forming an equilateral triangle',
    interpretation: 'Natural talent and ease in the element involved. Can indicate complacency without challenging aspects.'
  },
  t_square: {
    name: 'T-Square',
    nameZh: 'T型三角',
    aspects: ['opposition', 'square', 'square'],
    description: 'Two planets in opposition with a third squaring both',
    interpretation: 'Dynamic tension with the apex planet as the focal point. Creates drive for achievement.'
  },
  grand_cross: {
    name: 'Grand Cross',
    nameZh: '大十字',
    aspects: ['opposition', 'opposition', 'square', 'square', 'square', 'square'],
    description: 'Four planets forming two oppositions and four squares',
    interpretation: 'Maximum tension requiring integration of opposing forces. Great potential when mastered.'
  },
  yod: {
    name: 'Yod (Finger of God)',
    nameZh: '上帝之指',
    aspects: ['quincunx', 'quincunx', 'sextile'],
    description: 'Two planets in sextile, both quincunx to a third (apex)',
    interpretation: 'Fated or karmic pattern. The apex planet indicates a special mission or purpose.'
  },
  kite: {
    name: 'Kite',
    nameZh: '风筝',
    aspects: ['trine', 'trine', 'trine', 'sextile', 'sextile', 'opposition'],
    description: 'Grand trine with one planet opposing another, creating sextiles',
    interpretation: 'Grand trine energy given direction and focus through the opposition.'
  },
  mystic_rectangle: {
    name: 'Mystic Rectangle',
    nameZh: '神秘矩形',
    aspects: ['opposition', 'opposition', 'trine', 'trine', 'sextile', 'sextile'],
    description: 'Two oppositions connected by trines and sextiles',
    interpretation: 'Practical mysticism. Ability to manifest spiritual insights into reality.'
  },
  stellium: {
    name: 'Stellium',
    nameZh: '群星汇聚',
    aspects: ['conjunction', 'conjunction', 'conjunction'],
    description: 'Three or more planets conjunct in same sign or house',
    interpretation: 'Concentrated energy in one area of life. Intense focus but potential imbalance.'
  }
};

// Applying vs Separating aspect strength
export const ASPECT_STRENGTH = {
  applying: 1.5,     // Applying aspects are stronger
  exact: 2.0,        // Exact aspects are strongest
  separating: 1.0,   // Separating aspects are weaker
  wide: 0.5          // Wide orb aspects are weakest
};

// Helper function to calculate effective orb
export function calculateEffectiveOrb(aspect: Aspect, planet1: string, planet2: string): number {
  const mod1 = ORB_MODIFIERS[planet1] || 1.0;
  const mod2 = ORB_MODIFIERS[planet2] || 1.0;
  const avgMod = (mod1 + mod2) / 2;
  return aspect.orb * avgMod;
}
