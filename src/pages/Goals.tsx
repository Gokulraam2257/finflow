import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useForm } from 'react-hook-form';
import { Card } from '../components/ui/Card';
import { ProgressRing } from '../components/ui/ProgressRing';
import { formatCurrency, formatDate } from '../utils/formatters';
import { daysUntilFee, siblingFeeAlertLevel, pcFundScenarioDetailed, forecastGoalCompletion } from '../utils/finance';
import type { FutureGoal } from '../types';
import { Trash2, Plus, TrendingUp, AlertTriangle } from 'lucide-react';

export function Goals() {
  const { state, updateEmergencyFund, updateSiblingFund, updateGamingPCFund, addFutureGoal, updateFutureGoal, deleteFutureGoal } = useApp();
  const [activeTab, setActiveTab] = useState<'emergency' | 'sibling' | 'pc' | 'future'>('emergency');
  const [pcScenario, setPCScenario] = useState(5000);

  const { register: registerFuture, handleSubmit: handleFutureSubmit, reset: resetFuture } = useForm<Omit<FutureGoal, 'id'>>({
    defaultValues: {
      name: '',
      targetAmount: 50000,
      currentAmount: 0,
      targetDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      monthlyContribution: 2000,
      icon: '🎯',
    },
  });

  const onAddFutureGoal = (data: Omit<FutureGoal, 'id'>) => {
    addFutureGoal(data);
    resetFuture();
  };

  const forecast = forecastGoalCompletion(state);

  const emergencyProgress = (state.emergencyFund.currentAmount / state.emergencyFund.targetAmount) * 100;
  const siblingProgress = (state.siblingFund.currentAmount / state.siblingFund.quarterlyFeeAmount) * 100;
  const pcProgress = (state.gamingPCFund.currentAmount / state.gamingPCFund.targetAmount) * 100;

  const siblingAlert = siblingFeeAlertLevel(state.siblingFund.nextDueDate);
  const daysSiblingFee = daysUntilFee(state.siblingFund.nextDueDate);

  return (
    <div className="flex-1 pb-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Savings Goals</h1>
          <p className="text-slate-400">Track your financial goals</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {['emergency', 'sibling', 'pc', 'future'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {tab === 'emergency' && '🚨 Emergency'}
              {tab === 'sibling' && '📚 Education'}
              {tab === 'pc' && '🖥️ PC'}
              {tab === 'future' && '🎯 Future'}
            </button>
          ))}
        </div>

        {/* Emergency Fund */}
        {activeTab === 'emergency' && (
          <>
            <Card className="mb-6">
              <h2 className="text-xl font-bold text-white mb-4">Emergency Fund</h2>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-slate-400 text-sm">Current</p>
                  <p className="text-2xl font-bold text-white">{formatCurrency(state.emergencyFund.currentAmount)}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Target</p>
                  <p className="text-2xl font-bold text-blue-400">{formatCurrency(state.emergencyFund.targetAmount)}</p>
                </div>
              </div>

              <ProgressRing progress={emergencyProgress} label={`${Math.round(emergencyProgress)}%`} />

              <div className="mt-6 space-y-3">
                <div>
                  <label className="block text-sm text-slate-300 mb-2">Monthly Contribution (₹)</label>
                  <input
                    type="number"
                    value={state.emergencyFund.monthlyContribution}
                    onChange={(e) => updateEmergencyFund(
                      state.emergencyFund.currentAmount,
                      parseInt(e.target.value),
                      state.emergencyFund.targetAmount
                    )}
                    className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-2">Current Amount (₹)</label>
                  <input
                    type="number"
                    value={state.emergencyFund.currentAmount}
                    onChange={(e) => updateEmergencyFund(
                      parseInt(e.target.value),
                      state.emergencyFund.monthlyContribution,
                      state.emergencyFund.targetAmount
                    )}
                    className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-2">Target Amount (₹)</label>
                  <input
                    type="number"
                    value={state.emergencyFund.targetAmount}
                    onChange={(e) => updateEmergencyFund(
                      state.emergencyFund.currentAmount,
                      state.emergencyFund.monthlyContribution,
                      parseInt(e.target.value)
                    )}
                    className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600"
                  />
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="font-semibold text-white mb-4">Coverage</h3>
              <p className="text-sm text-slate-400 mb-2">
                Covers {((state.emergencyFund.currentAmount / 18000)).toFixed(1)} months of expenses
              </p>
              <p className="text-xs text-slate-500">Target: 6 months</p>
            </Card>
          </>
        )}

        {/* Sibling Education Fund */}
        {activeTab === 'sibling' && (
          <>
            <Card className={`mb-6 border-l-4 ${
              siblingAlert === 'critical' ? 'border-red-600 bg-red-900/20' :
              siblingAlert === 'urgent' ? 'border-orange-600 bg-orange-900/20' :
              siblingAlert === 'warn' ? 'border-yellow-600 bg-yellow-900/20' :
              'border-blue-600'
            }`}>
              <div className="flex items-start gap-3">
                {siblingAlert !== 'none' && <AlertTriangle className="text-yellow-400 flex-shrink-0" />}
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-white mb-2">Sibling Education Fund</h2>
                  {siblingAlert !== 'none' && (
                    <p className={`text-sm font-semibold ${
                      siblingAlert === 'critical' ? 'text-red-300' :
                      siblingAlert === 'urgent' ? 'text-orange-300' :
                      'text-yellow-300'
                    }`}>
                      ⏰ Fee due in {daysSiblingFee} days!
                    </p>
                  )}
                </div>
              </div>
            </Card>

            <Card className="mb-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-slate-400 text-sm">Current Saved</p>
                  <p className="text-2xl font-bold text-white">{formatCurrency(state.siblingFund.currentAmount)}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Quarterly Fee</p>
                  <p className="text-2xl font-bold text-orange-400">{formatCurrency(state.siblingFund.quarterlyFeeAmount)}</p>
                </div>
              </div>

              <ProgressRing progress={siblingProgress} label={`${Math.round(siblingProgress)}%`} />

              <div className="mt-6 space-y-3">
                <div>
                  <label className="block text-sm text-slate-300 mb-2">Monthly Contribution (₹)</label>
                  <input
                    type="number"
                    value={state.siblingFund.monthlyContribution}
                    onChange={(e) => updateSiblingFund(
                      state.siblingFund.currentAmount,
                      parseInt(e.target.value),
                      state.siblingFund.nextDueDate,
                      state.siblingFund.quarterlyFeeAmount
                    )}
                    className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-2">Current Amount (₹)</label>
                  <input
                    type="number"
                    value={state.siblingFund.currentAmount}
                    onChange={(e) => updateSiblingFund(
                      parseInt(e.target.value),
                      state.siblingFund.monthlyContribution,
                      state.siblingFund.nextDueDate,
                      state.siblingFund.quarterlyFeeAmount
                    )}
                    className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-2">Quarterly Fee (₹)</label>
                  <input
                    type="number"
                    value={state.siblingFund.quarterlyFeeAmount}
                    onChange={(e) => updateSiblingFund(
                      state.siblingFund.currentAmount,
                      state.siblingFund.monthlyContribution,
                      state.siblingFund.nextDueDate,
                      parseInt(e.target.value)
                    )}
                    className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-2">Next Due Date</label>
                  <input
                    type="date"
                    value={state.siblingFund.nextDueDate}
                    onChange={(e) => updateSiblingFund(
                      state.siblingFund.currentAmount,
                      state.siblingFund.monthlyContribution,
                      e.target.value,
                      state.siblingFund.quarterlyFeeAmount
                    )}
                    className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600"
                  />
                </div>
              </div>
            </Card>
          </>
        )}

        {/* Gaming PC Fund */}
        {activeTab === 'pc' && (
          <>
            <Card className="mb-6">
              <h2 className="text-xl font-bold text-white mb-4">Gaming PC Fund</h2>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-slate-400 text-sm">Current Savings</p>
                  <p className="text-2xl font-bold text-white">{formatCurrency(state.gamingPCFund.currentAmount)}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Target Budget</p>
                  <p className="text-2xl font-bold text-purple-400">{formatCurrency(state.gamingPCFund.targetAmount)}</p>
                </div>
              </div>

              <ProgressRing progress={pcProgress} label={`${Math.round(pcProgress)}%`} />

              <div className="mt-6 space-y-3">
                <div>
                  <label className="block text-sm text-slate-300 mb-2">Current Savings (₹)</label>
                  <input
                    type="number"
                    value={state.gamingPCFund.currentAmount}
                    onChange={(e) => updateGamingPCFund(
                      parseInt(e.target.value),
                      state.gamingPCFund.monthlyContribution,
                      state.gamingPCFund.targetAmount
                    )}
                    className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-2">Target Budget (₹)</label>
                  <input
                    type="number"
                    value={state.gamingPCFund.targetAmount}
                    onChange={(e) => updateGamingPCFund(
                      state.gamingPCFund.currentAmount,
                      state.gamingPCFund.monthlyContribution,
                      parseInt(e.target.value)
                    )}
                    className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-2">Monthly Contribution (₹)</label>
                  <input
                    type="number"
                    value={state.gamingPCFund.monthlyContribution}
                    onChange={(e) => updateGamingPCFund(
                      state.gamingPCFund.currentAmount,
                      parseInt(e.target.value),
                      state.gamingPCFund.targetAmount
                    )}
                    className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600"
                  />
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingUp size={18} /> Scenarios
              </h3>
              <div className="space-y-3">
                {[5000, 8000, 10000, 12000].map((monthly) => {
                  const scenario = pcFundScenarioDetailed(state, monthly);
                  return (
                    <div
                      key={monthly}
                      onClick={() => setPCScenario(monthly)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        pcScenario === monthly
                          ? 'bg-purple-600/30 border border-purple-500'
                          : 'bg-slate-700/30 border border-slate-600/30 hover:border-slate-500'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-white font-medium">₹{monthly.toLocaleString()}/month</span>
                        <div className="text-right">
                          <p className="text-purple-300 font-semibold">{scenario.monthsRemaining} months</p>
                          <p className="text-xs text-slate-400">{scenario.completionDate}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </>
        )}

        {/* Future Goals */}
        {activeTab === 'future' && (
          <>
            {state.futureGoals.map((goal) => {
              const progress = (goal.currentAmount / goal.targetAmount) * 100;
              return (
                <Card key={goal.id} className="mb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white">{goal.icon} {goal.name}</h3>
                      <p className="text-sm text-slate-400">Target: {formatDate(goal.targetDate)}</p>
                    </div>
                    <button
                      onClick={() => deleteFutureGoal(goal.id)}
                      className="text-slate-400 hover:text-red-400 transition-colors p-1"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <ProgressRing progress={progress} label={`${Math.round(progress)}%`} />

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-slate-400 text-xs">Current</p>
                      <p className="text-lg font-bold text-white">{formatCurrency(goal.currentAmount)}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs">Target</p>
                      <p className="text-lg font-bold text-blue-400">{formatCurrency(goal.targetAmount)}</p>
                    </div>
                  </div>

                  <div className="mt-3 space-y-2">
                    <input
                      type="number"
                      value={goal.currentAmount}
                      onChange={(e) => updateFutureGoal(goal.id, { currentAmount: parseInt(e.target.value) })}
                      className="w-full px-2 py-1 text-sm bg-slate-700 text-white rounded border border-slate-600"
                    />
                  </div>
                </Card>
              );
            })}

            <Card className="mb-6">
              <h2 className="text-lg font-semibold text-white mb-4">Add New Goal</h2>
              <form onSubmit={handleFutureSubmit(onAddFutureGoal)} className="space-y-3">
                <input
                  type="text"
                  placeholder="Goal name (e.g., House, Travel)"
                  {...registerFuture('name', { required: true })}
                  className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 text-sm"
                />
                <input
                  type="number"
                  placeholder="Target amount"
                  {...registerFuture('targetAmount', { required: true, min: 1000 })}
                  className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 text-sm"
                />
                <input
                  type="date"
                  {...registerFuture('targetDate', { required: true })}
                  className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 text-sm"
                />
                <input
                  type="number"
                  placeholder="Monthly contribution"
                  {...registerFuture('monthlyContribution', { required: true, min: 100 })}
                  className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 text-sm"
                />
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm"
                >
                  <Plus size={16} /> Add Goal
                </button>
              </form>
            </Card>
          </>
        )}

        {/* Forecast */}
        {forecast.length > 0 && (
          <Card>
            <h3 className="font-semibold text-white mb-4">Completion Forecast</h3>
            <div className="space-y-2">
              {forecast.map((item, idx) => (
                <div key={idx} className="p-3 bg-slate-700/30 rounded-lg text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-white">{item.goalName}</span>
                    <div className="text-right">
                      <p className="text-blue-300 font-medium">{item.monthsLeft} months</p>
                      <p className="text-slate-400 text-xs">{item.completionDate}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
