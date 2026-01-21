/**
 * Synastry Calculation Module
 *
 * Calculates inter-chart aspects between two natal charts for relationship
 * compatibility analysis. Synastry compares planetary positions from two
 * different charts to identify harmony and tension points.
 */

import {
  Aspect,
  AspectType,
  ASPECT_DEFINITIONS,
  Planet,
  PlanetPosition,
  NatalChart,
} from './types';
import {
  calculateAngularSeparation,
  findMatchingAspect,
  isAspectApplying,
} from './aspects';

// ============================================================================
// Synastry Types
// ============================================================================

/**
 * Represents an inter-chart aspect between two people's planets
 */
export interface SynastryAspect extends Aspect {
  /** Indicates which person's planet is planet1 */
  person1Planet: Planet;
  /** Indicates which person's planet is planet2 */
  person2Planet: Planet;
  /** Category of the aspect for interpretation */
  category: SynastryCategory;
}

/**
 * Categories for synastry aspects based on planets involved
 */
export type SynastryCategory =
  | 'emotional' // Moon aspects
  | 'romantic' // Venus aspects
  | 'physical' // Mars aspects
  | 'identity' // Sun aspects
  | 'communication' // Mercury aspects
  | 'growth' // Jupiter aspects
  | 'challenge' // Saturn aspects
  | 'transformation' // Outer planet aspects
  | 'karmic'; // Node aspects

/**
 * Complete synastry result
 */
export interface SynastryResult {
  /** Person 1's chart */
  chart1: NatalChart;
  /** Person 2's chart */
  chart2: NatalChart;
  /** All inter-chart aspects */
  aspects: SynastryAspect[];
  /** Compatibility scores by category */
  scores: SynastryScores;
  /** Key aspects for interpretation */
  keyAspects: SynastryAspect[];
  /** Overall compatibility summary */
  summary: SynastrySummary;
  /** Calculation timestamp */
  calculatedAt: Date;
}

/**
 * Compatibility scores broken down by category
 */
export interface SynastryScores {
  overall: number;
  emotional: number;
  romantic: number;
  physical: number;
  communication: number;
  growth: number;
  stability: number;
}

/**
 * Summary of the synastry analysis
 */
export interface SynastrySummary {
  totalAspects: number;
  harmonious: number;
  challenging: number;
  neutral: number;
  strongestConnection: SynastryAspect | null;
  mainChallenge: SynastryAspect | null;
}

// ============================================================================
// Key Synastry Pairs
// ============================================================================

/**
 * Important planet pairs for synastry analysis
 * These are weighted more heavily in compatibility scores
 */
const KEY_SYNASTRY_PAIRS: Array<[Planet, Planet, number]> = [
  // Romantic/Emotional Core (highest weight)
  ['Sun', 'Moon', 10], // Emotional harmony
  ['Moon', 'Moon', 9], // Emotional compatibility
  ['Venus', 'Mars', 9], // Physical attraction
  ['Sun', 'Venus', 8], // Romantic appreciation
  ['Moon', 'Venus', 8], // Emotional affection

  // Identity & Expression
  ['Sun', 'Sun', 7], // Identity alignment
  ['Sun', 'Mars', 6], // Drive compatibility
  ['Mercury', 'Mercury', 6], // Communication style

  // Growth & Support
  ['Sun', 'Jupiter', 5], // Growth support
  ['Moon', 'Jupiter', 5], // Emotional expansion
  ['Venus', 'Jupiter', 5], // Joy together

  // Challenges & Structure
  ['Sun', 'Saturn', 4], // Commitment/restrictions
  ['Moon', 'Saturn', 4], // Emotional security
  ['Venus', 'Saturn', 4], // Love commitment

  // Transformation
  ['Sun', 'Pluto', 3], // Power dynamics
  ['Moon', 'Pluto', 3], // Deep emotional bonds
  ['Venus', 'Pluto', 3], // Intense attraction

  // Karmic connections
  ['Sun', 'NorthNode', 3], // Destiny connection
  ['Moon', 'NorthNode', 3], // Emotional growth path
];

// ============================================================================
// Aspect Nature Classification
// ============================================================================

const HARMONIOUS_ASPECTS: AspectType[] = ['Conjunction', 'Trine', 'Sextile'];
const CHALLENGING_ASPECTS: AspectType[] = ['Opposition', 'Square', 'Quincunx'];
const NEUTRAL_ASPECTS: AspectType[] = ['SemiSextile', 'SemiSquare', 'Sesquiquadrate', 'Quintile'];

// Conjunction can be harmonious or challenging depending on planets
const CHALLENGING_CONJUNCTIONS: [Planet, Planet][] = [
  ['Mars', 'Saturn'],
  ['Sun', 'Pluto'],
  ['Moon', 'Pluto'],
  ['Mars', 'Pluto'],
];

// ============================================================================
// Main Synastry Functions
// ============================================================================

