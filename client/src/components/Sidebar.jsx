import { NavLink } from 'react-router-dom';
import {
  LayoutGrid,
  Building2,
  History,
  Star,
  Settings,
  Sparkles,
  X,
  LayoutTemplate,
  ShieldCheck,
} from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '../contexts/AuthContext.jsx';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Generators', icon: LayoutGrid, end: true },
  { to: '/dashboard/templates', label: 'Templates', icon: LayoutTemplate },
  { to: '/dashboard/business-profile', label: 'Business Profile', icon: Building2 },
  { to: '/dashboard/history', label: 'History', icon: History },
  { to: '/dashboard/favorites', label: 'Favorites', icon: Star },
  { to: '/dashboard/settings', label: 'Settings', icon: Settings },
];

const ADMIN_NAV_ITEMS = [
  { to: '/dashboard/admin', label: 'Admin Dashboard', icon: ShieldCheck, end: true },
  { to: '/dashboard/admin/users', label: 'Users', icon: Building2 },
  { to: '/dashboard/admin/logs', label: 'Activity Logs', icon: History },
];

/**
 * Fixed sidebar on desktop, slide-over drawer on mobile.
 * `isOpen`/`onClose` only matter below the md breakpoint.
 * The Admin section only renders for users with role === 'ADMIN'.
 */
export default function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-200 dark:border-slate-800 dark:bg-slate-900',
          'md:static md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-white">
              <Sparkles size={16} />
            </div>
            <span className="font-bold tracking-tight">AI Agency</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300'
                    : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
                )
              }
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}

          {isAdmin && (
            <>
              <div className="mb-1 mt-4 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Admin
              </div>
              {ADMIN_NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  onClick={onClose}
                  className={({ isActive }) =>
                    clsx(
                      'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300'
                        : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
                    )
                  }
                >
                  <Icon size={17} />
                  {label}
                </NavLink>
              ))}
            </>
          )}
        </nav>

        <div className="px-5 py-4 text-xs text-slate-400">
          AI Agency &middot; v1.0
        </div>
      </aside>
    </>
  );
}
