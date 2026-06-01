import type {
  AppState,
  FinancialHealth,
  HealthStatus,
  MonthlyPlan,
  FinancialRecommendation,
  ScenarioResult,
  PCScenario,
} from '../types';
import { startOfMonth, endOfMonth, parseISO, isWithinInterval, differenceInDays } from 'date-fns';

// ─── Date helpers ──────────────────────────────────────────────────────────
export function currentMonthKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export function monthLabel(key: string): string {
  const [y, m] = key.split('-');
  return new Date(Number(y), Number(m) - 1, 1).toLocaleString('default', {
    month: 'short',
    year: 'numeric',
  });
}

// ─── Filtering helpers ─────────────────────────────────────────────────────
export function entriesForMonth<T extends { date: string }>(
  entries: T[],
  monthKey: string
): T[] {
  const [y, m] = monthKey.split('-').map(Number);
  const start = startOfMonth(new Date(y, m - 1, 1));
  const end = endOfMonth(new Date(y, m - 1, 1));
  return entries.filter((e) => {
    const d = parseISO(e.date);
    return isWithinInterval(d, { start, end });
  });
}

export function totalAmount<T extends { amount: number }>(entries: T[]): number {
  return entries.reduce((sum, e) => sum + e.amount, 0);
}

// ─── Monthly Income & Expense ──────────────────────────────────────────────
export function monthlyIncome(state: AppState, monthKey?: string): number {
  const key = monthKey ?? currentMonthKey();
  return totalAmount(entriesForMonth(state.incomeEntries, key));
}

export function monthlyExpenses(state: AppState, monthKey?: string): number {
  const key = monthKey ?? currentMonthKey();
  return totalAmount(entriesForMonth(state.expenseEntries, key));
}

// ─── Available Balance ─────────────────────────────────────────────────────
export function availableBalance(state: AppState): number {
  const income = monthlyIncome(state) || state.settings.monthlySalary;
  const expenses = monthlyExpenses(state);
  const allocations =
    state.emergencyFund.monthlyContribution +
    state.siblingFund.monthlyContribution +
    state.gamingPCFund.monthlyContribution +
    state.futureGoals.reduce((s, g) => s + g.monthlyContribution, 0);
  return income - expenses - allocations;
}

// ─── Savings Rate ──────────────────────────────────────────────────────────
export function savingsRate(state: AppState): number {
  const income = monthlyIncome(state) || state.settings.monthlySalary;
  if (income === 0) return 0;
  const saved =
    state.emergencyFund.monthlyContribution +
    state.siblingFund.monthlyContribution +
    state.gamingPCFund.monthlyContribution +
    state.futureGoals.reduce((s, g) => s + g.monthlyContribution, 0);
  return Math.min(100, Math.round((saved / income) * 100));
}

