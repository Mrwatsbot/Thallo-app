import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { AppShell } from '@/components/layout/app-shell';
import { AddTransactionDialog } from '@/components/transactions/add-transaction-dialog';
import { TransactionList } from '@/components/transactions/transaction-list';

export default async function TransactionsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch categories
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, icon, type, color')
    .order('sort_order');

  // Fetch user's accounts
  const { data: accounts } = await supabase
    .from('accounts')
    .select('id, name, type')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .order('created_at');

  // Fetch transactions with category and account info
  const { data: transactions } = await supabase
    .from('transactions')
    .select(`
      id,
      amount,
      payee_clean,
      payee_original,
      date,
      memo,
      is_cleared,
      category:categories(id, name, icon, color),
      account:accounts(id, name)
    `)
    .eq('user_id', user.id)
    .order('date', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(100);

  const userProfile = {
    email: user.email,
    full_name: user.user_metadata?.full_name || user.email?.split('@')[0],
  };

  // If user has no accounts, they need to create one first
  const hasAccounts = accounts && accounts.length > 0;

  return (
    <AppShell user={userProfile}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Transactions</h1>
            <p className="text-muted-foreground">
              {transactions?.length || 0} transactions
            </p>
          </div>
          {hasAccounts ? (
            <AddTransactionDialog
              categories={categories || []}
              accounts={accounts || []}
              userId={user.id}
            />
          ) : (
            <p className="text-sm text-muted-foreground">
              Create an account first to add transactions
            </p>
          )}
        </div>

        {/* Transaction List */}
        <TransactionList 
          transactions={transactions || []} 
          showAccount={!!(accounts && accounts.length > 1)}
        />
      </div>
    </AppShell>
  );
}
