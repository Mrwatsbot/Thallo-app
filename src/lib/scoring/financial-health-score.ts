/**
 * Financial Health Score™
 * 
 * A score that measures YOUR financial health, not how profitable you are to banks.
 * Scale: 0-1000 (unlike FICO's 300-850)
 * 
 * Key difference from FICO:
 * - Rewards paying OFF debt, not having more credit lines
 * - Rewards savings, not borrowing capacity  
 * - Measures financial responsibility, not lender profitability
 */

export interface ScoreInput {
  // Income & Savings
  monthlyIncome: number;
  monthlySavings: number;          // Amount saved this month
  totalSavings: number;            // Total in savings accounts
  
  // Expenses
  monthlyExpenses: number;         // Average monthly expenses
  
  // Debt
  totalDebt: number;               // Current total debt
  debtThreeMonthsAgo: number;      // Total debt 3 months ago (for velocity)
  
  // Bills & Payments
  billsPaidOnTime: number;         // Bills paid on time (last 12 months)
  totalBills: number;              // Total bills (last 12 months)
  
  // Budgets
  budgetsOnTrack: number;          // Budgets currently within limit
  totalBudgets: number;            // Total active budgets
}

export interface ScoreBreakdown {
  paymentConsistency: {
    score: number;
    maxScore: 250;
    percentage: number;
    detail: string;
  };
  savingsRate: {
    score: number;
    maxScore: 200;
    rate: number;
    detail: string;
  };
  debtVelocity: {
    score: number;
    maxScore: 200;
    trend: 'decreasing' | 'stable' | 'increasing' | 'no-debt';
    changePercent: number;
    detail: string;
  };
  emergencyBuffer: {
    score: number;
    maxScore: 150;
    monthsCovered: number;
    detail: string;
  };
  budgetDiscipline: {
    score: number;
    maxScore: 100;
    percentage: number;
    detail: string;
  };
  debtToIncome: {
    score: number;
    maxScore: 100;
    ratio: number;
    detail: string;
  };
}

export interface FinancialHealthScore {
  total: number;
  maxTotal: 1000;
  level: number;           // 0-5
  title: string;
  breakdown: ScoreBreakdown;
  tips: string[];          // Personalized improvement tips
}

/**
 * Calculate Payment Consistency Score (25% of total = 250 points max)
 * 
 * Measures: What % of your bills are paid on time?
 */
function calculatePaymentConsistency(billsPaidOnTime: number, totalBills: number): ScoreBreakdown['paymentConsistency'] {
  if (totalBills === 0) {
    return {
      score: 250,  // No bills = perfect score (not penalized)
      maxScore: 250,
      percentage: 100,
      detail: 'No bills tracked yet'
    };
  }
  
  const percentage = (billsPaidOnTime / totalBills) * 100;
  const score = Math.round((percentage / 100) * 250);
  
  let detail: string;
  if (percentage === 100) {
    detail = 'Perfect payment history! 🎯';
  } else if (percentage >= 95) {
    detail = `${percentage.toFixed(0)}% on-time - Excellent!`;
  } else if (percentage >= 90) {
    detail = `${percentage.toFixed(0)}% on-time - Good, room to improve`;
  } else if (percentage >= 80) {
    detail = `${percentage.toFixed(0)}% on-time - Needs attention`;
  } else {
    detail = `${percentage.toFixed(0)}% on-time - Priority: Set up autopay`;
  }
  
  return { score, maxScore: 250, percentage, detail };
}

/**
 * Calculate Savings Rate Score (20% of total = 200 points max)
 * 
 * Measures: What % of your income are you saving?
 * Benchmark: 20%+ is excellent (the "pay yourself first" rule)
 */
