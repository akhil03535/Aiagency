import { useMemo, useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  Loader2,
  Sparkles,
  RotateCw,
  Download,
  Bookmark,
  Clock,
  LayoutTemplate,
} from 'lucide-react';
import FormField from '../components/FormField.jsx';
import TextareaField from '../components/TextareaField.jsx';
import SelectField from '../components/SelectField.jsx';
import TagInput from '../components/TagInput.jsx';
import OutputSection from '../components/OutputSection.jsx';
import { CONTENT_TYPES } from '../utils/contentTypes.js';
import { useGeneration } from '../hooks/useGeneration.js';
import { useBusinessProfiles } from '../hooks/useBusinessProfiles.js';
import templatesService from '../services/templates.service';

const TONE_OPTIONS = [
  'PROFESSIONAL',
  'CASUAL',
  'FRIENDLY',
  'FORMAL',
  'PLAYFUL',
  'LUXURY',
  'URGENT',
  'EMOTIONAL',
];

const LENGTH_OPTIONS = ['short', 'medium', 'long'];

const emptyDefaults = {
  topic: '',
  goal: '',
  targetAudience: '',
  tone: 'PROFESSIONAL',
  length: 'medium',
  language: 'English',
  offer: '',
  keywords: [],
  callToAction: '',
};

