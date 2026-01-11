# Complete Technical Specification for Professional Western Astrology App

Building a professional birth chart application requires mastering astronomical calculations, comprehensive astrological knowledge, and robust technical implementation. This specification provides everything needed to create a globally-available astrology app with native internationalization support, covering **core algorithms**, **complete knowledge systems**, **predictive techniques**, **relationship analysis**, **technical libraries**, **validation patterns**, and **bilingual terminology**.

---

## 1. Core calculation algorithms

The foundation of any astrology application rests on precise astronomical calculations. Professional-grade accuracy requires the **Swiss Ephemeris**, the industry standard developed by Astrodienst AG.

### Swiss Ephemeris fundamentals

The Swiss Ephemeris achieves **0.001 arcsecond accuracy** by combining multiple data sources: **JPL DE431** ephemeris data (covering 13000 BCE to 17000 CE), **VSOP87** planetary theory for mean nodes and apsides, and Steve Moshier's semi-analytical approximation as a fallback. The calculation chain applies nine sequential transformations: barycentric equatorial Cartesian positions, light-time correction, geocentric conversion, light deflection by solar gravity, annual aberration, frame bias transformation, precession, nutation, and finally ecliptic coordinate transformation.

**Data files** follow naming conventions like `sepl_##.se1` for planetary data and `semo_##.se1` for lunar data, with each file covering 600 years. The complete compressed dataset requires approximately **90MB** versus 2.8GB for raw JPL data. When data files are unavailable, the Moshier fallback provides sub-arcsecond precision for planets and few-arcsecond precision for the Moon.

### House system calculations

House systems divide the celestial sphere differently, producing varied chart interpretations. The **Ascendant formula** is:

```
ASC = arccot(-((tan(φ) × sin(ε)) + (sin(RAMC) × cos(ε))) / cos(RAMC))
```

Where φ is geographic latitude, ε is obliquity of the ecliptic (~23.44°), and RAMC is the Right Ascension of the Midheaven.

| House System | Method | Best Use Case | Latitude Limits |
|-------------|--------|---------------|-----------------|
| **Placidus** | Divides semi-arcs of diurnal motion into thirds | Modern psychological astrology | Fails above 66° |
| **Whole Sign** | Each house = one complete zodiac sign | Traditional/Hellenistic astrology | Works all latitudes |
| **Koch** | Uses birthplace latitude at MC moment | European traditions | Fails above 66° |
| **Equal House** | Each house exactly 30° from Ascendant | Simplicity, high latitudes | Works all latitudes |
| **Campanus** | Divides prime vertical into 12 equal segments | Philosophical approach | Issues in Arctic/Antarctic |
| **Regiomontanus** | Divides celestial equator into 12 segments | Horary astrology | Similar to Placidus |

**Placidus** remains most popular but uses iterative calculation requiring 10+ iterations to converge. The algorithm starts with RA₀ = RAMC + DSA₀/3, finds declination D₀, calculates new DSA₁ = 90° + arcsin(tan(φ) × tan(D₀)), and repeats until |ΔRA| approaches zero.

### Planet position calculations

Converting ecliptic longitude to zodiac position uses:
```
sign_index = floor(ecliptic_longitude / 30)
degree_in_sign = ecliptic_longitude mod 30
```

**Retrograde detection** checks if daily longitude change is negative. Swiss Ephemeris provides this directly via the speed value—negative speed indicates retrograde motion. The **True Node** (osculating) differs from **Mean Node** by 0-2° and can briefly move direct, while Mean Node always retrogrades at approximately 3'11" per day.

### Aspect calculations

Basic aspect calculation normalizes the angular separation:
```
aspect_angle = |planet1_longitude - planet2_longitude|
if aspect_angle > 180: aspect_angle = 360 - aspect_angle
```

**Standard orbs** vary by practitioner, but typical defaults are **8-10°** for conjunctions/oppositions with luminaries, **7-8°** for trines/squares, **4-6°** for sextiles, and **2-3°** for minor aspects.

**Applying versus separating** determination compares current orb to future orb: if future_orb < current_orb, the aspect is applying (building in strength). Aspect strength commonly uses `strength = 1 - (orb / max_allowed_orb)`.

### Time calculations

**Julian Day conversion** (Fliegel & Van Flandern algorithm):
```
JD = day + floor((153*M + 2) / 5) + 365*Y + floor(Y/4) - floor(Y/100) + floor(Y/400) - 32045
```