function calculateSavingsRate(monthlySavings: number, monthlyIncome: number): ScoreBreakdown['savingsRate'] {
  if (monthlyIncome === 0) {
    return {
      score: 0,
      maxScore: 200,
      rate: 0,
      detail: 'No income recorded'
    };
  }
  
  const rate = (monthlySavings / monthlyIncome) * 100;
  
  let score: number;
  let detail: string;
  
  if (rate >= 20) {
    score = 200;
    detail = `${rate.toFixed(0)}% savings rate - Crushing it! 🚀`;
  } else if (rate >= 15) {
    score = 175;
    detail = `${rate.toFixed(0)}% savings rate - Great progress!`;
  } else if (rate >= 10) {
    score = 150;
    detail = `${rate.toFixed(0)}% savings rate - Solid foundation`;
  } else if (rate >= 5) {
    score = 100;
    detail = `${rate.toFixed(0)}% savings rate - Building momentum`;
  } else if (rate > 0) {
    score = 50;
    detail = `${rate.toFixed(0)}% savings rate - Every bit counts!`;
  } else {
    score = 0;
    detail = 'No savings this month - Let\'s change that!';
  }
  
  return { score, maxScore: 200, rate, detail };
}

/**
 * Calculate Debt Velocity Score (20% of total = 200 points max)
 * 
 * Measures: Is your debt going UP or DOWN over time?
 * This is the opposite of FICO - we reward paying OFF debt, not having more.
 */
function calculateDebtVelocity(totalDebt: number, debtThreeMonthsAgo: number): ScoreBreakdown['debtVelocity'] {
  // No debt = perfect score
  if (totalDebt === 0 && debtThreeMonthsAgo === 0) {
    return {
      score: 200,
      maxScore: 200,
      trend: 'no-debt',
      changePercent: 0,
      detail: 'Debt-free! 🏆'
    };
  }
  
  // Just paid off all debt
  if (totalDebt === 0 && debtThreeMonthsAgo > 0) {
    return {
      score: 200,
      maxScore: 200,
      trend: 'decreasing',
      changePercent: -100,
      detail: 'You paid off all your debt! 🎉'
    };
  }
  
  // Calculate change
  const change = totalDebt - debtThreeMonthsAgo;
  const changePercent = debtThreeMonthsAgo > 0 
    ? (change / debtThreeMonthsAgo) * 100 
    : (totalDebt > 0 ? 100 : 0);  // New debt = 100% increase
  
  let score: number;
  let trend: 'decreasing' | 'stable' | 'increasing';
  let detail: string;
  
  if (changePercent <= -15) {
    // Paying down 5%+ per month (15% over 3 months)
    score = 200;
    trend = 'decreasing';
    detail = `Debt down ${Math.abs(changePercent).toFixed(0)}% - Excellent progress!`;
  } else if (changePercent <= -6) {
    // Paying down 2-5% per month
    score = 175;
    trend = 'decreasing';
    detail = `Debt down ${Math.abs(changePercent).toFixed(0)}% - Great trajectory!`;
  } else if (changePercent < 0) {
    // Paying down slowly
    score = 150;
    trend = 'decreasing';
    detail = `Debt down ${Math.abs(changePercent).toFixed(0)}% - Moving in right direction`;
  } else if (changePercent <= 2) {
    // Roughly stable
    score = 100;
    trend = 'stable';
    detail = 'Debt stable - Can you accelerate payoff?';
  } else if (changePercent <= 10) {
    // Slowly increasing
    score = 50;
    trend = 'increasing';
    detail = `Debt up ${changePercent.toFixed(0)}% - Time to course correct`;
  } else {
    // Rapidly increasing
    score = 0;
    trend = 'increasing';
    detail = `Debt up ${changePercent.toFixed(0)}% - Urgent: Review spending`;
  }
  
  return { score, maxScore: 200, trend, changePercent, detail };
}

/**
 * Calculate Emergency Buffer Score (15% of total = 150 points max)
 * 
 * Measures: How many months of expenses do you have saved?
 * Gold standard: 3-6 months
 */
