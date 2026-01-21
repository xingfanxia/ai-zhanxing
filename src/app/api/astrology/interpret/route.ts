/**
 * Astrology Chart Interpretation API
 * POST /api/astrology/interpret
 *
 * Uses AI to interpret a natal chart with SSE streaming.
 * Authentication required. Deducts 1 credit per interpretation.
 */

import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getProvider, selectProvider, getABTestConfig } from '@/lib/ai';
import type { NatalChart } from '@/lib/calculation';
import {
  ZODIAC_SIGNS,
  PLANETS,
  HOUSES,
  ALL_ASPECTS,
} from '@/lib/knowledge/astrology';
import { trackEvent, flushPostHog } from '@/lib/posthog';
import type { GetCreditsResult, DeductCreditResult } from '@/lib/supabase/types';

export const runtime = 'nodejs';
export const maxDuration = 300; // Allow up to 5 minutes for AI generation

// Request body type
interface InterpretRequest {
  chart: NatalChart;
  question?: string;
  language?: 'en' | 'zh' | 'ja';
}

// Build the interpretation prompt
function buildPrompt(chart: NatalChart, question?: string, language: string = 'en'): string {
  const langInstruction = language === 'zh'
    ? '请用中文回复。'
    : language === 'ja'
      ? '日本語で回答してください。'
      : 'Please respond in English.';

  // Extract key placements
  const sunSign = chart.planets.Sun.sign;
  const moonSign = chart.planets.Moon.sign;
  const risingSign = chart.ascendant.sign;
  const mcSign = chart.midheaven.sign;

  // Format planet positions
  const planetPositions = Object.entries(chart.planets)
    .map(([planet, pos]) => {
      const retrograde = pos.retrograde ? ' (R)' : '';
      return `${planet}: ${pos.sign} ${Math.floor(pos.degreeInSign)}°${retrograde}`;
    })
    .join('\n');

  // Format major aspects
  const majorAspects = chart.aspects
    .filter(a => ['Conjunction', 'Opposition', 'Trine', 'Square', 'Sextile'].includes(a.type))
    .slice(0, 15)
    .map(a => `${a.planet1} ${a.type} ${a.planet2} (orb: ${a.orb.toFixed(1)}°)`)
    .join('\n');

  // Build system prompt with knowledge base context
  const systemPrompt = `You are an expert Western astrologer providing personalized natal chart interpretations.

${langInstruction}

Use these astrological principles in your interpretation:
- Each planet represents a different aspect of personality and life
- Signs color how that energy expresses itself
- Houses show which life areas are activated
- Aspects reveal relationships between planetary energies

Key knowledge to apply:
- Sun sign represents core identity and ego
- Moon sign represents emotions and inner world
- Rising sign (Ascendant) represents outward personality and first impressions
- Midheaven (MC) represents career and public image
- Inner planets (Sun, Moon, Mercury, Venus, Mars) are personal
- Outer planets (Jupiter, Saturn, Uranus, Neptune, Pluto) are generational

Provide a comprehensive but accessible interpretation. Avoid overly technical jargon.
Be insightful, warm, and constructive in your guidance.`;

  // Build user prompt
  let userPrompt = `Please interpret this natal chart:

**The Big Three:**
- Sun Sign: ${sunSign}
- Moon Sign: ${moonSign}
- Rising Sign: ${risingSign}
- Midheaven: ${mcSign}

**Planet Positions:**
${planetPositions}

**Major Aspects:**
${majorAspects}

**House System:** ${chart.houses.system}
`;

  if (question) {
    userPrompt += `\n**Specific Question:** ${question}\n\nPlease focus your interpretation on this question while still providing relevant context from the chart.`;
  } else {
    userPrompt += `\nProvide a comprehensive interpretation covering:
1. Core personality (Sun, Moon, Rising)
2. Communication and thinking style (Mercury)
3. Love and values (Venus)
4. Drive and ambition (Mars)
5. Life themes and growth areas (outer planets)
6. Notable aspect patterns`;
  }

  return JSON.stringify({ systemPrompt, userPrompt });
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

    // Validate chart data
    if (!body.chart || !body.chart.planets || !body.chart.ascendant) {
      return new Response(
        JSON.stringify({
          error: 'Invalid chart data',
          message: 'Please provide a valid natal chart',
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
      action: 'astrology_interpret',
      app: 'zhanxing',
      credits_before: beforeResult?.credits || 0,
      credits_after: (deductResult.remaining_total || 0) + (deductResult.remaining_daily || 0),
      metadata: {
        has_question: !!body.question,
        language: body.language || 'en',
      },
    });
    // ===== END CREDITS CHECK =====

    // Build prompt
    const { systemPrompt, userPrompt } = JSON.parse(
      buildPrompt(body.chart, body.question, body.language)
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
          temperature: 0.7,
        }
      );

      // Save reading to database
      let readingId: string | undefined;
      try {
        const insertData = {
          user_id: user.id,
          reading_type: 'astrology',
          input_data: {
            chart: body.chart,
            question: body.question,
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
        reading_type: 'astrology',
        ai_provider: providerType,
        has_question: !!body.question,
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
        temperature: 0.7,
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
              reading_type: 'astrology',
              input_data: {
                chart: body.chart,
                question: body.question,
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
            reading_type: 'astrology',
            ai_provider: providerType,
            has_question: !!body.question,
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

    console.error('Astrology interpretation error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', message: 'Failed to interpret chart' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