export default function GeneratorPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { profiles } = useBusinessProfiles();
  const { result, isGenerating, elapsedMs, runGenerate, runRegenerate, reset } =
    useGeneration();

  const contentType = useMemo(() => CONTENT_TYPES.find((t) => t.slug === slug), [slug]);

  const [templates, setTemplates] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState('');

  const {
    register,
    control,
    handleSubmit,
    reset: resetForm,
    formState: { errors },
  } = useForm({ defaultValues: emptyDefaults });

  // Applies a template's promptHints to the form. Takes the template object
  // directly (not just an id) so it works correctly even when called right
  // after templates load, before that state has flushed to this render.
  // No-ops safely if contentType hasn't resolved (shouldn't happen in
  // practice since bad slugs short-circuit to the "unknown type" view
  // below, but hooks must still run unconditionally on every render).
  function applyTemplate(template) {
    if (!contentType) return;
    setSelectedTemplateId(template.id);
    const hints = template.promptHints || {};
    resetForm({
      topic: `${template.businessType} — ${contentType.label}`,
      goal: '',
      targetAudience: hints.suggestedAudience || '',
      tone: hints.tone || 'PROFESSIONAL',
      length: 'medium',
      language: 'English',
      offer: '',
      keywords: [],
      callToAction: '',
    });
    toast.success(`Applied "${template.name}" defaults`);
  }

  // Reset the generator's own state (form + result) whenever the content
  // type changes, e.g. navigating from Instagram straight to Blog Article
  // via the sidebar without an intermediate page load.
  useEffect(() => {
    reset();
    setSelectedTemplateId('');
    // If we arrived here via "Reuse" from History/Favorites, the router
    // state carries the original saved input — prefill the form with it.
    const prefill = location.state?.prefill;
    resetForm(prefill ? { ...emptyDefaults, ...prefill } : emptyDefaults);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  // Load business templates relevant to this content type's category so
  // the person can quickly prefill sensible defaults for their business.
  // If we arrived here from the Templates page with a specific template
  // already chosen, auto-apply it once the list loads.
  useEffect(() => {
    let cancelled = false;
    templatesService
      .list()
      .then((data) => {
        if (cancelled) return;
        setTemplates(data);
        const suggestedId = location.state?.suggestedTemplateId;
        const suggested = data.find((t) => t.id === suggestedId);
        if (suggested) {
          applyTemplate(suggested);
        }
      })
      .catch(() => {
        // Templates are a nice-to-have; fail silently and just show no picker.
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  if (!contentType) {
    return (
      <div className="glass-card mx-auto max-w-md p-8 text-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Unknown generator type &quot;{slug}&quot;.
        </p>
        <Link to="/dashboard" className="btn-primary mt-4 inline-flex px-5 py-2.5">
          Back to generators
        </Link>
      </div>
    );
  }

  const Icon = contentType.icon;
  const defaultProfile = profiles.find((p) => p.isDefault);

  const handleTemplateSelect = (templateId) => {
    const template = templates.find((t) => t.id === templateId);
    if (!template) {
      setSelectedTemplateId('');
      return;
    }
    applyTemplate(template);
  };

  const onSubmit = async (formData) => {
    const payload = { ...formData, contentType: contentType.slug };
    try {
      await runGenerate(payload);
      toast.success('Content generated!');
    } catch (_err) {
      // useGeneration already toasts the error
    }
  };

  const handleRegenerate = async () => {
    if (!result?.generation?.id) return;
    try {
      await runRegenerate(result.generation.id);
      toast.success('Regenerated!');
    } catch (_err) {
      // already toasted
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const text = Object.entries(result.output)
      .filter(([key]) => key !== 'raw')
      .map(([key, value]) => `${key.toUpperCase()}:\n${value}`)
      .join('\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${contentType.slug}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Downloaded');
  };

  const handleSave = () => {
    // Every successful generation is already persisted server-side and
    // written to History automatically. "Save" here just confirms that
    // and points the person to where they can find it again.
    toast.success('Saved — find it anytime in History');
  };

  const outputFields = result
    ? Object.entries(result.output).filter(([key]) => key !== 'raw')
    : [];

  return (
    <div className="mx-auto max-w-4xl">
      <button
        onClick={() => navigate('/dashboard')}
        className="mb-5 flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
      >
        <ArrowLeft size={15} /> Back to generators
      </button>

      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-300">
          <Icon size={20} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {contentType.label}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {contentType.description}
          </p>
        </div>
      </div>

      {!defaultProfile && (
        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300">
          No business profile set — generating without personalization.{' '}
          <Link to="/dashboard/business-profile" className="font-semibold underline">
            Set one up
          </Link>
        </div>
      )}

      {templates.length > 0 && (
        <div className="mb-6 glass-card flex items-center gap-3 p-3.5">
          <LayoutTemplate size={16} className="shrink-0 text-brand-500" />
          <select
            value={selectedTemplateId}
            onChange={(e) => handleTemplateSelect(e.target.value)}
            className="input-field flex-1 py-2"
          >
            <option value="">Start from a business template (optional)</option>
            {templates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* --- Input form --- */}
        <form onSubmit={handleSubmit(onSubmit)} className="glass-card p-6">
          <FormField
            label="Topic"
            placeholder="What is this content about?"
            error={errors.topic?.message}
            {...register('topic', { required: 'Topic is required' })}
          />
          <FormField
            label="Goal"
            placeholder="e.g. Drive foot traffic, boost signups"
            {...register('goal')}
          />
          <FormField
            label="Target audience"
            placeholder="e.g. Young professionals in Hyderabad"
            {...register('targetAudience')}
          />

          <div className="grid grid-cols-2 gap-3">
            <SelectField label="Tone" {...register('tone')}>
              {TONE_OPTIONS.map((tone) => (
                <option key={tone} value={tone}>
                  {tone.charAt(0) + tone.slice(1).toLowerCase()}
                </option>
              ))}
            </SelectField>
            <SelectField label="Length" {...register('length')}>
              {LENGTH_OPTIONS.map((len) => (
                <option key={len} value={len}>
                  {len.charAt(0).toUpperCase() + len.slice(1)}
                </option>
              ))}
            </SelectField>
          </div>

          <FormField label="Language" {...register('language')} />
          <FormField
            label="Offer (optional)"
            placeholder="e.g. 20% off this week"
            {...register('offer')}
          />

          <Controller
            name="keywords"
            control={control}
            render={({ field }) => (
              <TagInput
                label="Keywords"
                value={field.value}
                onChange={field.onChange}
                placeholder="Add a keyword and press Enter"
              />
            )}
          />

          <TextareaField
            label="Call to action (optional)"
            rows={2}
            placeholder="e.g. Visit us this weekend"
            {...register('callToAction')}
          />

          <button
            type="submit"
            disabled={isGenerating}
            className="btn-primary mt-2 w-full py-3"
          >
            {isGenerating ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Generating... {(elapsedMs / 1000).toFixed(1)}s
              </>
            ) : (
              <>
                <Sparkles size={16} /> Generate
              </>
            )}
          </button>
        </form>

        {/* --- Output --- */}
        <div className="glass-card flex flex-col p-6">
          {!result && !isGenerating && (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 py-12 text-center">
              <Sparkles size={28} className="text-slate-300 dark:text-slate-600" />
              <p className="text-sm text-slate-400">
                Fill in the form and hit Generate to see your content here.
              </p>
            </div>
          )}

          {isGenerating && !result && (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 py-12 text-center">
              <Loader2 size={28} className="animate-spin text-brand-500" />
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Writing your {contentType.label.toLowerCase()}...
              </p>
            </div>
          )}

          {result && (
            <>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Clock size={12} />
                  {result.generation.generationTimeMs
                    ? `${(result.generation.generationTimeMs / 1000).toFixed(1)}s`
                    : '—'}
                  <span className="mx-1">&middot;</span>
                  {result.generation.aiModel || 'AI'}
                </div>
                <div className="flex gap-1.5">
                  <button
                    onClick={handleRegenerate}
                    disabled={isGenerating}
                    className="btn-secondary px-3 py-1.5 text-xs"
                    title="Regenerate"
                  >
                    {isGenerating ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : (
                      <RotateCw size={13} />
                    )}
                    Regenerate
                  </button>
                  <button
                    onClick={handleDownload}
                    className="btn-secondary px-3 py-1.5 text-xs"
                    title="Download"
                  >
                    <Download size={13} />
                  </button>
                  <button
                    onClick={handleSave}
                    className="btn-secondary px-3 py-1.5 text-xs"
                    title="Save"
                  >
                    <Bookmark size={13} />
                  </button>
                </div>
              </div>

              <div className="space-y-3 overflow-y-auto">
                {outputFields.map(([key, value]) => (
                  <OutputSection key={key} fieldKey={key} content={value} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
