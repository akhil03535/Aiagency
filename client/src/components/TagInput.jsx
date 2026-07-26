import { useState } from 'react';
import { X } from 'lucide-react';

/**
 * Simple chip-style input: type a value, press Enter or comma to add it,
 * click the x to remove. Used for products, services, keywords lists.
 */
export default function TagInput({ label, value = [], onChange, placeholder }) {
  const [draft, setDraft] = useState('');

  const addTag = () => {
    const trimmed = draft.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setDraft('');
  };

  const removeTag = (tag) => {
    onChange(value.filter((t) => t !== tag));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && !draft && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
  };

  return (
    <div className="mb-4">
      <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </label>
      <div className="input-field flex flex-wrap items-center gap-1.5 py-2">
        {value.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1 rounded-lg bg-brand-50 px-2 py-1 text-xs font-medium text-brand-700 dark:bg-brand-900/40 dark:text-brand-300"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="rounded-full hover:bg-brand-100 dark:hover:bg-brand-800"
            >
              <X size={11} />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addTag}
          placeholder={value.length === 0 ? placeholder : ''}
          className="min-w-[100px] flex-1 border-none bg-transparent p-0.5 text-sm outline-none placeholder:text-slate-400"
        />
      </div>
      <p className="mt-1 text-xs text-slate-400">Press Enter or comma to add</p>
    </div>
  );
}
