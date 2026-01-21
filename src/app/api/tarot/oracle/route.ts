/**
 * Oracle (Yes/No) Tarot Reading API
 * POST /api/tarot/oracle
 *
 * Draws a single card for yes/no questions.
 * Logic:
 * - Cards have inherent yesNo values: 'Yes', 'No', 'Maybe', 'Strong Yes'
 * - Reversal modifies the answer (flips Yes<->No, reduces Strong Yes to Maybe)
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  fullDeck,
  type TarotCard,
  type MinorArcanaCard,
  type YesNoTendency,
} from '@/lib/knowledge/tarot';
import { trackEvent, flushPostHog } from '@/lib/posthog';

interface OracleRequest {
  question?: string;
  allow_reversed?: boolean;
}

type OracleAnswer = 'yes' | 'no' | 'maybe';

interface OracleResponse {
  success: boolean;
  data: {
    answer: OracleAnswer;
    confidence: 'strong' | 'moderate' | 'uncertain';
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
      inherentYesNo: YesNoTendency;
    };
    reversed: boolean;
    explanation: {
      en: string;
      zh: string;
    };
    question?: string;
    drawnAt: string;
  };
}

function drawCard(allowReversed: boolean = true): {
  card: TarotCard | MinorArcanaCard;
  reversed: boolean;
} {
  const shuffled = [...fullDeck].sort(() => Math.random() - 0.5);
  const card = shuffled[0];
  return {
    card,
    reversed: allowReversed ? Math.random() > 0.5 : false,
  };
}

function getOracleAnswer(
  card: TarotCard | MinorArcanaCard,
  reversed: boolean
): { answer: OracleAnswer; confidence: 'strong' | 'moderate' | 'uncertain' } {
  const inherentValue = card.yesNo;

  if (!reversed) {
    switch (inherentValue) {
      case 'Strong Yes':
        return { answer: 'yes', confidence: 'strong' };
      case 'Yes':
        return { answer: 'yes', confidence: 'moderate' };
      case 'No':
        return { answer: 'no', confidence: 'moderate' };
      case 'Maybe':
      default:
        return { answer: 'maybe', confidence: 'uncertain' };
    }
  } else {
    switch (inherentValue) {
      case 'Strong Yes':
        return { answer: 'maybe', confidence: 'uncertain' };
      case 'Yes':
        return { answer: 'no', confidence: 'moderate' };
      case 'No':
        return { answer: 'maybe', confidence: 'uncertain' };
      case 'Maybe':
      default:
        return { answer: 'maybe', confidence: 'uncertain' };
    }
  }
}

function generateExplanation(
  card: TarotCard | MinorArcanaCard,
  reversed: boolean,
  answer: OracleAnswer
): { en: string; zh: string } {
  const cardName = card.name;
  const meaning = reversed ? card.reversed : card.upright;
  const orientation = reversed ? 'reversed' : 'upright';
  const orientationZh = reversed ? '逆位' : '正位';

  const answerText = {
    yes: { en: 'Yes', zh: '是' },
    no: { en: 'No', zh: '否' },
    maybe: { en: 'Maybe', zh: '不确定' },
  };

  return {
    en: `The ${cardName.en} appears ${orientation}, indicating "${answerText[answer].en}". ${meaning}`,
    zh: `${cardName.zh}以${orientationZh}出现，指示"${answerText[answer].zh}"。${meaning}`,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as OracleRequest;
    const allowReversed = body.allow_reversed !== false;

    const { card, reversed } = drawCard(allowReversed);
    const { answer, confidence } = getOracleAnswer(card, reversed);
    const explanation = generateExplanation(card, reversed, answer);

    trackEvent('anonymous', 'oracle_reading', {
      card_name: card.name.en,
      card_arcana: card.arcana,
      reversed,
      inherent_yes_no: card.yesNo,
      final_answer: answer,
      confidence,
      has_question: !!body.question,
    });

    await flushPostHog();

    const response: OracleResponse = {
      success: true,
      data: {
        answer,
        confidence,
        card: {
          number: card.number,
          name: card.name,
          arcana: card.arcana,
          suit: 'suit' in card ? card.suit : undefined,
          keywords: card.keywords,
          upright: card.upright,
          reversed: card.reversed,
          inherentYesNo: card.yesNo,
        },
        reversed,
        explanation,
        question: body.question,
        drawnAt: new Date().toISOString(),
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON', message: 'Request body must be valid JSON' },
        { status: 400 }
      );
    }

    console.error('Oracle reading error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'Failed to get oracle reading' },
      { status: 500 }
    );
  }
}
