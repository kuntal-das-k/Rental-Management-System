import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import { useAuthStore } from '../store/useAuthStore';
import { Navbar } from '../components/Navbar';
import {
  User as UserIcon,
  Mail,
  Building2,
  Shield,
  MapPin,
  Save,
  Lock,
  CheckCircle2,
  AlertCircle,
  LogOut,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

    setPasswordMessage({ text: 'Password change would be submitted. (Feature demo)' });
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
      <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-slate-400">
          Please log in to view your profile.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 lg:px-8 py-10 flex-1 w-full space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-2xl font-black text-white shadow-lg shadow-cyan-500/20">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white">{user.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                  user.role === 'ADMIN'
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                    : user.role === 'VENDOR'
                    ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                {user.role}
              </span>
              {user.companyName && (
                <span className="text-xs text-slate-400 font-semibold">{user.companyName}</span>
              )}
            </div>
          </div>
        </div>

        {/* Account Info */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-5">
          <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <UserIcon className="w-4 h-4 text-cyan-400" />
            Account Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
              <div className="flex items-center gap-2 bg-slate-900/60 rounded-xl p-3 border border-slate-800">
                <UserIcon className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-semibold text-slate-200">{user.name}</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Email</label>
              <div className="flex items-center gap-2 bg-slate-900/60 rounded-xl p-3 border border-slate-800">
                <Mail className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-semibold text-slate-200">{user.email}</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Role</label>
              <div className="flex items-center gap-2 bg-slate-900/60 rounded-xl p-3 border border-slate-800">
                <Shield className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-semibold text-slate-200">{user.role}</span>
              </div>
            </div>

            {user.companyName && (
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Company</label>
                <div className="flex items-center gap-2 bg-slate-900/60 rounded-xl p-3 border border-slate-800">
                  <Building2 className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-semibold text-slate-200">{user.companyName}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Change Password */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-5">
          <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-400" />
            Change Password
          </h2>

          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                placeholder="Enter current password"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                  placeholder="Min 8 chars, 1 uppercase, 1 special"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                  placeholder="Confirm new password"
                />
              </div>
            </div>

            {passwordMessage && (
              <div className={`flex items-center gap-2 text-xs font-semibold ${passwordMessage.error ? 'text-red-400' : 'text-emerald-400'}`}>
                {passwordMessage.error ? <AlertCircle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                {passwordMessage.text}
              </div>
            )}

            <button
              onClick={handlePasswordChange}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-extrabold shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all"
            >
              <Save className="w-4 h-4" />
              Update Password
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="glass-panel rounded-2xl p-6 border border-red-500/20 space-y-4">
          <h2 className="text-sm font-bold text-red-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Session
          </h2>
          <p className="text-xs text-slate-400">
            Sign out of your current session on this device.
          </p>
          <button
            onClick={handleLogout}
            className="px-5 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold flex items-center gap-2 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </main>
    </div>
  );
};
