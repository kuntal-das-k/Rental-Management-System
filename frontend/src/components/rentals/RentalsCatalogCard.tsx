import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight, Store } from 'lucide-react';
import { api } from '../../api/client';
import { useCartStore } from '../../store/useCartStore';
import { Product } from '../../types';

export interface CatalogCardProps {
  id: string;
  title: string;
  description: string;
  price: number;
  billingCycle?: string; // '/ day', '/ month', '/ week'
  imageUrl: string;
  isNew?: boolean;
  colorSwatches?: string[]; // hex codes or color names
  productRaw?: Product;
  vendorName?: string;
  vendorLogo?: string;
  categoryName?: string;
}

export const RentalsCatalogCard: React.FC<CatalogCardProps> = ({
  id,
  title,
  description,
  price,
  billingCycle = '/ day',
  imageUrl,
  isNew = false,
  colorSwatches,
  productRaw,
  vendorName,
  vendorLogo,
  categoryName,
}) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const displayVendorName = vendorName || (productRaw as any)?.vendor?.company_name || 'Verified Vendor';
  const displayVendorLogo = vendorLogo || (productRaw as any)?.vendor?.logo_url;
  const displayCategory = categoryName || (productRaw as any)?.category?.name;

  const handleRent = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

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
  };

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await api.post('/wishlist/toggle', { productId: id });
      setIsWishlisted(res.data.data.isWishlisted);
    } catch {
      setIsWishlisted(!isWishlisted);
    }
  };

  return (
    <Link
      to={`/products/${id}`}
      className="group block bg-[#f7f7f9] rounded-3xl p-4 border border-neutral-200/60 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
    >
      {/* Image Container - Square Box */}
      <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-white flex items-center justify-center p-3">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-contain p-1 group-hover:scale-105 transition-transform duration-500"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5">
            {isNew && (
              <span className="bg-emerald-200/90 text-emerald-950 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                NEW
              </span>
            )}
            {displayCategory && (
              <span className="bg-slate-900/80 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full backdrop-blur-xs truncate max-w-[120px]">
                {displayCategory}
              </span>
            )}
          </div>

          <button
            onClick={toggleWishlist}
            aria-label="Wishlist"
            className="pointer-events-auto w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-neutral-600 hover:text-red-500 transition-colors"
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="pt-4 px-1 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-1.5">
          {/* Vendor Badge */}
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-neutral-500">
            {displayVendorLogo ? (
              <img src={displayVendorLogo} alt={displayVendorName} className="w-4 h-4 rounded-full object-cover" />
            ) : (
              <Store className="w-3.5 h-3.5 text-neutral-400" />
            )}
            <span className="truncate text-neutral-700 font-bold">{displayVendorName}</span>
          </div>

          <h3 className="text-sm font-bold text-neutral-900 group-hover:text-black line-clamp-1">
            {title}
          </h3>

          <p className="text-xs text-neutral-400 font-medium line-clamp-2 leading-relaxed">
            {description}
          </p>

          {/* Color Swatches if present */}
          {colorSwatches && colorSwatches.length > 0 && (
            <div className="flex items-center gap-1.5 pt-1">
              {colorSwatches.map((color, idx) => (
                <span
                  key={idx}
                  className="w-3.5 h-3.5 rounded-full border border-neutral-300 shadow-xs"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Price & Rent Button */}
        <div className="pt-2 border-t border-neutral-200/60 flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400 block leading-none">
              FROM
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-base font-extrabold text-neutral-900">₹{price}</span>
              <span className="text-xs text-neutral-400 font-normal">{billingCycle}</span>
            </div>
          </div>

          <button
            onClick={handleRent}
            className="bg-[#e9e9ee] text-neutral-900 hover:bg-black hover:text-white font-bold text-xs px-4 py-2 rounded-full transition-all flex items-center gap-1.5 shrink-0"
          >
            <span>Rent</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </Link>
  );
};

