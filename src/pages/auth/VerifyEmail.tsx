import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui';
import { ROUTES } from '@/lib/constants';

const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyToken = async () => {
      const token = searchParams.get('token');
      
      if (!token) {
        setError('Verification token is missing.');
        setIsLoading(false);
        return;
      }

      try {
        // TODO: Replace with actual API call
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setIsSuccess(true);
      } catch (err: any) {
        setError(err.message || 'Email verification failed. The link may be invalid or expired.');
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-[#d4e4d9] text-center">
            <div className="mb-4">
              <div className="w-16 h-16 border-4 border-[#2d8659] border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
            <p className="text-[#5a6c5d]">Verifying your email...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isSuccess) {
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
            <h2 className="text-2xl font-semibold text-[#2c3e2d] mb-2">Email Verified!</h2>
            <p className="text-[#5a6c5d] mb-6">
              Your email has been successfully verified. You can now log in to your account.
            </p>
            <Link to={ROUTES.LOGIN}>
              <Button variant="primary" className="bg-[#2d8659] hover:bg-[#1f5d3f] text-white">
                Go to Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-[#d4e4d9] text-center">
          <div className="mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-[#2c3e2d] mb-2">Verification Failed</h2>
          <p className="text-[#5a6c5d] mb-6">{error}</p>
          <div className="space-y-3">
            <Link to={ROUTES.LOGIN}>
              <Button variant="primary" className="w-full bg-[#2d8659] hover:bg-[#1f5d3f] text-white">
                Go to Login
              </Button>
            </Link>
            <Button variant="outline" className="w-full">
              Resend Verification Email
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;


