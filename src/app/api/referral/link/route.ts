import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface LinkReferralResult {
  success: boolean;
  referrer_id: string | null;
  error_message: string | null;
}

// POST /api/referral/link - Link a referral code to the current user
export async function POST(request: Request) {
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

    const body = await request.json();
    const { code, sourceApp } = body;

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'INVALID_CODE', message: '请输入推荐码' }, { status: 400 });
    }

    // Call the link_referral function
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase.rpc as any)('link_referral', {
      p_referred_user_id: user.id,
      p_referral_code: code.trim(),
      p_source_app: sourceApp || null,
    });

    if (error) {
      console.error('Link referral error:', error);
      return NextResponse.json(
        { error: 'LINK_ERROR', message: '链接推荐码失败' },
        { status: 500 }
      );
    }

    const result = (data as LinkReferralResult[])?.[0];
    if (!result) {
      return NextResponse.json(
        { error: 'LINK_ERROR', message: '链接推荐码失败' },
        { status: 500 }
      );
    }

    if (!result.success) {
      return NextResponse.json(
        {
          error: 'LINK_FAILED',
          message: result.error_message || '链接推荐码失败',
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '推荐码已绑定',
      referrerId: result.referrer_id,
    });
  } catch (error) {
    console.error('Referral link API error:', error);
    return NextResponse.json({ error: 'SERVER_ERROR', message: '服务器错误' }, { status: 500 });
  }
}
