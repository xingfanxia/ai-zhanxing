/**
 * Aspect Line Component
 * Renders colored lines for astrological aspects
 */

import type { AspectType } from "@/lib/calculation/types";

// Aspect colors based on traditional associations
export const ASPECT_COLORS: Record<AspectType, string> = {
  Conjunction: "#22c55e", // Green - unifying
  Sextile: "#3b82f6", // Blue - harmonious
  Square: "#ef4444", // Red - challenging
  Trine: "#22c55e", // Green - flowing
  Opposition: "#ef4444", // Red - tension
  Quincunx: "#f97316", // Orange - adjustment
  SemiSextile: "#06b6d4", // Cyan - subtle
  SemiSquare: "#f59e0b", // Amber - friction
  Sesquiquadrate: "#f59e0b", // Amber - friction
  Quintile: "#a855f7", // Purple - creative
};

// Aspect line styles
export const ASPECT_STYLES: Record<AspectType, { dash?: string; width: number }> = {
  Conjunction: { width: 2 },
  Sextile: { dash: "4,2", width: 1 },
  Square: { width: 1.5 },
  Trine: { width: 1.5 },
  Opposition: { dash: "6,3", width: 1.5 },
  Quincunx: { dash: "2,2", width: 1 },
  SemiSextile: { dash: "2,2", width: 0.5 },
  SemiSquare: { dash: "3,1", width: 0.5 },
  Sesquiquadrate: { dash: "3,1", width: 0.5 },
  Quintile: { dash: "5,2", width: 1 },
};

interface AspectLineProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  aspectType: AspectType;
  strength?: number; // 0-1, affects opacity
  showOnlyMajor?: boolean;
}

// Major aspects to show by default
const MAJOR_ASPECTS: AspectType[] = [
  "Conjunction",
  "Sextile",
  "Square",
  "Trine",
  "Opposition",
];

/**
 * Renders an aspect line between two points
 */
export function AspectLine({
  x1,
  y1,
  x2,
  y2,
  aspectType,
  strength = 1,
  showOnlyMajor = true,
}: AspectLineProps) {
  // Skip minor aspects if showOnlyMajor is true
  if (showOnlyMajor && !MAJOR_ASPECTS.includes(aspectType)) {
    return null;
  }

  const color = ASPECT_COLORS[aspectType];
  const style = ASPECT_STYLES[aspectType];
  const opacity = 0.3 + strength * 0.5; // Range: 0.3 to 0.8

  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={color}
      strokeWidth={style.width}
      strokeDasharray={style.dash}
      strokeOpacity={opacity}
      strokeLinecap="round"
    />
  );
}

/**
 * Get the color for an aspect type
 */
export function getAspectColor(aspectType: AspectType): string {
  return ASPECT_COLORS[aspectType];
}

/**
 * Check if an aspect is major
 */
export function isMajorAspect(aspectType: AspectType): boolean {
  return MAJOR_ASPECTS.includes(aspectType);
}

/**
 * Aspect type display names
 */
export const ASPECT_NAMES: Record<AspectType, string> = {
  Conjunction: "Conjunction",
  Sextile: "Sextile",
  Square: "Square",
  Trine: "Trine",
  Opposition: "Opposition",
  Quincunx: "Quincunx",
  SemiSextile: "Semi-Sextile",
  SemiSquare: "Semi-Square",
  Sesquiquadrate: "Sesquiquadrate",
  Quintile: "Quintile",
};

/**
 * Aspect symbols
 */
export const ASPECT_SYMBOLS: Record<AspectType, string> = {
  Conjunction: "\u260C",
  Sextile: "\u26B9",
  Square: "\u25A1",
  Trine: "\u25B3",
  Opposition: "\u260D",
  Quincunx: "\u26BB",
  SemiSextile: "\u26BA",
  SemiSquare: "\u2220",
  Sesquiquadrate: "\u26BC",
  Quintile: "Q",
};
