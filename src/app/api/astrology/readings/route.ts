/**
 * Astrology Readings API
 * GET /api/astrology/readings - List user's astrology readings
 * POST /api/astrology/readings - Create a new astrology reading
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  saveAstrologyReading,
  getAstrologyReadings,
  type AstrologyInputData,
  type AstrologyResultData,
} from '@/lib/services/readings';

/**
 * GET - List user's astrology readings
 */
export async function GET(request: NextRequest) {
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

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    // Fetch readings
    const readings = await getAstrologyReadings(user.id, limit, offset);

    return NextResponse.json({
      success: true,
      data: readings,
      meta: {
        limit,
        offset,
        count: readings.length,
      },
    });
  } catch (error) {
    console.error('Error fetching astrology readings:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'Failed to fetch readings' },
      { status: 500 }
    );
  }
}

/**
 * POST - Create a new astrology reading
 */
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
    const body = await request.json();

    // Validate required fields
    if (!body.inputData || !body.resultData) {
      return NextResponse.json(
        { error: 'Bad request', message: 'inputData and resultData are required' },
        { status: 400 }
      );
    }

    const inputData: AstrologyInputData = body.inputData;
    const resultData: AstrologyResultData = body.resultData;
    const title: string | undefined = body.title;

    // Validate chart data if present
    if (inputData.chart && (!inputData.chart.planets || !inputData.chart.ascendant)) {
      return NextResponse.json(
        { error: 'Bad request', message: 'Invalid chart data' },
        { status: 400 }
      );
    }

    // Validate result data
    if (!resultData.interpretation) {
      return NextResponse.json(
        { error: 'Bad request', message: 'interpretation is required in resultData' },
        { status: 400 }
      );
    }

    // Save the reading
    const result = await saveAstrologyReading(user.id, inputData, resultData, title);

    if (!result) {
      return NextResponse.json(
        { error: 'Internal server error', message: 'Failed to save reading' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: result.id,
        message: 'Reading saved successfully',
      },
    }, { status: 201 });
  } catch (error) {
    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Bad request', message: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    console.error('Error creating astrology reading:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'Failed to create reading' },
      { status: 500 }
    );
  }
}
