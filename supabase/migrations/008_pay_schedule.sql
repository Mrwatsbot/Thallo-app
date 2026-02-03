-- ============================================================
-- Pay Schedule Migration
-- Add pay frequency and next pay date to profiles
-- ============================================================

-- Add pay schedule columns to profiles table
ALTER TABLE profiles 
  ADD COLUMN IF NOT EXISTS pay_frequency TEXT DEFAULT 'monthly' 
    CHECK (pay_frequency IN ('weekly', 'biweekly', 'semimonthly', 'monthly')),
  ADD COLUMN IF NOT EXISTS next_pay_date DATE;

-- Create index for faster lookups on pay schedule fields
CREATE INDEX IF NOT EXISTS idx_profiles_pay_frequency ON profiles(pay_frequency);