/**
 * Calculate all synastry aspects between two natal charts
 *
 * @param chart1 - First person's natal chart
 * @param chart2 - Second person's natal chart
 * @param includeMinor - Whether to include minor aspects
 * @returns Array of synastry aspects
 */
export function calculateSynastryAspects(
  chart1: NatalChart,
  chart2: NatalChart,
  includeMinor: boolean = false
): SynastryAspect[] {
  const aspects: SynastryAspect[] = [];
  const definitions = includeMinor
    ? ASPECT_DEFINITIONS
    : ASPECT_DEFINITIONS.filter(d => d.isMajor);

  const planets1 = Object.entries(chart1.planets) as [Planet, PlanetPosition][];
  const planets2 = Object.entries(chart2.planets) as [Planet, PlanetPosition][];

  for (const [planet1Name, pos1] of planets1) {
    for (const [planet2Name, pos2] of planets2) {
      const actualAngle = calculateAngularSeparation(pos1.longitude, pos2.longitude);
      const match = findMatchingAspect(actualAngle, definitions);

      if (match) {
        const applying = isAspectApplying(pos1, pos2, match.definition.angle);
        const maxOrb = match.definition.defaultOrb;
        const strength = 1 - (match.orb / maxOrb);

        aspects.push({
          planet1: planet1Name,
          planet2: planet2Name,
          person1Planet: planet1Name,
          person2Planet: planet2Name,
          type: match.definition.type,
          exactAngle: match.definition.angle,
          actualAngle,
          orb: Math.round(match.orb * 100) / 100,
          applying,
          strength: Math.round(strength * 100) / 100,
          category: categorizeAspect(planet1Name, planet2Name),
        });
      }
    }
  }

  // Sort by strength
  aspects.sort((a, b) => b.strength - a.strength);

  return aspects;
}

/**
 * Categorize an aspect based on the planets involved
 */
function categorizeAspect(planet1: Planet, planet2: Planet): SynastryCategory {
  const planets = [planet1, planet2];

  if (planets.includes('Moon')) return 'emotional';
  if (planets.includes('Venus')) return 'romantic';
  if (planets.includes('Mars')) return 'physical';
  if (planets.includes('Sun')) return 'identity';
  if (planets.includes('Mercury')) return 'communication';
  if (planets.includes('Jupiter')) return 'growth';
  if (planets.includes('Saturn')) return 'challenge';
  if (planets.includes('NorthNode') || planets.includes('SouthNode')) return 'karmic';
  return 'transformation';
}

/**
 * Calculate compatibility scores from synastry aspects
 */
export function calculateCompatibilityScores(aspects: SynastryAspect[]): SynastryScores {
  const scores: SynastryScores = {
    overall: 0,
    emotional: 0,
    romantic: 0,
    physical: 0,
    communication: 0,
    growth: 0,
    stability: 0,
  };

  let totalWeight = 0;
  let weightedScore = 0;

  for (const aspect of aspects) {
    const weight = getAspectWeight(aspect.person1Planet, aspect.person2Planet);
    const aspectScore = calculateAspectScore(aspect);

    totalWeight += weight;
    weightedScore += aspectScore * weight;

    // Add to category scores
    switch (aspect.category) {
      case 'emotional':
        scores.emotional += aspectScore;
        break;
      case 'romantic':
        scores.romantic += aspectScore;
        break;
      case 'physical':
        scores.physical += aspectScore;
        break;
      case 'communication':
        scores.communication += aspectScore;
        break;
      case 'growth':
        scores.growth += aspectScore;
        break;
      case 'challenge':
        scores.stability += aspectScore;
        break;
    }
  }

  // Normalize overall score to 0-100 scale
  if (totalWeight > 0) {
    scores.overall = Math.round((weightedScore / totalWeight) * 50 + 50);
  } else {
    scores.overall = 50;
  }

  // Normalize category scores
  const categoryCount = {
    emotional: aspects.filter(a => a.category === 'emotional').length || 1,
    romantic: aspects.filter(a => a.category === 'romantic').length || 1,
    physical: aspects.filter(a => a.category === 'physical').length || 1,
    communication: aspects.filter(a => a.category === 'communication').length || 1,
    growth: aspects.filter(a => a.category === 'growth').length || 1,
    stability: aspects.filter(a => a.category === 'challenge').length || 1,
  };

  scores.emotional = normalizeScore(scores.emotional / categoryCount.emotional);
  scores.romantic = normalizeScore(scores.romantic / categoryCount.romantic);
  scores.physical = normalizeScore(scores.physical / categoryCount.physical);
  scores.communication = normalizeScore(scores.communication / categoryCount.communication);
  scores.growth = normalizeScore(scores.growth / categoryCount.growth);
  scores.stability = normalizeScore(scores.stability / categoryCount.stability);

  return scores;
}

/**
 * Get weight for a planet pair
 */
function getAspectWeight(planet1: Planet, planet2: Planet): number {
  for (const [p1, p2, weight] of KEY_SYNASTRY_PAIRS) {
    if ((planet1 === p1 && planet2 === p2) || (planet1 === p2 && planet2 === p1)) {
      return weight;
    }
  }
  return 1; // Default weight for unspecified pairs
}