**Local Mean Time** adjustment: `LMT = Standard_Time + (Local_Longitude - Standard_Meridian) / 15 hours`

**Delta T** (TT - UT) currently equals approximately **69 seconds** and significantly affects ancient chart calculations—at 1000 BCE, ΔT reaches approximately 7 hours, creating potential 1° Moon error per 2 seconds of ΔT uncertainty.

---

## 2. Complete Western astrology knowledge system

### The twelve zodiac signs

Each sign combines element, modality, and polarity to create distinct archetypal expressions:

| Sign | Dates | Element | Modality | Ruling Planet | Keywords |
|------|-------|---------|----------|---------------|----------|
| **Aries** | Mar 21-Apr 19 | Fire | Cardinal | Mars | Initiative, courage, impulsiveness |
| **Taurus** | Apr 20-May 20 | Earth | Fixed | Venus | Stability, pleasure, persistence |
| **Gemini** | May 21-Jun 20 | Air | Mutable | Mercury | Communication, curiosity, adaptability |
| **Cancer** | Jun 21-Jul 22 | Water | Cardinal | Moon | Nurturing, emotions, protection |
| **Leo** | Jul 23-Aug 22 | Fire | Fixed | Sun | Creativity, leadership, generosity |
| **Virgo** | Aug 23-Sep 22 | Earth | Mutable | Mercury | Analysis, service, perfectionism |
| **Libra** | Sep 23-Oct 22 | Air | Cardinal | Venus | Balance, partnership, diplomacy |
| **Scorpio** | Oct 23-Nov 21 | Water | Fixed | Pluto (Mars) | Transformation, intensity, power |
| **Sagittarius** | Nov 22-Dec 21 | Fire | Mutable | Jupiter | Adventure, philosophy, expansion |
| **Capricorn** | Dec 22-Jan 19 | Earth | Cardinal | Saturn | Ambition, discipline, achievement |
| **Aquarius** | Jan 20-Feb 18 | Air | Fixed | Uranus (Saturn) | Innovation, humanity, independence |
| **Pisces** | Feb 19-Mar 20 | Water | Mutable | Neptune (Jupiter) | Spirituality, intuition, compassion |

### Planets and essential dignities

| Planet | Domicile | Exaltation | Detriment | Fall | Time per Sign |
|--------|----------|------------|-----------|------|---------------|
| **Sun** | Leo | Aries | Aquarius | Libra | ~30 days |
| **Moon** | Cancer | Taurus | Capricorn | Scorpio | ~2.5 days |
| **Mercury** | Gemini, Virgo | Virgo | Sagittarius, Pisces | Pisces | ~3-4 weeks |
| **Venus** | Taurus, Libra | Pisces | Aries, Scorpio | Virgo | ~4 weeks |
| **Mars** | Aries, Scorpio | Capricorn | Libra, Taurus | Cancer | ~6-7 weeks |
| **Jupiter** | Sagittarius, Pisces | Cancer | Gemini, Virgo | Capricorn | ~12-13 months |
| **Saturn** | Capricorn, Aquarius | Libra | Cancer, Leo | Aries | ~2.5 years |
| **Uranus** | Aquarius | Scorpio | Leo | Taurus | ~7-8 years |
| **Neptune** | Pisces | Leo/Cancer | Virgo | Aquarius | ~13-14 years |
| **Pluto** | Scorpio | Aries/Leo | Taurus | Libra | 11-32 years |

**Retrograde effects** vary by planet: Mercury retrograde (3 times yearly, ~3 weeks) disrupts communication and technology; Venus retrograde (every 18 months, ~40 days) revisits relationships and values; Mars retrograde (every 2 years, ~2 months) redirects energy and causes frustration.

**Chiron** (the "Wounded Healer") spends 2-9 years per sign due to its elliptical orbit and represents deepest wounds and healing potential. The **North Node** indicates soul purpose and destiny direction, while the **South Node** represents past patterns and comfort zones requiring release.

### The twelve houses

