export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCompact(amount: number): string {
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}k`;
  return `₹${amount}`;
}

export function pct(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.min(100, Math.round((value / total) * 100));
}

export function uid(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function todayISO(): string {
  return new Date().toISOString().split('T')[0];
}

export function labelForCategory(cat: string): string {
  const map: Record<string, string> = {
    rent: 'Rent',
    food: 'Food',
    transport: 'Transport',
    home_contribution: 'Home',
    sibling_education: 'Sibling Edu',
    medical: 'Medical',
    shopping: 'Shopping',
    entertainment: 'Entertainment',
    bills: 'Bills',
    subscriptions: 'Subscriptions',
    miscellaneous: 'Misc',
  };
  return map[cat] ?? cat;
}

export function labelForSource(src: string): string {
  const map: Record<string, string> = {
    salary: 'Salary',
    bonus: 'Bonus',
    freelance: 'Freelance',
    gift: 'Gift',
    other: 'Other',
  };
  return map[src] ?? src;
}

export const CATEGORY_COLORS: Record<string, string> = {
  rent: '#ef4444',
  food: '#f97316',
  transport: '#eab308',
  home_contribution: '#22c55e',
  sibling_education: '#3b82f6',
  medical: '#ec4899',
  shopping: '#a855f7',
  entertainment: '#14b8a6',
  bills: '#f59e0b',
  subscriptions: '#6366f1',
  miscellaneous: '#6b7280',
};

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function monthLabel(key: string): string {
  const [y, m] = key.split('-');
  return new Date(Number(y), Number(m) - 1, 1).toLocaleString('default', {
    month: 'short',
    year: 'numeric',
  });
}