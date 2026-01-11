/**
 * Complete Zodiac Signs Knowledge Base
 * Contains all 12 zodiac signs with comprehensive astrological data
 */

// Type definitions
export interface DateRange {
  start: { month: number; day: number };
  end: { month: number; day: number };
}

export interface Decan {
  degrees: string;
  dateRange: string;
  ruler: string;
  description: string;
}

export interface ZodiacSign {
  name: string;
  nameZh: string;
  symbol: string;
  unicode: string;
  dateRange: DateRange;
  element: 'Fire' | 'Earth' | 'Air' | 'Water';
  modality: 'Cardinal' | 'Fixed' | 'Mutable';
  polarity: { type: 'Positive' | 'Negative'; energy: 'Yang' | 'Yin' };
  rulingPlanet: { traditional: string; modern: string };
  bodyParts: string[];
  colors: { primary: string[]; secondary: string[] };
  metal: string;
  gemstones: { traditional: string[]; modern: string[] };
  luckyNumbers: number[];
  dayOfWeek: string;
  keywords: string[];
  positiveTraits: string[];
  negativeTraits: string[];
  decans: { first: Decan; second: Decan; third: Decan };
}

// Complete zodiac signs data
export const ZODIAC_SIGNS: Record<string, ZodiacSign> = {
  Aries: {
    name: 'Aries', nameZh: '白羊座', symbol: '♈', unicode: 'U+2648',
    dateRange: { start: { month: 3, day: 21 }, end: { month: 4, day: 19 } },
    element: 'Fire', modality: 'Cardinal',
    polarity: { type: 'Positive', energy: 'Yang' },
    rulingPlanet: { traditional: 'Mars', modern: 'Mars' },
    bodyParts: ['Head', 'face', 'brain', 'eyes', 'adrenal glands'],
    colors: { primary: ['Red', 'Scarlet'], secondary: ['White', 'Pink'] },
    metal: 'Iron',
    gemstones: { traditional: ['Diamond', 'Bloodstone'], modern: ['Carnelian'] },
    luckyNumbers: [1, 8, 9, 17], dayOfWeek: 'Tuesday',
    keywords: ['Bold', 'Independent', 'Pioneering', 'Competitive', 'Impulsive', 'Energetic', 'Courageous', 'Direct', 'Passionate', 'Leadership'],
    positiveTraits: ['Courageous', 'Determined', 'Confident', 'Enthusiastic', 'Optimistic', 'Honest', 'Passionate'],
    negativeTraits: ['Impatient', 'Moody', 'Short-tempered', 'Impulsive', 'Aggressive'],
    decans: {
      first: { degrees: '0-10', dateRange: 'Mar 21-30', ruler: 'Mars', description: 'Pure warrior energy, most bold and impulsive' },
      second: { degrees: '10-20', dateRange: 'Mar 31-Apr 9', ruler: 'Sun', description: 'Added warmth, creativity, seeks recognition' },
      third: { degrees: '20-30', dateRange: 'Apr 10-19', ruler: 'Jupiter', description: 'Philosophical, freedom-loving, adventurous' }
    }
  },
  Taurus: {
    name: 'Taurus', nameZh: '金牛座', symbol: '♉', unicode: 'U+2649',
    dateRange: { start: { month: 4, day: 20 }, end: { month: 5, day: 20 } },
    element: 'Earth', modality: 'Fixed',
    polarity: { type: 'Negative', energy: 'Yin' },
    rulingPlanet: { traditional: 'Venus', modern: 'Venus' },
    bodyParts: ['Neck', 'throat', 'thyroid', 'vocal cords'],
    colors: { primary: ['Green', 'Pink'], secondary: ['Earth tones', 'Brown'] },
    metal: 'Copper',
    gemstones: { traditional: ['Emerald', 'Sapphire'], modern: ['Rose Quartz'] },
    luckyNumbers: [2, 6, 9, 12, 24], dayOfWeek: 'Friday',
    keywords: ['Stable', 'Sensual', 'Patient', 'Determined', 'Loyal', 'Practical', 'Reliable', 'Stubborn', 'Materialistic', 'Grounded'],
    positiveTraits: ['Reliable', 'Patient', 'Practical', 'Devoted', 'Responsible', 'Stable'],
    negativeTraits: ['Stubborn', 'Possessive', 'Uncompromising', 'Materialistic'],
    decans: {
      first: { degrees: '0-10', dateRange: 'Apr 20-30', ruler: 'Venus', description: 'Pure Taurus, loves aesthetics, most sensual' },
      second: { degrees: '10-20', dateRange: 'May 1-10', ruler: 'Mercury', description: 'More analytical, detail-oriented' },
      third: { degrees: '20-30', dateRange: 'May 11-20', ruler: 'Saturn', description: 'Great builders, most ambitious' }
    }
  },
  Gemini: {
    name: 'Gemini', nameZh: '双子座', symbol: '♊', unicode: 'U+264A',
    dateRange: { start: { month: 5, day: 21 }, end: { month: 6, day: 20 } },
    element: 'Air', modality: 'Mutable',
    polarity: { type: 'Positive', energy: 'Yang' },
    rulingPlanet: { traditional: 'Mercury', modern: 'Mercury' },
    bodyParts: ['Arms', 'hands', 'shoulders', 'lungs', 'nervous system'],
    colors: { primary: ['Yellow', 'Light green'], secondary: ['Orange', 'Silver'] },
    metal: 'Mercury',
    gemstones: { traditional: ['Agate', 'Pearl'], modern: ['Moonstone', 'Citrine'] },
    luckyNumbers: [3, 5, 7], dayOfWeek: 'Wednesday',
    keywords: ['Curious', 'Adaptable', 'Communicative', 'Witty', 'Versatile', 'Intellectual', 'Sociable', 'Restless', 'Dual-natured', 'Quick-thinking'],
    positiveTraits: ['Gentle', 'Affectionate', 'Curious', 'Adaptable', 'Quick learner'],
    negativeTraits: ['Nervous', 'Inconsistent', 'Indecisive', 'Superficial'],
    decans: {
      first: { degrees: '0-10', dateRange: 'May 21-30', ruler: 'Mercury', description: 'Purest Gemini, extremely chatty' },
      second: { degrees: '10-20', dateRange: 'May 31-Jun 9', ruler: 'Venus', description: 'More expressive, artistic' },
      third: { degrees: '20-30', dateRange: 'Jun 10-20', ruler: 'Uranus', description: 'Innovative, humanitarian' }
    }
  },
  Cancer: {
    name: 'Cancer', nameZh: '巨蟹座', symbol: '♋', unicode: 'U+264B',
    dateRange: { start: { month: 6, day: 21 }, end: { month: 7, day: 22 } },
    element: 'Water', modality: 'Cardinal',
    polarity: { type: 'Negative', energy: 'Yin' },
    rulingPlanet: { traditional: 'Moon', modern: 'Moon' },
    bodyParts: ['Breasts', 'chest', 'stomach', 'digestive system'],
    colors: { primary: ['White', 'Silver'], secondary: ['Violet', 'Sea green'] },
    metal: 'Silver',
    gemstones: { traditional: ['Pearl', 'Moonstone'], modern: ['Ruby', 'Opal'] },
    luckyNumbers: [2, 7, 11, 16], dayOfWeek: 'Monday',
    keywords: ['Nurturing', 'Emotional', 'Intuitive', 'Protective', 'Loyal', 'Sentimental', 'Tenacious', 'Moody', 'Family-oriented', 'Empathetic'],
    positiveTraits: ['Tenacious', 'Highly imaginative', 'Loyal', 'Emotional', 'Sympathetic', 'Persuasive'],
    negativeTraits: ['Moody', 'Pessimistic', 'Suspicious', 'Manipulative', 'Insecure'],
    decans: {
      first: { degrees: '0-10', dateRange: 'Jun 21-30', ruler: 'Moon', description: 'Most emotional and intuitive' },
      second: { degrees: '10-20', dateRange: 'Jul 1-12', ruler: 'Pluto', description: 'Deep feelings, excellent psychologists' },
      third: { degrees: '20-30', dateRange: 'Jul 13-22', ruler: 'Neptune', description: 'Most sensitive of all 36 decans' }
    }
  },
  Leo: {
    name: 'Leo', nameZh: '狮子座', symbol: '♌', unicode: 'U+264C',
    dateRange: { start: { month: 7, day: 23 }, end: { month: 8, day: 22 } },
    element: 'Fire', modality: 'Fixed',
    polarity: { type: 'Positive', energy: 'Yang' },
    rulingPlanet: { traditional: 'Sun', modern: 'Sun' },
    bodyParts: ['Heart', 'spine', 'upper back', 'circulatory system'],
    colors: { primary: ['Gold', 'Orange'], secondary: ['Yellow', 'Red', 'Purple'] },
    metal: 'Gold',
    gemstones: { traditional: ['Ruby', 'Peridot'], modern: ['Onyx', "Tiger's Eye"] },
    luckyNumbers: [1, 4, 10, 13, 19], dayOfWeek: 'Sunday',
    keywords: ['Confident', 'Generous', 'Dramatic', 'Loyal', 'Creative', 'Proud', 'Charismatic', 'Warm-hearted', 'Ambitious', 'Regal'],
    positiveTraits: ['Creative', 'Passionate', 'Generous', 'Warm-hearted', 'Cheerful', 'Humorous'],
    negativeTraits: ['Arrogant', 'Stubborn', 'Self-centered', 'Lazy', 'Inflexible'],
    decans: {
      first: { degrees: '0-10', dateRange: 'Jul 23-Aug 1', ruler: 'Sun', description: 'Pure Leo, most radiant and egotistical' },
      second: { degrees: '10-20', dateRange: 'Aug 2-12', ruler: 'Jupiter', description: 'Freedom-loving, daring' },
      third: { degrees: '20-30', dateRange: 'Aug 13-22', ruler: 'Mars', description: 'Warrior-king energy, most ambitious' }
    }
  },
  Virgo: {
    name: 'Virgo', nameZh: '处女座', symbol: '♍', unicode: 'U+264D',
    dateRange: { start: { month: 8, day: 23 }, end: { month: 9, day: 22 } },
    element: 'Earth', modality: 'Mutable',
    polarity: { type: 'Negative', energy: 'Yin' },
    rulingPlanet: { traditional: 'Mercury', modern: 'Mercury' },
    bodyParts: ['Digestive system', 'intestines', 'pancreas', 'nervous system'],
    colors: { primary: ['Navy Blue', 'Beige', 'Grey'], secondary: ['Green', 'Brown'] },
    metal: 'Mercury',
    gemstones: { traditional: ['Sapphire', 'Carnelian'], modern: ['Peridot'] },
    luckyNumbers: [5, 14, 23, 32], dayOfWeek: 'Wednesday',
    keywords: ['Analytical', 'Practical', 'Helpful', 'Detail-oriented', 'Modest', 'Perfectionist', 'Reliable', 'Organized', 'Health-conscious', 'Discerning'],
    positiveTraits: ['Loyal', 'Analytical', 'Kind', 'Hardworking', 'Practical'],
    negativeTraits: ['Shyness', 'Worry', 'Overly critical', 'All work no play'],
    decans: {
      first: { degrees: '0-10', dateRange: 'Aug 23-Sep 1', ruler: 'Mercury', description: 'Pure Virgo, most analytical' },
      second: { degrees: '10-20', dateRange: 'Sep 2-12', ruler: 'Saturn', description: 'Most serious and disciplined' },
      third: { degrees: '20-30', dateRange: 'Sep 13-22', ruler: 'Venus', description: 'More sensual, artistic sensitivity' }
    }
  },
  Libra: {
    name: 'Libra', nameZh: '天秤座', symbol: '♎', unicode: 'U+264E',
    dateRange: { start: { month: 9, day: 23 }, end: { month: 10, day: 22 } },
    element: 'Air', modality: 'Cardinal',
    polarity: { type: 'Positive', energy: 'Yang' },
    rulingPlanet: { traditional: 'Venus', modern: 'Venus' },
    bodyParts: ['Kidneys', 'lower back', 'bladder', 'adrenal glands'],
    colors: { primary: ['Pink', 'Light blue'], secondary: ['Lavender', 'Ivory'] },
    metal: 'Copper',
    gemstones: { traditional: ['Opal', 'Sapphire'], modern: ['Rose Quartz', 'Jade'] },
    luckyNumbers: [6, 9, 15, 24, 33], dayOfWeek: 'Friday',
    keywords: ['Balanced', 'Diplomatic', 'Harmonious', 'Romantic', 'Fair-minded', 'Indecisive', 'Charming', 'Partnership-oriented', 'Aesthetic', 'Peace-loving'],
    positiveTraits: ['Cooperative', 'Diplomatic', 'Gracious', 'Fair-minded', 'Social'],
    negativeTraits: ['Indecisive', 'Avoids confrontations', 'Self-pity', 'Holds grudges'],
    decans: {
      first: { degrees: '0-10', dateRange: 'Sep 23-Oct 2', ruler: 'Venus', description: 'Purest Libra, lover of aesthetics' },
      second: { degrees: '10-20', dateRange: 'Oct 3-12', ruler: 'Uranus', description: 'More innovative, independent' },
      third: { degrees: '20-30', dateRange: 'Oct 13-22', ruler: 'Mercury', description: 'Excellent communicators' }
    }
  },
  Scorpio: {
    name: 'Scorpio', nameZh: '天蝎座', symbol: '♏', unicode: 'U+264F',
    dateRange: { start: { month: 10, day: 23 }, end: { month: 11, day: 21 } },
    element: 'Water', modality: 'Fixed',
    polarity: { type: 'Negative', energy: 'Yin' },
    rulingPlanet: { traditional: 'Mars', modern: 'Pluto' },
    bodyParts: ['Reproductive organs', 'genitals', 'bladder', 'pelvis'],
    colors: { primary: ['Black', 'Deep red'], secondary: ['Burgundy', 'Dark purple'] },
    metal: 'Iron',
    gemstones: { traditional: ['Topaz', 'Obsidian'], modern: ['Garnet', 'Malachite'] },
    luckyNumbers: [8, 11, 18, 22], dayOfWeek: 'Tuesday',
    keywords: ['Intense', 'Passionate', 'Mysterious', 'Transformative', 'Loyal', 'Powerful', 'Secretive', 'Resourceful', 'Investigative', 'Magnetic'],
    positiveTraits: ['Resourceful', 'Brave', 'Passionate', 'Stubborn', 'True friend'],
    negativeTraits: ['Distrusting', 'Jealous', 'Secretive', 'Violent', 'Manipulative'],
    decans: {
      first: { degrees: '0-10', dateRange: 'Oct 23-Nov 1', ruler: 'Pluto', description: 'Most intense, deeply transformative' },
      second: { degrees: '10-20', dateRange: 'Nov 2-11', ruler: 'Neptune', description: 'More spiritually inclined, psychic' },
      third: { degrees: '20-30', dateRange: 'Nov 12-21', ruler: 'Moon', description: 'More nurturing, protective' }
    }
  },
  Sagittarius: {
    name: 'Sagittarius', nameZh: '射手座', symbol: '♐', unicode: 'U+2650',
    dateRange: { start: { month: 11, day: 22 }, end: { month: 12, day: 21 } },
    element: 'Fire', modality: 'Mutable',
    polarity: { type: 'Positive', energy: 'Yang' },
    rulingPlanet: { traditional: 'Jupiter', modern: 'Jupiter' },
    bodyParts: ['Hips', 'thighs', 'liver', 'sacrum', 'sciatic nerve'],
    colors: { primary: ['Purple', 'Violet', 'Red'], secondary: ['Pink', 'Orange'] },
    metal: 'Tin',
    gemstones: { traditional: ['Turquoise', 'Blue Topaz'], modern: ['Tanzanite', 'Lapis Lazuli'] },
    luckyNumbers: [3, 7, 9, 12, 21], dayOfWeek: 'Thursday',
    keywords: ['Adventurous', 'Optimistic', 'Philosophical', 'Independent', 'Honest', 'Enthusiastic', 'Freedom-loving', 'Generous', 'Idealistic', 'Restless'],
    positiveTraits: ['Generous', 'Idealistic', 'Great sense of humor', 'Adventurous'],
    negativeTraits: ['Promises more than can deliver', 'Impatient', 'Tactless'],
    decans: {
      first: { degrees: '0-10', dateRange: 'Nov 22-Dec 2', ruler: 'Jupiter', description: 'Purest Sagittarius, most frank and bold' },
      second: { degrees: '10-20', dateRange: 'Dec 3-12', ruler: 'Mars', description: 'Most energetic and passionate' },
      third: { degrees: '20-30', dateRange: 'Dec 13-21', ruler: 'Sun', description: 'The showman, natural leaders' }
    }
  },
  Capricorn: {
    name: 'Capricorn', nameZh: '摩羯座', symbol: '♑', unicode: 'U+2651',
    dateRange: { start: { month: 12, day: 22 }, end: { month: 1, day: 19 } },
    element: 'Earth', modality: 'Cardinal',
    polarity: { type: 'Negative', energy: 'Yin' },
    rulingPlanet: { traditional: 'Saturn', modern: 'Saturn' },
    bodyParts: ['Knees', 'joints', 'bones', 'teeth', 'skeletal system'],
    colors: { primary: ['Brown', 'Black', 'Dark Grey'], secondary: ['Forest Green', 'Navy'] },
    metal: 'Lead',
    gemstones: { traditional: ['Garnet', 'Onyx'], modern: ['Ruby', 'Blue Sapphire'] },
    luckyNumbers: [4, 8, 13, 22], dayOfWeek: 'Saturday',
    keywords: ['Ambitious', 'Disciplined', 'Practical', 'Responsible', 'Patient', 'Traditional', 'Determined', 'Reserved', 'Strategic', 'Hardworking'],
    positiveTraits: ['Responsible', 'Disciplined', 'Self-control', 'Good managers'],
    negativeTraits: ['Know-it-all', 'Unforgiving', 'Condescending', 'Expecting worst'],
    decans: {
      first: { degrees: '0-10', dateRange: 'Dec 22-31', ruler: 'Saturn', description: 'Purest Capricorn, philosophical, firm' },
      second: { degrees: '10-20', dateRange: 'Jan 1-10', ruler: 'Venus', description: 'More sensuous, charming' },
      third: { degrees: '20-30', dateRange: 'Jan 11-19', ruler: 'Mercury', description: 'Most communicative, intellectual' }
    }
  },
  Aquarius: {
    name: 'Aquarius', nameZh: '水瓶座', symbol: '♒', unicode: 'U+2652',
    dateRange: { start: { month: 1, day: 20 }, end: { month: 2, day: 18 } },
    element: 'Air', modality: 'Fixed',
    polarity: { type: 'Positive', energy: 'Yang' },
    rulingPlanet: { traditional: 'Saturn', modern: 'Uranus' },
    bodyParts: ['Ankles', 'calves', 'shins', 'circulatory system'],
    colors: { primary: ['Electric Blue', 'Turquoise'], secondary: ['Grey', 'Silver', 'Violet'] },
    metal: 'Uranium',
    gemstones: { traditional: ['Amethyst', 'Garnet'], modern: ['Aquamarine', 'Turquoise'] },
    luckyNumbers: [4, 7, 11, 22, 29], dayOfWeek: 'Saturday',
    keywords: ['Independent', 'Innovative', 'Humanitarian', 'Eccentric', 'Intellectual', 'Progressive', 'Rebellious', 'Detached', 'Original', 'Visionary'],
    positiveTraits: ['Progressive', 'Original', 'Independent', 'Humanitarian'],
    negativeTraits: ['Runs from emotional expression', 'Temperamental', 'Uncompromising', 'Aloof'],
    decans: {
      first: { degrees: '0-10', dateRange: 'Jan 20-29', ruler: 'Uranus', description: 'Most original, visionary' },
      second: { degrees: '10-20', dateRange: 'Jan 30-Feb 8', ruler: 'Mercury', description: 'Most communicative, curious' },
      third: { degrees: '20-30', dateRange: 'Feb 9-18', ruler: 'Venus', description: 'Most charming, artistic' }
    }
  },
  Pisces: {
    name: 'Pisces', nameZh: '双鱼座', symbol: '♓', unicode: 'U+2653',
    dateRange: { start: { month: 2, day: 19 }, end: { month: 3, day: 20 } },
    element: 'Water', modality: 'Mutable',
    polarity: { type: 'Negative', energy: 'Yin' },
    rulingPlanet: { traditional: 'Jupiter', modern: 'Neptune' },
    bodyParts: ['Feet', 'toes', 'lymphatic system', 'pineal gland'],
    colors: { primary: ['Sea Green', 'Lavender', 'Purple'], secondary: ['Pale Blue', 'Silver'] },
    metal: 'Tin',
    gemstones: { traditional: ['Aquamarine', 'Amethyst'], modern: ['Bloodstone'] },
    luckyNumbers: [3, 7, 12, 16, 21], dayOfWeek: 'Thursday',
    keywords: ['Intuitive', 'Compassionate', 'Creative', 'Dreamy', 'Empathetic', 'Spiritual', 'Sensitive', 'Imaginative', 'Artistic', 'Escapist'],
    positiveTraits: ['Compassionate', 'Artistic', 'Intuitive', 'Gentle', 'Wise', 'Musical'],
    negativeTraits: ['Fearful', 'Overly trusting', 'Sad', 'Desire to escape reality', 'Victim mentality'],
    decans: {
      first: { degrees: '0-10', dateRange: 'Feb 19-28/29', ruler: 'Neptune', description: 'Most spiritually attuned' },
      second: { degrees: '10-20', dateRange: 'Mar 1-10', ruler: 'Moon', description: 'Most creatively imaginative' },
      third: { degrees: '20-30', dateRange: 'Mar 11-20', ruler: 'Pluto', description: 'Strongest, most transformative' }
    }
  }
};

// Re-export compatibility data from dedicated module
export { COMPATIBILITY_MATRIX, ELEMENT_COMPATIBILITY, MODALITY_COMPATIBILITY } from './compatibility';

// Helper to get sign by index (0-11)
export const SIGN_ORDER = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'] as const;
