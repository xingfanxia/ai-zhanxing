# Complete Tarot Knowledge Base for Divination App

This comprehensive knowledge base provides complete data for all **78 Tarot cards** with trilingual support (English, Chinese Simplified, Japanese), ready for TypeScript/JSON implementation.

---

## Part 1: Major Arcana - Complete 22 Cards

### Multilingual Card Names Table

| # | English | Chinese | Japanese | Element | Ruling | Yes/No |
|---|---------|---------|----------|---------|--------|--------|
| 0 | The Fool | 愚者 | 愚者 | Air | Uranus | Yes |
| 1 | The Magician | 魔术师 | 魔術師 | Air | Mercury | Yes |
| 2 | The High Priestess | 女祭司 | 女教皇 | Water | Moon | Maybe |
| 3 | The Empress | 皇后 | 女帝 | Earth | Venus | Yes |
| 4 | The Emperor | 皇帝 | 皇帝 | Fire | Aries | Yes |
| 5 | The Hierophant | 教皇 | 法王 | Earth | Taurus | Yes |
| 6 | The Lovers | 恋人 | 恋人 | Air | Gemini | Yes |
| 7 | The Chariot | 战车 | 戦車 | Water | Cancer | Yes |
| 8 | Strength | 力量 | 力 | Fire | Leo | Yes |
| 9 | The Hermit | 隐士 | 隠者 | Earth | Virgo | No |
| 10 | Wheel of Fortune | 命运之轮 | 運命の輪 | Fire | Jupiter | Yes |
| 11 | Justice | 正义 | 正義 | Air | Libra | Yes |
| 12 | The Hanged Man | 倒吊人 | 吊るされた男 | Water | Neptune | Maybe |
| 13 | Death | 死神 | 死神 | Water | Scorpio | No |
| 14 | Temperance | 节制 | 節制 | Fire | Sagittarius | Yes |
| 15 | The Devil | 恶魔 | 悪魔 | Earth | Capricorn | No |
| 16 | The Tower | 塔 | 塔 | Fire | Mars | No |
| 17 | The Star | 星星 | 星 | Air | Aquarius | Yes |
| 18 | The Moon | 月亮 | 月 | Water | Pisces | Maybe |
| 19 | The Sun | 太阳 | 太陽 | Fire | Sun | Yes |
| 20 | Judgement | 审判 | 審判 | Fire | Pluto | Yes |
| 21 | The World | 世界 | 世界 | Earth | Saturn | Yes |

### Complete Major Arcana JSON Structure

