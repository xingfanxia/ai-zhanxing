/**
 * Complete Houses Knowledge Base
 * Contains all 12 astrological houses with their meanings and associations
 */

// Type definitions
export type HouseType = 'Angular' | 'Succedent' | 'Cadent';
export type HouseElement = 'Fire' | 'Earth' | 'Air' | 'Water';

export interface House {
  number: number;
  name: string;
  nameZh: string;
  type: HouseType;
  naturalSign: string;
  naturalRuler: string;
  element: HouseElement;
  lifeAreas: string[];
  keywords: string[];
  bodyParts?: string[];
  description: string;
}

// Complete 12 Houses Data
export const HOUSES: Record<number, House> = {
  1: {
    number: 1,
    name: 'First House',
    nameZh: '第一宫',
    type: 'Angular',
    naturalSign: 'Aries',
    naturalRuler: 'Mars',
    element: 'Fire',
    lifeAreas: ['Self-identity', 'physical appearance', 'first impressions', 'personality', 'beginnings', 'outlook on life'],
    keywords: ['Self', 'identity', 'appearance', 'personality', 'beginnings', 'initiative', 'physical body', 'vitality'],
    bodyParts: ['Head', 'face', 'brain'],
    description: 'The Ascendant house representing the self, physical body, and how others perceive you. The mask you wear and your approach to life.'
  },
  2: {
    number: 2,
    name: 'Second House',
    nameZh: '第二宫',
    type: 'Succedent',
    naturalSign: 'Taurus',
    naturalRuler: 'Venus',
    element: 'Earth',
    lifeAreas: ['Personal finances', 'possessions', 'values', 'self-worth', 'material security', 'talents'],
    keywords: ['Money', 'possessions', 'values', 'self-worth', 'resources', 'talents', 'material security'],
    bodyParts: ['Throat', 'neck', 'ears'],
    description: 'The house of personal resources, both material and internal. Governs finances, possessions, and self-esteem.'
  },
  3: {
    number: 3,
    name: 'Third House',
    nameZh: '第三宫',
    type: 'Cadent',
    naturalSign: 'Gemini',
    naturalRuler: 'Mercury',
    element: 'Air',
    lifeAreas: ['Communication', 'siblings', 'neighbors', 'short trips', 'early education', 'mental activity'],
    keywords: ['Communication', 'learning', 'siblings', 'neighbors', 'short journeys', 'writing', 'mind'],
    bodyParts: ['Arms', 'hands', 'shoulders', 'lungs'],
    description: 'The house of communication and immediate environment. Governs learning, siblings, and local travel.'
  },
  4: {
    number: 4,
    name: 'Fourth House',
    nameZh: '第四宫',
    type: 'Angular',
    naturalSign: 'Cancer',
    naturalRuler: 'Moon',
    element: 'Water',
    lifeAreas: ['Home', 'family', 'roots', 'ancestry', 'private life', 'emotional foundation', 'end of life'],
    keywords: ['Home', 'family', 'roots', 'mother', 'ancestry', 'private life', 'emotional security'],
    bodyParts: ['Chest', 'breasts', 'stomach'],
    description: 'The IC (Imum Coeli). The house of home, family, and emotional foundations. Your deepest self and origins.'
  },
  5: {
    number: 5,
    name: 'Fifth House',
    nameZh: '第五宫',
    type: 'Succedent',
    naturalSign: 'Leo',
    naturalRuler: 'Sun',
    element: 'Fire',
    lifeAreas: ['Creativity', 'romance', 'children', 'pleasure', 'hobbies', 'self-expression', 'gambling'],
    keywords: ['Creativity', 'romance', 'children', 'pleasure', 'fun', 'self-expression', 'speculation'],
    bodyParts: ['Heart', 'spine', 'upper back'],
    description: 'The house of creativity, pleasure, and self-expression. Governs romance, children, and joyful pursuits.'
  },
  6: {
    number: 6,
    name: 'Sixth House',
    nameZh: '第六宫',
    type: 'Cadent',
    naturalSign: 'Virgo',
    naturalRuler: 'Mercury',
    element: 'Earth',
    lifeAreas: ['Health', 'daily routines', 'work', 'service', 'pets', 'diet', 'employment'],
    keywords: ['Health', 'work', 'service', 'routines', 'pets', 'daily habits', 'employment'],
    bodyParts: ['Digestive system', 'intestines', 'nervous system'],
    description: 'The house of health and service. Governs daily work, routines, and acts of service to others.'
  },
  7: {
    number: 7,
    name: 'Seventh House',
    nameZh: '第七宫',
    type: 'Angular',
    naturalSign: 'Libra',
    naturalRuler: 'Venus',
    element: 'Air',
    lifeAreas: ['Partnerships', 'marriage', 'contracts', 'open enemies', 'one-on-one relationships', 'legal matters'],
    keywords: ['Partnerships', 'marriage', 'contracts', 'others', 'relationships', 'balance', 'cooperation'],
    bodyParts: ['Kidneys', 'lower back', 'ovaries'],
    description: 'The Descendant. The house of partnerships and relationships. Governs marriage, business partners, and open enemies.'
  },
  8: {
    number: 8,
    name: 'Eighth House',
    nameZh: '第八宫',
    type: 'Succedent',
    naturalSign: 'Scorpio',
    naturalRuler: 'Pluto',
    element: 'Water',
    lifeAreas: ['Transformation', 'shared resources', 'death', 'inheritance', 'taxes', 'intimacy', 'occult'],
    keywords: ['Transformation', 'death', 'rebirth', 'shared resources', 'intimacy', 'occult', 'inheritance'],
    bodyParts: ['Reproductive organs', 'genitals', 'bladder'],
    description: 'The house of transformation and shared resources. Governs death, rebirth, intimacy, and other people\'s money.'
  },
  9: {
    number: 9,
    name: 'Ninth House',
    nameZh: '第九宫',
    type: 'Cadent',
    naturalSign: 'Sagittarius',
    naturalRuler: 'Jupiter',
    element: 'Fire',
    lifeAreas: ['Higher education', 'philosophy', 'religion', 'long journeys', 'foreign cultures', 'publishing', 'law'],
    keywords: ['Philosophy', 'higher education', 'travel', 'religion', 'wisdom', 'publishing', 'foreign affairs'],
    bodyParts: ['Hips', 'thighs', 'liver'],
    description: 'The house of expansion and higher mind. Governs philosophy, religion, higher education, and long-distance travel.'
  },
  10: {
    number: 10,
    name: 'Tenth House',
    nameZh: '第十宫',
    type: 'Angular',
    naturalSign: 'Capricorn',
    naturalRuler: 'Saturn',
    element: 'Earth',
    lifeAreas: ['Career', 'public image', 'reputation', 'authority', 'achievements', 'status', 'father'],
    keywords: ['Career', 'reputation', 'status', 'authority', 'public image', 'achievements', 'ambition'],
    bodyParts: ['Knees', 'bones', 'teeth', 'skin'],
    description: 'The Midheaven (MC). The house of career and public standing. Governs reputation, status, and life achievements.'
  },
  11: {
    number: 11,
    name: 'Eleventh House',
    nameZh: '第十一宫',
    type: 'Succedent',
    naturalSign: 'Aquarius',
    naturalRuler: 'Uranus',
    element: 'Air',
    lifeAreas: ['Friendships', 'groups', 'hopes', 'wishes', 'social causes', 'humanitarian interests', 'technology'],
    keywords: ['Friends', 'groups', 'hopes', 'wishes', 'community', 'social causes', 'innovation'],
    bodyParts: ['Ankles', 'calves', 'circulatory system'],
    description: 'The house of friendship and collective endeavors. Governs groups, social networks, and humanitarian causes.'
  },
  12: {
    number: 12,
    name: 'Twelfth House',
    nameZh: '第十二宫',
    type: 'Cadent',
    naturalSign: 'Pisces',
    naturalRuler: 'Neptune',
    element: 'Water',
    lifeAreas: ['Spirituality', 'subconscious', 'hidden enemies', 'isolation', 'karma', 'dreams', 'institutions'],
    keywords: ['Subconscious', 'spirituality', 'karma', 'hidden', 'isolation', 'dreams', 'transcendence'],
    bodyParts: ['Feet', 'lymphatic system', 'pineal gland'],
    description: 'The house of the subconscious and hidden realms. Governs spirituality, karma, secrets, and self-undoing.'
  }
};

