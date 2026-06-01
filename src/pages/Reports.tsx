import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import {
  last6MonthKeys,
  monthlyIncome,
  monthlyExpenses,
  entriesForMonth,
  currentMonthKey,
  forecastCashFlow,
  forecastSiblingFees,
} from '../utils/finance';
import { formatCurrency, monthLabel } from '../utils/formatters';
import type { ExpenseCategory, IncomeSource } from '../types';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download } from 'lucide-react';
import { exportJSON, exportCSV } from '../services/storage';

export function Reports() {
  const { state } = useApp();
  const [period, setPeriod] = useState<'month' | '3months' | '6months' | 'year'>('month');

  const keys = last6MonthKeys();
  const currentMonth = currentMonthKey();

  // Income vs Expenses Trend
  const trendData = keys.map((key) => ({
    month: monthLabel(key),
    income: monthlyIncome(state, key),
    expenses: monthlyExpenses(state, key),
    savings: monthlyIncome(state, key) - monthlyExpenses(state, key),
  }));

  // Current month breakdown
  const currentExpenses = entriesForMonth(state.expenseEntries, currentMonth);
  const expenseByCategory: Record<ExpenseCategory, number> = {
    rent: 0, food: 0, transport: 0, home_contribution: 0,
    sibling_education: 0, medical: 0, shopping: 0, entertainment: 0,
    bills: 0, subscriptions: 0, miscellaneous: 0,
  };

  currentExpenses.forEach((exp) => {
    expenseByCategory[exp.category] += exp.amount;
  });

  const expenseChartData = Object.entries(expenseByCategory)
    .filter(([_, amount]) => amount > 0)
    .map(([category, amount]) => ({
      name: category.replace(/_/g, ' ').charAt(0).toUpperCase() + category.slice(1).replace(/_/g, ' '),
      value: amount,
    }));

  const currentIncomes = entriesForMonth(state.incomeEntries, currentMonth);
  const incomeBySource: Record<IncomeSource, number> = {
    salary: 0, bonus: 0, freelance: 0, gift: 0, other: 0,
  };

  currentIncomes.forEach((inc) => {
    incomeBySource[inc.source] += inc.amount;
  });

  const incomeChartData = Object.entries(incomeBySource)
    .filter(([_, amount]) => amount > 0)
    .map(([source, amount]) => ({
      name: source.charAt(0).toUpperCase() + source.slice(1),
      value: amount,
    }));

  // Cash flow forecast
  const cashFlowData = forecastCashFlow(state);

  // Sibling fee forecast
  const siblingFeeData = forecastSiblingFees(state);

  const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#14b8a6'];

  return (
    <div className="flex-1 pb-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Reports & Analytics</h1>
            <p className="text-slate-400">Track your financial trends</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => exportJSON(state)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors text-sm"
            >
              <Download size={16} /> JSON
            </button>
            <button
              onClick={() => exportCSV(state)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center gap-2 transition-colors text-sm"
            >
              <Download size={16} /> CSV
            </button>
          </div>
        </div>

        {/* Period Selector */}
        <div className="flex gap-2 mb-6">
          {(['month', '3months', '6months', 'year'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                period === p
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {p === 'month' && '1M'}
              {p === '3months' && '3M'}
              {p === '6months' && '6M'}
              {p === 'year' && '1Y'}
            </button>
          ))}
        </div>

        {/* Monthly Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <p className="text-slate-400 text-sm">Total Income</p>
            <p className="text-2xl font-bold text-emerald-400">
              {formatCurrency(trendData[trendData.length - 1]?.income || 0)}
            </p>
          </Card>
          <Card>
            <p className="text-slate-400 text-sm">Total Expenses</p>
            <p className="text-2xl font-bold text-red-400">
              {formatCurrency(trendData[trendData.length - 1]?.expenses || 0)}
            </p>
          </Card>
          <Card>
            <p className="text-slate-400 text-sm">This Month Savings</p>
            <p className="text-2xl font-bold text-blue-400">
              {formatCurrency(Math.max(0, trendData[trendData.length - 1]?.savings || 0))}
            </p>
          </Card>
          <Card>
            <p className="text-slate-400 text-sm">Total Funds</p>
            <p className="text-2xl font-bold text-purple-400">
              {formatCurrency(
                state.emergencyFund.currentAmount +
                  state.siblingFund.currentAmount +
                  state.gamingPCFund.currentAmount +
                  state.futureGoals.reduce((s, g) => s + g.currentAmount, 0)
              )}
            </p>
          </Card>
        </div>

        {/* Income vs Expenses Trend */}
        <Card className="mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">Income vs Expenses (6 Months)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#ffffff' }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="income"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: '#10b981' }}
              />
              <Line
                type="monotone"
                dataKey="expenses"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ fill: '#ef4444' }}
              />
              <Line
                type="monotone"
                dataKey="savings"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Expense Breakdown */}
        {expenseChartData.length > 0 && (
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <Card>
              <h2 className="text-lg font-semibold text-white mb-4">Expense Breakdown</h2>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={expenseChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {expenseChartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            <Card>
              <h2 className="text-lg font-semibold text-white mb-4">Top Expenses</h2>
              <div className="space-y-3">
                {expenseChartData
                  .sort((a, b) => b.value - a.value)
                  .slice(0, 5)
                  .map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: colors[expenseChartData.indexOf(item) % colors.length] }}
                        />
                        <span className="text-sm text-slate-300">{item.name}</span>
                      </div>
                      <span className="font-semibold text-white">{formatCurrency(item.value)}</span>
                    </div>
                  ))}
              </div>
            </Card>
          </div>
        )}

        {/* Income Breakdown */}
        {incomeChartData.length > 0 && (
          <Card className="mb-6">
            <h2 className="text-lg font-semibold text-white mb-4">Income Breakdown</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={incomeChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #475569',
                  }}
                  formatter={(value) => formatCurrency(value as number)}
                />
                <Bar dataKey="value" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        )}

        {/* Cash Flow Forecast */}
        <Card className="mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">Cash Flow Forecast</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={cashFlowData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #475569',
                }}
                formatter={(value) => formatCurrency(value as number)}
              />
              <Bar dataKey="projected" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Sibling Fee Forecast */}
        <Card>
          <h2 className="text-lg font-semibold text-white mb-4">Upcoming Sibling Fees</h2>
          <div className="space-y-2">
            {siblingFeeData.map((item, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg flex items-center justify-between ${
                  item.daysLeft <= 7
                    ? 'bg-red-900/20 border border-red-700'
                    : item.daysLeft <= 30
                      ? 'bg-yellow-900/20 border border-yellow-700'
                      : 'bg-slate-700/30 border border-slate-600'
                }`}
              >
                <div>
                  <p className="font-medium text-white">{item.month}</p>
                  <p className="text-sm text-slate-400">{item.daysLeft} days away</p>
                </div>
                <p className="font-bold text-white">{formatCurrency(item.dueAmount)}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
