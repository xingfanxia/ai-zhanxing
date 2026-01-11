/**
 * Astrology Knowledge Base - Central Export Module
 * Exports all astrology data structures and utilities
 */

// Zodiac Signs
export {
  ZODIAC_SIGNS,
  SIGN_ORDER,
  type ZodiacSign,
  type DateRange,
  type Decan
} from './zodiac-signs';

// Compatibility
export {
  COMPATIBILITY_MATRIX,
  ELEMENT_COMPATIBILITY,
  MODALITY_COMPATIBILITY,
  POLARITY_COMPATIBILITY,
  getCompatibilityScore,
  getElementCompatibilityKey,
  getModalityCompatibilityKey
} from './compatibility';

// Planets
export {
  SUN,
  MOON,
  MERCURY,
  VENUS,
  MARS,
  JUPITER,
  SATURN,
  URANUS,
  NEPTUNE,
  PLUTO,
  CHIRON,
  NORTH_NODE,
  SOUTH_NODE,
  NODAL_AXES,
  PLANETS,
  PLANET_ORDER,
  PERSONAL_PLANETS,
  SOCIAL_PLANETS,
  TRANSPERSONAL_PLANETS,
  type Planet,
  type RetrogradeInfo,
  type PlanetDignities,
  type RetrogradeEffects,
  type PlanetReturn,
  type Chiron as ChironType,
  type LunarNode,
  type NodalAxis
} from './planets';

// Houses
export {
  HOUSES,
  ANGULAR_HOUSES,
  SUCCEDENT_HOUSES,
  CADENT_HOUSES,
  FIRE_HOUSES,
  EARTH_HOUSES,
  AIR_HOUSES,
  WATER_HOUSES,
  HOUSE_STRENGTH,
  HOUSE_AXES,
  QUADRANTS,
  HEMISPHERES,
  type House,
  type HouseType,
  type HouseElement
} from './houses';

// Aspects
export {
  MAJOR_ASPECTS,
  MINOR_ASPECTS,
  ALL_ASPECTS,
  ORB_MODIFIERS,
  SIGN_ASPECTS,
  ASPECT_PATTERNS,
  ASPECT_STRENGTH,
  calculateEffectiveOrb,
  type Aspect,
  type AspectEnergy,
  type AspectPattern
} from './aspects';

// Dignities
export {
  DOMICILES,
  MODERN_RULERS,
  EXALTATIONS,
  DETRIMENTS,
  FALLS,
  TRIPLICITIES,
  EGYPTIAN_TERMS,
  CHALDEAN_FACES,
  DIGNITY_POINTS,
  getTermRuler,
  getFaceRuler,
  getTriplicityRuler,
  getSignElement,
  calculateDignityScore,
  checkMutualReception,
  findAlmuten,
  type TraditionalPlanet,
  type SignName,
  type TriplicityRulers,
  type Term,
  type DignityScore
} from './dignities';