// ─── Financial Health Score ────────────────────────────────────────────────
export function computeHealthScore(state: AppState): FinancialHealth {
  const income = monthlyIncome(state) || state.settings.monthlySalary;
  const expenses = monthlyExpenses(state);
  const saved =
    state.emergencyFund.monthlyContribution +
    state.siblingFund.monthlyContribution +
    state.gamingPCFund.monthlyContribution +
    state.futureGoals.reduce((s, g) => s + g.monthlyContribution, 0);

  const sr = income > 0 ? (saved / income) * 100 : 0;
  const er = income > 0 ? (expenses / income) * 100 : 100;

  // Emergency coverage in months
  const avgMonthlyExpense = expenses || 10000;
  const emergencyCoverage = state.emergencyFund.currentAmount / avgMonthlyExpense;

  // Goal completion average
  const allGoals = [
    state.emergencyFund.currentAmount / state.emergencyFund.targetAmount,
    state.gamingPCFund.currentAmount / state.gamingPCFund.targetAmount,
    ...state.futureGoals.map((g) => g.currentAmount / g.targetAmount),
  ];
  const goalCompletionPct =
    allGoals.length > 0
      ? Math.round((allGoals.reduce((s, v) => s + v, 0) / allGoals.length) * 100)
      : 0;

  // Scoring
  let score = 0;
  score += Math.min(30, sr); // up to 30 pts for savings rate
  score += Math.max(0, 20 - er / 5); // up to 20 pts for low expense ratio
  score += Math.min(20, emergencyCoverage * 3.3); // up to 20 pts for 6mo coverage
  score += Math.min(30, goalCompletionPct * 0.3); // up to 30 pts for goals

  score = Math.min(100, Math.max(0, Math.round(score)));

  let status: HealthStatus = 'Critical';
  if (score >= 80) status = 'Excellent';
  else if (score >= 60) status = 'Good';
  else if (score >= 40) status = 'Average';
  else if (score >= 20) status = 'Poor';

  const recommendations: string[] = [];
  if (emergencyCoverage < 3)
    recommendations.push('🚨 Emergency fund covers less than 3 months. Prioritize it.');
  if (emergencyCoverage < 6)
    recommendations.push('⚠️ Increase emergency fund allocation to reach 6-month coverage.');
  if (sr < 15)
    recommendations.push('📉 Your savings rate is below 15%. Try reducing discretionary spending.');
  if (er > 70)
    recommendations.push('💸 Expense ratio is high. Review subscriptions and entertainment spend.');
  if (goalCompletionPct < 20)
    recommendations.push('🎯 Goals are underfunded. Stick to the monthly plan.');
  if (state.gamingPCFund.currentAmount > state.emergencyFund.targetAmount * 0.5 &&
    state.emergencyFund.currentAmount < state.emergencyFund.targetAmount * 0.5)
    recommendations.push('🖥️ You can safely increase PC savings after emergency fund hits ₹30k.');
  if (recommendations.length === 0)
    recommendations.push('✅ Great work! Keep your current allocation strategy.');

  return { score, status, savingsRate: sr, expenseRatio: er, emergencyCoverage, goalCompletionPct, recommendations };
}

// ─── Sibling Fee Alert ─────────────────────────────────────────────────────
export function siblingFeeAlertLevel(nextDueDate: string): 'none' | 'warn' | 'urgent' | 'critical' {
  const days = differenceInDays(parseISO(nextDueDate), new Date());
  if (days <= 7) return 'critical';
  if (days <= 15) return 'urgent';
  if (days <= 30) return 'warn';
  return 'none';
}

export function daysUntilFee(nextDueDate: string): number {
  return differenceInDays(parseISO(nextDueDate), new Date());
}

// ─── Auto Monthly Plan Generator ──────────────────────────────────────────
export function generateMonthlyPlan(state: AppState): MonthlyPlan {
  const salary = state.settings.monthlySalary;
  const homeContribution = state.settings.homeContributionMin +
    Math.round((state.settings.homeContributionMax - state.settings.homeContributionMin) / 2);
  const rentAndLiving = state.settings.rentAndLivingMin +
    Math.round((state.settings.rentAndLivingMax - state.settings.rentAndLivingMin) / 2);

  let remaining = salary - homeContribution - rentAndLiving;

  const emergencyAllocation = state.emergencyFund.currentAmount >= state.emergencyFund.targetAmount
    ? 0 : Math.min(remaining, 4000);
  remaining -= emergencyAllocation;

  const siblingAllocation = Math.min(remaining, 5000);
  remaining -= siblingAllocation;

  const futureAllocation = Math.min(remaining, 3000);
  remaining -= futureAllocation;

  const pcAllocation = Math.min(remaining, 5000);
  remaining -= pcAllocation;

  return {
    month: currentMonthKey(),
    salary,
    homeContribution,
    rentAndLiving,
    emergencyAllocation,
    siblingAllocation,
    futureAllocation,
    pcAllocation,
    leftover: remaining,
    isLocked: false,
  };
}

// ─── PC Fund Scenarios ─────────────────────────────────────────────────────
export function pcFundScenarios(state: AppState) {
  const remaining = state.gamingPCFund.targetAmount - state.gamingPCFund.currentAmount;
  const scenarios = [5000, 8000, 10000, 12000];
  return scenarios.map((monthly) => ({
    monthly,
    months: remaining <= 0 ? 0 : Math.ceil(remaining / monthly),
    completionDate: (() => {
      const d = new Date();
      d.setMonth(d.getMonth() + Math.ceil(remaining / monthly));
      return d.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
    })(),
  }));
}

