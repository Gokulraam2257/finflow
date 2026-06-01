import { useApp } from '../context/AppContext';
import { useForm } from 'react-hook-form';
import { Card } from '../components/ui/Card';
import { entriesForMonth, currentMonthKey, totalAmount } from '../utils/finance';
import { formatCurrency, formatDate } from '../utils/formatters';
import type { IncomeEntry, IncomeSource } from '../types';
import { Trash2, Plus } from 'lucide-react';

export function Income() {
  const { state, addIncome, deleteIncome } = useApp();
  const { register, handleSubmit, reset } = useForm<Omit<IncomeEntry, 'id'>>({
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      source: 'salary',
      notes: '',
    },
  });



  const onSubmit = (data: Omit<IncomeEntry, 'id'>) => {
    addIncome(data);
    reset();
  };

  const monthKey = currentMonthKey();
  const monthlyIncomes = entriesForMonth(state.incomeEntries, monthKey).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const totalMonthlyIncome = totalAmount(monthlyIncomes);

  const incomeBySource: Record<IncomeSource, number> = {
    salary: 0,
    bonus: 0,
    freelance: 0,
    gift: 0,
    other: 0,
  };

  monthlyIncomes.forEach((inc) => {
    incomeBySource[inc.source] += inc.amount;
  });

  const sourceIcons: Record<IncomeSource, string> = {
    salary: '💰',
    bonus: '🎁',
    freelance: '💻',
    gift: '🎉',
    other: '📊',
  };

  const sourceLabels: Record<IncomeSource, string> = {
    salary: 'Salary',
    bonus: 'Bonus',
    freelance: 'Freelance',
    gift: 'Gift',
    other: 'Other',
  };

  return (
    <div className="flex-1 pb-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Income</h1>
          <p className="text-slate-400">Manage your income streams</p>
        </div>

        {/* Monthly Summary */}
        <Card className="mb-6 bg-gradient-to-br from-emerald-900/20 to-emerald-800/10 border-emerald-700/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-300 text-sm font-medium">This Month's Income</p>
              <p className="text-3xl font-bold text-white mt-2">
                {formatCurrency(totalMonthlyIncome)}
              </p>
            </div>
            <div className="text-4xl">💵</div>
          </div>
        </Card>

        {/* Income Breakdown */}
        {Object.entries(incomeBySource).some(([_, amount]) => amount > 0) && (
          <Card className="mb-6">
            <h2 className="text-lg font-semibold text-white mb-4">Income Breakdown</h2>
            <div className="space-y-3">
              {Object.entries(incomeBySource).map(([source, amount]) =>
                amount > 0 ? (
                  <div key={source} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                    <span className="flex items-center gap-2 text-white">
                      <span className="text-xl">{sourceIcons[source as IncomeSource]}</span>
                      {sourceLabels[source as IncomeSource]}
                    </span>
                    <span className="text-emerald-400 font-semibold">{formatCurrency(amount)}</span>
                  </div>
                ) : null
              )}
            </div>
          </Card>
        )}

        {/* Add Income Form */}
        <Card className="mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">Add Income</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Date</label>
              <input
                type="date"
                {...register('date', { required: true })}
                className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Amount</label>
              <input
                type="number"
                {...register('amount', { required: true, min: 1 })}
                placeholder="0"
                className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Source</label>
              <select
                {...register('source', { required: true })}
                className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-emerald-500 focus:outline-none"
              >
                <option value="salary">Salary</option>
                <option value="bonus">Bonus</option>
                <option value="freelance">Freelance</option>
                <option value="gift">Gift</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Notes (Optional)</label>
              <textarea
                {...register('notes')}
                placeholder="Add notes..."
                rows={2}
                className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Plus size={20} /> Add Income
            </button>
          </form>
        </Card>

        {/* Income History */}
        <Card>
          <h2 className="text-lg font-semibold text-white mb-4">History</h2>
          {monthlyIncomes.length === 0 ? (
            <p className="text-slate-400 text-center py-8">No income entries yet</p>
          ) : (
            <div className="space-y-2">
              {monthlyIncomes.map((income) => (
                <div
                  key={income.id}
                  className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/30 hover:border-slate-500/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{sourceIcons[income.source]}</span>
                      <div>
                        <p className="font-semibold text-white">
                          {sourceLabels[income.source]}
                        </p>
                        <p className="text-xs text-slate-400">{formatDate(income.date)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-emerald-400">
                        +{formatCurrency(income.amount)}
                      </span>
                      <button
                        onClick={() => deleteIncome(income.id)}
                        className="text-slate-400 hover:text-red-400 transition-colors p-1"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  {income.notes && (
                    <div className="text-sm text-slate-400 pl-12">{income.notes}</div>
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