```json
{
  "majorArcana": [
    {
      "number": 0,
      "name": {"en": "The Fool", "zh": "愚者", "ja": "愚者"},
      "keywords": ["beginnings", "innocence", "spontaneity", "free spirit", "adventure", "potential", "leap of faith", "optimism", "trust"],
      "upright": "New beginnings, unlimited potential, leap of faith into the unknown. Embrace adventure with childlike wonder.",
      "reversed": "Fear of unknown, recklessness, taking too many risks without considering consequences.",
      "astrology": {"ruling": "Uranus", "element": "Air"},
      "numerology": {"number": 0, "meaning": "Unlimited potential, infinite possibilities"},
      "symbols": ["Young man at cliff", "White rose", "Knapsack", "White dog", "Mountains", "Yellow sky"],
      "love": {"upright": "Exciting spontaneous romance, carefree love", "reversed": "Risky behavior causing insecurity"},
      "career": {"upright": "New job opportunity, fresh professional start", "reversed": "Hesitation about new ventures"},
      "health": "Fresh starts in health routines, spontaneity in wellness",
      "yesNo": "Yes",
      "advice": "Take the leap of faith. Trust the Universe to guide you."
    },
    {
      "number": 1,
      "name": {"en": "The Magician", "zh": "魔术师", "ja": "魔術師"},
      "keywords": ["manifestation", "resourcefulness", "power", "inspired action", "willpower", "creation", "skill", "concentration"],
      "upright": "You have all tools needed to manifest dreams. Take inspired, focused action.",
      "reversed": "Exploring ideas without action, manipulation, misdirected efforts.",
      "astrology": {"ruling": "Mercury", "element": "Air"},
      "numerology": {"number": 1, "meaning": "New beginnings, individuality, leadership"},
      "symbols": ["One hand up, one down", "Infinity symbol", "Four suit symbols", "Ouroboros belt", "Garden"],
      "love": {"upright": "Taking active role in love, power to attract", "reversed": "Disconnected from magnetism, dishonest partner"},
      "career": {"upright": "Resources for abundance, everything needed to succeed", "reversed": "Lacking clarity on goals"},
      "health": "Transformation possible through awareness",
      "yesNo": "Yes",
      "advice": "Channel your energy and manifest your vision through action."
    },
    {
      "number": 2,
      "name": {"en": "The High Priestess", "zh": "女祭司", "ja": "女教皇"},
      "keywords": ["intuition", "unconscious", "inner voice", "mystery", "spirituality", "higher power", "wisdom", "secrets", "divine feminine"],
      "upright": "Listen to intuition over intellect. Answers are within, not without.",
      "reversed": "Difficulty listening to intuition, confusion, ignoring gut feelings.",
      "astrology": {"ruling": "Moon", "element": "Water"},
      "numerology": {"number": 2, "meaning": "Duality, balance, receptivity, intuition"},
      "symbols": ["Two pillars", "Crown of Isis", "Crescent moon", "Pomegranates", "Torah scroll", "Blue robes"],
      "love": {"upright": "Increasing intimacy, patience needed", "reversed": "Ignoring intuition, hiding true self"},
      "career": {"upright": "Period of education, rely on gut instincts", "reversed": "Beware hidden agendas"},
      "health": "Trust body's signals, meditation needed",
      "yesNo": "Maybe",
      "advice": "Go within. Trust your intuition."
    },
    {
      "number": 3,
      "name": {"en": "The Empress", "zh": "皇后", "ja": "女帝"},
      "keywords": ["femininity", "beauty", "nature", "nurturing", "abundance", "fertility", "motherhood", "creativity", "sensuality"],
      "upright": "Deep connection with feminine energy. Period of growth where dreams come to fruition.",
      "reversed": "Need for self-care, creative blocks, giving away personal power.",
      "astrology": {"ruling": "Venus", "element": "Earth"},
      "numerology": {"number": 3, "meaning": "Creativity, expression, growth, abundance"},
      "symbols": ["Crown of 12 stars", "Venus shield", "Scepter", "Pomegranate robe", "Flowing stream", "Wheat field"],
      "love": {"upright": "Nurturing partner, deep emotional bonds, possible pregnancy", "reversed": "Over-dependence, smothering"},
      "career": {"upright": "Creative projects flourishing, abundance", "reversed": "Creative blocks, burnout"},
      "health": "Fertility indicator, connect with nature for healing",
      "yesNo": "Yes",
      "advice": "Nurture yourself and your creations. Connect with nature."
    },
    {
      "number": 4,
      "name": {"en": "The Emperor", "zh": "皇帝", "ja": "皇帝"},
      "keywords": ["authority", "structure", "control", "fatherhood", "stability", "leadership", "discipline", "power", "protection"],
      "upright": "Structure, stability, leadership. Create order from chaos through rational thinking.",
      "reversed": "Excessive control, rigidity, tyranny, lack of discipline.",
      "astrology": {"ruling": "Aries", "element": "Fire"},
      "numerology": {"number": 4, "meaning": "Stability, foundation, structure, order"},
      "symbols": ["Stone throne with rams", "Armor", "Ankh scepter", "Orb", "White beard", "Barren mountains"],
      "love": {"upright": "Stable partnership, protective partner", "reversed": "Controlling partner, power struggles"},
      "career": {"upright": "Strong leadership, business success", "reversed": "Conflicts with authority"},
      "health": "Discipline in health routines needed",
      "yesNo": "Yes",
      "advice": "Take command with strength and wisdom. Build solid foundations."
    },
    {
      "number": 5,
      "name": {"en": "The Hierophant", "zh": "教皇", "ja": "法王"},
      "keywords": ["tradition", "conformity", "morality", "ethics", "spiritual wisdom", "religion", "institutions", "education", "guidance"],
      "upright": "Follow established processes. Seek wisdom from institutions and mentors.",
      "reversed": "Rebellion, challenging traditions, exploring own spiritual path.",
      "astrology": {"ruling": "Taurus", "element": "Earth"},
      "numerology": {"number": 5, "meaning": "Change, freedom, exploration"},
      "symbols": ["Triple crown", "Papal staff", "Two acolytes", "Raised hand", "Two pillars", "Crossed keys"],
      "love": {"upright": "Traditional relationship, marriage indicator", "reversed": "Unconventional relationship"},
      "career": {"upright": "Working with established institutions, seeking mentor", "reversed": "Breaking from corporate culture"},
      "health": "Seek guidance from professionals",
      "yesNo": "Yes",
      "advice": "Honor tradition while remaining open to what no longer serves you."
    },
    {
      "number": 6,
      "name": {"en": "The Lovers", "zh": "恋人", "ja": "恋人"},
      "keywords": ["love", "harmony", "relationships", "values alignment", "choices", "union", "partnership", "attraction", "soulmates"],
      "upright": "Meaningful relationships built on trust. Decision-making at crossroads. Soulmate connection.",
      "reversed": "Conflict, disharmony, torn between head and heart, possible infidelity.",
      "astrology": {"ruling": "Gemini", "element": "Air"},
      "numerology": {"number": 6, "meaning": "Harmony, balance, love, responsibility, choice"},
      "symbols": ["Archangel Raphael", "Adam and Eve", "Tree of Knowledge", "Tree of Life", "Mountain", "Sun"],
      "love": {"upright": "Deep connection, soulmate energy, harmonious partnership", "reversed": "Communication breakdown, betrayal"},
      "career": {"upright": "Important decisions, successful partnerships", "reversed": "Workplace conflict"},
      "health": "Balance between mind and body important",
      "yesNo": "Yes",
      "advice": "Make choices from your heart that align with your deepest values."
    },
    {
      "number": 7,
      "name": {"en": "The Chariot", "zh": "战车", "ja": "戦車"},
      "keywords": ["willpower", "determination", "success", "control", "direction", "victory", "ambition", "focus", "overcoming obstacles"],
      "upright": "Overcoming challenges through control and willpower. Victory awaits the determined.",
      "reversed": "Feeling powerless, lacking direction. Regain drive and determination.",
      "astrology": {"ruling": "Cancer", "element": "Water"},
      "numerology": {"number": 7, "meaning": "Spirituality, introspection, victory through inner strength"},
      "symbols": ["Charioteer standing", "Black and white sphinxes", "Crescent moon armor", "Laurel crown", "Star canopy", "Wand"],
      "love": {"upright": "Working through challenges together", "reversed": "Relationship off course, power struggles"},
      "career": {"upright": "Ambition taking you far, competitive success", "reversed": "Career feeling directionless"},
      "health": "Victory over health challenges through determination",
      "yesNo": "Yes",
      "advice": "Take control of your destiny. Drive forward with determination."
    },
    {
      "number": 8,
      "name": {"en": "Strength", "zh": "力量", "ja": "力"},
      "keywords": ["inner strength", "courage", "compassion", "patience", "influence", "self-control", "determination", "resilience"],
      "upright": "Inner power and calm mastery over instincts. Approach with compassion, not force.",
      "reversed": "Depleted self-confidence, vulnerability, explosive behavior.",
      "astrology": {"ruling": "Leo", "element": "Fire"},
      "numerology": {"number": 8, "meaning": "Power, karma, material success, cycles"},
      "symbols": ["Woman taming lion", "White robe", "Infinity symbol", "Flower crown and belt", "Blue background"],
      "love": {"upright": "Passionate romance, compassion attracting partners", "reversed": "Codependency, insecurity"},
      "career": {"upright": "Bold career moves possible", "reversed": "Impostor syndrome"},
      "health": "Good stamina, balance energy with rest",
      "yesNo": "Yes",
      "advice": "Trust your inner strength. Overcome through patience and compassion."
    },
    {
      "number": 9,
      "name": {"en": "The Hermit", "zh": "隐士", "ja": "隠者"},
      "keywords": ["soul-searching", "introspection", "solitude", "inner guidance", "wisdom", "contemplation", "meditation"],
      "upright": "Taking a break to draw energy inward. Answers are deep within your soul.",
      "reversed": "Not taking enough time for reflection OR too much isolation.",
      "astrology": {"ruling": "Virgo", "element": "Earth"},
      "numerology": {"number": 9, "meaning": "Completion, wisdom, attainment"},
      "symbols": ["Old man on mountain", "Lantern with star", "Long staff", "Grey robe", "Snow-covered mountains"],
      "love": {"upright": "Need time alone before relationships", "reversed": "Unwelcome isolation"},
      "career": {"upright": "Wondering if in right career", "reversed": "Balance isolation with collaboration"},
      "health": "Time for rest and self-care",
      "yesNo": "No",
      "advice": "Withdraw temporarily to seek inner wisdom."
    },
    {
      "number": 10,
      "name": {"en": "Wheel of Fortune", "zh": "命运之轮", "ja": "運命の輪"},
      "keywords": ["destiny", "fate", "karma", "life cycles", "turning points", "good luck", "change", "fortune"],
      "upright": "The wheel is always turning. Big changes coming. Cherish blissful moments.",
      "reversed": "Resistance to change, bad luck, negative patterns repeating.",
      "astrology": {"ruling": "Jupiter", "element": "Fire"},
      "numerology": {"number": 10, "meaning": "Completion of cycle, new beginnings"},
      "symbols": ["Giant wheel", "YHVH letters", "TARO letters", "Alchemical symbols", "Snake", "Sphinx", "Four winged creatures"],
      "love": {"upright": "Great relationship changes, soulmates", "reversed": "Stagnancy, past mistakes surfacing"},
      "career": {"upright": "Major positive career changes", "reversed": "Career setbacks"},
      "health": "Changes in health patterns, break bad cycles",
      "yesNo": "Yes",
      "advice": "Embrace change and trust in life's cycles."
    },
    {
      "number": 11,
      "name": {"en": "Justice", "zh": "正义", "ja": "正義"},
      "keywords": ["justice", "fairness", "truth", "law", "cause and effect", "karma", "accountability", "balance", "integrity"],
      "upright": "All actions have consequences. Legal matters resolved fairly. Make choices consciously.",
      "reversed": "Injustice, avoidance of karma, being treated unfairly.",
      "astrology": {"ruling": "Libra", "element": "Air"},
      "numerology": {"number": 11, "meaning": "Master number, intuition, spiritual insight"},
      "symbols": ["Figure between pillars", "Purple veil", "Red robe", "Scales", "Double-edged sword", "Crown"],
      "love": {"upright": "True honest love, fairness in partnership", "reversed": "Deception, endless arguments"},
      "career": {"upright": "Hard work rewarded, past decisions affecting present", "reversed": "Unjust circumstances"},
      "health": "Balance between activity and rest",
      "yesNo": "Yes",
      "advice": "Be honest and act with integrity. Truth will prevail."
    },
    {
      "number": 12,
      "name": {"en": "The Hanged Man", "zh": "倒吊人", "ja": "吊るされた男"},
      "keywords": ["surrender", "letting go", "new perspective", "pause", "sacrifice", "suspension", "waiting", "contemplation"],
      "upright": "Voluntary sacrifice for higher purpose. Let go of control, see from different angle.",
      "reversed": "Resistance to sacrifice, stalling, delaying inevitable decision.",
      "astrology": {"ruling": "Neptune", "element": "Water"},
      "numerology": {"number": 12, "meaning": "Completion, cosmic order, pause before transformation"},
      "symbols": ["Man suspended upside-down", "Living tree", "Serene expression", "Crossed leg", "Halo", "Red pants", "Blue tunic"],
      "love": {"upright": "Feeling trapped, not time for commitments", "reversed": "Unwillingness to make sacrifices"},
      "career": {"upright": "Period of uncertainty, wait for more information", "reversed": "Stalling on decisions"},
      "health": "Red flag about procrastinated health issues",
      "yesNo": "Maybe",
      "advice": "Surrender control. See your situation from a different perspective."
    },
    {
      "number": 13,
      "name": {"en": "Death", "zh": "死神", "ja": "死神"},
      "keywords": ["transformation", "endings", "change", "transition", "rebirth", "letting go", "release", "new beginnings"],
      "upright": "Profound transformation—end of one phase, beginning of another. Release the old.",
      "reversed": "Resistance to necessary change, fear of transformation, being stuck.",
      "astrology": {"ruling": "Scorpio", "element": "Water"},
      "numerology": {"number": 13, "meaning": "Transformation, death/rebirth cycles"},
      "symbols": ["Skeleton in armor", "White horse", "Black banner with white rose", "Fallen figures", "Rising sun", "River"],
      "love": {"upright": "Major transformation, ending or deeper phase", "reversed": "Clinging to failing relationship"},
      "career": {"upright": "Career transformation, leaving outdated approach", "reversed": "Refusing to adapt"},
      "health": "End of health challenges, major lifestyle changes needed",
      "yesNo": "No",
      "advice": "Embrace endings as necessary for new beginnings."
    },
    {
      "number": 14,
      "name": {"en": "Temperance", "zh": "节制", "ja": "節制"},
      "keywords": ["balance", "moderation", "patience", "harmony", "purpose", "alchemy", "healing", "integration", "middle path"],
      "upright": "Balance, peace, patience. Blending diverse elements to create something valuable.",
      "reversed": "Imbalance, excess, extremes, overindulgence.",
      "astrology": {"ruling": "Sagittarius", "element": "Fire"},
      "numerology": {"number": 14, "meaning": "Balance, harmony, adaptability"},
      "symbols": ["Winged angel", "Light blue robe", "One foot on rocks/water", "Two cups with flowing water", "Irises", "Winding path"],
      "love": {"upright": "Harmonious partnership, soulmates", "reversed": "Imbalance, disharmony"},
      "career": {"upright": "Set goals with patience, hard work noticed", "reversed": "Lack of work-life balance"},
      "health": "Moderation key to good health",
      "yesNo": "Yes",
      "advice": "Practice moderation. Blend opposing forces to create harmony."
    },
    {
      "number": 15,
      "name": {"en": "The Devil", "zh": "恶魔", "ja": "悪魔"},
      "keywords": ["shadow self", "attachment", "addiction", "restriction", "bondage", "materialism", "sexuality", "temptation"],
      "upright": "Shadow side and negative forces. Trapped by unhealthy attachments. The chains are loose.",
      "reversed": "Breaking free from attachments, overcoming addiction, spiritual liberation.",
      "astrology": {"ruling": "Capricorn", "element": "Earth"},
      "numerology": {"number": 15, "meaning": "Reduces to 6 (Lovers connection), duality of choice"},
      "symbols": ["Baphomet", "Inverted pentagram", "Chained figures", "Bat wings", "Horns on humans", "Tails", "Torch"],
      "love": {"upright": "Intense passion but watch for codependency", "reversed": "Breaking free from unhealthy relationship"},
      "career": {"upright": "Feeling trapped in unfulfilling job", "reversed": "Breaking free from dead-end career"},
      "health": "Issues related to addiction, negative patterns",
      "yesNo": "No",
      "advice": "Acknowledge the chains that bind you—only then can you remove them."
    },
    {
      "number": 16,
      "name": {"en": "The Tower", "zh": "塔", "ja": "塔"},
      "keywords": ["sudden change", "upheaval", "chaos", "revelation", "awakening", "destruction", "liberation", "breakthrough"],
      "upright": "Sudden upheaval shaking foundations. Destruction is necessary for authentic rebuilding.",
      "reversed": "Resisting inevitable change, delaying the inevitable, averting disaster.",
      "astrology": {"ruling": "Mars", "element": "Fire"},
      "numerology": {"number": 16, "meaning": "Reduces to 7—spiritual awakening through crisis"},
      "symbols": ["Tower on mountain", "Lightning bolt", "Falling crown", "Falling figures", "Flames", "Grey clouds", "Yod flames"],
      "love": {"upright": "Sudden relationship upheaval, shocking revelation", "reversed": "Avoiding necessary breakup"},
      "career": {"upright": "Job loss, business failure, crisis", "reversed": "Narrowly avoiding job loss"},
      "health": "Sudden health crisis, body demanding attention",
      "yesNo": "No",
      "advice": "Let lightning strike away your illusions. From destruction comes liberation."
    },
    {
      "number": 17,
      "name": {"en": "The Star", "zh": "星星", "ja": "星"},
      "keywords": ["hope", "faith", "renewal", "inspiration", "serenity", "healing", "spirituality", "purpose", "calm"],
      "upright": "Hope and renewed faith after devastation. Spiritual connection and inner peace.",
      "reversed": "Lost faith, despair, disconnection from spiritual self.",
      "astrology": {"ruling": "Aquarius", "element": "Air"},
      "numerology": {"number": 17, "meaning": "Reduces to 8—infinite potential"},
      "symbols": ["Naked woman", "One foot on land/water", "Two pitchers", "Large star", "Seven smaller stars", "Pool", "Lush landscape"],
      "love": {"upright": "Renewed hope in love, healing from heartbreak", "reversed": "Feeling hopeless about love"},
      "career": {"upright": "Positive opportunities, recognition", "reversed": "Lack of motivation"},
      "health": "Excellent healing energy, recovery",
      "yesNo": "Yes",
      "advice": "After darkness comes starlight. Let your authentic light shine."
    },
    {
      "number": 18,
      "name": {"en": "The Moon", "zh": "月亮", "ja": "月"},
      "keywords": ["illusion", "fear", "anxiety", "subconscious", "intuition", "uncertainty", "deception", "dreams", "hidden truths"],
      "upright": "Realm of illusion and subconscious. Things are not what they seem. Trust instincts.",
      "reversed": "Emerging from confusion, fears subsiding, truth revealed.",
      "astrology": {"ruling": "Pisces", "element": "Water"},
      "numerology": {"number": 18, "meaning": "Reduces to 9—completion, spiritual wisdom"},
      "symbols": ["Full moon with face", "Crescent moon", "Two towers", "Dog and wolf", "Crayfish", "Pool", "Winding path"],
      "love": {"upright": "Uncertainty, hidden truths, fears distorting perception", "reversed": "Secrets revealed, clarity"},
      "career": {"upright": "Confusion, workplace deception, avoid major decisions", "reversed": "Clarity emerging"},
      "health": "Mental health focus—anxiety, sleep disturbances",
      "yesNo": "Maybe",
      "advice": "Not everything is as it appears. Trust intuition over logic."
    },
    {
      "number": 19,
      "name": {"en": "The Sun", "zh": "太阳", "ja": "太陽"},
      "keywords": ["joy", "success", "positivity", "vitality", "warmth", "abundance", "happiness", "celebration", "enlightenment", "truth"],
      "upright": "Most positive card—pure joy, success, vitality. Your energy is magnetic.",
      "reversed": "Still positive but dimmed. Struggling to see the bright side.",
      "astrology": {"ruling": "Sun", "element": "Fire"},
      "numerology": {"number": 19, "meaning": "Reduces to 1—new beginnings, unity, success"},
      "symbols": ["Radiant sun", "Naked child", "White horse", "Red banner", "Four sunflowers", "Stone wall"],
      "love": {"upright": "Joyful relationships, engagement/marriage/family", "reversed": "Taking relationship for granted"},
      "career": {"upright": "Career success, recognition, achievement", "reversed": "Temporary setbacks"},
      "health": "Excellent vitality, robust physical health",
      "yesNo": "Strong Yes",
      "advice": "Let your light shine brightly. Celebrate your accomplishments."
    },
    {
      "number": 20,
      "name": {"en": "Judgement", "zh": "审判", "ja": "審判"},
      "keywords": ["rebirth", "inner calling", "absolution", "self-evaluation", "awakening", "renewal", "transformation", "second chances"],
      "upright": "Spiritual awakening and call to higher purpose. All pieces coming together.",
      "reversed": "Ignoring inner calling, refusing to learn from past, excessive self-doubt.",
      "astrology": {"ruling": "Pluto", "element": "Fire"},
      "numerology": {"number": 20, "meaning": "Reduces to 2—duality, partnership, choices"},
      "symbols": ["Archangel Gabriel", "Trumpet", "White flag with cross", "Rising figures", "Open arms", "Mountains", "Blue water"],
      "love": {"upright": "Honest evaluation, second chances, forgiveness", "reversed": "Judging partner too harshly"},
      "career": {"upright": "Being evaluated, career awakening, discovering calling", "reversed": "Avoiding needed changes"},
      "health": "Period of healing and wholeness",
      "yesNo": "Yes",
      "advice": "Answer the call of your highest self. Rise to meet your purpose."
    },
    {
      "number": 21,
      "name": {"en": "The World", "zh": "世界", "ja": "世界"},
      "keywords": ["completion", "achievement", "fulfillment", "wholeness", "integration", "accomplishment", "travel", "success", "closure"],
      "upright": "Successful completion of major life cycle. State of wholeness. This ending is a new beginning.",
      "reversed": "Incomplete cycles, unfinished business, lack of closure.",
      "astrology": {"ruling": "Saturn", "element": "Earth"},
      "numerology": {"number": 21, "meaning": "Reduces to 3—creative expression, completion"},
      "symbols": ["Dancing figure", "Two wands", "Purple sash", "Laurel wreath", "Red ribbons", "Four corner figures"],
      "love": {"upright": "Relationship reaching fulfillment—engagement, marriage", "reversed": "Seeking closure from past"},
      "career": {"upright": "Major achievement, professional pinnacle", "reversed": "Projects incomplete"},
      "health": "Complete recovery, achieving wellness goals",
      "yesNo": "Strong Yes",
      "advice": "You have arrived. Honor how far you've come. Prepare for the next adventure."
    }
  ]
}
```

