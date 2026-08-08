import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import { useAuthStore } from '../store/useAuthStore';
import { Navbar } from '../components/Navbar';
import { ReusableBarChart } from '../components/ReusableBarChart';
import { Order } from '../types';
import {
  ShieldCheck,
  Users,
  Package,
  DollarSign,
  Truck,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Calendar,
  BarChart3,
  ListFilter,
  Power,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'users' | 'analytics'>('overview');

  // Fetch Dashboard Metrics
  const { data: metrics } = useQuery({
    queryKey: ['admin-dashboard-metrics'],
    queryFn: async () => {
      const res = await api.get('/dashboard/metrics');
      return res.data.data;
    },
  });

  // Fetch all orders
  const { data: ordersData } = useQuery({
    queryKey: ['admin-all-orders'],
    queryFn: async () => {
      const res = await api.get('/orders');
      return res.data.data as Order[];
    },
  });

  // Fetch all users
  const { data: usersData, refetch: refetchUsers } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const res = await api.get('/auth/users');
      return res.data.data;
    },
  });

  const handleToggleActive = async (userId: string, currentStatus: boolean) => {
    try {
      await api.patch(`/auth/users/${userId}/active`, { isActive: !currentStatus });
      refetchUsers();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to toggle user status');
    }
  };

  const orders = ordersData || [];
  const users = usersData || [];

  const vendorCount = users.filter((u: any) => u.role === 'VENDOR').length;
  const customerCount = users.filter((u: any) => u.role === 'CUSTOMER').length;

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8 flex-1 w-full space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white">Admin Control Center</h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Platform-wide metrics, user management, and analytics
              </p>
            </div>
          </div>
        </div>

        {/* Executive Rental Operations Metrics Bar (All 8 Insights) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {[
            { label: 'Active Rentals', val: metrics?.activeRentals || 0, icon: Truck, color: 'text-cyan-400' },
            { label: 'Rentals Due Today', val: metrics?.rentalsDueToday || 0, icon: Calendar, color: 'text-amber-400' },
            { label: 'Upcoming Pickups', val: metrics?.upcomingPickups || 0, icon: Calendar, color: 'text-blue-400' },
            { label: 'Upcoming Returns', val: metrics?.upcomingReturns || 0, icon: RotateCcw, color: 'text-purple-400' },
            { label: 'Overdue Rentals', val: metrics?.overdueRentals || 0, icon: AlertTriangle, color: 'text-red-400' },
            { label: 'Revenue from Rentals', val: `$${(metrics?.totalRevenue || 0).toFixed(0)}`, icon: DollarSign, color: 'text-emerald-400' },
            { label: 'Security Deposits Held', val: `$${(metrics?.securityDepositsHeld || 0).toFixed(0)}`, icon: ShieldCheck, color: 'text-cyan-400' },
            { label: 'Late Fee Collection', val: `$${(metrics?.lateFeeCollection || 0).toFixed(0)}`, icon: DollarSign, color: 'text-amber-400' },
          ].map((widget, i) => {
            const WidgetIcon = widget.icon;
            return (
              <div key={i} className="glass-panel p-3 rounded-2xl border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-tight">{widget.label}</span>
                  <WidgetIcon className={`w-3.5 h-3.5 ${widget.color}`} />
                </div>
                <span className={`text-lg font-black block ${widget.color}`}>{widget.val}</span>
              </div>
            );
          })}
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
          {[
            { id: 'overview', label: 'Platform Overview', icon: BarChart3 },
            { id: 'orders', label: 'All Orders', icon: ListFilter },
            { id: 'users', label: 'User Management', icon: Users },
            { id: 'analytics', label: 'Revenue Analytics', icon: DollarSign },
          ].map((tab) => {
            const TabIcon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-sm'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                <TabIcon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab: Platform Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Due Today & Overdue */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass-panel rounded-2xl p-5 border border-slate-800">
                <h3 className="text-sm font-bold text-amber-400 mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Rentals Due Today ({metrics?.rentalsDueToday || 0})
                </h3>
                {metrics?.dueTodayOrders && metrics.dueTodayOrders.length > 0 ? (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {metrics.dueTodayOrders.map((ord: any) => (
                      <div key={ord.id} className="flex items-center justify-between bg-slate-900/60 rounded-xl p-3">
                        <div>
                          <span className="font-mono text-xs text-cyan-400 font-bold">#{ord.id.slice(0, 8)}</span>
                          <p className="text-xs text-slate-300 font-semibold">{ord.customer?.name}</p>
                        </div>
                        <span className="text-xs font-bold text-amber-400">${ord.total_amount?.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">No rentals due today</p>
                )}
              </div>

              <div className="glass-panel rounded-2xl p-5 border border-red-500/20">
                <h3 className="text-sm font-bold text-red-400 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> Overdue Rentals ({metrics?.overdueRentals || 0})
                </h3>
                {metrics?.overdueOrders && metrics.overdueOrders.length > 0 ? (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {metrics.overdueOrders.map((ord: any) => (
                      <div key={ord.id} className="flex items-center justify-between bg-slate-900/60 rounded-xl p-3 border border-red-500/10">
                        <div>
                          <span className="font-mono text-xs text-cyan-400 font-bold">#{ord.id.slice(0, 8)}</span>
                          <p className="text-xs text-slate-300 font-semibold">{ord.customer?.name}</p>
                        </div>
                        <span className="text-xs font-bold text-red-400">
                          Due: {new Date(ord.scheduled_return_at).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">No overdue rentals — all clear! ✅</p>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="glass-panel rounded-2xl p-5 border border-slate-800">
              <h3 className="text-sm font-bold text-slate-200 mb-4">Recent Orders</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="text-[10px] uppercase font-bold text-slate-500 border-b border-slate-800">
                    <tr>
                      <th className="py-2 px-2">Order ID</th>
                      <th className="py-2 px-2">Customer</th>
                      <th className="py-2 px-2">Vendor</th>
                      <th className="py-2 px-2">State</th>
                      <th className="py-2 px-2">Amount</th>
                      <th className="py-2 px-2">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {orders.slice(0, 10).map((ord) => (
                      <tr key={ord.id} className="hover:bg-slate-900/50">
                        <td className="py-2 px-2 font-mono text-cyan-400 font-bold">#{ord.id.slice(0, 8)}</td>
                        <td className="py-2 px-2 font-semibold text-slate-200">{ord.customer?.name}</td>
                        <td className="py-2 px-2 text-slate-400">{ord.vendor?.company_name}</td>
                        <td className="py-2 px-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-slate-800 text-cyan-400">
                            {ord.state}
                          </span>
                        </td>
                        <td className="py-2 px-2 font-bold text-white">${ord.total_amount.toFixed(2)}</td>
                        <td className="py-2 px-2 text-slate-400">{new Date(ord.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab: All Orders */}
        {activeTab === 'orders' && (
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="text-[10px] uppercase font-bold text-slate-500 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-2">Order ID</th>
                  <th className="py-3 px-2">Customer</th>
                  <th className="py-3 px-2">Vendor</th>
                  <th className="py-3 px-2">State</th>
                  <th className="py-3 px-2">Pickup</th>
                  <th className="py-3 px-2">Return</th>
                  <th className="py-3 px-2">Total</th>
                  <th className="py-3 px-2">Late</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-3 px-2 font-mono text-cyan-400 font-bold">#{ord.id.slice(0, 8)}</td>
                    <td className="py-3 px-2 font-bold text-slate-100">{ord.customer?.name}</td>
                    <td className="py-3 px-2 text-slate-400">{ord.vendor?.company_name}</td>
                    <td className="py-3 px-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-slate-800 text-cyan-400">
                        {ord.state}
                      </span>
                    </td>
                    <td className="py-3 px-2">{new Date(ord.scheduled_pickup_at).toLocaleDateString()}</td>
                    <td className="py-3 px-2">{new Date(ord.scheduled_return_at).toLocaleDateString()}</td>
                    <td className="py-3 px-2 font-bold text-white">${ord.total_amount.toFixed(2)}</td>
                    <td className="py-3 px-2">
                      {ord.is_late && <span className="text-red-400 font-bold">⚠ LATE</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab: User Management */}
        {activeTab === 'users' && (
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="text-[10px] uppercase font-bold text-slate-500 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-3">Name</th>
                  <th className="py-3 px-3">Email</th>
                  <th className="py-3 px-3">Role</th>
                  <th className="py-3 px-3">Company</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {users.map((u: any) => (
                  <tr key={u.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-100">{u.name}</td>
                    <td className="py-3 px-3 text-slate-400">{u.email}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                          u.role === 'ADMIN'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : u.role === 'VENDOR'
                            ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-200">
                      {u.vendor_profile?.company_name || '—'}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          u.is_active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {u.is_active ? 'Active' : 'Deactivated'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {u.role !== 'ADMIN' && (
                        <button
                          onClick={() => handleToggleActive(u.id, u.is_active)}
                          className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
                            u.is_active
                              ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30'
                              : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30'
                          }`}
                        >
                          {u.is_active ? 'Deactivate' : 'Activate'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab: Revenue Analytics */}
        {activeTab === 'analytics' && <ReusableBarChart />}
      </main>
    </div>
  );
};
