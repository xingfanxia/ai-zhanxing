/**
 * Astrology Calculation Module
 *
 * Core calculation engine for Western astrology, providing:
 * - Natal chart calculation using Swiss Ephemeris
 * - Planet positions with retrograde detection
 * - Multiple house systems (Placidus, Whole Sign, Koch, Equal, etc.)
 * - Aspect calculation with applying/separating detection
 * - Julian Day and timezone conversions
 *
 * @example
 * ```typescript
 * import { calculateNatalChart, BirthData } from '@/lib/calculation';
 *
 * const birthData: BirthData = {
 *   date: '1990-06-15',
 *   time: '14:30:00',
 *   latitude: 40.7128,
 *   longitude: -74.0060,
 *   timezone: 'America/New_York'
 * };
 *
 * const chart = calculateNatalChart(birthData, {
 *   houseSystem: 'Placidus',
 *   includeMinorAspects: false
 * });
 *
 * console.log(`Sun in ${chart.planets.Sun.sign}`);
 * console.log(`Moon in ${chart.planets.Moon.sign}`);
 * console.log(`Rising: ${chart.ascendant.sign}`);
 * ```
 */

// ============================================================================
// Type Exports
// ============================================================================

export type {
  ZodiacSign,
  Planet,
  HouseSystem,
  AspectType,
  AspectDefinition,
  BirthData,
  PlanetPosition,
  HouseCusps,
  Aspect,
  NatalChart,
  CalculationOptions
} from './types';

export {
  ZODIAC_SIGNS,
  PLANETS,
  HOUSE_SYSTEM_CODES,
  ASPECT_DEFINITIONS,
  CalculationError,
  InvalidBirthDataError,
  EphemerisError
} from './types';

// ============================================================================
// Julian Day Exports
// ============================================================================

export {
  dateToJulianDay,
  julianDayToDate,
  parseDateTimeToJulianDay,
  getDeltaT,
  getDeltaTSeconds,
  getLMTOffset,
  utcToLMT,
  lmtToUTC,
  getTimezoneOffset,
  localToUTC,
  getGMST,
  getLST
} from './julian-day';

// ============================================================================
// Ephemeris Exports
// ============================================================================

export {
  initEphemeris,
  closeEphemeris,
  longitudeToZodiac,
  calculatePlanetPosition,
  calculateAllPlanetPositions,
  calculateHouseCusps,
  getHouseForPlanet,
  isPlanetRetrograde,
  getRetrogradePlanets
} from './ephemeris';

// ============================================================================
// Aspect Exports
// ============================================================================

export {
  calculateAngularSeparation,
  normalizeAngle,
  findMatchingAspect,
  calculateAspect,
  isAspectApplying,
  calculateAllAspects,
  getAspectsForPlanet,
  getAspectsByType,
  getMajorAspects,
  getApplyingAspects,
  calculateTenseness,
  getStrongestAspect,
  countAspectsByType
} from './aspects';

// ============================================================================
// Natal Chart Exports
// ============================================================================

export {
  calculateNatalChart,
  calculateNoonChart,
  getPlanetHousePlacements,
  getPlanetsInHouse,
  getPlanetsInSign,
  getElementDistribution,
  getModalityDistribution,
  getRetrogradePlanetsInChart,
  createChartSummary
} from './natal-chart';
