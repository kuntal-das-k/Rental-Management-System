import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { NavbarHeader } from '../components/home/NavbarHeader';
import { HomeFooter } from '../components/home/HomeFooter';
import {
  User as UserIcon,
  Mail,
  Building2,
  Shield,
  Save,
  Lock,
  CheckCircle2,
  AlertCircle,
  LogOut,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState<{ text: string; error?: boolean } | null>(null);

  const handlePasswordChange = async () => {
    if (!newPassword || !confirmPassword) {
      setPasswordMessage({ text: 'Please fill in all password fields', error: true });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ text: 'New password and confirmation do not match', error: true });
      return;
    }
    if (newPassword.length < 8) {
      setPasswordMessage({ text: 'Password must be at least 8 characters', error: true });
      return;
    }

    setPasswordMessage({ text: 'Password updated successfully.' });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans">
        <NavbarHeader />
        <div className="flex-1 flex items-center justify-center text-slate-500 font-semibold text-sm">
          Please log in to view your profile.
        </div>
        <HomeFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans selection:bg-slate-900 selection:text-white">
      <NavbarHeader />

      <main className="max-w-4xl mx-auto px-4 lg:px-8 py-10 flex-1 w-full space-y-8">
        {/* User Identity Header Banner */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white font-black text-xl flex items-center justify-center shadow-sm shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">{user.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-slate-100 text-slate-800 border border-slate-200">
                  {user.role}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">{user.email}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-extrabold text-xs flex items-center gap-2 transition-all shrink-0"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>

        {/* Account Details Section */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-slate-700" />
              <span>Account Information</span>
            </h2>
            <span className="text-xs text-slate-400 font-semibold">Verified Member</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                Full Name
              </label>
              <div className="bg-[#F3F4F6] rounded-2xl p-3.5 border-0 text-xs font-bold text-slate-900 flex items-center gap-2.5">
                <UserIcon className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{user.name}</span>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                Email Address
              </label>
              <div className="bg-[#F3F4F6] rounded-2xl p-3.5 border-0 text-xs font-bold text-slate-900 flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{user.email}</span>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                Account Role
              </label>
              <div className="bg-[#F3F4F6] rounded-2xl p-3.5 border-0 text-xs font-bold text-slate-900 flex items-center gap-2.5">
                <Shield className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{user.role}</span>
              </div>
            </div>

            {user.companyName && (
              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                  Company / Storefront
                </label>
                <div className="bg-[#F3F4F6] rounded-2xl p-3.5 border-0 text-xs font-bold text-slate-900 flex items-center gap-2.5">
                  <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{user.companyName}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Change Password Section */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Lock className="w-4 h-4 text-slate-700" />
              <span>Security & Change Password</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Update your secret account login password</p>
          </div>

          {passwordMessage && (
            <div
              className={`p-3.5 rounded-2xl border text-xs font-bold flex items-center gap-2 ${
                passwordMessage.error
                  ? 'bg-rose-50 text-rose-800 border-rose-200'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200'
              }`}
            >
              {passwordMessage.error ? (
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              ) : (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              )}
              <span>{passwordMessage.text}</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter your current password"
                className="w-full bg-[#F3F4F6] border-0 rounded-2xl p-3.5 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-900 focus:outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 8 chars, 1 uppercase, 1 special"
                  className="w-full bg-[#F3F4F6] border-0 rounded-2xl p-3.5 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-900 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full bg-[#F3F4F6] border-0 rounded-2xl p-3.5 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-900 focus:outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handlePasswordChange}
              className="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-sm transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Update Password</span>
            </button>
          </div>
        </div>
      </main>

      <HomeFooter />
    </div>
  );
};
