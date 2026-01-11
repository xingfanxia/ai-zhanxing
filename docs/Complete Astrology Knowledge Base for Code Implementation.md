# Complete Astrology Knowledge Base for Code Implementation

This comprehensive research provides structured data for building TypeScript/JSON astrology knowledge base files, covering all 12 zodiac signs, 13 celestial bodies, essential dignities, and aspect systems.

---

## Part 1: Complete Zodiac Signs Knowledge Base

### Master Sign Configuration

```typescript
interface ZodiacSign {
  name: string;
  symbol: string;
  unicode: string;
  dateRange: { start: { month: number; day: number }; end: { month: number; day: number } };
  element: "Fire" | "Earth" | "Air" | "Water";
  modality: "Cardinal" | "Fixed" | "Mutable";
  polarity: { type: "Positive" | "Negative"; energy: "Yang" | "Yin" };
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
  loveStyle: string;
  careerAptitudes: string[];
  communicationStyle: string;
  decans: { first: DecanData; second: DecanData; third: DecanData };
}
```

### Complete 12-Sign Data

#### ARIES ♈
| Attribute | Value |
|-----------|-------|
| **Dates** | March 21 – April 19 |
| **Element** | Fire |
| **Modality** | Cardinal |
| **Polarity** | Positive/Yang |
| **Ruler** | Mars (traditional & modern) |
| **Symbol** | ♈ (Ram's horns) |
| **Body Parts** | Head, face, brain, eyes, adrenal glands |
| **Colors** | Red, Scarlet (primary); White, Pink (secondary) |
| **Metal** | Iron |
| **Gemstones** | Diamond, Bloodstone, Carnelian |
| **Lucky Numbers** | 1, 8, 9, 17 |
| **Day** | Tuesday |

**Keywords**: Bold, Independent, Pioneering, Competitive, Impulsive, Energetic, Courageous, Direct, Passionate, Leadership

**Decans**:
- **1st (0°-10°) Mar 21-30**: Mars — Pure warrior energy, most bold and impulsive
- **2nd (10°-20°) Mar 31-Apr 9**: Sun (Leo) — Added warmth, creativity, seeks recognition
- **3rd (20°-30°) Apr 10-19**: Jupiter (Sagittarius) — Philosophical, freedom-loving, adventurous

---

#### TAURUS ♉
| Attribute | Value |
|-----------|-------|
| **Dates** | April 20 – May 20 |
| **Element** | Earth |
| **Modality** | Fixed |
| **Polarity** | Negative/Yin |
| **Ruler** | Venus (traditional & modern) |
| **Symbol** | ♉ (Bull's head) |
| **Body Parts** | Neck, throat, thyroid, vocal cords |
| **Colors** | Green, Pink (primary); Earth tones, Brown (secondary) |
| **Metal** | Copper |
| **Gemstones** | Emerald, Sapphire, Rose Quartz |
| **Lucky Numbers** | 2, 6, 9, 12, 24 |
| **Day** | Friday |

**Keywords**: Stable, Sensual, Patient, Determined, Loyal, Practical, Reliable, Stubborn, Materialistic, Grounded

**Decans**:
- **1st (0°-10°) Apr 20-30**: Venus — Pure Taurus, loves aesthetics, most sensual
- **2nd (10°-20°) May 1-10**: Mercury (Virgo) — More analytical, detail-oriented
- **3rd (20°-30°) May 11-20**: Saturn (Capricorn) — Great builders, most ambitious

---

#### GEMINI ♊
| Attribute | Value |
|-----------|-------|
| **Dates** | May 21 – June 20 |
| **Element** | Air |
| **Modality** | Mutable |
| **Polarity** | Positive/Yang |
| **Ruler** | Mercury (traditional & modern) |
| **Symbol** | ♊ (The Twins) |
| **Body Parts** | Arms, hands, shoulders, lungs, nervous system |
| **Colors** | Yellow, Light green (primary); Orange, Silver (secondary) |
| **Metal** | Mercury (quicksilver) |
| **Gemstones** | Agate, Pearl, Moonstone, Citrine |
| **Lucky Numbers** | 3, 5, 7 |
| **Day** | Wednesday |

**Keywords**: Curious, Adaptable, Communicative, Witty, Versatile, Intellectual, Sociable, Restless, Dual-natured, Quick-thinking

**Decans**:
- **1st (0°-10°) May 21-30**: Mercury — Purest Gemini, extremely chatty
- **2nd (10°-20°) May 31-Jun 9**: Venus (Libra) — More expressive, artistic
- **3rd (20°-30°) Jun 10-20**: Uranus (Aquarius) — Innovative, humanitarian

---

#### CANCER ♋
| Attribute | Value |
|-----------|-------|
| **Dates** | June 21 – July 22 |
| **Element** | Water |
| **Modality** | Cardinal |
| **Polarity** | Negative/Yin |
| **Ruler** | Moon (traditional & modern) |
| **Symbol** | ♋ (Crab claws) |
| **Body Parts** | Breasts, chest, stomach, digestive system |
| **Colors** | White, Silver (primary); Violet, Sea green (secondary) |
| **Metal** | Silver |
| **Gemstones** | Pearl, Moonstone, Ruby, Opal |
| **Lucky Numbers** | 2, 7, 11, 16 |
| **Day** | Monday |

**Keywords**: Nurturing, Emotional, Intuitive, Protective, Loyal, Sentimental, Tenacious, Moody, Family-oriented, Empathetic

**Decans**:
- **1st (0°-10°) Jun 21-30**: Moon — Most emotional and intuitive
- **2nd (10°-20°) Jul 1-12**: Pluto (Scorpio) — Deep feelings, excellent psychologists
- **3rd (20°-30°) Jul 13-22**: Neptune (Pisces) — Most sensitive of all 36 decans

---

#### LEO ♌
| Attribute | Value |
|-----------|-------|
| **Dates** | July 23 – August 22 |
| **Element** | Fire |
| **Modality** | Fixed |
| **Polarity** | Positive/Yang |
| **Ruler** | Sun (traditional & modern) |
| **Symbol** | ♌ (Lion's mane) |
| **Body Parts** | Heart, spine, upper back, circulatory system |
| **Colors** | Gold, Orange (primary); Yellow, Red, Purple (secondary) |
| **Metal** | Gold |
| **Gemstones** | Ruby, Peridot, Onyx, Tiger's Eye |
| **Lucky Numbers** | 1, 4, 10, 13, 19 |
| **Day** | Sunday |

**Keywords**: Confident, Generous, Dramatic, Loyal, Creative, Proud, Charismatic, Warm-hearted, Ambitious, Regal

**Decans**:
- **1st (0°-10°) Jul 23-Aug 1**: Sun — Pure Leo, most radiant and egotistical
- **2nd (10°-20°) Aug 2-12**: Jupiter (Sagittarius) — Freedom-loving, daring
- **3rd (20°-30°) Aug 13-22**: Mars (Aries) — Warrior-king energy, most ambitious

---

#### VIRGO ♍
| Attribute | Value |
|-----------|-------|
| **Dates** | August 23 – September 22 |
| **Element** | Earth |
| **Modality** | Mutable |
| **Polarity** | Negative/Yin |
| **Ruler** | Mercury (traditional & modern) |
| **Symbol** | ♍ (Maiden with wheat) |
| **Body Parts** | Digestive system, intestines, pancreas, nervous system |
| **Colors** | Navy Blue, Beige, Grey (primary); Green, Brown (secondary) |
| **Metal** | Mercury (quicksilver) |
| **Gemstones** | Sapphire, Carnelian, Peridot |
| **Lucky Numbers** | 5, 14, 23, 32 |
| **Day** | Wednesday |

**Keywords**: Analytical, Practical, Helpful, Detail-oriented, Modest, Perfectionist, Reliable, Organized, Health-conscious, Discerning

**Decans**:
- **1st (0°-10°) Aug 23-Sep 1**: Mercury — Pure Virgo, most analytical
- **2nd (10°-20°) Sep 2-12**: Saturn (Capricorn) — Most serious and disciplined
- **3rd (20°-30°) Sep 13-22**: Venus (Taurus) — More sensual, artistic sensitivity

---

#### LIBRA ♎
| Attribute | Value |
|-----------|-------|
| **Dates** | September 23 – October 22 |
| **Element** | Air |
| **Modality** | Cardinal |
| **Polarity** | Positive/Yang |
| **Ruler** | Venus (traditional & modern) |
| **Symbol** | ♎ (The Scales) |
| **Body Parts** | Kidneys, lower back, bladder, adrenal glands |
| **Colors** | Pink, Light blue (primary); Lavender, Ivory (secondary) |
| **Metal** | Copper, Bronze |
| **Gemstones** | Opal, Sapphire, Rose Quartz, Jade |
| **Lucky Numbers** | 6, 9, 15, 24, 33 |
| **Day** | Friday |

**Keywords**: Balanced, Diplomatic, Harmonious, Romantic, Fair-minded, Indecisive, Charming, Partnership-oriented, Aesthetic, Peace-loving

**Decans**:
- **1st (0°-10°) Sep 23-Oct 2**: Venus — Purest Libra, lover of aesthetics
- **2nd (10°-20°) Oct 3-12**: Uranus (Aquarius) — More innovative, independent
- **3rd (20°-30°) Oct 13-22**: Mercury (Gemini) — Excellent communicators

---

#### SCORPIO ♏
| Attribute | Value |
|-----------|-------|
| **Dates** | October 23 – November 21 |
| **Element** | Water |
| **Modality** | Fixed |
| **Polarity** | Negative/Yin |
| **Ruler** | Mars (traditional); Pluto (modern) |
| **Symbol** | ♏ (Scorpion's stinger) |
| **Body Parts** | Reproductive organs, genitals, bladder, pelvis |
| **Colors** | Black, Deep red (primary); Burgundy, Dark purple (secondary) |
| **Metal** | Iron, Steel |
| **Gemstones** | Topaz, Obsidian, Garnet, Malachite |
| **Lucky Numbers** | 8, 11, 18, 22 |
| **Day** | Tuesday |

**Keywords**: Intense, Passionate, Mysterious, Transformative, Loyal, Powerful, Secretive, Resourceful, Investigative, Magnetic

**Decans**:
- **1st (0°-10°) Oct 23-Nov 1**: Pluto/Mars — Most intense, deeply transformative
- **2nd (10°-20°) Nov 2-11**: Neptune (Pisces) — More spiritually inclined, psychic
- **3rd (20°-30°) Nov 12-21**: Moon (Cancer) — More nurturing, protective

---

#### SAGITTARIUS ♐
| Attribute | Value |
|-----------|-------|
| **Dates** | November 22 – December 21 |
| **Element** | Fire |
| **Modality** | Mutable |
| **Polarity** | Positive/Yang |
| **Ruler** | Jupiter (traditional & modern) |
| **Symbol** | ♐ (Archer's arrow) |
| **Body Parts** | Hips, thighs, liver, sacrum, sciatic nerve |
| **Colors** | Purple, Violet, Red (primary); Pink, Orange (secondary) |
| **Metal** | Tin |
| **Gemstones** | Turquoise, Blue Topaz, Tanzanite, Lapis Lazuli |
| **Lucky Numbers** | 3, 7, 9, 12, 21 |
| **Day** | Thursday |

**Keywords**: Adventurous, Optimistic, Philosophical, Independent, Honest, Enthusiastic, Freedom-loving, Generous, Idealistic, Restless

**Decans**:
- **1st (0°-10°) Nov 22-Dec 2**: Jupiter — Purest Sagittarius, most frank and bold
- **2nd (10°-20°) Dec 3-12**: Mars (Aries) — Most energetic and passionate
- **3rd (20°-30°) Dec 13-21**: Sun (Leo) — The showman, natural leaders

---

#### CAPRICORN ♑
| Attribute | Value |
|-----------|-------|
| **Dates** | December 22 – January 19 |
| **Element** | Earth |
| **Modality** | Cardinal |
| **Polarity** | Negative/Yin |
| **Ruler** | Saturn (traditional & modern) |
| **Symbol** | ♑ (Sea-Goat) |
| **Body Parts** | Knees, joints, bones, teeth, skeletal system |
| **Colors** | Brown, Black, Dark Grey (primary); Forest Green, Navy (secondary) |
| **Metal** | Lead |
| **Gemstones** | Garnet, Onyx, Ruby, Blue Sapphire |
| **Lucky Numbers** | 4, 8, 13, 22 |
| **Day** | Saturday |

**Keywords**: Ambitious, Disciplined, Practical, Responsible, Patient, Traditional, Determined, Reserved, Strategic, Hardworking

**Decans**:
- **1st (0°-10°) Dec 22-31**: Saturn — Purest Capricorn, philosophical, firm
- **2nd (10°-20°) Jan 1-10**: Venus (Taurus) — More sensuous, charming
- **3rd (20°-30°) Jan 11-19**: Mercury (Virgo) — Most communicative, intellectual

---

#### AQUARIUS ♒
| Attribute | Value |
|-----------|-------|
| **Dates** | January 20 – February 18 |
| **Element** | Air |
| **Modality** | Fixed |
| **Polarity** | Positive/Yang |
| **Ruler** | Saturn (traditional); Uranus (modern) |
| **Symbol** | ♒ (Water Bearer waves) |
| **Body Parts** | Ankles, calves, shins, circulatory system |
| **Colors** | Electric Blue, Turquoise (primary); Grey, Silver, Violet (secondary) |
| **Metal** | Uranium, Aluminum |
| **Gemstones** | Amethyst, Garnet, Aquamarine, Turquoise |
| **Lucky Numbers** | 4, 7, 11, 22, 29 |
| **Day** | Saturday |

**Keywords**: Independent, Innovative, Humanitarian, Eccentric, Intellectual, Progressive, Rebellious, Detached, Original, Visionary

**Decans**:
- **1st (0°-10°) Jan 20-29**: Saturn/Uranus — Most original, visionary
- **2nd (10°-20°) Jan 30-Feb 8**: Mercury (Gemini) — Most communicative, curious
- **3rd (20°-30°) Feb 9-18**: Venus (Libra) — Most charming, artistic

---

#### PISCES ♓
| Attribute | Value |
|-----------|-------|
| **Dates** | February 19 – March 20 |
| **Element** | Water |
| **Modality** | Mutable |
| **Polarity** | Negative/Yin |
| **Ruler** | Jupiter (traditional); Neptune (modern) |
| **Symbol** | ♓ (Two Fish) |
| **Body Parts** | Feet, toes, lymphatic system, pineal gland |
| **Colors** | Sea Green, Lavender, Purple (primary); Pale Blue, Silver (secondary) |
| **Metal** | Tin, Platinum |
| **Gemstones** | Aquamarine, Amethyst, Bloodstone |
| **Lucky Numbers** | 3, 7, 12, 16, 21 |
| **Day** | Thursday |

**Keywords**: Intuitive, Compassionate, Creative, Dreamy, Empathetic, Spiritual, Sensitive, Imaginative, Artistic, Escapist

**Decans**:
- **1st (0°-10°) Feb 19-28/29**: Neptune/Jupiter — Most spiritually attuned
- **2nd (10°-20°) Mar 1-10**: Moon (Cancer) — Most creatively imaginative
- **3rd (20°-30°) Mar 11-20**: Pluto/Mars (Scorpio) — Strongest, most transformative

---

### Sign Compatibility Matrix

```typescript
const COMPATIBILITY_MATRIX: Record<string, Record<string, number>> = {
  Aries:       { Aries: 50, Taurus: 38, Gemini: 83, Cancer: 42, Leo: 97, Virgo: 63, Libra: 85, Scorpio: 50, Sagittarius: 93, Capricorn: 47, Aquarius: 78, Pisces: 67 },
  Taurus:      { Aries: 38, Taurus: 65, Gemini: 33, Cancer: 97, Leo: 65, Virgo: 90, Libra: 65, Scorpio: 88, Sagittarius: 30, Capricorn: 98, Aquarius: 58, Pisces: 85 },
  Gemini:      { Aries: 83, Taurus: 33, Gemini: 60, Cancer: 65, Leo: 88, Virgo: 68, Libra: 93, Scorpio: 28, Sagittarius: 60, Capricorn: 68, Aquarius: 85, Pisces: 53 },
  Cancer:      { Aries: 42, Taurus: 97, Gemini: 65, Cancer: 75, Leo: 35, Virgo: 90, Libra: 43, Scorpio: 94, Sagittarius: 53, Capricorn: 83, Aquarius: 27, Pisces: 98 },
  Leo:         { Aries: 97, Taurus: 65, Gemini: 88, Cancer: 35, Leo: 68, Virgo: 35, Libra: 97, Scorpio: 53, Sagittarius: 93, Capricorn: 35, Aquarius: 68, Pisces: 38 },
  Virgo:       { Aries: 63, Taurus: 90, Gemini: 68, Cancer: 90, Leo: 35, Virgo: 65, Libra: 75, Scorpio: 88, Sagittarius: 48, Capricorn: 95, Aquarius: 30, Pisces: 88 },
  Libra:       { Aries: 85, Taurus: 65, Gemini: 93, Cancer: 43, Leo: 97, Virgo: 75, Libra: 55, Scorpio: 35, Sagittarius: 80, Capricorn: 55, Aquarius: 90, Pisces: 88 },
  Scorpio:     { Aries: 50, Taurus: 88, Gemini: 28, Cancer: 94, Leo: 53, Virgo: 88, Libra: 35, Scorpio: 60, Sagittarius: 28, Capricorn: 95, Aquarius: 73, Pisces: 97 },
  Sagittarius: { Aries: 93, Taurus: 30, Gemini: 60, Cancer: 53, Leo: 93, Virgo: 48, Libra: 80, Scorpio: 28, Sagittarius: 45, Capricorn: 68, Aquarius: 90, Pisces: 60 },
  Capricorn:   { Aries: 47, Taurus: 98, Gemini: 68, Cancer: 83, Leo: 35, Virgo: 95, Libra: 55, Scorpio: 95, Sagittarius: 68, Capricorn: 60, Aquarius: 60, Pisces: 88 },
  Aquarius:    { Aries: 78, Taurus: 58, Gemini: 85, Cancer: 27, Leo: 68, Virgo: 30, Libra: 90, Scorpio: 73, Sagittarius: 90, Capricorn: 60, Aquarius: 45, Pisces: 45 },
  Pisces:      { Aries: 67, Taurus: 85, Gemini: 53, Cancer: 98, Leo: 38, Virgo: 88, Libra: 88, Scorpio: 97, Sagittarius: 60, Capricorn: 88, Aquarius: 45, Pisces: 60 }
};
```

### Element Compatibility Rules

```typescript
const ELEMENT_COMPATIBILITY = {
  "Fire_Fire":   { score: 70, description: "Passionate but power struggles; intense energy" },
  "Fire_Air":    { score: 85, description: "EXCELLENT - Air fuels Fire; dynamic and stimulating" },
  "Fire_Earth":  { score: 50, description: "MODERATE - Different paces and values" },
  "Fire_Water":  { score: 40, description: "DIFFICULT - Water extinguishes Fire; emotional clashes" },
  "Earth_Earth": { score: 80, description: "Very stable; excellent understanding; may lack excitement" },
  "Earth_Air":   { score: 50, description: "MODERATE - Practical vs intellectual clash" },
  "Earth_Water": { score: 85, description: "EXCELLENT - Water nourishes Earth; emotionally secure" },
  "Air_Air":     { score: 70, description: "Intellectual connection; may lack grounding" },
  "Air_Water":   { score: 45, description: "DIFFICULT - Head vs heart conflict" },
  "Water_Water": { score: 70, description: "Deep emotional bond; risk of emotional overwhelm" }
};
```

### Modality Compatibility Rules

```typescript
const MODALITY_COMPATIBILITY = {
  "Cardinal_Cardinal": { score: 50, description: "Power struggles; both want to lead" },
  "Cardinal_Fixed":    { score: 60, description: "Balanced if roles clear" },
  "Cardinal_Mutable":  { score: 75, description: "GOOD - Cardinal leads, Mutable adapts" },
  "Fixed_Fixed":       { score: 45, description: "Stubborn standoffs; neither compromises" },
  "Fixed_Mutable":     { score: 70, description: "GOOD - Fixed provides stability, Mutable flexibility" },
  "Mutable_Mutable":   { score: 55, description: "Highly adaptable but may lack direction" }
};
```

---

## Part 2: Complete Planets Knowledge Base

### Personal Planets

#### SUN ☉
```typescript
const SUN = {
  name: "Sun",
  symbol: "☉",
  unicode: "U+2609",
  type: "Personal/Luminary",
  orbitalPeriod: "365.25 days",
  timePerSign: "~30 days",
  speed: "~1° per day",
  retrograde: false,
  gender: "Masculine",
  sect: "Diurnal",
  keywords: ["Identity", "ego", "vitality", "willpower", "self-expression", "creativity", "leadership", "purpose", "consciousness", "father figure", "authority", "confidence", "life force", "core self", "individuality"],
  dignities: {
    domicile: ["Leo"],
    exaltation: { sign: "Aries", degree: 19 },
    detriment: ["Aquarius"],
    fall: "Libra"
  },
  triplicityRuler: { element: "Fire", type: "Day" }
};
```

#### MOON ☽
```typescript
const MOON = {
  name: "Moon",
  symbol: "☽",
  unicode: "U+263D",
  type: "Personal/Luminary",
  orbitalPeriod: "27.3 days (sidereal)",
  timePerSign: "~2.5 days",
  speed: "~13° per day",
  retrograde: false,
  gender: "Feminine",
  sect: "Nocturnal",
  keywords: ["Emotions", "instincts", "habits", "nurturing", "mother", "security", "memory", "receptivity", "subconscious", "moods", "needs", "comfort", "intuition", "domestic life", "inner child"],
  dignities: {
    domicile: ["Cancer"],
    exaltation: { sign: "Taurus", degree: 3 },
    detriment: ["Capricorn"],
    fall: "Scorpio"
  },
  triplicityRuler: { element: "Earth", type: "Night" }
};
```

#### MERCURY ☿
```typescript
const MERCURY = {
  name: "Mercury",
  symbol: "☿",
  unicode: "U+263F",
  type: "Personal",
  orbitalPeriod: "88 days",
  timePerSign: "14-30 days (variable)",
  speed: "~1.5° per day",
  retrograde: { frequency: "3-4x yearly", duration: "~3 weeks" },
  gender: "Neutral",
  sect: "Variable",
  keywords: ["Communication", "intellect", "thinking", "learning", "writing", "speech", "reasoning", "curiosity", "adaptability", "siblings", "short trips", "commerce", "dexterity", "perception", "information"],
  dignities: {
    domicile: ["Gemini", "Virgo"],
    exaltation: { sign: "Virgo", degree: 15 },
    detriment: ["Sagittarius", "Pisces"],
    fall: "Pisces"
  },
  triplicityRuler: { element: "Air", type: "Night" },
  retrogradeEffects: {
    natal: "Inward-focused thinking, unconventional communication style",
    transit: "Communication delays, technology issues, travel disruptions, time to review"
  }
};
```

#### VENUS ♀
```typescript
const VENUS = {
  name: "Venus",
  symbol: "♀",
  unicode: "U+2640",
  type: "Personal",
  orbitalPeriod: "225 days",
  timePerSign: "~18-19 days",
  speed: "~1.2° per day",
  retrograde: { frequency: "Every 18 months", duration: "~40-43 days" },
  gender: "Feminine",
  sect: "Nocturnal",
  keywords: ["Love", "beauty", "attraction", "relationships", "values", "pleasure", "harmony", "art", "aesthetics", "money", "possessions", "sensuality", "diplomacy", "partnership", "affection"],
  dignities: {
    domicile: ["Taurus", "Libra"],
    exaltation: { sign: "Pisces", degree: 27 },
    detriment: ["Aries", "Scorpio"],
    fall: "Virgo"
  },
  triplicityRuler: { element: "Earth", type: "Day" },
  retrogradeEffects: {
    natal: "Unconventional approach to love/beauty, past-life relationship themes",
    transit: "Re-evaluation of relationships and values, ex-partners may reappear"
  }
};
```

#### MARS ♂
```typescript
const MARS = {
  name: "Mars",
  symbol: "♂",
  unicode: "U+2642",
  type: "Personal",
  orbitalPeriod: "687 days (1.88 years)",
  timePerSign: "~6-7 weeks",
  speed: "~0.5° per day",
  retrograde: { frequency: "Every ~26 months", duration: "~8-10 weeks" },
  gender: "Masculine",
  sect: "Nocturnal",
  keywords: ["Action", "energy", "drive", "ambition", "aggression", "passion", "courage", "assertion", "sexuality", "conflict", "competition", "initiative", "physical strength", "anger", "desire"],
  dignities: {
    domicile: ["Aries", "Scorpio"],
    exaltation: { sign: "Capricorn", degree: 28 },
    detriment: ["Libra", "Taurus"],
    fall: "Cancer"
  },
  retrogradeEffects: {
    natal: "Internalized anger/drive, unconventional approach to action",
    transit: "Lowered energy, frustrated action, revisiting old conflicts"
  }
};
```

### Social Planets

#### JUPITER ♃
```typescript
const JUPITER = {
  name: "Jupiter",
  symbol: "♃",
  unicode: "U+2643",
  type: "Social",
  orbitalPeriod: "12 years",
  timePerSign: "~1 year",
  retrograde: { frequency: "Annually", duration: "~4 months", percentage: 33 },
  gender: "Masculine",
  sect: "Diurnal",
  keywords: ["Expansion", "abundance", "luck", "growth", "optimism", "faith", "philosophy", "higher learning", "travel", "wisdom", "generosity", "tolerance", "excess", "morality", "opportunity"],
  dignities: {
    domicile: ["Sagittarius", "Pisces"],
    exaltation: { sign: "Cancer", degree: 15 },
    detriment: ["Gemini", "Virgo"],
    fall: "Capricorn"
  },
  return: { ages: [12, 24, 36, 48, 60, 72, 84], meaning: "Expansion, growth, new opportunities" }
};
```

#### SATURN ♄
```typescript
const SATURN = {
  name: "Saturn",
  symbol: "♄",
  unicode: "U+2644",
  type: "Social",
  orbitalPeriod: "29.5 years",
  timePerSign: "~2.5 years",
  retrograde: { frequency: "Annually", duration: "~4.5 months", percentage: 36 },
  gender: "Masculine",
  sect: "Nocturnal",
  keywords: ["Structure", "discipline", "responsibility", "limitation", "time", "karma", "maturity", "authority", "boundaries", "patience", "lessons", "restriction", "mastery", "perseverance", "achievement"],
  dignities: {
    domicile: ["Capricorn", "Aquarius"],
    exaltation: { sign: "Libra", degree: 21 },
    detriment: ["Cancer", "Leo"],
    fall: "Aries"
  },
  return: {
    ages: [29, 58, 87],
    meaning: "Major life threshold, cosmic report card, maturation"
  }
};
```

### Transpersonal Planets

#### URANUS ♅
```typescript
const URANUS = {
  name: "Uranus",
  symbol: "♅",
  unicode: "U+2645",
  type: "Transpersonal/Generational",
  orbitalPeriod: "84 years",
  timePerSign: "~7 years",
  retrograde: { frequency: "Annually", duration: "~155 days", percentage: 41 },
  gender: "Masculine",
  keywords: ["Revolution", "innovation", "freedom", "rebellion", "awakening", "originality", "disruption", "independence", "sudden change", "technology", "genius", "eccentricity", "liberation", "electricity"],
  dignities: {
    domicile: ["Aquarius"],
    exaltation: { sign: "Scorpio" },
    detriment: ["Leo"],
    fall: "Taurus"
  }
};
```

#### NEPTUNE ♆
```typescript
const NEPTUNE = {
  name: "Neptune",
  symbol: "♆",
  unicode: "U+2646",
  type: "Transpersonal/Generational",
  orbitalPeriod: "165 years",
  timePerSign: "~14 years",
  retrograde: { frequency: "Annually", duration: "~160 days", percentage: 42 },
  gender: "Feminine",
  keywords: ["Dreams", "illusion", "spirituality", "imagination", "compassion", "dissolution", "transcendence", "mysticism", "deception", "inspiration", "fantasy", "intuition", "sacrifice", "artistry"],
  dignities: {
    domicile: ["Pisces"],
    detriment: ["Virgo"]
  }
};
```

#### PLUTO ♇
```typescript
const PLUTO = {
  name: "Pluto",
  symbol: "♇",
  unicode: "U+2647",
  type: "Transpersonal/Generational",
  orbitalPeriod: "248 years",
  timePerSign: "11-31 years (elliptical orbit)",
  retrograde: { frequency: "Annually", duration: "~165 days", percentage: 43 },
  gender: "Masculine",
  keywords: ["Transformation", "power", "death/rebirth", "intensity", "depth", "obsession", "control", "regeneration", "shadow", "secrets", "extremes", "purging", "evolution", "plutocracy"],
  dignities: {
    domicile: ["Scorpio"],
    detriment: ["Taurus"]
  }
};
```

### Minor Bodies

#### CHIRON ⚷
```typescript
const CHIRON = {
  name: "Chiron",
  symbol: "⚷",
  classification: "Centaur (asteroid/comet hybrid)",
  orbitalPeriod: "50-51 years",
  timePerSign: "4-8 years (irregular)",
  retrograde: { frequency: "Annually", duration: "~5 months" },
  keywords: ["Wounded healer", "core wounds", "healing powers", "teacher/mentor", "transformation through pain", "wisdom through suffering", "vulnerability", "inner child wounds"],
  return: { age: 50, meaning: "Core wounds resurface for deeper healing; call to become teacher/healer" },
  archetype: "Greek centaur who was wise healer and mentor to heroes; wounded by poisoned arrow that couldn't heal"
};
```

#### NORTH NODE ☊
```typescript
const NORTH_NODE = {
  name: "North Node",
  altNames: ["True Node", "Ascending Node", "Dragon's Head", "Rahu"],
  symbol: "☊",
  type: "Mathematical point",
  orbitalCycle: "18.6 years",
  movement: "Retrograde (backwards through zodiac)",
  keywords: ["Destiny", "life purpose", "soul mission", "karmic direction", "growth edge", "unfamiliar territory", "what to develop", "future evolution"],
  return: { ages: [18, 37, 56, 75], meaning: "Major turning point; opportunity to align with soul purpose" }
};
```

#### SOUTH NODE ☋
```typescript
const SOUTH_NODE = {
  name: "South Node",
  altNames: ["Descending Node", "Dragon's Tail", "Ketu"],
  symbol: "☋",
  relationship: "Always 180° opposite North Node",
  keywords: ["Past life", "karma", "innate talents", "comfort zone", "what to release", "default patterns", "mastered territory", "familiar habits", "spiritual inheritance"]
};
```

---

## Part 3: Essential Dignities System

### Complete Domicile Table
```typescript
const DOMICILES = {
  Sun:     { signs: ["Leo"], dayHouse: "Leo", nightHouse: null },
  Moon:    { signs: ["Cancer"], dayHouse: null, nightHouse: "Cancer" },
  Mercury: { signs: ["Gemini", "Virgo"], dayHouse: "Virgo", nightHouse: "Gemini" },
  Venus:   { signs: ["Taurus", "Libra"], dayHouse: "Libra", nightHouse: "Taurus" },
  Mars:    { signs: ["Aries", "Scorpio"], dayHouse: "Aries", nightHouse: "Scorpio" },
  Jupiter: { signs: ["Sagittarius", "Pisces"], dayHouse: "Sagittarius", nightHouse: "Pisces" },
  Saturn:  { signs: ["Capricorn", "Aquarius"], dayHouse: "Aquarius", nightHouse: "Capricorn" }
};
```

### Complete Exaltation Table (with Degrees)
```typescript
const EXALTATIONS = {
  Sun:     { sign: "Aries", degree: 19 },
  Moon:    { sign: "Taurus", degree: 3 },
  Mercury: { sign: "Virgo", degree: 15 },
  Venus:   { sign: "Pisces", degree: 27 },
  Mars:    { sign: "Capricorn", degree: 28 },
  Jupiter: { sign: "Cancer", degree: 15 },
  Saturn:  { sign: "Libra", degree: 21 }
};
```

### Complete Detriment & Fall Tables
```typescript
const DETRIMENTS = {
  Sun: ["Aquarius"], Moon: ["Capricorn"], Mercury: ["Sagittarius", "Pisces"],
  Venus: ["Aries", "Scorpio"], Mars: ["Taurus", "Libra"],
  Jupiter: ["Gemini", "Virgo"], Saturn: ["Cancer", "Leo"]
};

const FALLS = {
  Sun: "Libra", Moon: "Scorpio", Mercury: "Pisces", Venus: "Virgo",
  Mars: "Cancer", Jupiter: "Capricorn", Saturn: "Aries"
};
```

### Triplicity Rulers (Dorothean System)
```typescript
const TRIPLICITIES = {
  Fire:  { signs: ["Aries", "Leo", "Sagittarius"], day: "Sun", night: "Jupiter", participating: "Saturn" },
  Earth: { signs: ["Taurus", "Virgo", "Capricorn"], day: "Venus", night: "Moon", participating: "Mars" },
  Air:   { signs: ["Gemini", "Libra", "Aquarius"], day: "Saturn", night: "Mercury", participating: "Jupiter" },
  Water: { signs: ["Cancer", "Scorpio", "Pisces"], day: "Venus", night: "Mars", participating: "Moon" }
};
```

### Egyptian Terms (Complete)
```typescript
const EGYPTIAN_TERMS = {
  Aries:       [{ end: 6, ruler: "Jupiter" }, { end: 12, ruler: "Venus" }, { end: 20, ruler: "Mercury" }, { end: 25, ruler: "Mars" }, { end: 30, ruler: "Saturn" }],
  Taurus:      [{ end: 8, ruler: "Venus" }, { end: 14, ruler: "Mercury" }, { end: 22, ruler: "Jupiter" }, { end: 27, ruler: "Saturn" }, { end: 30, ruler: "Mars" }],
  Gemini:      [{ end: 6, ruler: "Mercury" }, { end: 12, ruler: "Jupiter" }, { end: 17, ruler: "Venus" }, { end: 24, ruler: "Mars" }, { end: 30, ruler: "Saturn" }],
  Cancer:      [{ end: 7, ruler: "Mars" }, { end: 13, ruler: "Venus" }, { end: 19, ruler: "Mercury" }, { end: 26, ruler: "Jupiter" }, { end: 30, ruler: "Saturn" }],
  Leo:         [{ end: 6, ruler: "Jupiter" }, { end: 11, ruler: "Venus" }, { end: 18, ruler: "Saturn" }, { end: 24, ruler: "Mercury" }, { end: 30, ruler: "Mars" }],
  Virgo:       [{ end: 7, ruler: "Mercury" }, { end: 17, ruler: "Venus" }, { end: 21, ruler: "Jupiter" }, { end: 28, ruler: "Mars" }, { end: 30, ruler: "Saturn" }],
  Libra:       [{ end: 6, ruler: "Saturn" }, { end: 14, ruler: "Mercury" }, { end: 21, ruler: "Jupiter" }, { end: 28, ruler: "Venus" }, { end: 30, ruler: "Mars" }],
  Scorpio:     [{ end: 7, ruler: "Mars" }, { end: 11, ruler: "Venus" }, { end: 19, ruler: "Mercury" }, { end: 24, ruler: "Jupiter" }, { end: 30, ruler: "Saturn" }],
  Sagittarius: [{ end: 12, ruler: "Jupiter" }, { end: 17, ruler: "Venus" }, { end: 21, ruler: "Mercury" }, { end: 26, ruler: "Saturn" }, { end: 30, ruler: "Mars" }],
  Capricorn:   [{ end: 7, ruler: "Mercury" }, { end: 14, ruler: "Jupiter" }, { end: 22, ruler: "Venus" }, { end: 26, ruler: "Saturn" }, { end: 30, ruler: "Mars" }],
  Aquarius:    [{ end: 7, ruler: "Mercury" }, { end: 13, ruler: "Venus" }, { end: 20, ruler: "Jupiter" }, { end: 25, ruler: "Mars" }, { end: 30, ruler: "Saturn" }],
  Pisces:      [{ end: 12, ruler: "Venus" }, { end: 16, ruler: "Jupiter" }, { end: 19, ruler: "Mercury" }, { end: 28, ruler: "Mars" }, { end: 30, ruler: "Saturn" }]
};
```

### Chaldean Faces/Decans
```typescript
const CHALDEAN_FACES = {
  Aries:       ["Mars", "Sun", "Venus"],
  Taurus:      ["Mercury", "Moon", "Saturn"],
  Gemini:      ["Jupiter", "Mars", "Sun"],
  Cancer:      ["Venus", "Mercury", "Moon"],
  Leo:         ["Saturn", "Jupiter", "Mars"],
  Virgo:       ["Sun", "Venus", "Mercury"],
  Libra:       ["Moon", "Saturn", "Jupiter"],
  Scorpio:     ["Mars", "Sun", "Venus"],
  Sagittarius: ["Mercury", "Moon", "Saturn"],
  Capricorn:   ["Jupiter", "Mars", "Sun"],
  Aquarius:    ["Venus", "Mercury", "Moon"],
  Pisces:      ["Saturn", "Jupiter", "Mars"]
};
```

### Dignity Scoring System
```typescript
const DIGNITY_POINTS = {
  domicile: 5,
  exaltation: 4,
  triplicity: 3,
  term: 2,
  face: 1,
  detriment: -5,
  fall: -4,
  peregrine: -5  // No dignity at all
};
```

---

## Part 4: Planetary Aspects System

### Major Aspects (Ptolemaic)
```typescript
const MAJOR_ASPECTS = {
  conjunction:  { angle: 0, symbol: "☌", energy: "neutral", orb: 10 },
  sextile:      { angle: 60, symbol: "⚹", energy: "harmonious", orb: 6 },
  square:       { angle: 90, symbol: "□", energy: "challenging", orb: 8 },
  trine:        { angle: 120, symbol: "△", energy: "harmonious", orb: 8 },
  opposition:   { angle: 180, symbol: "☍", energy: "challenging", orb: 10 }
};
```

### Minor Aspects
```typescript
const MINOR_ASPECTS = {
  semi_sextile:    { angle: 30, symbol: "⚺", energy: "mildly_harmonious", orb: 2 },
  semi_square:     { angle: 45, symbol: "∠", energy: "mildly_challenging", orb: 2 },
  sesquiquadrate:  { angle: 135, symbol: "⚼", energy: "challenging", orb: 2.5 },
  quincunx:        { angle: 150, symbol: "⚻", energy: "challenging", orb: 3 },
  quintile:        { angle: 72, symbol: "Q", energy: "creative", orb: 1 },
  bi_quintile:     { angle: 144, symbol: "bQ", energy: "creative", orb: 1 }
};
```

### Orb Modifiers by Planet Type
```typescript
const ORB_MODIFIERS = {
  sun: 1.2, moon: 1.2,  // Luminaries get 20% wider orbs
  mercury: 1.0, venus: 1.0, mars: 1.0,  // Personal planets standard
  jupiter: 0.9, saturn: 0.9,  // Social planets slightly tighter
  uranus: 0.75, neptune: 0.75, pluto: 0.75  // Outer planets tighter orbs
};
```

### Sign Aspect Relationships
```typescript
const SIGN_ASPECTS = {
  Aries:       { sextile: ["Gemini", "Aquarius"], square: ["Cancer", "Capricorn"], trine: ["Leo", "Sagittarius"], opposition: "Libra" },
  Taurus:      { sextile: ["Cancer", "Pisces"], square: ["Leo", "Aquarius"], trine: ["Virgo", "Capricorn"], opposition: "Scorpio" },
  Gemini:      { sextile: ["Aries", "Leo"], square: ["Virgo", "Pisces"], trine: ["Libra", "Aquarius"], opposition: "Sagittarius" },
  Cancer:      { sextile: ["Taurus", "Virgo"], square: ["Aries", "Libra"], trine: ["Scorpio", "Pisces"], opposition: "Capricorn" },
  Leo:         { sextile: ["Gemini", "Libra"], square: ["Taurus", "Scorpio"], trine: ["Aries", "Sagittarius"], opposition: "Aquarius" },
  Virgo:       { sextile: ["Cancer", "Scorpio"], square: ["Gemini", "Sagittarius"], trine: ["Taurus", "Capricorn"], opposition: "Pisces" },
  Libra:       { sextile: ["Leo", "Sagittarius"], square: ["Cancer", "Capricorn"], trine: ["Gemini", "Aquarius"], opposition: "Aries" },
  Scorpio:     { sextile: ["Virgo", "Capricorn"], square: ["Leo", "Aquarius"], trine: ["Cancer", "Pisces"], opposition: "Taurus" },
  Sagittarius: { sextile: ["Libra", "Aquarius"], square: ["Virgo", "Pisces"], trine: ["Aries", "Leo"], opposition: "Gemini" },
  Capricorn:   { sextile: ["Scorpio", "Pisces"], square: ["Aries", "Libra"], trine: ["Taurus", "Virgo"], opposition: "Cancer" },
  Aquarius:    { sextile: ["Aries", "Sagittarius"], square: ["Taurus", "Scorpio"], trine: ["Gemini", "Libra"], opposition: "Leo" },
  Pisces:      { sextile: ["Taurus", "Capricorn"], square: ["Gemini", "Sagittarius"], trine: ["Cancer", "Scorpio"], opposition: "Virgo" }
};
```

---

## Part 5: Nodal Axis Interpretations

### The 6 Nodal Axis Combinations
```typescript
const NODAL_AXES = {
  "Aries_Libra": {
    name: "Axis of Relationship / Me vs. We",
    northAries: { destiny: "Independence, courage, self-assertion", release: "People-pleasing, codependency" },
    northLibra: { destiny: "Partnership, compromise, diplomacy", release: "Selfishness, going it alone" }
  },
  "Taurus_Scorpio": {
    name: "Axis of Possession / Resources & Transformation",
    northTaurus: { destiny: "Stability, self-worth, simple pleasures", release: "Crisis addiction, intensity" },
    northScorpio: { destiny: "Transformation, intimacy, shared resources", release: "Material attachment, comfort" }
  },
  "Gemini_Sagittarius": {
    name: "Axis of Knowledge / Local vs. Global",
    northGemini: { destiny: "Communication, curiosity, networking", release: "Preachiness, dogmatism" },
    northSagittarius: { destiny: "Philosophy, travel, higher meaning", release: "Gossip, scattered thinking" }
  },
  "Cancer_Capricorn": {
    name: "Axis of Security / Home vs. Career",
    northCancer: { destiny: "Emotional security, nurturing, home life", release: "Workaholism, status obsession" },
    northCapricorn: { destiny: "Career, public role, achievement", release: "Over-dependency, family hiding" }
  },
  "Leo_Aquarius": {
    name: "Axis of Self-Expression / Individual vs. Collective",
    northLeo: { destiny: "Creativity, heart-centered leadership", release: "Detachment, hiding in groups" },
    northAquarius: { destiny: "Community, innovation, humanitarian causes", release: "Ego, need for spotlight" }
  },
  "Virgo_Pisces": {
    name: "Axis of Service / Practical vs. Spiritual",
    northVirgo: { destiny: "Practical skills, health routines, discernment", release: "Escapism, victimhood" },
    northPisces: { destiny: "Spirituality, artistic vision, surrender", release: "Perfectionism, criticism" }
  }
};
```

---

## Implementation Notes

This knowledge base provides **complete structured data** ready for TypeScript/JSON conversion. Key implementation considerations:

1. **Date Calculations**: Sign date ranges vary slightly by year due to Sun's elliptical orbit; use astronomical calculations for precision
2. **Decan Dates**: Approximate; calculate precisely using degree divisions (0°-10°, 10°-20°, 20°-30°)
3. **Dignity Scoring**: Sum all applicable dignities for essential dignity score; check domicile, exaltation, triplicity (based on sect), term, and face
4. **Aspect Orbs**: Apply planet-type modifiers to base orb values; luminaries get wider orbs
5. **Compatibility**: Use element, modality, polarity, and aspect-based rules in combination for nuanced scoring
6. **Outer Planet Dignities**: Modern assignments without traditional precedent; some disputed among astrologers

The data structures provided follow consistent patterns allowing straightforward iteration and lookup operations for chart calculations and interpretation generation.