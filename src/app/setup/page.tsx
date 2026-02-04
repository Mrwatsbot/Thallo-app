import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { SetupWizard } from './setup-wizard';

interface SetupPageProps {
  searchParams: Promise<{ preview?: string }>;
}

export default async function SetupPage({ searchParams }: SetupPageProps) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  let isPreview = false;
  try {
    const params = await searchParams;
    isPreview = params?.preview === '1';
  } catch {
    // searchParams may fail in some environments
  }

  // Check if user has completed setup
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase.from as any;

  let hasAccounts = false;
  let hasIncome = false;
  let hasBudgets = false;

  try {
    const [accountsRes, profileRes, budgetsRes] = await Promise.all([
      db('accounts').select('id').eq('user_id', user.id).limit(1),
      db('profiles').select('monthly_income').eq('id', user.id).maybeSingle(),
      db('budgets').select('id').eq('user_id', user.id).limit(1),
    ]);

    hasAccounts = !!(accountsRes.data && accountsRes.data.length > 0);
    hasIncome = !!(profileRes.data && profileRes.data.monthly_income > 0);
    hasBudgets = !!(budgetsRes.data && budgetsRes.data.length > 0);
  } catch {
    // If DB queries fail, just show the wizard
  }

  // If setup is complete, redirect to dashboard (unless preview mode)
  if (hasAccounts && hasIncome && hasBudgets && !isPreview) {
    redirect('/dashboard');
  }

  return <SetupWizard userId={user.id} preview={isPreview} />;
}
