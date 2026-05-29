import React, { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Home, Mail, ArrowRight, CheckCircle, XCircle, Loader } from 'lucide-react';
import { API_URL } from '../../services/config';

type Status = 'idle' | 'loading' | 'success' | 'error';

const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) return;

    setStatus('loading');
    fetch(`${API_URL}/auth/verify-email/${token}`)
      .then(async (res) => {
        const data = await res.json();
        if (data.success) {
          setStatus('success');
          setMessage('Your email has been verified! Redirecting to login…');
          setTimeout(() => navigate('/login?verified=true'), 2500);
        } else {
          setStatus('error');
          setMessage(data.message || 'Verification failed.');
        }
      })
      .catch(() => {
        setStatus('error');
        setMessage('Network error. Please try again.');
      });
  }, [searchParams, navigate]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Verifying your email…</p>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-5">
        <div className="text-center max-w-md w-full">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-3">Email Verified!</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6">{message}</p>
          <Link
            to="/login"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 font-medium"
          >
            <span>Go to Login</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-5">
        <div className="text-center max-w-md w-full">
          <XCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-3">Verification Failed</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6">{message}</p>
          <Link
            to="/login"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 font-medium"
          >
            <span>Back to Login</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-5 lg:p-10 transition-colors duration-300">
      <div className="text-center max-w-md w-full">
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="w-32 h-32 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4 animate-bounce-subtle">
              <Mail className="w-16 h-16 text-blue-500 dark:text-blue-400" />
            </div>
            <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center animate-pulse">
              1
            </div>
          </div>
        </div>

        <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4 leading-tight">
          Check your email
        </h1>

        <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
          We've sent a verification link to your email address. Please click the link to activate your account.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/login"
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 font-medium shadow-[0_4px_20px_rgba(59,130,246,0.3)] hover:-translate-y-0.5"
          >
            <span>Back to Login</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/home"
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 font-medium"
          >
            <Home className="w-4 h-4" />
            <span>Go Home</span>
          </Link>
        </div>

        <p className="mt-10 text-sm text-slate-500 dark:text-slate-500">
          Didn't receive the email? Check your spam folder.
        </p>
      </div>
    </div>
  );
};

export default VerifyEmail;
