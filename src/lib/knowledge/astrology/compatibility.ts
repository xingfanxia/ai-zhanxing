/**
 * Zodiac Compatibility Knowledge Base
 * Contains compatibility matrices and rules for sign relationships
 */

// Sign compatibility matrix (0-100 score)
export const COMPATIBILITY_MATRIX: Record<string, Record<string, number>> = {
  Aries: { Aries: 50, Taurus: 38, Gemini: 83, Cancer: 42, Leo: 97, Virgo: 63, Libra: 85, Scorpio: 50, Sagittarius: 93, Capricorn: 47, Aquarius: 78, Pisces: 67 },
  Taurus: { Aries: 38, Taurus: 65, Gemini: 33, Cancer: 97, Leo: 65, Virgo: 90, Libra: 65, Scorpio: 88, Sagittarius: 30, Capricorn: 98, Aquarius: 58, Pisces: 85 },
  Gemini: { Aries: 83, Taurus: 33, Gemini: 60, Cancer: 65, Leo: 88, Virgo: 68, Libra: 93, Scorpio: 28, Sagittarius: 60, Capricorn: 68, Aquarius: 85, Pisces: 53 },
  Cancer: { Aries: 42, Taurus: 97, Gemini: 65, Cancer: 75, Leo: 35, Virgo: 90, Libra: 43, Scorpio: 94, Sagittarius: 53, Capricorn: 83, Aquarius: 27, Pisces: 98 },
  Leo: { Aries: 97, Taurus: 65, Gemini: 88, Cancer: 35, Leo: 68, Virgo: 35, Libra: 97, Scorpio: 53, Sagittarius: 93, Capricorn: 35, Aquarius: 68, Pisces: 38 },
  Virgo: { Aries: 63, Taurus: 90, Gemini: 68, Cancer: 90, Leo: 35, Virgo: 65, Libra: 75, Scorpio: 88, Sagittarius: 48, Capricorn: 95, Aquarius: 30, Pisces: 88 },
  Libra: { Aries: 85, Taurus: 65, Gemini: 93, Cancer: 43, Leo: 97, Virgo: 75, Libra: 55, Scorpio: 35, Sagittarius: 80, Capricorn: 55, Aquarius: 90, Pisces: 88 },
  Scorpio: { Aries: 50, Taurus: 88, Gemini: 28, Cancer: 94, Leo: 53, Virgo: 88, Libra: 35, Scorpio: 60, Sagittarius: 28, Capricorn: 95, Aquarius: 73, Pisces: 97 },
  Sagittarius: { Aries: 93, Taurus: 30, Gemini: 60, Cancer: 53, Leo: 93, Virgo: 48, Libra: 80, Scorpio: 28, Sagittarius: 45, Capricorn: 68, Aquarius: 90, Pisces: 60 },
  Capricorn: { Aries: 47, Taurus: 98, Gemini: 68, Cancer: 83, Leo: 35, Virgo: 95, Libra: 55, Scorpio: 95, Sagittarius: 68, Capricorn: 60, Aquarius: 60, Pisces: 88 },
  Aquarius: { Aries: 78, Taurus: 58, Gemini: 85, Cancer: 27, Leo: 68, Virgo: 30, Libra: 90, Scorpio: 73, Sagittarius: 90, Capricorn: 60, Aquarius: 45, Pisces: 45 },
  Pisces: { Aries: 67, Taurus: 85, Gemini: 53, Cancer: 98, Leo: 38, Virgo: 88, Libra: 88, Scorpio: 97, Sagittarius: 60, Capricorn: 88, Aquarius: 45, Pisces: 60 }
};

// Element compatibility rules
export const ELEMENT_COMPATIBILITY: Record<string, { score: number; description: string }> = {
  Fire_Fire: { score: 70, description: 'Passionate but power struggles; intense energy' },
  Fire_Air: { score: 85, description: 'EXCELLENT - Air fuels Fire; dynamic and stimulating' },
  Fire_Earth: { score: 50, description: 'MODERATE - Different paces and values' },
  Fire_Water: { score: 40, description: 'DIFFICULT - Water extinguishes Fire; emotional clashes' },
  Earth_Earth: { score: 80, description: 'Very stable; excellent understanding; may lack excitement' },
  Earth_Air: { score: 50, description: 'MODERATE - Practical vs intellectual clash' },
  Earth_Water: { score: 85, description: 'EXCELLENT - Water nourishes Earth; emotionally secure' },
  Air_Air: { score: 70, description: 'Intellectual connection; may lack grounding' },
  Air_Water: { score: 45, description: 'DIFFICULT - Head vs heart conflict' },
  Water_Water: { score: 70, description: 'Deep emotional bond; risk of emotional overwhelm' }
};

// Modality compatibility rules
export const MODALITY_COMPATIBILITY: Record<string, { score: number; description: string }> = {
  Cardinal_Cardinal: { score: 50, description: 'Power struggles; both want to lead' },
  Cardinal_Fixed: { score: 60, description: 'Balanced if roles clear' },
  Cardinal_Mutable: { score: 75, description: 'GOOD - Cardinal leads, Mutable adapts' },
  Fixed_Fixed: { score: 45, description: 'Stubborn standoffs; neither compromises' },
  Fixed_Mutable: { score: 70, description: 'GOOD - Fixed provides stability, Mutable flexibility' },
  Mutable_Mutable: { score: 55, description: 'Highly adaptable but may lack direction' }
};

// Polarity compatibility
export const POLARITY_COMPATIBILITY: Record<string, { score: number; description: string }> = {
  Positive_Positive: { score: 65, description: 'Yang-Yang: Active, extroverted energy; may compete' },
  Positive_Negative: { score: 75, description: 'Yang-Yin: Complementary balance; attracts' },
  Negative_Negative: { score: 65, description: 'Yin-Yin: Receptive, introverted; deep understanding' }
};

// Get compatibility score between two signs
export function getCompatibilityScore(sign1: string, sign2: string): number {
  return COMPATIBILITY_MATRIX[sign1]?.[sign2] ?? 50;
}

// Get element compatibility key
export function getElementCompatibilityKey(element1: string, element2: string): string {
  const sorted = [element1, element2].sort();
  return `${sorted[0]}_${sorted[1]}`;
}

// Get modality compatibility key
export function getModalityCompatibilityKey(modality1: string, modality2: string): string {
  const sorted = [modality1, modality2].sort();
  return `${sorted[0]}_${sorted[1]}`;
}