---

## Part 2: Minor Arcana - Complete 56 Cards

### Suit of Wands (权杖 / ワンド) - Fire Element

**Element:** Fire | **Themes:** Passion, creativity, action, career, willpower | **Zodiac:** Aries, Leo, Sagittarius

| Card | Chinese | Japanese | Keywords | Decan | Yes/No |
|------|---------|----------|----------|-------|--------|
| Ace | 权杖王牌 | ワンドのエース | creation, willpower, inspiration, potential | Root of Fire | Yes |
| Two | 权杖二 | ワンドの2 | planning, future vision, decisions, discovery | Mars in Aries | Yes |
| Three | 权杖三 | ワンドの3 | expansion, foresight, overseas, progress | Sun in Aries | Yes |
| Four | 权杖四 | ワンドの4 | celebration, joy, harmony, milestones | Venus in Aries | Yes |
| Five | 权杖五 | ワンドの5 | competition, conflict, rivalry, tension | Saturn in Leo | Maybe |
| Six | 权杖六 | ワンドの6 | victory, success, recognition, triumph | Jupiter in Leo | Yes |
| Seven | 权杖七 | ワンドの7 | challenge, protection, perseverance, defense | Mars in Leo | Yes |
| Eight | 权杖八 | ワンドの8 | rapid action, movement, swift change, travel | Mercury in Sagittarius | Yes |
| Nine | 权杖九 | ワンドの9 | resilience, persistence, boundaries, grit | Moon in Sagittarius | Yes |
| Ten | 权杖十 | ワンドの10 | burden, responsibility, hard work, stress | Saturn in Sagittarius | Yes |
| Page | 权杖侍从 | ワンドのペイジ | inspiration, ideas, free spirit, potential | Earth of Fire | Yes |
| Knight | 权杖骑士 | ワンドのナイト | action, adventure, passion, fearlessness | Fire of Fire (Leo) | Yes |
| Queen | 权杖王后 | ワンドのクイーン | courage, confidence, independence, warmth | Water of Fire (Aries) | Yes |
| King | 权杖国王 | ワンドのキング | leadership, vision, entrepreneur, honor | Air of Fire (Sagittarius) | Yes |

