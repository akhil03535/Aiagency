import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const LABEL_OVERRIDES = {
  shortVersion: 'Short Version',
  threadVersion: 'Thread Version',
  bulletFeatures: 'Key Features',
  primaryTitle: 'Primary Title',
  primaryDescription: 'Primary Description',
  primaryKeywords: 'Primary Keywords',
  longTailKeywords: 'Long-Tail Keywords',
  localKeywords: 'Local Keywords',
  metaDescription: 'Meta Description',
  subjectLine: 'Subject Line',
  previewText: 'Preview Text',
  alternativeSubjectLines: 'Alternative Subject Lines',
  primaryPrompt: 'Primary Prompt',
  styleVariants: 'Style Variants',
  negativePrompt: 'Negative Prompt (avoid)',
  sceneBreakdown: 'Scene Breakdown',
  suggestedTags: 'Suggested Tags',
  headlineAlternatives: 'Headline Alternatives',
  primaryText: 'Primary Text',
  ctaButton: 'CTA Button',
  replyPositive: 'Reply (Positive Review)',
  replyNegative: 'Reply (Negative Review)',
  quickWins: 'Quick Wins',
  buttonCtas: 'Button CTAs',
  sentenceCtas: 'Sentence CTAs',
};

function formatLabel(key) {
  if (LABEL_OVERRIDES[key]) return LABEL_OVERRIDES[key];
  const withSpaces = key.replace(/([A-Z])/g, ' $1');
  return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
}

export default function OutputSection({ fieldKey, content }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-800/40">
      <div className="mb-2 flex items-center justify-between">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {formatLabel(fieldKey)}
        </h4>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400">{content.length} chars</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-brand-600 transition hover:bg-brand-50 dark:text-brand-400 dark:hover:bg-brand-900/30"
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
      </div>
      <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700 dark:text-slate-200">
        {content}
      </p>
    </div>
  );
}
