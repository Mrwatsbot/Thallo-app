-- Split Transactions Feature
-- Allows users to split a transaction across multiple categories

-- Add split transaction columns to transactions table
ALTER TABLE transactions
  ADD COLUMN parent_transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE,
  ADD COLUMN is_split BOOLEAN DEFAULT false;

-- Index for efficient child transaction lookups
CREATE INDEX idx_transactions_parent_id ON transactions(parent_transaction_id);

-- RLS policy: users can only access their own split children
-- (inherits user_id from parent, so existing policies already handle this)

-- Update existing RLS policies to ensure split children are accessible
-- The existing "Users can view own transactions" policy already covers this
-- since split children will have the same user_id as the parent
