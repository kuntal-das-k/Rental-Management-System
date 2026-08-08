import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import { Product } from '../types';
import { Navbar } from '../components/Navbar';
import { useCartStore } from '../store/useCartStore';
import { Calendar, Shield, ShoppingBag, ArrowRight, CheckCircle, Tag } from 'lucide-react';
import { addDays, format } from 'date-fns';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);
  const applyCoupon = useCartStore((state) => state.applyCoupon);

  const [startDate, setStartDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState<string>(format(addDays(new Date(), 3), 'yyyy-MM-dd'));
  const [quantity, setQuantity] = useState<number>(1);
  const [couponInput, setCouponInput] = useState<string>('');
  const [couponMessage, setCouponMessage] = useState<{ text: string; error?: boolean } | null>(null);

  // Fetch product detail
  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const res = await api.get(`/products/${id}`);
      return res.data.data as Product;
    },
    enabled: !!id,
  });

  const handleApplyCoupon = async () => {
    if (!couponInput) return;
    try {
      const res = await api.post('/coupons/validate', { code: couponInput });
      const coupon = res.data.data;
      applyCoupon(coupon.code, coupon.discountType, coupon.discountValue);
      setCouponMessage({ text: `Coupon ${coupon.code} applied successfully!`, error: false });
    } catch (err: any) {
      setCouponMessage({ text: err.response?.data?.error || 'Invalid coupon code', error: true });
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      product,
      quantity,
      startDate,
      endDate,
    });
    navigate('/checkout');
  };

  if (isLoading || !product) {
    return (
      <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-slate-400">Loading product details...</div>
      </div>
    );
  }

  // Calculate rental duration in days
  const startMs = new Date(startDate).getTime();
  const endMs = new Date(endDate).getTime();
  const durationDays = Math.max(1, Math.ceil((endMs - startMs) / (1000 * 60 * 60 * 24)));
  const subtotal = product.sales_price * durationDays * quantity;
  const deposit = (product.security_deposit_amount || 0) * quantity;
  const grandTotal = subtotal + deposit;

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-10 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left Column: Image Gallery */}
          <div className="space-y-4">
            <div className="h-96 rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden relative shadow-2xl">
              <img
                src={product.image_urls[0] || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-4 left-4 text-xs font-bold px-3 py-1 rounded-full bg-slate-950/80 text-cyan-400 border border-cyan-500/30">
                {product.vendor?.company_name || 'Verified Vendor'}
              </span>
            </div>
          </div>

          {/* Right Column: Details & Rental Configuration */}
          <div className="space-y-6">
            <div>
              <div className="inline-block px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold mb-2">
                {product.category?.name || 'Equipment Rental'}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{product.name}</h1>
              <p className="text-sm text-slate-400 mt-2 leading-relaxed">{product.description}</p>
            </div>

            {/* Price Banner */}
            <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-2xl font-black text-white">${product.sales_price}</span>
                <span className="text-xs text-slate-400 font-medium"> / day</span>
              </div>
              {product.security_deposit_amount && (
                <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 bg-cyan-500/10 px-3 py-1.5 rounded-xl border border-cyan-500/20">
                  <Shield className="w-4 h-4" />
                  <span>${product.security_deposit_amount} Refundable Deposit</span>
                </div>
              )}
            </div>

            {/* Rental Period Date Picker */}
            <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cyan-400" />
                Configure Rental Dates & Quantity
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Pickup Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Return Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Quantity selector */}
              <div>
                <div className="flex justify-between items-center text-xs font-semibold text-slate-400 mb-1">
                  <span>Quantity (Stock Available: {product.stock_qty})</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 font-bold text-slate-200 hover:bg-slate-800"
                  >
                    -
                  </button>
                  <span className="text-sm font-bold text-white px-3">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock_qty, q + 1))}
                    className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 font-bold text-slate-200 hover:bg-slate-800"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Apply Coupon */}
              <div className="pt-2 border-t border-slate-800">
                <label className="block text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-cyan-400" />
                  Promo / Coupon Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Enter TWINSIX10 or FLAT500"
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-cyan-400 border border-slate-700"
                  >
                    Apply
                  </button>
                </div>
                {couponMessage && (
                  <p className={`text-[11px] font-semibold mt-1.5 ${couponMessage.error ? 'text-red-400' : 'text-emerald-400'}`}>
                    {couponMessage.text}
                  </p>
                )}
              </div>
            </div>

            {/* Total Order Summary Box */}
            <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Daily Rental Rate x {durationDays} days</span>
                <span className="font-semibold text-slate-200">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Security Deposit (Refundable Service)</span>
                <span className="font-semibold text-cyan-400">${deposit.toFixed(2)}</span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-bold text-white">
                <span>Total Due at Checkout</span>
                <span className="text-cyan-400">${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <button
              onClick={handleAddToCart}
              className="w-full py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Proceed to Express Checkout</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
