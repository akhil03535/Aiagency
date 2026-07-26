import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, LayoutTemplate } from 'lucide-react';
import toast from 'react-hot-toast';
import SkeletonCard from '../components/SkeletonCard.jsx';
import ComingSoonPanel from '../components/ComingSoonPanel.jsx';
import templatesService from '../services/templates.service';

export default function TemplatesPage() {
  const [templates, setTemplates] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    Promise.all([templatesService.list(), templatesService.listCategories()])
      .then(([t, c]) => {
        if (cancelled) return;
        setTemplates(t);
        setCategories(c);
      })
      .catch(() => toast.error('Could not load templates.'))
      .finally(() => !cancelled && setIsLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    return templates.filter((t) => {
      const matchesCategory = !activeCategory || t.category?.slug === activeCategory;
      if (!matchesCategory) return false;
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        t.name.toLowerCase().includes(q) ||
        t.businessType.toLowerCase().includes(q) ||
        (t.description || '').toLowerCase().includes(q)
      );
    });
  }, [templates, search, activeCategory]);

  const grouped = useMemo(() => {
    const byCategory = {};
    for (const t of filtered) {
      const key = t.category?.name || 'Other';
      if (!byCategory[key]) byCategory[key] = [];
      byCategory[key].push(t);
    }
    return byCategory;
  }, [filtered]);

  const handleUseTemplate = (template) => {
    // Templates prefill defaults on the generator form for a chosen content
    // type. Since a template isn't tied to one content type, land the
    // person on Instagram (the most common starting point) with the
    // template pre-selected via query state, letting them switch types.
    navigate('/dashboard/generate/instagram', {
      state: { suggestedTemplateId: template.id },
    });
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Templates</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Prebuilt defaults for common business types — {templates.length} available.
          </p>
        </div>
        <div className="relative">
          <Search
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search templates..."
            className="input-field w-full pl-10 sm:w-64"
          />
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory('')}
          className={
            !activeCategory
              ? 'rounded-full bg-brand-500 px-3.5 py-1.5 text-xs font-semibold text-white'
              : 'rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
          }
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.slug)}
            className={
              activeCategory === cat.slug
                ? 'rounded-full bg-brand-500 px-3.5 py-1.5 text-xs font-semibold text-white'
                : 'rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
            }
          >
            {cat.name}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <ComingSoonPanel
          icon={LayoutTemplate}
          title="No templates match your search"
          description="Try a different search term."
        />
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([categoryName, items]) => (
            <div key={categoryName}>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {categoryName}
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => handleUseTemplate(t)}
                    className="glass-card flex flex-col items-start gap-2 p-5 text-left transition-all hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-[11px] font-semibold text-brand-700 dark:bg-brand-900/30 dark:text-brand-300">
                      {t.businessType}
                    </span>
                    <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                      {t.name}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {t.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
