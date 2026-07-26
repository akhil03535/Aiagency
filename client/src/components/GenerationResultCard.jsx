import { useState } from 'react';
import { Star, Trash2, RotateCw, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { getContentTypeMeta } from '../utils/contentTypeLookup.js';

/**
 * Compact card for a single past generation — used in both History and
 * Favorites. The full raw output is collapsed by default since these
 * lists can get long; expand to read/copy the whole thing.
 */
export default function GenerationResultCard({
  generation,
  isFavorited,
  onToggleFavorite,
  onDelete,
  onReuse,
  showDelete = true,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const meta = getContentTypeMeta(generation.contentType);
  const Icon = meta.icon;

  const preview = generation.outputContent?.slice(0, 160) || '';
  const isTruncated = (generation.outputContent?.length || 0) > 160;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generation.outputContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="glass-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-300">
            <Icon size={16} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              {meta.label}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{generation.topic}</p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          {onToggleFavorite && (
            <button
              onClick={onToggleFavorite}
              className={
                isFavorited
                  ? 'rounded-lg p-1.5 text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/30'
                  : 'rounded-lg p-1.5 text-slate-300 hover:bg-slate-100 dark:text-slate-600 dark:hover:bg-slate-800'
              }
              title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Star size={15} fill={isFavorited ? 'currentColor' : 'none'} />
            </button>
          )}
          {onReuse && (
            <button
              onClick={onReuse}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Reuse this input"
            >
              <RotateCw size={15} />
            </button>
          )}
          {showDelete && onDelete && (
            <button
              onClick={onDelete}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30"
              title="Delete"
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>
      </div>

      <p className="mt-3 whitespace-pre-wrap text-sm text-slate-600 dark:text-slate-300">
        {isExpanded ? generation.outputContent : preview}
        {!isExpanded && isTruncated && '...'}
      </p>

      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isTruncated && (
            <button
              onClick={() => setIsExpanded((v) => !v)}
              className="flex items-center gap-1 text-xs font-medium text-brand-600 hover:underline dark:text-brand-400"
            >
              {isExpanded ? (
                <>
                  <ChevronUp size={12} /> Show less
                </>
              ) : (
                <>
                  <ChevronDown size={12} /> Show more
                </>
              )}
            </button>
          )}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-brand-600 dark:hover:text-brand-400"
          >
            {copied ? (
              <>
                <Check size={12} /> Copied
              </>
            ) : (
              <>
                <Copy size={12} /> Copy
              </>
            )}
          </button>
        </div>
        <span className="text-[11px] text-slate-400">
          {new Date(generation.createdAt).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
          })}
        </span>
      </div>
    </div>
  );
}
