import type { AppState } from '../types';

const STORAGE_KEY = 'finflow_india_v1';

export const defaultState: AppState = {
  settings: {
    monthlySalary: 45000,
    theme: 'dark',
    currency: '₹',
    homeContributionMin: 15000,
    homeContributionMax: 20000,
    rentAndLivingMin: 8000,
    rentAndLivingMax: 10000,
    siblingFeeMin: 12000,
    siblingFeeMax: 15000,
  },
  incomeEntries: [],
  expenseEntries: [],
  emergencyFund: {
    currentAmount: 0,
    targetAmount: 60000,
    monthlyContribution: 4000,
  },
  siblingFund: {
    currentAmount: 0,
    quarterlyFeeAmount: 13500,
    nextDueDate: (() => {
      const d = new Date();
      d.setMonth(d.getMonth() + 3);
      return d.toISOString().split('T')[0];
    })(),
    monthlyContribution: 5000,
  },
  futureGoals: [
    {
      id: 'fg_1',
      name: 'Travel Fund',
      targetAmount: 50000,
      currentAmount: 0,
      targetDate: (() => {
        const d = new Date();
        d.setFullYear(d.getFullYear() + 2);
        return d.toISOString().split('T')[0];
      })(),
      monthlyContribution: 2000,
      icon: '✈️',
    },
  ],
  gamingPCFund: {
    targetAmount: 140000,
    currentAmount: 0,
    monthlyContribution: 5000,
  },
  monthlyPlans: [],
  financialHealth: {
    score: 0,
    status: 'Average',
    savingsRate: 0,
    expenseRatio: 0,
    emergencyCoverage: 0,
    goalCompletionPct: 0,
    recommendations: [],
  },
  notifications: [],
  reports: [],
};

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    return { ...defaultState, ...JSON.parse(raw) };
  } catch {
    return defaultState;
  }
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save state', e);
  }
}

export function exportJSON(state: AppState): void {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `finflow_backup_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportCSV(state: AppState): void {
  const rows = [
    ['Type', 'Date', 'Amount', 'Category/Source', 'Notes'],
    ...state.incomeEntries.map((e) => ['Income', e.date, e.amount, e.source, e.notes]),
    ...state.expenseEntries.map((e) => ['Expense', e.date, e.amount, e.category, e.notes]),
  ];
  const csv = rows.map((r) => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `finflow_transactions_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importJSON(file: File, onLoad: (state: AppState) => void): void {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const parsed = JSON.parse(e.target?.result as string);
      onLoad({ ...defaultState, ...parsed });
    } catch {
      alert('Invalid backup file.');
    }
  };
  reader.readAsText(file);
}