/**
 * Calculate score for a single aspect (-1 to 1)
 */
function calculateAspectScore(aspect: SynastryAspect): number {
  let score = 0;

  // Check if conjunction is challenging
  if (aspect.type === 'Conjunction') {
    const isChallenging = CHALLENGING_CONJUNCTIONS.some(
      ([p1, p2]) =>
        (aspect.planet1 === p1 && aspect.planet2 === p2) ||
        (aspect.planet1 === p2 && aspect.planet2 === p1)
    );
    score = isChallenging ? -0.5 : 1;
  } else if (HARMONIOUS_ASPECTS.includes(aspect.type)) {
    score = aspect.type === 'Trine' ? 1 : 0.75;
  } else if (CHALLENGING_ASPECTS.includes(aspect.type)) {
    score = aspect.type === 'Square' ? -0.75 : -0.5;
  }

  // Adjust by strength
  return score * aspect.strength;
}

/**
 * Normalize score to 0-100 scale
 */
function normalizeScore(rawScore: number): number {
  return Math.max(0, Math.min(100, Math.round(rawScore * 50 + 50)));
}

/**
 * Get key aspects for interpretation
 */
export function getKeyAspects(aspects: SynastryAspect[], limit: number = 10): SynastryAspect[] {
  // Prioritize key planet pairs
  const keyPairPlanets = KEY_SYNASTRY_PAIRS.map(([p1, p2]) => [p1, p2]);

  const scored = aspects.map(aspect => {
    let priority = aspect.strength;

    // Boost priority for key pairs
    const isKeyPair = keyPairPlanets.some(
      ([p1, p2]) =>
        (aspect.planet1 === p1 && aspect.planet2 === p2) ||
        (aspect.planet1 === p2 && aspect.planet2 === p1)
    );

    if (isKeyPair) {
      priority *= 2;
    }

    // Boost tight orbs
    if (aspect.orb < 2) {
      priority *= 1.5;
    }

    return { aspect, priority };
  });

  return scored
    .sort((a, b) => b.priority - a.priority)
    .slice(0, limit)
    .map(s => s.aspect);
}

/**
 * Create synastry summary
 */
export function createSynastrySummary(aspects: SynastryAspect[]): SynastrySummary {
  let harmonious = 0;
  let challenging = 0;
  let neutral = 0;

  for (const aspect of aspects) {
    if (aspect.type === 'Conjunction') {
      const isChallenging = CHALLENGING_CONJUNCTIONS.some(
        ([p1, p2]) =>
          (aspect.planet1 === p1 && aspect.planet2 === p2) ||
          (aspect.planet1 === p2 && aspect.planet2 === p1)
      );
      if (isChallenging) {
        challenging++;
      } else {
        harmonious++;
      }
    } else if (HARMONIOUS_ASPECTS.includes(aspect.type)) {
      harmonious++;
    } else if (CHALLENGING_ASPECTS.includes(aspect.type)) {
      challenging++;
    } else {
      neutral++;
    }
  }

  // Find strongest connection (harmonious)
  const harmoniousAspects = aspects.filter(
    a =>
      HARMONIOUS_ASPECTS.includes(a.type) ||
      (a.type === 'Conjunction' &&
        !CHALLENGING_CONJUNCTIONS.some(
          ([p1, p2]) =>
            (a.planet1 === p1 && a.planet2 === p2) ||
            (a.planet1 === p2 && a.planet2 === p1)
        ))
  );

  // Find main challenge
  const challengingAspects = aspects.filter(
    a =>
      CHALLENGING_ASPECTS.includes(a.type) ||
      (a.type === 'Conjunction' &&
        CHALLENGING_CONJUNCTIONS.some(
          ([p1, p2]) =>
            (a.planet1 === p1 && a.planet2 === p2) ||
            (a.planet1 === p2 && a.planet2 === p1)
        ))
  );

  return {
    totalAspects: aspects.length,
    harmonious,
    challenging,
    neutral,
    strongestConnection: harmoniousAspects[0] || null,
    mainChallenge: challengingAspects[0] || null,
  };
}

/**
 * Calculate complete synastry analysis
 */
export function calculateSynastry(
  chart1: NatalChart,
  chart2: NatalChart,
  includeMinor: boolean = false
): SynastryResult {
  const aspects = calculateSynastryAspects(chart1, chart2, includeMinor);
  const scores = calculateCompatibilityScores(aspects);
  const keyAspects = getKeyAspects(aspects);
  const summary = createSynastrySummary(aspects);

  return {
    chart1,
    chart2,
    aspects,
    scores,
    keyAspects,
    summary,
    calculatedAt: new Date(),
  };
}

// ============================================================================
// Export Types
// ============================================================================

export type {
  SynastryAspect as SynastryAspectType,
  SynastryResult as SynastryResultType,
  SynastryScores as SynastryScoresType,
  SynastrySummary as SynastrySummaryType,
};
