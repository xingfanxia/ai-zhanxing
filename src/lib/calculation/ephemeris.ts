/**
 * Swiss Ephemeris wrapper for astrological calculations
 *
 * Provides high-level functions for calculating planet positions and house cusps
 * using the Swiss Ephemeris library (sweph).
 *
 * @server-only - This module uses native bindings and can only run on the server
 */

import 'server-only';
import sweph from 'sweph';
import {
  Planet,
  PlanetPosition,
  HouseCusps,
  HouseSystem,
  ZodiacSign,
  ZODIAC_SIGNS,
  HOUSE_SYSTEM_CODES,
  EphemerisError
} from './types';

const { constants, calc, houses_ex2, set_ephe_path, close } = sweph;

// ============================================================================
// Planet ID Mapping
// ============================================================================

/** Swiss Ephemeris planet IDs */
const PLANET_IDS: Record<Planet, number> = {
  'Sun': constants.SE_SUN,
  'Moon': constants.SE_MOON,
  'Mercury': constants.SE_MERCURY,
  'Venus': constants.SE_VENUS,
  'Mars': constants.SE_MARS,
  'Jupiter': constants.SE_JUPITER,
  'Saturn': constants.SE_SATURN,
  'Uranus': constants.SE_URANUS,
  'Neptune': constants.SE_NEPTUNE,
  'Pluto': constants.SE_PLUTO,
  'NorthNode': constants.SE_TRUE_NODE,
  'SouthNode': constants.SE_TRUE_NODE, // Calculated as opposite of North Node
  'Chiron': constants.SE_CHIRON
};

// ============================================================================
// Initialization
// ============================================================================

let isInitialized = false;

/**
 * Initialize the Swiss Ephemeris
 *
 * @param ephePath - Path to ephemeris data files (optional)
 */
export function initEphemeris(ephePath?: string): void {
  if (isInitialized) return;

  if (ephePath) {
    set_ephe_path(ephePath);
  }

  isInitialized = true;
}

/**
 * Close the Swiss Ephemeris and cleanup resources
 */
export function closeEphemeris(): void {
  close();
  isInitialized = false;
}

// ============================================================================
// Coordinate Conversion
// ============================================================================

/**
 * Convert ecliptic longitude to zodiac sign and degree
 *
 * @param longitude - Ecliptic longitude (0-360)
 * @returns Sign, degree, minutes, and seconds within sign
 */
export function longitudeToZodiac(longitude: number): {
  sign: ZodiacSign;
  degreeInSign: number;
  minutes: number;
  seconds: number;
} {
  // Normalize longitude to 0-360
  let normalizedLon = longitude % 360;
  if (normalizedLon < 0) normalizedLon += 360;

  // Calculate sign index (0-11)
  const signIndex = Math.floor(normalizedLon / 30);

  // Calculate degree within sign (0-29.999...)
  const degreeTotal = normalizedLon % 30;
  const degreeInSign = Math.floor(degreeTotal);

  // Calculate minutes and seconds
  const minutesTotal = (degreeTotal - degreeInSign) * 60;
  const minutes = Math.floor(minutesTotal);
  const seconds = Math.round((minutesTotal - minutes) * 60);

  return {
    sign: ZODIAC_SIGNS[signIndex],
    degreeInSign,
    minutes,
    seconds
  };
}

// ============================================================================
// Planet Position Calculation
// ============================================================================

/**
 * Calculate planet position for a given Julian Day (Ephemeris Time)
 *
 * @param jdET - Julian Day in Ephemeris Time
 * @param planet - Planet to calculate
 * @param useTrueNode - Use True Node instead of Mean Node (default: true)
 * @returns Planet position data
 */
export function calculatePlanetPosition(
  jdET: number,
  planet: Planet,
  useTrueNode: boolean = true
): PlanetPosition {
  // Ensure ephemeris is initialized
  if (!isInitialized) {
    initEphemeris();
  }

  // Get planet ID
  let planetId = PLANET_IDS[planet];

  // Handle node type
  if (planet === 'NorthNode' || planet === 'SouthNode') {
    planetId = useTrueNode ? constants.SE_TRUE_NODE : constants.SE_MEAN_NODE;
  }

  // Calculate flags: use Swiss Ephemeris + get speed
  const flags = constants.SEFLG_SWIEPH | constants.SEFLG_SPEED;

  // Call Swiss Ephemeris
  const result = calc(jdET, planetId, flags);

  if (result.flag === constants.ERR) {
    throw new EphemerisError(
      `Failed to calculate position for ${planet}: ${result.error}`,
      { planet, jdET }
    );
  }

  // Extract results
  let [longitude, latitude, distance, speed] = result.data;

  // For South Node, calculate opposite of North Node
  if (planet === 'SouthNode') {
    longitude = (longitude + 180) % 360;
    // South Node has same absolute speed but opposite direction conceptually
  }

  // Detect retrograde (negative speed)
  const retrograde = speed < 0;

  // Convert to zodiac position
  const zodiacPos = longitudeToZodiac(longitude);

  return {
    planet,
    longitude,
    latitude,
    distance,
    speed,
    retrograde,
    sign: zodiacPos.sign,
    degreeInSign: zodiacPos.degreeInSign,
    minutes: zodiacPos.minutes,
    seconds: zodiacPos.seconds
  };
}

