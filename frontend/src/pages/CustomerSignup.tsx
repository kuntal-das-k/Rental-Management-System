import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useAuthStore } from '../store/useAuthStore';
import { Eye, EyeOff, ArrowUpRight, AlertCircle } from 'lucide-react';

export const CustomerSignup: React.FC = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!agreeTerms) {
      setErrorMessage('You must agree to the Terms & Conditions to proceed.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegex.test(formData.email.trim())) {
      setErrorMessage('Please enter a valid email address (e.g. user@example.com)');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await api.post('/auth/signup/customer', {
        ...formData,
        email: formData.email.trim().toLowerCase(),
      });
      const { user, accessToken } = res.data.data;
      setAuth(user, accessToken);
      navigate('/');
    } catch (err: any) {
      setErrorMessage(err.response?.data?.error || 'Customer registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialRegister = async (provider: string) => {
    setIsSubmitting(true);
    try {
      const demoEmail = `user.${Date.now()}@twinsix.com`;
      const res = await api.post('/auth/signup/customer', {
        firstName: provider,
        lastName: 'User',
        email: demoEmail,
        password: 'Password123!',
      });
      const { user, accessToken } = res.data.data;
      setAuth(user, accessToken);
      navigate('/');
    } catch {
      setErrorMessage(`${provider} registration requires OAuth setup.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F4F6] flex items-center justify-center p-4 sm:p-6 lg:p-10 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-12 w-full max-w-5xl rounded-[32px] overflow-hidden bg-white shadow-2xl border border-slate-200/80 min-h-[660px]">
        {/* Left Hero Image Panel */}
        <div className="lg:col-span-6 relative p-8 lg:p-10 flex flex-col justify-between overflow-hidden bg-slate-950 min-h-[300px] lg:min-h-full">
          {/* Background Image */}
          <img
            src="https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80"
            alt="Dune Landscape"
            className="absolute inset-0 w-full h-full object-cover brightness-[0.75] contrast-[1.1] transition-transform duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40 pointer-events-none" />

          {/* Top Brand Header */}
          <div className="relative z-10 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tight text-white font-mono">TWINSIX</span>
            </Link>

            <Link
              to="/"
              className="px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/30 text-xs font-semibold text-white backdrop-blur-md transition-all flex items-center gap-1"
            >
              <span>Back to website</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Bottom Hero Tagline */}
          <div className="relative z-10 space-y-4">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-normal text-white tracking-tight leading-tight max-w-sm">
              Capturing Moments, Creating Memories
            </h2>

            {/* Carousel Dots Indicator */}
            <div className="flex items-center gap-2 pt-2">
              <span className="w-6 h-1 rounded-full bg-white/40"></span>
              <span className="w-6 h-1 rounded-full bg-white/40"></span>
              <span className="w-10 h-1 rounded-full bg-white"></span>
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="lg:col-span-6 p-8 sm:p-10 lg:p-12 flex flex-col justify-center bg-white text-slate-900 space-y-5">
          {/* Header */}
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Create an account</h1>
            <p className="text-xs text-slate-500 font-medium">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-slate-900 underline underline-offset-4 hover:text-slate-600">
                Log in
              </Link>
            </p>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* First & Last Name */}
            <div className="grid grid-cols-2 gap-3">
              <div className="border border-slate-200 focus-within:border-slate-900 rounded-2xl px-4 py-2 bg-white transition-all">
                <label className="block text-[10px] font-medium text-slate-400 uppercase tracking-wider">First name</label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="Fletcher"
                  className="w-full text-xs font-semibold text-slate-900 bg-transparent outline-none placeholder:text-slate-300 py-1"
                />
              </div>
              <div className="border border-slate-200 focus-within:border-slate-900 rounded-2xl px-4 py-2 bg-white transition-all">
                <label className="block text-[10px] font-medium text-slate-400 uppercase tracking-wider">Last name</label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Smith"
                  className="w-full text-xs font-semibold text-slate-900 bg-transparent outline-none placeholder:text-slate-300 py-1"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="border border-slate-200 focus-within:border-slate-900 rounded-2xl px-4 py-2 bg-white transition-all">
              <label className="block text-[10px] font-medium text-slate-400 uppercase tracking-wider">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="name@example.com"
                className="w-full text-xs font-semibold text-slate-900 bg-transparent outline-none placeholder:text-slate-300 py-1"
              />
            </div>

            {/* Password Field */}
            <div className="border border-slate-200 focus-within:border-slate-900 rounded-2xl px-4 py-2 bg-white transition-all">
              <div className="flex items-center justify-between">
                <label className="block text-[10px] font-medium text-slate-400 uppercase tracking-wider">Password</label>
              </div>
              <div className="flex items-center justify-between gap-2 py-1">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter your password"
                  className="w-full text-xs font-semibold text-slate-900 bg-transparent outline-none placeholder:text-slate-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-700 transition-colors p-0.5"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="border border-slate-200 focus-within:border-slate-900 rounded-2xl px-4 py-2 bg-white transition-all">
              <label className="block text-[10px] font-medium text-slate-400 uppercase tracking-wider">Confirm Password</label>
              <input
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="Confirm password"
                className="w-full text-xs font-semibold text-slate-900 bg-transparent outline-none placeholder:text-slate-300 py-1"
              />
            </div>

            {/* Checkbox */}
            <div className="flex items-center gap-2.5 pt-1">
              <input
                type="checkbox"
                id="terms_checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 rounded text-slate-950 accent-slate-950 cursor-pointer"
              />
              <label htmlFor="terms_checkbox" className="text-xs text-slate-600 font-medium cursor-pointer">
                I agree to the{' '}
                <a href="#terms" className="font-semibold text-slate-900 underline underline-offset-2">
                  Terms & Conditions
                </a>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-2xl bg-slate-950 hover:bg-slate-800 text-white font-semibold text-xs transition-all shadow-sm active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {isSubmitting ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          {/* Social Sign-In Divider */}
          <div className="relative flex items-center justify-center my-1">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-[11px] font-medium text-slate-400 shrink-0">Or register with</span>
            <div className="border-t border-slate-200 w-full" />
          </div>

          {/* Social Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleSocialRegister('Google')}
              className="border border-slate-200 hover:bg-slate-50/80 rounded-2xl py-2.5 px-4 flex items-center justify-center gap-2 text-xs font-semibold text-slate-800 transition-all"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Google</span>
            </button>

            <button
              type="button"
              onClick={() => handleSocialRegister('Apple')}
              className="border border-slate-200 hover:bg-slate-50/80 rounded-2xl py-2.5 px-4 flex items-center justify-center gap-2 text-xs font-semibold text-slate-800 transition-all"
            >
              <svg className="w-4 h-4 fill-current text-slate-900" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.35c.67-.82 1.13-1.96.99-3.1-.98.04-2.19.66-2.88 1.47-.62.72-1.16 1.88-1.01 3 .1.11 2.21.65 2.9-1.37z" />
              </svg>
              <span>Apple</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
