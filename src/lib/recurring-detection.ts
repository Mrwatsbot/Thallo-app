/**
 * Recurring Transaction Detection
 * 
 * Analyzes transaction history to automatically detect recurring charges
 * (subscriptions, rent, utilities, etc.) without any user setup.
 */

export interface Transaction {
  id: string;
  payee_clean: string | null;
  payee_original: string | null;
  amount: number;
  date: string;
  category_id: string | null;
}

export interface RecurringCharge {
  payee: string;
  amount: number;
  frequency: 'monthly' | 'biweekly' | 'weekly';
  category: string | null;
  lastDate: string;
  nextExpectedDate: string;
  transactionCount: number;
  categoryIcon?: string;
  categoryColor?: string;
}

interface CategoryInfo {
  id: string;
  name: string;
  icon: string;
  color: string;
}

/**
 * Detect recurring charges from transaction history
 */
export function detectRecurringCharges(
  transactions: Transaction[],
  categories: CategoryInfo[]
): RecurringCharge[] {
  // Group transactions by payee
  const transactionsByPayee = groupTransactionsByPayee(transactions);
  
  const recurring: RecurringCharge[] = [];

  for (const [payee, payeeTransactions] of Object.entries(transactionsByPayee)) {
    // Need at least 2 transactions to detect a pattern
    if (payeeTransactions.length < 2) continue;

    // Sort by date (oldest first)
    const sorted = payeeTransactions.sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Check if amounts are similar (within 10% variance)
    if (!areAmountsSimilar(sorted)) continue;

    // Check if dates show regular intervals
    const frequency = detectFrequency(sorted);
    if (!frequency) continue;

    // Calculate average amount
    const avgAmount = sorted.reduce((sum, t) => sum + Math.abs(t.amount), 0) / sorted.length;

    // Get most recent transaction
    const lastTx = sorted[sorted.length - 1];
    const lastDate = lastTx.date;

    // Calculate next expected date
    const nextExpectedDate = calculateNextDate(lastDate, frequency);

    // Get category info
    const categoryId = getMostCommonCategory(sorted);
    const categoryInfo = categories.find(c => c.id === categoryId);

    recurring.push({
      payee,
      amount: avgAmount,
      frequency,
      category: categoryInfo?.name || null,
      lastDate,
      nextExpectedDate,
      transactionCount: sorted.length,
      categoryIcon: categoryInfo?.icon,
      categoryColor: categoryInfo?.color,
    });
  }

  // Sort by amount (descending) - show biggest charges first
  return recurring.sort((a, b) => b.amount - a.amount);
}

/**
 * Group transactions by normalized payee name
 */
function groupTransactionsByPayee(transactions: Transaction[]): Record<string, Transaction[]> {
  const groups: Record<string, Transaction[]> = {};

  for (const tx of transactions) {
    const payee = normalizePayee(tx.payee_clean || tx.payee_original || 'Unknown');
    if (!groups[payee]) {
      groups[payee] = [];
    }
    groups[payee].push(tx);
  }

  return groups;
}

/**
 * Normalize payee name for grouping
 * (e.g., "NETFLIX.COM" and "Netflix" → "netflix")
 */
function normalizePayee(payee: string): string {
  return payee
    .toLowerCase()
    .replace(/\.(com|net|org|io)$/i, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Check if transaction amounts are similar (within 10% variance)
 */
function areAmountsSimilar(transactions: Transaction[]): boolean {
  const amounts = transactions.map(t => Math.abs(t.amount));
  const avg = amounts.reduce((sum, amt) => sum + amt, 0) / amounts.length;
  
  // All amounts must be within 10% of average
  return amounts.every(amt => {
    const variance = Math.abs(amt - avg) / avg;
    return variance <= 0.1; // 10% tolerance
  });
}

/**
 * Detect frequency from transaction intervals
 */
function detectFrequency(transactions: Transaction[]): 'monthly' | 'biweekly' | 'weekly' | null {
  if (transactions.length < 2) return null;

  const intervals: number[] = [];
  
  for (let i = 1; i < transactions.length; i++) {
    const prev = new Date(transactions[i - 1].date);
    const curr = new Date(transactions[i].date);
    const daysDiff = Math.round((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
    intervals.push(daysDiff);
  }

  const avgInterval = intervals.reduce((sum, val) => sum + val, 0) / intervals.length;

  // Check if intervals are consistent (within 5 days)
  const isConsistent = intervals.every(interval => Math.abs(interval - avgInterval) <= 5);
  
  if (!isConsistent) return null;

  // Classify frequency
  if (avgInterval >= 25 && avgInterval <= 35) return 'monthly';
  if (avgInterval >= 12 && avgInterval <= 16) return 'biweekly';
  if (avgInterval >= 5 && avgInterval <= 9) return 'weekly';

  return null;
}

/**
 * Calculate next expected date based on frequency
 */
function calculateNextDate(lastDate: string, frequency: 'monthly' | 'biweekly' | 'weekly'): string {
  const date = new Date(lastDate + 'T00:00:00');
  
  switch (frequency) {
    case 'monthly':
      date.setMonth(date.getMonth() + 1);
      break;
    case 'biweekly':
      date.setDate(date.getDate() + 14);
      break;
    case 'weekly':
      date.setDate(date.getDate() + 7);
      break;
  }

  return date.toISOString().split('T')[0];
}

/**
 * Get the most common category ID from transactions
 */
function getMostCommonCategory(transactions: Transaction[]): string | null {
  const categoryCounts: Record<string, number> = {};
  
  for (const tx of transactions) {
    if (tx.category_id) {
      categoryCounts[tx.category_id] = (categoryCounts[tx.category_id] || 0) + 1;
    }
  }

  let maxCount = 0;
  let mostCommon: string | null = null;

  for (const [categoryId, count] of Object.entries(categoryCounts)) {
    if (count > maxCount) {
      maxCount = count;
      mostCommon = categoryId;
    }
  }

  return mostCommon;
}

/**
 * Calculate total monthly equivalent for all recurring charges
 */
export function calculateMonthlyTotal(charges: RecurringCharge[]): number {
  return charges.reduce((total, charge) => {
    let monthlyAmount = charge.amount;
    
    // Convert to monthly equivalent
    if (charge.frequency === 'weekly') {
      monthlyAmount = charge.amount * 4.33; // ~4.33 weeks per month
    } else if (charge.frequency === 'biweekly') {
      monthlyAmount = charge.amount * 2.17; // ~2.17 biweekly periods per month
    }
    
    return total + monthlyAmount;
  }, 0);
}