function calculateEmergencyBuffer(totalSavings: number, monthlyExpenses: number): ScoreBreakdown['emergencyBuffer'] {
  if (monthlyExpenses === 0) {
    return {
      score: 150,
      maxScore: 150,
      monthsCovered: totalSavings > 0 ? 12 : 0,
      detail: totalSavings > 0 ? 'Great savings!' : 'No expenses tracked'
    };
  }
  
  const monthsCovered = totalSavings / monthlyExpenses;
  
  let score: number;
  let detail: string;
  
  if (monthsCovered >= 6) {
    score = 150;
    detail = `${monthsCovered.toFixed(1)} months covered - Fortress mode! 🏰`;
  } else if (monthsCovered >= 3) {
    score = 125;
    detail = `${monthsCovered.toFixed(1)} months covered - Solid safety net`;
  } else if (monthsCovered >= 1) {
    score = 100;
    detail = `${monthsCovered.toFixed(1)} months covered - Keep building`;
  } else if (monthsCovered >= 0.5) {
    score = 50;
    detail = `${Math.round(monthsCovered * 30)} days covered - Growing!`;
  } else if (monthsCovered > 0) {
    score = 25;
    detail = `${Math.round(monthsCovered * 30)} days covered - Starting out`;
  } else {
    score = 0;
    detail = 'No emergency fund yet - Start small!';
  }
  
  return { score, maxScore: 150, monthsCovered, detail };
}

/**
 * Calculate Budget Discipline Score (10% of total = 100 points max)
 * 
 * Measures: How many of your budgets are you staying within?
 */
function calculateBudgetDiscipline(budgetsOnTrack: number, totalBudgets: number): ScoreBreakdown['budgetDiscipline'] {
  if (totalBudgets === 0) {
    return {
      score: 50,  // No budgets = neutral (encourage setting some)
      maxScore: 100,
      percentage: 0,
      detail: 'No budgets set - Create some to track progress!'
    };
  }
  
  const percentage = (budgetsOnTrack / totalBudgets) * 100;
  const score = Math.round((percentage / 100) * 100);
  
  let detail: string;
  if (percentage === 100) {
    detail = `All ${totalBudgets} budgets on track! 🎯`;
  } else if (percentage >= 80) {
    detail = `${budgetsOnTrack}/${totalBudgets} budgets on track - Great!`;
  } else if (percentage >= 60) {
    detail = `${budgetsOnTrack}/${totalBudgets} budgets on track - Watch a few`;
  } else {
    detail = `${budgetsOnTrack}/${totalBudgets} budgets on track - Needs focus`;
  }
  
  return { score, maxScore: 100, percentage, detail };
}

/**
 * Calculate Debt-to-Income Score (10% of total = 100 points max)
 * 
 * Measures: How does your total debt compare to your annual income?
 * Lower is better. Unlike FICO, we don't care about "credit utilization" - 
 * we care about total debt burden.
 */
function calculateDebtToIncome(totalDebt: number, monthlyIncome: number): ScoreBreakdown['debtToIncome'] {
  const annualIncome = monthlyIncome * 12;
  
  if (annualIncome === 0) {
    return {
      score: 0,
      maxScore: 100,
      ratio: 0,
      detail: 'No income recorded'
    };
  }
  
  if (totalDebt === 0) {
    return {
      score: 100,
      maxScore: 100,
      ratio: 0,
      detail: 'No debt! Perfect score 🏆'
    };
  }
  
  const ratio = (totalDebt / annualIncome) * 100;
  
  let score: number;
  let detail: string;
  
  if (ratio <= 10) {
    score = 100;
    detail = `${ratio.toFixed(0)}% DTI - Very healthy`;
  } else if (ratio <= 20) {
    score = 90;
    detail = `${ratio.toFixed(0)}% DTI - Good standing`;
  } else if (ratio <= 30) {
    score = 75;
    detail = `${ratio.toFixed(0)}% DTI - Manageable`;
  } else if (ratio <= 40) {
    score = 50;
    detail = `${ratio.toFixed(0)}% DTI - Getting heavy`;
  } else if (ratio <= 50) {
    score = 25;
    detail = `${ratio.toFixed(0)}% DTI - Debt is weighing you down`;
  } else {
    score = 0;
    detail = `${ratio.toFixed(0)}% DTI - Debt exceeds half your income`;
  }
  
  return { score, maxScore: 100, ratio, detail };
}

/**
 * Get level and title based on score
 */
function getScoreLevel(total: number): { level: number; title: string } {
  if (total >= 900) return { level: 5, title: 'Financial Freedom' };
  if (total >= 750) return { level: 4, title: 'Wealth Builder' };
  if (total >= 600) return { level: 3, title: 'Solid Ground' };
  if (total >= 400) return { level: 2, title: 'Foundation' };
  if (total >= 200) return { level: 1, title: 'Getting Started' };
  return { level: 0, title: 'Beginning Journey' };
}

