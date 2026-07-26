import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LogOut, Settings, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function ProfileDropdown() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const initials = user?.name
    ?.split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition hover:bg-slate-100 dark:hover:bg-slate-800"
      >
        {user?.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500 text-xs font-semibold text-white">
            {initials || 'U'}
          </div>
        )}
        <span className="hidden text-sm font-medium text-slate-700 dark:text-slate-200 sm:block">
          {user?.name}
        </span>
        <ChevronDown size={14} className="text-slate-400" />
      </button>

      {isOpen && (
        <div className="glass-card absolute right-0 top-full z-50 mt-2 w-56 animate-fadeIn overflow-hidden p-1.5">
          <div className="border-b border-slate-100 px-3 py-2.5 dark:border-slate-700">
            <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
              {user?.name}
            </p>
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">
              {user?.email}
            </p>
          </div>

          <Link
            to="/dashboard/settings"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700/50"
          >
            <Settings size={15} /> Settings
          </Link>

          <button
            onClick={logout}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-red-500 transition hover:bg-red-50 dark:hover:bg-red-950/30"
          >
            <LogOut size={15} /> Log out
          </button>
        </div>
      )}
    </div>
  );
}
