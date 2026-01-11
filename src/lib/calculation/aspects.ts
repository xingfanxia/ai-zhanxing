/**
 * Aspect calculation utilities
 *
 * Calculates astrological aspects between planetary positions, including
 * aspect type, orb, applying/separating status, and strength.
 */

import {
  Aspect,
  AspectType,
  AspectDefinition,
  ASPECT_DEFINITIONS,
  Planet,
  PlanetPosition
} from './types';

// ============================================================================
// Angle Calculation
// ============================================================================

/**
 * Calculate the angular separation between two longitudes
 *
 * @param lon1 - First longitude (0-360)
 * @param lon2 - Second longitude (0-360)
 * @returns Angular separation (0-180)
 */
export function calculateAngularSeparation(lon1: number, lon2: number): number {
  let diff = Math.abs(lon1 - lon2);
  if (diff > 180) {
    diff = 360 - diff;
  }
  return diff;
}

/**
 * Normalize an angle to 0-360 range
 *
 * @param angle - Angle in degrees
 * @returns Normalized angle (0-360)
 */
export function normalizeAngle(angle: number): number {
  let normalized = angle % 360;
  if (normalized < 0) normalized += 360;
  return normalized;
}

// ============================================================================
// Aspect Detection
// ============================================================================

/**
 * Find which aspect type matches a given angular separation
 *
 * @param angle - Angular separation between two planets
 * @param definitions - Aspect definitions to check against
 * @param customOrbs - Optional custom orb values
 * @returns Matching aspect definition and orb, or null if no match
 */
export function findMatchingAspect(
  angle: number,
  definitions: AspectDefinition[],
  customOrbs?: Partial<Record<AspectType, number>>
): { definition: AspectDefinition; orb: number } | null {
  for (const def of definitions) {
    const maxOrb = customOrbs?.[def.type] ?? def.defaultOrb;
    const orb = Math.abs(angle - def.angle);

    if (orb <= maxOrb) {
      return { definition: def, orb };
    }
  }

  return null;
}

/**
 * Calculate aspect between two planet positions
 *
 * @param pos1 - First planet position
 * @param pos2 - Second planet position
 * @param includeMinor - Include minor aspects
 * @param customOrbs - Optional custom orb values
 * @returns Aspect data or null if no aspect
 */
export function calculateAspect(
  pos1: PlanetPosition,
  pos2: PlanetPosition,
  includeMinor: boolean = false,
  customOrbs?: Partial<Record<AspectType, number>>
): Aspect | null {
  // Don't calculate aspect between same planet
  if (pos1.planet === pos2.planet) {
    return null;
  }

  // Calculate angular separation
  const actualAngle = calculateAngularSeparation(pos1.longitude, pos2.longitude);

  // Filter definitions based on whether to include minor aspects
  const definitions = includeMinor
    ? ASPECT_DEFINITIONS
    : ASPECT_DEFINITIONS.filter(d => d.isMajor);

  // Find matching aspect
  const match = findMatchingAspect(actualAngle, definitions, customOrbs);

  if (!match) {
    return null;
  }

  // Determine if applying or separating
  const applying = isAspectApplying(pos1, pos2, match.definition.angle);

  // Calculate strength (1 = exact, 0 = at orb limit)
  const maxOrb = customOrbs?.[match.definition.type] ?? match.definition.defaultOrb;
  const strength = 1 - (match.orb / maxOrb);

  return {
    planet1: pos1.planet,
    planet2: pos2.planet,
    type: match.definition.type,
    exactAngle: match.definition.angle,
    actualAngle,
    orb: Math.round(match.orb * 100) / 100, // Round to 2 decimal places
    applying,
    strength: Math.round(strength * 100) / 100
  };
}

// ============================================================================
// Applying vs Separating
// ============================================================================

/**
 * Determine if an aspect is applying (getting closer) or separating
 *
 * @param pos1 - First planet position
 * @param pos2 - Second planet position
 * @param exactAngle - The exact angle of the aspect (e.g., 90 for square)
 * @returns True if applying, false if separating
 */
export function isAspectApplying(
  pos1: PlanetPosition,
  pos2: PlanetPosition,
  exactAngle: number
): boolean {
  // Calculate current separation
  const currentSep = calculateAngularSeparation(pos1.longitude, pos2.longitude);

  // Calculate future positions (small time step forward)
  // Using daily speeds, project 0.1 days ahead
  const futureTime = 0.1;
  const futureLon1 = normalizeAngle(pos1.longitude + (pos1.speed * futureTime));
  const futureLon2 = normalizeAngle(pos2.longitude + (pos2.speed * futureTime));

  // Calculate future separation
  const futureSep = calculateAngularSeparation(futureLon1, futureLon2);

  // Calculate current and future orbs (distance from exact aspect)
  const currentOrb = Math.abs(currentSep - exactAngle);
  const futureOrb = Math.abs(futureSep - exactAngle);

  // If future orb is smaller, aspect is applying
  return futureOrb < currentOrb;
}

