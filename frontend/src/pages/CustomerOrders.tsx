import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import { useAuthStore } from '../store/useAuthStore';
import { Navbar } from '../components/Navbar';
import { Order } from '../types';
import {
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  RotateCcw,
  FileText,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Calendar,
  CreditCard,
  Shield,
} from 'lucide-react';

const STATE_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  QUOTATION: { label: 'Quotation', color: 'text-slate-400', bg: 'bg-slate-500/10 border-slate-500/30', icon: FileText },
  QUOTATION_SENT: { label: 'Quotation Sent', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30', icon: Clock },
  SALES_ORDER: { label: 'Confirmed', color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/30', icon: CheckCircle2 },
  PICKED_UP: { label: 'Active Rental', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30', icon: Truck },
  RETURNED: { label: 'Returned', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30', icon: RotateCcw },
  CANCELLED: { label: 'Cancelled', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30', icon: XCircle },
};

export const CustomerOrders: React.FC = () => {
  const { user } = useAuthStore();
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [filterState, setFilterState] = useState<string>('ALL');

  const { data: ordersData, isLoading, refetch } = useQuery({
    queryKey: ['customer-orders'],
    queryFn: async () => {
      const res = await api.get('/orders');
      return res.data.data as Order[];
    },
    enabled: !!user,
  });

  const handleConfirmOrder = async (orderId: string) => {
    try {
      await api.patch(`/orders/${orderId}/confirm`);
      refetch();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to confirm order');
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    try {
      await api.patch(`/orders/${orderId}/cancel`);
      refetch();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to cancel order');
    }
  };

  const handleCreateInvoice = async (orderId: string) => {
    try {
      const res = await api.post(`/orders/${orderId}/create-invoice`);
      alert(`Invoice ${res.data.data.invoice_number} generated successfully!`);
      refetch();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to generate invoice');
    }
  };

  const orders = ordersData || [];
  const filteredOrders = filterState === 'ALL' ? orders : orders.filter((o) => o.state === filterState);

  const activeCount = orders.filter((o) => ['SALES_ORDER', 'PICKED_UP'].includes(o.state)).length;
  const completedCount = orders.filter((o) => o.state === 'RETURNED').length;
  const totalSpent = orders
    .filter((o) => ['SALES_ORDER', 'PICKED_UP', 'RETURNED'].includes(o.state))
    .reduce((sum, o) => sum + o.total_amount, 0);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-slate-400">
          Please log in to view your orders.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 lg:px-8 py-10 flex-1 w-full space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white">My Rental Orders</h1>
            <p className="text-xs text-slate-400 mt-1">
              Track all your equipment and vehicle rentals in one place
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="px-3 py-1.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-bold">
              {user.name}
            </span>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Orders', value: orders.length, icon: Package, color: 'text-cyan-400' },
            { label: 'Active Rentals', value: activeCount, icon: Truck, color: 'text-amber-400' },
            { label: 'Completed', value: completedCount, icon: CheckCircle2, color: 'text-emerald-400' },
            { label: 'Total Spent', value: `$${totalSpent.toFixed(0)}`, icon: CreditCard, color: 'text-blue-400' },
          ].map((card, i) => {
            const CardIcon = card.icon;
            return (
              <div key={i} className="glass-panel p-4 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{card.label}</span>
                  <CardIcon className={`w-4 h-4 ${card.color}`} />
                </div>
                <span className={`text-xl font-black ${card.color}`}>{card.value}</span>
              </div>
            );
          })}
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {['ALL', 'QUOTATION', 'QUOTATION_SENT', 'SALES_ORDER', 'PICKED_UP', 'RETURNED', 'CANCELLED'].map((state) => (
            <button
              key={state}
              onClick={() => setFilterState(state)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                filterState === state
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200 border border-transparent'
              }`}
            >
              {state === 'ALL' ? `All (${orders.length})` : `${STATE_CONFIG[state]?.label || state} (${orders.filter((o) => o.state === state).length})`}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-24 rounded-2xl bg-slate-900/60 animate-pulse" />
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-16 glass-panel rounded-2xl border border-slate-800">
            <Package className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 text-sm font-semibold">No orders found</p>
            <p className="text-slate-500 text-xs mt-1">Browse our storefront to rent premium equipment!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const config = STATE_CONFIG[order.state] || STATE_CONFIG.QUOTATION;
              const StateIcon = config.icon;
              const isExpanded = expandedOrderId === order.id;

              return (
                <div key={order.id} className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
                  {/* Order Header Row */}
                  <button
                    onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                    className="w-full p-5 flex items-center justify-between gap-4 hover:bg-slate-900/40 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className={`p-2.5 rounded-xl ${config.bg} border`}>
                        <StateIcon className={`w-5 h-5 ${config.color}`} />
                      </div>
                      <div className="text-left min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs text-cyan-400 font-bold">#{order.id.slice(0, 8)}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${config.bg} ${config.color} border`}>
                            {config.label}
                          </span>
                          {order.is_late && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" /> OVERDUE
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5 truncate">
                          {order.vendor?.company_name} · {order.order_items?.length || 0} item(s) · ${order.total_amount.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-400 shrink-0">
                      <div className="hidden sm:flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{new Date(order.scheduled_pickup_at).toLocaleDateString()} → {new Date(order.scheduled_return_at).toLocaleDateString()}</span>
                      </div>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {/* Expanded Detail */}
                  {isExpanded && (
                    <div className="px-5 pb-5 border-t border-slate-800/60 pt-4 space-y-4">
                      {/* Items Table */}
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs text-slate-300">
                          <thead className="text-[10px] uppercase font-bold text-slate-500 border-b border-slate-800">
                            <tr>
                              <th className="py-2 text-left">Product</th>
                              <th className="py-2 text-center">Qty</th>
                              <th className="py-2 text-right">Unit Price</th>
                              <th className="py-2 text-right">Line Total</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/60">
                            {order.order_items?.map((item) => (
                              <tr key={item.id}>
                                <td className="py-2 font-semibold text-slate-200">{item.product?.name || 'Product'}</td>
                                <td className="py-2 text-center">{item.quantity}</td>
                                <td className="py-2 text-right">${item.unit_price.toFixed(2)}</td>
                                <td className="py-2 text-right font-bold text-white">${item.line_total.toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Rental Period & Payments Info */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-slate-900/60 rounded-xl p-3 space-y-1">
                          <span className="text-[10px] font-bold text-slate-500 uppercase">Pickup</span>
                          <p className="text-xs font-semibold text-slate-200">
                            {new Date(order.scheduled_pickup_at).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                          <span className="text-[10px] text-slate-400">{order.pickup_type === 'DELIVERY' ? '🚚 Home Delivery' : '🏪 Store Pickup'}</span>
                        </div>

                        <div className="bg-slate-900/60 rounded-xl p-3 space-y-1">
                          <span className="text-[10px] font-bold text-slate-500 uppercase">Return</span>
                          <p className="text-xs font-semibold text-slate-200">
                            {new Date(order.scheduled_return_at).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                          {order.actual_return_at && (
                            <span className="text-[10px] text-emerald-400">
                              ✅ Actual: {new Date(order.actual_return_at).toLocaleDateString()}
                            </span>
                          )}
                        </div>

                        <div className="bg-slate-900/60 rounded-xl p-3 space-y-1">
                          <span className="text-[10px] font-bold text-slate-500 uppercase">Payments</span>
                          {order.payments && order.payments.length > 0 ? (
                            order.payments.map((p, i) => (
                              <p key={i} className="text-[11px] text-slate-300">
                                <span className="font-bold">{p.type}</span>: ${p.amount.toFixed(2)} via {p.method}
                              </p>
                            ))
                          ) : (
                            <p className="text-[11px] text-slate-400">No payments recorded</p>
                          )}
                        </div>
                      </div>

                      {/* Invoices */}
                      {order.invoices && order.invoices.length > 0 && (
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="text-[10px] font-bold text-slate-500 uppercase">Invoices:</span>
                          {order.invoices.map((inv) => (
                            <a
                              key={inv.id}
                              href={inv.pdf_url ? `http://localhost:5000${inv.pdf_url}` : '#'}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold hover:bg-emerald-500/20 transition-colors"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              {inv.invoice_number}
                            </a>
                          ))}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-3 pt-2 border-t border-slate-800/60">
                        {(order.state === 'QUOTATION' || order.state === 'QUOTATION_SENT') && (
                          <>
                            <button
                              onClick={() => handleConfirmOrder(order.id)}
                              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-extrabold shadow-lg shadow-cyan-500/20 transition-all"
                            >
                              Confirm Order
                            </button>
                            <button
                              onClick={() => handleCancelOrder(order.id)}
                              className="px-4 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30 text-xs font-bold transition-all"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        {['SALES_ORDER', 'PICKED_UP', 'RETURNED'].includes(order.state) && (
                          <button
                            onClick={() => handleCreateInvoice(order.id)}
                            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            {order.invoices && order.invoices.length > 0 ? 'View Invoice' : 'Generate Invoice'}
                          </button>
                        )}
                        {order.state === 'SALES_ORDER' && (
                          <button
                            onClick={() => handleCancelOrder(order.id)}
                            className="px-4 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30 text-xs font-bold transition-all"
                          >
                            Cancel Order
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};
