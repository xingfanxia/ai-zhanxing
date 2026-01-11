/**
 * Core type definitions for astrology calculations
 */

// ============================================================================
// Zodiac Signs
// ============================================================================

export type ZodiacSign =
  | 'Aries' | 'Taurus' | 'Gemini' | 'Cancer'
  | 'Leo' | 'Virgo' | 'Libra' | 'Scorpio'
  | 'Sagittarius' | 'Capricorn' | 'Aquarius' | 'Pisces';

export const ZODIAC_SIGNS: ZodiacSign[] = [
  'Aries', 'Taurus', 'Gemini', 'Cancer',
  'Leo', 'Virgo', 'Libra', 'Scorpio',
  'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

// ============================================================================
// Planets
// ============================================================================

export type Planet =
  | 'Sun' | 'Moon' | 'Mercury' | 'Venus' | 'Mars'
  | 'Jupiter' | 'Saturn' | 'Uranus' | 'Neptune' | 'Pluto'
  | 'NorthNode' | 'SouthNode' | 'Chiron';

export const PLANETS: Planet[] = [
  'Sun', 'Moon', 'Mercury', 'Venus', 'Mars',
  'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto',
  'NorthNode', 'SouthNode', 'Chiron'
];

// ============================================================================
// House Systems
// ============================================================================

export type HouseSystem = 'Placidus' | 'WholeSign' | 'Koch' | 'Equal' | 'Campanus' | 'Regiomontanus';

export const HOUSE_SYSTEM_CODES: Record<HouseSystem, string> = {
  'Placidus': 'P',
  'WholeSign': 'W',
  'Koch': 'K',
  'Equal': 'E',
  'Campanus': 'C',
  'Regiomontanus': 'R'
};

// ============================================================================
// Aspect Types
// ============================================================================

export type AspectType =
  | 'Conjunction' | 'Opposition' | 'Trine' | 'Square' | 'Sextile'
  | 'Quincunx' | 'SemiSextile' | 'SemiSquare' | 'Sesquiquadrate' | 'Quintile';

export interface AspectDefinition {
  type: AspectType;
  angle: number;
  defaultOrb: number;
  isMajor: boolean;
}

export const ASPECT_DEFINITIONS: AspectDefinition[] = [
  { type: 'Conjunction', angle: 0, defaultOrb: 10, isMajor: true },
  { type: 'Opposition', angle: 180, defaultOrb: 10, isMajor: true },
  { type: 'Trine', angle: 120, defaultOrb: 8, isMajor: true },
  { type: 'Square', angle: 90, defaultOrb: 8, isMajor: true },
  { type: 'Sextile', angle: 60, defaultOrb: 6, isMajor: true },
  { type: 'Quincunx', angle: 150, defaultOrb: 3, isMajor: false },
  { type: 'SemiSextile', angle: 30, defaultOrb: 2, isMajor: false },
  { type: 'SemiSquare', angle: 45, defaultOrb: 2, isMajor: false },
  { type: 'Sesquiquadrate', angle: 135, defaultOrb: 2, isMajor: false },
  { type: 'Quintile', angle: 72, defaultOrb: 2, isMajor: false },
];

// ============================================================================
// Birth Data
// ============================================================================

export interface BirthData {
  /** ISO 8601 date string (YYYY-MM-DD) */
  date: string;
  /** Time in HH:MM:SS format, or null if unknown */
  time: string | null;
  /** Geographic latitude (-90 to 90) */
  latitude: number;
  /** Geographic longitude (-180 to 180) */
  longitude: number;
  /** IANA timezone identifier (e.g., 'America/New_York') */
  timezone: string;
  /** Whether birth time is unknown */
  timeUnknown?: boolean;
}

// ============================================================================
// Planet Position
// ============================================================================

export interface PlanetPosition {
  /** Planet identifier */
  planet: Planet;
  /** Ecliptic longitude (0-360) */
  longitude: number;
  /** Ecliptic latitude */
  latitude: number;
  /** Distance from Earth in AU */
  distance: number;
  /** Daily speed in degrees */
  speed: number;
  /** Whether planet is retrograde */
  retrograde: boolean;
  /** Zodiac sign */
  sign: ZodiacSign;
  /** Degree within sign (0-30) */
  degreeInSign: number;
  /** Minutes within degree (0-60) */
  minutes: number;
  /** Seconds within minute (0-60) */
  seconds: number;
}

// ============================================================================
// House Cusps
// ============================================================================

export interface HouseCusps {
  /** House system used */
  system: HouseSystem;
  /** Array of 12 house cusp longitudes (index 0 = 1st house) */
  cusps: number[];
  /** Ascendant longitude */
  ascendant: number;
  /** Midheaven (MC) longitude */
  midheaven: number;
  /** Descendant longitude (opposite Ascendant) */
  descendant: number;
  /** IC (Imum Coeli) longitude (opposite MC) */
  ic: number;
  /** Vertex longitude */
  vertex: number;
}

// ============================================================================
// Aspect
// ============================================================================

export interface Aspect {
  /** First planet in aspect */
  planet1: Planet;
  /** Second planet in aspect */
  planet2: Planet;
  /** Type of aspect */
  type: AspectType;
  /** Exact angle of the aspect */
  exactAngle: number;
  /** Actual angle between planets */
  actualAngle: number;
  /** Orb (deviation from exact) in degrees */
  orb: number;
  /** Whether aspect is applying (getting closer) or separating */
  applying: boolean;
  /** Aspect strength (1 = exact, 0 = at orb limit) */
  strength: number;
}

// ============================================================================
// Natal Chart
// ============================================================================

export interface NatalChart {
  /** Birth data used for calculation */
  birthData: BirthData;
  /** Julian Day used for calculation */
  julianDay: number;
  /** All planet positions */
  planets: Record<Planet, PlanetPosition>;
  /** House cusps and angles */
  houses: HouseCusps;
  /** Ascendant position details */
  ascendant: {
    longitude: number;
    sign: ZodiacSign;
    degreeInSign: number;
  };
  /** Midheaven position details */
  midheaven: {
    longitude: number;
    sign: ZodiacSign;
    degreeInSign: number;
  };
  /** All aspects in the chart */
  aspects: Aspect[];
  /** Calculation timestamp */
  calculatedAt: Date;
}

// ============================================================================
// Calculation Options
// ============================================================================

export interface CalculationOptions {
  /** House system to use (default: Placidus) */
  houseSystem?: HouseSystem;
  /** Include minor aspects (default: false) */
  includeMinorAspects?: boolean;
  /** Custom orbs for aspects */
  customOrbs?: Partial<Record<AspectType, number>>;
  /** Include Chiron (default: true) */
  includeChiron?: boolean;
  /** Use True Node or Mean Node (default: true = True Node) */
  useTrueNode?: boolean;
}

// ============================================================================
// Error Types
// ============================================================================

export class CalculationError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'CalculationError';
  }
}

export class InvalidBirthDataError extends CalculationError {
  constructor(message: string, details?: unknown) {
    super(message, 'INVALID_BIRTH_DATA', details);
    this.name = 'InvalidBirthDataError';
  }
}

export class EphemerisError extends CalculationError {
  constructor(message: string, details?: unknown) {
    super(message, 'EPHEMERIS_ERROR', details);
    this.name = 'EphemerisError';
  }
}
