
import { useApp } from '../context/AppContext';
import { useForm } from 'react-hook-form';
import { Card } from '../components/ui/Card';

import { entriesForMonth, currentMonthKey, totalAmount } from '../utils/finance';
import { formatDate, formatCurrency } from '../utils/formatters';
import type { ExpenseEntry, ExpenseCategory } from '../types';
import { Trash2, Plus } from 'lucide-react';

export function Expenses() {
  const { state, addExpense, deleteExpense } = useApp();
  const { register, handleSubmit, reset } = useForm<Omit<ExpenseEntry, 'id'>>({
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      category: 'food',
      notes: '',
    },
  });

  const onSubmit = (data: Omit<ExpenseEntry, 'id'>) => {
    addExpense(data);
    reset();
  };

  const monthKey = currentMonthKey();
  const monthlyExpenses = entriesForMonth(state.expenseEntries, monthKey).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const totalMonthlyExpense = totalAmount(monthlyExpenses);

  const expenseByCategory: Record<ExpenseCategory, number> = {
    rent: 0,
    food: 0,
    transport: 0,
    home_contribution: 0,
    sibling_education: 0,
    medical: 0,
    shopping: 0,
    entertainment: 0,
    bills: 0,
    subscriptions: 0,
    miscellaneous: 0,
  };

  monthlyExpenses.forEach((exp) => {
    expenseByCategory[exp.category] += exp.amount;
  });

  const categoryIcons: Record<ExpenseCategory, string> = {
    rent: '🏠',
    food: '🍜',
    transport: '🚗',
    home_contribution: '👨‍👩‍👧‍👦',
    sibling_education: '📚',
    medical: '⚕️',
    shopping: '🛍️',
    entertainment: '🎬',
    bills: '📄',
    subscriptions: '📱',
    miscellaneous: '📌',
  };

  const categoryLabels: Record<ExpenseCategory, string> = {
    rent: 'Rent',
    food: 'Food',
    transport: 'Transport',
    home_contribution: 'Home Contribution',
    sibling_education: 'Sibling Education',
    medical: 'Medical',
    shopping: 'Shopping',
    entertainment: 'Entertainment',
    bills: 'Bills',
    subscriptions: 'Subscriptions',
    miscellaneous: 'Miscellaneous',
  };

  const topCategories = Object.entries(expenseByCategory)
    .filter(([_, amount]) => amount > 0)
    .sort(([_, a], [__, b]) => b - a)
    .slice(0, 5);

  return (
    <div className="flex-1 pb-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Expenses</h1>
          <p className="text-slate-400">Track your spending</p>
        </div>

        {/* Monthly Summary */}
        <Card className="mb-6 bg-gradient-to-br from-red-900/20 to-red-800/10 border-red-700/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-300 text-sm font-medium">This Month's Expenses</p>
              <p className="text-3xl font-bold text-white mt-2">
                {formatCurrency(totalMonthlyExpense)}
              </p>
            </div>
            <div className="text-4xl">💸</div>
          </div>
        </Card>

        {/* Top Categories */}
        {topCategories.length > 0 && (
          <Card className="mb-6">
            <h2 className="text-lg font-semibold text-white mb-4">Top Categories</h2>
            <div className="space-y-3">
              {topCategories.map(([category, amount]) => (
                <div key={category} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                  <span className="flex items-center gap-2 text-white">
                    <span className="text-xl">{categoryIcons[category as ExpenseCategory]}</span>
                    {categoryLabels[category as ExpenseCategory]}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-red-400 font-semibold">{formatCurrency(amount)}</span>
                    <span className="text-xs text-slate-400 min-w-12 text-right">
                      {((amount / totalMonthlyExpense) * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Add Expense Form */}
        <Card className="mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">Add Expense</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Date</label>
              <input
                type="date"
                {...register('date', { required: true })}
                className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-red-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Amount</label>
              <input
                type="number"
                {...register('amount', { required: true, min: 1 })}
                placeholder="0"
                className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-red-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
              <select
                {...register('category', { required: true })}
                className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-red-500 focus:outline-none"
              >
                <option value="rent">Rent</option>
                <option value="food">Food</option>
                <option value="transport">Transport</option>
                <option value="home_contribution">Home Contribution</option>
                <option value="sibling_education">Sibling Education</option>
                <option value="medical">Medical</option>
                <option value="shopping">Shopping</option>
                <option value="entertainment">Entertainment</option>
                <option value="bills">Bills</option>
                <option value="subscriptions">Subscriptions</option>
                <option value="miscellaneous">Miscellaneous</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Notes (Optional)</label>
              <textarea
                {...register('notes')}
                placeholder="Add notes..."
                rows={2}
                className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-red-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Plus size={20} /> Add Expense
            </button>
          </form>
        </Card>

        {/* Expense History */}
        <Card>
          <h2 className="text-lg font-semibold text-white mb-4">History</h2>
          {monthlyExpenses.length === 0 ? (
            <p className="text-slate-400 text-center py-8">No expense entries yet</p>
          ) : (
            <div className="space-y-2">
              {monthlyExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/30 hover:border-slate-500/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">
                        {categoryIcons[expense.category]}
                      </span>
                      <div>
                        <p className="font-semibold text-white">
                          {categoryLabels[expense.category]}
                        </p>
                        <p className="text-xs text-slate-400">{formatDate(expense.date)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-red-400">
                        -{formatCurrency(expense.amount)}
                      </span>
                      <button
                        onClick={() => deleteExpense(expense.id)}
                        className="text-slate-400 hover:text-red-400 transition-colors p-1"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  {expense.notes && (
                    <div className="text-sm text-slate-400 pl-12">{expense.notes}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
