import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import AuthLayout from '../layouts/AuthLayout.jsx';
import FormField from '../components/FormField.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      await registerUser(formData);
      toast.success('Account created! Welcome to AI Agency.');
      navigate('/dashboard');
    } catch (err) {
      const message = err.response?.data?.message || 'Something went wrong. Please try again.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start generating marketing content in minutes."
      footer={
        <p className="text-slate-500 dark:text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-brand-600 hover:underline">
            Log in
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormField
          label="Full name"
          placeholder="Priya Sharma"
          error={errors.name?.message}
          {...register('name', { required: 'Name is required' })}
        />
        <FormField
          label="Email"
          type="email"
          placeholder="you@business.com"
          error={errors.email?.message}
          {...register('email', {
            required: 'Email is required',
            pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
          })}
        />
        <FormField
          label="Password"
          type="password"
          placeholder="At least 8 characters"
          error={errors.password?.message}
          {...register('password', {
            required: 'Password is required',
            minLength: { value: 8, message: 'Must be at least 8 characters' },
          })}
        />

        <button type="submit" disabled={isSubmitting} className="btn-primary mt-2 w-full py-3">
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Creating account...
            </>
          ) : (
            'Create account'
          )}
        </button>
      </form>
    </AuthLayout>
  );
}
