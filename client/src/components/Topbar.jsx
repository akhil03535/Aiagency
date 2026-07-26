import { Menu, Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext.jsx';
import ProfileDropdown from './ProfileDropdown.jsx';

export default function Topbar({ onMenuClick, title }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white/80 px-4 py-3.5 backdrop-blur-md dark:border-slate-800 dark:bg-surface-dark/80 md:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 md:hidden"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          aria-label="Toggle dark mode"
          className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <ProfileDropdown />
      </div>
    </header>
  );
}
