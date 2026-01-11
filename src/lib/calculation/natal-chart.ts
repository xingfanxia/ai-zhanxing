/**
 * Natal Chart Calculator
 *
 * Main module for calculating complete natal charts, combining ephemeris calculations,
 * house cusps, and aspect analysis into a comprehensive birth chart.
 */

import {
  BirthData,
  NatalChart,
  Planet,
  PlanetPosition,
  HouseCusps,
  CalculationOptions,
  PLANETS,
  InvalidBirthDataError,
  ZODIAC_SIGNS,
  ZodiacSign
} from './types';
import {
  parseDateTimeToJulianDay,
  getTimezoneOffset,
  localToUTC,
  dateToJulianDay
} from './julian-day';
import {
  initEphemeris,
  calculateAllPlanetPositions,
  calculateHouseCusps,
  longitudeToZodiac,
  getHouseForPlanet
} from './ephemeris';
import { calculateAllAspects } from './aspects';

// ============================================================================
// Birth Data Validation
// ============================================================================

/**
 * Validate birth data input
 *
 * @param birthData - Birth data to validate
 * @throws InvalidBirthDataError if data is invalid
 */
function validateBirthData(birthData: BirthData): void {
  // Validate date format
  if (!birthData.date || !/^\d{4}-\d{2}-\d{2}$/.test(birthData.date)) {
    throw new InvalidBirthDataError(
      `Invalid date format: ${birthData.date}. Expected YYYY-MM-DD`
    );
  }

  // Validate time format if provided
  if (birthData.time && !/^\d{2}:\d{2}(:\d{2})?$/.test(birthData.time)) {
    throw new InvalidBirthDataError(
      `Invalid time format: ${birthData.time}. Expected HH:MM or HH:MM:SS`
    );
  }

  // Validate latitude
  if (birthData.latitude < -90 || birthData.latitude > 90) {
    throw new InvalidBirthDataError(
      `Invalid latitude: ${birthData.latitude}. Must be between -90 and 90`
    );
  }

  // Validate longitude
  if (birthData.longitude < -180 || birthData.longitude > 180) {
    throw new InvalidBirthDataError(
      `Invalid longitude: ${birthData.longitude}. Must be between -180 and 180`
    );
  }

  // Validate timezone
  try {
    Intl.DateTimeFormat(undefined, { timeZone: birthData.timezone });
  } catch {
    throw new InvalidBirthDataError(
      `Invalid timezone: ${birthData.timezone}. Must be a valid IANA timezone`
    );
  }
}

// ============================================================================
// Default Options
// ============================================================================

const DEFAULT_OPTIONS: Required<CalculationOptions> = {
  houseSystem: 'Placidus',
  includeMinorAspects: false,
  customOrbs: {},
  includeChiron: true,
  useTrueNode: true
};

// ============================================================================
// Main Calculator
// ============================================================================

/**
 * Calculate a complete natal chart
 *
 * @param birthData - Birth data (date, time, location, timezone)
 * @param options - Calculation options
 * @returns Complete natal chart data
 */
