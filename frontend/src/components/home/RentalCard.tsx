import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, Plus, Bell, Check } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { Product } from '../../types';

export interface RentalCardProps {
  id: string;
  title: string;
  description: string;
  price: number;
  billingCycle?: string; // '/month', '/day', '/week'
  rating?: number;
  imageUrl: string;
  badgeText?: string; // e.g., 'Popular'
  isOutOfStock?: boolean;
  productRaw?: Product;
}

export const RentalCard: React.FC<RentalCardProps> = ({
  id,
  title,
  description,
  price,
  billingCycle = '/day',
  rating = 4.8,
  imageUrl,
  badgeText,
  isOutOfStock = false,
  productRaw,
}) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) return;

    const targetProduct: Product = productRaw || {
      id,
      name: title,
      description,
      sales_price: price,
      cost_price: price * 0.7,
      product_type: 'GOODS',
      stock_qty: 5,
      is_published: true,
      vendor_id: 'v1',
      image_urls: [imageUrl],
    };

    const todayStr = new Date().toISOString().split('T')[0];
    const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];

    addItem({
      product: targetProduct,
      quantity: 1,
      startDate: todayStr,
      endDate: tomorrowStr,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  return (
    <Link
      to={`/products/${id}`}
      className="group block bg-white rounded-3xl p-3.5 border border-neutral-200/60 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
    >
      {/* Image & Badges Container - Square Box */}
      <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-neutral-100 flex items-center justify-center p-3">
        <img
          src={imageUrl}
          alt={title}
          className={`w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 ${
            isOutOfStock ? 'opacity-50 grayscale-[30%]' : ''
          }`}
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          {badgeText && !isOutOfStock ? (
            <span className="bg-white/95 backdrop-blur-md text-neutral-800 text-[10px] font-bold px-3 py-1 rounded-full shadow-sm border border-neutral-100">
              {badgeText}
            </span>
          ) : (
            <span />
          )}

          <button
            onClick={handleToggleWishlist}
            aria-label="Wishlist"
            className="pointer-events-auto w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-neutral-600 hover:text-red-500 transition-colors shadow-sm"
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
        </div>

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-black text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="pt-3.5 px-1 space-y-2.5 flex-1 flex flex-col justify-between">
        <div className="space-y-1">
          {/* Header Title & Rating */}
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-neutral-900 group-hover:text-black line-clamp-1">
              {title}
            </h3>
            {rating && !isOutOfStock && (
              <div className="flex items-center gap-1 shrink-0 text-xs font-bold text-neutral-900">
                <Star className="w-3.5 h-3.5 fill-black text-black" />
                <span>{rating.toFixed(1)}</span>
              </div>
            )}
          </div>

          {/* Subtitle / Description */}
          <p className="text-[11px] text-neutral-400 font-medium line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Footer Price & Add Button */}
        <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-base font-extrabold text-neutral-900">₹{price}</span>
            <span className="text-xs text-neutral-400 font-normal">{billingCycle}</span>
          </div>

          {isOutOfStock ? (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              title="Notify when available"
              className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-400 hover:text-neutral-900 hover:border-neutral-400 transition-colors"
            >
              <Bell className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleAddToCart}
              title="Add to rental cart"
              className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
                added
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'border-neutral-200 text-neutral-800 hover:bg-black hover:text-white hover:border-black'
              }`}
            >
              {added ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </div>
    </Link>
  );
};
