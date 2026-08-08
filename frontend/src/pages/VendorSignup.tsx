import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useAuthStore } from '../store/useAuthStore';
import { Eye, EyeOff, ArrowUpRight, AlertCircle, Store } from 'lucide-react';

export const VendorSignup: React.FC = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
    productCategory: 'Cameras & Audio',
    gstNo: '',
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
      const res = await api.post('/auth/signup/vendor', {
        ...formData,
        email: formData.email.trim().toLowerCase(),
      });
      const { user, accessToken } = res.data.data;
      setAuth(user, accessToken);
      navigate('/vendor/dashboard');
    } catch (err: any) {
      setErrorMessage(err.response?.data?.error || 'Vendor registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F4F6] flex items-center justify-center p-4 sm:p-6 lg:p-10 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-12 w-full max-w-5xl rounded-[32px] overflow-hidden bg-white shadow-2xl border border-slate-200/80 min-h-[680px]">
        {/* Left Hero Image Panel */}
        <div className="lg:col-span-5 relative p-8 lg:p-10 flex flex-col justify-between overflow-hidden bg-slate-950 min-h-[280px] lg:min-h-full">
          {/* Background Video */}
          <video autoPlay loop muted playsInline
            src="/video/rental.mp4"
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
          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold">
              <Store className="w-3.5 h-3.5" />
              <span>Vendor Marketplace</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-normal text-white tracking-tight leading-tight">
              Grow Your Rental Business
            </h2>
            <p className="text-xs text-white/70 font-medium">
              Automate asset scheduling, manage custom pricelists, and collect security deposits seamlessly.
            </p>

            {/* Carousel Dots Indicator */}
            <div className="flex items-center gap-2 pt-2">
              <span className="w-10 h-1 rounded-full bg-white"></span>
              <span className="w-6 h-1 rounded-full bg-white/40"></span>
              <span className="w-6 h-1 rounded-full bg-white/40"></span>
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="lg:col-span-7 p-8 sm:p-10 lg:p-12 flex flex-col justify-center bg-white text-slate-900 space-y-4">
          {/* Header */}
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Partner Registration</h1>
            <p className="text-xs text-slate-500 font-medium">
              Already registered?{' '}
              <Link to="/login" className="font-semibold text-slate-900 underline underline-offset-4 hover:text-slate-600">
                Log in to portal
              </Link>
            </p>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* First & Last Name */}
            <div className="grid grid-cols-2 gap-3">
              <div className="border border-slate-200 focus-within:border-slate-900 rounded-2xl px-4 py-1.5 bg-white transition-all">
                <label className="block text-[10px] font-medium text-slate-400 uppercase tracking-wider">First name *</label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="Alex"
                  className="w-full text-xs font-semibold text-slate-900 bg-transparent outline-none placeholder:text-slate-300 py-0.5"
                />
              </div>
              <div className="border border-slate-200 focus-within:border-slate-900 rounded-2xl px-4 py-1.5 bg-white transition-all">
                <label className="block text-[10px] font-medium text-slate-400 uppercase tracking-wider">Last name *</label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Morgan"
                  className="w-full text-xs font-semibold text-slate-900 bg-transparent outline-none placeholder:text-slate-300 py-0.5"
                />
              </div>
            </div>

            {/* Company Name */}
            <div className="border border-slate-200 focus-within:border-slate-900 rounded-2xl px-4 py-1.5 bg-white transition-all">
              <label className="block text-[10px] font-medium text-slate-400 uppercase tracking-wider">Company Name *</label>
              <input
                type="text"
                required
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                placeholder="Apex Motion Rentals"
                className="w-full text-xs font-semibold text-slate-900 bg-transparent outline-none placeholder:text-slate-300 py-0.5"
              />
            </div>

            {/* Product Category & GST No */}
            <div className="grid grid-cols-2 gap-3">
              <div className="border border-slate-200 focus-within:border-slate-900 rounded-2xl px-4 py-1.5 bg-white transition-all">
                <label className="block text-[10px] font-medium text-slate-400 uppercase tracking-wider">Primary Category *</label>
                <select
                  required
                  value={formData.productCategory}
                  onChange={(e) => setFormData({ ...formData, productCategory: e.target.value })}
                  className="w-full text-xs font-semibold text-slate-900 bg-transparent outline-none py-0.5 cursor-pointer"
                >
                  <option value="Cameras & Audio">Cameras & Audio</option>
                  <option value="Vehicles & E-Bikes">Vehicles & E-Bikes</option>
                  <option value="Electronics & IT">Electronics & IT</option>
                  <option value="Events & Staging">Events & Staging</option>
                  <option value="Heavy Tools & Storage">Heavy Tools & Storage</option>
                </select>
              </div>
              <div className="border border-slate-200 focus-within:border-slate-900 rounded-2xl px-4 py-1.5 bg-white transition-all">
                <label className="block text-[10px] font-medium text-slate-400 uppercase tracking-wider">GST No *</label>
                <input
                  type="text"
                  required
                  value={formData.gstNo}
                  onChange={(e) => setFormData({ ...formData, gstNo: e.target.value })}
                  placeholder="22AAAAA0000A1Z5"
                  className="w-full text-xs font-semibold text-slate-900 bg-transparent outline-none placeholder:text-slate-300 py-0.5"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="border border-slate-200 focus-within:border-slate-900 rounded-2xl px-4 py-1.5 bg-white transition-all">
              <label className="block text-[10px] font-medium text-slate-400 uppercase tracking-wider">Work Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="vendor@company.com"
                className="w-full text-xs font-semibold text-slate-900 bg-transparent outline-none placeholder:text-slate-300 py-0.5"
              />
            </div>

            {/* Passwords (2 cols) */}
            <div className="grid grid-cols-2 gap-3">
              <div className="border border-slate-200 focus-within:border-slate-900 rounded-2xl px-4 py-1.5 bg-white transition-all">
                <label className="block text-[10px] font-medium text-slate-400 uppercase tracking-wider">Password *</label>
                <div className="flex items-center justify-between gap-1 py-0.5">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full text-xs font-semibold text-slate-900 bg-transparent outline-none placeholder:text-slate-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-slate-700 transition-colors p-0.5"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
              <div className="border border-slate-200 focus-within:border-slate-900 rounded-2xl px-4 py-1.5 bg-white transition-all">
                <label className="block text-[10px] font-medium text-slate-400 uppercase tracking-wider">Confirm *</label>
                <input
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  className="w-full text-xs font-semibold text-slate-900 bg-transparent outline-none placeholder:text-slate-300 py-0.5"
                />
              </div>
            </div>

            {/* Checkbox */}
            <div className="flex items-center gap-2.5 pt-1">
              <input
                type="checkbox"
                id="vendor_terms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 rounded text-slate-950 accent-slate-950 cursor-pointer"
              />
              <label htmlFor="vendor_terms" className="text-xs text-slate-600 font-medium cursor-pointer">
                I agree to the{' '}
                <a href="#terms" className="font-semibold text-slate-900 underline underline-offset-2">
                  Vendor Partner Agreement & Terms
                </a>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-2xl bg-slate-950 hover:bg-slate-800 text-white font-semibold text-xs transition-all shadow-sm active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed mt-1"
            >
              {isSubmitting ? 'Registering Store...' : 'Create Vendor Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
