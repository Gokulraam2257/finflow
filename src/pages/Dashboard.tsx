import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { ProgressRing } from '../components/ui/ProgressRing';
import { Badge } from '../components/ui/Badge';
import {
  monthlyIncome, monthlyExpenses, availableBalance,
  computeHealthScore, siblingFeeAlertLevel, daysUntilFee,
  calculateNetWorth,
} from '../utils/finance';
import { formatCurrency } from '../utils/formatters';
import { AlertTriangle, TrendingUp, Shield, GraduationCap, Cpu } from 'lucide-react';

export function Dashboard() {
  const { state } = useApp();
  const income = monthlyIncome(state) || state.settings.monthlySalary;
  const expenses = monthlyExpenses(state);
  const balance = availableBalance(state);
  const health = computeHealthScore(state);
  const alertLevel = siblingFeeAlertLevel(state.siblingFund.nextDueDate);
  const daysLeft = daysUntilFee(state.siblingFund.nextDueDate);
  const netWorth = calculateNetWorth(state);

  const emergencyProgress = Math.min(100, (state.emergencyFund.currentAmount / state.emergencyFund.targetAmount) * 100);
  const siblingProgress = Math.min(100, (state.siblingFund.currentAmount / state.siblingFund.quarterlyFeeAmount) * 100);
  const pcProgress = Math.min(100, (state.gamingPCFund.currentAmount / state.gamingPCFund.targetAmount) * 100);

  return (
    <div className="flex-1 pb-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen p-4">
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400">Your financial overview</p>
        </div>

        {/* Sibling Fee Alert */}
        {alertLevel !== 'none' && (
          <div className={`flex items-center gap-3 p-4 rounded-lg border ${
            alertLevel === 'critical' ? 'bg-red-900/20 border-red-700 text-red-300'
            : alertLevel === 'urgent' ? 'bg-orange-900/20 border-orange-700 text-orange-300'
            : 'bg-yellow-900/20 border-yellow-700 text-yellow-300'
          }`}>
            <AlertTriangle size={20} className="flex-shrink-0" />
            <div>
              <p className="font-semibold text-sm">Sibling Fee Due in {daysLeft} days</p>
              <p className="text-xs opacity-75">Saved {formatCurrency(state.siblingFund.currentAmount)} of {formatCurrency(state.siblingFund.quarterlyFeeAmount)}</p>
            </div>
          </div>
        )}

        {/* Financial Health */}
        <Card>
          <div className="flex items-center gap-4 mb-4">
            <ProgressRing progress={health.score} label={`${health.score}`} />
            <div className="flex-1">
              <h2 className="font-bold text-white text-lg">Financial Health</h2>
              <Badge label={health.status} />
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2 text-xs">
            <div className="bg-slate-700/30 p-2 rounded text-center">
              <p className="text-slate-400">Savings</p>
              <p className="font-bold text-emerald-400">{health.savingsRate.toFixed(0)}%</p>
            </div>
            <div className="bg-slate-700/30 p-2 rounded text-center">
              <p className="text-slate-400">Expenses</p>
              <p className="font-bold text-red-400">{health.expenseRatio.toFixed(0)}%</p>
            </div>
            <div className="bg-slate-700/30 p-2 rounded text-center">
              <p className="text-slate-400">Emergency</p>
              <p className="font-bold text-blue-400">{health.emergencyCoverage.toFixed(1)}mo</p>
            </div>
            <div className="bg-slate-700/30 p-2 rounded text-center">
              <p className="text-slate-400">Goals</p>
              <p className="font-bold text-purple-400">{health.goalCompletionPct}%</p>
            </div>
          </div>
        </Card>

        {/* Monthly Summary */}
        <div className="grid grid-cols-3 gap-3">
          <Card>
            <p className="text-slate-400 text-xs">Income</p>
            <p className="text-xl font-bold text-emerald-400">{formatCurrency(income).slice(0, 4)}k</p>
          </Card>
          <Card>
            <p className="text-slate-400 text-xs">Expenses</p>
            <p className="text-xl font-bold text-red-400">{formatCurrency(expenses).slice(0, 4)}k</p>
          </Card>
          <Card>
            <p className="text-slate-400 text-xs">Balance</p>
            <p className={`text-xl font-bold ${balance >= 0 ? 'text-blue-400' : 'text-red-400'}`}>
              {formatCurrency(balance).slice(0, 4)}k
            </p>
          </Card>
        </div>

        {/* Emergency Fund */}
        <Card>
          <div className="flex items-center gap-3 mb-3">
            <Shield size={20} className="text-blue-400" />
            <div className="flex-1">
              <h3 className="font-semibold text-white">Emergency Fund</h3>
              <p className="text-xs text-slate-400">Coverage: {(state.emergencyFund.currentAmount / 18000).toFixed(1)} months</p>
            </div>
            <span className="text-sm font-bold text-blue-400">{Math.round(emergencyProgress)}%</span>
          </div>
          <ProgressBar progress={emergencyProgress} />
          <div className="flex justify-between text-xs text-slate-400 mt-2">
            <span>{formatCurrency(state.emergencyFund.currentAmount)}</span>
            <span>Target: {formatCurrency(state.emergencyFund.targetAmount)}</span>
          </div>
        </Card>

        {/* Sibling Education */}
        <Card>
          <div className="flex items-center gap-3 mb-3">
            <GraduationCap size={20} className="text-purple-400" />
            <div className="flex-1">
              <h3 className="font-semibold text-white">Sibling Education</h3>
              <p className="text-xs text-slate-400">Fee due: {formatCurrency(state.siblingFund.quarterlyFeeAmount)}</p>
            </div>
            <span className="text-sm font-bold text-purple-400">{Math.round(siblingProgress)}%</span>
          </div>
          <ProgressBar progress={siblingProgress} />
          <div className="flex justify-between text-xs text-slate-400 mt-2">
            <span>{formatCurrency(state.siblingFund.currentAmount)}</span>
            <span>Monthly: +{formatCurrency(state.siblingFund.monthlyContribution)}</span>
          </div>
        </Card>

        {/* Gaming PC Fund */}
        <Card>
          <div className="flex items-center gap-3 mb-3">
            <Cpu size={20} className="text-purple-500" />
            <div className="flex-1">
              <h3 className="font-semibold text-white">Gaming PC Fund</h3>
              <p className="text-xs text-slate-400">Target: {formatCurrency(state.gamingPCFund.targetAmount)}</p>
            </div>
            <span className="text-sm font-bold text-purple-400">{Math.round(pcProgress)}%</span>
          </div>
          <ProgressBar progress={pcProgress} />
          <div className="flex justify-between text-xs text-slate-400 mt-2">
            <span>{formatCurrency(state.gamingPCFund.currentAmount)}</span>
            <span>Monthly: +{formatCurrency(state.gamingPCFund.monthlyContribution)}</span>
          </div>
        </Card>

        {/* Net Worth */}
        <Card className="bg-gradient-to-br from-emerald-900/20 to-blue-900/20 border-emerald-700/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-300 text-sm">Total Net Worth</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(netWorth)}</p>
            </div>
            <TrendingUp className="text-emerald-400" size={32} />
          </div>
        </Card>
      </div>
    </div>
  );
}