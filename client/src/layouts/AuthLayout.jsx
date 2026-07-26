import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Shared visual shell for Login/Register. Keeps the glassmorphism +
 * brand-gradient language from the landing page consistent here.
 */
export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-brand-50 px-4 dark:from-surface-dark dark:via-slate-900 dark:to-surface-dark">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-white">
            <Sparkles size={18} />
          </div>
          <span className="text-lg font-bold tracking-tight">AI Agency</span>
        </Link>

        <div className="glass-card animate-slideUp p-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h1>
          {subtitle && (
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
          )}

          <div className="mt-6">{children}</div>
        </div>

        {footer && <div className="mt-6 text-center text-sm">{footer}</div>}
      </div>
    </div>
  );
}
