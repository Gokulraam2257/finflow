import clsx from 'clsx';

type Page = 'dashboard' | 'income' | 'expenses' | 'goals' | 'reports' | 'coach';

interface BottomNavProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
  pages: Record<Page, { label: string; icon: React.ReactNode; component: React.ReactNode }>;
}

export function BottomNav({ currentPage, onPageChange, pages }: BottomNavProps) {
  const pageList: Page[] = ['dashboard', 'income', 'expenses', 'goals', 'reports', 'coach'];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-slate-800 border-t border-slate-700 safe-bottom">
      <div className="flex overflow-x-auto">
        {pageList.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={clsx(
              'flex-1 flex flex-col items-center py-3 gap-1 transition-all duration-200 whitespace-nowrap min-w-max px-4',
              currentPage === page
                ? 'text-blue-400 border-t-2 border-blue-400'
                : 'text-slate-400 hover:text-slate-300'
            )}
          >
            {pages[page].icon}
            <span className="text-xs font-medium">{pages[page].label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}