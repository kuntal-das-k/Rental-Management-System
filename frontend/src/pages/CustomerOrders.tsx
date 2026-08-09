import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import { useAuthStore } from '../store/useAuthStore';
import { NavbarHeader } from '../components/home/NavbarHeader';
import { HomeFooter } from '../components/home/HomeFooter';
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
  Building2,
  Search,
  ExternalLink,
  ShoppingBag,
  Check,
} from 'lucide-react';

const STATE_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; border: string; icon: React.ElementType }
> = {
  QUOTATION: {
    label: 'Quotation Draft',
    color: 'text-slate-700',
    bg: 'bg-slate-100',
    border: 'border-slate-300',
    icon: FileText,
  },
  QUOTATION_SENT: {
    label: 'Quotation Sent',
    color: 'text-blue-800',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: Clock,
  },
  SALES_ORDER: {
    label: 'Order Confirmed',
    color: 'text-cyan-800',
    bg: 'bg-cyan-50',
    border: 'border-cyan-200',
    icon: CheckCircle2,
  },
  PICKED_UP: {
    label: 'Active Rental',
    color: 'text-amber-800',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    icon: Truck,
  },
  RETURNED: {
    label: 'Completed & Returned',
    color: 'text-emerald-800',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    icon: RotateCcw,
  },
  CANCELLED: {
    label: 'Order Cancelled',
    color: 'text-rose-800',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    icon: XCircle,
  },
};

const ODOO_STEPS = [
  { key: 'QUOTATION', label: 'Quotation Created' },
  { key: 'QUOTATION_SENT', label: 'Quotation Sent' },
  { key: 'SALES_ORDER', label: 'Sales Order' },
  { key: 'PICKED_UP', label: 'Picked Up' },
  { key: 'RETURNED', label: 'Returned' },
];

const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=300&q=80';

const getValidImageUrl = (product: any): string => {
  if (!product) return DEFAULT_FALLBACK_IMAGE;

  const raw = product.image_urls || product.images || product.image;
  if (!raw) return DEFAULT_FALLBACK_IMAGE;

  let urlStr = '';

  if (Array.isArray(raw)) {
    urlStr = raw[0] || '';
  } else if (typeof raw === 'string') {
    const trimmed = raw.trim();
    if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) urlStr = parsed[0] || '';
        else if (typeof parsed === 'string') urlStr = parsed;
      } catch {
        urlStr = trimmed;
      }
    } else {
      urlStr = trimmed;
    }
  }

  if (!urlStr || urlStr === '[]' || urlStr === '{}') {
    return DEFAULT_FALLBACK_IMAGE;
  }

  if (urlStr.startsWith('/uploads') || urlStr.startsWith('uploads')) {
    const path = urlStr.startsWith('/') ? urlStr : `/${urlStr}`;
    return `http://localhost:5000${path}`;
  }

  return urlStr;
};

