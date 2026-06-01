import { useState, useEffect } from 'react';
import { AppProvider } from './context/AppContext';
import { Dashboard } from './pages/Dashboard';
import { Income } from './pages/Income';
import { Expenses } from './pages/Expenses';
import { Goals } from './pages/Goals';
import { Reports } from './pages/Reports';
import { FinancialCoach } from './pages/FinancialCoach';
import { Header } from './components/layout/Header';
import { BottomNav } from './components/layout/BottomNav';
import { Menu, BarChart3, Wallet, Target, BookOpen, Lightbulb } from 'lucide-react';

type Page = 'dashboard' | 'income' | 'expenses' | 'goals' | 'reports' | 'coach';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const pages: Record<Page, { label: string; icon: React.ReactNode; component: React.ReactNode }> = {
    dashboard: { label: 'Dashboard', icon: <Menu size={20} />, component: <Dashboard /> },
    income: { label: 'Income', icon: <Wallet size={20} />, component: <Income /> },
    expenses: { label: 'Expenses', icon: <BarChart3 size={20} />, component: <Expenses /> },
    goals: { label: 'Goals', icon: <Target size={20} />, component: <Goals /> },
    reports: { label: 'Reports', icon: <BookOpen size={20} />, component: <Reports /> },
    coach: { label: 'Coach', icon: <Lightbulb size={20} />, component: <FinancialCoach /> },
  };

  return (
    <div className="flex flex-col h-screen bg-slate-900 dark:bg-slate-900">
      <Header darkMode={darkMode} onToggleDarkMode={() => setDarkMode(!darkMode)} />
      <div className="flex-1 overflow-auto">
        {pages[currentPage].component}
      </div>
      <BottomNav currentPage={currentPage} onPageChange={setCurrentPage} pages={pages} />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
