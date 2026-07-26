export default function ComingSoonPanel({ icon: Icon, title, description, phase }) {
  return (
    <div className="glass-card mx-auto flex max-w-lg flex-col items-center gap-3 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-300">
        <Icon size={22} />
      </div>
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
      <p className="max-w-sm text-sm text-slate-500 dark:text-slate-400">{description}</p>
      {phase && (
        <span className="mt-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
          Coming in {phase}
        </span>
      )}
    </div>
  );
}
