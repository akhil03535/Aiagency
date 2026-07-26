import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Loader2, Save, Star, Trash2 } from 'lucide-react';
import FormField from '../components/FormField.jsx';
import TextareaField from '../components/TextareaField.jsx';
import SelectField from '../components/SelectField.jsx';
import TagInput from '../components/TagInput.jsx';
import SkeletonCard from '../components/SkeletonCard.jsx';
import { useBusinessProfiles } from '../hooks/useBusinessProfiles.js';

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

const SOCIAL_PLATFORMS = ['instagram', 'facebook', 'linkedin', 'twitter', 'youtube'];

const emptyDefaults = {
  businessName: '',
  businessType: '',
  website: '',
  phone: '',
  location: '',
  audience: '',
  brandTone: 'PROFESSIONAL',
  products: [],
  services: [],
  socialLinks: {},
  description: '',
};

export default function BusinessProfilePage() {
  const { profiles, isLoading, createProfile, updateProfile, deleteProfile } =
    useBusinessProfiles();
  const [activeProfileId, setActiveProfileId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: emptyDefaults });

  // Once profiles load, select the default one (or the first) and
  // populate the form with its values.
  useEffect(() => {
    if (isLoading || profiles.length === 0) return;
    const target = profiles.find((p) => p.isDefault) || profiles[0];
    setActiveProfileId(target.id);
    reset({
      ...emptyDefaults,
      ...target,
      socialLinks: target.socialLinks || {},
    });
  }, [isLoading, profiles, reset]);

  const isNewProfile = !activeProfileId;

  const onSubmit = async (formData) => {
    setIsSaving(true);
    try {
      if (isNewProfile) {
        const created = await createProfile(formData);
        setActiveProfileId(created.id);
        toast.success('Business profile created');
      } else {
        await updateProfile(activeProfileId, formData);
        toast.success('Business profile saved');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not save profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!activeProfileId) return;
    if (!window.confirm('Delete this business profile? This cannot be undone.')) return;
    try {
      await deleteProfile(activeProfileId);
      setActiveProfileId(null);
      reset(emptyDefaults);
      toast.success('Business profile deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not delete profile.');
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Business Profile
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Saved once, applied automatically to every generation.
          </p>
        </div>
        {!isNewProfile && (
          <span className="flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
            <Star size={11} fill="currentColor" /> Default
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="glass-card p-6">
        <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
          <FormField
            label="Business name"
            placeholder="Sharma Sweets & Bakery"
            error={errors.businessName?.message}
            {...register('businessName', { required: 'Business name is required' })}
          />
          <FormField
            label="Business type"
            placeholder="Bakery, Gym, Clinic..."
            {...register('businessType')}
          />
          <FormField
            label="Website"
            placeholder="https://yourbusiness.com"
            {...register('website')}
          />
          <FormField label="Phone" placeholder="+91 98765 43210" {...register('phone')} />
          <FormField
            label="Location"
            placeholder="Hyderabad, Telangana"
            {...register('location')}
          />
          <SelectField label="Brand tone" {...register('brandTone')}>
            {TONE_OPTIONS.map((tone) => (
              <option key={tone} value={tone}>
                {tone.charAt(0) + tone.slice(1).toLowerCase()}
              </option>
            ))}
          </SelectField>
        </div>

        <TextareaField
          label="Target audience"
          placeholder="Young professionals aged 25-40 in Hyderabad who value convenience"
          {...register('audience')}
        />

        <TextareaField
          label="Business description"
          rows={4}
          placeholder="A short summary of what your business does and what makes it different."
          {...register('description')}
        />

        <Controller
          name="products"
          control={control}
          render={({ field }) => (
            <TagInput
              label="Products"
              value={field.value}
              onChange={field.onChange}
              placeholder="Add a product and press Enter"
            />
          )}
        />

        <Controller
          name="services"
          control={control}
          render={({ field }) => (
            <TagInput
              label="Services"
              value={field.value}
              onChange={field.onChange}
              placeholder="Add a service and press Enter"
            />
          )}
        />

        <div className="mb-2">
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Social links
          </label>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {SOCIAL_PLATFORMS.map((platform) => (
              <input
                key={platform}
                type="text"
                placeholder={`${platform.charAt(0).toUpperCase() + platform.slice(1)} URL`}
                className="input-field"
                {...register(`socialLinks.${platform}`)}
              />
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5 dark:border-slate-800">
          {!isNewProfile ? (
            <button
              type="button"
              onClick={handleDelete}
              className="flex items-center gap-1.5 text-sm font-medium text-red-500 hover:underline"
            >
              <Trash2 size={14} /> Delete profile
            </button>
          ) : (
            <span />
          )}

          <button type="submit" disabled={isSaving} className="btn-primary px-5 py-2.5">
            {isSaving ? (
              <>
                <Loader2 size={15} className="animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save size={15} /> {isNewProfile ? 'Create profile' : 'Save changes'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