| House | Type | Natural Sign | Life Areas |
|-------|------|--------------|------------|
| **1st** | Angular | Aries | Self, identity, physical appearance |
| **2nd** | Succedent | Taurus | Money, possessions, values |
| **3rd** | Cadent | Gemini | Communication, siblings, short trips |
| **4th** | Angular | Cancer | Home, family, roots, IC |
| **5th** | Succedent | Leo | Creativity, romance, children |
| **6th** | Cadent | Virgo | Health, work, daily routine |
| **7th** | Angular | Libra | Partnerships, marriage, DSC |
| **8th** | Succedent | Scorpio | Transformation, shared resources, intimacy |
| **9th** | Cadent | Sagittarius | Higher education, travel, philosophy |
| **10th** | Angular | Capricorn | Career, public status, MC |
| **11th** | Succedent | Aquarius | Friends, groups, hopes |
| **12th** | Cadent | Pisces | Unconscious, karma, spirituality |

### Aspects and their meanings

**Major (Ptolemaic) aspects**:
- **Conjunction (0°)**: Fusion of energies, amplification, blind spots—nature depends on planets involved
- **Opposition (180°)**: Polarity, projection, awareness through relationships
- **Trine (120°)**: Natural talent, ease, risk of complacency
- **Square (90°)**: Friction driving growth, internal tension demanding resolution
- **Sextile (60°)**: Opportunities requiring effort to manifest

**Minor aspects** include semi-sextile (30°), semi-square (45°), quintile (72°, creative talent), sesquiquadrate (135°), and quincunx (150°, demanding continual adjustment between incompatible energies).

### Aspect patterns

**Grand Trine** forms an equilateral triangle of three trines in the same element, indicating exceptional natural talent but risk of inertia. **T-Square** combines opposition with a third planet squaring both, creating driving ambition through tension—the apex planet receives the most stress and becomes the focal point. **Grand Cross** intensifies this with four planets in continuous square and opposition, producing enormous energy demanding outlet.

**Yod (Finger of God)** consists of two planets sextile, both quincunx an apex planet, creating sense of special purpose and "appointment with power." **Stellium** (3+ planets conjunct) concentrates energy intensely in one life area. **Kite** enhances Grand Trine with opposition providing direction and motivation. **Mystic Rectangle** combines two oppositions with trines and sextiles, creating balanced integration of challenge and harmony.

### Major fixed stars

Fixed stars precess at approximately **1° per 72 years**. Traditional orbs are 1-2° for conjunctions only.

| Star | Position (2025) | Magnitude | Nature | Meaning |
|------|-----------------|-----------|--------|---------|
| **Regulus** | 0°09' Virgo | +1.40 | Mars/Jupiter | Royalty, leadership, sudden rise and fall |
| **Algol** | 26°52' Taurus | +2.12 | Saturn/Mars | Violence, intensity—the "Demon Star" |
| **Spica** | 24°33' Libra | +0.97 | Venus/Mercury | All-around good fortune, creativity |
| **Sirius** | 14°47' Cancer | -1.46 | Jupiter/Mars | Ambition, fame, guardian qualities |
| **Aldebaran** | 10°30' Gemini | +0.85 | Mars | Courage, integrity, conditional fortune |
| **Antares** | 10°28' Sagittarius | +1.00 | Mars/Jupiter | Cycle completion, strategic ability |
| **Fomalhaut** | 4°34' Pisces | +1.16 | Venus/Neptune | Fame, occult abilities, "Star of Alchemy" |
| **Vega** | 16°01' Capricorn | +0.03 | Venus/Mercury | Artistic talent, political luck |
| **Arcturus** | 24°56' Libra | -0.05 | Jupiter/Mars | Inspiration, riches through travel |

The **Four Royal Stars** (Regulus, Aldebaran, Antares, Fomalhaut) were the Persian Watchers marking the cardinal points and carry exceptional significance.

---

## 3. Predictive astrology techniques

### Transits

Transits compare current planetary positions against natal chart positions. **Outer planet transits** (Saturn, Uranus, Neptune, Pluto) carry the most weight due to their slow movement and extended duration. Standard orbs for transits range from **1-5°**, with tighter orbs preferred for precision.

**Timing considerations**: Applying aspects build in intensity toward exactitude; separating aspects integrate and wane. **Stationary phases** (when planets change direction) concentrate energy most intensely. Retrograde transits can create **triple passes** over the same natal point, extending influence over months.

| Transit Planet | Typical Effect |
|----------------|----------------|
| Jupiter | Expansion, opportunity, good fortune |
| Saturn | Ambition, challenges leading to growth, maturity |
| Uranus | Sudden change, awakening, disruption |
| Neptune | Confusion, idealism, spiritual insight |
| Pluto | Deep transformation, power dynamics, empowerment |

### Secondary progressions

