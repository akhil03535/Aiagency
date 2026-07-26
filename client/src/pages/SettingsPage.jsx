import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Loader2, Save, Moon, Sun } from 'lucide-react';
import clsx from 'clsx';
import FormField from '../components/FormField.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useTheme } from '../contexts/ThemeContext.jsx';
import apiClient from '../services/apiClient';

const THEME_OPTIONS = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
];

export default function SettingsPage() {
  const { user, refetchUser } = useAuth();
  const { theme, setTheme } = useTheme();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { name: user?.name || '' } });

  useEffect(() => {
    if (user) reset({ name: user.name });
  }, [user, reset]);

  const onSubmit = async (formData) => {
    try {
      await apiClient.put('/profile', formData);
      toast.success('Profile updated');
      refetchUser?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update profile.');
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Manage your account and appearance preferences.
        </p>
      </div>

      <section className="glass-card p-6">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Account
        </h3>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormField
            label="Full name"
            error={errors.name?.message}
            {...register('name', { required: 'Name is required' })}
          />
          <FormField label="Email" value={user?.email || ''} disabled readOnly />
          <button type="submit" disabled={isSubmitting} className="btn-primary mt-2 px-5 py-2.5">
            {isSubmitting ? (
              <>
                <Loader2 size={15} className="animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save size={15} /> Save changes
              </>
            )}
          </button>
        </form>
      </section>

      <section className="glass-card p-6">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Appearance
        </h3>
        <div className="flex gap-3">
          {THEME_OPTIONS.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setTheme(value)}
              className={clsx(
                'flex flex-1 flex-col items-center gap-2 rounded-xl border-2 px-4 py-4 transition-colors',
                theme === value
                  ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20'
                  : 'border-slate-200 hover:border-slate-300 dark:border-slate-700'
              )}
            >
              <Icon
                size={18}
                className={theme === value ? 'text-brand-600' : 'text-slate-400'}
              />
              <span
                className={clsx(
                  'text-xs font-medium',
                  theme === value
                    ? 'text-brand-700 dark:text-brand-300'
                    : 'text-slate-500 dark:text-slate-400'
                )}
              >
                {label}
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
