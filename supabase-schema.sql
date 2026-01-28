-- =============================================
-- BUDGET APP DATABASE SCHEMA
-- Run this in Supabase SQL Editor
-- =============================================

-- Enable UUID extension (usually already enabled)
create extension if not exists "uuid-ossp";

-- =============================================
-- PROFILES TABLE (extends Supabase Auth)
-- =============================================
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  avatar_url text,
  subscription_tier text default 'free' check (subscription_tier in ('free', 'basic', 'plus', 'pro')),
  subscription_status text default 'active' check (subscription_status in ('active', 'canceled', 'past_due')),
  stripe_customer_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Profiles policies
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Function to create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create profile on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =============================================
-- ACCOUNTS TABLE
-- =============================================
create table public.accounts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  name text not null,
  type text not null check (type in ('checking', 'savings', 'credit_card', 'cash', 'investment')),
  balance decimal(12,2) default 0,
  currency text default 'USD',
  is_active boolean default true,
  plaid_account_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.accounts enable row level security;

-- Accounts policies
create policy "Users can view own accounts"
  on public.accounts for select
  using (auth.uid() = user_id);

create policy "Users can insert own accounts"
  on public.accounts for insert
  with check (auth.uid() = user_id);

create policy "Users can update own accounts"
  on public.accounts for update
  using (auth.uid() = user_id);

create policy "Users can delete own accounts"
  on public.accounts for delete
  using (auth.uid() = user_id);

-- =============================================
-- CATEGORIES TABLE
-- =============================================
create table public.categories (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles on delete cascade,
  name text not null,
  icon text,
  color text,
  type text not null check (type in ('expense', 'income', 'transfer')),
  is_system boolean default false,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.categories enable row level security;

-- Categories policies (users can see system categories + their own)
create policy "Users can view system and own categories"
  on public.categories for select
  using (is_system = true or auth.uid() = user_id);

create policy "Users can insert own categories"
  on public.categories for insert
  with check (auth.uid() = user_id and is_system = false);

create policy "Users can update own categories"
  on public.categories for update
  using (auth.uid() = user_id and is_system = false);

create policy "Users can delete own categories"
  on public.categories for delete
  using (auth.uid() = user_id and is_system = false);

-- =============================================
-- TRANSACTIONS TABLE
-- =============================================
create table public.transactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  account_id uuid references public.accounts on delete cascade not null,
  category_id uuid references public.categories on delete set null,
  amount decimal(12,2) not null,
  payee_original text,
  payee_clean text,
  memo text,
  date date not null,
  is_cleared boolean default false,
  is_reconciled boolean default false,
  ai_categorized boolean default false,
  ai_confidence decimal(3,2),
  plaid_transaction_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.transactions enable row level security;

-- Transactions policies
create policy "Users can view own transactions"
  on public.transactions for select
  using (auth.uid() = user_id);

create policy "Users can insert own transactions"
  on public.transactions for insert
  with check (auth.uid() = user_id);

create policy "Users can update own transactions"
  on public.transactions for update
  using (auth.uid() = user_id);

create policy "Users can delete own transactions"
  on public.transactions for delete
  using (auth.uid() = user_id);

-- Index for faster queries
create index transactions_user_date on public.transactions(user_id, date desc);
create index transactions_user_category on public.transactions(user_id, category_id);

-- =============================================
-- BUDGETS TABLE
-- =============================================
create table public.budgets (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  category_id uuid references public.categories on delete cascade not null,
  month date not null,
  budgeted decimal(12,2) not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, category_id, month)
);

-- Enable RLS
alter table public.budgets enable row level security;

-- Budgets policies
create policy "Users can view own budgets"
  on public.budgets for select
  using (auth.uid() = user_id);

create policy "Users can insert own budgets"
  on public.budgets for insert
  with check (auth.uid() = user_id);

create policy "Users can update own budgets"
  on public.budgets for update
  using (auth.uid() = user_id);

create policy "Users can delete own budgets"
  on public.budgets for delete
  using (auth.uid() = user_id);

-- =============================================
-- PAYEE RULES TABLE
-- =============================================
create table public.payee_rules (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  match_pattern text not null,
  match_type text default 'contains' check (match_type in ('contains', 'starts_with', 'exact')),
  rename_to text,
  category_id uuid references public.categories on delete set null,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.payee_rules enable row level security;

-- Payee rules policies
create policy "Users can view own payee rules"
  on public.payee_rules for select
  using (auth.uid() = user_id);

create policy "Users can insert own payee rules"
  on public.payee_rules for insert
  with check (auth.uid() = user_id);

create policy "Users can update own payee rules"
  on public.payee_rules for update
  using (auth.uid() = user_id);

create policy "Users can delete own payee rules"
  on public.payee_rules for delete
  using (auth.uid() = user_id);

-- =============================================
-- AI USAGE TABLE (for rate limiting)
-- =============================================
create table public.ai_usage (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  feature text not null,
  tokens_input int default 0,
  tokens_output int default 0,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.ai_usage enable row level security;

-- AI usage policies
create policy "Users can view own ai usage"
  on public.ai_usage for select
  using (auth.uid() = user_id);

create policy "Users can insert own ai usage"
  on public.ai_usage for insert
  with check (auth.uid() = user_id);

-- Index for efficient queries
create index ai_usage_user_date on public.ai_usage(user_id, created_at);

-- =============================================
-- DEFAULT CATEGORIES (System-wide)
-- =============================================
insert into public.categories (name, icon, color, type, is_system, sort_order) values
  -- Expenses
  ('Groceries', '🛒', '#22c55e', 'expense', true, 1),
  ('Dining Out', '🍔', '#f97316', 'expense', true, 2),
  ('Transportation', '🚗', '#3b82f6', 'expense', true, 3),
  ('Utilities', '💡', '#eab308', 'expense', true, 4),
  ('Housing', '🏠', '#8b5cf6', 'expense', true, 5),
  ('Healthcare', '🏥', '#ef4444', 'expense', true, 6),
  ('Entertainment', '🎬', '#ec4899', 'expense', true, 7),
  ('Shopping', '🛍️', '#14b8a6', 'expense', true, 8),
  ('Personal Care', '💅', '#f472b6', 'expense', true, 9),
  ('Education', '📚', '#6366f1', 'expense', true, 10),
  ('Subscriptions', '📱', '#a855f7', 'expense', true, 11),
  ('Insurance', '🛡️', '#64748b', 'expense', true, 12),
  ('Gifts', '🎁', '#f43f5e', 'expense', true, 13),
  ('Travel', '✈️', '#0ea5e9', 'expense', true, 14),
  ('Pets', '🐕', '#84cc16', 'expense', true, 15),
  ('Other Expense', '📦', '#94a3b8', 'expense', true, 99),
  -- Income
  ('Salary', '💰', '#22c55e', 'income', true, 1),
  ('Freelance', '💻', '#3b82f6', 'income', true, 2),
  ('Investment', '📈', '#8b5cf6', 'income', true, 3),
  ('Refund', '↩️', '#f97316', 'income', true, 4),
  ('Other Income', '💵', '#94a3b8', 'income', true, 99),
  -- Transfers
  ('Transfer', '↔️', '#64748b', 'transfer', true, 1);

-- =============================================
-- DONE!
-- =============================================