export const CustomerOrders: React.FC = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [filterState, setFilterState] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const { data: ordersData, isLoading, refetch } = useQuery({
    queryKey: ['customer-orders'],
    queryFn: async () => {
      const res = await api.get('/orders');
      return (res.data.data as Order[]) || [];
    },
    enabled: !!user,
  });

  const handleConfirmOrder = async (orderId: string) => {
    try {
      await api.patch(`/orders/${orderId}/confirm`);
      await queryClient.invalidateQueries();
      refetch();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to confirm order');
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    try {
      await api.patch(`/orders/${orderId}/cancel`);
      await queryClient.invalidateQueries();
      refetch();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to cancel order');
    }
  };

  const handleCreateInvoice = async (orderId: string) => {
    try {
      const res = await api.post(`/orders/${orderId}/create-invoice`);
      alert(`Invoice ${res.data.data.invoice_number} generated successfully!`);
      await queryClient.invalidateQueries();
      refetch();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to generate invoice');
    }
  };

  const orders = ordersData || [];

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch =
        o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.vendor?.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.order_items?.some((i) => i.product?.name?.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesState = filterState === 'ALL' || o.state === filterState;
      return matchesSearch && matchesState;
    });
  }, [orders, searchQuery, filterState]);

  const activeCount = orders.filter((o) => ['SALES_ORDER', 'PICKED_UP'].includes(o.state)).length;
  const completedCount = orders.filter((o) => o.state === 'RETURNED').length;
  const totalSpent = orders
    .filter((o) => ['SALES_ORDER', 'PICKED_UP', 'RETURNED'].includes(o.state))
    .reduce((sum, o) => sum + o.total_amount, 0);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans">
        <NavbarHeader />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
            <Package className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-extrabold text-slate-900">Please Log In</h2>
            <p className="text-xs text-slate-500 font-semibold max-w-sm">
              Log in to view your active equipment rentals, quotation history, and invoices.
            </p>
          </div>
          <Link
            to="/login"
            className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-extrabold text-xs shadow-xs hover:bg-slate-800"
          >
            Sign In to Account
          </Link>
        </div>
        <HomeFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans selection:bg-slate-900 selection:text-white">
      <NavbarHeader />

      <main className="max-w-6xl mx-auto px-4 lg:px-8 py-10 flex-1 w-full space-y-8">
        {/* Header Hero Banner */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-800 border border-slate-200">
                Customer Rental Portal
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              My Rental Orders & Bookings
            </h1>
            <p className="text-xs text-slate-500 font-semibold leading-relaxed max-w-xl">
              Track quotation states, pickup/return schedules, security deposits, and official Odoo-generated invoices.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 shrink-0">
            <div className="w-11 h-11 rounded-xl bg-slate-900 text-white font-black text-base flex items-center justify-center shadow-2xs">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="text-xs">
              <span className="font-extrabold text-slate-900 block">{user.name}</span>
              <span className="text-[11px] text-slate-500 font-semibold">{user.email}</span>
            </div>
          </div>
        </div>

        {/* 4 Summary Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'TOTAL ORDERS', value: orders.length, icon: Package, color: 'text-slate-900' },
            { label: 'ACTIVE RENTALS', value: activeCount, icon: Truck, color: 'text-amber-600' },
            { label: 'COMPLETED', value: completedCount, icon: CheckCircle2, color: 'text-emerald-600' },
            { label: 'TOTAL SPENT', value: `₹${totalSpent.toFixed(0)}`, icon: CreditCard, color: 'text-blue-600' },
          ].map((card, i) => {
            const CardIcon = card.icon;
            return (
              <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    {card.label}
                  </span>
                  <CardIcon className={`w-4 h-4 ${card.color}`} />
                </div>
                <span className={`text-2xl sm:text-3xl font-black block ${card.color}`}>{card.value}</span>
              </div>
            );
          })}
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search orders, vendors, or items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F3F4F6] border-0 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-slate-900 focus:outline-none"
              />
            </div>

            <div className="text-xs font-bold text-slate-500 flex items-center gap-1.5 self-end sm:self-center">
              <span>Showing {filteredOrders.length} of {orders.length} orders</span>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pt-1 border-t border-slate-100">
            {['ALL', 'QUOTATION', 'QUOTATION_SENT', 'SALES_ORDER', 'PICKED_UP', 'RETURNED', 'CANCELLED'].map((state) => {
              const count = state === 'ALL' ? orders.length : orders.filter((o) => o.state === state).length;
              const isSelected = filterState === state;
              return (
                <button
                  key={state}
                  onClick={() => setFilterState(state)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  {state === 'ALL'
                    ? `All (${count})`
                    : `${STATE_CONFIG[state]?.label || state} (${count})`}
                </button>
              );
            })}
          </div>
        </div>

        {/* Orders List Container */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-28 rounded-3xl bg-slate-200/60 animate-pulse" />
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 border border-slate-200/80 shadow-xs text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Package className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-extrabold text-slate-900">No Rental Orders Found</h3>
              <p className="text-xs text-slate-500 font-semibold max-w-sm mx-auto">
                {searchQuery
                  ? 'No orders match your search keyword. Try adjusting filters.'
                  : 'You haven’t placed any rental orders yet. Explore our multi-vendor equipment marketplace!'}
              </p>
            </div>
            <Link
              to="/rentals"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-xs transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Browse Rental Catalog</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => {
              const config = STATE_CONFIG[order.state] || STATE_CONFIG.QUOTATION;
              const StateIcon = config.icon;
              const isExpanded = expandedOrderId === order.id;

              // Calculate current step index for Odoo Workflow Timeline
              const currentStepIndex = ODOO_STEPS.findIndex((s) => s.key === order.state);

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden transition-all duration-300 hover:shadow-md"
                >
                  {/* Order Header Box */}
                  <div
                    onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                    className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/80 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      {/* Product Image Thumbnail */}
                      <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 shadow-2xs flex items-center justify-center">
                        {order.order_items && order.order_items.length > 0 ? (
                          <img
                            src={getValidImageUrl(order.order_items[0]?.product)}
                            alt={order.order_items[0]?.product?.name || 'Ordered Rental Asset'}
                            onError={(e) => {
                              e.currentTarget.src = DEFAULT_FALLBACK_IMAGE;
                            }}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className={`w-full h-full ${config.bg} flex items-center justify-center`}>
                            <StateIcon className={`w-6 h-6 ${config.color}`} />
                          </div>
                        )}

                        {order.order_items && order.order_items.length > 1 && (
                          <span className="absolute bottom-0 right-0 bg-slate-900/90 text-white text-[9px] font-black px-1.5 py-0.5 rounded-tl-lg leading-none">
                            +{order.order_items.length - 1}
                          </span>
                        )}
                      </div>

                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-black text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-lg border border-slate-200">
                            #ORD-{order.id.slice(0, 8).toUpperCase()}
                          </span>
                          <span className={`px-3 py-0.5 rounded-full text-[10px] font-black uppercase ${config.bg} ${config.color} ${config.border} border`}>
                            ● {config.label}
                          </span>
                          {order.is_late && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3 text-rose-600" /> OVERDUE
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3 text-xs text-slate-500 font-semibold flex-wrap">
                          <span className="flex items-center gap-1 text-slate-900 font-extrabold">
                            <Building2 className="w-3.5 h-3.5 text-slate-400" />
                            {order.vendor?.company_name || 'Vendor Store'}
                          </span>
                          <span>•</span>
                          <span>{order.order_items?.length || 0} Item(s)</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            {new Date(order.scheduled_pickup_at).toLocaleDateString()} → {new Date(order.scheduled_return_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-0 border-slate-100 shrink-0">
                      <div className="text-left sm:text-right">
                        <span className="text-xs text-slate-400 font-extrabold block uppercase tracking-wider text-[10px]">
                          TOTAL AMOUNT
                        </span>
                        <span className="text-xl font-black text-slate-900">
                          ₹{order.total_amount.toFixed(2)}
                        </span>
                      </div>

                      <button
                        type="button"
                        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-all"
                        title={isExpanded ? 'Collapse Details' : 'Expand Order Details'}
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Odoo Rental State Machine Progress Bar */}
                  {order.state !== 'CANCELLED' && (
                    <div className="px-6 py-3 bg-slate-50 border-t border-b border-slate-100 flex items-center justify-between gap-2 overflow-x-auto text-[11px] font-extrabold">
                      {ODOO_STEPS.map((step, idx) => {
                        const isDone = currentStepIndex >= idx;
                        const isCurrent = currentStepIndex === idx;
                        return (
                          <div key={step.key} className="flex items-center gap-2 shrink-0">
                            <div
                              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                                isCurrent
                                  ? 'bg-slate-900 text-white ring-2 ring-slate-900/30'
                                  : isDone
                                  ? 'bg-emerald-500 text-white'
                                  : 'bg-slate-200 text-slate-500'
                              }`}
                            >
                              {isDone ? <Check className="w-3 h-3" /> : idx + 1}
                            </div>
                            <span className={isCurrent ? 'text-slate-900 font-black' : isDone ? 'text-slate-700' : 'text-slate-400'}>
                              {step.label}
                            </span>
                            {idx < ODOO_STEPS.length - 1 && (
                              <div className={`w-8 h-0.5 ${isDone ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Expanded Order Details */}
                  {isExpanded && (
                    <div className="p-6 space-y-6 bg-slate-50/50 border-t border-slate-100">
                      {/* Products & Items Table */}
                      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-3 shadow-2xs">
                        <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                          Rental Items Breakdown
                        </h4>

                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                              <tr>
                                <th className="py-2.5 px-4">ITEM DESCRIPTION</th>
                                <th className="py-2.5 px-4 text-center">QTY</th>
                                <th className="py-2.5 px-4 text-right">UNIT PRICE</th>
                                <th className="py-2.5 px-4 text-right">LINE TOTAL</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-medium">
                              {order.order_items?.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50/60">
                                  <td className="py-3 px-4">
                                    <div className="flex items-center gap-3">
                                      <img
                                        src={getValidImageUrl(item.product)}
                                        alt={item.product?.name || 'Rental Asset'}
                                        onError={(e) => {
                                          e.currentTarget.src = DEFAULT_FALLBACK_IMAGE;
                                        }}
                                        className="w-9 h-9 rounded-xl object-contain bg-slate-100 border border-slate-200 shrink-0"
                                      />
                                      <div>
                                        <span className="font-extrabold text-slate-900 block">
                                          {item.product?.name || 'Rental Asset'}
                                        </span>
                                        <span className="text-[10px] text-slate-400 font-semibold">
                                          Type: {item.product?.product_type || 'GOODS'}
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="py-3 px-4 text-center font-extrabold text-slate-900">
                                    {item.quantity}
                                  </td>
                                  <td className="py-3 px-4 text-right text-slate-700 font-semibold">
                                    ₹{item.unit_price.toFixed(2)}
                                  </td>
                                  <td className="py-3 px-4 text-right font-black text-slate-900">
                                    ₹{item.line_total.toFixed(2)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Pickup, Return & Deposit Cards Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Pickup Schedule */}
                        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                            SCHEDULED PICKUP
                          </span>
                          <div className="flex items-center gap-2 text-xs font-extrabold text-slate-900">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            <span>
                              {new Date(order.scheduled_pickup_at).toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </span>
                          </div>
                          <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-slate-100 text-slate-700">
                            {order.pickup_type === 'DELIVERY' ? '🚚 Doorstep Delivery' : '🏪 Store Pickup'}
                          </span>
                        </div>

                        {/* Return Schedule */}
                        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                            SCHEDULED RETURN
                          </span>
                          <div className="flex items-center gap-2 text-xs font-extrabold text-slate-900">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            <span>
                              {new Date(order.scheduled_return_at).toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </span>
                          </div>
                          {order.actual_return_at && (
                            <span className="text-[10px] font-extrabold text-emerald-700 block">
                              ✅ Actual Return: {new Date(order.actual_return_at).toLocaleDateString()}
                            </span>
                          )}
                        </div>

                        {/* Deposit & Fee Ledger */}
                        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                            <Shield className="w-3.5 h-3.5 text-slate-500" /> Security Deposit Ledger
                          </span>
                          {order.payments && order.payments.length > 0 ? (
                            order.payments.map((p, i) => (
                              <div
                                key={i}
                                className="text-[11px] flex items-center justify-between border-b border-slate-100 pb-1"
                              >
                                <span className="font-bold text-slate-700">
                                  {p.type === 'DEPOSIT'
                                    ? '🛡 Deposit'
                                    : p.type === 'LATE_FEE'
                                    ? '⚠️ Late Fee Penalty'
                                    : '💳 Rental Fee'}
                                </span>
                                <span
                                  className={`font-black ${
                                    p.type === 'LATE_FEE' ? 'text-rose-600' : 'text-slate-900'
                                  }`}
                                >
                                  ₹{p.amount.toFixed(2)}
                                </span>
                              </div>
                            ))
                          ) : (
                            <p className="text-[11px] text-slate-400 font-semibold">No deposit payments logged</p>
                          )}
                        </div>
                      </div>

                      {/* PDF Invoices */}
                      {order.invoices && order.invoices.length > 0 && (
                        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-4 flex-wrap">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-emerald-600" />
                            <span className="text-xs font-extrabold text-slate-900">Official Invoice Documents</span>
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            {order.invoices.map((inv) => (
                              <a
                                key={inv.id}
                                href={inv.pdf_url ? `http://localhost:5000${inv.pdf_url}` : '#'}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-200 text-xs font-extrabold transition-colors shadow-2xs"
                              >
                                <FileText className="w-3.5 h-3.5" />
                                <span>Download PDF ({inv.invoice_number})</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action Bar */}
                      <div className="flex items-center justify-end gap-3 pt-2">
                        {(order.state === 'QUOTATION' || order.state === 'QUOTATION_SENT') && (
                          <>
                            <button
                              onClick={() => handleConfirmOrder(order.id)}
                              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold shadow-xs transition-all active:scale-[0.99]"
                            >
                              Confirm Quotation & Place Order
                            </button>
                            <button
                              onClick={() => handleCancelOrder(order.id)}
                              className="px-4 py-2.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-xs font-extrabold transition-all"
                            >
                              Cancel Order
                            </button>
                          </>
                        )}
                        {['SALES_ORDER', 'PICKED_UP', 'RETURNED'].includes(order.state) && (
                          <button
                            onClick={() => handleCreateInvoice(order.id)}
                            className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-extrabold shadow-2xs transition-all flex items-center gap-2"
                          >
                            <FileText className="w-4 h-4 text-slate-600" />
                            <span>{order.invoices && order.invoices.length > 0 ? 'Generate New Invoice' : 'Generate Invoice PDF'}</span>
                          </button>
                        )}
                        {order.state === 'SALES_ORDER' && (
                          <button
                            onClick={() => handleCancelOrder(order.id)}
                            className="px-4 py-2.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-xs font-extrabold transition-all"
                          >
                            Cancel Booking
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

      <HomeFooter />
    </div>
  );
};