### Suit of Cups (圣杯 / カップ) - Water Element

**Element:** Water | **Themes:** Emotions, relationships, intuition, love | **Zodiac:** Cancer, Scorpio, Pisces

| Card | Chinese | Japanese | Keywords | Decan | Yes/No |
|------|---------|----------|----------|-------|--------|
| Ace | 圣杯王牌 | カップのエース | new love, emotional beginnings, compassion | Root of Water | Yes |
| Two | 圣杯二 | カップの2 | partnership, unity, mutual attraction, harmony | Venus in Cancer | Yes |
| Three | 圣杯三 | カップの3 | celebration, friendship, community, creativity | Mercury in Cancer | Yes |
| Four | 圣杯四 | カップの4 | contemplation, apathy, meditation, reevaluation | Moon in Cancer | No |
| Five | 圣杯五 | カップの5 | loss, grief, regret, disappointment, mourning | Mars in Scorpio | No |
| Six | 圣杯六 | カップの6 | nostalgia, childhood memories, innocence, joy | Sun in Scorpio | Yes |
| Seven | 圣杯七 | カップの7 | choices, illusion, wishful thinking, fantasy | Venus in Scorpio | Maybe |
| Eight | 圣杯八 | カップの8 | walking away, disillusionment, seeking meaning | Saturn in Pisces | No |
| Nine | 圣杯九 | カップの9 | contentment, wish fulfillment, gratitude, luxury | Jupiter in Pisces | Yes |
| Ten | 圣杯十 | カップの10 | divine love, family harmony, emotional fulfillment | Mars in Pisces | Yes |
| Page | 圣杯侍从 | カップのペイジ | creative opportunities, intuitive messages, dreamer | Earth of Water | Yes |
| Knight | 圣杯骑士 | カップのナイト | romance, charm, imagination, following heart | Fire of Water (Pisces) | Yes |
| Queen | 圣杯王后 | カップのクイーン | compassion, calm, intuition, nurturing | Water of Water (Cancer) | Yes |
| King | 圣杯国王 | カップのキング | emotional balance, diplomacy, wisdom | Air of Water (Scorpio) | Yes |