The **day-for-a-year** technique: planetary positions X days after birth represent year X of life. The progressed **Sun moves ~1° per year**, changing signs approximately every 30 years—a major orientation shift. The progressed **Moon moves 12-13° per year**, completing the zodiac in 27-28 years and changing signs every 2.5 years, marking emotional focus shifts.

Outer planets move too slowly to be useful in secondary progressions. The **progressed lunation cycle** (27-28 years from progressed New Moon to next) creates eight distinct life phases: New Moon (fresh starts), Crescent (challenges), First Quarter (active building), Gibbous (refining), Full Moon (fruition), Disseminating (sharing), Third Quarter (questioning), and Balsamic (endings).

### Solar arc directions

All natal planets advance uniformly by the Sun's daily motion—approximately **1° per year**. Unlike secondary progressions, this makes outer planets fully usable. Only **hard aspects** (conjunction, square, opposition) are typically considered, with orbs limited to **0.5°** (roughly 6 months applying, 6 months separating).

Solar arcs tend to manifest as **visible external events** rather than internal development. When solar arc planets cross angles (ASC, MC), significant life changes typically occur.

### Return charts

**Solar Return** charts are cast for the exact moment the Sun returns to its natal position annually. Key interpretation focuses on: planets on angles, solar return Ascendant and its ruler, house containing the Sun, stelliums, and how solar return planets aspect the natal chart. The precession-corrected versus non-corrected debate continues—precessed returns may shift the Ascendant significantly.

**Lunar Return** charts (every 27.3 days) provide monthly detail within the solar return year. When Lunar Return Ascendant matches Solar Return Ascendant sign, that month becomes especially significant.

### Eclipse interpretation

**Solar eclipses** (New Moon) initiate new beginnings and external events; **Lunar eclipses** (Full Moon) bring culminations, revelations, and emotional breakthroughs. Eclipses are considered **3× more powerful** than regular lunations.

Effects trigger when eclipses conjunct natal planets/angles within 5°. The **Saros cycle** (18 years, 11 days) produces related eclipse families—the first eclipse of each series acts as its "birth chart," coloring all subsequent eclipses. Effect duration typically spans 6 months to 3 years for major contacts.

---

## 4. Relationship astrology

### Synastry analysis

Synastry compares two natal charts by examining **interaspects** (angles between planets) and **house overlays** (where one person's planets fall in the other's houses).

**Most important contacts for romance**:
- **Sun-Moon conjunction/trine**: Foundation for stable, lasting relationships—unification of purpose and emotions
- **Venus-Mars conjunction**: Ultimate attraction, magnetism, chemistry
- **Moon-Venus contacts**: Emotional harmony, natural nurturing
- **Saturn aspects**: Staying power and commitment—present in most long-term relationships

**Red flag aspects**:
- Mars square/opposite Pluto: Power struggles, potential for conflict
- Moon square/opposite Saturn: Emotional criticism, restriction
- Venus square/opposite Pluto: Possessiveness, jealousy, obsession

**House overlays** reveal who feels the relationship more intensely. Planets in partner's 5th house bring romance and fun; 7th house suggests partnership potential; 8th house creates deep intimacy and intensity.

### Composite charts

The **midpoint method** calculates composite positions: `Composite Planet = (Chart A's Planet + Chart B's Planet) / 2`. This creates one chart representing the relationship as its own entity—the "third being" created when two people unite.

Focus areas include: composite Sun (core identity/purpose), composite Moon (emotional needs), and composite Ascendant (how the relationship appears externally).

### Davison relationship charts

Unlike composite charts, Davison calculates the **time-space midpoint**—the actual date/time/location between both births. This creates a chart that existed at a real astronomical moment, enabling transits and progressions to the relationship chart itself.

Davison reveals the **essence and karmic purpose** of why two people came together, while composite shows how they function day-to-day as a unit.

### Compatibility analysis approach

**Romantic compatibility** emphasizes Venus-Mars contacts, Moon compatibility (emotional needs), 5th/7th/8th house factors, and North Node connections (karmic relationships).

**Business/friendship compatibility** prioritizes Mercury contacts (communication), Saturn aspects (reliability, structure), and 10th/11th house factors (career, groups).

---

## 5. Technical implementation

### Recommended JavaScript libraries

**Primary choice**: `sweph` (timotejroiko)—Node.js native bindings providing 100% Swiss Ephemeris API with **0.001 arcsecond accuracy**, TypeScript declarations, and active maintenance. Requires AGPL-3.0 license or commercial license (CHF 750-1550).

