import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface ReferralRecord {
  id: string;
  referred_id: string;
  status: 'pending' | 'completed' | 'rejected';
  source_app: string | null;
  created_at: string;
  completed_at: string | null;
  referrer_bonus: number;
}

interface UserProfile {
  referral_code: string | null;
  successful_referrals: number | null;
  referred_by: string | null;
}

// GET /api/referral/stats - Get current user's referral stats and history
export async function GET() {
  try {
    const supabase = await createClient();

    // Check auth
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'AUTH_REQUIRED', message: '请先登录' }, { status: 401 });
    }

    // Get user profile with referral info
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: profile, error: profileError } = await (supabase as any)
      .from('user_profiles')
      .select('referral_code, successful_referrals, referred_by')
      .eq('id', user.id)
      .single() as { data: UserProfile | null; error: Error | null };

    if (profileError || !profile) {
      console.error('Get profile error:', profileError);
      return NextResponse.json(
        { error: 'PROFILE_ERROR', message: '获取用户信息失败' },
        { status: 500 }
      );
    }

    // Get referral history (as referrer)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: referrals, error: referralsError } = await (supabase as any)
      .from('referrals')
      .select('id, referred_id, status, source_app, created_at, completed_at, referrer_bonus')
      .eq('referrer_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50) as { data: ReferralRecord[] | null; error: Error | null };

    if (referralsError) {
      console.error('Get referrals error:', referralsError);
      // Don't fail the request, just return empty array
    }

    const referralRecords = (referrals as ReferralRecord[]) || [];

    // Calculate stats
    const pendingCount = referralRecords.filter((r) => r.status === 'pending').length;
    const completedCount = referralRecords.filter((r) => r.status === 'completed').length;
    const totalBonus = referralRecords
      .filter((r) => r.status === 'completed')
      .reduce((sum, r) => sum + r.referrer_bonus, 0);

    return NextResponse.json({
      code: profile.referral_code,
      successfulReferrals: profile.successful_referrals || 0,
      maxReferrals: 5,
      pendingCount,
      completedCount,
      totalBonus,
      hasBeenReferred: !!profile.referred_by,
      referrals: referralRecords.map((r) => ({
        id: r.id,
        status: r.status,
        sourceApp: r.source_app,
        createdAt: r.created_at,
        completedAt: r.completed_at,
        bonus: r.referrer_bonus,
      })),
    });
  } catch (error) {
    console.error('Referral stats API error:', error);
    return NextResponse.json({ error: 'SERVER_ERROR', message: '服务器错误' }, { status: 500 });
  }
}
