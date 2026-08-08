import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '../api/client';
import { useAuthStore } from '../store/useAuthStore';
import {
  X,
  Send,
  HelpCircle,
  AlertTriangle,
  FileText,
  DollarSign,
  Package,
  CheckCircle2,
  Clock,
  MessageSquare,
  RefreshCw,
} from 'lucide-react';

interface VendorSupportModalProps {
  onClose: () => void;
}

export const VendorSupportModal: React.FC<VendorSupportModalProps> = ({ onClose }) => {
  const { user } = useAuthStore();
  const [activeSubTab, setActiveSubTab] = useState<'new' | 'history'>('new');

  // Form State
  const [topic, setTopic] = useState<string>('System Error / Bug Report');
  const [subject, setSubject] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch Vendor's Past Queries
  const {
    data: pastMessages = [],
    isLoading: isLoadingHistory,
    refetch: refetchHistory,
  } = useQuery({
    queryKey: ['vendor-support-messages', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      const res = await api.get('/contact', {
        params: { email: user.email },
      });
      return res.data.data || [];
    },
    enabled: !!user?.email,
  });

  // Submit Query Mutation
  const submitMutation = useMutation({
    mutationFn: async () => {
      if (!message.trim()) {
        throw new Error('Please enter your query message details.');
      }
      const fullTopic = subject.trim() ? `${topic} - ${subject.trim()}` : topic;
      const res = await api.post('/contact', {
        name: user?.name || 'Vendor',
        email: user?.email || '',
        topic: fullTopic,
        message: message.trim(),
      });
      return res.data;
    },
    onSuccess: () => {
      setIsSuccess(true);
      setSubject('');
      setMessage('');
      setErrorMessage(null);
      refetchHistory();
    },
    onError: (err: any) => {
      setErrorMessage(err.response?.data?.error || err.message || 'Failed to send query.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMutation.mutate();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Bar */}
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-amber-400">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight">Vendor Support & Admin Query</h3>
              <p className="text-xs text-slate-300 font-medium">
                Direct communication channel to report errors or request assistance
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Sub Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-2">
          <button
            onClick={() => {
              setActiveSubTab('new');
              setIsSuccess(false);
            }}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-extrabold transition-all border-b-2 ${
              activeSubTab === 'new'
                ? 'border-slate-900 bg-white text-slate-900 shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            ✍️ Compose New Query
          </button>
          <button
            onClick={() => setActiveSubTab('history')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-extrabold transition-all border-b-2 flex items-center gap-1.5 ${
              activeSubTab === 'history'
                ? 'border-slate-900 bg-white text-slate-900 shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <span>📜 Sent Queries & Status</span>
            {pastMessages.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-900 text-white">
                {pastMessages.length}
              </span>
            )}
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeSubTab === 'new' && (
            <>
              {isSuccess ? (
                <div className="text-center py-10 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xl font-black text-slate-900">Query Sent Successfully!</h4>
                    <p className="text-xs text-slate-500 font-semibold max-w-md mx-auto">
                      Your inquiry has been stored. The platform administrator will review your message and reach out shortly.
                    </p>
                  </div>
                  <div className="pt-4 flex justify-center gap-3">
                    <button
                      onClick={() => setIsSuccess(false)}
                      className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-xs hover:bg-slate-800"
                    >
                      Send Another Query
                    </button>
                    <button
                      onClick={() => setActiveSubTab('history')}
                      className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold hover:bg-slate-200"
                    >
                      View Sent History
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {errorMessage && (
                    <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Vendor Account Details Banner */}
                  <div className="p-3.5 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-700">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-extrabold">
                        From Store Account
                      </span>
                      <span className="font-extrabold text-slate-900">{user?.companyName || user?.name}</span> (
                      {user?.email})
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-slate-900 text-white uppercase">
                      VENDOR
                    </span>
                  </div>

                  {/* Topic / Issue Category Selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-extrabold text-slate-800 block">Select Query Topic</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: 'System Error / Bug Report', icon: AlertTriangle },
                        { label: 'Inventory / Product Listing', icon: Package },
                        { label: 'Billing & Security Deposit', icon: DollarSign },
                        { label: 'Odoo Rental Order Issue', icon: FileText },
                        { label: 'General Admin Inquiry', icon: HelpCircle },
                      ].map((item) => {
                        const ItemIcon = item.icon;
                        const isSelected = topic === item.label;
                        return (
                          <button
                            key={item.label}
                            type="button"
                            onClick={() => setTopic(item.label)}
                            className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all text-xs font-extrabold ${
                              isSelected
                                ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <ItemIcon className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-slate-400'}`} />
                            <span className="line-clamp-1">{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Optional Subject Line */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-slate-800 block">Query Subject / Reference ID</label>
                    <input
                      type="text"
                      placeholder="e.g. Error editing rental product #PRD-102 or Order #ORD-882"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-slate-900 focus:bg-white focus:outline-none"
                    />
                  </div>

                  {/* Message Body */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-slate-800 block">Detailed Query Description *</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Describe the issue, requested changes, or help needed in detail so admin can assist effectively..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-slate-900 focus:bg-white focus:outline-none leading-relaxed"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitMutation.isPending}
                      className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold flex items-center gap-2 shadow-xs transition-all disabled:opacity-50"
                    >
                      {submitMutation.isPending ? (
                        <span>Sending Query...</span>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Submit Query to Admin</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </>
          )}

          {activeSubTab === 'history' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                  Submitted Support Queries ({pastMessages.length})
                </h4>
                <button
                  onClick={() => refetchHistory()}
                  className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Refresh</span>
                </button>
              </div>

              {isLoadingHistory ? (
                <div className="text-center py-8 text-xs font-semibold text-slate-400">Loading history...</div>
              ) : pastMessages.length === 0 ? (
                <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
                  <MessageSquare className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-xs font-bold text-slate-600">No queries sent yet</p>
                  <p className="text-[11px] text-slate-400 font-medium">
                    Use the compose form to send any questions or bug reports to admin.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pastMessages.map((msg: any) => (
                    <div
                      key={msg.id}
                      className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2 text-xs"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-extrabold text-slate-900 text-sm block">{msg.topic}</span>
                          <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(msg.created_at).toLocaleString()}
                          </span>
                        </div>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            msg.status === 'REPLIED'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : msg.status === 'READ'
                              ? 'bg-blue-100 text-blue-800 border border-blue-200'
                              : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}
                        >
                          ● {msg.status}
                        </span>
                      </div>
                      <p className="text-slate-700 font-medium bg-white p-3 rounded-xl border border-slate-200/60 leading-relaxed whitespace-pre-wrap">
                        {msg.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
