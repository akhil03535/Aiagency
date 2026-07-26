import { ArrowUpRight } from 'lucide-react';

/**
 * A single content-type card on the dashboard grid. Clicking navigates
 * to the generator page for that content type (wired up in Phase 4 —
 * for now it's a placeholder toast so the grid is fully interactive).
 */
export default function GeneratorCard({ label, description, icon: Icon, onClick }) {
  return (
    <button
      onClick={onClick}
      className="glass-card group flex flex-col items-start gap-3 p-5 text-left transition-all duration-150 hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="flex w-full items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-500 group-hover:text-white dark:bg-brand-900/30 dark:text-brand-300">
          <Icon size={18} />
        </div>
        <ArrowUpRight
          size={16}
          className="text-slate-300 opacity-0 transition-opacity group-hover:opacity-100 dark:text-slate-600"
        />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">{label}</h3>
        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{description}</p>
      </div>
    </button>
  );
}
