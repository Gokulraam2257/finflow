// ─── Income ────────────────────────────────────────────────────────────────
export type IncomeSource = 'salary' | 'bonus' | 'freelance' | 'gift' | 'other';

export interface IncomeEntry {
  id: string;
  date: string; // ISO string
  amount: number;
  source: IncomeSource;
  notes: string;
}

// ─── Expenses ──────────────────────────────────────────────────────────────
export type ExpenseCategory =
  | 'rent'
  | 'food'
  | 'transport'
  | 'home_contribution'
  | 'sibling_education'
  | 'medical'
  | 'shopping'
  | 'entertainment'
  | 'bills'
  | 'subscriptions'
  | 'miscellaneous';

export interface ExpenseEntry {
  id: string;
  date: string;
  amount: number;
  category: ExpenseCategory;
  notes: string;
}

// ─── Savings Buckets ───────────────────────────────────────────────────────
export interface EmergencyFund {
  currentAmount: number;
  targetAmount: number; // Default 60000
  monthlyContribution: number;
}

export interface SiblingEducationFund {
  currentAmount: number;
  quarterlyFeeAmount: number; // 12000–15000
  nextDueDate: string;
  monthlyContribution: number;
}

export interface FutureGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  monthlyContribution: number;
  icon: string;
}

export interface GamingPCFund {
  targetAmount: number; // Default 140000
  currentAmount: number;
  monthlyContribution: number;
}

// ─── App Settings ──────────────────────────────────────────────────────────
export interface AppSettings {
  monthlySalary: number; // 40000–45000
  theme: 'dark' | 'light';
  currency: string; // INR
  homeContributionMin: number;
  homeContributionMax: number;
  rentAndLivingMin: number;
  rentAndLivingMax: number;
  siblingFeeMin: number;
  siblingFeeMax: number;
}

// ─── Monthly Plan ──────────────────────────────────────────────────────────
export interface MonthlyPlan {
  month: string; // 'YYYY-MM'
  salary: number;
  homeContribution: number;
  rentAndLiving: number;
  emergencyAllocation: number;
  siblingAllocation: number;
  futureAllocation: number;
  pcAllocation: number;
  leftover: number;
  isLocked: boolean;
}

// ─── Financial Health ──────────────────────────────────────────────────────
export type HealthStatus = 'Critical' | 'Poor' | 'Average' | 'Good' | 'Excellent';

export interface FinancialHealth {
  score: number; // 0–100
  status: HealthStatus;
  savingsRate: number;
  expenseRatio: number;
  emergencyCoverage: number; // months
  goalCompletionPct: number;
  recommendations: string[];
}

// ─── Notifications ────────────────────────────────────────────────────────
export interface Notification {
  id: string;
  type: 'milestone' | 'alert' | 'reminder' | 'insight';
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  read: boolean;
  timestamp: string;
}

// ─── Recommendations ──────────────────────────────────────────────────────
export interface FinancialRecommendation {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  actionType?: 'increase_emergency' | 'boost_pc' | 'adjust_sibling' | 'increase_future';
  suggestedAmount?: number;
}

// ─── Reports ──────────────────────────────────────────────────────────────
export interface MonthlyReport {
  month: string;
  totalIncome: number;
  totalExpenses: number;
  savings: number;
  savingsRate: number;
  expensesByCategory: Record<ExpenseCategory, number>;
  incomeBySource: Record<IncomeSource, number>;
}

// ─── Scenario ──────────────────────────────────────────────────────────────
export interface ScenarioResult {
  purchase: {
    name: string;
    cost: number;
  };
  impactOnEmergency: number;
  impactOnPC: number;
  delayMonths: number;
  updatedPCDate: string;
  feasible: boolean;
  warning?: string;
}

// ─── PC Scenario ──────────────────────────────────────────────────────────
export interface PCScenario {
  monthlyAllocation: number;
  remainingAmount: number;
  requiredMonthly: number;
  completionDate: string;
  monthsRemaining: number;
}

// ─── App State ─────────────────────────────────────────────────────────────
export interface AppState {
  settings: AppSettings;
  incomeEntries: IncomeEntry[];
  expenseEntries: ExpenseEntry[];
  emergencyFund: EmergencyFund;
  siblingFund: SiblingEducationFund;
  futureGoals: FutureGoal[];
  gamingPCFund: GamingPCFund;
  monthlyPlans: MonthlyPlan[];
  financialHealth: FinancialHealth;
  notifications: Notification[];
  reports: MonthlyReport[];
}