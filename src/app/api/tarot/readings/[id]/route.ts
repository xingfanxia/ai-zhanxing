/**
 * Tarot Reading by ID API
 * GET /api/tarot/readings/[id] - Get a single reading
 * PUT /api/tarot/readings/[id] - Update a reading
 * DELETE /api/tarot/readings/[id] - Delete a reading
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  getTarotReading,
  updateTarotReading,
  deleteTarotReading,
  isValidUUID,
  type UpdateReadingParams,
} from '@/lib/services/readings';

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET - Get a single tarot reading
 */
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    // Validate UUID format
    if (!isValidUUID(id)) {
      return NextResponse.json(
        { error: 'Bad request', message: 'Invalid reading ID format' },
        { status: 400 }
      );
    }

    // Check authentication
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication required' },
        { status: 401 }
      );
    }

    // Fetch the reading
    const reading = await getTarotReading(id);

    if (!reading) {
      return NextResponse.json(
        { error: 'Not found', message: 'Reading not found' },
        { status: 404 }
      );
    }

    // Check ownership
    if (reading.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden', message: 'You do not have access to this reading' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      data: reading,
    });
  } catch (error) {
    console.error('Error fetching tarot reading:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'Failed to fetch reading' },
      { status: 500 }
    );
  }
}

/**
 * PUT - Update a tarot reading
 */
export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    // Validate UUID format
    if (!isValidUUID(id)) {
      return NextResponse.json(
        { error: 'Bad request', message: 'Invalid reading ID format' },
        { status: 400 }
      );
    }

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

    // Build update params
    const updates: UpdateReadingParams = {};
    if (body.inputData) updates.inputData = body.inputData;
    if (body.resultData) updates.resultData = body.resultData;
    if (body.title) updates.title = body.title;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'Bad request', message: 'No update fields provided' },
        { status: 400 }
      );
    }

    // Update the reading
    const success = await updateTarotReading(id, user.id, updates);

    if (!success) {
      return NextResponse.json(
        { error: 'Not found', message: 'Reading not found or update failed' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Reading updated successfully',
    });
  } catch (error) {
    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Bad request', message: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    console.error('Error updating tarot reading:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'Failed to update reading' },
      { status: 500 }
    );
  }
}

/**
 * DELETE - Delete a tarot reading
 */
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    // Validate UUID format
    if (!isValidUUID(id)) {
      return NextResponse.json(
        { error: 'Bad request', message: 'Invalid reading ID format' },
        { status: 400 }
      );
    }

    // Check authentication
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication required' },
        { status: 401 }
      );
    }

    // Delete the reading
    const success = await deleteTarotReading(id, user.id);

    if (!success) {
      return NextResponse.json(
        { error: 'Not found', message: 'Reading not found or delete failed' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Reading deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting tarot reading:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'Failed to delete reading' },
      { status: 500 }
    );
  }
}
