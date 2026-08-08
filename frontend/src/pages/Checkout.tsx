import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { NavbarHeader } from '../components/home/NavbarHeader';
import { HomeFooter } from '../components/home/HomeFooter';
import { api } from '../api/client';
import {
  ShieldCheck,
  Truck,
  Store,
  CreditCard,
  Lock,
  ArrowRight,
  Loader2,
  ShoppingBag,
  ChevronRight,
} from 'lucide-react';

export const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const { items, couponCode, discountType, discountValue, pickupType, setPickupType, clearCart } = useCartStore();

  const [email, setEmail] = useState(user?.email || 'customer@twinsix.com');
  const [phone, setPhone] = useState('+1 (555) 234-5678');
  const [address, setAddress] = useState('742 Evergreen Terrace, New York, NY 10001');
  const [isProcessing, setIsProcessing] = useState(false);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] text-slate-900 flex flex-col font-sans">
        <NavbarHeader />
        <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-md mx-auto text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">Your Cart is Empty</h2>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            Browse our catalog to select premium cinema gear, drones, or equipment rentals.
          </p>
          <button
            onClick={() => navigate('/rentals')}
            className="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-md transition-all"
          >
            Explore Rentals
          </button>
        </div>
        <HomeFooter />
      </div>
    );
  }

  const mainItem = items[0];
  const startMs = new Date(mainItem.startDate).getTime();
  const endMs = new Date(mainItem.endDate).getTime();
  const durationDays = Math.max(1, Math.ceil((endMs - startMs) / (1000 * 60 * 60 * 24)));

  const itemsSubtotal = items.reduce(
    (sum, item) => sum + item.product.sales_price * durationDays * item.quantity,
    0
  );
  const depositsTotal = items.reduce(
    (sum, item) => sum + (item.product.security_deposit_amount || 0) * item.quantity,
    0
  );

  let discountAmount = 0;
  if (discountType === 'PERCENT') {
    discountAmount = (itemsSubtotal * discountValue) / 100;
  } else if (discountType === 'FIXED') {
    discountAmount = discountValue;
  }

  const totalAmount = Math.max(0, itemsSubtotal - discountAmount) + depositsTotal;

  const handleMockedPayment = async () => {
    setIsProcessing(true);

    try {
      // 1. Prepare Order payload
      const orderItems = items.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
        unit_price: item.product.sales_price,
        line_total: item.product.sales_price * durationDays * item.quantity,
      }));

      // Attach security deposit service product item if deposit exists
      if (depositsTotal > 0 && mainItem.product.vendor_id) {
        orderItems.push({
          product_id: mainItem.product.id,
          quantity: 1,
          unit_price: depositsTotal,
          line_total: depositsTotal,
        });
      }

      // 2. Call API to create order
      const res = await api.post('/orders', {
        vendor_id: mainItem.product.vendor_id,
        scheduled_pickup_at: mainItem.startDate,
        scheduled_return_at: mainItem.endDate,
        pickup_type: pickupType,
        items: orderItems,
      });

      const newOrder = res.data.data;

      // 3. Confirm order & generate invoice
      await api.patch(`/orders/${newOrder.id}/confirm`);
      const invRes = await api.post(`/orders/${newOrder.id}/create-invoice`);

      await queryClient.invalidateQueries();

      // 4. Simulate short delay for mocked payment processing
      setTimeout(() => {
        setIsProcessing(false);
        clearCart();
        navigate('/thank-you', {
          state: {
            order: newOrder,
            invoice: invRes.data.data,
            totalPaid: totalAmount,
          },
        });
      }, 1500);
    } catch (err: any) {
      setIsProcessing(false);
      alert(err.response?.data?.error || 'Checkout failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-slate-900 flex flex-col font-sans">
      <NavbarHeader />

      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-8 flex-1 w-full space-y-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <Link to="/rentals" className="hover:text-slate-900 transition-colors">
            Rentals
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-bold">Express Checkout</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Form Details */}
          <div className="lg:col-span-7 space-y-6">
            {/* Contact & Fulfillment Card */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-6">
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-slate-800" />
                <span>Express Checkout Details</span>
              </h2>

              {/* Contact Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#F3F4F6] border-0 rounded-xl p-3 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#F3F4F6] border-0 rounded-xl p-3 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              {/* Fulfillment Method */}
              <div className="space-y-2">
                <label className="block text-[11px] font-semibold text-slate-500">
                  Fulfillment Method
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPickupType('DELIVERY')}
                    className={`p-4 rounded-2xl border flex items-center gap-3 text-left transition-all ${
                      pickupType === 'DELIVERY'
                        ? 'border-slate-900 bg-slate-900 text-white font-bold shadow-sm'
                        : 'border-slate-200 bg-[#F3F4F6] text-slate-700 hover:bg-slate-200/70'
                    }`}
                  >
                    <Truck className="w-5 h-5 shrink-0" />
                    <div>
                      <span className="text-xs block font-bold">Standard Delivery</span>
                      <span
                        className={`text-[10px] ${
                          pickupType === 'DELIVERY' ? 'text-slate-300' : 'text-slate-500'
                        }`}
                      >
                        Delivered to your address
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPickupType('STORE')}
                    className={`p-4 rounded-2xl border flex items-center gap-3 text-left transition-all ${
                      pickupType === 'STORE'
                        ? 'border-slate-900 bg-slate-900 text-white font-bold shadow-sm'
                        : 'border-slate-200 bg-[#F3F4F6] text-slate-700 hover:bg-slate-200/70'
                    }`}
                  >
                    <Store className="w-5 h-5 shrink-0" />
                    <div>
                      <span className="text-xs block font-bold">Store Pickup</span>
                      <span
                        className={`text-[10px] ${
                          pickupType === 'STORE' ? 'text-slate-300' : 'text-slate-500'
                        }`}
                      >
                        Free vendor hub pickup
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Delivery Address Input */}
              {pickupType === 'DELIVERY' && (
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-slate-500">
                    Delivery Address
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-[#F3F4F6] border-0 rounded-xl p-3 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>
              )}
            </div>

            {/* Payment Gateway Box */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-slate-800" />
                  <span>Payment Gateway</span>
                </h3>
                <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
                  Mock Gateway Active
                </span>
              </div>

              <div className="bg-[#F1F3F5] rounded-2xl p-4 border border-slate-200/70 flex items-center gap-3 text-xs text-slate-600">
                <Lock className="w-4 h-4 text-slate-800 shrink-0" />
                <span>
                  Clicking <strong className="text-slate-900 font-bold">"Complete Payment & Reserve"</strong> will simulate a secure charge of{' '}
                  <strong className="text-slate-900 font-extrabold">${totalAmount.toFixed(2)}</strong> and auto-generate your printable PDF invoice.
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary Box */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-950 text-white rounded-3xl p-6 shadow-xl space-y-6">
              <h3 className="text-sm font-extrabold text-white border-b border-slate-800 pb-3">
                Order Summary
              </h3>

              {/* Items List */}
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-3.5 text-xs">
                    <div className="w-14 h-14 aspect-square rounded-xl bg-[#F1F3F5] border border-slate-800 overflow-hidden flex items-center justify-center p-1.5 shrink-0">
                      <img
                        src={
                          item.product.image_urls[0] ||
                          'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=100&q=80'
                        }
                        alt={item.product.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-white truncate">{item.product.name}</h4>
                      <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                        Qty: {item.quantity} | {durationDays} days
                      </p>
                    </div>
                    <span className="font-extrabold text-white shrink-0">
                      ${(item.product.sales_price * durationDays * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <hr className="border-slate-800" />

              {/* Financial Totals */}
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-slate-300 font-medium">
                  <span>Rental Subtotal</span>
                  <span className="font-bold text-white">${itemsSubtotal.toFixed(2)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-medium">
                    <span>Coupon Discount ({couponCode})</span>
                    <span className="font-bold">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-300 font-medium">
                  <span>Refundable Security Deposit</span>
                  <span className="font-bold text-white">${depositsTotal.toFixed(2)}</span>
                </div>

                <hr className="border-slate-800 my-2" />

                <div className="flex justify-between items-baseline pt-1">
                  <span className="text-base font-extrabold text-white">Grand Total</span>
                  <span className="text-2xl font-black text-white">${totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Payment Button */}
              <button
                onClick={handleMockedPayment}
                disabled={isProcessing}
                className="w-full py-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 font-extrabold text-xs tracking-wide flex items-center justify-center gap-2.5 shadow-lg transition-transform active:scale-[0.99] disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Processing Payment & Invoice...</span>
                  </>
                ) : (
                  <>
                    <span>Complete Payment & Reserve</span>
                    <ArrowRight className="w-4 h-4 text-slate-950" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>

      <HomeFooter />
    </div>
  );
};
