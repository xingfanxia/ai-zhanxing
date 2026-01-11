"use client";

import { type SVGProps } from "react";

interface SuitSymbolProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

/** Wands - Fire element, represented by a flaming staff */
export function WandsSymbol({ size = 48, className, ...props }: SuitSymbolProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* Staff */}
      <rect x="22" y="18" width="4" height="26" rx="2" fill="currentColor" opacity="0.8" />
      <rect x="21" y="20" width="6" height="2" rx="1" fill="currentColor" opacity="0.6" />
      <rect x="21" y="32" width="6" height="2" rx="1" fill="currentColor" opacity="0.6" />

      {/* Flames */}
      <path
        d="M24 4C24 4 28 10 28 14C28 16.5 26.5 18 24 18C21.5 18 20 16.5 20 14C20 10 24 4 24 4Z"
        fill="url(#wands-flame-gradient)"
      />
      <path
        d="M24 8C24 8 26 11 26 13C26 14.5 25 15 24 15C23 15 22 14.5 22 13C22 11 24 8 24 8Z"
        fill="#FFD700"
        opacity="0.9"
      />
      {/* Side flames */}
      <path
        d="M18 8C18 8 21 12 21 14C21 15.5 20 16 19 15C18 14 17 12 17 10C17 8.5 18 8 18 8Z"
        fill="url(#wands-flame-gradient)"
        opacity="0.7"
      />
      <path
        d="M30 8C30 8 27 12 27 14C27 15.5 28 16 29 15C30 14 31 12 31 10C31 8.5 30 8 30 8Z"
        fill="url(#wands-flame-gradient)"
        opacity="0.7"
      />

      <defs>
        <linearGradient id="wands-flame-gradient" x1="24" y1="4" x2="24" y2="18" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF6B35" />
          <stop offset="0.5" stopColor="#F7931E" />
          <stop offset="1" stopColor="#FFD700" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/** Cups - Water element, represented by a chalice */
export function CupsSymbol({ size = 48, className, ...props }: SuitSymbolProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* Cup bowl */}
      <path
        d="M12 12C12 12 10 24 16 32C18 35 21 36 24 36C27 36 30 35 32 32C38 24 36 12 36 12H12Z"
        fill="url(#cups-gradient)"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      {/* Stem */}
      <rect x="22" y="36" width="4" height="4" fill="currentColor" />
      {/* Base */}
      <ellipse cx="24" cy="42" rx="8" ry="2" fill="currentColor" />
      <ellipse cx="24" cy="41" rx="6" ry="1.5" fill="currentColor" opacity="0.7" />
      {/* Water inside */}
      <path
        d="M14 16C14 16 13 24 18 30C19.5 32 21.5 33 24 33C26.5 33 28.5 32 30 30C35 24 34 16 34 16"
        fill="url(#cups-water-gradient)"
        opacity="0.6"
      />
      {/* Highlight */}
      <path
        d="M15 14C15 14 14 18 15 22"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.4"
      />

      <defs>
        <linearGradient id="cups-gradient" x1="24" y1="12" x2="24" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#C0C0C0" />
          <stop offset="1" stopColor="#808080" />
        </linearGradient>
        <linearGradient id="cups-water-gradient" x1="24" y1="16" x2="24" y2="33" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4FC3F7" />
          <stop offset="1" stopColor="#0288D1" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/** Swords - Air element, represented by a blade */
