-- Add tos_accepted_at column to user_profiles table
-- This column stores when the user accepted the Terms of Service and Privacy Policy

-- Add the column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'user_profiles'
        AND column_name = 'tos_accepted_at'
    ) THEN
        ALTER TABLE user_profiles ADD COLUMN tos_accepted_at TIMESTAMPTZ;
        COMMENT ON COLUMN user_profiles.tos_accepted_at IS 'Timestamp when user accepted Terms of Service and Privacy Policy';
    END IF;
END $$;
