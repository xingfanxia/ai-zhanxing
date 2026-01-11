/**
 * Zodiac Symbols Component
 * Provides SVG-ready zodiac symbols with element-based coloring
 */

import type { ZodiacSign } from "@/lib/calculation/types";

// Zodiac Unicode symbols
export const ZODIAC_SYMBOLS: Record<ZodiacSign, string> = {
  Aries: "\u2648",
  Taurus: "\u2649",
  Gemini: "\u264A",
  Cancer: "\u264B",
  Leo: "\u264C",
  Virgo: "\u264D",
  Libra: "\u264E",
  Scorpio: "\u264F",
  Sagittarius: "\u2650",
  Capricorn: "\u2651",
  Aquarius: "\u2652",
  Pisces: "\u2653",
};

// Element colors for zodiac signs
export const ELEMENT_COLORS = {
  Fire: "#ef4444", // Red
  Earth: "#22c55e", // Green
  Air: "#eab308", // Yellow
  Water: "#3b82f6", // Blue
} as const;

// Element mapping for each sign
export const SIGN_ELEMENTS: Record<ZodiacSign, keyof typeof ELEMENT_COLORS> = {
  Aries: "Fire",
  Taurus: "Earth",
  Gemini: "Air",
  Cancer: "Water",
  Leo: "Fire",
  Virgo: "Earth",
  Libra: "Air",
  Scorpio: "Water",
  Sagittarius: "Fire",
  Capricorn: "Earth",
  Aquarius: "Air",
  Pisces: "Water",
};

// Ordered signs starting from Aries (0 degrees)
export const ZODIAC_ORDER: ZodiacSign[] = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
];

interface ZodiacSymbolProps {
  sign: ZodiacSign;
  x: number;
  y: number;
  size?: number;
  showElement?: boolean;
}

/**
 * Renders a zodiac symbol at the specified position
 */
export function ZodiacSymbol({
  sign,
  x,
  y,
  size = 14,
  showElement = true,
}: ZodiacSymbolProps) {
  const element = SIGN_ELEMENTS[sign];
  const color = showElement ? ELEMENT_COLORS[element] : "#d4af37";

  return (
    <text
      x={x}
      y={y}
      fill={color}
      fontSize={size}
      textAnchor="middle"
      dominantBaseline="central"
      fontFamily="serif"
      className="select-none"
    >
      {ZODIAC_SYMBOLS[sign]}
    </text>
  );
}

/**
 * Get the color for a zodiac sign based on its element
 */
export function getSignColor(sign: ZodiacSign): string {
  return ELEMENT_COLORS[SIGN_ELEMENTS[sign]];
}

/**
 * Get the zodiac sign for a given ecliptic longitude
 */
export function getSignFromLongitude(longitude: number): ZodiacSign {
  const normalizedLongitude = ((longitude % 360) + 360) % 360;
  const signIndex = Math.floor(normalizedLongitude / 30);
  return ZODIAC_ORDER[signIndex];
}

/**
 * Get the starting degree for a zodiac sign
 */
export function getSignStartDegree(sign: ZodiacSign): number {
  return ZODIAC_ORDER.indexOf(sign) * 30;
}
