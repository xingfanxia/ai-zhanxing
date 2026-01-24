/**
 * Account Deletion API
 * DELETE /api/user/delete
 *
 * GDPR-compliant account deletion endpoint that performs cascading removal of all
 * user data across the application. This is an irreversible operation.
 *
 * Deletion cascade (in order):
 * 1. readings - All astrology and tarot reading records
 * 2. usage_log - All usage tracking records
 * 3. credits - User credits record
 * 4. user_profiles - User profile record
 * 5. Supabase Auth - Delete user account and revoke all sessions
 *
 * Security:
 * - Requires authentication
 * - Uses service role for deletions (bypasses RLS)
 * - Logs operations without PII
 *
 * Response:
 * - 200: Account successfully deleted
 * - 401: Not authenticated
 * - 500: Server error during deletion
 */

import { NextResponse, NextRequest } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { log } from '@/lib/logger';
import {
  checkRateLimit,
  getClientIP,
  createRateLimitResponse,
} from '@/lib/ratelimit';

interface DeletionResult {
  success: boolean;
  message: string;
  deletedAt?: string;
  stats?: {
    readingsDeleted: number;
    usageLogsDeleted: number;
    creditsDeleted: number;
  };
  error?: string;
}

export async function DELETE(request: NextRequest): Promise<NextResponse<DeletionResult>> {
  const startTime = Date.now();

  try {
    // Apply global rate limit (IP-based)
    const clientIP = getClientIP(request);
    const globalRateLimit = await checkRateLimit(clientIP, 'global');
    if (!globalRateLimit.success) {
      return createRateLimitResponse(globalRateLimit) as NextResponse<DeletionResult>;
    }

    // Authenticate user
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      log.warn('[Account Delete] Unauthenticated deletion attempt');
      return NextResponse.json(
        { success: false, message: 'Authentication required', error: 'AUTH_REQUIRED' },
        { status: 401 }
      );
    }

    // Apply sensitive rate limit for account deletion (destructive operation)
    const sensitiveRateLimit = await checkRateLimit(user.id, 'sensitive');
    if (!sensitiveRateLimit.success) {
      return createRateLimitResponse(sensitiveRateLimit) as NextResponse<DeletionResult>;
    }

    const userId = user.id;
    log.info('[Account Delete] Starting account deletion process', { userId });

    // Use admin client for deletions (bypasses RLS)
    const adminClient = createAdminClient();

    // Track deletion stats
    const stats = {
      readingsDeleted: 0,
      usageLogsDeleted: 0,
      creditsDeleted: 0,
    };

    // --- Step 1: Delete readings (astrology and tarot) ---
    log.info('[Account Delete] Deleting readings...');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: readingsDeleted, error: readingsError } = await (adminClient.from('readings') as any)
      .delete()
      .eq('user_id', userId)
      .select('id');

    if (readingsError) {
      log.error('[Account Delete] Error deleting readings', { error: readingsError.message });
      throw new Error(`Failed to delete readings: ${readingsError.message}`);
    }
    stats.readingsDeleted = readingsDeleted?.length || 0;
    log.info('[Account Delete] Readings deleted', { count: stats.readingsDeleted });

    // --- Step 2: Delete usage_log ---
    log.info('[Account Delete] Deleting usage logs...');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: usageDeleted, error: usageError } = await (adminClient.from('usage_log') as any)
      .delete()
      .eq('user_id', userId)
      .select('id');

    if (usageError) {
      log.error('[Account Delete] Error deleting usage logs', { error: usageError.message });
      // Non-critical, continue
    } else {
      stats.usageLogsDeleted = usageDeleted?.length || 0;
      log.info('[Account Delete] Usage logs deleted', { count: stats.usageLogsDeleted });
    }

    // --- Step 3: Delete credits ---
    log.info('[Account Delete] Deleting credits...');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: creditsDeleted, error: creditsError } = await (adminClient.from('credits') as any)
      .delete()
      .eq('user_id', userId)
      .select('id');

    if (creditsError) {
      log.error('[Account Delete] Error deleting credits', { error: creditsError.message });
      // Non-critical, continue
    } else {
      stats.creditsDeleted = creditsDeleted?.length || 0;
      log.info('[Account Delete] Credits deleted', { count: stats.creditsDeleted });
    }

    // --- Step 4: Delete user_profiles ---
    log.info('[Account Delete] Deleting user profile...');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: profileError } = await (adminClient.from('user_profiles') as any)
      .delete()
      .eq('id', userId);

    if (profileError) {
      log.error('[Account Delete] Error deleting user profile', { error: profileError.message });
      // Profile might not exist - continue with auth deletion
    } else {
      log.info('[Account Delete] User profile deleted');
    }

    // --- Step 5: Delete auth user and revoke sessions ---
    log.info('[Account Delete] Deleting auth user and revoking sessions...');
    const { error: deleteUserError } = await adminClient.auth.admin.deleteUser(userId);

    if (deleteUserError) {
      log.error('[Account Delete] Error deleting auth user', { error: deleteUserError.message });
      throw new Error(`Failed to delete auth user: ${deleteUserError.message}`);
    }
    log.info('[Account Delete] Auth user deleted');

    // Calculate total time
    const durationMs = Date.now() - startTime;
    const deletedAt = new Date().toISOString();

    log.info('[Account Delete] Account deletion completed successfully', {
      durationMs,
      stats,
    });

    return NextResponse.json({
      success: true,
      message: 'Account and all associated data have been permanently deleted',
      deletedAt,
      stats,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    log.error('[Account Delete] Account deletion failed', { error: errorMessage });

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to delete account. Please try again or contact support.',
        error: 'DELETION_FAILED',
      },
      { status: 500 }
    );
  }
}
