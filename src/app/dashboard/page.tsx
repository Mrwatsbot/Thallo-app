'use client';

import { useUser } from '@/hooks/use-user';
import { useDashboard } from '@/hooks/use-dashboard';
import { useMediaQuery } from '@/hooks/use-media-query';
import { AppShell } from '@/components/layout/app-shell';
import { DashboardSkeleton } from '@/components/ui/page-skeleton';
import { W2Dashboard } from '@/components/dashboard/w2-dashboard';
import { CreatorDashboard } from '@/components/dashboard/creator-dashboard';
import { MobileApp } from '@/components/layout/mobile-app';

export default function DashboardPage() {
  const { userProfile, isLoading: userLoading } = useUser();
  const isMobile = useMediaQuery('(max-width: 1023px)');
  const {
    accounts,
    totalBalance,
    monthlyIncome,
    monthlyExpenses,
    recentTransactions,
    budgets,
    currentMonth,
    isLoading: dataLoading,
  } = useDashboard();

  const isLoading = userLoading || dataLoading;

  // Mobile: Show full mobile app with tab navigation + cube transitions
  if (isMobile && !userLoading && userProfile?.id) {
    return <MobileApp userProfile={userProfile} />;
  }

  if (isLoading || !accounts || totalBalance === undefined) {
    return (
      <AppShell user={{ email: '', full_name: '' }}>
        <DashboardSkeleton />
      </AppShell>
    );
  }

  // Determine which dashboard to show based on income_type
  const DashboardComponent = userProfile.income_type === 'creator' 
    ? CreatorDashboard 
    : W2Dashboard;

  // Map Profile to AppShell user format
  const appShellUser = {
    email: userProfile.email || undefined,
    full_name: userProfile.full_name || undefined,
  };

  return (
    <AppShell user={appShellUser}>
      <DashboardComponent
        userProfile={userProfile}
        accounts={accounts}
        totalBalance={totalBalance}
        monthlyIncome={monthlyIncome!}
        monthlyExpenses={monthlyExpenses!}
        recentTransactions={recentTransactions || []}
        budgets={budgets || []}
        currentMonth={currentMonth || ''}
      />
    </AppShell>
  );
}
