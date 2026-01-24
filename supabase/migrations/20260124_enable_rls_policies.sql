-- Migration: Enable Row Level Security (RLS) policies for user data protection
-- Date: 2026-01-24
-- Description: Adds RLS policies to ensure users can only access their own data
--              This is critical for multi-tenant security in Supabase

-- ============================================================================
-- READINGS TABLE
-- Users can CRUD their own readings (astrology and tarot)
-- ============================================================================

ALTER TABLE readings ENABLE ROW LEVEL SECURITY;

-- Users can view their own readings
CREATE POLICY "Users can view own readings"
ON readings FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own readings
CREATE POLICY "Users can insert own readings"
ON readings FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own readings
CREATE POLICY "Users can update own readings"
ON readings FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own readings
CREATE POLICY "Users can delete own readings"
ON readings FOR DELETE
USING (auth.uid() = user_id);

-- ============================================================================
-- USER PROFILES TABLE
-- Users can only read and update their own profile
-- Profile creation is handled by trigger/service role on user signup
-- ============================================================================

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
ON user_profiles FOR SELECT
USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON user_profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Note: INSERT and DELETE are not allowed for regular users
-- Profile creation/deletion should be handled by service role or triggers

-- ============================================================================
-- CREDITS TABLE
-- Users can only read their own credits
-- Credit modifications are handled by RPC functions with service role
-- ============================================================================

ALTER TABLE credits ENABLE ROW LEVEL SECURITY;

-- Users can view their own credits
CREATE POLICY "Users can view own credits"
ON credits FOR SELECT
USING (auth.uid() = user_id);

-- Note: INSERT/UPDATE/DELETE for credits are handled by RPC functions
-- These functions run with service role and bypass RLS

-- ============================================================================
-- USAGE LOG TABLE
-- Users can only read their own usage logs
-- Inserts are done by the service role (API routes)
-- ============================================================================

ALTER TABLE usage_log ENABLE ROW LEVEL SECURITY;

-- Users can view their own usage logs
CREATE POLICY "Users can view own usage logs"
ON usage_log FOR SELECT
USING (auth.uid() = user_id);

-- Note: Only service role can insert usage logs (API routes)
-- No INSERT policy for regular users - this is intentional

-- ============================================================================
-- REFERRALS TABLE (if exists)
-- Users can view their own referral records
-- ============================================================================

-- Check if referrals table exists before creating policies
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'referrals') THEN
    EXECUTE 'ALTER TABLE referrals ENABLE ROW LEVEL SECURITY';

    -- Users can view referrals where they are the referrer or referred
    EXECUTE 'CREATE POLICY "Users can view own referrals" ON referrals FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referred_id)';
  END IF;
END $$;

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON POLICY "Users can view own readings" ON readings IS 'RLS: Users can only SELECT their own astrology and tarot readings';
COMMENT ON POLICY "Users can insert own readings" ON readings IS 'RLS: Users can only INSERT readings with their own user_id';
COMMENT ON POLICY "Users can update own readings" ON readings IS 'RLS: Users can only UPDATE their own readings';
COMMENT ON POLICY "Users can delete own readings" ON readings IS 'RLS: Users can only DELETE their own readings';
COMMENT ON POLICY "Users can view own profile" ON user_profiles IS 'RLS: Users can only SELECT their own profile';
COMMENT ON POLICY "Users can update own profile" ON user_profiles IS 'RLS: Users can only UPDATE their own profile';
COMMENT ON POLICY "Users can view own credits" ON credits IS 'RLS: Users can only SELECT their own credit balance';
COMMENT ON POLICY "Users can view own usage logs" ON usage_log IS 'RLS: Users can only SELECT their own usage history';
