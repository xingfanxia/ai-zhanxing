"use client";

/**
 * Natal Chart Wheel Component
 * SVG-based circular astrological natal chart visualization
 */

import { useMemo } from "react";
import type { Planet, PlanetPosition, HouseCusps, Aspect } from "@/lib/calculation/types";
import { ZodiacSymbol, ZODIAC_ORDER, ELEMENT_COLORS, SIGN_ELEMENTS } from "./ZodiacSymbols";
import { PlanetSymbol, PLANET_COLORS } from "./PlanetSymbols";
import { AspectLine } from "./AspectLine";

interface NatalChartWheelProps {
  planets: Record<string, PlanetPosition>;
  houses: HouseCusps;
  aspects: Aspect[];
  ascendant: number;
  size?: number;
}

// Chart configuration
const CONFIG = {
  viewBox: 400,
  center: 200,
  // Ring radii (from outer to inner)
  outerRing: 190, // Outer edge
  zodiacOuter: 190,
  zodiacInner: 160,
  houseOuter: 160,
  houseInner: 70,
  planetRadius: 115, // Where planets are placed
  aspectRadius: 60, // Inner circle for aspect lines
  // Colors
  background: "#1a1a2e",
  zodiacRing: "#d4af37",
  houseLines: "rgba(255, 255, 255, 0.4)",
  cuspsText: "rgba(255, 255, 255, 0.6)",
};

/**
 * Convert ecliptic longitude to chart angle
 * Charts typically have ASC on the left (9 o'clock position)
 * and go counterclockwise
 */
function longitudeToAngle(longitude: number, ascendant: number): number {
  // Subtract ascendant to rotate chart so ASC is at 0
  // Then adjust so 0 is at 9 o'clock (left) and goes counterclockwise
  const adjusted = longitude - ascendant;
  // Convert to radians, negative for counterclockwise
  return ((-adjusted + 180) * Math.PI) / 180;
}

/**
 * Convert angle to x,y coordinates
 */
