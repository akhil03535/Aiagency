export default function SelectField({ label, error, children, ...selectProps }) {
  return (
    <div className="mb-4">
      <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </label>
      <select className="input-field" {...selectProps}>
        {children}
      </select>
      {error && <p className="mt-1.5 text-xs font-medium text-red-500">{error}</p>}
    </div>
  );
}
