/**
 * GDPR Data Export API
 * GET /api/user/export
 *
 * Exports all user data for GDPR compliance (Article 20 - Right to Data Portability).
 * Requires authentication.
 * Rate limited to 10 requests per hour (sensitive tier).
 *
 * Optionally supports ?download=true for file download.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { log } from '@/lib/logger';
import { checkRateLimit, createRateLimitResponse } from '@/lib/ratelimit';

// Response type definitions for type safety
interface UserProfileExport {
  id: string;
  total_credits: number;
  tier: string;
  last_checkin_date: string | null;
  referral_code: string | null;
  successful_referrals: number | null;
  referred_by: string | null;
  created_at: string;
  updated_at: string;
}

interface ReadingExport {
  id: string;
  reading_type: string;
  input_data: unknown;
  result_data: unknown;
  title: string | null;
  created_at: string;
}

interface CreditsExport {
  id: string;
  credits: number;
  last_check_in: string | null;
  created_at: string;
  updated_at: string;
}

interface UsageLogExport {
  id: string;
  action: string;
  app: string;
  credits_before: number | null;
  credits_after: number | null;
  metadata: unknown;
  created_at: string;
}

interface GDPRExportResponse {
  exportDate: string;
  exportVersion: string;
  userId: string;
  userEmail: string | null;
  data: {
    profile: UserProfileExport | null;
    credits: CreditsExport | null;
    readings: ReadingExport[];
    usageLog: UsageLogExport[];
  };
  metadata: {
    totalReadings: number;
    astrologyReadings: number;
    tarotReadings: number;
    totalUsageLogs: number;
    dataRetentionNote: string;
  };
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'AUTH_REQUIRED', message: 'Authentication required to export data' },
        { status: 401 }
      );
    }

    // Check rate limit (sensitive tier - 10 requests per minute)
    const rateLimit = await checkRateLimit(user.id, 'sensitive');
    if (!rateLimit.success) {
      return createRateLimitResponse(rateLimit);
    }

    // Fetch all user data in parallel
    const [
      profileResult,
      creditsResult,
      readingsResult,
      usageLogResult,
    ] = await Promise.all([
      // User profile
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (supabase.from('user_profiles') as any)
        .select('*')
        .eq('id', user.id)
        .single(),

      // Credits
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (supabase.from('credits') as any)
        .select('*')
        .eq('user_id', user.id)
        .single(),

      // Readings (all types)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (supabase.from('readings') as any)
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false }),

      // Usage log
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (supabase.from('usage_log') as any)
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false }),
    ]);

    // Handle errors (profile/credits might not exist for new users)
    if (profileResult.error && profileResult.error.code !== 'PGRST116') {
      log.error('Failed to fetch user profile for export:', profileResult.error);
    }
    if (creditsResult.error && creditsResult.error.code !== 'PGRST116') {
      log.error('Failed to fetch credits for export:', creditsResult.error);
    }
    if (readingsResult.error) {
      log.error('Failed to fetch readings for export:', readingsResult.error);
      return NextResponse.json(
        { error: 'EXPORT_ERROR', message: 'Failed to export reading data' },
        { status: 500 }
      );
    }
    if (usageLogResult.error) {
      log.error('Failed to fetch usage log for export:', usageLogResult.error);
      return NextResponse.json(
        { error: 'EXPORT_ERROR', message: 'Failed to export usage log data' },
        { status: 500 }
      );
    }

    // Count reading types
    const readings = readingsResult.data || [];
    const astrologyCount = readings.filter((r: ReadingExport) => r.reading_type === 'astrology').length;
    const tarotCount = readings.filter((r: ReadingExport) => r.reading_type === 'tarot').length;

    // Build export response
    const exportData: GDPRExportResponse = {
      exportDate: new Date().toISOString(),
      exportVersion: '1.0.0',
      userId: user.id,
      userEmail: user.email || null,
      data: {
        profile: profileResult.data || null,
        credits: creditsResult.data || null,
        readings: readings,
        usageLog: usageLogResult.data || [],
      },
      metadata: {
        totalReadings: readings.length,
        astrologyReadings: astrologyCount,
        tarotReadings: tarotCount,
        totalUsageLogs: usageLogResult.data?.length || 0,
        dataRetentionNote: 'This export contains all data associated with your account. Under GDPR Article 20, you have the right to receive this data in a structured, commonly used, machine-readable format.',
      },
    };

    // Log the export action
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from('usage_log') as any).insert({
      user_id: user.id,
      action: 'gdpr_data_export',
      app: 'zhanxing',
      metadata: {
        export_date: exportData.exportDate,
        total_records: exportData.metadata.totalReadings + exportData.metadata.totalUsageLogs,
      },
    });

    // Check if download mode is requested
    const downloadMode = request.nextUrl.searchParams.get('download') === 'true';

    if (downloadMode) {
      // Return as downloadable JSON file
      const filename = `zhanxing-data-export-${new Date().toISOString().split('T')[0]}.json`;
      return new NextResponse(JSON.stringify(exportData, null, 2), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="${filename}"`,
          'X-RateLimit-Limit': String(rateLimit.limit),
          'X-RateLimit-Remaining': String(rateLimit.remaining),
          'X-RateLimit-Reset': String(rateLimit.reset),
        },
      });
    }

    // Return as regular JSON response
    return NextResponse.json(exportData, {
      status: 200,
      headers: {
        'X-RateLimit-Limit': String(rateLimit.limit),
        'X-RateLimit-Remaining': String(rateLimit.remaining),
        'X-RateLimit-Reset': String(rateLimit.reset),
      },
    });
  } catch (error) {
    log.error('GDPR export API error:', error);
    return NextResponse.json(
      { error: 'SERVER_ERROR', message: 'Server error during data export' },
      { status: 500 }
    );
  }
}