// ─── "Can I afford this?" ──────────────────────────────────────────────────
export function affordabilityCheck(
  state: AppState,
  amount: number
): {
  canAfford: boolean;
  emergencyImpact: number;
  pcFundDelay: number; // months
  newEmergencyAmount: number;
  newPCAmount: number;
} {
  const newEmergency = Math.max(0, state.emergencyFund.currentAmount - amount / 2);
  const newPC = Math.max(0, state.gamingPCFund.currentAmount - amount / 2);
  const balance = availableBalance(state);
  const canAfford = balance >= amount;
  const pcRemaining = state.gamingPCFund.targetAmount - state.gamingPCFund.currentAmount;
  const newPCRemaining = state.gamingPCFund.targetAmount - newPC;
  const monthly = state.gamingPCFund.monthlyContribution || 5000;
  const currentMonths = Math.ceil(pcRemaining / monthly);
  const newMonths = Math.ceil(newPCRemaining / monthly);

  return {
    canAfford,
    emergencyImpact: state.emergencyFund.currentAmount - newEmergency,
    pcFundDelay: Math.max(0, newMonths - currentMonths),
    newEmergencyAmount: newEmergency,
    newPCAmount: newPC,
  };
}

// ─── Last 6 months keys ────────────────────────────────────────────────────
export function last6MonthKeys(): string[] {
  const keys: string[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    keys.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  }
  return keys;
}

// ─── Generate Financial Recommendations ───────────────────────────────────
export function generateRecommendations(state: AppState): FinancialRecommendation[] {
  const recommendations: FinancialRecommendation[] = [];
  const income = monthlyIncome(state) || state.settings.monthlySalary;
  const expenses = monthlyExpenses(state);
  const rate = savingsRate(state);

  // Emergency fund recommendations
  if (state.emergencyFund.currentAmount < state.emergencyFund.targetAmount * 0.3) {
    recommendations.push({
      id: 'emergency-critical',
      title: '🚨 Emergency Fund Critical',
      description: 'Your emergency fund covers less than 1.8 months of expenses. Build it up first.',
      priority: 'high',
      actionType: 'increase_emergency',
      suggestedAmount: 4000,
    });
  } else if (state.emergencyFund.currentAmount < state.emergencyFund.targetAmount * 0.5) {
    recommendations.push({
      id: 'emergency-warning',
      title: '⚠️ Emergency Fund Underfunded',
      description: 'Increase emergency allocations to reach 6-month coverage.',
      priority: 'high',
      actionType: 'increase_emergency',
      suggestedAmount: 3000,
    });
  }

  // Sibling education fund recommendations
  const daysUntilFeeValue = daysUntilFee(state.siblingFund.nextDueDate);
  if (daysUntilFeeValue <= 30 && state.siblingFund.currentAmount < state.siblingFund.quarterlyFeeAmount) {
    recommendations.push({
      id: 'sibling-urgent',
      title: '⏰ Sibling Fee Due Soon',
      description: `Fee due in ${daysUntilFeeValue} days. Ensure ₹${state.siblingFund.quarterlyFeeAmount} is available.`,
      priority: 'high',
      actionType: 'adjust_sibling',
      suggestedAmount: Math.max(0, state.siblingFund.quarterlyFeeAmount - state.siblingFund.currentAmount),
    });
  }

  // PC Fund boost when emergency is stable
  if (
    state.emergencyFund.currentAmount >= state.emergencyFund.targetAmount * 0.7 &&
    state.gamingPCFund.currentAmount < state.gamingPCFund.targetAmount * 0.3
  ) {
    recommendations.push({
      id: 'pc-boost',
      title: '🖥️ Time to Boost PC Fund',
      description: 'Emergency fund is healthy. Consider increasing PC savings.',
      priority: 'medium',
      actionType: 'boost_pc',
      suggestedAmount: 2000,
    });
  }

  // Savings rate recommendations
  if (rate < 20) {
    recommendations.push({
      id: 'savings-low',
      title: '📉 Low Savings Rate',
      description: 'Current savings rate is only ' + rate + '%. Target at least 25-30%.',
      priority: 'medium',
      actionType: 'increase_emergency',
      suggestedAmount: 2000,
    });
  }

  // Expense optimization
  const expenseRatio = (expenses / income) * 100;
  if (expenseRatio > 75) {
    recommendations.push({
      id: 'expense-high',
      title: '💸 High Expense Ratio',
      description: `${Math.round(expenseRatio)}% of income goes to expenses. Review discretionary spending.`,
      priority: 'medium',
    });
  }

  // Future fund consistency
  const futureTotal = state.futureGoals.reduce((s, g) => s + g.monthlyContribution, 0);
  if (futureTotal === 0 && income > 45000) {
    recommendations.push({
      id: 'future-missing',
      title: '🎯 No Future Fund Allocation',
      description: 'Consider saving ₹2,000-3,000/month for travel, marriage, or investments.',
      priority: 'low',
      actionType: 'increase_future',
      suggestedAmount: 2000,
    });
  }

  // Positive reinforcement
  if (recommendations.length === 0) {
    recommendations.push({
      id: 'great-work',
      title: '✅ On Track',
      description: 'Your financial plan is well-balanced. Keep up the discipline!',
      priority: 'low',
    });
  }

  return recommendations;
}

