import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useAuthStore } from '../store/useAuthStore';
import { Order } from '../types';
import {
  LayoutGrid,
  Calendar,
  ClipboardList,
  Package,
  Store,
  Users,
  CreditCard,
  BarChart2,
  Settings,
  Menu,
  Mail,
  User as UserIcon,
  LogOut,
  ChevronDown,
  Plus,
  Truck,
  RotateCcw,
  AlertTriangle,
  DollarSign,
  ShieldCheck,
  TrendingUp,
  Coins,
  CheckCircle2,
  X,
  Search,
  Filter,
  Download,
  Eye,
  Check,
  Building,
  Sliders,
  FileText,
  Clock,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Sidebar & Navigation State
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'rentals' | 'orders' | 'products' | 'vendors' | 'customers' | 'payments' | 'reports' | 'settings' | 'support'
  >('dashboard');

  // Filters & Timeframe State
  const [dashboardTimeframe, setDashboardTimeframe] = useState<'week' | 'month' | 'year'>('week');
  const [dateRangeText, setDateRangeText] = useState('May 20 - May 26, 2025');
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Modals & Drawers State
  const [createRentalOpen, setCreateRentalOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<any | null>(null);

  // Tab Filtering & Search States
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStateFilter, setOrderStateFilter] = useState('ALL');
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');
  const [productSearchQuery, setProductSearchQuery] = useState('');

  // Form State for Create Rental
  const [newRentalCustomerId, setNewRentalCustomerId] = useState('');
  const [newRentalVendorId, setNewRentalVendorId] = useState('');
  const [newRentalProductId, setNewRentalProductId] = useState('');
  const [newRentalPickupDate, setNewRentalPickupDate] = useState('');
  const [newRentalReturnDate, setNewRentalReturnDate] = useState('');
  const [createRentalError, setCreateRentalError] = useState('');

  // Account Status Change Modal State
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [statusTargetUser, setStatusTargetUser] = useState<any | null>(null);
  const [statusActionType, setStatusActionType] = useState<'ACTIVATE' | 'DEACTIVATE' | 'CANCEL'>('DEACTIVATE');
  const [statusReason, setStatusReason] = useState('');
  const [statusReasonError, setStatusReasonError] = useState('');

  // Settings State
  const [lateFeeRate, setLateFeeRate] = useState('15');
  const [gracePeriodDays, setGracePeriodDays] = useState('0');
  const [currencySymbol, setCurrencySymbol] = useState('$');
  const [marketplaceFeePct, setMarketplaceFeePct] = useState('5');
  const [settingsSavedMsg, setSettingsSavedMsg] = useState('');

  // -------------------------------------------------------------
  // API Queries (Fetching Live Data from SQLite Database)
  // -------------------------------------------------------------

  // 1. Dashboard Metrics
  const { data: metricsData, isLoading: metricsLoading, refetch: refetchMetrics } = useQuery({
    queryKey: ['admin-dashboard-metrics', dashboardTimeframe],
    queryFn: async () => {
      const res = await api.get(`/dashboard/metrics?timeframe=${dashboardTimeframe}`);
      return res.data.data;
    },
  });

  // 2. All Orders
  const { data: ordersData = [], refetch: refetchOrders } = useQuery({
    queryKey: ['admin-all-orders'],
    queryFn: async () => {
      const res = await api.get('/orders');
      return (res.data.data as Order[]) || [];
    },
  });

  // 3. All Users (Customers & Vendors)
  const { data: usersData = [], refetch: refetchUsers } = useQuery({
    queryKey: ['admin-all-users'],
    queryFn: async () => {
      const res = await api.get('/auth/users');
      return res.data.data || [];
    },
  });

  // 4. All Products
  const { data: productsData = [], refetch: refetchProducts } = useQuery({
    queryKey: ['admin-all-products'],
    queryFn: async () => {
      const res = await api.get('/products');
      return res.data.data || [];
    },
  });

  // 5. Notifications
  const { data: notifications = [], refetch: refetchNotifications } = useQuery({
    queryKey: ['admin-notifications'],
    queryFn: async () => {
      const res = await api.get('/notifications');
      return res.data.data || [];
    },
  });

  // 6. Contact Messages & Support Inquiries
  const { data: contactMessages = [], refetch: refetchContactMessages } = useQuery({
    queryKey: ['admin-contact-messages'],
    queryFn: async () => {
      const res = await api.get('/contact');
      return res.data.data || [];
    },
  });

  // -------------------------------------------------------------
  // Mutations & Actions
  // -------------------------------------------------------------

  // Toggle Customer / Vendor Active Status with mandatory Reason
  const toggleUserActiveMutation = useMutation({
    mutationFn: async ({
      userId,
      isActive,
      reason,
      statusAction,
    }: {
      userId: string;
      isActive: boolean;
      reason?: string;
      statusAction?: string;
    }) => {
      await api.patch(`/auth/users/${userId}/active`, { isActive, reason, statusAction });
    },
    onSuccess: () => {
      refetchUsers();
      refetchNotifications();
    },
  });

  const handleStatusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusReasonError('');

    if (!statusReason.trim()) {
      setStatusReasonError('Please state why you are activating, deactivating, or cancelling this vendor profile.');
      return;
    }
    if (!statusTargetUser) return;

    try {
      const isActive = statusActionType === 'ACTIVATE';
      await toggleUserActiveMutation.mutateAsync({
        userId: statusTargetUser.id,
        isActive,
        reason: statusReason.trim(),
        statusAction: statusActionType,
      });

      setStatusModalOpen(false);
      setStatusTargetUser(null);
      setStatusReason('');
      alert(`Account status updated to ${statusActionType} successfully! Notification sent.`);
    } catch (err: any) {
      setStatusReasonError(err.response?.data?.error || 'Failed to update account status');
    }
  };

  // Toggle Product Published Status
  const toggleProductPublishedMutation = useMutation({
    mutationFn: async ({ productId, isPublished }: { productId: string; isPublished: boolean }) => {
      await api.patch(`/products/${productId}`, { is_published: isPublished });
    },
    onSuccess: () => {
      refetchProducts();
    },
  });

  // Update Order State
  const updateOrderStateMutation = useMutation({
    mutationFn: async ({ orderId, action }: { orderId: string; action: string }) => {
      await api.patch(`/orders/${orderId}/${action}`);
    },
    onSuccess: () => {
      refetchOrders();
      refetchMetrics();
      if (selectedOrderDetails) {
        setSelectedOrderDetails(null);
      }
    },
  });

  // Create Rental Submission
  const [isCreatingRental, setIsCreatingRental] = useState(false);

  const handleCreateRentalSubmit = async (e: React.FormEvent, onTheSpot: boolean = false) => {
    e.preventDefault();
    setCreateRentalError('');

    const targetCustomer = newRentalCustomerId || (customersList[0]?.id);
    const targetProduct = productsData.find((p: any) => p.id === newRentalProductId) || productsData[0];

    if (!targetCustomer) {
      setCreateRentalError('No customer account found. Please register a customer first.');
      return;
    }
    if (!targetProduct) {
      setCreateRentalError('No product found in catalog. Please add a product first.');
      return;
    }

    const targetVendorId =
      newRentalVendorId ||
      targetProduct.vendor_id ||
      targetProduct.vendor?.id ||
      (vendorsList[0]?.vendor_profile?.id || vendorsList[0]?.id);

    const todayStr = new Date().toISOString().split('T')[0];
    const threeDaysLaterStr = new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0];

    const pickupDateStr = newRentalPickupDate || todayStr;
    const returnDateStr = newRentalReturnDate || threeDaysLaterStr;

    try {
      setIsCreatingRental(true);
      await api.post('/orders', {
        customerId: targetCustomer,
        vendorId: targetVendorId,
        pickupType: 'PICKUP',
        items: [
          {
            productId: targetProduct.id,
            product_id: targetProduct.id,
            quantity: 1,
            unitPrice: targetProduct.sales_price || 0,
            unit_price: targetProduct.sales_price || 0,
            lineTotal: targetProduct.sales_price || 0,
            line_total: targetProduct.sales_price || 0,
          },
        ],
        scheduledPickupAt: new Date(pickupDateStr).toISOString(),
        scheduledReturnAt: new Date(returnDateStr).toISOString(),
        onTheSpot,
        inStoreRental: onTheSpot,
        paymentMethod: 'IN_STORE_CASH',
      });

      setCreateRentalOpen(false);
      setNewRentalCustomerId('');
      setNewRentalVendorId('');
      setNewRentalProductId('');
      setNewRentalPickupDate('');
      setNewRentalReturnDate('');
      refetchOrders();
      refetchMetrics();
      alert(
        onTheSpot
          ? '⚡ In-Store Spot Rental Confirmed! Payment & Security Deposit collected, PDF invoice generated, and item handed over on the spot.'
          : '✅ In-Store Quotation created successfully!'
      );
    } catch (err: any) {
      setCreateRentalError(err.response?.data?.error || 'Failed to create rental order. Check server logs.');
    } finally {
      setIsCreatingRental(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // -------------------------------------------------------------
  // Data Aggregations for UI Render
  // -------------------------------------------------------------

  const metrics = metricsData || {
    activeRentals: 0,
    rentalsDueToday: 0,
    upcomingPickups: 0,
    upcomingReturns: 0,
    overdueRentals: 0,
    totalRevenue: 0,
    thisWeekRevenue: 0,
    securityDepositsHeld: 0,
    securityDepositsCount: 0,
    lateFeeCollection: 0,
    totalOrdersCount: 0,
    dueTodayOrders: [],
    overdueOrders: [],
    recentOrders: [],
    statusDistribution: [],
    overviewChart: [],
  };

  // Status Distribution Data for Donut Chart
  const pieData = useMemo(() => {
    if (metrics.statusDistribution && metrics.statusDistribution.length > 0) {
      return metrics.statusDistribution.map((st: any) => ({
        name: st.label,
        value: st.count,
        percentage: st.percentage,
        color: st.color,
      }));
    }
    return [
      { name: 'Active Rentals', value: 0, percentage: 0, color: '#0F172A' },
      { name: 'Upcoming Returns', value: 0, percentage: 0, color: '#475569' },
      { name: 'Upcoming Pickups', value: 0, percentage: 0, color: '#94A3B8' },
      { name: 'Overdue Rentals', value: 0, percentage: 0, color: '#CBD5E1' },
      { name: 'Completed Rentals', value: 0, percentage: 0, color: '#E2E8F0' },
    ];
  }, [metrics.statusDistribution]);

  // Chart Data for Area Chart
  const chartData = metrics.overviewChart || [];

  // Filtered Lists for Sub-Tabs
  const customersList = useMemo(() => usersData.filter((u: any) => u.role === 'CUSTOMER'), [usersData]);
  const vendorsList = useMemo(() => usersData.filter((u: any) => u.role === 'VENDOR'), [usersData]);

  const filteredOrders = useMemo(() => {
    return ordersData.filter((ord: Order) => {
      const matchesSearch =
        ord.id.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
        ord.customer?.name.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
        ord.vendor?.company_name.toLowerCase().includes(orderSearchQuery.toLowerCase());
      const matchesState = orderStateFilter === 'ALL' || ord.state === orderStateFilter;
      return matchesSearch && matchesState;
    });
  }, [ordersData, orderSearchQuery, orderStateFilter]);

  const filteredProducts = useMemo(() => {
    return productsData.filter((p: any) => {
      return (
        p.name.toLowerCase().includes(productSearchQuery.toLowerCase()) ||
        p.sku?.toLowerCase().includes(productSearchQuery.toLowerCase()) ||
        p.vendor?.company_name?.toLowerCase().includes(productSearchQuery.toLowerCase())
      );
    });
  }, [productsData, productSearchQuery]);

  const filteredCustomers = useMemo(() => {
    return customersList.filter((c: any) => {
      return (
        c.name.toLowerCase().includes(customerSearchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(customerSearchQuery.toLowerCase())
      );
    });
  }, [customersList, customerSearchQuery]);

  // Derived Payments List from Orders
  const paymentsList = useMemo(() => {
    const list: any[] = [];
    ordersData.forEach((ord: any) => {
      if (ord.payments && ord.payments.length > 0) {
        ord.payments.forEach((p: any) => {
          list.push({
            id: p.id,
            orderId: ord.id,
            customerName: ord.customer?.name || 'Customer',
            vendorName: ord.vendor?.company_name || 'Vendor',
            type: p.type,
            amount: p.amount,
            method: p.method,
            status: p.status,
            ref: p.transaction_ref,
            date: p.created_at || ord.created_at,
          });
        });
      }
    });
    return list;
  }, [ordersData]);

  // Download Reports CSV
  const handleExportCSV = () => {
    const headers = ['Order ID', 'Customer', 'Vendor', 'State', 'Amount', 'Date'];
    const rows = ordersData.map((ord: Order) => [
      ord.id,
      ord.customer?.name || '',
      ord.vendor?.company_name || '',
      ord.state,
      ord.total_amount,
      new Date(ord.created_at).toLocaleDateString(),
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `twinsix_rental_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex font-sans selection:bg-slate-900 selection:text-white">
      {/* ------------------------------------------------------------- */}
      {/* LEFT SIDEBAR NAVIGATION                                       */}
      {/* ------------------------------------------------------------- */}
      <aside
        className={`bg-white border-r border-slate-200 w-60 flex-shrink-0 flex flex-col justify-between transition-all duration-300 z-30 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-16'
        }`}
      >
        <div>
          {/* Logo Header */}
          <div className="h-16 border-b border-slate-100 flex items-center justify-between px-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white font-extrabold text-lg shadow-sm">
                T6
              </div>
              <span className={`font-extrabold text-slate-900 text-lg tracking-tight ${!sidebarOpen && 'md:hidden'}`}>
                Twin6 Rental
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
              { id: 'rentals', label: 'Rentals', icon: Calendar },
              { id: 'orders', label: 'Orders', icon: ClipboardList },
              { id: 'products', label: 'Products', icon: Package },
              { id: 'vendors', label: 'Vendors', icon: Store },
              { id: 'customers', label: 'Customers', icon: Users },
              { id: 'payments', label: 'Payments', icon: CreditCard },
              { id: 'reports', label: 'Reports', icon: BarChart2 },
              { id: 'support', label: 'Support Messages', icon: Mail },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map((item) => {
              const ItemIcon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                  title={item.label}
                >
                  <ItemIcon className="w-4 h-4 flex-shrink-0" />
                  <span className={`${!sidebarOpen && 'md:hidden'}`}>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile Footer */}
        <div className="p-3 border-t border-slate-100 relative">
          <button
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs border border-slate-300">
                AU
              </div>
              <div className={`text-left ${!sidebarOpen && 'md:hidden'}`}>
                <p className="text-xs font-bold text-slate-900 leading-tight">Admin User</p>
                <p className="text-[10px] font-medium text-slate-500">Super Admin</p>
              </div>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 ${!sidebarOpen && 'md:hidden'}`} />
          </button>

          {/* User Profile Popup Menu */}
          {profileMenuOpen && (
            <div className="absolute bottom-16 left-3 right-3 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">{user?.name || 'System Admin'}</p>
                <p className="text-[11px] text-slate-500 truncate">{user?.email || 'admin@twinsix.com'}</p>
              </div>
              <button
                onClick={() => {
                  setProfileMenuOpen(false);
                  setActiveTab('settings');
                }}
                className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2 mt-1"
              >
                <Settings className="w-3.5 h-3.5 text-slate-500" /> Account Settings
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2"
              >
                <LogOut className="w-3.5 h-3.5 text-red-500" /> Logout
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* ------------------------------------------------------------- */}
      {/* MAIN LAYOUT BODY                                              */}
      {/* ------------------------------------------------------------- */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* Mail / Notifications Icon */}
            <button
              onClick={() => setNotificationsOpen(true)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors relative"
              title="Notifications"
            >
              <Mail className="w-5 h-5" />
              {notifications.some((n: any) => n.status === 'UNREAD') && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white"></span>
              )}
            </button>

            {/* Profile User Icon */}
            <button
              onClick={() => setActiveTab('settings')}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              title="Admin Settings & Profile"
            >
              <UserIcon className="w-5 h-5" />
            </button>

            {/* Logout Icon Button */}
            <button
              onClick={handleLogout}
              className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="p-6 md:p-8 flex-1 overflow-y-auto space-y-6 max-w-[1600px] w-full mx-auto">
          {/* ========================================================= */}
          {/* TAB 1: MAIN DASHBOARD VIEW                                */}
          {/* ========================================================= */}
          {activeTab === 'dashboard' && (
            <>
              {/* Dashboard Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">Dashboard</h1>
                  <p className="text-xs font-medium text-slate-500 mt-0.5">
                    Welcome back, Admin! Here's what's happening today.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {/* Date Range Picker Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setShowDatePicker(!showDatePicker)}
                      className="flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs transition-all"
                    >
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>{dateRangeText}</span>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
                    </button>

                    {showDatePicker && (
                      <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl p-2 z-50 text-xs">
                        {[
                          { label: 'May 20 - May 26, 2025 (This Week)', val: 'week' },
                          { label: 'This Month', val: 'month' },
                          { label: 'This Year', val: 'year' },
                        ].map((opt) => (
                          <button
                            key={opt.val}
                            onClick={() => {
                              setDashboardTimeframe(opt.val as any);
                              setDateRangeText(opt.label);
                              setShowDatePicker(false);
                            }}
                            className="w-full text-left px-3 py-2 rounded-lg font-medium text-slate-700 hover:bg-slate-100 flex items-center justify-between"
                          >
                            <span>{opt.label}</span>
                            {dashboardTimeframe === opt.val && <Check className="w-3.5 h-3.5 text-slate-900" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Create Rental Button */}
                  <button
                    onClick={() => setCreateRentalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold shadow-sm transition-all active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Rental</span>
                  </button>
                </div>
              </div>

              {/* ----------------------------------------------------- */}
              {/* ROW 1: OPERATIONS STAT CARDS (5 CARDS)                */}
              {/* ----------------------------------------------------- */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* 1. Active Rentals */}
                <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-xs">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold text-slate-600">Active Rentals</span>
                  </div>
                  <div>
                    <span className="text-2xl font-black text-slate-900 block">{metrics.activeRentals}</span>
                    <span className="text-[11px] font-medium text-slate-400 mt-1 block">-- from last week</span>
                  </div>
                </div>

                {/* 2. Rentals Due Today */}
                <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center border border-slate-200">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold text-slate-600">Rentals Due Today</span>
                  </div>
                  <div>
                    <span className="text-2xl font-black text-slate-900 block">{metrics.rentalsDueToday}</span>
                    <span className="text-[11px] font-medium text-slate-400 mt-1 block">-- from yesterday</span>
                  </div>
                </div>

                {/* 3. Upcoming Pickups */}
                <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center border border-slate-200">
                      <Truck className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold text-slate-600">Upcoming Pickups</span>
                  </div>
                  <div>
                    <span className="text-2xl font-black text-slate-900 block">{metrics.upcomingPickups}</span>
                    <span className="text-[11px] font-medium text-slate-400 mt-1 block">-- from yesterday</span>
                  </div>
                </div>

                {/* 4. Upcoming Returns */}
                <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center border border-slate-200">
                      <RotateCcw className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold text-slate-600">Upcoming Returns</span>
                  </div>
                  <div>
                    <span className="text-2xl font-black text-slate-900 block">{metrics.upcomingReturns}</span>
                    <span className="text-[11px] font-medium text-slate-400 mt-1 block">-- from yesterday</span>
                  </div>
                </div>

                {/* 5. Overdue Rentals */}
                <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center border border-slate-200">
                      <AlertTriangle className="w-4 h-4 text-slate-800" />
                    </div>
                    <span className="text-xs font-semibold text-slate-600">Overdue Rentals</span>
                  </div>
                  <div>
                    <span className="text-2xl font-black text-slate-900 block">{metrics.overdueRentals}</span>
                    <span className="text-[11px] font-medium text-slate-400 mt-1 block">-- from yesterday</span>
                  </div>
                </div>
              </div>

              {/* ----------------------------------------------------- */}
              {/* ROW 2: FINANCIAL STAT CARDS (4 CARDS)                 */}
              {/* ----------------------------------------------------- */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. Revenue from Rentals */}
                <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center border border-slate-200">
                      <DollarSign className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold text-slate-600">Revenue from Rentals</span>
                  </div>
                  <div>
                    <span className="text-2xl font-black text-slate-900 block">
                      ${metrics.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                    </span>
                    <span className="text-[11px] font-medium text-slate-400 mt-1 block">-- from last month</span>
                  </div>
                </div>

                {/* 2. Security Deposits Held */}
                <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center border border-slate-200">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold text-slate-600">Security Deposits Held</span>
                  </div>
                  <div>
                    <span className="text-2xl font-black text-slate-900 block">
                      ${metrics.securityDepositsHeld.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                    </span>
                    <span className="text-[11px] font-medium text-slate-400 mt-1 block">
                      {metrics.securityDepositsCount || 0} deposits
                    </span>
                  </div>
                </div>

                {/* 3. Late Fee Collection */}
                <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center border border-slate-200">
                      <Coins className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold text-slate-600">Late Fee Collection</span>
                  </div>
                  <div>
                    <span className="text-2xl font-black text-slate-900 block">
                      ${metrics.lateFeeCollection.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                    </span>
                    <span className="text-[11px] font-medium text-slate-400 mt-1 block">-- from last month</span>
                  </div>
                </div>

                {/* 4. Total Revenue (This Week) */}
                <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center border border-slate-200">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold text-slate-600">Total Revenue (This Week)</span>
                  </div>
                  <div>
                    <span className="text-2xl font-black text-slate-900 block">
                      ${metrics.thisWeekRevenue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                    </span>
                    <span className="text-[11px] font-medium text-slate-400 mt-1 block">-- from last week</span>
                  </div>
                </div>
              </div>

              {/* ----------------------------------------------------- */}
              {/* ROW 3: CHARTS SECTION (OVERVIEW & STATUS DISTRIBUTION) */}
              {/* ----------------------------------------------------- */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Platform Overview Line/Area Chart */}
                <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-slate-900">Platform Overview</h3>
                    <div className="relative">
                      <select
                        value={dashboardTimeframe}
                        onChange={(e) => setDashboardTimeframe(e.target.value as any)}
                        className="appearance-none bg-white border border-slate-200 rounded-lg px-3 py-1.5 pr-8 text-xs font-semibold text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-900"
                      >
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                        <option value="year">This Year</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
                    </div>
                  </div>

                  {/* Area Chart Container */}
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0F172A" stopOpacity={0.15} />
                            <stop offset="95%" stopColor="#0F172A" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <XAxis
                          dataKey="label"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: '#64748B', fontSize: 11, fontWeight: 500 }}
                          dy={5}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: '#64748B', fontSize: 11, fontWeight: 500 }}
                          tickFormatter={(val) => `$${val >= 1000 ? `${(val / 1000).toFixed(0)}K` : val}`}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#0F172A',
                            borderColor: '#1E293B',
                            borderRadius: '8px',
                            color: '#FFFFFF',
                            fontSize: '12px',
                            fontWeight: '600',
                          }}
                          formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Revenue']}
                        />
                        <Area
                          type="monotone"
                          dataKey="revenue"
                          stroke="#0F172A"
                          strokeWidth={2.5}
                          fillOpacity={1}
                          fill="url(#colorRevenue)"
                          dot={{ r: 4, fill: '#0F172A', strokeWidth: 2, stroke: '#FFFFFF' }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Rental Status Distribution Donut Chart */}
                <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
                  <h3 className="text-sm font-bold text-slate-900 mb-2">Rental Status Distribution</h3>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
                    {/* Donut Ring Chart */}
                    <div className="relative w-44 h-44 flex items-center justify-center flex-shrink-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={75}
                            paddingAngle={3}
                            dataKey="value"
                          >
                            {pieData.map((entry: any, index: number) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      {/* Center Total Count Overlay */}
                      <div className="absolute flex flex-col items-center justify-center text-center pointer-events-none">
                        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total</span>
                        <span className="text-xl font-black text-slate-900">{metrics.totalOrdersCount}</span>
                      </div>
                    </div>

                    {/* Donut Legend */}
                    <div className="space-y-2 w-full text-xs font-semibold">
                      {pieData.map((item: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: item.color }}></span>
                            <span className="text-slate-600 font-medium">{item.name}</span>
                          </div>
                          <span className="text-slate-900 font-bold">
                            {item.value} ({item.percentage}%)
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* ----------------------------------------------------- */}
              {/* ROW 4: LOWER OPERATIONAL ACTION CARDS (3 COLUMNS)      */}
              {/* ----------------------------------------------------- */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* 1. Rentals Due Today */}
                <div className="lg:col-span-4 bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-700" />
                      Rentals Due Today ({metrics.rentalsDueToday})
                    </h3>
                  </div>

                  {metrics.dueTodayOrders && metrics.dueTodayOrders.length > 0 ? (
                    <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                      {metrics.dueTodayOrders.map((ord: any) => (
                        <div
                          key={ord.id}
                          onClick={() => setSelectedOrderDetails(ord)}
                          className="p-3 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200/60 cursor-pointer transition-colors flex items-center justify-between"
                        >
                          <div>
                            <span className="font-mono text-xs font-bold text-slate-900">#{ord.id.slice(0, 8)}</span>
                            <p className="text-xs font-semibold text-slate-700 mt-0.5">{ord.customer?.name}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-bold text-slate-900 block">${ord.total_amount?.toFixed(2)}</span>
                            <span className="text-[10px] text-amber-600 font-bold bg-amber-50 px-1.5 py-0.5 rounded">Due Today</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs font-medium text-slate-400 py-6 text-center">No rentals due today.</p>
                  )}
                </div>

                {/* 2. Overdue Rentals */}
                <div className="lg:col-span-4 bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-slate-700" />
                      Overdue Rentals ({metrics.overdueRentals})
                    </h3>
                  </div>

                  {metrics.overdueOrders && metrics.overdueOrders.length > 0 ? (
                    <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                      {metrics.overdueOrders.map((ord: any) => (
                        <div
                          key={ord.id}
                          onClick={() => setSelectedOrderDetails(ord)}
                          className="p-3 bg-red-50/50 hover:bg-red-50 rounded-lg border border-red-200/60 cursor-pointer transition-colors flex items-center justify-between"
                        >
                          <div>
                            <span className="font-mono text-xs font-bold text-slate-900">#{ord.id.slice(0, 8)}</span>
                            <p className="text-xs font-semibold text-slate-700 mt-0.5">{ord.customer?.name}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] font-bold text-red-600 bg-red-100 px-1.5 py-0.5 rounded block">
                              OVERDUE
                            </span>
                            <span className="text-[10px] text-slate-500 mt-1 block">
                              {new Date(ord.scheduled_return_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2 py-6 text-xs font-semibold text-slate-500">
                      <span>No overdue rentals — all clear!</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>
                  )}
                </div>

                {/* 3. Recent Orders */}
                <div className="lg:col-span-4 bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <ClipboardList className="w-4 h-4 text-slate-700" />
                      Recent Orders
                    </h3>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-xs font-bold text-slate-900 hover:underline"
                    >
                      View All
                    </button>
                  </div>

                  {metrics.recentOrders && metrics.recentOrders.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                            <th className="pb-2">Order ID</th>
                            <th className="pb-2">Customer</th>
                            <th className="pb-2">Status</th>
                            <th className="pb-2 text-right">Amount</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {metrics.recentOrders.slice(0, 5).map((ord: any) => (
                            <tr
                              key={ord.id}
                              onClick={() => setSelectedOrderDetails(ord)}
                              className="hover:bg-slate-50 cursor-pointer transition-colors"
                            >
                              <td className="py-2.5 font-mono text-xs font-bold text-slate-900">#{ord.id.slice(0, 8)}</td>
                              <td className="py-2.5 font-medium text-slate-700">{ord.customer?.name}</td>
                              <td className="py-2.5">
                                <span
                                  className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase ${
                                    ord.state === 'PICKED_UP'
                                      ? 'bg-blue-100 text-blue-800'
                                      : ord.state === 'SALES_ORDER'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : ord.state === 'RETURNED'
                                      ? 'bg-slate-100 text-slate-700'
                                      : 'bg-amber-100 text-amber-800'
                                  }`}
                                >
                                  {ord.state}
                                </span>
                              </td>
                              <td className="py-2.5 text-right font-bold text-slate-900">${ord.total_amount?.toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-xs font-medium text-slate-400 py-6 text-center">No recent orders.</p>
                  )}
                </div>
              </div>
            </>
          )}

          {/* ========================================================= */}
          {/* TAB 2: RENTALS MANAGEMENT                                 */}
          {/* ========================================================= */}
          {activeTab === 'rentals' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl font-bold text-slate-900">Rentals Directory</h1>
                  <p className="text-xs text-slate-500">Manage active rental contracts and state machine workflow</p>
                </div>
                <button
                  onClick={() => setCreateRentalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold"
                >
                  <Plus className="w-4 h-4" /> Create Rental
                </button>
              </div>

              {/* State Filter Pills */}
              <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
                {['ALL', 'QUOTATION', 'SALES_ORDER', 'PICKED_UP', 'RETURNED', 'CANCELLED'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderStateFilter(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      orderStateFilter === st
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              {/* Orders Grid/Table */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Order ID</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Vendor</th>
                      <th className="py-3 px-4">Pickup Date</th>
                      <th className="py-3 px-4">Return Date</th>
                      <th className="py-3 px-4">State</th>
                      <th className="py-3 px-4">Total</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredOrders.map((ord: Order) => (
                      <tr key={ord.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">#{ord.id.slice(0, 8)}</td>
                        <td className="py-3 px-4 font-semibold text-slate-800">{ord.customer?.name}</td>
                        <td className="py-3 px-4 text-slate-600">{ord.vendor?.company_name}</td>
                        <td className="py-3 px-4 text-slate-600">{new Date(ord.scheduled_pickup_at).toLocaleDateString()}</td>
                        <td className="py-3 px-4 text-slate-600">{new Date(ord.scheduled_return_at).toLocaleDateString()}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-black bg-slate-100 text-slate-800 border border-slate-200">
                            {ord.state}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-900">${ord.total_amount.toFixed(2)}</td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => setSelectedOrderDetails(ord)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-md text-[11px] transition-colors"
                          >
                            Manage
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: ORDERS MANAGEMENT                                  */}
          {/* ========================================================= */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl font-bold text-slate-900">All Orders Ledger</h1>
                  <p className="text-xs text-slate-500">Comprehensive database view of all quotations, rentals & invoices</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search orders..."
                      value={orderSearchQuery}
                      onChange={(e) => setOrderSearchQuery(e.target.value)}
                      className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Order ID</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Vendor</th>
                      <th className="py-3 px-4">State</th>
                      <th className="py-3 px-4">Pickup</th>
                      <th className="py-3 px-4">Return</th>
                      <th className="py-3 px-4">Total Amount</th>
                      <th className="py-3 px-4 text-right">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredOrders.map((ord: Order) => (
                      <tr key={ord.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">#{ord.id.slice(0, 8)}</td>
                        <td className="py-3 px-4 font-semibold text-slate-800">{ord.customer?.name}</td>
                        <td className="py-3 px-4 text-slate-600">{ord.vendor?.company_name}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-black bg-slate-900 text-white">
                            {ord.state}
                          </span>
                        </td>
                        <td className="py-3 px-4">{new Date(ord.scheduled_pickup_at).toLocaleDateString()}</td>
                        <td className="py-3 px-4">{new Date(ord.scheduled_return_at).toLocaleDateString()}</td>
                        <td className="py-3 px-4 font-bold text-slate-900">${ord.total_amount.toFixed(2)}</td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => setSelectedOrderDetails(ord)}
                            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 4: PRODUCTS CATALOG                                   */}
          {/* ========================================================= */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl font-bold text-slate-900">Products Catalog</h1>
                  <p className="text-xs text-slate-500">Platform-wide rental inventory across all registered vendors</p>
                </div>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search products SKU/Name..."
                    value={productSearchQuery}
                    onChange={(e) => setProductSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Product</th>
                      <th className="py-3 px-4">SKU</th>
                      <th className="py-3 px-4">Vendor</th>
                      <th className="py-3 px-4">Daily Rate</th>
                      <th className="py-3 px-4">Deposit</th>
                      <th className="py-3 px-4">Stock</th>
                      <th className="py-3 px-4 text-right">Published</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProducts.map((p: any) => (
                      <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-900">{p.name}</td>
                        <td className="py-3 px-4 font-mono text-slate-500">{p.sku || 'N/A'}</td>
                        <td className="py-3 px-4 font-medium text-slate-700">{p.vendor?.company_name || 'Vendor'}</td>
                        <td className="py-3 px-4 font-bold text-slate-900">${p.sales_price?.toFixed(2)}</td>
                        <td className="py-3 px-4 text-slate-600">${p.security_deposit_amount || 0}</td>
                        <td className="py-3 px-4 font-semibold text-slate-800">{p.stock_qty} units</td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() =>
                              toggleProductPublishedMutation.mutate({ productId: p.id, isPublished: !p.is_published })
                            }
                            className={`px-3 py-1 rounded-full text-[10px] font-extrabold transition-colors ${
                              p.is_published
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                            }`}
                          >
                            {p.is_published ? 'Published' : 'Draft'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 5: VENDORS MANAGEMENT                                 */}
          {/* ========================================================= */}
          {activeTab === 'vendors' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-xl font-bold text-slate-900">Vendors Directory</h1>
                <p className="text-xs text-slate-500">Multi-vendor storefront profiles and GST registration details</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {vendorsList.map((v: any) => (
                  <div key={v.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 font-bold border border-slate-200">
                            <Building className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900 text-sm leading-tight">
                              {v.vendor_profile?.company_name || v.name}
                            </h3>
                            <p className="text-xs text-slate-500">{v.email}</p>
                          </div>
                        </div>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                            v.is_active
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-red-100 text-red-800 border border-red-200'
                          }`}
                        >
                          {v.is_active ? 'Active' : 'Deactivated'}
                        </span>
                      </div>

                      <div className="space-y-1.5 text-xs pt-2 border-t border-slate-100">
                        <div className="flex justify-between">
                          <span className="text-slate-500">GST Number:</span>
                          <span className="font-mono font-semibold text-slate-800">{v.vendor_profile?.gst_no || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Category:</span>
                          <span className="font-semibold text-slate-800">{v.vendor_profile?.product_category || 'General'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                      {v.is_active ? (
                        <button
                          onClick={() => {
                            setStatusTargetUser(v);
                            setStatusActionType('DEACTIVATE');
                            setStatusReason('');
                            setStatusReasonError('');
                            setStatusModalOpen(true);
                          }}
                          className="px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-bold rounded-lg text-xs transition-colors"
                        >
                          Deactivate
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setStatusTargetUser(v);
                            setStatusActionType('ACTIVATE');
                            setStatusReason('');
                            setStatusReasonError('');
                            setStatusModalOpen(true);
                          }}
                          className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold rounded-lg text-xs transition-colors"
                        >
                          Activate
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setStatusTargetUser(v);
                          setStatusActionType('CANCEL');
                          setStatusReason('');
                          setStatusReasonError('');
                          setStatusModalOpen(true);
                        }}
                        className="px-3 py-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold rounded-lg text-xs transition-colors"
                      >
                        Cancel Profile
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 6: CUSTOMERS MANAGEMENT                               */}
          {/* ========================================================= */}
          {activeTab === 'customers' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl font-bold text-slate-900">Customer Management</h1>
                  <p className="text-xs text-slate-500">Registered marketplace customer accounts and access control</p>
                </div>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search customers..."
                    value={customerSearchQuery}
                    onChange={(e) => setCustomerSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Name</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Registered Date</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Access Control</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredCustomers.map((c: any) => (
                      <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-900">{c.name}</td>
                        <td className="py-3 px-4 text-slate-600">{c.email}</td>
                        <td className="py-3 px-4 text-slate-500">{new Date(c.created_at).toLocaleDateString()}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              c.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {c.is_active ? 'Active' : 'Deactivated'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => {
                              setStatusTargetUser(c);
                              setStatusActionType(c.is_active ? 'DEACTIVATE' : 'ACTIVATE');
                              setStatusReason('');
                              setStatusReasonError('');
                              setStatusModalOpen(true);
                            }}
                            className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${
                              c.is_active
                                ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                                : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200'
                            }`}
                          >
                            {c.is_active ? 'Deactivate' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 7: PAYMENTS AUDIT                                     */}
          {/* ========================================================= */}
          {activeTab === 'payments' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-xl font-bold text-slate-900">Payments & Transactions</h1>
                <p className="text-xs text-slate-500">Real-time ledger of rental fees, security deposit holds & late fees</p>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Txn Reference</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Vendor</th>
                      <th className="py-3 px-4">Payment Type</th>
                      <th className="py-3 px-4">Method</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paymentsList.map((p: any) => (
                      <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">{p.ref}</td>
                        <td className="py-3 px-4 font-semibold text-slate-800">{p.customerName}</td>
                        <td className="py-3 px-4 text-slate-600">{p.vendorName}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-black ${
                              p.type === 'DEPOSIT'
                                ? 'bg-cyan-100 text-cyan-800'
                                : p.type === 'LATE_FEE'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {p.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-700">{p.method}</td>
                        <td className="py-3 px-4 font-bold text-slate-900">${p.amount.toFixed(2)}</td>
                        <td className="py-3 px-4 text-right font-bold text-emerald-600">{p.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 8: PLATFORM REPORTS                                   */}
          {/* ========================================================= */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-bold text-slate-900">Platform Analytics & Export</h1>
                  <p className="text-xs text-slate-500">Export financial summaries and operational metrics</p>
                </div>
                <button
                  onClick={handleExportCSV}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold shadow-xs hover:bg-slate-800"
                >
                  <Download className="w-4 h-4" /> Download CSV Report
                </button>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-6">
                <h3 className="text-sm font-bold text-slate-900">Financial Revenue Trends</h3>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <XAxis dataKey="label" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="revenue" stroke="#0F172A" fill="#0F172A" fillOpacity={0.1} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 9: SETTINGS                                           */}
          {/* ========================================================= */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h1 className="text-xl font-bold text-slate-900">Platform Settings</h1>
                <p className="text-xs text-slate-500">Configure default late fee engine, currency & deposit terms</p>
              </div>

              {settingsSavedMsg && (
                <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> {settingsSavedMsg}
                </div>
              )}

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Default Late Fee Rate (Per Day)
                  </label>
                  <div className="relative max-w-xs">
                    <span className="absolute left-3 top-2.5 text-slate-400 text-xs font-bold">$</span>
                    <input
                      type="number"
                      value={lateFeeRate}
                      onChange={(e) => setLateFeeRate(e.target.value)}
                      className="pl-7 pr-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Grace Period (Days)</label>
                  <input
                    type="number"
                    value={gracePeriodDays}
                    onChange={(e) => setGracePeriodDays(e.target.value)}
                    className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold w-full max-w-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Marketplace Service Commission (%)</label>
                  <input
                    type="number"
                    value={marketplaceFeePct}
                    onChange={(e) => setMarketplaceFeePct(e.target.value)}
                    className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold w-full max-w-xs"
                  />
                </div>

                <button
                  onClick={() => {
                    setSettingsSavedMsg('Platform settings saved successfully.');
                    setTimeout(() => setSettingsSavedMsg(''), 3000);
                  }}
                  className="px-5 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 shadow-xs"
                >
                  Save Platform Settings
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 10: SUPPORT MESSAGES & INQUIRIES                      */}
          {/* ========================================================= */}
          {activeTab === 'support' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-bold text-slate-900">Support Inquiries & Contact Responses</h1>
                  <p className="text-xs text-slate-500">Live storage of customer & visitor contact form submissions from the Contact Page</p>
                </div>
                <button
                  onClick={() => refetchContactMessages()}
                  className="px-3.5 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Refresh Inquiries
                </button>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                {contactMessages.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-xs font-medium">
                    No contact form responses stored yet.
                  </div>
                ) : (
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4">Date & Time</th>
                        <th className="py-3 px-4">Sender Name</th>
                        <th className="py-3 px-4">Email</th>
                        <th className="py-3 px-4">Topic</th>
                        <th className="py-3 px-4">Message</th>
                        <th className="py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {contactMessages.map((m: any) => (
                        <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-4 font-mono text-slate-500">{new Date(m.created_at).toLocaleString()}</td>
                          <td className="py-3 px-4 font-bold text-slate-900">{m.name}</td>
                          <td className="py-3 px-4 text-slate-600 font-medium">{m.email}</td>
                          <td className="py-3 px-4">
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-cyan-100 text-cyan-800">
                              {m.topic}
                            </span>
                          </td>
                          <td className="py-3 px-4 max-w-md text-slate-700 font-normal leading-relaxed">{m.message}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              {m.status || 'STORED'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MODAL 1: CREATE RENTAL MODAL                                  */}
      {/* ------------------------------------------------------------- */}
      {createRentalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-slate-900" /> Create New Rental Contract
              </h3>
              <button onClick={() => setCreateRentalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {createRentalError && (
              <div className="p-3 bg-red-50 text-red-700 text-xs font-bold rounded-lg border border-red-200">
                {createRentalError}
              </div>
            )}

            <form onSubmit={handleCreateRentalSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Customer</label>
                <select
                  value={newRentalCustomerId}
                  onChange={(e) => setNewRentalCustomerId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-medium focus:ring-2 focus:ring-slate-900"
                >
                  <option value="">-- Select Customer Account --</option>
                  {customersList.map((c: any) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Vendor</label>
                <select
                  value={newRentalVendorId}
                  onChange={(e) => {
                    setNewRentalVendorId(e.target.value);
                    setNewRentalProductId('');
                  }}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-medium focus:ring-2 focus:ring-slate-900"
                >
                  <option value="">-- Select Vendor --</option>
                  {vendorsList.map((v: any) => (
                    <option key={v.id} value={v.vendor_profile?.id || v.id}>
                      {v.vendor_profile?.company_name || v.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Product</label>
                <select
                  value={newRentalProductId}
                  onChange={(e) => {
                    const prodId = e.target.value;
                    setNewRentalProductId(prodId);
                    const selectedP = productsData.find((p: any) => p.id === prodId);
                    if (selectedP && selectedP.vendor_id) {
                      setNewRentalVendorId(selectedP.vendor_id);
                    }
                  }}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-medium focus:ring-2 focus:ring-slate-900"
                >
                  <option value="">-- Select Product --</option>
                  {productsData
                    .filter(
                      (p: any) =>
                        !newRentalVendorId ||
                        p.vendor_id === newRentalVendorId ||
                        p.vendor?.id === newRentalVendorId ||
                        p.vendor?.user_id === newRentalVendorId
                    )
                    .map((p: any) => (
                      <option key={p.id} value={p.id}>
                        {p.name} (${p.sales_price}/day)
                      </option>
                    ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Pickup Date</label>
                  <input
                    type="date"
                    value={newRentalPickupDate}
                    onChange={(e) => setNewRentalPickupDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Return Date</label>
                  <input
                    type="date"
                    value={newRentalReturnDate}
                    onChange={(e) => setNewRentalReturnDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-medium"
                  />
                </div>
              </div>

              {/* Selected Product Live Pricing & Security Deposit Summary */}
              {newRentalProductId && (() => {
                const selectedP = productsData.find((p: any) => p.id === newRentalProductId);
                if (!selectedP) return null;
                const depositAmt = selectedP.security_deposit_amount || 150;
                return (
                  <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 text-xs space-y-1">
                    <div className="flex justify-between font-bold text-slate-800">
                      <span>Daily Rental Rate:</span>
                      <span className="text-slate-900">${selectedP.sales_price}/day</span>
                    </div>
                    <div className="flex justify-between font-bold text-slate-800">
                      <span>Refundable Security Deposit:</span>
                      <span className="text-cyan-700">${depositAmt}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">
                      💡 On on-time return with pristine condition inspection, the entire <strong>${depositAmt} security deposit</strong> will be refunded to customer.
                    </p>
                  </div>
                );
              })()}

              <div className="pt-2 flex flex-col sm:flex-row justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCreateRentalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isCreatingRental}
                  onClick={(e) => handleCreateRentalSubmit(e, false)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-lg"
                >
                  Save Quotation
                </button>
                <button
                  type="button"
                  disabled={isCreatingRental}
                  onClick={(e) => handleCreateRentalSubmit(e, true)}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-extrabold rounded-lg shadow-sm flex items-center justify-center gap-1.5"
                >
                  <span>⚡ Rent On The Spot (Collect Payment + Deposit)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 2: ORDER DETAILS INSPECTOR                              */}
      {/* ------------------------------------------------------------- */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-slate-400">Order Inspection</span>
                <h3 className="text-lg font-extrabold text-slate-900">
                  #{selectedOrderDetails.id.slice(0, 8)}
                </h3>
              </div>
              <button onClick={() => setSelectedOrderDetails(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 font-semibold block">Customer</span>
                  <span className="font-bold text-slate-900 text-sm">{selectedOrderDetails.customer?.name}</span>
                  <span className="text-slate-500 block">{selectedOrderDetails.customer?.email}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block">Vendor</span>
                  <span className="font-bold text-slate-900 text-sm">{selectedOrderDetails.vendor?.company_name}</span>
                  <span className="text-slate-500 block">State: {selectedOrderDetails.state}</span>
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-900 block mb-1">Rental Timeline</span>
                <div className="flex justify-between text-slate-600 bg-slate-100 p-2.5 rounded-lg">
                  <div>
                    <span className="text-slate-400 block text-[10px]">PICKUP</span>
                    <span className="font-bold text-slate-900">
                      {new Date(selectedOrderDetails.scheduled_pickup_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">SCHEDULED RETURN</span>
                    <span className="font-bold text-slate-900">
                      {new Date(selectedOrderDetails.scheduled_return_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons for State Transitions */}
              <div className="pt-2 flex flex-wrap gap-2 justify-end border-t border-slate-100">
                {selectedOrderDetails.state === 'QUOTATION' && (
                  <button
                    onClick={() =>
                      updateOrderStateMutation.mutate({ orderId: selectedOrderDetails.id, action: 'confirm' })
                    }
                    className="px-4 py-2 bg-slate-900 text-white font-bold rounded-lg text-xs"
                  >
                    Confirm Sales Order
                  </button>
                )}
                {selectedOrderDetails.state === 'SALES_ORDER' && (
                  <button
                    onClick={() =>
                      updateOrderStateMutation.mutate({ orderId: selectedOrderDetails.id, action: 'pickup' })
                    }
                    className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg text-xs"
                  >
                    Mark Picked Up
                  </button>
                )}
                {selectedOrderDetails.state === 'PICKED_UP' && (
                  <button
                    onClick={() =>
                      updateOrderStateMutation.mutate({ orderId: selectedOrderDetails.id, action: 'return' })
                    }
                    className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-lg text-xs"
                  >
                    Mark Returned
                  </button>
                )}
                <button
                  onClick={() => setSelectedOrderDetails(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* DRAWER: NOTIFICATIONS DRAWER                                  */}
      {/* ------------------------------------------------------------- */}
      {notificationsOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex justify-end z-50 animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-sm h-full p-6 shadow-2xl flex flex-col justify-between border-l border-slate-200">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-900" /> Notifications
                </h3>
                <button onClick={() => setNotificationsOpen(false)} className="text-slate-400 hover:text-slate-700">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-140px)]">
                {notifications.map((n: any) => {
                  let payloadObj = { message: 'System alert notification' };
                  try {
                    payloadObj = JSON.parse(n.payload);
                  } catch (e) {}

                  return (
                    <div key={n.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{n.type}</span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(n.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-slate-600 font-medium leading-relaxed">{payloadObj.message}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => setNotificationsOpen(false)}
              className="w-full py-2.5 bg-slate-900 text-white font-bold rounded-lg text-xs"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 3: VENDOR / USER ACCOUNT STATUS ACTION MODAL            */}
      {/* ------------------------------------------------------------- */}
      {statusModalOpen && statusTargetUser && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                {statusActionType === 'CANCEL'
                  ? 'Cancel Vendor Profile'
                  : statusActionType === 'DEACTIVATE'
                  ? 'Deactivate Account'
                  : 'Activate Account'}
              </h3>
              <button onClick={() => setStatusModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {statusReasonError && (
              <div className="p-3 bg-red-50 text-red-700 text-xs font-bold rounded-lg border border-red-200">
                {statusReasonError}
              </div>
            )}

            <form onSubmit={handleStatusSubmit} className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <p className="font-bold text-slate-900">
                  {statusTargetUser.vendor_profile?.company_name || statusTargetUser.name}
                </p>
                <p className="text-slate-500">{statusTargetUser.email}</p>
                <p className="text-[11px] font-semibold text-slate-600">
                  Role: <span className="font-bold">{statusTargetUser.role}</span> | Current Status:{' '}
                  <span className={statusTargetUser.is_active ? 'text-emerald-600 font-bold' : 'text-red-600 font-bold'}>
                    {statusTargetUser.is_active ? 'Active' : 'Deactivated'}
                  </span>
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Reason for {statusActionType.toLowerCase()} (Required)
                </label>
                <textarea
                  rows={3}
                  value={statusReason}
                  onChange={(e) => setStatusReason(e.target.value)}
                  placeholder={`State why you are ${
                    statusActionType === 'CANCEL'
                      ? 'cancelling'
                      : statusActionType === 'DEACTIVATE'
                      ? 'deactivating'
                      : 'activating'
                  } this vendor profile...`}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  required
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setStatusModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 text-white font-bold rounded-lg shadow-sm ${
                    statusActionType === 'CANCEL'
                      ? 'bg-red-600 hover:bg-red-700'
                      : statusActionType === 'DEACTIVATE'
                      ? 'bg-amber-600 hover:bg-amber-700'
                      : 'bg-emerald-600 hover:bg-emerald-700'
                  }`}
                >
                  Confirm {statusActionType}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
