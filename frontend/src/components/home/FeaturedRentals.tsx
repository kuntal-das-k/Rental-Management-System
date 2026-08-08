import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { RentalCard, RentalCardProps } from './RentalCard';
import { Product } from '../../types';

interface FeaturedRentalsProps {
  apiProducts?: Product[];
  isLoading?: boolean;
}

export const FeaturedRentals: React.FC<FeaturedRentalsProps> = ({ apiProducts, isLoading }) => {
  const [activeTab, setActiveTab] = useState<'All' | 'Furniture' | 'Electronics'>('All');

  // Fallback curated dummy items matching reference UI image
  const defaultItems: RentalCardProps[] = [
    {
      id: 'prod-sofa-01',
      title: 'Nora 3-Seater Sofa',
      description: 'Premium charcoal grey fabric sofa perfect for modern living spaces.',
      price: 45,
      billingCycle: '/month',
      rating: 4.9,
      badgeText: 'Popular',
      imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'prod-sony-02',
      title: 'Sony A7 IV Kit',
      description: 'Full-frame mirrorless camera with 28-70mm lens.',
      price: 35,
      billingCycle: '/day',
      rating: 4.8,
      imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'prod-ps5-03',
      title: 'PlayStation 5 Pro',
      description: 'Next-gen gaming console with one controller.',
      price: 15,
      billingCycle: '/day',
      isOutOfStock: true,
      imageUrl: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'prod-macbook-04',
      title: 'MacBook Pro 16"',
      description: 'M3 Max chip, 36GB RAM, 1TB SSD. For professionals.',
      price: 120,
      billingCycle: '/week',
      rating: 5.0,
      imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    },
  ];

  // Map real backend products if present
  const mappedProducts: RentalCardProps[] = apiProducts && apiProducts.length > 0
    ? apiProducts.map((p, idx) => ({
        id: p.id,
        title: p.name,
        description: p.description || 'Curated rental item available for instant booking.',
        price: p.sales_price || 40,
        billingCycle: '/day',
        rating: 4.8 + (idx % 3) * 0.1,
        imageUrl: p.image_urls?.[0] || defaultItems[idx % defaultItems.length].imageUrl,
        badgeText: idx === 0 ? 'Popular' : undefined,
        isOutOfStock: p.stock_qty <= 0,
        productRaw: p,
      }))
    : defaultItems;

  // Filter based on active tab
  const filteredItems = mappedProducts.filter((item) => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Furniture') {
      return (
        item.title.toLowerCase().includes('sofa') ||
        item.description.toLowerCase().includes('sofa') ||
        item.description.toLowerCase().includes('living') ||
        item.title.toLowerCase().includes('furniture')
      );
    }
    if (activeTab === 'Electronics') {
      return (
        item.title.toLowerCase().includes('sony') ||
        item.title.toLowerCase().includes('playstation') ||
        item.title.toLowerCase().includes('macbook') ||
        item.title.toLowerCase().includes('camera') ||
        item.title.toLowerCase().includes('tech')
      );
    }
    return true;
  });

  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-16 py-12 space-y-8">
      {/* Header & Category Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-extrabold tracking-tight text-neutral-900">Featured Rentals</h2>

        {/* Filter Pills */}
        <div className="bg-neutral-100/80 p-1 rounded-full flex items-center gap-1 border border-neutral-200/60">
          {(['All', 'Furniture', 'Electronics'] as const).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-1.5 rounded-full text-xs transition-all ${
                  isActive
                    ? 'bg-white text-neutral-900 font-bold shadow-sm border border-neutral-200/60'
                    : 'font-semibold text-neutral-500 hover:text-neutral-900'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Rental Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-80 rounded-3xl bg-neutral-200/60 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <RentalCard key={item.id} {...item} />
          ))}
        </div>
      )}

      {/* View All Inventory Button */}
      <div className="pt-4 text-center">
        <Link
          to="/rentals"
          className="inline-block px-8 py-3 rounded-full border border-neutral-300 bg-white text-neutral-800 hover:border-black hover:bg-black hover:text-white text-xs font-bold transition-all shadow-sm"
        >
          View All Inventory
        </Link>
      </div>
    </section>
  );
};
