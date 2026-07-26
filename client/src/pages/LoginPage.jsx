import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import AuthLayout from '../layouts/AuthLayout.jsx';
import FormField from '../components/FormField.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const redirectTo = location.state?.from?.pathname || '/dashboard';

  const onSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      await login(formData);
      toast.success('Welcome back!');
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const message = err.response?.data?.message || 'Invalid email or password.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to continue generating content."
      footer={
        <p className="text-slate-500 dark:text-slate-400">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-semibold text-brand-600 hover:underline">
            Sign up
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormField
          label="Email"
          type="email"
          placeholder="you@business.com"
          error={errors.email?.message}
          {...register('email', { required: 'Email is required' })}
        />
        <FormField
          label="Password"
          type="password"
          placeholder="Your password"
          error={errors.password?.message}
          {...register('password', { required: 'Password is required' })}
        />

        <button type="submit" disabled={isSubmitting} className="btn-primary mt-2 w-full py-3">
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Logging in...
            </>
          ) : (
            'Log in'
          )}
        </button>
      </form>
    </AuthLayout>
  );
}