**WebAssembly alternatives** for browser support:
- `sweph-wasm`: Swiss Ephemeris compiled to WASM, supports 25+ house systems
- `astro-sweph`: WASM with embedded ephemeris (~1.9MB single file)

**MIT-licensed option**: `astronomy-engine` provides within 1 arcminute accuracy, no dependencies, ~116KB minified—but designed for astronomy without astrology-specific features like house systems.

### Python alternatives

**Kerykeion** (AGPL-3.0) offers the most complete astrology solution: natal/synastry/composite/transit charts, SVG generation, Pydantic models, and API-ready output. **Flatlib** provides simpler traditional astrology focus. **PySwisseph** offers direct low-level Swiss Ephemeris bindings.

### Chart visualization

**SVG-based rendering** is recommended for birth charts—limited elements requiring scalability favor SVG over Canvas. **D3.js** enables maximum flexibility for custom visualizations. The **AstroChart** library (MIT) provides ready-made SVG chart rendering.

Required visual elements: wheel structure with 12 houses, zodiac ring with degree markers, planet positions with glyphs, aspect lines connecting planets, and angular points (ASC, MC, DSC, IC).

**Astrology glyphs**: Unicode provides zodiac (♈-♓, U+2648-U+2653), planets (☉☿♀♂♃♄♅♆♇), and aspects (☌☍△□⚹). **Astronomicon Fonts** offer complete glyph sets.

### Birth data requirements

```typescript
interface BirthData {
  date: string;        // ISO 8601 format
  time: string;        // HH:MM:SS or null if unknown
  latitude: number;    // -90 to 90
  longitude: number;   // -180 to 180
  timezone: string;    // IANA identifier
  timeUnknown?: boolean;
}
```

**Unknown birth times**: Use noon chart (default 12:00), sunrise chart (Sun on Ascendant), or solar sign chart (ignore houses entirely).

**Timezone handling**: IANA tzdata is accurate from 1970; pre-1970 data requires specialized atlases (Astrodienst Time-zone Atlas). Use **Luxon** or **@vvo/tzdb** for comprehensive timezone support.

**Geocoding**: GeoNames (free, 30K/day) or OpenStreetMap Nominatim (self-hostable) provide latitude/longitude from place names.

### Recommended production stack

```
FRONTEND: React/Vue + TypeScript, D3.js (SVG charts), Luxon (dates)
BACKEND: Node.js + sweph (Swiss Ephemeris), @vvo/tzdb, Express/Fastify
DATA: Swiss Ephemeris files (~90MB), IANA tzdata, GeoNames
```

For browser-only deployment, use `sweph-wasm` with embedded ephemeris (~2MB compressed).

---

## 6. Validation and accuracy patterns

### Past event verification (验前事)

Professional astrologers validate chart accuracy by correlating known life events with astrological signatures:

| Life Event | Primary Indicators |
|------------|-------------------|
| Career changes | Saturn transits to MC/10th, Pluto to MC, Jupiter to 6th/10th |
| Relationships | 7th house transits, Venus returns, Saturn to Venus/7th |
| Relocations | 4th house transits, IC contacts, Uranus to 4th |
| Health events | 6th house transits, Mars/Saturn to Ascendant |
| Major turning points | Outer planet transits to angles, eclipses on natal planets |

### Birth time rectification

When birth time is unknown or uncertain:
1. **Event-based rectification**: Work backward from known life events, testing hypothetical times against transits/progressions
2. **Angle sensitivity method**: Identify sensitive points responding to transits unexplained by natal planets—likely house cusps
3. **Rising sign determination**: Physical appearance and temperament patterns help identify likely Ascendant

### The "Rule of Three"

When multiple techniques (transits, progressions, solar arcs) simultaneously indicate similar themes, manifestation becomes highly probable. This stacking of testimony provides validation confidence.

---

## 7. International terminology

### Zodiac signs (十二星座)

