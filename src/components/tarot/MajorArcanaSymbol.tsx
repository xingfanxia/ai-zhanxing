"use client";

import { type SVGProps } from "react";
import {
  Sun,
  Moon,
  Star,
  Heart,
  Scale,
  Crown,
  Flame,
  Droplets,
  Wind,
  Mountain,
  Sparkles,
  Eye,
  Zap,
  RefreshCw,
  Skull,
  HandMetal,
  Building2,
  CircleDot,
  Infinity,
  Award,
  Globe,
} from "lucide-react";

interface MajorArcanaSymbolProps {
  cardNumber: number;
  size?: number;
  className?: string;
}

/** Custom SVG symbol for The Fool */
function FoolSymbol({ size = 48, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
    >
      {/* Walking figure silhouette */}
      <circle cx="24" cy="12" r="6" fill="currentColor" opacity="0.9" />
      <path
        d="M24 18 L24 30 M24 22 L18 28 M24 22 L30 28 M24 30 L20 40 M24 30 L28 40"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Bundle on stick */}
      <line x1="30" y1="22" x2="36" y2="10" stroke="currentColor" strokeWidth="2" />
      <circle cx="36" cy="8" r="4" fill="currentColor" opacity="0.7" />
      {/* Cliff edge */}
      <path
        d="M8 44 Q 16 40 20 44 Q 24 48 28 42"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        opacity="0.5"
      />
    </svg>
  );
}

/** Custom SVG symbol for The Magician's infinity wand */
function MagicianSymbol({ size = 48, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
    >
      {/* Infinity symbol */}
      <path
        d="M14 24 C14 20 18 16 22 20 C26 24 26 24 30 20 C34 16 38 20 38 24 C38 28 34 32 30 28 C26 24 26 24 22 28 C18 32 14 28 14 24"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      {/* Wand pointing up */}
      <line x1="24" y1="8" x2="24" y2="18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      {/* Wand pointing down */}
      <line x1="24" y1="30" x2="24" y2="40" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      {/* Sparkle */}
      <circle cx="24" cy="6" r="2" fill="currentColor" />
    </svg>
  );
}

/** Custom SVG symbol for High Priestess */
function HighPriestessSymbol({ size = 48, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
    >
      {/* Two pillars */}
      <rect x="10" y="12" width="6" height="28" rx="1" fill="currentColor" opacity="0.6" />
      <rect x="32" y="12" width="6" height="28" rx="1" fill="currentColor" opacity="0.8" />
      {/* Crescent moon crown */}
      <path
        d="M24 8 C20 8 18 12 18 16 C22 14 26 14 30 16 C30 12 28 8 24 8"
        fill="currentColor"
        opacity="0.9"
      />
      {/* Scroll */}
      <rect x="20" y="24" width="8" height="12" rx="1" fill="currentColor" opacity="0.7" />
      <text x="24" y="32" textAnchor="middle" fontSize="6" fill="currentColor" opacity="0.5">T</text>
    </svg>
  );
}

/** Custom SVG for The Empress */
function EmpressSymbol({ size = 48, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
    >
      {/* Venus symbol */}
      <circle cx="24" cy="18" r="10" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <line x1="24" y1="28" x2="24" y2="40" stroke="currentColor" strokeWidth="2.5" />
      <line x1="18" y1="34" x2="30" y2="34" stroke="currentColor" strokeWidth="2.5" />
      {/* Crown of stars */}
      <circle cx="14" cy="10" r="1.5" fill="currentColor" opacity="0.7" />
      <circle cx="24" cy="6" r="1.5" fill="currentColor" opacity="0.7" />
      <circle cx="34" cy="10" r="1.5" fill="currentColor" opacity="0.7" />
    </svg>
  );
}

/** Custom SVG for The Chariot */
function ChariotSymbol({ size = 48, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
    >
      {/* Chariot body */}
      <rect x="14" y="16" width="20" height="16" rx="2" fill="currentColor" opacity="0.8" />
      {/* Wheels */}
      <circle cx="12" cy="36" r="6" stroke="currentColor" strokeWidth="2" fill="none" />
      <circle cx="36" cy="36" r="6" stroke="currentColor" strokeWidth="2" fill="none" />
      {/* Star canopy */}
      <path d="M24 4 L26 10 L32 10 L27 14 L29 20 L24 16 L19 20 L21 14 L16 10 L22 10 Z" fill="currentColor" />
    </svg>
  );
}

/** Custom SVG for Wheel of Fortune */
function WheelSymbol({ size = 48, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
    >
      {/* Outer wheel */}
      <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="2" fill="none" />
      {/* Inner wheel */}
      <circle cx="24" cy="24" r="10" stroke="currentColor" strokeWidth="1.5" fill="none" />
      {/* Spokes */}
      <line x1="24" y1="6" x2="24" y2="42" stroke="currentColor" strokeWidth="1.5" />
      <line x1="6" y1="24" x2="42" y2="24" stroke="currentColor" strokeWidth="1.5" />
      <line x1="11" y1="11" x2="37" y2="37" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      <line x1="37" y1="11" x2="11" y2="37" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      {/* Center */}
      <circle cx="24" cy="24" r="3" fill="currentColor" />
    </svg>
  );
}

