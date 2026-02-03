-- Migration 006: Budget Rollover Feature
-- Add columns to track budget rollover amounts (YNAB-style)

-- Add rollover flag (default: true for all budgets)
ALTER TABLE budgets ADD COLUMN IF NOT EXISTS rollover BOOLEAN DEFAULT true;

-- Add rollover_amount to store calculated rollover from previous month
ALTER TABLE budgets ADD COLUMN IF NOT EXISTS rollover_amount NUMERIC(10, 2) DEFAULT 0;

-- Index for fast lookups when calculating rollover
CREATE INDEX IF NOT EXISTS idx_budgets_month_category ON budgets(month, category_id);

-- Comment
COMMENT ON COLUMN budgets.rollover IS 'Whether unspent funds should roll over to next month';
COMMENT ON COLUMN budgets.rollover_amount IS 'Amount rolled over from previous month (can be negative for overspending)';
