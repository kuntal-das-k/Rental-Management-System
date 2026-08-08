import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import { Product } from '../types';
import { NavbarHeader } from '../components/home/NavbarHeader';
import { HomeFooter } from '../components/home/HomeFooter';
import { useCartStore } from '../store/useCartStore';
import {
  Calendar,
  Shield,
  ShoppingBag,
  Tag,
  ChevronRight,
  Minus,
  Plus,
  Camera,
  Video,
  Eye,
  Cpu,
  Heart,
} from 'lucide-react';
import { addDays, format } from 'date-fns';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);
  const applyCoupon = useCartStore((state) => state.applyCoupon);

  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [startDate, setStartDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState<string>(format(addDays(new Date(), 3), 'yyyy-MM-dd'));
  const [quantity, setQuantity] = useState<number>(1);
  const [couponInput, setCouponInput] = useState<string>('');
  const [couponMessage, setCouponMessage] = useState<{ text: string; error?: boolean } | null>(null);
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false);

  const handleToggleWishlist = async () => {
    if (!id) return;
    try {
      const res = await api.post('/wishlist/toggle', { productId: id });
      setIsWishlisted(res.data.data.isWishlisted);
    } catch {
      setIsWishlisted(!isWishlisted);
    }
  };

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
      <div className="min-h-screen bg-[#FAFAFA] text-slate-900 flex flex-col">
        <NavbarHeader />
        <div className="flex-1 flex items-center justify-center text-slate-500 font-medium text-sm">
          Loading rental specifications...
        </div>
        <HomeFooter />
      </div>
    );
  }

  // Gallery Images fallback array
  const mainImg = product.image_urls?.[0] || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=80';
  const galleryImages = [
    mainImg,
    product.image_urls?.[1] || 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=600&q=80',
    product.image_urls?.[2] || 'https://images.unsplash.com/photo-1512790182412-b19e6d61b39a?auto=format&fit=crop&w=600&q=80',
  ];

  // Calculate rental duration in days
  const startMs = new Date(startDate).getTime();
  const endMs = new Date(endDate).getTime();
  const durationDays = Math.max(1, Math.ceil((endMs - startMs) / (1000 * 60 * 60 * 24)));
  const dailyRate = product.sales_price || 85;
  const subtotal = dailyRate * durationDays * quantity;
  const depositAmount = product.security_deposit_amount || 500;
  const depositTotal = depositAmount * quantity;
  const grandTotal = subtotal + depositTotal;

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-slate-900 flex flex-col font-sans">
      <NavbarHeader />

      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-8 flex-1 w-full space-y-8 z-10 ">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <Link to="/rentals" className="hover:text-slate-900 transition-colors">
            Rentals
          </Link>
          <ChevronRight className="w-2 h-2 text-slate-400" />
          <span className="hover:text-slate-900 transition-colors cursor-pointer">
            {product.category?.name || 'Electronics & Cameras'}
          </span>
          <ChevronRight className="w-2 h-2 text-slate-400" />
          <span className="text-slate-900 font-bold">{product.name}</span>
        </nav>

        {/* Product & Sidebar Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* LEFT COLUMN: Gallery & Specifications */}
          <div className="lg:col-span-7 space-y-8">
            {/* Main Image Banner - Square Box */}
            <div className="bg-[#F1F3F5] rounded-3xl aspect-square w-full relative overflow-hidden flex items-center justify-center p-2 border border-slate-150/60 shadow-xs">
              <span className="absolute top-5 left-5 text-xs font-semibold px-3 py-1 rounded-full bg-slate-200/80 text-slate-800 backdrop-blur-xs z-10">
                {product.vendor?.company_name || 'Premium Gear'}
              </span>
              <img
                src={galleryImages[selectedImageIndex] || mainImg}
                alt={product.name}
                className="w-full h-full object-contain p-4 filter drop-shadow-md transition-all duration-200"
              />
            </div>

            {/* Gallery Thumbnails - Square Boxes */}
            <div className="flex gap-4">
              {galleryImages.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-24 h-24 aspect-square rounded-2xl overflow-hidden border-2 transition-all bg-[#F1F3F5] p-2 flex items-center justify-center ${selectedImageIndex === idx
                    ? 'border-slate-900 ring-2 ring-slate-900/10 scale-[1.02]'
                    : 'border-slate-200/80 opacity-70 hover:opacity-100'
                    }`}
                >
                  <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-contain" />
                </button>
              ))}
            </div>

            {/* Product Title & Overview */}
            <div className="space-y-3 pt-2">
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {product.name}
              </h1>
              <p className="text-slate-600 text-sm leading-relaxed font-normal">
                {product.description ||
                  'Professional-grade full-frame hybrid camera with 33MP resolution, 4K 60p video, and advanced real-time autofocus tracking. Ideal for high-end photography and videography productions.'}
              </p>
            </div>

            <hr className="border-slate-200/80 my-6" />

            {/* Key Features Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-extrabold text-slate-900">Key Features</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-3 bg-white rounded-2xl border border-slate-200/60 shadow-2xs">
                  <div className="p-2 rounded-xl bg-slate-100 text-slate-800">
                    <Camera className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">33MP Full-Frame Sensor</h4>
                    <p className="text-[11px] text-slate-500 font-medium">Exmor R CMOS</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-white rounded-2xl border border-slate-200/60 shadow-2xs">
                  <div className="p-2 rounded-xl bg-slate-100 text-slate-800">
                    <Video className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">4K 60p 10-bit Video</h4>
                    <p className="text-[11px] text-slate-500 font-medium">S-Cinetone included</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-white rounded-2xl border border-slate-200/60 shadow-2xs">
                  <div className="p-2 rounded-xl bg-slate-100 text-slate-800">
                    <Eye className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Real-time Eye AF</h4>
                    <p className="text-[11px] text-slate-500 font-medium">Humans, Animals, Birds</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-white rounded-2xl border border-slate-200/60 shadow-2xs">
                  <div className="p-2 rounded-xl bg-slate-100 text-slate-800">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">BIONZ XR Processor</h4>
                    <p className="text-[11px] text-slate-500 font-medium">Up to 8x faster processing</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Rental Booking Sidebar */}
          <div className="lg:col-span-5 space-y-5">
            {/* Card 1: Rental Rate Banner */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-medium text-slate-500 block mb-0.5">Rental Rate</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-slate-900">₹{dailyRate}</span>
                  <span className="text-xs font-medium text-slate-500">/ day</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-slate-200 bg-slate-50 text-slate-700 text-xs font-semibold">
                <Shield className="w-3.5 h-3.5 text-slate-600" />
                <span>₹{depositAmount} Refundable Deposit</span>
              </div>
            </div>

            {/* Card 2: Configure Dates & Quantity */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-5">
              <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-slate-700 uppercase">
                <Calendar className="w-4 h-4 text-slate-700" />
                <span>Configure Rental Dates & Quantity</span>
              </div>

              {/* Date Inputs */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Pickup Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-[#F3F4F6] border-0 rounded-xl p-3 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Return Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-[#F3F4F6] border-0 rounded-xl p-3 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              {/* Quantity Stepper */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold text-slate-500">
                  Quantity (Stock Available: {product.stock_qty || 3})
                </label>
                <div className="flex items-center gap-4 bg-[#F3F4F6] px-4 py-2 rounded-xl w-fit">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="text-slate-600 hover:text-slate-900 font-bold transition-colors p-1"
                    title="Decrease Quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-bold text-slate-900 px-2">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock_qty || 10, q + 1))}
                    className="text-slate-600 hover:text-slate-900 font-bold transition-colors p-1"
                    title="Increase Quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <hr className="border-slate-100" />

              {/* Coupon Code Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-slate-600" />
                  <span>Promo / Coupon Code</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Enter code..."
                    className="flex-1 bg-[#F3F4F6] border-0 rounded-xl px-4 py-2.5 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="px-5 py-2.5 rounded-xl bg-slate-200/90 hover:bg-slate-300 text-slate-800 font-bold text-xs transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {couponMessage && (
                  <p
                    className={`text-[11px] font-semibold ${couponMessage.error ? 'text-red-500' : 'text-emerald-600'
                      }`}
                  >
                    {couponMessage.text}
                  </p>
                )}
              </div>
            </div>

            {/* Card 3: Summary & Checkout Button */}
            <div className="bg-slate-950 text-white rounded-3xl p-6 shadow-xl space-y-5">
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-slate-300 font-medium">
                  <span>Daily Rental Rate x {durationDays} days</span>
                  <span className="font-bold text-white">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-300 font-medium">
                  <span>Security Deposit (Refundable)</span>
                  <span className="font-bold text-white">₹{depositTotal.toFixed(2)}</span>
                </div>
                <hr className="border-slate-800 my-2" />
                <div className="flex justify-between items-baseline pt-1">
                  <span className="text-base font-extrabold text-white">Total Due</span>
                  <span className="text-2xl font-black text-white">₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 font-extrabold text-xs tracking-wide flex items-center justify-center gap-2.5 shadow-lg transition-transform active:scale-[0.99]"
                >
                  <ShoppingBag className="w-4 h-4 text-slate-950" />
                  <span>Proceed to Express Checkout</span>
                </button>

                <button
                  onClick={handleToggleWishlist}
                  title="Save to Wishlist"
                  className={`p-4 rounded-2xl border transition-all ${
                    isWishlisted
                      ? 'bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-500/30'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <HomeFooter />
    </div>
  );
};
