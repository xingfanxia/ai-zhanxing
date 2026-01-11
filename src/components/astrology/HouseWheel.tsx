/**
 * House Wheel Component
 * Renders the house divisions and labels
 */

import type { HouseCusps } from "@/lib/calculation/types";
import { CHART_CONFIG, longitudeToAngle, polarToCartesian } from "./chart-utils";

interface HouseWheelProps {
  houses: HouseCusps;
  ascendant: number;
}

export function HouseWheel({ houses, ascendant }: HouseWheelProps) {
  const { center } = CHART_CONFIG;

  return (
    <g className="house-wheel">
      {/* Inner circle */}
      <circle
        cx={center}
        cy={center}
        r={CHART_CONFIG.houseInner}
        fill="none"
        stroke={CHART_CONFIG.houseLines}
        strokeWidth={0.5}
      />

      {/* House cusp lines */}
      {houses.cusps.map((cusp, i) => {
        const angle = longitudeToAngle(cusp, ascendant);
        const inner = polarToCartesian(center, center, CHART_CONFIG.houseInner, angle);
        const outer = polarToCartesian(center, center, CHART_CONFIG.houseOuter, angle);

        // Highlight ASC/MC/DSC/IC lines
        const isAngular = i === 0 || i === 3 || i === 6 || i === 9;
        const strokeWidth = isAngular ? 1.5 : 0.5;
        const strokeColor = isAngular
          ? "rgba(212, 175, 55, 0.8)"
          : CHART_CONFIG.houseLines;

        // House number position
        const nextCusp = houses.cusps[(i + 1) % 12];
        const midLongitude = (cusp + nextCusp + (nextCusp < cusp ? 360 : 0)) / 2;
        const midAngle = longitudeToAngle(midLongitude % 360, ascendant);
        const numberPos = polarToCartesian(
          center,
          center,
          (CHART_CONFIG.houseInner + CHART_CONFIG.houseOuter) / 2 - 10,
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
              fill={CHART_CONFIG.cuspsText}
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
  const { center } = CHART_CONFIG;
  const labelRadius = CHART_CONFIG.zodiacOuter + 12;

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
            fill={CHART_CONFIG.zodiacRing}
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
