'use client';

import { useEffect, useState } from 'react';
import { Repeat, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { getCategoryIcon } from '@/lib/category-icons';
import { formatDistanceToNow } from 'date-fns';
import type { RecurringCharge } from '@/lib/recurring-detection';

interface RecurringChargesData {
  recurring: RecurringCharge[];
  monthlyTotal: number;
  count: number;
}

const FREQUENCY_LABELS: Record<string, string> = {
  monthly: 'Monthly',
  biweekly: 'Bi-weekly',
  weekly: 'Weekly',
};

export function RecurringChargesWidget() {
  const [data, setData] = useState<RecurringChargesData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRecurringCharges();
  }, []);

  const fetchRecurringCharges = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const res = await fetch('/api/recurring');
      
      if (!res.ok) {
        throw new Error('Failed to fetch recurring charges');
      }

      const result = await res.json();
      setData(result);
    } catch (err) {
      console.error('Error fetching recurring charges:', err);
      setError('Failed to load recurring charges');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="glass-card rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Repeat className="h-5 w-5 text-[#3D6B52]" />
          <h3 className="font-semibold text-base">Recurring Charges</h3>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#3D6B52] border-t-transparent" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Repeat className="h-5 w-5 text-[#3D6B52]" />
          <h3 className="font-semibold text-base">Recurring Charges</h3>
        </div>
        <p className="text-center text-muted-foreground text-sm py-4">{error}</p>
      </div>
    );
  }

  if (!data || data.count === 0) {
    return (
      <div className="glass-card rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Repeat className="h-5 w-5 text-[#3D6B52]" />
          <h3 className="font-semibold text-base">Recurring Charges</h3>
        </div>
        <p className="text-center text-muted-foreground text-sm py-8">
          No recurring charges detected yet
        </p>
        <p className="text-center text-xs text-muted-foreground/70">
          Add more transactions to detect patterns
        </p>
      </div>
    );
  }

  const displayedCharges = showAll ? data.recurring : data.recurring.slice(0, 6);
  const hasMore = data.recurring.length > 6;

  return (
    <div className="glass-card rounded-xl p-5">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <Repeat className="h-5 w-5 text-[#3D6B52]" />
          <h3 className="font-semibold text-base">Recurring Charges</h3>
        </div>
        <p className="text-xs text-muted-foreground">
          {data.count} subscription{data.count !== 1 ? 's' : ''} • ${data.monthlyTotal.toFixed(2)}/month
        </p>
      </div>

      {/* Charges List */}
      <div className="space-y-3">
        {displayedCharges.map((charge, index) => {
          const Icon = getCategoryIcon(charge.categoryIcon || null, charge.category || undefined);
          const nextDate = new Date(charge.nextExpectedDate + 'T00:00:00');
          const isUpcoming = nextDate.getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000; // Within 7 days
          
          // Calculate monthly equivalent
          let monthlyAmount = charge.amount;
          if (charge.frequency === 'weekly') {
            monthlyAmount = charge.amount * 4.33;
          } else if (charge.frequency === 'biweekly') {
            monthlyAmount = charge.amount * 2.17;
          }

          return (
            <div 
              key={`${charge.payee}-${index}`}
              className="flex items-center justify-between gap-3 py-2 border-b border-border/30 last:border-0"
            >
              {/* Left: Icon + Name + Date */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div 
                  className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ 
                    backgroundColor: charge.categoryColor ? `${charge.categoryColor}1a` : '#3D6B521a',
                  }}
                >
                  <Icon 
                    className="h-4 w-4" 
                    style={{ 
                      color: charge.categoryColor || '#3D6B52',
                    }}
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">
                    {charge.payee}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span className={isUpcoming ? 'text-[#3D6B52] font-medium' : ''}>
                      {formatDistanceToNow(nextDate, { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Amount + Badge */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="text-right">
                  <div className="text-sm font-semibold text-[#3D6B52]">
                    ${monthlyAmount.toFixed(2)}
                  </div>
                  {charge.frequency !== 'monthly' && (
                    <div className="text-xs text-muted-foreground">
                      ${charge.amount.toFixed(2)} {charge.frequency}
                    </div>
                  )}
                </div>
                <div className="px-2 py-0.5 rounded-full bg-secondary/80 text-xs text-muted-foreground">
                  {FREQUENCY_LABELS[charge.frequency]}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Show More/Less Button */}
      {hasMore && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full mt-4 py-2 px-3 rounded-lg border border-border/50 text-sm text-muted-foreground hover:bg-secondary/50 transition-colors flex items-center justify-center gap-1"
        >
          {showAll ? (
            <>
              <ChevronUp className="h-4 w-4" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4" />
              Show All ({data.recurring.length - 6} more)
            </>
          )}
        </button>
      )}

      {/* Total Footer */}
      <div className="mt-4 pt-4 border-t border-border/50">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Monthly Total</span>
          <span className="font-semibold text-[#3D6B52] text-base">
            ${data.monthlyTotal.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
