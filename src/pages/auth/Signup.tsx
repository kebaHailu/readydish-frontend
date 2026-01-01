import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input } from '@/components/ui';
import { ROUTES } from '@/lib/constants';
import type { SignupData } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { getErrorMessage, getFieldErrors, getRateLimitInfo, formatRetryTime } from '@/lib/errorHandler';
import { AxiosError } from 'axios';

const signupSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type SignupFormData = SignupData & { confirmPassword: string };

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const { showSuccess, showError } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [rateLimitReset, setRateLimitReset] = useState<number | null>(null);
  const [retryCountdown, setRetryCountdown] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError: setFormError,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      await signup({ name: data.name, email: data.email, password: data.password });
      showSuccess('Account created successfully! You can now login.');
      setSuccess(true);
      setTimeout(() => {
        navigate(ROUTES.LOGIN);
      }, 2000);
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);
      
      // Check for rate limiting
      if (err instanceof AxiosError && err.response?.status === 429) {
        const rateLimitInfo = getRateLimitInfo(err);
        if (rateLimitInfo?.reset) {
          setRateLimitReset(rateLimitInfo.reset);
        }
      }
      
      // Set field-specific errors if available
      const fieldErrors = getFieldErrors(err);
      if (fieldErrors && Object.keys(fieldErrors).length > 0) {
        // Set field-specific errors
        for (const key in fieldErrors) {
          setFormError(key as keyof SignupData, { type: 'manual', message: fieldErrors[key] });
        }
      }
      
      // Always set the general error message
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Countdown timer for rate limit
  useEffect(() => {
    if (!rateLimitReset) {
      setRetryCountdown('');
      return;
    }

    const updateCountdown = () => {
      const now = Math.floor(Date.now() / 1000);
      const secondsUntilReset = rateLimitReset - now;

      if (secondsUntilReset <= 0) {
        setRateLimitReset(null);
        setRetryCountdown('');
        setError(null);
        return;
      }

      setRetryCountdown(formatRetryTime(rateLimitReset));
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [rateLimitReset]);

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-[#d4e4d9] text-center">
            <div className="mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-[#2d8659]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-semibold text-[#2c3e2d] mb-2">Account Created!</h2>
            <p className="text-[#5a6c5d] mb-4">
              Your account has been created successfully. You can now login.
            </p>
            <p className="text-sm text-[#5a6c5d]">Redirecting to login...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#2d8659] mb-2">ReadyDish</h1>
          <p className="text-[#5a6c5d]">Create your account to get started.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 border border-[#d4e4d9]">
          <h2 className="text-2xl font-semibold text-[#2c3e2d] mb-6">Sign Up</h2>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-red-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="flex-1">
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                  {rateLimitReset && retryCountdown && (
                    <p className="text-red-600 text-xs mt-1">
                      You can try again {retryCountdown}.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Full Name"
              type="text"
              placeholder="John Doe"
              error={errors.name?.message}
              {...register('name')}
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Password"
              type="password"
              placeholder="Create a password"
              error={errors.password?.message}
              {...register('password')}
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              disabled={!!rateLimitReset}
              className="w-full bg-[#2d8659] hover:bg-[#1f5d3f] text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {rateLimitReset ? `Please wait ${retryCountdown}` : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-[#5a6c5d]">
            Already have an account?{' '}
            <Link
              to={ROUTES.LOGIN}
              className="text-[#2d8659] hover:text-[#1f5d3f] font-semibold"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;