/**
 * Calculate positions for all specified planets
 *
 * @param jdET - Julian Day in Ephemeris Time
 * @param planets - Array of planets to calculate
 * @param useTrueNode - Use True Node instead of Mean Node
 * @returns Record of planet positions
 */
export function calculateAllPlanetPositions(
  jdET: number,
  planets: Planet[],
  useTrueNode: boolean = true
): Record<Planet, PlanetPosition> {
  const positions: Partial<Record<Planet, PlanetPosition>> = {};

  for (const planet of planets) {
    positions[planet] = calculatePlanetPosition(jdET, planet, useTrueNode);
  }

  return positions as Record<Planet, PlanetPosition>;
}

// ============================================================================
// House Cusp Calculation
// ============================================================================

/**
 * Calculate house cusps and angles
 *
 * @param jdUT - Julian Day in Universal Time
 * @param latitude - Geographic latitude
 * @param longitude - Geographic longitude
 * @param system - House system to use
 * @returns House cusps and angles
 */
export function calculateHouseCusps(
  jdUT: number,
  latitude: number,
  longitude: number,
  system: HouseSystem = 'Placidus'
): HouseCusps {
  // Ensure ephemeris is initialized
  if (!isInitialized) {
    initEphemeris();
  }

  // Validate latitude for certain house systems
  if ((system === 'Placidus' || system === 'Koch') && Math.abs(latitude) > 66) {
    // Fallback to Equal houses for extreme latitudes
    console.warn(
      `${system} house system fails at latitude ${latitude}. Falling back to Equal houses.`
    );
    system = 'Equal';
  }

  const hsysCode = HOUSE_SYSTEM_CODES[system];

  // Calculate houses using Swiss Ephemeris
  const result = houses_ex2(jdUT, 0, latitude, longitude, hsysCode);

  if (result.flag !== constants.OK) {
    throw new EphemerisError(
      `Failed to calculate house cusps: ${result.error}`,
      { jdUT, latitude, longitude, system }
    );
  }

  // Extract house cusps (sweph returns 12 houses)
  const cusps = result.data.houses.slice(0, 12);

  // Extract angles
  const ascendant = result.data.points[0]; // ASC
  const midheaven = result.data.points[1]; // MC

  // Calculate opposite points
  const descendant = (ascendant + 180) % 360;
  const ic = (midheaven + 180) % 360;
  const vertex = result.data.points[3]; // Vertex

  return {
    system,
    cusps,
    ascendant,
    midheaven,
    descendant,
    ic,
    vertex
  };
}

/**
 * Determine which house a planet is in
 *
 * @param longitude - Planet's ecliptic longitude
 * @param cusps - Array of 12 house cusp longitudes
 * @returns House number (1-12)
 */
export function getHouseForPlanet(longitude: number, cusps: number[]): number {
  // Normalize longitude
  let lon = longitude % 360;
  if (lon < 0) lon += 360;

  for (let i = 0; i < 12; i++) {
    const nextIndex = (i + 1) % 12;
    let cuspStart = cusps[i];
    let cuspEnd = cusps[nextIndex];

    // Handle wrap-around (e.g., cusp at 350 and next at 20)
    if (cuspEnd < cuspStart) {
      // Crosses 0 degrees
      if (lon >= cuspStart || lon < cuspEnd) {
        return i + 1;
      }
    } else {
      if (lon >= cuspStart && lon < cuspEnd) {
        return i + 1;
      }
    }
  }

  // Fallback (should not reach here)
  return 1;
}

// ============================================================================
// Retrograde Detection
// ============================================================================

/**
 * Check if a planet is retrograde at a given time
 *
 * @param jdET - Julian Day in Ephemeris Time
 * @param planet - Planet to check
 * @returns Whether the planet is retrograde
 */
export function isPlanetRetrograde(jdET: number, planet: Planet): boolean {
  const position = calculatePlanetPosition(jdET, planet);
  return position.retrograde;
}

/**
 * Get all retrograde planets at a given time
 *
 * @param jdET - Julian Day in Ephemeris Time
 * @param planets - Planets to check
 * @returns Array of retrograde planet names
 */
export function getRetrogradePlanets(jdET: number, planets: Planet[]): Planet[] {
  return planets.filter(planet => {
    // Sun and Moon never go retrograde
    if (planet === 'Sun' || planet === 'Moon') return false;
    return isPlanetRetrograde(jdET, planet);
  });
}
