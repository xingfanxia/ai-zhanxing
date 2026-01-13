/**
 * Astrology Chart Interpretation API
 * POST /api/astrology/interpret
 *
 * Uses AI to interpret a natal chart.
 * Authentication required (saves to database).
 */

import { NextRequest, NextResponse } from 'next/server';
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

    // Validate chart data
    if (!body.chart || !body.chart.planets || !body.chart.ascendant) {
      return NextResponse.json(
        {
          error: 'Invalid chart data',
          message: 'Please provide a valid natal chart',
        },
        { status: 400 }
      );
    }

    // Build prompt
    const { systemPrompt, userPrompt } = JSON.parse(
      buildPrompt(body.chart, body.question, body.language)
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
        temperature: 0.7,
      }
    );

    // Save reading to database
    let readingId: string | undefined;
    try {
      // Use explicit typing due to Supabase SSR type inference issues
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
      // Still return the interpretation even if save fails
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

    // Flush PostHog events before serverless function terminates
    await flushPostHog();

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

    console.error('Astrology interpretation error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'Failed to interpret chart' },
      { status: 500 }
    );
  }
}