export function SwordsSymbol({ size = 48, className, ...props }: SuitSymbolProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* Blade */}
      <path
        d="M24 4L26 28H22L24 4Z"
        fill="url(#sword-blade-gradient)"
        stroke="currentColor"
        strokeWidth="0.5"
      />
      {/* Blade tip highlight */}
      <path d="M24 4L24.5 12H23.5L24 4Z" fill="white" opacity="0.5" />
      {/* Fuller (groove) */}
      <rect x="23.5" y="8" width="1" height="18" fill="currentColor" opacity="0.2" />
      {/* Cross guard */}
      <rect x="16" y="28" width="16" height="3" rx="1" fill="currentColor" />
      <rect x="17" y="29" width="14" height="1" fill="white" opacity="0.2" />
      {/* Grip */}
      <rect x="22" y="31" width="4" height="8" fill="url(#sword-grip-gradient)" />
      {/* Grip wrapping */}
      <rect x="22" y="33" width="4" height="1" fill="currentColor" opacity="0.3" />
      <rect x="22" y="36" width="4" height="1" fill="currentColor" opacity="0.3" />
      {/* Pommel */}
      <circle cx="24" cy="42" r="3" fill="currentColor" />
      <circle cx="24" cy="42" r="1.5" fill="url(#sword-pommel-gradient)" />

      <defs>
        <linearGradient id="sword-blade-gradient" x1="24" y1="4" x2="24" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#E8E8E8" />
          <stop offset="0.5" stopColor="#B0B0B0" />
          <stop offset="1" stopColor="#808080" />
        </linearGradient>
        <linearGradient id="sword-grip-gradient" x1="22" y1="31" x2="26" y2="31" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4A2C2A" />
          <stop offset="0.5" stopColor="#6B3A38" />
          <stop offset="1" stopColor="#4A2C2A" />
        </linearGradient>
        <linearGradient id="sword-pommel-gradient" x1="22" y1="40" x2="26" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFD700" />
          <stop offset="1" stopColor="#B8860B" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/** Pentacles - Earth element, represented by a five-pointed star in a circle */
export function PentaclesSymbol({ size = 48, className, ...props }: SuitSymbolProps) {
  // Calculate pentagram points
  const cx = 24;
  const cy = 24;
  const outerR = 18;
  const innerR = 7;

  const getPoint = (angle: number, radius: number) => {
    const rad = (angle - 90) * (Math.PI / 180);
    return {
      x: cx + radius * Math.cos(rad),
      y: cy + radius * Math.sin(rad),
    };
  };

  // 5 points for pentagram
  const points = [0, 72, 144, 216, 288].map((angle) => getPoint(angle, outerR));
  const innerPoints = [36, 108, 180, 252, 324].map((angle) => getPoint(angle, innerR));

  // Create star path by alternating between outer and inner points
  const starPath = points.map((p, i) => {
    const inner = innerPoints[i];
    return `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y} L ${inner.x} ${inner.y}`;
  }).join(' ') + ' Z';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* Outer circle */}
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="2" fill="none" />
      <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="1" fill="url(#pentacle-bg)" opacity="0.3" />

      {/* Pentagram star */}
      <path d={starPath} fill="url(#pentacle-star-gradient)" stroke="currentColor" strokeWidth="1" />

      {/* Center decoration */}
      <circle cx="24" cy="24" r="4" fill="currentColor" opacity="0.3" />
      <circle cx="24" cy="24" r="2" fill="url(#pentacle-center-gradient)" />

      <defs>
        <radialGradient id="pentacle-bg" cx="24" cy="24" r="18" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFD700" />
          <stop offset="1" stopColor="#B8860B" />
        </radialGradient>
        <linearGradient id="pentacle-star-gradient" x1="24" y1="6" x2="24" y2="42" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFD700" />
          <stop offset="0.5" stopColor="#FFA500" />
          <stop offset="1" stopColor="#B8860B" />
        </linearGradient>
        <radialGradient id="pentacle-center-gradient" cx="24" cy="24" r="2" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#FFD700" />
        </radialGradient>
      </defs>
    </svg>
  );
}

/** Get the appropriate suit symbol component for a given suit */
export function getSuitSymbol(suit: string) {
  switch (suit.toLowerCase()) {
    case 'wands':
      return WandsSymbol;
    case 'cups':
      return CupsSymbol;
    case 'swords':
      return SwordsSymbol;
    case 'pentacles':
      return PentaclesSymbol;
    default:
      return null;
  }
}
