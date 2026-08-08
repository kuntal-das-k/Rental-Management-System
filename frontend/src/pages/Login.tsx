import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useAuthStore } from '../store/useAuthStore';
import { Lock, Mail, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

function validateEmailFormat(email: string): { valid: boolean; message: string } {
  if (!email || email.trim().length === 0) {
    return { valid: false, message: 'Email address is required' };
  }

  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  if (!emailRegex.test(email.trim())) {
    return { valid: false, message: 'Please enter a valid email address (e.g. user@example.com)' };
  }

  const [, domain] = email.trim().split('@');
  if (!domain || !domain.includes('.')) {
    return { valid: false, message: 'Email must include a valid domain (e.g. @gmail.com)' };
  }

  const tld = domain.split('.').pop();
  if (!tld || tld.length < 2) {
    return { valid: false, message: 'Email has an invalid domain extension' };
  }

  return { valid: true, message: '' };
}

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [emailError, setEmailError] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmailChange = useCallback((value: string) => {
    setEmail(value);
    if (emailTouched) {
      const result = validateEmailFormat(value);
      setEmailError(result.valid ? '' : result.message);
    }
  }, [emailTouched]);

  const handleEmailBlur = useCallback(() => {
    setEmailTouched(true);
    const result = validateEmailFormat(email);
    setEmailError(result.valid ? '' : result.message);
  }, [email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const emailValidation = validateEmailFormat(email);
    if (!emailValidation.valid) {
      setEmailTouched(true);
      setEmailError(emailValidation.message);
      return;
    }

    if (!password) {
      setErrorMessage('Password is required');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await api.post('/auth/login', { email: email.trim().toLowerCase(), password });
      const { user, accessToken } = res.data.data;
      setAuth(user, accessToken);

      if (user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else if (user.role === 'VENDOR') {
        navigate('/vendor/dashboard');
      } else {
        navigate('/');
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.error || 'Invalid User ID or Password');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEmailValid = emailTouched && email.length > 0 && !emailError;

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-md rounded-3xl p-8 border border-slate-800 space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-cyan-500 flex items-center justify-center font-bold text-slate-950">
              T6
            </div>
            <span className="text-xl font-extrabold text-white">TwinSix Rentals</span>
          </Link>
          <h2 className="text-xl font-bold text-white">Sign In to Your Account</h2>
          <p className="text-xs text-slate-400">Access storefront, vendor portal, and order management</p>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold text-center flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                required
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                onBlur={handleEmailBlur}
                placeholder="vendor1@twinsix.com or customer1@gmail.com"
                className={`w-full bg-slate-900 border rounded-xl pl-9 pr-9 py-2.5 text-xs text-slate-200 focus:outline-none transition-colors ${
                  emailError && emailTouched
                    ? 'border-red-500/60 focus:border-red-500'
                    : isEmailValid
                    ? 'border-emerald-500/40 focus:border-emerald-500'
                    : 'border-slate-800 focus:border-cyan-500'
                }`}
              />
              {isEmailValid && (
                <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
              )}
              {emailError && emailTouched && (
                <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-400" />
              )}
            </div>
            {emailError && emailTouched && (
              <p className="mt-1.5 text-[11px] text-red-400 font-semibold flex items-center gap-1">
                {emailError}
              </p>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-slate-300">Password</label>
              <Link to="/reset-password" className="text-[11px] text-cyan-400 hover:underline">
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password123!"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-60 disabled:cursor-not-allowed text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all"
          >
            {isSubmitting ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Log In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-800/80 text-center text-xs text-slate-400 space-y-2">
          <p>
            Don't have an account?{' '}
            <Link to="/signup/customer" className="text-cyan-400 font-bold hover:underline">
              Customer Sign-Up
            </Link>
          </p>
          <p>
            Are you a vendor?{' '}
            <Link to="/signup/vendor" className="text-cyan-400 font-bold hover:underline">
              Vendor Sign-Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
