"use client";

/**
 * Natal Chart Wheel Component
 * SVG-based circular astrological natal chart visualization
 */

import { useMemo } from "react";
import type { PlanetPosition, HouseCusps, Aspect } from "@/lib/calculation/types";
import { CHART_CONFIG, longitudeToAngle, polarToCartesian, calculatePlanetPositions } from "./chart-utils";
import { ZodiacRing } from "./ZodiacRing";
import { HouseWheel } from "./HouseWheel";
import { PlanetSymbol } from "./PlanetSymbols";
import { AspectLine } from "./AspectLine";

interface NatalChartWheelProps {
  planets: Record<string, PlanetPosition>;
  houses: HouseCusps;
  aspects: Aspect[];
  ascendant: number;
  size?: number;
}

export function NatalChartWheel({
  planets,
  houses,
  aspects,
  ascendant,
  size = 400,
}: NatalChartWheelProps) {
  const { center, viewBox } = CHART_CONFIG;

  // Calculate planet positions with overlap resolution
  const planetPositions = useMemo(() => {
    const planetData: Record<string, { longitude: number }> = {};
    Object.entries(planets).forEach(([key, planet]) => {
      planetData[key] = { longitude: planet.longitude };
    });
    return calculatePlanetPositions(planetData, ascendant, center, CHART_CONFIG.planetRadius);
  }, [planets, ascendant, center]);

  // Calculate aspect line positions
  const aspectPositions = useMemo(() => {
    return aspects.map((aspect) => {
      const planet1 = planets[aspect.planet1];
      const planet2 = planets[aspect.planet2];

      if (!planet1 || !planet2) return null;

      const angle1 = longitudeToAngle(planet1.longitude, ascendant);
      const angle2 = longitudeToAngle(planet2.longitude, ascendant);
      const p1 = polarToCartesian(center, center, CHART_CONFIG.aspectRadius, angle1);
      const p2 = polarToCartesian(center, center, CHART_CONFIG.aspectRadius, angle2);

      return { aspect, p1, p2 };
    }).filter(Boolean);
  }, [aspects, planets, ascendant, center]);

  return (
    <svg
      viewBox={`0 0 ${viewBox} ${viewBox}`}
      width={size}
      height={size}
      className="drop-shadow-lg"
    >
      {/* Background */}
      <circle
        cx={center}
        cy={center}
        r={CHART_CONFIG.outerRing}
        fill={CHART_CONFIG.background}
      />

      {/* Zodiac Ring with 12 sign segments */}
      <ZodiacRing ascendant={ascendant} />

      {/* House Divisions */}
      <HouseWheel houses={houses} ascendant={ascendant} />

      {/* Aspect Lines */}
      <g className="aspect-lines">
        {aspectPositions.map((item, i) => {
          if (!item) return null;
          const { aspect, p1, p2 } = item;

          return (
            <AspectLine
              key={`aspect-${i}`}
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
              aspectType={aspect.type}
              strength={aspect.strength}
            />
          );
        })}
      </g>

      {/* Planet Symbols */}
      <g className="planets">
        {Object.entries(planets).map(([key, planet]) => {
          const pos = planetPositions[key];
          if (!pos) return null;

          return (
            <PlanetSymbol
              key={key}
              planet={planet.planet}
              x={pos.x}
              y={pos.y}
              size={14}
              isRetrograde={planet.retrograde}
            />
          );
        })}
      </g>

      {/* Center Circle */}
      <circle
        cx={center}
        cy={center}
        r={30}
        fill={CHART_CONFIG.background}
        stroke="rgba(255, 255, 255, 0.2)"
        strokeWidth={1}
      />
    </svg>
  );
}

export default NatalChartWheel;
