import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import { useAuthStore } from '../store/useAuthStore';
import { Navbar } from '../components/Navbar';
import { OrdersKanban } from '../components/OrdersKanban';
import { SchedulerCalendar } from '../components/SchedulerCalendar';
import { ReusableBarChart } from '../components/ReusableBarChart';
import { PickupReturnModal } from '../components/PickupReturnModal';
import { ProductModal } from '../components/ProductModal';
import { Order, Product } from '../types';
import {
  LayoutDashboard,
  Calendar as CalendarIcon,
  Package,
  FileSpreadsheet,
  DollarSign,
  Truck,
  RotateCcw,
  AlertTriangle,
  ShieldCheck,
  Plus,
  BarChart3,
  ListFilter,
  CheckCircle2,
} from 'lucide-react';

export const VendorDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<'kanban' | 'list' | 'scheduler' | 'products' | 'pricelists' | 'analytics'>('kanban');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [pickupModalOrder, setPickupModalOrder] = useState<Order | null>(null);
  const [returnModalOrder, setReturnModalOrder] = useState<Order | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null | undefined>(undefined);

  // Fetch Dashboard Metrics
  const { data: metrics } = useQuery({
    queryKey: ['dashboard-metrics', user?.vendorId],
    queryFn: async () => {
      const res = await api.get('/dashboard/metrics');
      return res.data.data;
    },
  });

  // Fetch Vendor Orders
  const { data: ordersData, refetch: refetchOrders } = useQuery({
    queryKey: ['vendor-orders'],
    queryFn: async () => {
      const res = await api.get('/orders');
      return res.data.data as Order[];
    },
  });

  // Fetch Vendor Products
  const { data: productsData, refetch: refetchProducts } = useQuery({
    queryKey: ['vendor-products'],
    queryFn: async () => {
      const res = await api.get('/products', { params: { vendorId: user?.role === 'VENDOR' ? user.vendorId : undefined } });
      return res.data.data as Product[];
    },
  });

  // Order State Action Handlers
  const handleSendQuotation = async (id: string) => {
    try {
      await api.patch(`/orders/${id}/send-quotation`);
      refetchOrders();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Action failed');
    }
  };

  const handleConfirmOrder = async (id: string) => {
    try {
      await api.patch(`/orders/${id}/confirm`);
      refetchOrders();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Action failed');
    }
  };

  const handleCreateInvoice = async (id: string) => {
    try {
      const res = await api.post(`/orders/${id}/create-invoice`);
      alert(`Invoice created: ${res.data.data.invoice_number}`);
      refetchOrders();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Action failed');
    }
  };

  const handleConfirmPickup = async (notes: string) => {
    if (!pickupModalOrder) return;
    try {
      await api.patch(`/orders/${pickupModalOrder.id}/pickup`, { conditionNotes: notes });
      setPickupModalOrder(null);
      refetchOrders();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Pickup confirmation failed');
    }
  };

  const handleConfirmReturn = async (notes: string, conditionPass: boolean) => {
    if (!returnModalOrder) return;
    try {
      await api.patch(`/orders/${returnModalOrder.id}/return`, { conditionNotes: notes, conditionPass });
      setReturnModalOrder(null);
      refetchOrders();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Return confirmation failed');
    }
  };

  const handleTogglePublishProduct = async (productId: string, isPublished: boolean) => {
    try {
      await api.patch(`/products/${productId}/publish`, { isPublished: !isPublished });
      refetchProducts();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Publish toggle failed (Admin role required)');
    }
  };

  const orders = ordersData || [];
  const products = productsData || [];

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8 flex-1 w-full space-y-8">
        {/* Header Title Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-white">Vendor Portal & Operations Hub</h1>
              {user?.companyName && (
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  {user.companyName}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Odoo Rental workflow conventions: Quotation → Quotation Sent → Sales Order → Invoice
            </p>
          </div>

          <button
            onClick={() => setEditingProduct(null)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>List New Rentable Item</span>
          </button>
        </div>

        {/* Executive Rental Operations Metrics Bar (All 8 Insights - Interactive) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {[
            { id: 'active', label: 'Active Rentals', val: metrics?.activeRentals || 0, icon: Truck, color: 'text-cyan-400', filterState: 'active' },
            { id: 'dueToday', label: 'Rentals Due Today', val: metrics?.rentalsDueToday || 0, icon: CheckCircle2, color: 'text-amber-400', filterState: 'dueToday' },
            { id: 'upcomingPickups', label: 'Upcoming Pickups', val: metrics?.upcomingPickups || 0, icon: CalendarIcon, color: 'text-blue-400', filterState: 'SALES_ORDER' },
            { id: 'upcomingReturns', label: 'Upcoming Returns', val: metrics?.upcomingReturns || 0, icon: RotateCcw, color: 'text-purple-400', filterState: 'PICKED_UP' },
            { id: 'overdue', label: 'Overdue Rentals', val: metrics?.overdueRentals || 0, icon: AlertTriangle, color: 'text-red-400', filterState: 'overdue' },
            { id: 'revenue', label: 'Revenue from Rentals', val: `$${(metrics?.totalRevenue || 0).toFixed(0)}`, icon: DollarSign, color: 'text-emerald-400', filterState: 'analytics' },
            { id: 'deposits', label: 'Security Deposits Held', val: `$${(metrics?.securityDepositsHeld || 0).toFixed(0)}`, icon: ShieldCheck, color: 'text-cyan-400', filterState: 'analytics' },
            { id: 'lateFees', label: 'Late Fee Collection', val: `$${(metrics?.lateFeeCollection || 0).toFixed(0)}`, icon: DollarSign, color: 'text-amber-400', filterState: 'analytics' },
          ].map((widget, i) => {
            const WidgetIcon = widget.icon;
            return (
              <button
                key={i}
                onClick={() => {
                  if (['analytics'].includes(widget.filterState)) {
                    setActiveTab('analytics');
                  } else {
                    setActiveTab('list');
                  }
                }}
                className="glass-panel p-3.5 rounded-2xl border border-slate-800 space-y-1 text-left hover:border-cyan-500/40 hover:scale-[1.02] transition-all group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-tight group-hover:text-slate-200 transition-colors">
                    {widget.label}
                  </span>
                  <WidgetIcon className={`w-4 h-4 ${widget.color}`} />
                </div>
                <span className={`text-lg font-black block ${widget.color}`}>{widget.val}</span>
              </button>
            );
          })}
        </div>

        {/* Priority Action Alerts Banner */}
        {((metrics?.overdueRentals || 0) > 0 || (metrics?.rentalsDueToday || 0) > 0) && (
          <div className="glass-panel rounded-2xl p-4 border border-amber-500/30 bg-amber-500/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-extrabold text-amber-300 uppercase tracking-wider">Priority Manager Action Required</h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  {(metrics?.overdueRentals || 0) > 0 && <span className="text-red-400 font-bold mr-2">🚨 {metrics.overdueRentals} Overdue Rental(s)</span>}
                  {(metrics?.rentalsDueToday || 0) > 0 && <span className="text-amber-300 font-bold">📅 {metrics.rentalsDueToday} Due Today</span>}
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('kanban')}
              className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-black hover:bg-amber-400 transition-all shadow-md shrink-0"
            >
              Take Action on Kanban Board →
            </button>
          </div>
        )}

        {/* View Mode Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
          {[
            { id: 'kanban', label: 'Order Kanban Board', icon: LayoutDashboard },
            { id: 'list', label: 'Orders Table List', icon: ListFilter },
            { id: 'scheduler', label: 'Scheduler Calendar', icon: CalendarIcon },
            { id: 'products', label: 'Products & Inventory', icon: Package },
            { id: 'analytics', label: 'Revenue Analytics', icon: BarChart3 },
          ].map((tab) => {
            const TabIcon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                <TabIcon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Orders Kanban Board */}
        {activeTab === 'kanban' && (
          <OrdersKanban
            orders={orders}
            onSelectOrder={setSelectedOrder}
            onSendQuotation={handleSendQuotation}
            onConfirmOrder={handleConfirmOrder}
            onCreateInvoice={handleCreateInvoice}
            onOpenPickupModal={setPickupModalOrder}
            onOpenReturnModal={setReturnModalOrder}
          />
        )}

        {/* Tab 2: Orders Table List */}
        {activeTab === 'list' && (
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="text-[11px] uppercase font-bold text-slate-500 border-b border-slate-800 pb-2">
                <tr>
                  <th className="py-3 px-2">Order ID</th>
                  <th className="py-3 px-2">Customer</th>
                  <th className="py-3 px-2">State</th>
                  <th className="py-3 px-2">Pickup Date</th>
                  <th className="py-3 px-2">Return Date</th>
                  <th className="py-3 px-2">Total ($)</th>
                  <th className="py-3 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-3 px-2 font-mono text-cyan-400 font-bold">#{ord.id.slice(0, 8)}</td>
                    <td className="py-3 px-2 font-bold text-slate-100">{ord.customer?.name}</td>
                    <td className="py-3 px-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-slate-800 text-cyan-400">
                        {ord.state}
                      </span>
                    </td>
                    <td className="py-3 px-2">{new Date(ord.scheduled_pickup_at).toLocaleDateString()}</td>
                    <td className="py-3 px-2">{new Date(ord.scheduled_return_at).toLocaleDateString()}</td>
                    <td className="py-3 px-2 font-bold text-white">${ord.total_amount.toFixed(2)}</td>
                    <td className="py-3 px-2 text-right space-x-2">
                      {ord.state === 'SALES_ORDER' && (
                        <button
                          onClick={() => setPickupModalOrder(ord)}
                          className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 font-bold"
                        >
                          Pickup
                        </button>
                      )}
                      {ord.state === 'PICKED_UP' && (
                        <button
                          onClick={() => setReturnModalOrder(ord)}
                          className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 font-bold"
                        >
                          Return
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: Scheduler Calendar */}
        {activeTab === 'scheduler' && (
          <SchedulerCalendar orders={orders} onSelectOrder={setSelectedOrder} />
        )}

        {/* Tab 4: Products Inventory */}
        {activeTab === 'products' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map((prod) => (
              <div key={prod.id} className="glass-panel rounded-2xl p-4 border border-slate-800 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="h-36 rounded-xl bg-slate-900 overflow-hidden relative">
                    <img
                      src={prod.image_urls[0] || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=400&q=80'}
                      alt={prod.name}
                      className="w-full h-full object-cover"
                    />
                    <span
                      className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        prod.is_published
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                      }`}
                    >
                      {prod.is_published ? 'Published' : 'Draft / Unpublished'}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-100 line-clamp-1">{prod.name}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2">{prod.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-base font-black text-white">${prod.sales_price}</span>
                    <span className="text-xs text-slate-400">/day</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {(user?.role === 'VENDOR' || user?.role === 'ADMIN') && (
                      <button
                        onClick={() => handleTogglePublishProduct(prod.id, prod.is_published)}
                        className={`px-2.5 py-1 text-[10px] font-bold rounded border transition-colors ${
                          prod.is_published
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                        }`}
                      >
                        {prod.is_published ? 'Unpublish' : 'Publish'}
                      </button>
                    )}
                    <button
                      onClick={() => setEditingProduct(prod)}
                      className="px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 5: Revenue Analytics Chart */}
        {activeTab === 'analytics' && <ReusableBarChart vendorId={user?.vendorId} />}
      </main>

      {/* Pickup Modal */}
      {pickupModalOrder && (
        <PickupReturnModal
          type="PICKUP"
          order={pickupModalOrder}
          onClose={() => setPickupModalOrder(null)}
          onConfirm={handleConfirmPickup}
        />
      )}

      {/* Return Modal */}
      {returnModalOrder && (
        <PickupReturnModal
          type="RETURN"
          order={returnModalOrder}
          onClose={() => setReturnModalOrder(null)}
          onConfirm={handleConfirmReturn}
        />
      )}

      {/* Product Edit/Create Modal */}
      {editingProduct !== undefined && (
        <ProductModal
          product={editingProduct}
          onClose={() => setEditingProduct(undefined)}
          onSaveSuccess={refetchProducts}
        />
      )}
    </div>
  );
};