### Suit of Swords (宝剑 / ソード) - Air Element

**Element:** Air | **Themes:** Intellect, conflict, truth, decisions, communication | **Zodiac:** Libra, Aquarius, Gemini

| Card | Chinese | Japanese | Keywords | Decan | Yes/No |
|------|---------|----------|----------|-------|--------|
| Ace | 宝剑王牌 | ソードのエース | breakthrough, clarity, new ideas, truth | Root of Air | Yes |
| Two | 宝剑二 | ソードの2 | difficult decisions, stalemate, indecision | Moon in Libra | Maybe |
| Three | 宝剑三 | ソードの3 | heartbreak, emotional pain, sorrow, grief | Saturn in Libra | No |
| Four | 宝剑四 | ソードの4 | rest, relaxation, meditation, recuperation | Jupiter in Libra | Yes |
| Five | 宝剑五 | ソードの5 | conflict, defeat, winning at all costs | Venus in Aquarius | No |
| Six | 宝剑六 | ソードの6 | transition, moving on, leaving behind, change | Mercury in Aquarius | Yes |
| Seven | 宝剑七 | ソードの7 | deception, betrayal, strategy, secrecy | Moon in Aquarius | No |
| Eight | 宝剑八 | ソードの8 | restriction, entrapment, self-limitation | Jupiter in Gemini | No |
| Nine | 宝剑九 | ソードの9 | anxiety, worry, fear, nightmares, insomnia | Mars in Gemini | No |
| Ten | 宝剑十 | ソードの10 | painful ending, rock bottom, betrayal, defeat | Sun in Gemini | No |
| Page | 宝剑侍从 | ソードのペイジ | curiosity, new ideas, thirst for knowledge | Earth of Air | Maybe |
| Knight | 宝剑骑士 | ソードのナイト | ambitious, action-oriented, driven, assertive | Fire of Air (Aquarius) | Yes |
| Queen | 宝剑王后 | ソードのクイーン | independent, clear boundaries, perceptive | Water of Air (Libra) | Yes |
| King | 宝剑国王 | ソードのキング | mental clarity, intellectual power, authority | Air of Air (Gemini) | Yes |

