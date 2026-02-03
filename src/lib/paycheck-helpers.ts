/**
 * Paycheck calculation helpers for bi-weekly pay support
 */

export type PayFrequency = 'weekly' | 'biweekly' | 'semimonthly' | 'monthly';

/**
 * Calculate the number of paychecks in the current month
 */
export function getPaychecksInMonth(
  nextPayDate: string | null,
  payFrequency: PayFrequency,
  month?: Date
): number {
  if (!nextPayDate || payFrequency === 'monthly') return 1;
  if (payFrequency === 'semimonthly') return 2;

  const targetMonth = month || new Date();
  const monthStart = new Date(targetMonth.getFullYear(), targetMonth.getMonth(), 1);
  const monthEnd = new Date(targetMonth.getFullYear(), targetMonth.getMonth() + 1, 0);

  let count = 0;
  let payDate = new Date(nextPayDate);

  // Rewind to find all paydays in the month
  while (payDate > monthStart) {
    payDate = getPreviousPayDate(payDate, payFrequency);
  }

  // Count forward through the month
  while (payDate <= monthEnd) {
    if (payDate >= monthStart) {
      count++;
    }
    payDate = getNextPayDate(payDate, payFrequency);
  }

  return count;
}

/**
 * Get the next pay date from a given date
 */
export function getNextPayDate(fromDate: Date, payFrequency: PayFrequency): Date {
  const next = new Date(fromDate);
  
  switch (payFrequency) {
    case 'weekly':
      next.setDate(next.getDate() + 7);
      break;
    case 'biweekly':
      next.setDate(next.getDate() + 14);
      break;
    case 'semimonthly':
      // Typically 15th and end of month
      if (next.getDate() <= 15) {
        next.setDate(15);
      } else {
        next.setMonth(next.getMonth() + 1);
        next.setDate(1);
      }
      break;
    case 'monthly':
      next.setMonth(next.getMonth() + 1);
      break;
  }
  
  return next;
}

/**
 * Get the previous pay date from a given date
 */
export function getPreviousPayDate(fromDate: Date, payFrequency: PayFrequency): Date {
  const prev = new Date(fromDate);
  
  switch (payFrequency) {
    case 'weekly':
      prev.setDate(prev.getDate() - 7);
      break;
    case 'biweekly':
      prev.setDate(prev.getDate() - 14);
      break;
    case 'semimonthly':
      if (prev.getDate() > 15) {
        prev.setDate(15);
      } else {
        prev.setMonth(prev.getMonth() - 1);
        const lastDay = new Date(prev.getFullYear(), prev.getMonth() + 1, 0).getDate();
        prev.setDate(lastDay);
      }
      break;
    case 'monthly':
      prev.setMonth(prev.getMonth() - 1);
      break;
  }
  
  return prev;
}

/**
 * Calculate per-paycheck amount from monthly income
 */
export function getPerPaycheckAmount(
  monthlyIncome: number,
  payFrequency: PayFrequency
): number {
  switch (payFrequency) {
    case 'weekly':
      return (monthlyIncome * 12) / 52; // 52 weeks per year
    case 'biweekly':
      return (monthlyIncome * 12) / 26; // 26 biweekly periods per year
    case 'semimonthly':
      return monthlyIncome / 2; // 2 paychecks per month
    case 'monthly':
    default:
      return monthlyIncome;
  }
}

/**
 * Get a human-readable label for pay frequency
 */
export function getPayFrequencyLabel(payFrequency: PayFrequency): string {
  switch (payFrequency) {
    case 'weekly':
      return 'Weekly';
    case 'biweekly':
      return 'Bi-weekly';
    case 'semimonthly':
      return 'Semi-monthly';
    case 'monthly':
    default:
      return 'Monthly';
  }
}

/**
 * Format a date string for display
 */
export function formatPayDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
