import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { type EmailOtpType } from '@supabase/supabase-js';

// Helper to link referral
async function linkReferral(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  referralCode: string | null,
  sourceApp: string | null
) {
  if (!referralCode) return;
  try {
    await (supabase.rpc as any)('link_referral', {
      p_referred_user_id: userId,
      p_referral_code: referralCode.trim(),
      p_source_app: sourceApp || 'zhanxing',
    });
  } catch (error) {
    console.error('Failed to link referral:', error);
  }
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  const next = searchParams.get('next') ?? '/';
  const referralCode = searchParams.get('ref');
  const sourceApp = searchParams.get('source_app');

  const supabase = await createClient();

  // Handle OAuth code exchange
  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data.user) {
      await linkReferral(supabase, data.user.id, referralCode, sourceApp);
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Handle email confirmation (signup, email change, password recovery)
  if (token_hash && type) {
    const { data, error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });
    if (!error && data.user) {
      // Read referral from user metadata for email signups
      if (type === 'signup' || type === 'email') {
        const meta = data.user.user_metadata;
        await linkReferral(supabase, data.user.id, meta?.referral_code, meta?.source_app);
      }
      // For password recovery, always redirect to update-password page
      if (type === 'recovery') {
        return NextResponse.redirect(`${origin}/auth/update-password`);
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
