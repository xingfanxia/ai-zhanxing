/**
 * Tarot Reading Interpretation API
 * POST /api/tarot/interpret
 *
 * Uses AI to interpret a tarot reading with SSE streaming.
 * Authentication required. Deducts 1 credit per interpretation.
 */

import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getProvider, selectProvider, getABTestConfig } from '@/lib/ai';
import {
  getSpread,
  terminology,
  fullDeck,
  type TarotCard,
  type MinorArcanaCard,
} from '@/lib/knowledge/tarot';
import { trackEvent, flushPostHog } from '@/lib/posthog';
import type { GetCreditsResult, DeductCreditResult } from '@/lib/supabase/types';

export const runtime = 'nodejs';
export const maxDuration = 300; // Allow up to 5 minutes for AI generation

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
  const startTime = Date.now();
  let userId: string | undefined;

  try {
    // Check authentication
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'AUTH_REQUIRED', message: '请先登录' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    userId = user.id;

    // Parse request body
    const body = await request.json() as InterpretRequest;

    // Validate required fields
    if (!body.cards || !validateCards(body.cards)) {
      return new Response(
        JSON.stringify({
          error: 'Invalid cards',
          message: 'Please provide a valid array of cards with position, card data, and reversed status',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!body.question || typeof body.question !== 'string' || body.question.trim().length < 3) {
      return new Response(
        JSON.stringify({
          error: 'Invalid question',
          message: 'Please provide a question for the reading (min 3 characters)',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!body.spread_type || typeof body.spread_type !== 'string') {
      return new Response(
        JSON.stringify({
          error: 'Invalid spread type',
          message: 'Please provide the spread_type used for this reading',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // ===== CREDITS CHECK & DEDUCTION =====
    // Get credits before deduction (for logging)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: creditsBefore } = await (supabase.rpc as any)('get_credits', {
      p_user_id: user.id,
    });
    const beforeResult = (creditsBefore as GetCreditsResult[])?.[0];

    // Deduct 1 credit
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: deductData, error: deductError } = await (supabase.rpc as any)('deduct_credit', {
      p_user_id: user.id,
      p_cost: 1,
    });

    if (deductError) {
      console.error('Credit deduction error:', deductError);
      return new Response(
        JSON.stringify({ error: 'CREDITS_ERROR', message: '扣除额度失败' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const deductResult = (deductData as DeductCreditResult[])?.[0];
    if (!deductResult?.success) {
      return new Response(
        JSON.stringify({
          error: 'NO_CREDITS',
          message: deductResult?.error_message || '额度不足',
          credits: (deductResult?.remaining_total || 0) + (deductResult?.remaining_daily || 0),
        }),
        { status: 402, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Log usage
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from('usage_log') as any).insert({
      user_id: user.id,
      action: 'tarot_interpret',
      app: 'zhanxing',
      credits_before: beforeResult?.credits || 0,
      credits_after: (deductResult.remaining_total || 0) + (deductResult.remaining_daily || 0),
      metadata: {
        spread_type: body.spread_type,
        card_count: body.cards.length,
        language: body.language || 'en',
      },
    });
    // ===== END CREDITS CHECK =====

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
      return new Response(
        JSON.stringify({ error: 'Service unavailable', message: 'AI provider is not available' }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check if provider supports streaming
    if (!provider.chatStream) {
      // Fallback to non-streaming for providers without stream support
      const response = await provider.chat(
        [{ role: 'user', content: userPrompt }],
        {
          systemPrompt,
          maxTokens: 2000,
          temperature: 0.8,
        }
      );

      // Save reading to database
      let readingId: string | undefined;
      try {
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
      }

      // Track AI interpretation event
      trackEvent(user.id, 'ai_interpretation_generated', {
        reading_type: 'tarot',
        ai_provider: providerType,
        spread_type: body.spread_type,
        card_count: body.cards.length,
        language: body.language || 'en',
        tokens_used: response.usage
          ? response.usage.inputTokens + response.usage.outputTokens
          : null,
        reading_id: readingId,
      });

      await flushPostHog();

      // Return non-streaming response with credits info
      return new Response(JSON.stringify({
        success: true,
        data: {
          interpretation: response.content,
          readingId,
          provider: providerType,
          usage: response.usage,
        },
        credits: (deductResult.remaining_total || 0) + (deductResult.remaining_daily || 0),
        referralBonusClaimed: deductResult.referral_bonus_claimed || false,
        referralBonusAmount: deductResult.referral_bonus_amount || 0,
      }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Create streaming response using provider abstraction
    const streamGenerator = provider.chatStream(
      [{ role: 'user', content: userPrompt }],
      {
        systemPrompt,
        maxTokens: 2000,
        temperature: 0.8,
      }
    );

    // Create a ReadableStream for SSE response
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        let outputCharCount = 0;
        let streamSuccess = true;
        let streamUsage: { inputTokens: number; outputTokens: number } | undefined;
        let fullContent = '';

        try {
          for await (const chunk of streamGenerator) {
            // Capture usage from final chunk
            if (chunk.done && chunk.usage) {
              streamUsage = chunk.usage;
            }
            // Only send non-empty content chunks
            if (chunk.content && chunk.content.length > 0) {
              outputCharCount += chunk.content.length;
              fullContent += chunk.content;
              // Send as Server-Sent Events format
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: chunk.content })}\n\n`));
            }
          }

          // Send credits event with remaining credits and referral bonus info
          const remainingCredits = (deductResult.remaining_total || 0) + (deductResult.remaining_daily || 0);
          const creditsEvent: {
            type: 'credits';
            remaining: number;
            referralBonusClaimed?: boolean;
            referralBonusAmount?: number;
          } = {
            type: 'credits',
            remaining: remainingCredits,
          };
          if (deductResult.referral_bonus_claimed) {
            creditsEvent.referralBonusClaimed = true;
            creditsEvent.referralBonusAmount = deductResult.referral_bonus_amount || 0;
          }
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(creditsEvent)}\n\n`));

          // Send completion signal
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true, provider: providerType })}\n\n`));
          controller.close();

          // Save reading to database after successful stream
          let readingId: string | undefined;
          try {
            const insertData = {
              user_id: user.id,
              reading_type: 'tarot',
              input_data: {
                cards: body.cards,
                question: body.question,
                spread_type: body.spread_type,
              },
              result_data: {
                interpretation: fullContent,
                ai_provider: providerType,
                tokens_used: streamUsage
                  ? streamUsage.inputTokens + streamUsage.outputTokens
                  : Math.ceil(outputCharCount / 4),
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
          }

          // Track AI interpretation event
          trackEvent(userId!, 'ai_interpretation_generated', {
            reading_type: 'tarot',
            ai_provider: providerType,
            spread_type: body.spread_type,
            card_count: body.cards.length,
            language: body.language || 'en',
            tokens_used: streamUsage
              ? streamUsage.inputTokens + streamUsage.outputTokens
              : Math.ceil(outputCharCount / 4),
            reading_id: readingId,
            streaming: true,
            latencyMs: Date.now() - startTime,
          });

          await flushPostHog();
        } catch (error) {
          streamSuccess = false;
          console.error('Streaming error:', error);
          const errorMessage = error instanceof Error ? error.message : 'Streaming error occurred';
          const isEmptyResponse = errorMessage.includes('GEMINI_EMPTY_RESPONSE');
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({
              error: isEmptyResponse ? 'AI_EMPTY_RESPONSE' : 'STREAMING_ERROR',
              message: isEmptyResponse ? 'AI未能生成内容，请重试' : '解读生成失败，请重试'
            })}\n\n`)
          );
          controller.close();
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'X-AI-Provider': providerType,
      },
    });
  } catch (error) {
    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON', message: 'Request body must be valid JSON' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.error('Tarot interpretation error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', message: 'Failed to interpret reading' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
