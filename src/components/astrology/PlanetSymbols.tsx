/**
 * Planet Symbols Component
 * Provides SVG-ready planet symbols with traditional colors
 */

import type { Planet } from "@/lib/calculation/types";

// Planet Unicode symbols
export const PLANET_SYMBOLS: Record<Planet, string> = {
  Sun: "\u2609",
  Moon: "\u263D",
  Mercury: "\u263F",
  Venus: "\u2640",
  Mars: "\u2642",
  Jupiter: "\u2643",
  Saturn: "\u2644",
  Uranus: "\u2645",
  Neptune: "\u2646",
  Pluto: "\u2647",
  NorthNode: "\u260A",
  SouthNode: "\u260B",
  Chiron: "\u26B7",
};

// Traditional planet colors
export const PLANET_COLORS: Record<Planet, string> = {
  Sun: "#fbbf24", // Gold/Yellow
  Moon: "#e2e8f0", // Silver/Light gray
  Mercury: "#a78bfa", // Light purple
  Venus: "#ec4899", // Pink
  Mars: "#ef4444", // Red
  Jupiter: "#f97316", // Orange
  Saturn: "#6b7280", // Gray
  Uranus: "#06b6d4", // Cyan
  Neptune: "#3b82f6", // Blue
  Pluto: "#581c87", // Deep purple
  NorthNode: "#a855f7", // Purple
  SouthNode: "#9333ea", // Purple variant
  Chiron: "#84cc16", // Lime
};

// Display names for planets
export const PLANET_NAMES: Record<Planet, string> = {
  Sun: "Sun",
  Moon: "Moon",
  Mercury: "Mercury",
  Venus: "Venus",
  Mars: "Mars",
  Jupiter: "Jupiter",
  Saturn: "Saturn",
  Uranus: "Uranus",
  Neptune: "Neptune",
  Pluto: "Pluto",
  NorthNode: "North Node",
  SouthNode: "South Node",
  Chiron: "Chiron",
};

// Short names for compact display
export const PLANET_SHORT_NAMES: Record<Planet, string> = {
  Sun: "Su",
  Moon: "Mo",
  Mercury: "Me",
  Venus: "Ve",
  Mars: "Ma",
  Jupiter: "Ju",
  Saturn: "Sa",
  Uranus: "Ur",
  Neptune: "Ne",
  Pluto: "Pl",
  NorthNode: "NN",
  SouthNode: "SN",
  Chiron: "Ch",
};

interface PlanetSymbolProps {
  planet: Planet;
  x: number;
  y: number;
  size?: number;
  showRetrograde?: boolean;
  isRetrograde?: boolean;
}

/**
 * Renders a planet symbol at the specified position
 */
export function PlanetSymbol({
  planet,
  x,
  y,
  size = 12,
  showRetrograde = true,
  isRetrograde = false,
}: PlanetSymbolProps) {
  const color = PLANET_COLORS[planet];
  const symbol = PLANET_SYMBOLS[planet];

  return (
    <g>
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
        {symbol}
      </text>
      {showRetrograde && isRetrograde && (
        <text
          x={x + size * 0.6}
          y={y - size * 0.3}
          fill="#ef4444"
          fontSize={size * 0.5}
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily="sans-serif"
          className="select-none"
        >
          R
        </text>
      )}
    </g>
  );
}

/**
 * Get planet color
 */
export function getPlanetColor(planet: Planet): string {
  return PLANET_COLORS[planet];
}

/**
 * Get planet symbol
 */
export function getPlanetSymbol(planet: Planet): string {
  return PLANET_SYMBOLS[planet];
}
