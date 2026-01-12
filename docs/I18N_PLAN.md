# i18n Implementation Plan for AI Zhanxing

## Overview

Add comprehensive internationalization support to the AI Zhanxing astrology/tarot app using `next-intl`, the recommended i18n library for Next.js App Router.

## Target Languages

1. **English (en)** - Default
2. **Chinese Simplified (zh)** - Primary additional language
3. **Japanese (ja)** - Optional future addition

## Technology Choice: next-intl

### Why next-intl?

- **Built for App Router**: Designed specifically for Next.js App Router from the ground up
- **Server Component Support**: Works seamlessly with React Server Components
- **Type Safety**: Full TypeScript support with type-safe translation keys
- **ICU Message Format**: Supports pluralization, dates, numbers, rich text
- **Small Bundle**: Only sends current locale translations to client
- **Active Maintenance**: Well-maintained with responsive maintainer
- **Benchmark Score**: 92.3/100 on Context7

## Architecture

### URL Structure

```
/                     -> English (default)
/en/astrology         -> English astrology page
/zh/astrology         -> Chinese astrology page
/ja/astrology         -> Japanese astrology page (future)
```

### File Structure

```
ai_zhanxing/
├── messages/
│   ├── en.json          # English translations
│   ├── zh.json          # Chinese translations
│   └── ja.json          # Japanese translations (future)
├── src/
│   ├── i18n/
│   │   ├── config.ts    # Locale configuration
│   │   ├── routing.ts   # Routing configuration
│   │   └── request.ts   # Server request configuration
│   ├── app/
│   │   ├── [locale]/    # Locale-prefixed routes
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── astrology/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── tarot/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   └── readings/
│   │   │       └── page.tsx
│   │   └── api/          # API routes (no locale)
│   ├── components/
│   │   └── LocaleSwitcher.tsx
│   └── middleware.ts     # Locale detection middleware
└── next.config.ts        # next-intl plugin
```

## Implementation Steps

### Phase 1: Infrastructure Setup

1. **Install dependencies**
   ```bash
   npm install next-intl
   ```

2. **Create i18n configuration files**
   - `src/i18n/config.ts` - Define supported locales
   - `src/i18n/routing.ts` - Define routing configuration
   - `src/i18n/request.ts` - Server-side message loading

3. **Update next.config.ts**
   - Add next-intl plugin wrapper

4. **Create middleware.ts**
   - Handle locale detection and routing
   - Exclude API routes from locale prefixing

### Phase 2: Route Migration

1. **Create [locale] directory structure**
   - Move all page routes under `app/[locale]/`
   - Keep API routes at `app/api/`

2. **Update layout.tsx**
   - Add NextIntlClientProvider
   - Set HTML lang attribute
   - Handle RTL if needed

3. **Update navigation**
   - Use next-intl's Link component
   - Preserve locale in navigation

### Phase 3: Translation Files

Create `messages/en.json` and `messages/zh.json` with these namespaces:

```json
{
  "Common": {
    "loading": "Loading...",
    "error": "An error occurred",
    "save": "Save",
    "cancel": "Cancel",
    "back": "Back",
    "submit": "Submit"
  },
  "Home": {
    "title": "AI Zhanxing",
    "subtitle": "Western Astrology & Tarot",
    "astrologyTab": "Natal Chart",
    "tarotTab": "Tarot Reading"
  },
  "Astrology": {
    "title": "Calculate Your Natal Chart",
    "description": "Enter your birth information to generate your astrological chart",
    "birthDate": "Birth Date",
    "birthTime": "Birth Time",
    "birthLocation": "Birth Location",
    "citySearch": "Search for a city",
    "houseSystem": "House System",
    "calculateButton": "Calculate Chart",
    "calculating": "Calculating..."
  },
  "AstrologyResult": {
    "title": "Natal Chart",
    "chartWheel": "Chart Wheel",
    "planetPositions": "Planet Positions",
    "aspects": "Aspects",
    "interpretation": "AI Interpretation",
    "getInterpretation": "Get AI Interpretation",
    "analyzing": "Analyzing..."
  },
  "Tarot": {
    "title": "Tarot Reading",
    "description": "Focus your intention and draw your cards",
    "question": "Your Question (Optional)",
    "questionPlaceholder": "What guidance do you seek?",
    "questionHint": "You may leave this blank for a general reading",
    "chooseSpread": "Choose Your Spread",
    "drawCards": "Draw Cards",
    "drawing": "Drawing Cards..."
  },
  "TarotResult": {
    "cardMeanings": "Card Meanings",
    "reversed": "Reversed",
    "interpretation": "AI Interpretation",
    "getInterpretation": "Get AI Interpretation"
  },
  "Spreads": {
    "single": "Single Card",
    "singleDesc": "A quick answer or daily guidance",
    "threeCard": "Three Card Spread",
    "threeCardDesc": "Past, Present, Future or Situation, Action, Outcome",
    "celticCross": "Celtic Cross",
    "celticCrossDesc": "Comprehensive 10-card reading for deep insight"
  },
  "Readings": {
    "title": "My Readings",
    "noReadings": "No saved readings yet",
    "astrology": "Astrology",
    "tarot": "Tarot"
  },
  "Auth": {
    "signIn": "Sign In",
    "signOut": "Sign Out",
    "signInRequired": "Please sign in to continue"
  },
  "Planets": {
    "Sun": "Sun",
    "Moon": "Moon",
    "Mercury": "Mercury",
    "Venus": "Venus",
    "Mars": "Mars",
    "Jupiter": "Jupiter",
    "Saturn": "Saturn",
    "Uranus": "Uranus",
    "Neptune": "Neptune",
    "Pluto": "Pluto",
    "NorthNode": "North Node",
    "SouthNode": "South Node",
    "Chiron": "Chiron"
  },
  "Zodiac": {
    "Aries": "Aries",
    "Taurus": "Taurus",
    "Gemini": "Gemini",
    "Cancer": "Cancer",
    "Leo": "Leo",
    "Virgo": "Virgo",
    "Libra": "Libra",
    "Scorpio": "Scorpio",
    "Sagittarius": "Sagittarius",
    "Capricorn": "Capricorn",
    "Aquarius": "Aquarius",
    "Pisces": "Pisces"
  },
  "HouseSystems": {
    "placidus": "Placidus (Default)",
    "koch": "Koch",
    "wholeSign": "Whole Sign",
    "equal": "Equal House",
    "campanus": "Campanus",
    "regiomontanus": "Regiomontanus"
  }
}
```