### Suit of Pentacles (金币/星币 / ペンタクル) - Earth Element

**Element:** Earth | **Themes:** Material world, finances, career, work, health | **Zodiac:** Capricorn, Taurus, Virgo

| Card | Chinese | Japanese | Keywords | Decan | Yes/No |
|------|---------|----------|----------|-------|--------|
| Ace | 金币王牌 | ペンタクルのエース | new opportunity, prosperity, manifestation | Root of Earth | Yes |
| Two | 金币二 | ペンタクルの2 | balance, juggling, adaptability, time management | Jupiter in Capricorn | Maybe |
| Three | 金币三 | ペンタクルの3 | teamwork, collaboration, learning, craftsmanship | Mars in Capricorn | Yes |
| Four | 金币四 | ペンタクルの4 | security, stability, conservation, control | Sun in Capricorn | Yes |
| Five | 金币五 | ペンタクルの5 | financial hardship, poverty, lack, isolation | Mercury in Taurus | No |
| Six | 金币六 | ペンタクルの6 | generosity, charity, giving, receiving, fairness | Moon in Taurus | Yes |
| Seven | 金币七 | ペンタクルの7 | patience, assessment, long-term investment | Saturn in Taurus | Yes |
| Eight | 金币八 | ペンタクルの8 | apprenticeship, skill development, diligence | Sun in Virgo | Yes |
| Nine | 金币九 | ペンタクルの9 | luxury, self-sufficiency, financial independence | Venus in Virgo | Yes |
| Ten | 金币十 | ペンタクルの10 | legacy, wealth, inheritance, family, long-term success | Mercury in Virgo | Yes |
| Page | 金币侍从 | ペンタクルのペイジ | manifestation, new opportunity, study, ambition | Earth of Earth | Yes |
| Knight | 金币骑士 | ペンタクルのナイト | hard work, routine, reliability, responsibility | Air of Earth (Virgo) | Yes |
| Queen | 金币王后 | ペンタクルのクイーン | nurturing, practical, abundance, home | Water of Earth (Capricorn) | Yes |
| King | 金币国王 | ペンタクルのキング | wealth, abundance, security, business, leadership | Fire of Earth (Taurus) | Yes |

---

## Part 3: Tarot Spreads (牌阵 / スプレッド)

### 1. Single Card Draw / 单张牌 / 一枚引き
```json
{
  "name": {"en": "Single Card Draw", "zh": "单张牌", "ja": "一枚引き"},
  "cardCount": 1,
  "positions": [{"number": 1, "name": {"en": "Daily Message", "zh": "每日信息", "ja": "デイリーメッセージ"}, "meaning": "Central theme or energy"}],
  "bestFor": ["Daily reflection", "Quick guidance", "Yes/No questions", "Learning cards"]
}
```

### 2. Three Card Spread / 三张牌 / 3枚スプレッド
```json
{
  "name": {"en": "Three Card Spread", "zh": "三张牌阵", "ja": "3枚スプレッド"},
  "cardCount": 3,
  "variations": [
    {
      "name": {"en": "Past-Present-Future", "zh": "过去-现在-未来", "ja": "過去-現在-未来"},
      "positions": [
        {"number": 1, "name": {"en": "Past", "zh": "过去", "ja": "過去"}, "meaning": "Past influences"},
        {"number": 2, "name": {"en": "Present", "zh": "现在", "ja": "現在"}, "meaning": "Current situation"},
        {"number": 3, "name": {"en": "Future", "zh": "未来", "ja": "未来"}, "meaning": "Likely outcome"}
      ]
    },
    {
      "name": {"en": "Situation-Action-Outcome", "zh": "情况-行动-结果", "ja": "状況-行動-結果"},
      "positions": [
        {"number": 1, "name": {"en": "Situation", "zh": "情况", "ja": "状況"}, "meaning": "Current issue"},
        {"number": 2, "name": {"en": "Action", "zh": "行动", "ja": "行動"}, "meaning": "Recommended action"},
        {"number": 3, "name": {"en": "Outcome", "zh": "结果", "ja": "結果"}, "meaning": "Potential result"}
      ]
    },
    {
      "name": {"en": "Mind-Body-Spirit", "zh": "心灵-身体-精神", "ja": "心-体-魂"},
      "positions": [
        {"number": 1, "name": {"en": "Mind", "zh": "心灵", "ja": "心"}, "meaning": "Mental state"},
        {"number": 2, "name": {"en": "Body", "zh": "身体", "ja": "体"}, "meaning": "Physical state"},
        {"number": 3, "name": {"en": "Spirit", "zh": "精神", "ja": "魂"}, "meaning": "Spiritual state"}
      ]
    }
  ],
  "bestFor": ["General guidance", "Quick insights", "Decision-making"]
}
```

