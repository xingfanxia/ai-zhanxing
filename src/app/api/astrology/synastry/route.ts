/**
 * Synastry Chart Calculation API
 * POST /api/astrology/synastry
 *
 * Calculates synastry (relationship compatibility) between two natal charts.
 * No authentication required (calculation only).
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  calculateNatalChart,
  BirthData,
  CalculationOptions,
  CalculationError,
  InvalidBirthDataError,
} from '@/lib/calculation';
import {
  calculateSynastry,
  SynastryResult,
} from '@/lib/calculation/synastry';
import { trackEvent, flushPostHog } from '@/lib/posthog';

interface SynastryRequest {
  person1: {
    name?: string;
    birthData: BirthData;
  };
  person2: {
    name?: string;
    birthData: BirthData;
  };
  options?: CalculationOptions;
}

function isValidDate(date: string): boolean {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) return false;
  const parsed = new Date(date);
  return !isNaN(parsed.getTime());
}

function isValidTime(time: string | null): boolean {
  if (time === null) return true;
  const timeRegex = /^\d{2}:\d{2}(:\d{2})?$/;
  return timeRegex.test(time);
}

function isValidLatitude(lat: number): boolean {
  return typeof lat === 'number' && lat >= -90 && lat <= 90;
}

function isValidLongitude(lng: number): boolean {
  return typeof lng === 'number' && lng >= -180 && lng <= 180;
}

function validateBirthData(data: unknown): data is BirthData {
  if (!data || typeof data !== 'object') return false;

  const bd = data as Record<string, unknown>;

  return (
    typeof bd.date === 'string' &&
    isValidDate(bd.date) &&
    (bd.time === null || (typeof bd.time === 'string' && isValidTime(bd.time))) &&
    typeof bd.timezone === 'string' &&
    typeof bd.latitude === 'number' &&
    isValidLatitude(bd.latitude) &&
    typeof bd.longitude === 'number' &&
    isValidLongitude(bd.longitude)
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as SynastryRequest;

    // Validate both birth data objects
    if (!body.person1?.birthData || !validateBirthData(body.person1.birthData)) {
      return NextResponse.json(
        {
          error: 'Invalid birth data for person 1',
          message: 'Please provide valid date, time, timezone, latitude, and longitude',
        },
        { status: 400 }
      );
    }

    if (!body.person2?.birthData || !validateBirthData(body.person2.birthData)) {
      return NextResponse.json(
        {
          error: 'Invalid birth data for person 2',
          message: 'Please provide valid date, time, timezone, latitude, and longitude',
        },
        { status: 400 }
      );
    }

    // Calculate both natal charts
    const chart1 = calculateNatalChart(body.person1.birthData, body.options);
    const chart2 = calculateNatalChart(body.person2.birthData, body.options);

    // Calculate synastry
    const synastryResult = calculateSynastry(chart1, chart2);

    // Track synastry calculation event
    trackEvent('anonymous', 'synastry_calculated', {
      person1_sun_sign: chart1.planets.Sun.sign,
      person2_sun_sign: chart2.planets.Sun.sign,
      overall_score: synastryResult.scores.overall,
      total_aspects: synastryResult.summary.totalAspects,
      harmonious_aspects: synastryResult.summary.harmonious,
      challenging_aspects: synastryResult.summary.challenging,
    });

    await flushPostHog();

    return NextResponse.json({
      success: true,
      data: {
        person1: {
          name: body.person1.name || 'Person 1',
          chart: {
            birthData: chart1.birthData,
            planets: chart1.planets,
            ascendant: chart1.ascendant,
          },
        },
        person2: {
          name: body.person2.name || 'Person 2',
          chart: {
            birthData: chart2.birthData,
            planets: chart2.planets,
            ascendant: chart2.ascendant,
          },
        },
        synastry: {
          aspects: synastryResult.aspects.slice(0, 30), // Limit aspects returned
          scores: synastryResult.scores,
          keyAspects: synastryResult.keyAspects,
          summary: synastryResult.summary,
        },
        calculatedAt: synastryResult.calculatedAt.toISOString(),
      },
    });
  } catch (error) {
    if (error instanceof InvalidBirthDataError) {
      return NextResponse.json(
        {
          error: 'Invalid birth data',
          message: error.message,
          code: error.code,
        },
        { status: 400 }
      );
    }

    if (error instanceof CalculationError) {
      return NextResponse.json(
        {
          error: 'Calculation error',
          message: error.message,
          code: error.code,
        },
        { status: 500 }
      );
    }

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          error: 'Invalid JSON',
          message: 'Request body must be valid JSON',
        },
        { status: 400 }
      );
    }

    console.error('Synastry calculation error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'Failed to calculate synastry chart',
      },
      { status: 500 }
    );
  }
}