### Phase 4: Component Updates

1. **Update all pages to use translations**
   ```tsx
   import {useTranslations} from 'next-intl';

   export default function Page() {
     const t = useTranslations('Astrology');
     return <h1>{t('title')}</h1>;
   }
   ```

2. **Create LocaleSwitcher component**
   - Dropdown or button to switch languages
   - Preserve current path when switching

3. **Update client components**
   - Wrap with NextIntlClientProvider where needed
   - Pass only required message namespaces

### Phase 5: Knowledge Base Localization

1. **Astrology knowledge** (`lib/knowledge/astrology/`)
   - Planet descriptions (multilingual)
   - Zodiac sign descriptions
   - Aspect interpretations
   - House meanings

2. **Tarot knowledge** (`lib/knowledge/tarot/`)
   - Card names and meanings
   - Spread position descriptions
   - Suit symbolism

### Phase 6: AI Interpretation Localization

1. **Update interpretation prompts**
   - Detect user's locale
   - Include language instruction in AI prompts
   - "Please respond in {language}"

2. **Update AI configuration**
   - Pass locale to interpretation APIs
   - Handle multilingual responses

## Migration Checklist

### Files to Modify

- [ ] `next.config.ts` - Add next-intl plugin
- [ ] Create `src/middleware.ts`
- [ ] Create `src/i18n/config.ts`
- [ ] Create `src/i18n/routing.ts`
- [ ] Create `src/i18n/request.ts`
- [ ] Create `messages/en.json`
- [ ] Create `messages/zh.json`
- [ ] Move `app/page.tsx` → `app/[locale]/page.tsx`
- [ ] Move `app/astrology/` → `app/[locale]/astrology/`
- [ ] Move `app/tarot/` → `app/[locale]/tarot/`
- [ ] Move `app/readings/` → `app/[locale]/readings/`
- [ ] Update `app/[locale]/layout.tsx`
- [ ] Create `components/LocaleSwitcher.tsx`
- [ ] Update all page components with useTranslations
- [ ] Update API routes for locale-aware responses

### Components to Update

- [ ] Home page (tabs, descriptions)
- [ ] Astrology input form
- [ ] Astrology result page
- [ ] Tarot spread selector
- [ ] Tarot result page
- [ ] Readings list page
- [ ] CitySearch component
- [ ] ChatInterface component
- [ ] NatalChartWheel labels
- [ ] TarotCard labels
- [ ] Navigation/header
- [ ] Error messages
- [ ] Loading states

## Testing Plan

1. **Locale Detection**
   - Test Accept-Language header detection
   - Test cookie-based locale persistence
   - Test URL-based locale switching

2. **Translations**
   - Verify all strings are translated
   - Check for missing translation keys
   - Test pluralization and formatting

3. **Navigation**
   - Test locale preservation in links
   - Test LocaleSwitcher functionality
   - Test back button behavior

4. **SEO**
   - Verify hreflang tags
   - Check sitemap for localized URLs
   - Test canonical URLs

## Estimated Effort

| Phase | Estimated Time |
|-------|----------------|
| Phase 1: Infrastructure | 2 hours |
| Phase 2: Route Migration | 2 hours |
| Phase 3: Translation Files | 3 hours |
| Phase 4: Component Updates | 4 hours |
| Phase 5: Knowledge Base | 2 hours |
| Phase 6: AI Localization | 1 hour |
| Testing & Polish | 2 hours |
| **Total** | **~16 hours** |

## Notes

- API routes remain at `/api/*` without locale prefix
- Consider lazy loading translation namespaces for performance
- Use `generateStaticParams` for static generation of locale pages
- Future: Add language detection based on user's location