| English | Chinese | Pinyin | Symbol |
|---------|---------|--------|--------|
| Aries | 白羊座 | Báiyáng zuò | ♈ |
| Taurus | 金牛座 | Jīnniú zuò | ♉ |
| Gemini | 双子座 | Shuāngzǐ zuò | ♊ |
| Cancer | 巨蟹座 | Jùxiè zuò | ♋ |
| Leo | 狮子座 | Shīzi zuò | ♌ |
| Virgo | 处女座 | Chǔnǚ zuò | ♍ |
| Libra | 天秤座 | Tiānchèng zuò | ♎ |
| Scorpio | 天蝎座 | Tiānxiē zuò | ♏ |
| Sagittarius | 射手座 | Shèshǒu zuò | ♐ |
| Capricorn | 摩羯座 | Mójiē zuò | ♑ |
| Aquarius | 水瓶座 | Shuǐpíng zuò | ♒ |
| Pisces | 双鱼座 | Shuāngyú zuò | ♓ |

### Planets (行星)

| English | Chinese | Pinyin |
|---------|---------|--------|
| Sun | 太阳 | Tàiyáng |
| Moon | 月亮 | Yuèliàng |
| Mercury | 水星 | Shuǐxīng |
| Venus | 金星 | Jīnxīng |
| Mars | 火星 | Huǒxīng |
| Jupiter | 木星 | Mùxīng |
| Saturn | 土星 | Tǔxīng |
| Uranus | 天王星 | Tiānwáng xīng |
| Neptune | 海王星 | Hǎiwáng xīng |
| Pluto | 冥王星 | Míngwáng xīng |
| North Node | 北交点 | Běi jiāodiǎn |
| South Node | 南交点 | Nán jiāodiǎn |
| Chiron | 凯龙星 | Kǎilóng xīng |

### Houses (宫位)

| House | Chinese | Traditional Name |
|-------|---------|------------------|
| 1st | 第一宫 | 命宫 |
| 2nd | 第二宫 | 财帛宫 |
| 3rd | 第三宫 | 兄弟宫 |
| 4th | 第四宫 | 田宅宫 |
| 5th | 第五宫 | 子女宫 |
| 6th | 第六宫 | 奴仆宫 |
| 7th | 第七宫 | 夫妻宫 |
| 8th | 第八宫 | 疾厄宫 |
| 9th | 第九宫 | 迁移宫 |
| 10th | 第十宫 | 官禄宫 |
| 11th | 第十一宫 | 福德宫 |
| 12th | 第十二宫 | 玄秘宫 |

### Aspects (相位)

| English | Chinese | Degrees |
|---------|---------|---------|
| Conjunction | 合相 | 0° |
| Sextile | 六分相 | 60° |
| Square | 四分相/刑 | 90° |
| Trine | 三分相/拱 | 120° |
| Opposition | 对分相/冲 | 180° |
| Quincunx | 梅花相位 | 150° |

### Technical terms (专业术语)

| English | Chinese |
|---------|---------|
| Natal Chart | 本命盘 |
| Transit | 行运 |
| Progression | 推运/次限 |
| Solar Return | 太阳回归 |
| Retrograde | 逆行 |
| Ascendant | 上升点 |
| Midheaven | 天顶/中天 |
| Synastry | 合盘/比较盘 |
| Composite | 组合盘 |
| Domicile | 入庙 |
| Exaltation | 旺相 |
| Detriment | 失势 |
| Fall | 落陷 |

### Aspect patterns (相位格局)

| English | Chinese |
|---------|---------|
| Grand Trine | 大三角 |
| T-Square | T三角 |
| Grand Cross | 大十字 |
| Yod | 上帝之指 |
| Stellium | 星群 |
| Kite | 风筝格局 |

---

## Conclusion

This specification provides the complete foundation for building a professional Western astrology application. The **Swiss Ephemeris** ensures professional-grade accuracy at 0.001 arcseconds. The comprehensive knowledge system covers all signs, planets, houses, aspects, patterns, and fixed stars with proper dignities and meanings. Predictive techniques span transits, progressions, solar arcs, returns, and eclipse interpretation.

For technical implementation, the recommended stack combines `sweph` (Node.js) or `sweph-wasm` (browser) for calculations, **D3.js** with SVG for chart visualization, **Luxon** and **@vvo/tzdb** for time handling, and **GeoNames** for geocoding. The complete bilingual terminology enables native Chinese localization while maintaining accuracy with English astrological standards.

Key implementation priorities should be: (1) accurate astronomical calculations via Swiss Ephemeris, (2) comprehensive house system support with fallbacks for extreme latitudes, (3) robust timezone handling including historical data, (4) flexible aspect orb configuration, and (5) complete i18n architecture from the foundation. With these elements properly implemented, the application can serve both Western and Chinese-speaking markets with professional-grade accuracy and authentic astrological interpretation.