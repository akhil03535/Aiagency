import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, History as HistoryIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import GenerationResultCard from '../components/GenerationResultCard.jsx';
import SkeletonCard from '../components/SkeletonCard.jsx';
import ComingSoonPanel from '../components/ComingSoonPanel.jsx';
import { useHistory } from '../hooks/useHistory.js';
import { useFavorites } from '../hooks/useFavorites.js';
import historyService from '../services/history.service';
import { CATEGORY_ORDER, CONTENT_TYPES } from '../utils/contentTypes.js';

export default function HistoryPage() {
  const [search, setSearch] = useState('');
  const [contentTypeFilter, setContentTypeFilter] = useState('');
  const navigate = useNavigate();

  const { items, isLoading, deleteItem } = useHistory({
    search,
    contentType: contentTypeFilter,
  });
  const { favoritedIds, toggleFavorite } = useFavorites();

  const handleDelete = async (historyId) => {
    if (!window.confirm('Remove this from your history?')) return;
    try {
      await deleteItem(historyId);
      toast.success('Removed from history');
    } catch (_err) {
      toast.error('Could not delete this item.');
    }
  };

  const handleReuse = async (generationId, contentType) => {
    try {
      const { inputPayload } = await historyService.getReusable(generationId);
      navigate(`/dashboard/generate/${contentType}`, { state: { prefill: inputPayload } });
    } catch (_err) {
      toast.error('Could not load this generation for reuse.');
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">History</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Every piece of content you&apos;ve generated.
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
            placeholder="Search history..."
            className="input-field w-full pl-10 sm:w-64"
          />
        </div>
      </div>

      <div className="mb-6">
        <select
          value={contentTypeFilter}
          onChange={(e) => setContentTypeFilter(e.target.value)}
          className="input-field w-full sm:w-64"
        >
          <option value="">All content types</option>
          {CATEGORY_ORDER.map((cat) => (
            <optgroup key={cat} label={cat}>
              {CONTENT_TYPES.filter((t) => t.category === cat).map((t) => (
                <option key={t.slug} value={t.slug}>
                  {t.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : items.length === 0 ? (
        <ComingSoonPanel
          icon={HistoryIcon}
          title={search || contentTypeFilter ? 'No matching generations' : 'No history yet'}
          description={
            search || contentTypeFilter
              ? 'Try a different search term or clear the filter.'
              : 'Generate your first piece of content and it&apos;ll show up here automatically.'
          }
        />
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <GenerationResultCard
              key={item.historyId}
              generation={item}
              isFavorited={favoritedIds.has(item.id)}
              onToggleFavorite={() => toggleFavorite(item.id, favoritedIds.has(item.id))}
              onDelete={() => handleDelete(item.historyId)}
              onReuse={() => handleReuse(item.id, item.contentType)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