// ─── Scenario Simulation: "What if I spend?" ──────────────────────────────
export function simulateExpense(
  state: AppState,
  purchaseAmount: number,
  purchaseName: string
): ScenarioResult {
  const available = availableBalance(state);
  const canAfford = available >= purchaseAmount;

  const emergencyImpact = Math.min(purchaseAmount / 2, state.emergencyFund.currentAmount);
  const pcImpact = purchaseAmount / 2;

  const newPCAmount = Math.max(0, state.gamingPCFund.currentAmount - pcImpact);
  const pcRemaining = state.gamingPCFund.targetAmount - newPCAmount;
  const monthlyPC = state.gamingPCFund.monthlyContribution || 5000;
  const delayMonths = Math.ceil(pcRemaining / monthlyPC) - Math.ceil((state.gamingPCFund.targetAmount - state.gamingPCFund.currentAmount) / monthlyPC);

  const newPCDate = new Date();
  newPCDate.setMonth(newPCDate.getMonth() + Math.ceil(pcRemaining / monthlyPC));

  return {
    purchase: { name: purchaseName, cost: purchaseAmount },
    impactOnEmergency: emergencyImpact,
    impactOnPC: pcImpact,
    delayMonths: Math.max(0, delayMonths),
    updatedPCDate: newPCDate.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
    feasible: canAfford,
    warning: !canAfford ? `Shortfall: ₹${Math.round(purchaseAmount - available)}` : undefined,
  };
}

// ─── PC Fund Scenarios (Enhanced) ──────────────────────────────────────────
export function pcFundScenarioDetailed(state: AppState, monthlyAllocation: number): PCScenario {
  const remaining = state.gamingPCFund.targetAmount - state.gamingPCFund.currentAmount;
  const months = remaining <= 0 ? 0 : Math.ceil(remaining / monthlyAllocation);

  const completionDate = new Date();
  completionDate.setMonth(completionDate.getMonth() + months);

  return {
    monthlyAllocation,
    remainingAmount: Math.max(0, remaining),
    requiredMonthly: remaining > 0 ? Math.ceil(remaining / 12) : 0,
    completionDate: completionDate.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
    monthsRemaining: months,
  };
}

// ─── Cash Flow Forecast (Next 6 months) ────────────────────────────────────
export function forecastCashFlow(state: AppState): Array<{ month: string; projected: number }> {
  const forecast: Array<{ month: string; projected: number }> = [];

  for (let i = 0; i < 6; i++) {
    const d = new Date();
    d.setMonth(d.getMonth() + i);
    const monthLabel = d.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
    const monthlyIncome_var = monthlyIncome(state) || state.settings.monthlySalary;
    const monthlyExpense_var = monthlyExpenses(state) || 18000;
    const allocations =
      state.emergencyFund.monthlyContribution +
      state.siblingFund.monthlyContribution +
      state.gamingPCFund.monthlyContribution +
      state.futureGoals.reduce((s, g) => s + g.monthlyContribution, 0);

    forecast.push({ month: monthLabel, projected: Math.max(0, monthlyIncome_var - monthlyExpense_var - allocations) });
  }

  return forecast;
}

