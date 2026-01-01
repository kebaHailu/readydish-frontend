import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input } from '@/components/ui';
import { ROUTES } from '@/lib/constants';
import type { LoginData } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { getErrorMessage, getFieldErrors, getRateLimitInfo, formatRetryTime } from '@/lib/errorHandler';
import { AxiosError } from 'axios';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { showSuccess, showError } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rateLimitReset, setRateLimitReset] = useState<number | null>(null);
  const [retryCountdown, setRetryCountdown] = useState<string>('');

  const {
    register,
    handleSubmit,
    setError: setFormError,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginData) => {
    setIsLoading(true);
    setError(null);
    // Clear any previous rate limit state
    setRateLimitReset(null);

    try {
      await login(data);
      showSuccess('Login successful!');
      
      // Only redirect on successful login
      const from = (location.state as any)?.from?.pathname || ROUTES.MENU;
      navigate(from, { replace: true });
    } catch (err: unknown) {
      // Prevent any navigation on error - stay on login page
      const errorMessage = getErrorMessage(err);
      const fieldErrors = getFieldErrors(err);
      
      // Check for rate limiting
      if (err instanceof AxiosError && err.response?.status === 429) {
        const rateLimitInfo = getRateLimitInfo(err);
        if (rateLimitInfo?.reset) {
          setRateLimitReset(rateLimitInfo.reset);
        }
      }
      
      // Set field-specific errors if available
      if (fieldErrors && Object.keys(fieldErrors).length > 0) {
        for (const key in fieldErrors) {
          setFormError(key as keyof LoginData, { type: 'manual', message: fieldErrors[key] });
        }
      }
      
      // Always set the general error message (for 401, this will be "Invalid email or password")
      setError(errorMessage);
      showError(errorMessage);
      
      // Ensure we stay on the login page - don't navigate away
      // The error should be displayed and user can try again
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

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Attractive Header Section */}
      <div className="relative bg-gradient-to-r from-[#2d8659] to-emerald-600 py-16 overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-300 opacity-10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block mb-4">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Welcome Back to
            <span className="block">ReadyDish</span>
          </h1>
          <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
            Sign in to continue enjoying fresh, delicious meals delivered to your door
          </p>
        </div>
      </div>

      {/* Login Form Section */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-[#d4e4d9] transform -mt-8 relative z-10">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-[#2c3e2d]">Sign In</h2>
              <p className="text-sm text-[#5a6c5d] mt-2">Enter your credentials to access your account</p>
            </div>

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
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                error={errors.email?.message}
                {...register('email')}
              />

              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                error={errors.password?.message}
                {...register('password')}
              />

              <div className="flex items-center justify-between text-sm">
                <Link
                  to={ROUTES.FORGOT_PASSWORD}
                  className="text-[#2d8659] hover:text-[#1f5d3f] font-medium transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                disabled={!!rateLimitReset}
                className="w-full bg-[#2d8659] hover:bg-[#1f5d3f] text-white shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {rateLimitReset ? `Please wait ${retryCountdown}` : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-[#d4e4d9] text-center text-sm text-[#5a6c5d]">
              Don't have an account?{' '}
              <Link
                to={ROUTES.SIGNUP}
                className="text-[#2d8659] hover:text-[#1f5d3f] font-semibold transition-colors"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