/** Custom SVG for The Hanged Man */
function HangedManSymbol({ size = 48, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
    >
      {/* Tree branch */}
      <line x1="10" y1="8" x2="38" y2="8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      {/* Rope */}
      <line x1="24" y1="8" x2="24" y2="18" stroke="currentColor" strokeWidth="1.5" />
      {/* Hanging figure (inverted) */}
      <circle cx="24" cy="38" r="5" fill="currentColor" opacity="0.9" />
      <path
        d="M24 33 L24 22 M24 26 L20 20 M24 26 L28 20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Crossed leg */}
      <path d="M22 18 L26 18 M24 18 L20 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      {/* Halo */}
      <circle cx="24" cy="38" r="7" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.5" />
    </svg>
  );
}

/** Custom SVG for The Tower */
function TowerSymbol({ size = 48, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
    >
      {/* Tower */}
      <path d="M18 44 L18 16 L24 8 L30 16 L30 44" fill="currentColor" opacity="0.8" />
      {/* Lightning bolt */}
      <path
        d="M36 4 L28 18 L32 18 L24 32"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Crown falling */}
      <path d="M20 12 L24 8 L28 12 L26 12 L24 10 L22 12 Z" fill="currentColor" transform="rotate(30, 34, 16) translate(6, 4)" opacity="0.6" />
      {/* Falling figures */}
      <circle cx="14" cy="30" r="2" fill="currentColor" opacity="0.5" />
      <circle cx="36" cy="36" r="2" fill="currentColor" opacity="0.5" />
    </svg>
  );
}

/** Get the symbol component for a Major Arcana card */
export function MajorArcanaSymbol({ cardNumber, size = 48, className }: MajorArcanaSymbolProps) {
  const iconProps = { size, className };
  const lucideProps = { size, className, strokeWidth: 1.5 };

  switch (cardNumber) {
    case 0: // The Fool
      return <FoolSymbol {...iconProps} />;
    case 1: // The Magician
      return <MagicianSymbol {...iconProps} />;
    case 2: // The High Priestess
      return <HighPriestessSymbol {...iconProps} />;
    case 3: // The Empress
      return <EmpressSymbol {...iconProps} />;
    case 4: // The Emperor
      return <Crown {...lucideProps} />;
    case 5: // The Hierophant
      return <Building2 {...lucideProps} />;
    case 6: // The Lovers
      return <Heart {...lucideProps} />;
    case 7: // The Chariot
      return <ChariotSymbol {...iconProps} />;
    case 8: // Strength
      return <Flame {...lucideProps} />;
    case 9: // The Hermit
      return <Eye {...lucideProps} />;
    case 10: // Wheel of Fortune
      return <WheelSymbol {...iconProps} />;
    case 11: // Justice
      return <Scale {...lucideProps} />;
    case 12: // The Hanged Man
      return <HangedManSymbol {...iconProps} />;
    case 13: // Death
      return <Skull {...lucideProps} />;
    case 14: // Temperance
      return <Droplets {...lucideProps} />;
    case 15: // The Devil
      return <HandMetal {...lucideProps} />;
    case 16: // The Tower
      return <TowerSymbol {...iconProps} />;
    case 17: // The Star
      return <Star {...lucideProps} />;
    case 18: // The Moon
      return <Moon {...lucideProps} />;
    case 19: // The Sun
      return <Sun {...lucideProps} />;
    case 20: // Judgement
      return <Award {...lucideProps} />;
    case 21: // The World
      return <Globe {...lucideProps} />;
    default:
      return <Sparkles {...lucideProps} />;
  }
}

/** Get card number from card name (for Major Arcana) */
export function getMajorArcanaNumber(cardName: string): number | null {
  const nameToNumber: Record<string, number> = {
    'the fool': 0,
    'fool': 0,
    'the magician': 1,
    'magician': 1,
    'the high priestess': 2,
    'high priestess': 2,
    'the empress': 3,
    'empress': 3,
    'the emperor': 4,
    'emperor': 4,
    'the hierophant': 5,
    'hierophant': 5,
    'the lovers': 6,
    'lovers': 6,
    'the chariot': 7,
    'chariot': 7,
    'strength': 8,
    'the hermit': 9,
    'hermit': 9,
    'wheel of fortune': 10,
    'the wheel of fortune': 10,
    'justice': 11,
    'the hanged man': 12,
    'hanged man': 12,
    'death': 13,
    'temperance': 14,
    'the devil': 15,
    'devil': 15,
    'the tower': 16,
    'tower': 16,
    'the star': 17,
    'star': 17,
    'the moon': 18,
    'moon': 18,
    'the sun': 19,
    'sun': 19,
    'judgement': 20,
    'judgment': 20,
    'the world': 21,
    'world': 21,
  };

  return nameToNumber[cardName.toLowerCase()] ?? null;
}
