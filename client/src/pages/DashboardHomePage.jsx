import { useState, useMemo, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import GeneratorCard from '../components/GeneratorCard.jsx';
import SkeletonCard from '../components/SkeletonCard.jsx';
import { CONTENT_TYPES, CATEGORY_ORDER } from '../utils/contentTypes.js';
import { useBusinessProfiles } from '../hooks/useBusinessProfiles.js';

export default function DashboardHomePage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [isPageLoading, setIsPageLoading] = useState(true);
  const { profiles, isLoading: profilesLoading } = useBusinessProfiles();
  const navigate = useNavigate();

  // Brief artificial delay so the skeleton state is visible even on a
  // fast local network — proves the loading UI actually works.
  useEffect(() => {
    const timer = setTimeout(() => setIsPageLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const filtered = useMemo(() => {
    return CONTENT_TYPES.filter((type) => {
      const matchesCategory = activeCategory === 'All' || type.category === activeCategory;
      const matchesSearch =
        !search.trim() ||
        type.label.toLowerCase().includes(search.toLowerCase()) ||
        type.description.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [search, activeCategory]);

  const handleCardClick = (slug) => {
    navigate(`/dashboard/generate/${slug}`);
  };

  const hasDefaultProfile = !profilesLoading && profiles.some((p) => p.isDefault);

  return (
    <div className="mx-auto max-w-6xl">
      {!profilesLoading && !hasDefaultProfile && (
        <div className="mb-6 flex items-center justify-between rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300">
          <span>Set up your business profile so generated content is personalized.</span>
          <a href="/dashboard/business-profile" className="font-semibold underline">
            Set up now
          </a>
        </div>
      )}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            What are we creating today?
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            23 generators across social, SEO, email, and branding.
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
            placeholder="Search generators..."
            className="input-field w-full pl-10 sm:w-64"
          />
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {['All', ...CATEGORY_ORDER].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={clsx(
              'rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors',
              activeCategory === cat
                ? 'bg-brand-500 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {isPageLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card flex flex-col items-center gap-2 py-16 text-center">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
            No generators match &quot;{search}&quot;
          </p>
          <button
            onClick={() => {
              setSearch('');
              setActiveCategory('All');
            }}
            className="text-sm font-semibold text-brand-600 hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((type) => (
            <GeneratorCard
              key={type.slug}
              label={type.label}
              description={type.description}
              icon={type.icon}
              onClick={() => handleCardClick(type.slug)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