export function calculateNatalChart(
  birthData: BirthData,
  options: CalculationOptions = {}
): NatalChart {
  // Merge options with defaults
  const opts: Required<CalculationOptions> = { ...DEFAULT_OPTIONS, ...options };

  // Validate birth data
  validateBirthData(birthData);

  // Initialize ephemeris
  initEphemeris();

  // Parse date components
  const dateParts = birthData.date.split('-');
  const year = parseInt(dateParts[0], 10);
  const month = parseInt(dateParts[1], 10);
  const day = parseInt(dateParts[2], 10);

  // Parse time components (default to noon if unknown)
  let hour = 12;
  let minute = 0;
  let second = 0;

  if (birthData.time && !birthData.timeUnknown) {
    const timeParts = birthData.time.split(':');
    hour = parseInt(timeParts[0], 10);
    minute = parseInt(timeParts[1], 10);
    second = timeParts.length > 2 ? parseInt(timeParts[2], 10) : 0;
  }

  // Convert local time to UTC
  const utc = localToUTC(year, month, day, hour, minute, second, birthData.timezone);

  // Calculate Julian Day
  const { jdET, jdUT } = dateToJulianDay(
    utc.year, utc.month, utc.day, utc.hour, utc.minute, utc.second
  );

  // Determine which planets to calculate
  const planetsToCalculate: Planet[] = opts.includeChiron
    ? [...PLANETS]
    : PLANETS.filter(p => p !== 'Chiron');

  // Calculate all planet positions
  const planets = calculateAllPlanetPositions(jdET, planetsToCalculate, opts.useTrueNode);

  // Calculate house cusps
  const houses = calculateHouseCusps(
    jdUT,
    birthData.latitude,
    birthData.longitude,
    opts.houseSystem
  );

  // Calculate ascendant and midheaven details
  const ascZodiac = longitudeToZodiac(houses.ascendant);
  const mcZodiac = longitudeToZodiac(houses.midheaven);

  // Calculate all aspects
  const aspects = calculateAllAspects(
    planets,
    opts.includeMinorAspects,
    opts.customOrbs
  );

  // Build and return the natal chart
  return {
    birthData,
    julianDay: jdUT,
    planets,
    houses,
    ascendant: {
      longitude: houses.ascendant,
      sign: ascZodiac.sign,
      degreeInSign: ascZodiac.degreeInSign
    },
    midheaven: {
      longitude: houses.midheaven,
      sign: mcZodiac.sign,
      degreeInSign: mcZodiac.degreeInSign
    },
    aspects,
    calculatedAt: new Date()
  };
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Calculate a chart using noon as default time (for unknown birth times)
 *
 * @param date - Date string (YYYY-MM-DD)
 * @param latitude - Geographic latitude
 * @param longitude - Geographic longitude
 * @param timezone - IANA timezone
 * @param options - Calculation options
 * @returns Natal chart (with noon time)
 */
export function calculateNoonChart(
  date: string,
  latitude: number,
  longitude: number,
  timezone: string,
  options: CalculationOptions = {}
): NatalChart {
  return calculateNatalChart({
    date,
    time: '12:00:00',
    latitude,
    longitude,
    timezone,
    timeUnknown: true
  }, options);
}

/**
 * Get the house placement for each planet
 *
 * @param chart - Natal chart
 * @returns Record of planet to house number
 */
export function getPlanetHousePlacements(chart: NatalChart): Record<Planet, number> {
  const placements: Partial<Record<Planet, number>> = {};

  for (const [planet, position] of Object.entries(chart.planets)) {
    placements[planet as Planet] = getHouseForPlanet(position.longitude, chart.houses.cusps);
  }

  return placements as Record<Planet, number>;
}

/**
 * Get planets in a specific house
 *
 * @param chart - Natal chart
 * @param houseNumber - House number (1-12)
 * @returns Array of planets in that house
 */
export function getPlanetsInHouse(chart: NatalChart, houseNumber: number): Planet[] {
  const placements = getPlanetHousePlacements(chart);
  return Object.entries(placements)
    .filter(([, house]) => house === houseNumber)
    .map(([planet]) => planet as Planet);
}

/**
 * Get planets in a specific sign
 *
 * @param chart - Natal chart
 * @param sign - Zodiac sign
 * @returns Array of planets in that sign
 */
export function getPlanetsInSign(chart: NatalChart, sign: ZodiacSign): Planet[] {
  return Object.entries(chart.planets)
    .filter(([, position]) => position.sign === sign)
    .map(([planet]) => planet as Planet);
}

/**
 * Get element distribution (Fire, Earth, Air, Water)
 *
 * @param chart - Natal chart
 * @returns Count of planets in each element
 */
export function getElementDistribution(chart: NatalChart): Record<string, number> {
  const elements: Record<string, ZodiacSign[]> = {
    Fire: ['Aries', 'Leo', 'Sagittarius'],
    Earth: ['Taurus', 'Virgo', 'Capricorn'],
    Air: ['Gemini', 'Libra', 'Aquarius'],
    Water: ['Cancer', 'Scorpio', 'Pisces']
  };

  const distribution: Record<string, number> = { Fire: 0, Earth: 0, Air: 0, Water: 0 };

  for (const position of Object.values(chart.planets)) {
    for (const [element, signs] of Object.entries(elements)) {
      if (signs.includes(position.sign)) {
        distribution[element]++;
        break;
      }
    }
  }

  return distribution;
}

/**
 * Get modality distribution (Cardinal, Fixed, Mutable)
 *
 * @param chart - Natal chart
 * @returns Count of planets in each modality
 */
export function getModalityDistribution(chart: NatalChart): Record<string, number> {
  const modalities: Record<string, ZodiacSign[]> = {
    Cardinal: ['Aries', 'Cancer', 'Libra', 'Capricorn'],
    Fixed: ['Taurus', 'Leo', 'Scorpio', 'Aquarius'],
    Mutable: ['Gemini', 'Virgo', 'Sagittarius', 'Pisces']
  };

  const distribution: Record<string, number> = { Cardinal: 0, Fixed: 0, Mutable: 0 };

  for (const position of Object.values(chart.planets)) {
    for (const [modality, signs] of Object.entries(modalities)) {
      if (signs.includes(position.sign)) {
        distribution[modality]++;
        break;
      }
    }
  }

  return distribution;
}

/**
 * Get all retrograde planets in the chart
 *
 * @param chart - Natal chart
 * @returns Array of retrograde planet names
 */
export function getRetrogradePlanetsInChart(chart: NatalChart): Planet[] {
  return Object.entries(chart.planets)
    .filter(([, position]) => position.retrograde)
    .map(([planet]) => planet as Planet);
}

/**
 * Create a summary of the natal chart
 *
 * @param chart - Natal chart
 * @returns Summary object
 */
export function createChartSummary(chart: NatalChart): {
  sunSign: ZodiacSign;
  moonSign: ZodiacSign;
  risingSign: ZodiacSign;
  dominantElement: string;
  dominantModality: string;
  retrogradeCount: number;
  aspectCount: number;
} {
  const elements = getElementDistribution(chart);
  const modalities = getModalityDistribution(chart);

  const dominantElement = Object.entries(elements)
    .reduce((a, b) => a[1] > b[1] ? a : b)[0];

  const dominantModality = Object.entries(modalities)
    .reduce((a, b) => a[1] > b[1] ? a : b)[0];

  return {
    sunSign: chart.planets.Sun.sign,
    moonSign: chart.planets.Moon.sign,
    risingSign: chart.ascendant.sign,
    dominantElement,
    dominantModality,
    retrogradeCount: getRetrogradePlanetsInChart(chart).length,
    aspectCount: chart.aspects.length
  };
}
