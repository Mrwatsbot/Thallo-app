'use client';

import { DemoBudgetCard } from './demo-budget-card';

interface CategoryBudget {
  categoryId: string;
  categoryName: string;
  categoryIcon: string | null;
  categoryColor: string | null;
  budgeted: number;
  spent: number;
}

interface DemoBudgetGridProps {
  categoryBudgets: CategoryBudget[];
  onBudgetUpdate: (categoryId: string, newAmount: number) => void;
}

export function DemoBudgetGrid({ categoryBudgets, onBudgetUpdate }: DemoBudgetGridProps) {
  // Separate budgeted and unbudgeted categories
  const budgetedCategories = categoryBudgets.filter(b => b.budgeted > 0);
  const unbudgetedCategories = categoryBudgets.filter(b => b.budgeted === 0);

  return (
    <div className="space-y-8">
      {/* Budgeted Categories */}
      {budgetedCategories.length > 0 && (
        <div>
          <h2 className="text-lg font-display font-semibold mb-4">Active Budgets</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {budgetedCategories.map((budget) => (
              <DemoBudgetCard
                key={budget.categoryId}
                {...budget}
                onUpdate={(amount) => onBudgetUpdate(budget.categoryId, amount)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Unbudgeted Categories */}
      {unbudgetedCategories.length > 0 && (
        <div>
          <h2 className="text-lg font-display font-semibold mb-4 text-muted-foreground">
            {budgetedCategories.length > 0 ? 'Add More Budgets' : 'Set Your First Budget'}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {unbudgetedCategories.map((budget) => (
              <DemoBudgetCard
                key={budget.categoryId}
                {...budget}
                onUpdate={(amount) => onBudgetUpdate(budget.categoryId, amount)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