// ─── Sibling Fee Forecast ────────────────────────────────────────────────────
export function forecastSiblingFees(state: AppState): Array<{ month: string; dueAmount: number; daysLeft: number }> {
  const fees: Array<{ month: string; dueAmount: number; daysLeft: number }> = [];

  for (let i = 0; i < 4; i++) {
    let nextDate = parseISO(state.siblingFund.nextDueDate);
    nextDate = new Date(nextDate.getTime() + i * 90 * 24 * 60 * 60 * 1000); // Add 90 days i times

    const monthStr = nextDate.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
    const daysLeft = differenceInDays(nextDate, new Date());

    fees.push({
      month: monthStr,
      dueAmount: state.siblingFund.quarterlyFeeAmount,
      daysLeft,
    });
  }

  return fees;
}

// ─── Goal Completion Forecast ────────────────────────────────────────────────
export function forecastGoalCompletion(state: AppState): Array<{ goalName: string; monthsLeft: number; completionDate: string }> {
  const forecast: Array<{ goalName: string; monthsLeft: number; completionDate: string }> = [];

  // PC Fund
  const pcRemaining = state.gamingPCFund.targetAmount - state.gamingPCFund.currentAmount;
  const pcMonthly = state.gamingPCFund.monthlyContribution || 5000;
  const pcMonths = pcRemaining > 0 ? Math.ceil(pcRemaining / pcMonthly) : 0;
  const pcDate = new Date();
  pcDate.setMonth(pcDate.getMonth() + pcMonths);

  forecast.push({
    goalName: 'Gaming PC (₹' + state.gamingPCFund.targetAmount + ')',
    monthsLeft: pcMonths,
    completionDate: pcDate.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
  });

  // Emergency Fund
  const emergencyRemaining = state.emergencyFund.targetAmount - state.emergencyFund.currentAmount;
  const emergencyMonthly = state.emergencyFund.monthlyContribution || 4000;
  const emergencyMonths = emergencyRemaining > 0 ? Math.ceil(emergencyRemaining / emergencyMonthly) : 0;
  const emergencyDate = new Date();
  emergencyDate.setMonth(emergencyDate.getMonth() + emergencyMonths);

  forecast.push({
    goalName: 'Emergency Fund (₹' + state.emergencyFund.targetAmount + ')',
    monthsLeft: emergencyMonths,
    completionDate: emergencyDate.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
  });

  // Future Goals
  state.futureGoals.forEach((goal) => {
    const remaining = goal.targetAmount - goal.currentAmount;
    const monthly = goal.monthlyContribution || 2000;
    const months = remaining > 0 ? Math.ceil(remaining / monthly) : 0;
    const date = new Date();
    date.setMonth(date.getMonth() + months);

    forecast.push({
      goalName: goal.name + ' (₹' + goal.targetAmount + ')',
      monthsLeft: months,
      completionDate: date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
    });
  });

  return forecast;
}

// ─── Net Worth Calculation ────────────────────────────────────────────────────
export function calculateNetWorth(state: AppState): number {
  return (
    state.emergencyFund.currentAmount +
    state.siblingFund.currentAmount +
    state.gamingPCFund.currentAmount +
    state.futureGoals.reduce((s, g) => s + g.currentAmount, 0)
  );
}

// ─── Savings Streak Tracker ────────────────────────────────────────────────
export function savingsStreak(state: AppState): number {
  const keys = last6MonthKeys();
  let streak = 0;

  for (let i = keys.length - 1; i >= 0; i--) {
    const income = monthlyIncome(state, keys[i]);
    const expenses = monthlyExpenses(state, keys[i]);
    if (income > expenses) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

// ─── No-Spend Day Tracker ──────────────────────────────────────────────────
export function noSpendDaysThisMonth(state: AppState): number {
  const today = new Date();
  const month = currentMonthKey();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  
  const expenses = entriesForMonth(state.expenseEntries, month);
  const spendingDays = new Set(expenses.map((e) => parseISO(e.date).getDate()));

  return daysInMonth - spendingDays.size;
}

// ─── Emergency Readiness Score ────────────────────────────────────────────
export function emergencyReadinessScore(state: AppState): number {
  const coverage = state.emergencyFund.currentAmount / state.emergencyFund.targetAmount;
  return Math.min(100, Math.round(coverage * 100));
}

// ─── PC Readiness Score ────────────────────────────────────────────────────
export function pcReadinessScore(state: AppState): number {
  const progress = state.gamingPCFund.currentAmount / state.gamingPCFund.targetAmount;
  return Math.min(100, Math.round(progress * 100));
}