/**
 * Generate personalized tips based on breakdown
 */
function generateTips(breakdown: ScoreBreakdown): string[] {
  const tips: string[] = [];
  
  // Find weakest areas (lowest % of max score)
  const areas = [
    { name: 'payments', pct: breakdown.paymentConsistency.score / 250, tip: 'Set up autopay for recurring bills to never miss a payment' },
    { name: 'savings', pct: breakdown.savingsRate.score / 200, tip: 'Try the "pay yourself first" rule: save before spending' },
    { name: 'debt', pct: breakdown.debtVelocity.score / 200, tip: 'Use the avalanche method: pay minimums on all, extra on highest interest' },
    { name: 'emergency', pct: breakdown.emergencyBuffer.score / 150, tip: 'Build your emergency fund: aim for $1,000, then 1 month expenses' },
    { name: 'budgets', pct: breakdown.budgetDiscipline.score / 100, tip: 'Review overspent budgets - can you trim or reallocate?' },
    { name: 'dti', pct: breakdown.debtToIncome.score / 100, tip: 'Focus on paying down high-interest debt first' },
  ];
  
  // Sort by weakest
  areas.sort((a, b) => a.pct - b.pct);
  
  // Add tips for 2-3 weakest areas (that aren't already perfect)
  for (const area of areas.slice(0, 3)) {
    if (area.pct < 1) {
      tips.push(area.tip);
    }
  }
  
  // If they're doing great everywhere, add encouragement
  if (tips.length === 0) {
    tips.push('You\'re doing amazing! Keep up the great work 🌟');
  }
  
  return tips;
}

/**
 * Main function: Calculate the complete Financial Health Score
 */
export function calculateFinancialHealthScore(input: ScoreInput): FinancialHealthScore {
  const breakdown: ScoreBreakdown = {
    paymentConsistency: calculatePaymentConsistency(input.billsPaidOnTime, input.totalBills),
    savingsRate: calculateSavingsRate(input.monthlySavings, input.monthlyIncome),
    debtVelocity: calculateDebtVelocity(input.totalDebt, input.debtThreeMonthsAgo),
    emergencyBuffer: calculateEmergencyBuffer(input.totalSavings, input.monthlyExpenses),
    budgetDiscipline: calculateBudgetDiscipline(input.budgetsOnTrack, input.totalBudgets),
    debtToIncome: calculateDebtToIncome(input.totalDebt, input.monthlyIncome),
  };
  
  const total = 
    breakdown.paymentConsistency.score +
    breakdown.savingsRate.score +
    breakdown.debtVelocity.score +
    breakdown.emergencyBuffer.score +
    breakdown.budgetDiscipline.score +
    breakdown.debtToIncome.score;
  
  const { level, title } = getScoreLevel(total);
  const tips = generateTips(breakdown);
  
  return {
    total,
    maxTotal: 1000,
    level,
    title,
    breakdown,
    tips,
  };
}

/**
 * Calculate score change from previous
 */
export function calculateScoreChange(current: FinancialHealthScore, previous: FinancialHealthScore): {
  change: number;
  improved: string[];
  declined: string[];
} {
  const change = current.total - previous.total;
  const improved: string[] = [];
  const declined: string[] = [];
  
  const factors = [
    { key: 'paymentConsistency', name: 'Payment Consistency' },
    { key: 'savingsRate', name: 'Savings Rate' },
    { key: 'debtVelocity', name: 'Debt Progress' },
    { key: 'emergencyBuffer', name: 'Emergency Fund' },
    { key: 'budgetDiscipline', name: 'Budget Discipline' },
    { key: 'debtToIncome', name: 'Debt-to-Income' },
  ] as const;
  
  for (const factor of factors) {
    const currentScore = current.breakdown[factor.key].score;
    const previousScore = previous.breakdown[factor.key].score;
    
    if (currentScore > previousScore) {
      improved.push(factor.name);
    } else if (currentScore < previousScore) {
      declined.push(factor.name);
    }
  }
  
  return { change, improved, declined };
}
