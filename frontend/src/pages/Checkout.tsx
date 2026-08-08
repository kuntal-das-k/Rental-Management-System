import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { Navbar } from '../components/Navbar';
import { api } from '../api/client';
import { ShieldCheck, Truck, Store, CreditCard, Lock, ArrowRight, Loader2 } from 'lucide-react';

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
      <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <h2 className="text-xl font-bold text-slate-200">Your Cart is Empty</h2>
          <p className="text-xs text-slate-400 mt-1 mb-4">Browse our catalog to select cinema gear or EV rentals.</p>
          <button
            onClick={() => navigate('/')}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
          >
            Explore Rentals
          </button>
        </div>
      </div>
    );
  }

  const mainItem = items[0];
  const startMs = new Date(mainItem.startDate).getTime();
  const endMs = new Date(mainItem.endDate).getTime();
  const durationDays = Math.max(1, Math.ceil((endMs - startMs) / (1000 * 60 * 60 * 24)));

  const itemsSubtotal = items.reduce((sum, item) => sum + item.product.sales_price * durationDays * item.quantity, 0);
  const depositsTotal = items.reduce((sum, item) => sum + (item.product.security_deposit_amount || 0) * item.quantity, 0);

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
          product_id: mainItem.product.id, // Linked service deposit
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
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 lg:px-8 py-10 flex-1 w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Express Checkout Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-5">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              Express Checkout Details
            </h2>

            {/* Contact Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Pickup / Delivery Toggle */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2">Fulfillment Method</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPickupType('DELIVERY')}
                  className={`p-3 rounded-xl border flex items-center gap-3 text-left transition-all ${
                    pickupType === 'DELIVERY'
                      ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400 font-bold'
                      : 'border-slate-800 bg-slate-900 text-slate-400'
                  }`}
                >
                  <Truck className="w-5 h-5 shrink-0" />
                  <div>
                    <span className="text-xs block">Standard Delivery</span>
                    <span className="text-[10px] text-slate-500">Free to your address</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPickupType('STORE')}
                  className={`p-3 rounded-xl border flex items-center gap-3 text-left transition-all ${
                    pickupType === 'STORE'
                      ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400 font-bold'
                      : 'border-slate-800 bg-slate-900 text-slate-400'
                  }`}
                >
                  <Store className="w-5 h-5 shrink-0" />
                  <div>
                    <span className="text-xs block">Pick up from Store</span>
                    <span className="text-[10px] text-slate-500">Free vendor hub pickup</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Delivery Address */}
            {pickupType === 'DELIVERY' && (
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Delivery Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
            )}
          </div>

          {/* Mock Payment Gateway Step */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-cyan-400" />
                Simulated Payment Gateway
              </h3>
              <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                Mock Payment Mode Active
              </span>
            </div>

            <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800 flex items-center gap-3 text-xs text-slate-400">
              <Lock className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>
                Clicking "Complete Payment & Reserve" will simulate a successful card charge of{' '}
                <strong className="text-white">${totalAmount.toFixed(2)}</strong> and auto-generate your printable PDF invoice.
              </span>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Summary */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3">Order Summary</h3>

            {items.map((item) => (
              <div key={item.product.id} className="flex gap-3 text-xs">
                <img
                  src={item.product.image_urls[0] || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=100&q=80'}
                  alt={item.product.name}
                  className="w-12 h-12 rounded-lg object-cover bg-slate-900 border border-slate-800"
                />
                <div className="flex-1">
                  <h4 className="font-bold text-slate-200 line-clamp-1">{item.product.name}</h4>
                  <p className="text-[11px] text-slate-400">
                    Qty: {item.quantity} | {durationDays} days
                  </p>
                </div>
                <span className="font-extrabold text-white">
                  ${(item.product.sales_price * durationDays * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}

            <div className="pt-4 border-t border-slate-800 space-y-2 text-xs text-slate-400">
              <div className="flex justify-between">
                <span>Rental Subtotal</span>
                <span className="text-slate-200 font-semibold">${itemsSubtotal.toFixed(2)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Coupon Discount ({couponCode})</span>
                  <span className="font-semibold">-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-cyan-400">
                <span>Refundable Security Deposit</span>
                <span className="font-semibold">${depositsTotal.toFixed(2)}</span>
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-between text-base font-extrabold text-white">
                <span>Grand Total</span>
                <span className="text-cyan-400">${totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleMockedPayment}
            disabled={isProcessing}
            className="w-full py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Simulating Payment & Invoicing...</span>
              </>
            ) : (
              <>
                <span>Complete Payment & Reserve</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </main>
    </div>
  );
};
