/**
 * Chart Utility Functions
 * Mathematical helpers for natal chart wheel rendering
 */

// Chart configuration constants
export const CHART_CONFIG = {
  viewBox: 400,
  center: 200,
  // Ring radii (from outer to inner)
  outerRing: 190,
  zodiacOuter: 190,
  zodiacInner: 160,
  houseOuter: 160,
  houseInner: 70,
  planetRadius: 115,
  aspectRadius: 60,
  // Colors
  background: "#1a1a2e",
  zodiacRing: "#d4af37",
  houseLines: "rgba(255, 255, 255, 0.4)",
  cuspsText: "rgba(255, 255, 255, 0.6)",
} as const;

/**
 * Convert ecliptic longitude to chart angle
 * Charts typically have ASC on the left (9 o'clock position)
 * and go counterclockwise
 */
export function longitudeToAngle(longitude: number, ascendant: number): number {
  const adjusted = longitude - ascendant;
  return ((-adjusted + 180) * Math.PI) / 180;
}

/**
 * Convert angle to x,y coordinates
 */
export function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angle: number
): { x: number; y: number } {
  return {
    x: centerX + radius * Math.cos(angle),
    y: centerY - radius * Math.sin(angle),
  };
}

/**
 * Create SVG arc path
 */
export function describeArc(
  x: number,
  y: number,
  radius: number,
  startAngle: number,
  endAngle: number
): string {
  const start = polarToCartesian(x, y, radius, startAngle);
  const end = polarToCartesian(x, y, radius, endAngle);
  const largeArcFlag = endAngle - startAngle <= Math.PI ? 0 : 1;

  return [
    "M", start.x, start.y,
    "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
  ].join(" ");
}

/**
 * Create SVG path for a ring segment
 */
export function createSegmentPath(
  cx: number,
  cy: number,
  innerRadius: number,
  outerRadius: number,
  startAngle: number,
  endAngle: number
): string {
  const innerStart = polarToCartesian(cx, cy, innerRadius, startAngle);
  const innerEnd = polarToCartesian(cx, cy, innerRadius, endAngle);
  const outerStart = polarToCartesian(cx, cy, outerRadius, startAngle);
  const outerEnd = polarToCartesian(cx, cy, outerRadius, endAngle);

  const largeArcFlag = Math.abs(endAngle - startAngle) > Math.PI ? 1 : 0;
  const sweepFlag = endAngle < startAngle ? 1 : 0;

  return [
    "M", outerStart.x, outerStart.y,
    "A", outerRadius, outerRadius, 0, largeArcFlag, sweepFlag, outerEnd.x, outerEnd.y,
    "L", innerEnd.x, innerEnd.y,
    "A", innerRadius, innerRadius, 0, largeArcFlag, 1 - sweepFlag, innerStart.x, innerStart.y,
    "Z",
  ].join(" ");
}

/**
 * Calculate positions for all planets, avoiding overlaps
 */
export function calculatePlanetPositions(
  planets: Record<string, { longitude: number }>,
  ascendant: number,
  center: number,
  planetRadius: number
): Record<string, { x: number; y: number; radius: number }> {
  const entries = Object.entries(planets);
  const positions: Record<string, { x: number; y: number; longitude: number }> = {};
  const adjusted: Record<string, { x: number; y: number; radius: number }> = {};

  // First pass: calculate initial positions
  entries.forEach(([key, planet]) => {
    const angle = longitudeToAngle(planet.longitude, ascendant);
    const pos = polarToCartesian(center, center, planetRadius, angle);
    positions[key] = { ...pos, longitude: planet.longitude };
  });

  // Second pass: resolve overlaps
  entries.forEach(([key, planet], i) => {
    let radius = planetRadius;
    const pos = positions[key];

    for (let j = 0; j < i; j++) {
      const [otherKey] = entries[j];
      const otherPos = adjusted[otherKey];
      const dist = Math.sqrt(
        Math.pow(pos.x - otherPos.x, 2) + Math.pow(pos.y - otherPos.y, 2)
      );

      if (dist < 20) {
        radius = planetRadius - 15;
      }
    }

    const angle = longitudeToAngle(planet.longitude, ascendant);
    const newPos = polarToCartesian(center, center, radius, angle);
    adjusted[key] = { ...newPos, radius };
  });

  return adjusted;
}
