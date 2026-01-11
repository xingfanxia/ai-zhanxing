/**
 * Tarot Readings API
 * GET /api/tarot/readings - List user's tarot readings
 * POST /api/tarot/readings - Create a new tarot reading
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  saveTarotReading,
  getTarotReadings,
  type TarotInputData,
  type TarotResultData,
} from '@/lib/services/readings';

/**
 * GET - List user's tarot readings
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
    const readings = await getTarotReadings(user.id, limit, offset);

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
    console.error('Error fetching tarot readings:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'Failed to fetch readings' },
      { status: 500 }
    );
  }
}

/**
 * POST - Create a new tarot reading
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

    const inputData: TarotInputData = body.inputData;
    const resultData: TarotResultData = body.resultData;
    const title: string | undefined = body.title;

    // Validate input data
    if (!inputData.spreadType || !inputData.cards || !Array.isArray(inputData.cards)) {
      return NextResponse.json(
        { error: 'Bad request', message: 'spreadType and cards array are required' },
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
    const result = await saveTarotReading(user.id, inputData, resultData, title);

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

    console.error('Error creating tarot reading:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'Failed to create reading' },
      { status: 500 }
    );
  }
}
