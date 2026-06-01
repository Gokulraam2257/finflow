import { Settings, Zap, Moon, Sun } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onSettings?: () => void;
}

export function Header({ darkMode, onToggleDarkMode, onSettings }: HeaderProps) {
  return (
    <header className="bg-slate-800 border-b border-slate-700 px-4 py-4 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center">
          <Zap size={16} className="text-blue-500" />
        </div>
        <h1 className="text-lg font-bold text-white">finflow</h1>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleDarkMode}
          className="w-9 h-9 rounded-lg bg-slate-700/50 flex items-center justify-center hover:bg-slate-700 transition-colors text-slate-300"
        >
          {darkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>
        {onSettings && (
          <button
            onClick={onSettings}
            className="w-9 h-9 rounded-lg bg-slate-700/50 flex items-center justify-center hover:bg-slate-700 transition-colors text-slate-300"
          >
            <Settings size={16} />
          </button>
        )}
      </div>
    </header>
  );
}