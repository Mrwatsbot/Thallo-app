'use client';

import { useState } from 'react';
import { CubeNavigator } from '@/components/ui/cube-navigator';
import { IncomeOverview } from '@/components/budgets/income-overview';
import { AIInsightsPanel } from '@/components/budgets/ai-insights-panel';
import { BudgetHealthChart } from '@/components/budgets/budget-health-chart';
import { DemoBudgetGrid } from '@/components/budgets/demo-budget-grid';
import { 
  Wallet, TrendingDown, CreditCard, Sparkles,
  Search, Zap, FileText, MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// Mock income
const MONTHLY_INCOME = 4500;

// Mock AI insights
const mockInsights = [
  { 
    id: '1', 
    type: 'warning' as const, 
    icon: 'trending' as const, 
    text: 'Shopping spending is up 34% compared to last month.',
    action: 'View breakdown'
  },
  { 
    id: '2', 
    type: 'tip' as const, 
    icon: 'calendar' as const, 
    text: "At your current pace, you'll hit your Food budget in ~6 days.",
    action: 'Adjust budget'
  },
  { 
    id: '3', 
    type: 'opportunity' as const, 
    icon: 'scissors' as const, 
    text: 'Found 3 subscriptions you might want to review ($47/mo).',
    action: 'Review subscriptions'
  },
];

// Mock budgets
const initialBudgets = [
  { categoryId: '1', categoryName: 'Food & Dining', categoryIcon: 'utensils', categoryColor: '#f97316', budgeted: 500, spent: 342.50 },
  { categoryId: '2', categoryName: 'Transportation', categoryIcon: 'car', categoryColor: '#3b82f6', budgeted: 200, spent: 156.00 },
  { categoryId: '3', categoryName: 'Shopping', categoryIcon: 'shopping-bag', categoryColor: '#a855f7', budgeted: 300, spent: 425.99 },
  { categoryId: '4', categoryName: 'Entertainment', categoryIcon: 'film', categoryColor: '#ec4899', budgeted: 150, spent: 89.00 },
  { categoryId: '5', categoryName: 'Utilities', categoryIcon: 'zap', categoryColor: '#eab308', budgeted: 250, spent: 187.32 },
  { categoryId: '6', categoryName: 'Health', categoryIcon: 'heart-pulse', categoryColor: '#22c55e', budgeted: 0, spent: 45.00 },
  { categoryId: '7', categoryName: 'Subscriptions', categoryIcon: 'repeat', categoryColor: '#06b6d4', budgeted: 0, spent: 62.97 },
  { categoryId: '8', categoryName: 'Personal Care', categoryIcon: 'sparkles', categoryColor: '#f43f5e', budgeted: 0, spent: 0 },
];

// Mock debts
const mockDebts = [
  { id: '1', name: 'Chase Sapphire', type: 'Credit Card', balance: 2847.32, apr: 24.99, minPayment: 85, color: '#3b82f6' },
  { id: '2', name: 'Student Loan', type: 'Loan', balance: 12450.00, apr: 5.5, minPayment: 250, color: '#22c55e' },
  { id: '3', name: 'Car Payment', type: 'Auto Loan', balance: 8920.00, apr: 6.9, minPayment: 320, color: '#f97316' },
];

export default function DemoPage() {
  const [budgets, setBudgets] = useState(initialBudgets);

  const handleBudgetUpdate = (categoryId: string, newAmount: number) => {
    setBudgets(prev => prev.map(b => 
      b.categoryId === categoryId ? { ...b, budgeted: newAmount } : b
    ));
  };

  const totalBudgeted = budgets.reduce((sum, b) => sum + b.budgeted, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const totalDebt = mockDebts.reduce((sum, d) => sum + d.balance, 0);

  // Face 1: Overview
  const OverviewFace = (
    <div className="space-y-6">
      <div className="text-center mb-2">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Your financial overview</p>
      </div>
      
      <IncomeOverview 
        monthlyIncome={MONTHLY_INCOME}
        totalSpent={totalSpent}
        totalBudgeted={totalBudgeted}
      />
      
      <AIInsightsPanel 
        insights={mockInsights}
        onAnalyze={() => console.log('Analyzing...')}
        onFindSavings={() => console.log('Finding savings...')}
      />
    </div>
  );

  // Face 2: Budgets
  const BudgetsFace = (
    <div className="space-y-6">
      <div className="text-center mb-2">
        <h1 className="text-2xl font-bold">Budgets</h1>
        <p className="text-muted-foreground">Track your spending by category</p>
      </div>
      
      <BudgetHealthChart categoryBudgets={budgets} />
      
      <DemoBudgetGrid 
        categoryBudgets={budgets} 
        onBudgetUpdate={handleBudgetUpdate}
      />
    </div>
  );

  // Face 3: Debts
  const DebtsFace = (
    <div className="space-y-6">
      <div className="text-center mb-2">
        <h1 className="text-2xl font-bold">Debts</h1>
        <p className="text-muted-foreground">Track and crush your debt</p>
      </div>

      {/* Total Debt Card */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Debt</p>
              <p className="text-2xl font-bold text-red-400">${totalDebt.toLocaleString()}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Debt-free in</p>
            <p className="text-xl font-bold text-green-400">~18 months</p>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Payoff progress</span>
            <span>32%</span>
          </div>
          <div className="h-2 rounded-full bg-secondary overflow-hidden">
            <div className="h-full w-[32%] rounded-full bg-gradient-to-r from-green-500 to-green-400" />
          </div>
        </div>
      </div>

      {/* Debt List */}
      <div className="space-y-3">
        {mockDebts.map((debt) => (
          <div key={debt.id} className="glass-card rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${debt.color}20` }}
                >
                  <CreditCard className="w-5 h-5" style={{ color: debt.color }} />
                </div>
                <div>
                  <h3 className="font-medium">{debt.name}</h3>
                  <p className="text-xs text-muted-foreground">{debt.type} • {debt.apr}% APR</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold">${debt.balance.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">${debt.minPayment}/mo min</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full border-border">
              View Payoff Plan
            </Button>
          </div>
        ))}
      </div>

      {/* Strategy Toggle */}
      <div className="glass-card rounded-xl p-4">
        <p className="text-sm font-medium mb-3">Payoff Strategy</p>
        <div className="flex gap-2">
          <Button variant="default" size="sm" className="flex-1 gradient-btn border-0 text-white">
            Avalanche (Save $)
          </Button>
          <Button variant="outline" size="sm" className="flex-1 border-border">
            Snowball (Wins)
          </Button>
        </div>
      </div>
    </div>
  );

  // Face 4: AI Actions
  const ActionsFace = (
    <div className="space-y-6">
      <div className="text-center mb-2">
        <h1 className="text-2xl font-bold">AI Actions</h1>
        <p className="text-muted-foreground">Let AI work for your wallet</p>
      </div>

      {/* Action Cards */}
      <div className="grid gap-4">
        <div className="glass-card rounded-xl p-6 hover:border-purple-500/30 transition-colors cursor-pointer">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-purple-500/30 flex items-center justify-center flex-shrink-0">
              <Search className="w-6 h-6 text-purple-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Analyze Spending</h3>
              <p className="text-sm text-muted-foreground mb-3">AI reviews your transactions and identifies patterns, anomalies, and opportunities.</p>
              <Button className="gradient-btn border-0 text-white">Run Analysis</Button>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-xl p-6 hover:border-purple-500/30 transition-colors cursor-pointer">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 flex items-center justify-center flex-shrink-0">
              <Zap className="w-6 h-6 text-green-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Find Savings</h3>
              <p className="text-sm text-muted-foreground mb-3">Discover subscriptions you forgot about, duplicate charges, and potential negotiation targets.</p>
              <Button variant="outline" className="border-green-500/30 text-green-400 hover:bg-green-500/10">Scan Now</Button>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-xl p-6 hover:border-purple-500/30 transition-colors cursor-pointer">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
              <FileText className="w-6 h-6 text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Analyze a Bill</h3>
              <p className="text-sm text-muted-foreground mb-3">Upload or select a recurring bill. AI researches competitors and drafts a negotiation script.</p>
              <Button variant="outline" className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10">Select Bill</Button>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-xl p-6 hover:border-purple-500/30 transition-colors cursor-pointer">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-500/20 border border-orange-500/30 flex items-center justify-center flex-shrink-0">
              <MessageSquare className="w-6 h-6 text-orange-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Ask Budget Pro</h3>
              <p className="text-sm text-muted-foreground mb-3">Chat with your AI budget professional about anything money-related.</p>
              <Button variant="outline" className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10">Start Chat</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const faces = [
    { id: 'overview', label: 'Overview', content: OverviewFace },
    { id: 'budgets', label: 'Budgets', content: BudgetsFace },
    { id: 'debts', label: 'Debts', content: DebtsFace },
    { id: 'actions', label: 'AI Actions', content: ActionsFace },
  ];

  return (
    <div className="bg-background" style={{ minHeight: '100dvh' }}>
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
        <div className="flex h-14 items-center justify-between px-4 max-w-6xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-btn flex items-center justify-center">
              <Wallet className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold">BudgetWise</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2 py-1 rounded-full bg-purple-500/20 text-purple-400">Demo Mode</span>
          </div>
        </div>
      </header>

      {/* Cube Navigator */}
      <CubeNavigator faces={faces} />
    </div>
  );
}