// House classifications
export const ANGULAR_HOUSES = [1, 4, 7, 10] as const;
export const SUCCEDENT_HOUSES = [2, 5, 8, 11] as const;
export const CADENT_HOUSES = [3, 6, 9, 12] as const;

// House element groupings
export const FIRE_HOUSES = [1, 5, 9] as const;
export const EARTH_HOUSES = [2, 6, 10] as const;
export const AIR_HOUSES = [3, 7, 11] as const;
export const WATER_HOUSES = [4, 8, 12] as const;

// House strength by type
export const HOUSE_STRENGTH: Record<HouseType, number> = {
  Angular: 3,    // Most powerful - action and manifestation
  Succedent: 2,  // Moderate - stability and resources
  Cadent: 1      // Least powerful - learning and adaptation
};

// Axis pairs (opposite houses)
export const HOUSE_AXES: Record<string, { houses: [number, number]; theme: string }> = {
  identity: { houses: [1, 7], theme: 'Self vs. Other / Individual vs. Partnership' },
  resources: { houses: [2, 8], theme: 'Personal vs. Shared Resources' },
  communication: { houses: [3, 9], theme: 'Local vs. Global Knowledge' },
  foundation: { houses: [4, 10], theme: 'Private vs. Public Life / Home vs. Career' },
  expression: { houses: [5, 11], theme: 'Individual vs. Collective Creativity' },
  service: { houses: [6, 12], theme: 'Practical vs. Spiritual Service' }
};

// Quadrants
export const QUADRANTS: Record<string, { houses: number[]; description: string }> = {
  first: { houses: [1, 2, 3], description: 'Personal development and self-awareness' },
  second: { houses: [4, 5, 6], description: 'Emotional development and creativity' },
  third: { houses: [7, 8, 9], description: 'Social development and relationships' },
  fourth: { houses: [10, 11, 12], description: 'Universal development and transcendence' }
};

// Hemispheres
export const HEMISPHERES: Record<string, { houses: number[]; description: string }> = {
  eastern: { houses: [10, 11, 12, 1, 2, 3], description: 'Self-directed, independent action' },
  western: { houses: [4, 5, 6, 7, 8, 9], description: 'Other-directed, responsive to environment' },
  northern: { houses: [1, 2, 3, 4, 5, 6], description: 'Private, subjective, inner-focused' },
  southern: { houses: [7, 8, 9, 10, 11, 12], description: 'Public, objective, outer-focused' }
};
