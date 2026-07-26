export default function TextareaField({ label, error, rows = 3, ...textareaProps }) {
  return (
    <div className="mb-4">
      <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </label>
      <textarea rows={rows} className="input-field resize-none" {...textareaProps} />
      {error && <p className="mt-1.5 text-xs font-medium text-red-500">{error}</p>}
    </div>
  );
}
