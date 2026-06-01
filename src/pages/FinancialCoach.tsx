import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import {
  computeHealthScore,
  generateRecommendations,
  simulateExpense,
  forecastGoalCompletion,
  calculateNetWorth,
  savingsStreak,
  noSpendDaysThisMonth,
  emergencyReadinessScore,
  pcReadinessScore,
} from '../utils/finance';
import { formatCurrency } from '../utils/formatters';
import { AlertTriangle, TrendingUp, Zap, Target, Trophy } from 'lucide-react';

export function FinancialCoach() {
  const { state } = useApp();
  const [simulationAmount, setSimulationAmount] = useState<number>(25000);
  const [simulationName, setSimulationName] = useState('Major Expense');

  const health = computeHealthScore(state);
  const recommendations = generateRecommendations(state);
  const forecast = forecastGoalCompletion(state);
  const netWorth = calculateNetWorth(state);
  const streak = savingsStreak(state);
  const noSpendDays = noSpendDaysThisMonth(state);
  const emergencyScore = emergencyReadinessScore(state);
  const pcScore = pcReadinessScore(state);

  const simulation = simulateExpense(state, simulationAmount, simulationName);

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'Excellent':
        return 'text-emerald-400 bg-emerald-900/20';
      case 'Good':
        return 'text-blue-400 bg-blue-900/20';
      case 'Average':
        return 'text-yellow-400 bg-yellow-900/20';
      case 'Poor':
        return 'text-orange-400 bg-orange-900/20';
      case 'Critical':
        return 'text-red-400 bg-red-900/20';
      default:
        return 'text-slate-400';
    }
  };

  return (
    <div className="flex-1 pb-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">💡 Financial Coach</h1>
          <p className="text-slate-400">Personalized insights and strategies</p>
        </div>

        {/* Health Score */}
        <Card className="mb-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Financial Health Score</h2>
            <div className={`text-4xl font-bold px-4 py-2 rounded-lg ${getHealthColor(health.status)}`}>
              {health.score}
            </div>
          </div>
          <div className={`p-3 rounded-lg ${getHealthColor(health.status)} text-sm font-semibold mb-4`}>
            Status: {health.status}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-slate-700/30 p-3 rounded-lg">
              <p className="text-slate-400 text-xs">Savings Rate</p>
              <p className="text-xl font-bold text-emerald-400">{health.savingsRate.toFixed(0)}%</p>
            </div>
            <div className="bg-slate-700/30 p-3 rounded-lg">
              <p className="text-slate-400 text-xs">Expense Ratio</p>
              <p className="text-xl font-bold text-red-400">{health.expenseRatio.toFixed(0)}%</p>
            </div>
            <div className="bg-slate-700/30 p-3 rounded-lg">
              <p className="text-slate-400 text-xs">Emergency Coverage</p>
              <p className="text-xl font-bold text-blue-400">{health.emergencyCoverage.toFixed(1)} mo</p>
            </div>
            <div className="bg-slate-700/30 p-3 rounded-lg">
              <p className="text-slate-400 text-xs">Goal Progress</p>
              <p className="text-xl font-bold text-purple-400">{health.goalCompletionPct}%</p>
            </div>
          </div>
        </Card>

        {/* Net Worth & Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Card>
            <p className="text-slate-400 text-sm mb-1">Net Worth</p>
            <p className="text-2xl font-bold text-white">{formatCurrency(netWorth)}</p>
            <p className="text-xs text-slate-500 mt-2">All savings combined</p>
          </Card>
          <Card>
            <p className="text-slate-400 text-sm mb-1">Savings Streak</p>
            <p className="text-2xl font-bold text-emerald-400">{streak} months</p>
            <p className="text-xs text-slate-500 mt-2">Keep it going!</p>
          </Card>
          <Card>
            <p className="text-slate-400 text-sm mb-1">No-Spend Days</p>
            <p className="text-2xl font-bold text-blue-400">{noSpendDays}</p>
            <p className="text-xs text-slate-500 mt-2">This month</p>
          </Card>
        </div>

        {/* Recommendations */}
        <Card className="mb-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Zap size={20} className="text-yellow-400" /> Recommendations
          </h2>
          <div className="space-y-3">
            {recommendations.map((rec, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border-l-4 ${
                  rec.priority === 'high'
                    ? 'bg-red-900/20 border-red-600'
                    : rec.priority === 'medium'
                      ? 'bg-yellow-900/20 border-yellow-600'
                      : 'bg-slate-700/30 border-slate-600'
                }`}
              >
                <p className="font-semibold text-white mb-1">{rec.title}</p>
                <p className="text-sm text-slate-300 mb-2">{rec.description}</p>
                {rec.suggestedAmount && (
                  <p className="text-sm text-slate-400">
                    Suggested: <span className="font-bold text-white">{formatCurrency(rec.suggestedAmount)}</span>
                  </p>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Readiness Scores */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <Card>
            <h3 className="font-bold text-white mb-3 flex items-center gap-2">
              <Trophy size={18} className="text-yellow-400" /> Emergency Fund Readiness
            </h3>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-red-500 to-emerald-500 h-full transition-all"
                    style={{ width: `${emergencyScore}%` }}
                  />
                </div>
              </div>
              <div className="text-2xl font-bold text-white min-w-12 text-right">{emergencyScore}%</div>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              {emergencyScore >= 100
                ? '✅ Your emergency fund is fully funded!'
                : emergencyScore >= 60
                  ? '⚠️ Getting there! Keep building.'
                  : '🚨 Prioritize building this fund.'}
            </p>
          </Card>

          <Card>
            <h3 className="font-bold text-white mb-3 flex items-center gap-2">
              <Target size={18} className="text-purple-400" /> PC Fund Readiness
            </h3>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all"
                    style={{ width: `${pcScore}%` }}
                  />
                </div>
              </div>
              <div className="text-2xl font-bold text-white min-w-12 text-right">{pcScore}%</div>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              {pcScore >= 100
                ? '🎉 Your PC is ready to buy!'
                : pcScore >= 50
                  ? '💪 Halfway there!'
                  : '⏳ More time needed.'}
            </p>
          </Card>
        </div>

        {/* Scenario Simulation */}
        <Card className="mb-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp size={20} className="text-blue-400" /> Can I Afford This?
          </h2>
          <div className="space-y-3 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">What do you want to buy?</label>
              <input
                type="text"
                value={simulationName}
                onChange={(e) => setSimulationName(e.target.value)}
                placeholder="e.g., iPhone, Laptop"
                className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Cost (₹)</label>
              <input
                type="number"
                value={simulationAmount}
                onChange={(e) => setSimulationAmount(parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 text-sm"
              />
            </div>
          </div>

          {/* Results */}
          <div className={`p-4 rounded-lg mb-4 ${
            simulation.feasible
              ? 'bg-emerald-900/20 border border-emerald-700'
              : 'bg-red-900/20 border border-red-700'
          }`}>
            <p className={`font-bold text-lg mb-2 ${simulation.feasible ? 'text-emerald-400' : 'text-red-400'}`}>
              {simulation.feasible ? '✅ Yes, you can afford it!' : '❌ Be careful!'}
            </p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-slate-400">Impact on Emergency</p>
                <p className="font-bold text-white">-{formatCurrency(simulation.impactOnEmergency)}</p>
              </div>
              <div>
                <p className="text-slate-400">Impact on PC Fund</p>
                <p className="font-bold text-white">-{formatCurrency(simulation.impactOnPC)}</p>
              </div>
              <div>
                <p className="text-slate-400">PC Delay</p>
                <p className="font-bold text-white">{simulation.delayMonths} months</p>
              </div>
              <div>
                <p className="text-slate-400">New PC Date</p>
                <p className="font-bold text-white">{simulation.updatedPCDate}</p>
              </div>
            </div>
            {simulation.warning && (
              <p className="text-sm text-red-300 mt-3 flex items-center gap-1">
                <AlertTriangle size={14} /> {simulation.warning}
              </p>
            )}
          </div>
        </Card>

        {/* Goal Forecast */}
        <Card>
          <h2 className="text-xl font-bold text-white mb-4">Goal Completion Forecast</h2>
          <div className="space-y-3">
            {forecast.map((goal, idx) => (
              <div key={idx} className="p-3 bg-slate-700/30 rounded-lg border border-slate-600/30">
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium text-sm">{goal.goalName}</span>
                  <div className="text-right">
                    <p className="text-blue-300 font-bold">{goal.monthsLeft} months</p>
                    <p className="text-xs text-slate-400">{goal.completionDate}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Strategy */}
        <Card className="mt-6 bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-700/30">
          <h2 className="text-xl font-bold text-white mb-4">📋 Your Personalized Strategy</h2>
          <div className="space-y-4 text-sm">
            <div>
              <p className="font-semibold text-blue-300 mb-1">Priority 1: Emergency Fund</p>
              <p className="text-slate-300">
                Build ₹60,000 emergency fund first. This is your financial safety net. Current progress: ₹{state.emergencyFund.currentAmount.toLocaleString()}/₹{state.emergencyFund.targetAmount.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="font-semibold text-blue-300 mb-1">Priority 2: Sibling Education</p>
              <p className="text-slate-300">
                Ensure quarterly fees are always covered. Set aside ₹{state.siblingFund.monthlyContribution.toLocaleString()}/month.
              </p>
            </div>
            <div>
              <p className="font-semibold text-blue-300 mb-1">Priority 3: Future Fund</p>
              <p className="text-slate-300">
                Allocate ₹2,000-3,000/month for travel, marriage, or investments. Compound interest is your friend.
              </p>
            </div>
            <div>
              <p className="font-semibold text-blue-300 mb-1">Priority 4: Gaming PC</p>
              <p className="text-slate-300">
                Once emergency fund is ₹30,000+, boost PC savings. Current allocation: ₹{state.gamingPCFund.monthlyContribution.toLocaleString()}/month
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