// ============================================================================
// Chart-wide Aspect Calculation
// ============================================================================

/**
 * Calculate all aspects between a set of planet positions
 *
 * @param positions - Record of planet positions
 * @param includeMinor - Include minor aspects
 * @param customOrbs - Optional custom orb values
 * @returns Array of all aspects found
 */
export function calculateAllAspects(
  positions: Record<Planet, PlanetPosition>,
  includeMinor: boolean = false,
  customOrbs?: Partial<Record<AspectType, number>>
): Aspect[] {
  const aspects: Aspect[] = [];
  const planets = Object.keys(positions) as Planet[];

  // Calculate aspects between all planet pairs
  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const pos1 = positions[planets[i]];
      const pos2 = positions[planets[j]];

      const aspect = calculateAspect(pos1, pos2, includeMinor, customOrbs);

      if (aspect) {
        aspects.push(aspect);
      }
    }
  }

  // Sort by strength (strongest first)
  aspects.sort((a, b) => b.strength - a.strength);

  return aspects;
}

/**
 * Get aspects for a specific planet
 *
 * @param planet - Planet to get aspects for
 * @param allAspects - Array of all aspects in chart
 * @returns Aspects involving the specified planet
 */
export function getAspectsForPlanet(planet: Planet, allAspects: Aspect[]): Aspect[] {
  return allAspects.filter(
    aspect => aspect.planet1 === planet || aspect.planet2 === planet
  );
}

/**
 * Get aspects of a specific type
 *
 * @param aspectType - Type of aspect to find
 * @param allAspects - Array of all aspects in chart
 * @returns Aspects of the specified type
 */
export function getAspectsByType(aspectType: AspectType, allAspects: Aspect[]): Aspect[] {
  return allAspects.filter(aspect => aspect.type === aspectType);
}

/**
 * Get only major aspects
 *
 * @param allAspects - Array of all aspects in chart
 * @returns Only major aspects (conjunction, opposition, trine, square, sextile)
 */
export function getMajorAspects(allAspects: Aspect[]): Aspect[] {
  const majorTypes: AspectType[] = ['Conjunction', 'Opposition', 'Trine', 'Square', 'Sextile'];
  return allAspects.filter(aspect => majorTypes.includes(aspect.type));
}

/**
 * Get only applying aspects
 *
 * @param allAspects - Array of all aspects in chart
 * @returns Only aspects that are applying
 */
export function getApplyingAspects(allAspects: Aspect[]): Aspect[] {
  return allAspects.filter(aspect => aspect.applying);
}

// ============================================================================
// Aspect Strength Utilities
// ============================================================================

/**
 * Calculate the overall "tenseness" of aspects
 * (Higher = more challenging aspects)
 *
 * @param aspects - Array of aspects
 * @returns Tenseness score (0-1)
 */
export function calculateTenseness(aspects: Aspect[]): number {
  if (aspects.length === 0) return 0;

  const challengingTypes: AspectType[] = ['Opposition', 'Square', 'SemiSquare', 'Sesquiquadrate', 'Quincunx'];

  const challengingAspects = aspects.filter(a => challengingTypes.includes(a.type));
  const challengingStrength = challengingAspects.reduce((sum, a) => sum + a.strength, 0);
  const totalStrength = aspects.reduce((sum, a) => sum + a.strength, 0);

  return totalStrength > 0 ? challengingStrength / totalStrength : 0;
}

/**
 * Get the strongest aspect in a set
 *
 * @param aspects - Array of aspects
 * @returns Strongest aspect or null if empty
 */
export function getStrongestAspect(aspects: Aspect[]): Aspect | null {
  if (aspects.length === 0) return null;
  return aspects.reduce((strongest, current) =>
    current.strength > strongest.strength ? current : strongest
  );
}

/**
 * Count aspects by type
 *
 * @param aspects - Array of aspects
 * @returns Record of aspect type counts
 */
export function countAspectsByType(aspects: Aspect[]): Record<AspectType, number> {
  const counts: Partial<Record<AspectType, number>> = {};

  for (const aspect of aspects) {
    counts[aspect.type] = (counts[aspect.type] || 0) + 1;
  }

  // Initialize all types with 0 if not present
  for (const def of ASPECT_DEFINITIONS) {
    if (!(def.type in counts)) {
      counts[def.type] = 0;
    }
  }

  return counts as Record<AspectType, number>;
}
