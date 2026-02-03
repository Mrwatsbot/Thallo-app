-- ============================================================
-- Category Rules Migration
-- Auto-categorization based on payee patterns
-- ============================================================

-- Create category_rules table
CREATE TABLE IF NOT EXISTS category_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  payee_pattern TEXT NOT NULL,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  match_type TEXT NOT NULL DEFAULT 'contains' CHECK (match_type IN ('exact', 'contains')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE category_rules ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any (safe to re-run)
DROP POLICY IF EXISTS "Users can view their own category rules" ON category_rules;
DROP POLICY IF EXISTS "Users can create their own category rules" ON category_rules;
DROP POLICY IF EXISTS "Users can update their own category rules" ON category_rules;
DROP POLICY IF EXISTS "Users can delete their own category rules" ON category_rules;

-- Create RLS policies
CREATE POLICY "Users can view their own category rules"
  ON category_rules FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own category rules"
  ON category_rules FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own category rules"
  ON category_rules FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own category rules"
  ON category_rules FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_category_rules_user_id ON category_rules(user_id);
CREATE INDEX IF NOT EXISTS idx_category_rules_payee_pattern ON category_rules(payee_pattern);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_category_rules_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS trigger_category_rules_updated_at ON category_rules;
CREATE TRIGGER trigger_category_rules_updated_at
  BEFORE UPDATE ON category_rules
  FOR EACH ROW
  EXECUTE FUNCTION update_category_rules_updated_at();
