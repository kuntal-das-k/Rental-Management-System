import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import { useAuthStore } from '../store/useAuthStore';
import { OrdersKanban } from '../components/OrdersKanban';
import { SchedulerCalendar } from '../components/SchedulerCalendar';
import { ReusableBarChart } from '../components/ReusableBarChart';
import { PickupReturnModal } from '../components/PickupReturnModal';
import { ProductModal } from '../components/ProductModal';
import { Order, Product } from '../types';
import {
  LayoutDashboard,
  ShoppingCart,
  Calendar as CalendarIcon,
  Package,
  BarChart2,
  Settings,
  HelpCircle,
  Plus,
  Search,
  Bell,
  Mail,
  UserCircle,
  Building2,
  MoreVertical,
  Filter,
  Grid,
  List,
  Sparkles,
  TrendingUp,
  Share2,
  Clock,
  CheckCircle2,
  Truck,
  RotateCcw,
  AlertTriangle,
  DollarSign,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import { format, isToday } from 'date-fns';

export const VendorDashboard: React.FC = () => {
  const { user, logout } = useAuthStore();
  const queryClient = useQueryClient();

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'orders' | 'calendar' | 'inventory' | 'analytics' | 'settings' | 'support'
  >('dashboard');

  // Sub-views & Filters
  const [inventoryViewMode, setInventoryViewMode] = useState<'grid' | 'list'>('grid');
  const [ordersViewMode, setOrdersViewMode] = useState<'table' | 'kanban'>('table');
  const [ordersStatusFilter, setOrdersStatusFilter] = useState<string>('ALL');
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>('');
  const [activeProductMenuId, setActiveProductMenuId] = useState<string | null>(null);

  // Modals
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [pickupModalOrder, setPickupModalOrder] = useState<Order | null>(null);
  const [returnModalOrder, setReturnModalOrder] = useState<Order | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null | undefined>(undefined);

  // API Queries
  const { data: metrics } = useQuery({
    queryKey: ['dashboard-metrics', user?.vendorId],
    queryFn: async () => {
      const res = await api.get('/dashboard/metrics');
      return res.data.data;
    },
  });

  const { data: ordersData = [], refetch: refetchOrders } = useQuery({
    queryKey: ['vendor-orders'],
    queryFn: async () => {
      const res = await api.get('/orders');
      return (res.data.data as Order[]) || [];
    },
  });

  const { data: productsData = [], refetch: refetchProducts } = useQuery({
    queryKey: ['vendor-products'],
    queryFn: async () => {
      const res = await api.get('/products', {
        params: { vendorId: user?.role === 'VENDOR' ? user.vendorId : undefined },
      });
      return (res.data.data as Product[]) || [];
    },
  });

  // Action Handlers
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
      await queryClient.invalidateQueries();
      refetchProducts();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Publish toggle failed');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product from inventory?')) return;
    try {
      await api.delete(`/products/${productId}`);
      await queryClient.invalidateQueries();
      refetchProducts();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to delete product');
    }
  };

  const handleToggleStockProduct = async (productId: string, currentStock: number) => {
    try {
      const newStock = currentStock > 0 ? 0 : 1;
      await api.put(`/products/${productId}`, { stock_qty: newStock });
      await queryClient.invalidateQueries();
      refetchProducts();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to update stock status');
    }
  };

  // Filtered Orders & Products based on Search & Status Filters
  const filteredOrders = useMemo(() => {
    return ordersData.filter((o) => {
      const matchesSearch =
        o.id.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
        o.customer?.name?.toLowerCase().includes(globalSearchQuery.toLowerCase());
      const matchesStatus = ordersStatusFilter === 'ALL' || o.state === ordersStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [ordersData, globalSearchQuery, ordersStatusFilter]);

  const filteredProducts = useMemo(() => {
    return productsData.filter((p) => {
      return (
        p.name.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(globalSearchQuery.toLowerCase())
      );
    });
  }, [productsData, globalSearchQuery]);

  // Order Counts for Segmented Progress Bar & Metric Cards
  const activeRentalsCount = ordersData.filter((o) => o.state === 'PICKED_UP').length;
  const dueTodayCount = ordersData.filter(
    (o) => o.state === 'PICKED_UP' && isToday(new Date(o.scheduled_return_at))
  ).length;
  const upcomingPickupsCount = ordersData.filter((o) => o.state === 'SALES_ORDER').length;
  const overdueCount = ordersData.filter((o) => o.is_late).length;
  const totalRevenueSum = ordersData.reduce((sum, o) => sum + o.total_amount, 0);

  return (
    <div className="flex min-h-screen bg-[#F9FAFB] text-slate-900 font-sans">
      {/* ------------------------------------------------------------- */}
      {/* LEFT SIDEBAR NAVIGATION                                       */}
      {/* ------------------------------------------------------------- */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between p-4 sticky top-0 h-screen z-30 shrink-0">
        <div className="space-y-6">
          {/* Brand Logo Header */}
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-sm shadow-2xs">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-extrabold text-base text-slate-900 leading-none">Twin6Rental</h1>
              <span className="text-[10px] font-semibold text-slate-400">Vendor Portal</span>
            </div>
          </div>

          {/* List New Item Button */}
          <button
            onClick={() => setEditingProduct(null)}
            className="w-full py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.99]"
          >
            <Plus className="w-4 h-4" />
            <span>List New Item</span>
          </button>

          {/* Primary Nav Items */}
          <nav className="space-y-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'orders', label: 'Orders', icon: ShoppingCart },
              { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
              { id: 'inventory', label: 'Inventory', icon: Package },
              { id: 'analytics', label: 'Analytics', icon: BarChart2 },
            ].map((item) => {
              const ItemIcon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs transition-all font-semibold ${
                    isActive
                      ? 'bg-slate-100 text-slate-900 font-extrabold shadow-2xs'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <ItemIcon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Nav Items */}
        <div className="space-y-1 border-t border-slate-100 pt-3">
          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'settings'
                ? 'bg-slate-100 text-slate-900 font-extrabold'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
          <button
            onClick={() => setActiveTab('support')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'support'
                ? 'bg-slate-100 text-slate-900 font-extrabold'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Support</span>
          </button>
        </div>
      </aside>

      {/* ------------------------------------------------------------- */}
      {/* MAIN BODY AREA                                                */}
      {/* ------------------------------------------------------------- */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-20 shadow-xs">
          <h2 className="text-xl font-extrabold text-slate-900 capitalize">
            {activeTab === 'dashboard' && 'Vendor Dashboard'}
            {activeTab === 'orders' && 'Orders'}
            {activeTab === 'calendar' && 'Rental Calendar'}
            {activeTab === 'inventory' && 'Products & Inventory'}
            {activeTab === 'analytics' && 'Revenue & Performance Analytics'}
            {activeTab === 'settings' && 'Vendor Settings'}
            {activeTab === 'support' && 'Vendor Support'}
          </h2>

          {/* Center Search & Actions */}
          <div className="flex items-center gap-4">
            <div className="relative w-72 sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search inventory, orders, items..."
                value={globalSearchQuery}
                onChange={(e) => setGlobalSearchQuery(e.target.value)}
                className="w-full bg-[#F3F4F6] border-0 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-slate-900 focus:outline-none"
              />
            </div>

            <button
              onClick={() => setEditingProduct(null)}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>List New Item</span>
            </button>

            <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
              <button className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="w-2 h-2 rounded-full bg-red-500 absolute top-2 right-2 ring-2 ring-white"></span>
              </button>
              <button className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors">
                <Mail className="w-5 h-5" />
              </button>
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs text-slate-700 border border-slate-300 ml-1">
                <UserCircle className="w-6 h-6 text-slate-700" />
              </div>
            </div>
          </div>
        </header>

        {/* Body Content Container */}
        <main className="p-8 flex-1 space-y-8 max-w-7xl">
          {/* ========================================================= */}
          {/* TAB 1: VENDOR DASHBOARD OVERVIEW                          */}
          {/* ========================================================= */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* 5 KPI Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {[
                  { label: 'ACTIVE RENTALS', val: metrics?.activeRentals ?? activeRentalsCount, icon: Truck, color: 'text-slate-900' },
                  { label: 'DUE TODAY', val: metrics?.rentalsDueToday ?? dueTodayCount, icon: CalendarIcon, color: 'text-slate-900' },
                  { label: 'UPCOMING PICKUPS', val: metrics?.upcomingPickups ?? upcomingPickupsCount, icon: Clock, color: 'text-slate-900' },
                  { label: 'OVERDUE', val: metrics?.overdueRentals ?? overdueCount, icon: AlertTriangle, color: 'text-red-600' },
                  { label: 'TOTAL REVENUE', val: `₹${(metrics?.totalRevenue ?? totalRevenueSum).toFixed(0)}`, icon: DollarSign, color: 'text-slate-900' },
                ].map((card, i) => (
                  <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                        {card.label}
                      </span>
                      <card.icon className="w-4 h-4 text-slate-400" />
                    </div>
                    <span className={`text-3xl font-black block ${card.color}`}>{card.val}</span>
                  </div>
                ))}
              </div>

              {/* Revenue Performance & Upcoming Bookings Section */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Revenue Chart Box */}
                <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-extrabold text-slate-900">Revenue & Performance</h3>
                      <p className="text-xs text-slate-500 font-medium">Tracking store revenue, rental bookings & utilization</p>
                    </div>
                    <select className="bg-[#F3F4F6] border-0 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-slate-900">
                      <option>Last 30 Days</option>
                      <option>This Week</option>
                      <option>This Month</option>
                    </select>
                  </div>

                  <ReusableBarChart vendorId={user?.vendorId} />
                </div>

                {/* Upcoming Bookings Box */}
                <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-xl font-extrabold text-slate-900">Upcoming Bookings</h3>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-xs font-extrabold text-slate-900 underline hover:text-slate-600"
                    >
                      View All
                    </button>
                  </div>

                  <div className="space-y-3">
                    {ordersData.slice(0, 3).map((ord) => (
                      <div key={ord.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-slate-900">{ord.customer?.name}</span>
                          <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-slate-900 text-white">
                            {ord.state}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium line-clamp-1">
                          {ord.order_items?.[0]?.product?.name || 'Rental Gear'}
                        </p>
                        <div className="flex justify-between text-[11px] text-slate-400 font-semibold pt-1 border-t border-slate-200/60">
                          <span>{new Date(ord.scheduled_pickup_at).toLocaleDateString()}</span>
                          <span className="text-slate-900 font-bold">₹{ord.total_amount.toFixed(2)}</span>
                        </div>
                      </div>
                    ))}

                    {ordersData.length === 0 && (
                      <div className="text-center py-10 space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 mx-auto">
                          <CalendarIcon className="w-6 h-6" />
                        </div>
                        <p className="text-xs text-slate-500 font-semibold">No upcoming bookings</p>
                        <button className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-xs">
                          Share Profile
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: PRODUCTS & INVENTORY                               */}
          {/* ========================================================= */}
          {activeTab === 'inventory' && (
            <div className="space-y-8">
              {/* Summer Demand High Dark Announcement Banner */}
              <div className="bg-slate-950 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden space-y-6">
                {/* Banner Sub Nav Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-800 pb-4">
                  {[
                    { id: 'kanban', label: 'Order Kanban Board' },
                    { id: 'list', label: 'Orders Table List' },
                    { id: 'scheduler', label: 'Scheduler Calendar' },
                    { id: 'products', label: 'Products & Inventory', active: true },
                    { id: 'analytics', label: 'Revenue Analytics' },
                  ].map((btn, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        if (btn.id === 'kanban' || btn.id === 'list') {
                          setActiveTab('orders');
                        } else if (btn.id === 'scheduler') {
                          setActiveTab('calendar');
                        } else if (btn.id === 'analytics') {
                          setActiveTab('analytics');
                        }
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                        btn.active
                          ? 'bg-white text-slate-950 shadow-md'
                          : 'text-slate-400 hover:text-white hover:bg-slate-900'
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>

                <div className="max-w-2xl space-y-2">
                  <h3 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-amber-400" />
                    Summer Rental Demand is High
                  </h3>
                  <p className="text-slate-300 text-xs font-medium leading-relaxed">
                    List your premium properties and camera equipment now to capture the seasonal surge. Average booking rates are up 24%.
                  </p>
                </div>
              </div>

              {/* Title & View Filters */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">Products & Inventory</h3>
                  <p className="text-xs text-slate-500 font-medium">Manage active listings, track stock status, and adjust rental rates.</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
                    <button
                      onClick={() => setInventoryViewMode('grid')}
                      className={`p-2 rounded-lg transition-all ${
                        inventoryViewMode === 'grid' ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-400'
                      }`}
                      title="Grid View"
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setInventoryViewMode('list')}
                      className={`p-2 rounded-lg transition-all ${
                        inventoryViewMode === 'list' ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-400'
                      }`}
                      title="List View"
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>

                  <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50">
                    <Filter className="w-3.5 h-3.5 text-slate-500" />
                    <span>Filter</span>
                  </button>
                </div>
              </div>

              {/* Products Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProducts.map((prod) => (
                  <div
                    key={prod.id}
                    className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all duration-300"
                  >
                    <div className="space-y-4">
                      {/* Product Image & Badge */}
                      <div className="aspect-square bg-[#F1F3F5] relative overflow-hidden flex items-center justify-center p-4">
                        <img
                          src={
                            prod.image_urls[0] ||
                            'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=500&q=80'
                          }
                          alt={prod.name}
                          className="w-full h-full object-contain filter drop-shadow-xs"
                        />
                        <span
                          className={`absolute top-4 left-4 text-[10px] font-extrabold px-3 py-1 rounded-full border ${
                            prod.stock_qty > 0 && prod.is_published
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                              : 'bg-rose-100 text-rose-800 border-rose-200'
                          }`}
                        >
                          ● {prod.stock_qty > 0 && prod.is_published ? 'In Stock' : 'Rented / Draft'}
                        </span>
                      </div>

                      {/* Info & Specs */}
                      <div className="px-5 space-y-1">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                          {prod.category?.name || 'RENTAL EQUIPMENT'}
                        </span>
                        <h4 className="text-base font-extrabold text-slate-900 line-clamp-1">{prod.name}</h4>
                        <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed">
                          {prod.description}
                        </p>
                      </div>
                    </div>

                    {/* Price & Actions Footer */}
                    <div className="p-5 pt-4 border-t border-slate-100 flex items-center justify-between mt-4">
                      <div>
                        <span className="text-lg font-black text-slate-900">₹{prod.sales_price}</span>
                        <span className="text-xs text-slate-500 font-medium"> /night</span>
                      </div>

                      <div className="flex items-center gap-2 relative">
                        <button
                          onClick={() => setEditingProduct(prod)}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800"
                        >
                          Edit
                        </button>
                        
                        <div className="relative">
                          <button
                            onClick={() => setActiveProductMenuId(activeProductMenuId === prod.id ? null : prod.id)}
                            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                            title="Product Actions"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {activeProductMenuId === prod.id && (
                            <div className="absolute right-0 bottom-8 w-52 bg-white rounded-2xl shadow-xl border border-slate-200 p-1.5 z-30 space-y-0.5 text-xs font-bold animate-in fade-in zoom-in-95 duration-150">
                              <button
                                onClick={() => {
                                  setActiveProductMenuId(null);
                                  handleTogglePublishProduct(prod.id, prod.is_published);
                                }}
                                className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-100 rounded-xl flex items-center justify-between"
                              >
                                <span>Status</span>
                                <span className={prod.is_published ? 'text-amber-600' : 'text-emerald-600'}>
                                  {prod.is_published ? '📝 Set to Draft' : '🚀 Publish Item'}
                                </span>
                              </button>

                              <button
                                onClick={() => {
                                  setActiveProductMenuId(null);
                                  handleToggleStockProduct(prod.id, prod.stock_qty);
                                }}
                                className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-100 rounded-xl flex items-center justify-between"
                              >
                                <span>Inventory</span>
                                <span className={prod.stock_qty > 0 ? 'text-rose-600' : 'text-emerald-600'}>
                                  {prod.stock_qty > 0 ? '📦 Out of Stock' : '✅ Mark In Stock'}
                                </span>
                              </button>

                              <button
                                onClick={() => {
                                  setActiveProductMenuId(null);
                                  handleDeleteProduct(prod.id);
                                }}
                                className="w-full text-left px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-xl flex items-center gap-2 border-t border-slate-100 mt-1 pt-2"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete Product</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* List New Item Dashed Card */}
                <div
                  onClick={() => setEditingProduct(null)}
                  className="group border-2 border-dashed border-slate-300 hover:border-slate-900 rounded-3xl p-8 flex flex-col items-center justify-center text-center space-y-4 hover:bg-slate-50/80 transition-all cursor-pointer bg-slate-50/40 min-h-[360px]"
                >
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 group-hover:bg-slate-800 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-all duration-300">
                    <Plus className="w-6 h-6" />
                  </div>
                  <div className="space-y-1 max-w-xs">
                    <h4 className="text-sm font-extrabold text-slate-900">List New Item</h4>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                      Expand your portfolio by adding a new property or rentable asset to your inventory.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: RENTAL CALENDAR                                    */}
          {/* ========================================================= */}
          {activeTab === 'calendar' && (
            <SchedulerCalendar orders={ordersData} onSelectOrder={setSelectedOrder} />
          )}

          {/* ========================================================= */}
          {/* TAB 4: ORDERS & WORKFLOW                                  */}
          {/* ========================================================= */}
          {activeTab === 'orders' && (
            <div className="space-y-8">
              {/* Header KPI Summary & Status Progress Bar */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                      TOTAL ORDERS
                    </span>
                    <span className="text-3xl font-black text-slate-900">{ordersData.length}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 block">
                      ACTIVE PICKUPS
                    </span>
                    <span className="text-3xl font-black text-emerald-600">{activeRentalsCount}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                      PENDING RETURNS
                    </span>
                    <span className="text-3xl font-black text-slate-900">{activeRentalsCount}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-red-600 block">
                      LATE/OVERDUE
                    </span>
                    <span className="text-3xl font-black text-red-600">{overdueCount}</span>
                  </div>
                </div>

                {/* Status Distribution Segmented Bar */}
                <div className="space-y-2 border-t border-slate-100 pt-4">
                  <div className="flex justify-between text-xs font-extrabold text-slate-700">
                    <span>Status Distribution</span>
                    <span className="text-slate-400">Current Month</span>
                  </div>
                  <div className="h-3 rounded-full bg-slate-100 overflow-hidden flex">
                    <div className="h-full bg-emerald-500 w-[45%]" title="Picked Up (45%)"></div>
                    <div className="h-full bg-slate-900 w-[30%]" title="Sales Order (30%)"></div>
                    <div className="h-full bg-slate-300 w-[15%]" title="Quotation (15%)"></div>
                    <div className="h-full bg-slate-500 w-[10%]" title="Returned (10%)"></div>
                  </div>
                  <div className="flex items-center gap-6 text-[11px] font-semibold text-slate-500 pt-1">
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Picked Up</span>
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-900"></span> Sales Order</span>
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-300"></span> Quotation</span>
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-500"></span> Returned</span>
                  </div>
                </div>
              </div>

              {/* Filter Controls & Views Toggle */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <select
                    value={ordersStatusFilter}
                    onChange={(e) => setOrdersStatusFilter(e.target.value)}
                    className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-800 shadow-2xs focus:ring-2 focus:ring-slate-900"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="QUOTATION">Quotations</option>
                    <option value="SALES_ORDER">Sales Orders</option>
                    <option value="PICKED_UP">Picked Up</option>
                    <option value="RETURNED">Returned</option>
                  </select>

                  <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
                    <button
                      onClick={() => setOrdersViewMode('table')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        ordersViewMode === 'table' ? 'bg-slate-900 text-white' : 'text-slate-500'
                      }`}
                    >
                      Table List
                    </button>
                    <button
                      onClick={() => setOrdersViewMode('kanban')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        ordersViewMode === 'kanban' ? 'bg-slate-900 text-white' : 'text-slate-500'
                      }`}
                    >
                      Kanban Board
                    </button>
                  </div>
                </div>
              </div>

              {/* View 1: Table List */}
              {ordersViewMode === 'table' && (
                <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                      <tr>
                        <th className="py-3.5 px-6">ORDER ID</th>
                        <th className="py-3.5 px-6">CUSTOMER</th>
                        <th className="py-3.5 px-6">STATUS</th>
                        <th className="py-3.5 px-6">PICKUP DATE</th>
                        <th className="py-3.5 px-6">RETURN DATE</th>
                        <th className="py-3.5 px-6">TOTAL</th>
                        <th className="py-3.5 px-6 text-right">ACTION</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {filteredOrders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-4 px-6 font-mono font-bold text-slate-900">
                            #ORD-{ord.id.slice(0, 8).toUpperCase()}
                          </td>
                          <td className="py-4 px-6 font-bold text-slate-900">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px]">
                                {ord.customer?.name?.slice(0, 2).toUpperCase() || 'CU'}
                              </div>
                              <span>{ord.customer?.name || 'Customer'}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-slate-100 text-slate-800 border border-slate-200">
                              {ord.state}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-slate-600">
                            {new Date(ord.scheduled_pickup_at).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-6 text-slate-600">
                            {new Date(ord.scheduled_return_at).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-6 font-black text-slate-900">
                            ${ord.total_amount.toFixed(2)}
                          </td>
                          <td className="py-4 px-6 text-right space-x-2">
                            {ord.state === 'SALES_ORDER' && (
                              <button
                                onClick={() => setPickupModalOrder(ord)}
                                className="px-3 py-1 rounded-lg bg-amber-100 text-amber-800 font-bold border border-amber-200 text-xs"
                              >
                                Pickup
                              </button>
                            )}
                            {ord.state === 'PICKED_UP' && (
                              <button
                                onClick={() => setReturnModalOrder(ord)}
                                className="px-3 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-bold border border-emerald-200 text-xs"
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

              {/* View 2: Kanban Board */}
              {ordersViewMode === 'kanban' && (
                <OrdersKanban
                  orders={filteredOrders}
                  onSelectOrder={setSelectedOrder}
                  onSendQuotation={handleSendQuotation}
                  onConfirmOrder={handleConfirmOrder}
                  onCreateInvoice={handleCreateInvoice}
                  onOpenPickupModal={setPickupModalOrder}
                  onOpenReturnModal={setReturnModalOrder}
                />
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 5: REVENUE ANALYTICS                                  */}
          {/* ========================================================= */}
          {activeTab === 'analytics' && (
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs space-y-6">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">Revenue Analytics</h3>
                <p className="text-xs text-slate-500 font-medium">Real-time performance stats across rental products</p>
              </div>

              <ReusableBarChart vendorId={user?.vendorId} />
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 6 & 7: SETTINGS & SUPPORT                             */}
          {/* ========================================================= */}
          {(activeTab === 'settings' || activeTab === 'support') && (
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs space-y-6">
              <h3 className="text-xl font-extrabold text-slate-900 capitalize">
                Vendor {activeTab}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Manage your storefront profile, payout details, GST registration, and customer service resources.
              </p>
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      {pickupModalOrder && (
        <PickupReturnModal
          type="PICKUP"
          order={pickupModalOrder}
          onClose={() => setPickupModalOrder(null)}
          onConfirm={handleConfirmPickup}
        />
      )}

      {returnModalOrder && (
        <PickupReturnModal
          type="RETURN"
          order={returnModalOrder}
          onClose={() => setReturnModalOrder(null)}
          onConfirm={handleConfirmReturn}
        />
      )}

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
