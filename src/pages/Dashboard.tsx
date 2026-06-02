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
    <div className="flex-1 pb-32 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-900 min-h-screen">
      <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-8">
        {/* Header */}
        <div className="pt-4">
          <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-slate-400 text-lg">Your financial overview</p>
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
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-blue-900/30">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Financial Health</h2>
              <p className="text-slate-400">Your overall financial status</p>
            </div>
            <div className="flex items-center justify-center gap-8">
              <ProgressRing progress={health.score} label={`${health.score}`} />
              <div className="space-y-2">
                <Badge label={health.status} />
                <p className="text-sm text-slate-300">Keep improving your finances</p>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2 text-xs mt-4">
              <div className="bg-slate-700/30 p-3 rounded-lg text-center">
                <p className="text-slate-400 text-xs font-semibold">Savings</p>
                <p className="font-bold text-emerald-400 mt-1">{health.savingsRate.toFixed(0)}%</p>
              </div>
              <div className="bg-slate-700/30 p-3 rounded-lg text-center">
                <p className="text-slate-400 text-xs font-semibold">Expenses</p>
                <p className="font-bold text-red-400 mt-1">{health.expenseRatio.toFixed(0)}%</p>
              </div>
              <div className="bg-slate-700/30 p-3 rounded-lg text-center">
                <p className="text-slate-400 text-xs font-semibold">Emergency</p>
                <p className="font-bold text-blue-400 mt-1">{health.emergencyCoverage.toFixed(1)}mo</p>
              </div>
              <div className="bg-slate-700/30 p-3 rounded-lg text-center">
                <p className="text-slate-400 text-xs font-semibold">Goals</p>
                <p className="font-bold text-purple-400 mt-1">{health.goalCompletionPct}%</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Monthly Summary */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-slate-800/40">
            <div className="text-center">
              <p className="text-xs text-slate-400 font-semibold mb-2">INCOME</p>
              <p className="text-2xl font-bold text-green-400">{formatCurrency(income).slice(0, 4)}k</p>
            </div>
          </Card>
          <Card className="bg-slate-800/40">
            <div className="text-center">
              <p className="text-xs text-slate-400 font-semibold mb-2">EXPENSES</p>
              <p className="text-2xl font-bold text-red-400">{formatCurrency(expenses).slice(0, 4)}k</p>
            </div>
          </Card>
          <Card className="bg-slate-800/40">
            <div className="text-center">
              <p className="text-xs text-slate-400 font-semibold mb-2">BALANCE</p>
              <p className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-400' : 'text-red-400'}`}>
                {formatCurrency(balance).slice(0, 4)}k
              </p>
            </div>
          </Card>
        </div>

        {/* Savings Goals */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Savings Goals Progress</h2>
          
          {/* Emergency Fund */}
          <Card className="bg-slate-800/50 border-blue-900/30">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Shield size={24} className="text-blue-400" />
                <div>
                  <h3 className="font-bold text-white">🚨 Emergency Fund</h3>
                  <p className="text-xs text-slate-400">Coverage: {(state.emergencyFund.currentAmount / 18000).toFixed(1)} months</p>
                </div>
              </div>
              <span className="text-lg font-bold text-blue-400">{Math.round(emergencyProgress)}%</span>
            </div>
            <ProgressBar progress={emergencyProgress} />
            <div className="flex justify-between text-sm text-slate-400 mt-3">
              <span>{formatCurrency(state.emergencyFund.currentAmount)}</span>
              <span>Target: {formatCurrency(state.emergencyFund.targetAmount)}</span>
            </div>
          </Card>

          
          {/* Sibling Education */}
          <Card className="bg-slate-800/50 border-orange-900/30">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <GraduationCap size={24} className="text-orange-400" />
                <div>
                  <h3 className="font-bold text-white">📚 Sibling Education</h3>
                  <p className="text-xs text-slate-400">Fee due: {formatCurrency(state.siblingFund.quarterlyFeeAmount)}</p>
                </div>
              </div>
              <span className="text-lg font-bold text-orange-400">{Math.round(siblingProgress)}%</span>
            </div>
            <ProgressBar progress={siblingProgress} />
            <div className="flex justify-between text-sm text-slate-400 mt-3">
              <span>{formatCurrency(state.siblingFund.currentAmount)}</span>
              <span>Monthly: +{formatCurrency(state.siblingFund.monthlyContribution)}</span>
            </div>
          </Card>

          {/* Gaming PC Fund */}
          <Card className="bg-slate-800/50 border-purple-900/30">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Cpu size={24} className="text-purple-400" />
                <div>
                  <h3 className="font-bold text-white">🎮 Gaming PC Fund</h3>
                  <p className="text-xs text-slate-400">Target: {formatCurrency(state.gamingPCFund.targetAmount)}</p>
                </div>
              </div>
              <span className="text-lg font-bold text-purple-400">{Math.round(pcProgress)}%</span>
            </div>
            <ProgressBar progress={pcProgress} />
            <div className="flex justify-between text-sm text-slate-400 mt-3">
              <span>{formatCurrency(state.gamingPCFund.currentAmount)}</span>
              <span>Monthly: +{formatCurrency(state.gamingPCFund.monthlyContribution)}</span>
            </div>
          </Card>
        </div>

        {/* Net Worth */}
        <Card className="bg-gradient-to-br from-emerald-900/30 to-blue-900/30 border-emerald-700/30">
          <div className="flex items-center justify-between p-2">
            <div>
              <p className="text-emerald-300 text-sm font-semibold">Total Net Worth</p>
              <p className="text-3xl font-bold text-white mt-1">{formatCurrency(netWorth)}</p>
            </div>
            <TrendingUp className="text-emerald-400" size={40} />
          </div>
        </Card>
      </div>
    </div>
  );
}