/**
 * Tarot Card Draw API
 * POST /api/tarot/draw
 *
 * Draws cards for a tarot spread.
 * No authentication required.
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  fullDeck,
  getSpread,
  allSpreads,
  type TarotCard,
  type MinorArcanaCard,
  type TarotSpread,
  type ThreeCardSpread,
} from '@/lib/knowledge/tarot';
import { trackEvent } from '@/lib/posthog';

// Valid spread types
type SpreadType =
  | 'single'
  | 'single-card'
  | 'three_card'
  | 'three-card'
  | 'celtic_cross'
  | 'celtic-cross'
  | 'relationship'
  | 'career'
  | 'yes-no'
  | 'horseshoe';

// Request body type
interface DrawRequest {
  spread_type: SpreadType;
  variation?: string; // For three-card spread variations
  allow_reversed?: boolean;
}

// Drawn card result
interface DrawnCard {
  position: number;
  positionName: {
    en: string;
    zh: string;
    ja: string;
  };
  positionMeaning: string;
  card: {
    number: number;
    name: {
      en: string;
      zh: string;
      ja: string;
    };
    arcana: string;
    suit?: string;
    keywords: string[];
    upright: string;
    reversed: string;
  };
  reversed: boolean;
}

// Normalize spread type
function normalizeSpreadType(type: string): string {
  const normalized = type.toLowerCase().replace(/_/g, '-');
  // Map common aliases
  const aliases: Record<string, string> = {
    'single': 'single-card',
    'three-card': 'three-card',
    'three_card': 'three-card',
    'celtic-cross': 'celtic-cross',
    'celtic_cross': 'celtic-cross',
    'yes-no': 'yes-no',
    'yes_no': 'yes-no',
  };
  return aliases[normalized] || normalized;
}

// Get card count for spread
function getCardCount(spreadId: string): number {
  const spread = getSpread(spreadId);
  if (!spread) return 1;

  // Handle yes-no spread which has string cardCount
  if (typeof spread.cardCount === 'string') {
    return 1; // Default to single card for yes-no
  }

  return spread.cardCount;
}

// Get positions for spread
function getPositions(spreadId: string, variation?: string) {
  const spread = getSpread(spreadId);
  if (!spread) {
    return [
      {
        number: 1,
        name: { en: 'Card', zh: '牌', ja: 'カード' },
        meaning: 'General guidance',
      },
    ];
  }

  // Handle three-card spread with variations
  if ('variations' in spread && spread.variations) {
    const threeCardSpread = spread as ThreeCardSpread;
    const selectedVariation = variation
      ? threeCardSpread.variations.find(
          v => v.name.en.toLowerCase().includes(variation.toLowerCase())
        )
      : threeCardSpread.variations[0];

    return selectedVariation?.positions || threeCardSpread.variations[0].positions;
  }

  // Handle regular spreads
  if ('positions' in spread && spread.positions) {
    return spread.positions;
  }

  // Fallback for yes-no spread
  return [
    {
      number: 1,
      name: { en: 'Answer', zh: '答案', ja: '答え' },
      meaning: 'Yes or No indication',
    },
  ];
}

// Shuffle and draw cards
function drawCards(count: number, allowReversed: boolean = true): Array<{
  card: TarotCard | MinorArcanaCard;
  reversed: boolean;
}> {
  // Create a copy and shuffle using Fisher-Yates
  const deck = [...fullDeck];
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck.slice(0, count).map(card => ({
    card,
    reversed: allowReversed ? Math.random() > 0.5 : false,
  }));
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json() as DrawRequest;

    // Validate spread type
    if (!body.spread_type || typeof body.spread_type !== 'string') {
      return NextResponse.json(
        {
          error: 'Invalid spread type',
          message: 'Please provide a valid spread_type',
          validTypes: [
            'single',
            'three_card',
            'celtic_cross',
            'relationship',
            'career',
            'yes-no',
            'horseshoe',
          ],
        },
        { status: 400 }
      );
    }

    const spreadId = normalizeSpreadType(body.spread_type);
    const spread = getSpread(spreadId);

    if (!spread) {
      return NextResponse.json(
        {
          error: 'Unknown spread type',
          message: `Spread type "${body.spread_type}" not found`,
          validTypes: allSpreads.map(s => s.id),
        },
        { status: 400 }
      );
    }

    // Get card count and positions
    const cardCount = getCardCount(spreadId);
    const positions = getPositions(spreadId, body.variation);
    const allowReversed = body.allow_reversed !== false; // Default true

    // Draw cards
    const drawnCards = drawCards(cardCount, allowReversed);

    // Build response with positions
    const cards: DrawnCard[] = drawnCards.map((draw, index) => ({
      position: index + 1,
      positionName: positions[index]?.name || {
        en: `Position ${index + 1}`,
        zh: `位置 ${index + 1}`,
        ja: `位置 ${index + 1}`,
      },
      positionMeaning: positions[index]?.meaning || 'Card meaning',
      card: {
        number: draw.card.number,
        name: draw.card.name,
        arcana: draw.card.arcana,
        suit: 'suit' in draw.card ? draw.card.suit : undefined,
        keywords: draw.card.keywords,
        upright: draw.card.upright,
        reversed: draw.card.reversed,
      },
      reversed: draw.reversed,
    }));

    // Track tarot reading started event
    trackEvent('anonymous', 'tarot_reading_started', {
      spread_type: spread.id,
      spread_name: spread.name.en,
      card_count: cardCount,
      allow_reversed: allowReversed,
      reversed_cards_count: cards.filter(c => c.reversed).length,
      major_arcana_count: cards.filter(c => c.card.arcana === 'Major Arcana').length,
    });

    return NextResponse.json({
      success: true,
      data: {
        spread: {
          id: spread.id,
          name: spread.name,
          cardCount,
        },
        cards,
        drawnAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON', message: 'Request body must be valid JSON' },
        { status: 400 }
      );
    }

    console.error('Tarot draw error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'Failed to draw cards' },
      { status: 500 }
    );
  }
}
