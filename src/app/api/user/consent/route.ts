import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/user/consent
 * Get the user's TOS consent status
 */
export async function GET() {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user profile
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: profile, error: profileError } = await (supabase.from('user_profiles') as any)
      .select('tos_accepted_at')
      .eq('id', user.id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('[GET /api/user/consent] Error fetching profile:', profileError);
      return NextResponse.json(
        { error: 'Failed to fetch consent status' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      tosAcceptedAt: profile?.tos_accepted_at || null,
    });
  } catch (error) {
    console.error('[GET /api/user/consent] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/user/consent
 * Save the user's TOS consent timestamp
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse body
    const body = await request.json();
    const tosAcceptedAt = body.tosAcceptedAt;

    if (!tosAcceptedAt) {
      return NextResponse.json(
        { error: 'tosAcceptedAt is required' },
        { status: 400 }
      );
    }

    // Validate timestamp format
    const timestamp = new Date(tosAcceptedAt);
    if (isNaN(timestamp.getTime())) {
      return NextResponse.json(
        { error: 'Invalid tosAcceptedAt format' },
        { status: 400 }
      );
    }

    // Upsert user profile with consent timestamp
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: upsertError } = await (supabase.from('user_profiles') as any)
      .upsert(
        {
          id: user.id,
          tos_accepted_at: timestamp.toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'id',
        }
      );

    if (upsertError) {
      console.error('[POST /api/user/consent] Error saving consent:', upsertError);
      return NextResponse.json(
        { error: 'Failed to save consent' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      tosAcceptedAt: timestamp.toISOString(),
    });
  } catch (error) {
    console.error('[POST /api/user/consent] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
