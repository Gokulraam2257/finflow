import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { AppState, IncomeEntry, ExpenseEntry, FutureGoal } from '../types';
import { loadState, saveState, defaultState } from '../services/storage';
import { uid } from '../utils/formatters';

interface AppContextValue {
  state: AppState;
  addIncome: (entry: Omit<IncomeEntry, 'id'>) => void;
  deleteIncome: (id: string) => void;
  addExpense: (entry: Omit<ExpenseEntry, 'id'>) => void;
  deleteExpense: (id: string) => void;
  updateEmergencyFund: (amount: number, contribution?: number, target?: number) => void;
  updateSiblingFund: (amount: number, contribution?: number, dueDate?: string, fee?: number) => void;
  updateGamingPCFund: (amount: number, contribution?: number, target?: number) => void;
  addFutureGoal: (goal: Omit<FutureGoal, 'id'>) => void;
  updateFutureGoal: (id: string, updates: Partial<FutureGoal>) => void;
  deleteFutureGoal: (id: string) => void;
  updateSettings: (updates: Partial<AppState['settings']>) => void;
  resetState: () => void;
  importState: (s: AppState) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const update = useCallback((updater: (s: AppState) => AppState) => {
    setState((prev) => updater(prev));
  }, []);

  const addIncome = useCallback((entry: Omit<IncomeEntry, 'id'>) => {
    update((s) => ({ ...s, incomeEntries: [{ ...entry, id: uid() }, ...s.incomeEntries] }));
  }, [update]);

  const deleteIncome = useCallback((id: string) => {
    update((s) => ({ ...s, incomeEntries: s.incomeEntries.filter((e) => e.id !== id) }));
  }, [update]);

  const addExpense = useCallback((entry: Omit<ExpenseEntry, 'id'>) => {
    update((s) => ({ ...s, expenseEntries: [{ ...entry, id: uid() }, ...s.expenseEntries] }));
  }, [update]);

  const deleteExpense = useCallback((id: string) => {
    update((s) => ({ ...s, expenseEntries: s.expenseEntries.filter((e) => e.id !== id) }));
  }, [update]);

  const updateEmergencyFund = useCallback((amount: number, contribution?: number, target?: number) => {
    update((s) => ({
      ...s,
      emergencyFund: {
        ...s.emergencyFund,
        currentAmount: amount,
        ...(contribution !== undefined && { monthlyContribution: contribution }),
        ...(target !== undefined && { targetAmount: target }),
      },
    }));
  }, [update]);

  const updateSiblingFund = useCallback((amount: number, contribution?: number, dueDate?: string, fee?: number) => {
    update((s) => ({
      ...s,
      siblingFund: {
        ...s.siblingFund,
        currentAmount: amount,
        ...(contribution !== undefined && { monthlyContribution: contribution }),
        ...(dueDate !== undefined && { nextDueDate: dueDate }),
        ...(fee !== undefined && { quarterlyFeeAmount: fee }),
      },
    }));
  }, [update]);

  const updateGamingPCFund = useCallback((amount: number, contribution?: number, target?: number) => {
    update((s) => ({
      ...s,
      gamingPCFund: {
        ...s.gamingPCFund,
        currentAmount: amount,
        ...(contribution !== undefined && { monthlyContribution: contribution }),
        ...(target !== undefined && { targetAmount: target }),
      },
    }));
  }, [update]);

  const addFutureGoal = useCallback((goal: Omit<FutureGoal, 'id'>) => {
    update((s) => ({ ...s, futureGoals: [...s.futureGoals, { ...goal, id: uid() }] }));
  }, [update]);

  const updateFutureGoal = useCallback((id: string, updates: Partial<FutureGoal>) => {
    update((s) => ({
      ...s,
      futureGoals: s.futureGoals.map((g) => (g.id === id ? { ...g, ...updates } : g)),
    }));
  }, [update]);

  const deleteFutureGoal = useCallback((id: string) => {
    update((s) => ({ ...s, futureGoals: s.futureGoals.filter((g) => g.id !== id) }));
  }, [update]);

  const updateSettings = useCallback((updates: Partial<AppState['settings']>) => {
    update((s) => ({ ...s, settings: { ...s.settings, ...updates } }));
  }, [update]);

  const resetState = useCallback(() => {
    setState(defaultState);
  }, []);

  const importState = useCallback((s: AppState) => setState(s), []);

  return (
    <AppContext.Provider value={{
      state, addIncome, deleteIncome, addExpense, deleteExpense,
      updateEmergencyFund, updateSiblingFund, updateGamingPCFund,
      addFutureGoal, updateFutureGoal, deleteFutureGoal,
      updateSettings, resetState, importState,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}