import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { GetCreditsResult, DeductCreditResult } from '@/lib/supabase/types';

// GET /api/credits - Get current credits (with daily check-in bonus)
export async function GET() {
  try {
    const supabase = await createClient();

    // Check auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'AUTH_REQUIRED', message: '请先登录' },
        { status: 401 }
      );
    }

    // Get credits using the function (handles daily check-in bonus)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase.rpc as any)('get_credits', {
      p_user_id: user.id,
    });

    if (error) {
      console.error('Get credits error:', error);
      return NextResponse.json(
        { error: 'CREDITS_ERROR', message: '获取额度失败' },
        { status: 500 }
      );
    }

    const result = (data as GetCreditsResult[])?.[0];
    if (!result) {
      // Profile might not exist yet - return defaults
      return NextResponse.json({
        credits: 10,
        checkedInToday: false,
        bonusAwarded: false,
        wasReferred: false,
      });
    }

    // Check if user was referred (for signup bonus toast)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: profileData } = await (supabase.from('user_profiles') as any)
      .select('referred_by')
      .eq('id', user.id)
      .single();

    return NextResponse.json({
      credits: result.credits,
      checkedInToday: result.checked_in_today,
      bonusAwarded: result.bonus_awarded,
      wasReferred: !!profileData?.referred_by,
    });
  } catch (error) {
    console.error('Credits API error:', error);
    return NextResponse.json(
      { error: 'SERVER_ERROR', message: '服务器错误' },
      { status: 500 }
    );
  }
}

// POST /api/credits/deduct - Deduct credits
export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // Check auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'AUTH_REQUIRED', message: '请先登录' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const cost = body.cost || 1;
    const action = body.action || 'unknown';
    const app = body.app || 'zhanxing';

    // Get current credits before deduction (for logging)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: creditsBefore } = await (supabase.rpc as any)('get_credits', {
      p_user_id: user.id,
    });
    const beforeResult = (creditsBefore as GetCreditsResult[])?.[0];

    // Deduct credit
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase.rpc as any)('deduct_credit', {
      p_user_id: user.id,
      p_cost: cost,
    });

    if (error) {
      console.error('Deduct credit error:', error);
      return NextResponse.json(
        { error: 'DEDUCTION_ERROR', message: '扣除额度失败' },
        { status: 500 }
      );
    }

    const result = (data as DeductCreditResult[])?.[0];
    if (!result) {
      return NextResponse.json(
        { error: 'DEDUCTION_ERROR', message: '扣除额度失败' },
        { status: 500 }
      );
    }

    if (!result.success) {
      return NextResponse.json(
        {
          error: 'NO_CREDITS',
          message: result.error_message || '额度不足',
          credits: result.remaining_total || 0,
        },
        { status: 402 }
      );
    }

    // Log usage
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from('usage_log') as any).insert({
      user_id: user.id,
      action,
      app,
      credits_before: beforeResult?.credits || 0,
      credits_after: result.remaining_total || 0,
      metadata: body.metadata || null,
    });

    // Get remaining credits (unified pool since Session 58)
    const totalCredits = result.remaining_total || 0;

    return NextResponse.json({
      success: true,
      credits: totalCredits,
      // Include referral bonus info if claimed
      referralBonusClaimed: result.referral_bonus_claimed || false,
      referralBonusAmount: result.referral_bonus_amount || 0,
    });
  } catch (error) {
    console.error('Credits deduction API error:', error);
    return NextResponse.json(
      { error: 'SERVER_ERROR', message: '服务器错误' },
      { status: 500 }
    );
  }
}