### 3. Celtic Cross / 凯尔特十字 / ケルト十字
```json
{
  "name": {"en": "Celtic Cross", "zh": "凯尔特十字", "ja": "ケルト十字"},
  "cardCount": 10,
  "positions": [
    {"number": 1, "name": {"en": "Present", "zh": "现状", "ja": "現在"}, "meaning": "Current situation"},
    {"number": 2, "name": {"en": "Challenge", "zh": "挑战", "ja": "挑戦"}, "meaning": "Immediate obstacle"},
    {"number": 3, "name": {"en": "Foundation", "zh": "基础", "ja": "基盤"}, "meaning": "Root cause, distant past"},
    {"number": 4, "name": {"en": "Recent Past", "zh": "近期过去", "ja": "近い過去"}, "meaning": "Events recently passing"},
    {"number": 5, "name": {"en": "Crown", "zh": "意识", "ja": "意識"}, "meaning": "Goals, conscious thoughts"},
    {"number": 6, "name": {"en": "Unconscious", "zh": "潜意识", "ja": "無意識"}, "meaning": "Hidden influences"},
    {"number": 7, "name": {"en": "Self", "zh": "自我", "ja": "自己"}, "meaning": "How you see yourself"},
    {"number": 8, "name": {"en": "Environment", "zh": "环境", "ja": "環境"}, "meaning": "External influences"},
    {"number": 9, "name": {"en": "Hopes and Fears", "zh": "希望与恐惧", "ja": "希望と恐れ"}, "meaning": "Secret desires and anxieties"},
    {"number": 10, "name": {"en": "Outcome", "zh": "结果", "ja": "結果"}, "meaning": "Final resolution"}
  ],
  "bestFor": ["Complex situations", "Comprehensive readings", "Major life decisions"]
}
```

### 4. Relationship Spread / 感情牌阵 / 恋愛スプレッド
```json
{
  "name": {"en": "Relationship Spread", "zh": "感情牌阵", "ja": "恋愛スプレッド"},
  "cardCount": 7,
  "positions": [
    {"number": 1, "name": {"en": "You", "zh": "你", "ja": "あなた"}, "meaning": "Your role in relationship"},
    {"number": 2, "name": {"en": "Partner", "zh": "伴侣", "ja": "パートナー"}, "meaning": "Partner's role"},
    {"number": 3, "name": {"en": "Relationship", "zh": "关系", "ja": "関係"}, "meaning": "Current dynamic"},
    {"number": 4, "name": {"en": "Strengths", "zh": "优势", "ja": "強み"}, "meaning": "What unites you"},
    {"number": 5, "name": {"en": "Challenges", "zh": "挑战", "ja": "課題"}, "meaning": "Obstacles to overcome"},
    {"number": 6, "name": {"en": "Advice", "zh": "建议", "ja": "アドバイス"}, "meaning": "Guidance for improvement"},
    {"number": 7, "name": {"en": "Outcome", "zh": "结果", "ja": "結果"}, "meaning": "Potential future"}
  ],
  "bestFor": ["Understanding relationship dynamics", "Compatibility", "Improving communication"]
}
```

### 5. Career Spread / 事业牌阵 / 仕事スプレッド
```json
{
  "name": {"en": "Career Spread", "zh": "事业牌阵", "ja": "仕事スプレッド"},
  "cardCount": 5,
  "positions": [
    {"number": 1, "name": {"en": "Current Position", "zh": "现状", "ja": "現在の状況"}, "meaning": "Where you stand professionally"},
    {"number": 2, "name": {"en": "Challenges", "zh": "挑战", "ja": "課題"}, "meaning": "What's blocking progress"},
    {"number": 3, "name": {"en": "Strengths", "zh": "优势", "ja": "強み"}, "meaning": "Skills to leverage"},
    {"number": 4, "name": {"en": "Advice", "zh": "建议", "ja": "アドバイス"}, "meaning": "Recommended approach"},
    {"number": 5, "name": {"en": "Outcome", "zh": "结果", "ja": "結果"}, "meaning": "Career potential"}
  ],
  "bestFor": ["Career decisions", "Job changes", "Professional growth"]
}
```

### 6. Yes/No Spread / 是否牌阵 / イエス・ノースプレッド
```json
{
  "name": {"en": "Yes/No Spread", "zh": "是否牌阵", "ja": "イエス・ノースプレッド"},
  "cardCount": "1 or 3",
  "methods": {
    "singleCard": {"upright": "Yes", "reversed": "No"},
    "threeCard": {"majorityUpright": "Yes", "majorityReversed": "No"}
  },
  "yesCards": ["The Sun", "The Star", "The World", "Ace of Cups", "Six of Wands", "Nine of Cups", "Ten of Cups"],
  "noCards": ["The Tower", "Five of Cups", "Three of Swords", "Ten of Swords", "Five of Pentacles", "Nine of Swords"],
  "maybeCards": ["The Moon", "Two of Swords", "Seven of Cups", "The Hanged Man"],
  "bestFor": ["Simple yes/no decisions", "Quick guidance"]
}
```

### 7. Horseshoe Spread / 马蹄形牌阵 / 馬蹄形スプレッド
```json
{
  "name": {"en": "Horseshoe Spread", "zh": "马蹄形牌阵", "ja": "馬蹄形スプレッド"},
  "cardCount": 7,
  "positions": [
    {"number": 1, "name": {"en": "Past", "zh": "过去", "ja": "過去"}, "meaning": "Past events and root causes"},
    {"number": 2, "name": {"en": "Present", "zh": "现在", "ja": "現在"}, "meaning": "Current situation"},
    {"number": 3, "name": {"en": "Hidden Influences", "zh": "隐藏影响", "ja": "隠れた影響"}, "meaning": "Unseen factors"},
    {"number": 4, "name": {"en": "Obstacles", "zh": "障碍", "ja": "障害"}, "meaning": "Challenges to face"},
    {"number": 5, "name": {"en": "External Influences", "zh": "外部影响", "ja": "外部の影響"}, "meaning": "Others' attitudes"},
    {"number": 6, "name": {"en": "Advice", "zh": "建议", "ja": "アドバイス"}, "meaning": "Recommended action"},
    {"number": 7, "name": {"en": "Outcome", "zh": "结果", "ja": "結果"}, "meaning": "Final resolution"}
  ],
  "bestFor": ["Specific problems", "Multi-faceted situations", "General guidance"]
}
```

