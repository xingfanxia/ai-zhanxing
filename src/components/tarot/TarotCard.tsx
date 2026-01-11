"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { getSuitSymbol } from "./SuitSymbols";
import { MajorArcanaSymbol, getMajorArcanaNumber } from "./MajorArcanaSymbol";

type CardSize = "sm" | "md" | "lg";

interface TarotCardProps {
  name: string;
  suit?: string;
  reversed?: boolean;
  size?: CardSize;
  showBack?: boolean;
  isFlipped?: boolean;
  onFlip?: () => void;
  className?: string;
  position?: string;
}

const sizeConfig: Record<CardSize, { width: string; height: string; symbolSize: number; fontSize: string; padding: string }> = {
  sm: { width: "w-24", height: "h-36", symbolSize: 24, fontSize: "text-xs", padding: "p-2" },
  md: { width: "w-36", height: "h-54", symbolSize: 36, fontSize: "text-sm", padding: "p-3" },
  lg: { width: "w-48", height: "h-72", symbolSize: 48, fontSize: "text-base", padding: "p-4" },
};

/** Card back with mystical CSS pattern */
function CardBack({ size }: { size: CardSize }) {
  const config = sizeConfig[size];

  return (
    <div className={cn(
      "absolute inset-0 rounded-xl overflow-hidden",
      "bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#1a1a2e]",
      "border-2 border-[#d4af37]"
    )}>
      {/* Decorative border */}
      <div className="absolute inset-2 rounded-lg border border-[#d4af37]/40" />
      <div className="absolute inset-4 rounded-md border border-[#d4af37]/20" />

      {/* Mystical pattern background */}
      <div className="absolute inset-0 opacity-20">
        {/* Radial starburst */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#d4af37_1px,_transparent_1px)] bg-[length:12px_12px]" />
      </div>

      {/* Central diamond pattern */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-1/2 h-1/2">
          {/* Diamond shape */}
          <div className="absolute inset-0 rotate-45 border-2 border-[#d4af37]/60 bg-gradient-to-br from-[#4a148c]/40 to-[#1a1a2e]/60" />
          <div className="absolute inset-2 rotate-45 border border-[#d4af37]/40" />

          {/* Center star */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg viewBox="0 0 48 48" className="w-8 h-8 text-[#d4af37]">
              <path
                d="M24 4 L26 18 L40 18 L28 26 L32 40 L24 30 L16 40 L20 26 L8 18 L22 18 Z"
                fill="currentColor"
                opacity="0.8"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Corner decorations */}
      <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#d4af37]/60 rounded-tl" />
      <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#d4af37]/60 rounded-tr" />
      <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#d4af37]/60 rounded-bl" />
      <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#d4af37]/60 rounded-br" />

      {/* Shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5" />
    </div>
  );
}

/** Card front with name, symbol, and decorative elements */
function CardFront({
  name,
  suit,
  reversed,
  size,
  position
}: {
  name: string;
  suit?: string;
  reversed?: boolean;
  size: CardSize;
  position?: string;
}) {
  const config = sizeConfig[size];
  const majorArcanaNumber = getMajorArcanaNumber(name);
  const isMajorArcana = majorArcanaNumber !== null;
  const SuitSymbol = suit ? getSuitSymbol(suit) : null;

  return (
    <div className={cn(
      "absolute inset-0 rounded-xl overflow-hidden",
      "bg-gradient-to-br from-[#1a1a2e] via-[#0f0f1a] to-[#1a1a2e]",
      "border-2 border-[#d4af37]",
      "flex flex-col"
    )}>
      {/* Decorative border */}
      <div className="absolute inset-1.5 rounded-lg border border-[#d4af37]/50 pointer-events-none" />
      <div className="absolute inset-3 rounded-md border border-[#d4af37]/20 pointer-events-none" />

      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#4a148c]/20 via-transparent to-[#4a148c]/20" />

      {/* Card content */}
      <div className={cn(
        "relative flex-1 flex flex-col items-center justify-between z-10",
        config.padding,
        reversed && "rotate-180"
      )}>
        {/* Top number/suit indicator */}
        <div className="w-full flex justify-between items-start">
          <div className={cn("text-[#d4af37] font-serif", config.fontSize)}>
            {isMajorArcana ? romanNumeral(majorArcanaNumber) : ""}
          </div>
          {SuitSymbol && (
            <SuitSymbol size={config.symbolSize / 2} className="text-[#d4af37]/70" />
          )}
        </div>

        {/* Center symbol */}
        <div className="flex-1 flex items-center justify-center">
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 blur-xl bg-[#d4af37]/20 rounded-full" />

            {/* Symbol */}
            <div className="relative text-[#d4af37]">
              {isMajorArcana ? (
                <MajorArcanaSymbol cardNumber={majorArcanaNumber} size={config.symbolSize} />
              ) : SuitSymbol ? (
                <SuitSymbol size={config.symbolSize} />
              ) : (
                <div className="w-12 h-12 rounded-full border-2 border-[#d4af37] flex items-center justify-center">
                  <span className="text-[#d4af37] text-2xl">?</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Card name */}
        <div className="text-center">
          <h3 className={cn(
            "font-serif text-[#ffd700] leading-tight",
            size === "sm" ? "text-[10px]" : size === "md" ? "text-xs" : "text-sm"
          )}>
            {name}
          </h3>
        </div>
      </div>

      {/* Reversed indicator overlay */}
      {reversed && (
        <div className="absolute top-2 right-2 z-20">
          <div className="w-5 h-5 rounded-full bg-[#4a148c]/80 border border-[#d4af37]/50 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-3 h-3 text-[#d4af37]">
              <path
                fill="currentColor"
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14v-4H8l4-4 4 4h-3v4h-2z"
                transform="rotate(180, 12, 12)"
              />
            </svg>
          </div>
        </div>
      )}

      {/* Corner flourishes */}
      <svg className="absolute top-2 left-2 w-4 h-4 text-[#d4af37]/50" viewBox="0 0 16 16">
        <path d="M0 8 C0 4 4 0 8 0" stroke="currentColor" fill="none" strokeWidth="1" />
        <path d="M0 8 C0 4 4 0 8 0" stroke="currentColor" fill="none" strokeWidth="1" transform="rotate(90, 8, 8)" />
      </svg>
      <svg className="absolute top-2 right-2 w-4 h-4 text-[#d4af37]/50" viewBox="0 0 16 16">
        <path d="M16 8 C16 4 12 0 8 0" stroke="currentColor" fill="none" strokeWidth="1" />
        <path d="M16 8 C16 4 12 0 8 0" stroke="currentColor" fill="none" strokeWidth="1" transform="rotate(-90, 8, 8)" />
      </svg>
      <svg className="absolute bottom-2 left-2 w-4 h-4 text-[#d4af37]/50" viewBox="0 0 16 16">
        <path d="M0 8 C0 12 4 16 8 16" stroke="currentColor" fill="none" strokeWidth="1" />
        <path d="M0 8 C0 12 4 16 8 16" stroke="currentColor" fill="none" strokeWidth="1" transform="rotate(-90, 8, 8)" />
      </svg>
      <svg className="absolute bottom-2 right-2 w-4 h-4 text-[#d4af37]/50" viewBox="0 0 16 16">
        <path d="M16 8 C16 12 12 16 8 16" stroke="currentColor" fill="none" strokeWidth="1" />
        <path d="M16 8 C16 12 12 16 8 16" stroke="currentColor" fill="none" strokeWidth="1" transform="rotate(90, 8, 8)" />
      </svg>

      {/* Subtle shimmer */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
    </div>
  );
}

/** Convert number to Roman numeral */
function romanNumeral(num: number): string {
  const romans: [number, string][] = [
    [21, "XXI"], [20, "XX"], [19, "XIX"], [18, "XVIII"],
    [17, "XVII"], [16, "XVI"], [15, "XV"], [14, "XIV"],
    [13, "XIII"], [12, "XII"], [11, "XI"], [10, "X"],
    [9, "IX"], [8, "VIII"], [7, "VII"], [6, "VI"],
    [5, "V"], [4, "IV"], [3, "III"], [2, "II"], [1, "I"], [0, "0"]
  ];

  for (const [value, numeral] of romans) {
    if (num === value) return numeral;
  }
  return String(num);
}

/** Tarot Card Component with flip animation */
export function TarotCard({
  name,
  suit,
  reversed = false,
  size = "md",
  showBack = false,
  isFlipped,
  onFlip,
  className,
  position,
}: TarotCardProps) {
  const [internalFlipped, setInternalFlipped] = useState(showBack);
  const flipped = isFlipped !== undefined ? isFlipped : internalFlipped;

  const config = sizeConfig[size];

  const handleClick = () => {
    if (onFlip) {
      onFlip();
    } else {
      setInternalFlipped(!internalFlipped);
    }
  };

  return (
    <div
      className={cn(
        config.width,
        "aspect-[2/3]",
        "perspective-1000",
        "cursor-pointer",
        className
      )}
      onClick={handleClick}
    >
      <motion.div
        className="relative w-full h-full"
        initial={false}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front face */}
        <div
          className="absolute inset-0"
          style={{ backfaceVisibility: "hidden" }}
        >
          <CardFront
            name={name}
            suit={suit}
            reversed={reversed}
            size={size}
            position={position}
          />
        </div>

        {/* Back face */}
        <div
          className="absolute inset-0"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)"
          }}
        >
          <CardBack size={size} />
        </div>
      </motion.div>

      {/* Position label (outside the card) */}
      {position && (
        <p className={cn(
          "text-center mt-2 text-slate-400",
          size === "sm" ? "text-[10px]" : size === "md" ? "text-xs" : "text-sm"
        )}>
          {position}
        </p>
      )}
    </div>
  );
}

export default TarotCard;
