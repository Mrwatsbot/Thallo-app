'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Calendar, DollarSign, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  getPaychecksInMonth, 
  getPerPaycheckAmount, 
  formatPayDate,
  type PayFrequency 
} from '@/lib/paycheck-helpers';

interface PaycheckPlannerProps {
  payFrequency: PayFrequency;
  nextPayDate: string;
  monthlyIncome: number;
  categoryBudgets: Array<{
    categoryName: string;
    budgeted: number;
    categoryColor: string | null;
  }>;
}

export function PaycheckPlanner({
  payFrequency,
  nextPayDate,
  monthlyIncome,
  categoryBudgets,
}: PaycheckPlannerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed || payFrequency === 'monthly' || !nextPayDate) {
    return null;
  }

  const paychecksThisMonth = getPaychecksInMonth(nextPayDate, payFrequency);
  const perPaycheckAmount = getPerPaycheckAmount(monthlyIncome, payFrequency);
  const nextPay = new Date(nextPayDate);
  const now = new Date();
  
  // Only show if next pay date is in the future
  if (nextPay < now) {
    return null;
  }

  // Simple heuristic: divide budgets evenly across paychecks for now
  // In a more advanced version, you could let users assign specific budgets to specific paychecks
  const totalBudgeted = categoryBudgets.reduce((sum, b) => sum + b.budgeted, 0);
  const budgetsThisPaycheck = categoryBudgets.filter(b => b.budgeted > 0);

  return (
    <div className="glass-card rounded-xl border border-[#3D6B5233] bg-[#3D6B520a] overflow-hidden">
      {/* Header - Always visible */}
      <div className="p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-[#3D6B5220] flex items-center justify-center shrink-0">
            <Calendar className="h-5 w-5 text-[#3D6B52]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2 flex-wrap">
              <h3 className="text-sm font-semibold text-foreground">Next Paycheck</h3>
              <span className="text-xs text-muted-foreground">
                {formatPayDate(nextPay)}
              </span>
              {paychecksThisMonth > 2 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#7aba5c20] text-[#7aba5c] font-medium">
                  {paychecksThisMonth} paychecks this month
                </span>
              )}
            </div>
            <p className="text-xl font-display font-bold text-[#3D6B52] tabular-nums">
              ${perPaycheckAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-1 shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 px-2"
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsDismissed(true)}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-[#3D6B5220] pt-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Your budgets this month:</span>
            <span className="font-semibold tabular-nums">
              ${totalBudgeted.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Per paycheck ({paychecksThisMonth} {paychecksThisMonth === 1 ? 'check' : 'checks'}):
            </span>
            <span className="font-semibold tabular-nums">
              ${(totalBudgeted / paychecksThisMonth).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>

          {budgetsThisPaycheck.length > 0 && (
            <>
              <div className="pt-2 border-t border-border/30">
                <p className="text-xs font-medium text-muted-foreground mb-2">
                  Budget categories ({budgetsThisPaycheck.length}):
                </p>
                <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                  {budgetsThisPaycheck.slice(0, 8).map((budget, idx) => (
                    <div 
                      key={idx}
                      className="flex items-center gap-2 text-xs"
                    >
                      <div 
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: budget.categoryColor || '#3D6B52' }}
                      />
                      <span className="truncate text-muted-foreground">
                        {budget.categoryName}
                      </span>
                      <span className="ml-auto tabular-nums text-foreground font-medium shrink-0">
                        ${budget.budgeted.toFixed(0)}
                      </span>
                    </div>
                  ))}
                  {budgetsThisPaycheck.length > 8 && (
                    <p className="text-xs text-muted-foreground italic col-span-2">
                      +{budgetsThisPaycheck.length - 8} more...
                    </p>
                  )}
                </div>
              </div>
            </>
          )}

          <div className="pt-2 text-xs text-muted-foreground border-t border-border/30">
            💡 Tip: This shows how to split your monthly budget across paychecks. 
            Your budgets stay monthly — this is just a helper view.
          </div>
        </div>
      )}
    </div>
  );
}
