/**
 * Tarot Reading Interpretation API
 * POST /api/tarot/interpret
 *
 * Uses AI to interpret a tarot reading.
 * Authentication required (saves to database).
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getProvider, selectProvider, getABTestConfig } from '@/lib/ai';
import {
  getSpread,
  terminology,
  fullDeck,
  type TarotCard,
  type MinorArcanaCard,
} from '@/lib/knowledge/tarot';

// Card in reading
interface ReadingCard {
  position: number;
  positionName: string;
  positionMeaning: string;
  card: {
    number: number;
    name: { en: string; zh?: string; ja?: string };
    arcana: string;
    suit?: string;
    keywords: string[];
    upright: string;
    reversed: string;
  };
  reversed: boolean;
}

// Request body type
interface InterpretRequest {
  cards: ReadingCard[];
  question: string;
  spread_type: string;
  language?: 'en' | 'zh' | 'ja';
}

// Build the interpretation prompt
function buildPrompt(
  cards: ReadingCard[],
  question: string,
  spreadType: string,
  language: string = 'en'
): { systemPrompt: string; userPrompt: string } {
  const langInstruction = language === 'zh'
    ? '请用中文回复。使用温暖、富有洞察力的语气。'
    : language === 'ja'
      ? '日本語で回答してください。温かく洞察力のある口調で。'
      : 'Please respond in English. Use a warm, insightful tone.';

  // Build card descriptions
  const cardDescriptions = cards
    .map(c => {
      const meaning = c.reversed ? c.card.reversed : c.card.upright;
      const orientation = c.reversed ? '(Reversed)' : '(Upright)';
      const cardName = typeof c.card.name === 'string'
        ? c.card.name
        : c.card.name.en;

      return `Position ${c.position} - ${c.positionName} (${c.positionMeaning}):
  Card: ${cardName} ${orientation}
  Arcana: ${c.card.arcana}${c.card.suit ? ` (${c.card.suit})` : ''}
  Keywords: ${c.card.keywords.join(', ')}
  Meaning: ${meaning}`;
    })
    .join('\n\n');

  const spread = getSpread(spreadType.replace(/_/g, '-'));
  const spreadName = spread?.name.en || spreadType;

  const systemPrompt = `You are an experienced tarot reader providing insightful and compassionate interpretations.

${langInstruction}

Core principles for your readings:
- Each card's meaning is influenced by its position in the spread
- Reversed cards often indicate blocked energy, internalization, or the shadow aspect
- Look for patterns: multiple cards of the same suit or number carry significance
- Major Arcana cards represent major life themes and spiritual lessons
- Minor Arcana cards represent daily life and practical matters

Suit meanings:
- Wands (Fire): Passion, creativity, action, willpower
- Cups (Water): Emotions, relationships, intuition, love
- Swords (Air): Thoughts, communication, conflict, truth
- Pentacles (Earth): Material matters, work, health, finances

Reading style:
- Start with an overview connecting all cards
- Explain each card in its position context
- Draw connections between cards
- Provide actionable guidance
- Be encouraging while being honest about challenges
- Respect the querent's autonomy in decision-making`;

  const userPrompt = `Please interpret this ${spreadName} tarot reading.

**Question:** ${question}

**Cards Drawn:**
${cardDescriptions}

Provide a comprehensive interpretation that:
1. Gives an overall theme for the reading
2. Explains each card in the context of its position
3. Shows how the cards relate to each other
4. Directly addresses the querent's question
5. Offers practical guidance and next steps

Remember to consider both the individual card meanings and how they work together to tell a story.`;

  return { systemPrompt, userPrompt };
}

// Validate cards array
function validateCards(cards: unknown): cards is ReadingCard[] {
  if (!Array.isArray(cards) || cards.length === 0) return false;

  return cards.every(card => {
    if (!card || typeof card !== 'object') return false;
    const c = card as Record<string, unknown>;

    return (
      typeof c.position === 'number' &&
      typeof c.positionName === 'string' &&
      typeof c.positionMeaning === 'string' &&
      c.card &&
      typeof c.card === 'object' &&
      typeof c.reversed === 'boolean'
    );
  });
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json() as InterpretRequest;

    // Validate required fields
    if (!body.cards || !validateCards(body.cards)) {
      return NextResponse.json(
        {
          error: 'Invalid cards',
          message: 'Please provide a valid array of cards with position, card data, and reversed status',
        },
        { status: 400 }
      );
    }

    if (!body.question || typeof body.question !== 'string' || body.question.trim().length < 3) {
      return NextResponse.json(
        {
          error: 'Invalid question',
          message: 'Please provide a question for the reading (min 3 characters)',
        },
        { status: 400 }
      );
    }

    if (!body.spread_type || typeof body.spread_type !== 'string') {
      return NextResponse.json(
        {
          error: 'Invalid spread type',
          message: 'Please provide the spread_type used for this reading',
        },
        { status: 400 }
      );
    }

    // Build prompt
    const { systemPrompt, userPrompt } = buildPrompt(
      body.cards,
      body.question,
      body.spread_type,
      body.language
    );

    // Select AI provider (supports A/B testing)
    const abConfig = getABTestConfig();
    const providerType = selectProvider(abConfig);
    const provider = getProvider(providerType);

    if (!provider.isAvailable()) {
      return NextResponse.json(
        { error: 'Service unavailable', message: 'AI provider is not available' },
        { status: 503 }
      );
    }

    // Call AI for interpretation
    const response = await provider.chat(
      [{ role: 'user', content: userPrompt }],
      {
        systemPrompt,
        maxTokens: 2000,
        temperature: 0.8, // Slightly higher for creative readings
      }
    );

    // Save reading to database
    let readingId: string | undefined;
    try {
      // Use explicit typing due to Supabase SSR type inference issues
      const insertData = {
        user_id: user.id,
        reading_type: 'tarot',
        input_data: {
          cards: body.cards,
          question: body.question,
          spread_type: body.spread_type,
        },
        result_data: {
          interpretation: response.content,
          ai_provider: providerType,
          tokens_used: response.usage
            ? response.usage.inputTokens + response.usage.outputTokens
            : null,
        },
      };

      const { data: reading, error: dbError } = await supabase
        .from('readings')
        .insert(insertData as never)
        .select('id')
        .single();

      if (dbError) {
        console.error('Failed to save reading:', dbError);
      } else if (reading) {
        readingId = (reading as { id: string }).id;
      }
    } catch (saveError) {
      console.error('Failed to save reading:', saveError);
      // Still return the interpretation even if save fails
    }

    return NextResponse.json({
      success: true,
      data: {
        interpretation: response.content,
        readingId,
        provider: providerType,
        usage: response.usage,
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

    console.error('Tarot interpretation error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'Failed to interpret reading' },
      { status: 500 }
    );
  }
}