function polarToCartesian(
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
function describeArc(
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

export function NatalChartWheel({
  planets,
  houses,
  aspects,
  ascendant,
  size = 400,
}: NatalChartWheelProps) {
  const { center } = CONFIG;

  // Calculate planet positions on the chart
  const planetPositions = useMemo(() => {
    const positions: Record<string, { x: number; y: number; longitude: number }> = {};

    Object.entries(planets).forEach(([key, planet]) => {
      const angle = longitudeToAngle(planet.longitude, ascendant);
      const pos = polarToCartesian(center, center, CONFIG.planetRadius, angle);
      positions[key] = { ...pos, longitude: planet.longitude };
    });

    return positions;
  }, [planets, ascendant, center]);

  // Resolve planet overlaps
  const adjustedPlanetPositions = useMemo(() => {
    const entries = Object.entries(planetPositions);
    const adjusted: Record<string, { x: number; y: number; radius: number }> = {};

    entries.forEach(([key, pos], i) => {
      let radius = CONFIG.planetRadius;

      // Check for nearby planets and adjust radius
      for (let j = 0; j < i; j++) {
        const [otherKey] = entries[j];
        const otherPos = adjusted[otherKey];
        const dist = Math.sqrt(
          Math.pow(pos.x - otherPos.x, 2) + Math.pow(pos.y - otherPos.y, 2)
        );

        if (dist < 20) {
          radius = CONFIG.planetRadius - 15; // Move inward
        }
      }

      const angle = longitudeToAngle(pos.longitude, ascendant);
      const newPos = polarToCartesian(center, center, radius, angle);
      adjusted[key] = { ...newPos, radius };
    });

    return adjusted;
  }, [planetPositions, ascendant, center]);

  return (
    <svg
      viewBox={`0 0 ${CONFIG.viewBox} ${CONFIG.viewBox}`}
      width={size}
      height={size}
      className="drop-shadow-lg"
    >
      {/* Background */}
      <circle
        cx={center}
        cy={center}
        r={CONFIG.outerRing}
        fill={CONFIG.background}
      />

      {/* Zodiac Ring Background Segments */}
      <ZodiacRing ascendant={ascendant} />

      {/* House Divisions */}
      <HouseWheel houses={houses} ascendant={ascendant} />

      {/* Aspect Lines */}
      <g className="aspect-lines">
        {aspects.map((aspect, i) => {
          const pos1 = planetPositions[aspect.planet1];
          const pos2 = planetPositions[aspect.planet2];

          if (!pos1 || !pos2) return null;

          // Draw aspects from planet to planet through center area
          const angle1 = longitudeToAngle(pos1.longitude, ascendant);
          const angle2 = longitudeToAngle(pos2.longitude, ascendant);
          const p1 = polarToCartesian(center, center, CONFIG.aspectRadius, angle1);
          const p2 = polarToCartesian(center, center, CONFIG.aspectRadius, angle2);

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
          const pos = adjustedPlanetPositions[key];
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
        fill={CONFIG.background}
        stroke="rgba(255, 255, 255, 0.2)"
        strokeWidth={1}
      />
    </svg>
  );
}

/**
 * Zodiac Ring with 12 sign segments
 */
function ZodiacRing({ ascendant }: { ascendant: number }) {
  const { center } = CONFIG;

  return (
    <g className="zodiac-ring">
      {/* Outer ring border */}
      <circle
        cx={center}
        cy={center}
        r={CONFIG.zodiacOuter}
        fill="none"
        stroke={CONFIG.zodiacRing}
        strokeWidth={1}
      />
      <circle
        cx={center}
        cy={center}
        r={CONFIG.zodiacInner}
        fill="none"
        stroke={CONFIG.zodiacRing}
        strokeWidth={1}
      />

      {/* Sign segments and symbols */}
      {ZODIAC_ORDER.map((sign, i) => {
        const signStart = i * 30; // Start degree of this sign
        const signMid = signStart + 15; // Middle of sign for symbol

        // Angles for segment lines
        const startAngle = longitudeToAngle(signStart, ascendant);
        const midAngle = longitudeToAngle(signMid, ascendant);

        // Position for division line
        const lineInner = polarToCartesian(center, center, CONFIG.zodiacInner, startAngle);
        const lineOuter = polarToCartesian(center, center, CONFIG.zodiacOuter, startAngle);

        // Position for symbol
        const symbolRadius = (CONFIG.zodiacOuter + CONFIG.zodiacInner) / 2;
        const symbolPos = polarToCartesian(center, center, symbolRadius, midAngle);

        // Segment background color based on element
        const element = SIGN_ELEMENTS[sign];
        const elementColor = ELEMENT_COLORS[element];

        return (
          <g key={sign}>
            {/* Segment background arc */}
            <path
              d={createSegmentPath(
                center,
                center,
                CONFIG.zodiacInner,
                CONFIG.zodiacOuter,
                startAngle,
                longitudeToAngle(signStart + 30, ascendant)
              )}
              fill={elementColor}
              fillOpacity={0.1}
            />

            {/* Division line */}
            <line
              x1={lineInner.x}
              y1={lineInner.y}
              x2={lineOuter.x}
              y2={lineOuter.y}
              stroke={CONFIG.zodiacRing}
              strokeWidth={0.5}
            />

            {/* Zodiac symbol */}
            <ZodiacSymbol
              sign={sign}
              x={symbolPos.x}
              y={symbolPos.y}
              size={12}
              showElement
            />
          </g>
        );
      })}
    </g>
  );
}

/**
 * House wheel with 12 house divisions
 */
function HouseWheel({
  houses,
  ascendant,
}: {
  houses: HouseCusps;
  ascendant: number;
}) {
  const { center } = CONFIG;

  return (
    <g className="house-wheel">
      {/* Inner circle */}
      <circle
        cx={center}
        cy={center}
        r={CONFIG.houseInner}
        fill="none"
        stroke={CONFIG.houseLines}
        strokeWidth={0.5}
      />

      {/* House cusp lines */}
      {houses.cusps.map((cusp, i) => {
        const angle = longitudeToAngle(cusp, ascendant);
        const inner = polarToCartesian(center, center, CONFIG.houseInner, angle);
        const outer = polarToCartesian(center, center, CONFIG.houseOuter, angle);

        // Highlight ASC/MC/DSC/IC lines
        const isAngular = i === 0 || i === 3 || i === 6 || i === 9;
        const strokeWidth = isAngular ? 1.5 : 0.5;
        const strokeColor = isAngular
          ? "rgba(212, 175, 55, 0.8)"
          : CONFIG.houseLines;

        // House number position
        const nextCusp = houses.cusps[(i + 1) % 12];
        const midLongitude = (cusp + nextCusp + (nextCusp < cusp ? 360 : 0)) / 2;
        const midAngle = longitudeToAngle(midLongitude % 360, ascendant);
        const numberPos = polarToCartesian(
          center,
          center,
          (CONFIG.houseInner + CONFIG.houseOuter) / 2 - 10,
          midAngle
        );

        return (
          <g key={`house-${i}`}>
            <line
              x1={inner.x}
              y1={inner.y}
              x2={outer.x}
              y2={outer.y}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            {/* House number */}
            <text
              x={numberPos.x}
              y={numberPos.y}
              fill={CONFIG.cuspsText}
              fontSize={9}
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily="sans-serif"
            >
              {i + 1}
            </text>
          </g>
        );
      })}

      {/* ASC/MC labels */}
      <AngularLabels houses={houses} ascendant={ascendant} />
    </g>
  );
}

/**
 * Labels for angular houses (ASC, MC, DSC, IC)
 */
function AngularLabels({
  houses,
  ascendant,
}: {
  houses: HouseCusps;
  ascendant: number;
}) {
  const { center } = CONFIG;
  const labelRadius = CONFIG.zodiacOuter + 12;

  const labels = [
    { label: "ASC", longitude: houses.ascendant },
    { label: "IC", longitude: houses.ic },
    { label: "DSC", longitude: houses.descendant },
    { label: "MC", longitude: houses.midheaven },
  ];

  return (
    <g className="angular-labels">
      {labels.map(({ label, longitude }) => {
        const angle = longitudeToAngle(longitude, ascendant);
        const pos = polarToCartesian(center, center, labelRadius, angle);

        return (
          <text
            key={label}
            x={pos.x}
            y={pos.y}
            fill={CONFIG.zodiacRing}
            fontSize={10}
            textAnchor="middle"
            dominantBaseline="central"
            fontWeight="bold"
            fontFamily="sans-serif"
          >
            {label}
          </text>
        );
      })}
    </g>
  );
}

/**
 * Create SVG path for a ring segment
 */
function createSegmentPath(
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

export default NatalChartWheel;
