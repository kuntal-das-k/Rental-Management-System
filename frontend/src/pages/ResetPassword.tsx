import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { ArrowUpRight, AlertCircle, CheckCircle2 } from 'lucide-react';

export const ResetPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      const res = await api.post('/auth/reset-password', { email });
      setSuccessMessage(res.data.data.message || 'The password reset link has been sent to your email');
    } catch (err: any) {
      setErrorMessage(err.response?.data?.error || 'User email address not found');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F4F6] flex items-center justify-center p-4 sm:p-6 lg:p-10 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-12 w-full max-w-5xl rounded-[32px] overflow-hidden bg-white shadow-2xl border border-slate-200/80 min-h-[600px]">
        {/* Left Hero Image Panel */}
        <div className="lg:col-span-6 relative p-8 lg:p-10 flex flex-col justify-between overflow-hidden bg-slate-950 min-h-[280px] lg:min-h-full">
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
              <span className="w-10 h-1 rounded-full bg-white"></span>
              <span className="w-6 h-1 rounded-full bg-white/40"></span>
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="lg:col-span-6 p-8 sm:p-10 lg:p-12 flex flex-col justify-center bg-white text-slate-900 space-y-6">
          {/* Header */}
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Reset Password</h1>
            <p className="text-xs text-slate-500 font-medium">
              Remembered your password?{' '}
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

          {successMessage ? (
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 text-center space-y-4">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-sm font-extrabold text-slate-900">Reset Link Dispatched</h3>
                <p className="text-xs text-slate-500 font-medium">{successMessage}</p>
              </div>
              <Link
                to="/login"
                className="inline-block w-full py-3 rounded-2xl bg-slate-950 hover:bg-slate-800 text-white font-semibold text-xs transition-all shadow-sm"
              >
                Return to Log In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="border border-slate-200 focus-within:border-slate-900 rounded-2xl px-4 py-2 bg-white transition-all">
                <label className="block text-[10px] font-medium text-slate-400 uppercase tracking-wider">Email address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full text-xs font-semibold text-slate-900 bg-transparent outline-none placeholder:text-slate-300 py-1"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-2xl bg-slate-950 hover:bg-slate-800 text-white font-semibold text-xs transition-all shadow-sm active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {isLoading ? 'Verifying...' : 'Send reset link'}
              </button>
            </form>
          )}

          <div className="pt-2 text-center text-xs text-slate-400">
            Need a new account?{' '}
            <Link to="/signup/customer" className="font-semibold text-slate-900 underline underline-offset-4">
              Create account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