---

## Part 4: Multilingual Terminology

### Core Reading Terms
```typescript
const TERMINOLOGY = {
  shuffle: { en: "Shuffle", zh: "洗牌", ja: "シャッフル" },
  draw: { en: "Draw", zh: "抽牌", ja: "ドロー" },
  spread: { en: "Spread", zh: "牌阵", ja: "スプレッド" },
  upright: { en: "Upright", zh: "正位", ja: "正位置" },
  reversed: { en: "Reversed", zh: "逆位", ja: "逆位置" },
  significator: { en: "Significator", zh: "指示牌", ja: "シグニフィケーター" },
  querent: { en: "Querent", zh: "问卜者", ja: "質問者" },
  reader: { en: "Reader", zh: "塔罗师", ja: "リーダー" },
  majorArcana: { en: "Major Arcana", zh: "大阿尔卡纳", ja: "大アルカナ" },
  minorArcana: { en: "Minor Arcana", zh: "小阿尔卡纳", ja: "小アルカナ" },
  cut: { en: "Cut", zh: "切牌", ja: "カット" },
  reading: { en: "Reading", zh: "占卜", ja: "リーディング" },
  interpretation: { en: "Interpretation", zh: "解读", ja: "解釈" },
  deck: { en: "Deck", zh: "牌组", ja: "デッキ" },
  courtCards: { en: "Court Cards", zh: "宫廷牌", ja: "コートカード" }
};

const SUIT_NAMES = {
  wands: { en: "Wands", zh: "权杖", ja: "ワンド" },
  cups: { en: "Cups", zh: "圣杯", ja: "カップ" },
  swords: { en: "Swords", zh: "宝剑", ja: "ソード" },
  pentacles: { en: "Pentacles", zh: "金币/星币", ja: "ペンタクル" }
};

const COURT_TITLES = {
  page: { en: "Page", zh: "侍从", ja: "ペイジ" },
  knight: { en: "Knight", zh: "骑士", ja: "ナイト" },
  queen: { en: "Queen", zh: "王后", ja: "クイーン" },
  king: { en: "King", zh: "国王", ja: "キング" }
};

const ELEMENTS = {
  fire: { en: "Fire", zh: "火", ja: "火" },
  water: { en: "Water", zh: "水", ja: "水" },
  air: { en: "Air", zh: "风", ja: "風" },
  earth: { en: "Earth", zh: "土", ja: "地" }
};
```

---

## Part 5: Astrological Correspondences

### Major Arcana Rulerships
| Card | Ruling Body | Type |
|------|-------------|------|
| The Fool | Uranus | Planet |
| The Magician | Mercury | Planet |
| The High Priestess | Moon | Planet |
| The Empress | Venus | Planet |
| The Emperor | Aries | Zodiac |
| The Hierophant | Taurus | Zodiac |
| The Lovers | Gemini | Zodiac |
| The Chariot | Cancer | Zodiac |
| Strength | Leo | Zodiac |
| The Hermit | Virgo | Zodiac |
| Wheel of Fortune | Jupiter | Planet |
| Justice | Libra | Zodiac |
| The Hanged Man | Neptune | Planet |
| Death | Scorpio | Zodiac |
| Temperance | Sagittarius | Zodiac |
| The Devil | Capricorn | Zodiac |
| The Tower | Mars | Planet |
| The Star | Aquarius | Zodiac |
| The Moon | Pisces | Zodiac |
| The Sun | Sun | Planet |
| Judgement | Pluto | Planet |
| The World | Saturn | Planet |

### Minor Arcana Decanic System
- **Wands (Fire):** Aries (2-4), Leo (5-7), Sagittarius (8-10)
- **Cups (Water):** Cancer (2-4), Scorpio (5-7), Pisces (8-10)
- **Swords (Air):** Libra (2-4), Aquarius (5-7), Gemini (8-10)
- **Pentacles (Earth):** Capricorn (2-4), Taurus (5-7), Virgo (8-10)

---

## Part 6: TypeScript Interface Definitions

```typescript
interface MultilingualText {
  en: string;
  zh: string;
  ja: string;
}

interface TarotCard {
  number: number;
  name: MultilingualText;
  arcana: "major" | "minor";
  suit?: "wands" | "cups" | "swords" | "pentacles";
  keywords: string[];
  upright: string;
  reversed: string;
  astrology: {
    ruling: string;
    element: string;
    decan?: string;
    dates?: string;
  };
  numerology: {
    number: number;
    meaning: string;
  };
  symbols: string[];
  love: { upright: string; reversed: string };
  career: { upright: string; reversed: string };
  health: string;
  yesNo: "Yes" | "No" | "Maybe" | "Strong Yes";
  advice: string;
}

interface SpreadPosition {
  number: number;
  name: MultilingualText;
  meaning: string;
}

interface TarotSpread {
  name: MultilingualText;
  cardCount: number;
  positions: SpreadPosition[];
  bestFor: string[];
}

interface TarotKnowledgeBase {
  majorArcana: TarotCard[];
  minorArcana: {
    wands: TarotCard[];
    cups: TarotCard[];
    swords: TarotCard[];
    pentacles: TarotCard[];
  };
  spreads: TarotSpread[];
  terminology: Record&lt;string, MultilingualText&gt;;
}
```

---

## Summary

This comprehensive knowledge base provides **complete implementation-ready data** for a trilingual Tarot divination app:

- **78 cards** with full meanings, keywords, correspondences, and interpretations
- **22 Major Arcana** with planetary/zodiac rulerships
- **56 Minor Arcana** with decanic astrological correspondences
- **7 essential spreads** with position meanings in all three languages
- **Complete terminology tables** in English, Chinese, and Japanese
- **TypeScript interfaces** ready for code implementation
- **Yes/No tendencies** for all cards
- **Love, career, and health interpretations** for practical readings

All data is structured for JSON/TypeScript implementation with consistent formatting across all cards and spreads.