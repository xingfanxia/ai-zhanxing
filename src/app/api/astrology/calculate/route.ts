/**
 * Astrology Natal Chart Calculation API
 * POST /api/astrology/calculate
 *
 * Calculates natal chart based on birth data.
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
import { trackEvent } from '@/lib/posthog';

// Request body type
interface CalculateRequest {
  birthData: BirthData;
  options?: CalculationOptions;
}

// Validation functions
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
    // Parse request body
    const body = await request.json() as CalculateRequest;

    // Validate birth data
    if (!body.birthData || !validateBirthData(body.birthData)) {
      return NextResponse.json(
        {
          error: 'Invalid birth data',
          message: 'Please provide valid date, time, timezone, latitude, and longitude',
          details: {
            date: 'Required, format: YYYY-MM-DD',
            time: 'Optional, format: HH:MM or HH:MM:SS',
            timezone: 'Required, IANA timezone (e.g., America/New_York)',
            latitude: 'Required, -90 to 90',
            longitude: 'Required, -180 to 180',
          },
        },
        { status: 400 }
      );
    }

    // Calculate natal chart
    const chart = calculateNatalChart(body.birthData, body.options);

    // Track natal chart calculation event
    trackEvent('anonymous', 'natal_chart_calculated', {
      sun_sign: chart.planets.Sun.sign,
      moon_sign: chart.planets.Moon.sign,
      rising_sign: chart.ascendant.sign,
      house_system: chart.houses.system,
      has_birth_time: body.birthData.time !== null,
    });

    // Return the chart
    return NextResponse.json({
      success: true,
      data: {
        birthData: chart.birthData,
        julianDay: chart.julianDay,
        planets: chart.planets,
        houses: chart.houses,
        ascendant: chart.ascendant,
        midheaven: chart.midheaven,
        aspects: chart.aspects,
        calculatedAt: chart.calculatedAt.toISOString(),
      },
    });
  } catch (error) {
    // Handle specific calculation errors
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

    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          error: 'Invalid JSON',
          message: 'Request body must be valid JSON',
        },
        { status: 400 }
      );
    }

    // Generic error handling
    console.error('Natal chart calculation error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'Failed to calculate natal chart',
      },
      { status: 500 }
    );
  }
}
