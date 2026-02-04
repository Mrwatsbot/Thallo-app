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

  const params = await searchParams;
  const isPreview = params.preview === '1';

  // Check if user has completed setup
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase.from as any;
  const [accountsRes, profileRes, budgetsRes] = await Promise.all([
    db('accounts').select('id').eq('user_id', user.id).limit(1),
    db('profiles').select('monthly_income').eq('id', user.id).single(),
    db('budgets').select('id').eq('user_id', user.id).limit(1),
  ]);

  const hasAccounts = accountsRes.data && accountsRes.data.length > 0;
  const hasIncome = profileRes.data && profileRes.data.monthly_income > 0;
  const hasBudgets = budgetsRes.data && budgetsRes.data.length > 0;

  // If setup is complete, redirect to dashboard (unless preview mode)
  if (hasAccounts && hasIncome && hasBudgets && !isPreview) {
    redirect('/dashboard');
  }

  return <SetupWizard userId={user.id} preview={isPreview} />;
}
