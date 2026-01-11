/**
 * Zodiac Ring Component
 * Renders the outer zodiac ring with 12 sign segments
 */

import { CHART_CONFIG, longitudeToAngle, polarToCartesian, createSegmentPath } from "./chart-utils";
import { ZodiacSymbol, ZODIAC_ORDER, ELEMENT_COLORS, SIGN_ELEMENTS } from "./ZodiacSymbols";

interface ZodiacRingProps {
  ascendant: number;
}

export function ZodiacRing({ ascendant }: ZodiacRingProps) {
  const { center } = CHART_CONFIG;

  return (
    <g className="zodiac-ring">
      {/* Outer ring border */}
      <circle
        cx={center}
        cy={center}
        r={CHART_CONFIG.zodiacOuter}
        fill="none"
        stroke={CHART_CONFIG.zodiacRing}
        strokeWidth={1}
      />
      <circle
        cx={center}
        cy={center}
        r={CHART_CONFIG.zodiacInner}
        fill="none"
        stroke={CHART_CONFIG.zodiacRing}
        strokeWidth={1}
      />

      {/* Sign segments and symbols */}
      {ZODIAC_ORDER.map((sign, i) => {
        const signStart = i * 30;
        const signMid = signStart + 15;

        const startAngle = longitudeToAngle(signStart, ascendant);
        const midAngle = longitudeToAngle(signMid, ascendant);

        const lineInner = polarToCartesian(center, center, CHART_CONFIG.zodiacInner, startAngle);
        const lineOuter = polarToCartesian(center, center, CHART_CONFIG.zodiacOuter, startAngle);

        const symbolRadius = (CHART_CONFIG.zodiacOuter + CHART_CONFIG.zodiacInner) / 2;
        const symbolPos = polarToCartesian(center, center, symbolRadius, midAngle);

        const element = SIGN_ELEMENTS[sign];
        const elementColor = ELEMENT_COLORS[element];

        return (
          <g key={sign}>
            {/* Segment background arc */}
            <path
              d={createSegmentPath(
                center,
                center,
                CHART_CONFIG.zodiacInner,
                CHART_CONFIG.zodiacOuter,
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
              stroke={CHART_CONFIG.zodiacRing}
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
