import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { Search, ChevronDown } from 'lucide-react';
import { api } from '../api/client';
import { Product } from '../types';

import { NavbarHeader } from '../components/home/NavbarHeader';
import { RentalsSidebarFilter } from '../components/rentals/RentalsSidebarFilter';
import { RentalsCatalogCard, CatalogCardProps } from '../components/rentals/RentalsCatalogCard';
import { RentalsPagination } from '../components/rentals/RentalsPagination';
import { HomeFooter } from '../components/home/HomeFooter';

export const RentalsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDuration, setSelectedDuration] = useState('Monthly');
  const [maxPrice, setMaxPrice] = useState(1000);
  const [sortOption, setSortOption] = useState('Recommended');
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch real API products
  const { data: apiProducts, isLoading } = useQuery({
    queryKey: ['rentals-catalog-products'],
    queryFn: async () => {
      const res = await api.get('/products', { params: { isPublished: true } });
      return res.data.data as Product[];
    },
  });

  // Fallback items matching design reference
  const fallbackItems: CatalogCardProps[] = [
    {
      id: 'prod-sony-alpha-01',
      title: 'Sony Alpha a7 IV Mirrorless Camera',
      description: 'Professional hybrid camera with 33MP full-frame sensor and 4K video recording.',
      price: 45,
      billingCycle: '/ day',
      isNew: true,
      imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'prod-larsen-sofa-02',
      title: 'Larsen Charcoal 3-Seater Sofa',
      description: 'Premium fabric blend with high-density foam cushioning for refined living.',
      price: 120,
      billingCycle: '/ month',
      colorSwatches: ['#3a3b3c', '#e3d7c5', '#9ea5b1'],
      imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'prod-macbook-m3-03',
      title: 'MacBook Pro 16" M3 Max',
      description: 'Ultimate workstation for creatives. 64GB RAM, 2TB SSD storage.',
      price: 35,
      billingCycle: '/ day',
      imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'prod-super73-04',
      title: 'Super73-S2 Electric Cruiser Bike',
      description: 'High-performance electric motorbike-styled cruiser with 75+ mile range.',
      price: 45,
      billingCycle: '/ day',
      isNew: true,
      imageUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'prod-canon-r5-05',
      title: 'Canon EOS R5 Mirrorless Body',
      description: '45MP 8K video mirrorless camera body with RF 24-70mm lens kit.',
      price: 75,
      billingCycle: '/ day',
      imageUrl: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'prod-sony-fx3-06',
      title: 'Sony FX3 Cinema Camera Kit',
      description: 'Full-frame cinema camera with 4K 120fps capability and top handle audio.',
      price: 85,
      billingCycle: '/ day',
      imageUrl: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80',
    },
  ];

  // Combine or format items
  const catalogCards: CatalogCardProps[] = useMemo(() => {
    if (apiProducts && apiProducts.length > 0) {
      return apiProducts
        .filter((p) => p.product_type !== 'SERVICE')
        .map((p, idx) => ({
          id: p.id,
          title: p.name,
          description: p.description || 'Curated high-end rental item for your lifestyle requirements.',
          price: p.sales_price || 45,
          billingCycle: selectedDuration === 'Monthly' ? '/ month' : '/ day',
          isNew: idx % 2 === 0,
          colorSwatches: idx === 1 ? ['#3a3b3c', '#e3d7c5', '#9ea5b1'] : undefined,
          imageUrl: p.image_urls?.[0] || fallbackItems[idx % fallbackItems.length].imageUrl,
          productRaw: p,
        }));
    }
    return fallbackItems;
  }, [apiProducts, selectedDuration]);

  // Filter items based on sidebar controls & search
  const filteredCards = useMemo(() => {
    let result = catalogCards.filter((card) => {
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = card.title.toLowerCase().includes(query);
        const matchDesc = card.description.toLowerCase().includes(query);
        if (!matchTitle && !matchDesc) return false;
      }

      // Price filter
      if (card.price > maxPrice) return false;

      // Category filter (if selected)
      if (selectedCategories.length > 0) {
        const matchesCategory = selectedCategories.some((cat) => {
          const t = card.title.toLowerCase();
          const d = card.description.toLowerCase();
          if (cat === 'electronics') {
            return t.includes('sony') || t.includes('macbook') || t.includes('camera') || t.includes('canon') || t.includes('red');
          }
          if (cat === 'furniture') {
            return t.includes('sofa') || t.includes('larsen') || d.includes('fabric') || d.includes('cushion') || t.includes('furniture');
          }
          if (cat === 'photography') {
            return t.includes('sony') || t.includes('camera') || t.includes('canon') || t.includes('lens');
          }
          if (cat === 'sports') {
            return t.includes('super73') || t.includes('bike') || t.includes('ev');
          }
          return true;
        });
        if (!matchesCategory) return false;
      }

      return true;
    });

    // Sorting
    if (sortOption === 'PriceLowHigh') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'PriceHighLow') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [catalogCards, searchQuery, maxPrice, selectedCategories, sortOption]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setSelectedDuration('Monthly');
    setMaxPrice(1000);
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-[#f8f8fa] text-neutral-900 flex flex-col font-sans">
      {/* Header */}
      <NavbarHeader />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-6 lg:px-16 py-12 w-full">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* Left Sidebar Filter Panel */}
          <RentalsSidebarFilter
            selectedCategories={selectedCategories}
            onCategoryChange={setSelectedCategories}
            selectedDuration={selectedDuration}
            onDurationChange={setSelectedDuration}
            maxPrice={maxPrice}
            onMaxPriceChange={setMaxPrice}
            onReset={handleResetFilters}
          />

          {/* Right Main Catalog Content */}
          <div className="flex-1 w-full space-y-6">
            {/* Catalog Top Header Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
                  Browse Rentals
                </h1>
                <p className="text-xs text-neutral-500 font-medium mt-0.5">
                  Showing {filteredCards.length} high-end items for your needs.
                </p>
              </div>

              {/* Search & Sort Controls */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                {/* Search Input Box */}
                <div className="relative flex-1 sm:w-60">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="w-full bg-[#efeff3] border border-neutral-200/80 text-xs text-neutral-900 placeholder-neutral-400 rounded-full pl-9 pr-4 py-2 focus:outline-none focus:border-black transition-all font-medium"
                  />
                </div>

                {/* Sort Dropdown */}
                <div className="relative">
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="bg-white border border-neutral-200/80 rounded-full pl-4 pr-8 py-2 text-xs font-semibold text-neutral-800 shadow-sm appearance-none focus:outline-none cursor-pointer"
                  >
                    <option value="Recommended">Recommended</option>
                    <option value="PriceLowHigh">Price: Low to High</option>
                    <option value="PriceHighLow">Price: High to Low</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-neutral-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Catalog Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="h-80 rounded-3xl bg-neutral-200/60 animate-pulse" />
                ))}
              </div>
            ) : filteredCards.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCards.map((card) => (
                  <RentalsCatalogCard key={card.id} {...card} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-neutral-200/60 space-y-3">
                <p className="text-sm font-bold text-neutral-800">No rental items match your criteria.</p>
                <button
                  onClick={handleResetFilters}
                  className="text-xs font-bold text-black underline hover:no-underline"
                >
                  Reset all filters
                </button>
              </div>
            )}

            {/* Pagination Controls */}
            <RentalsPagination
              currentPage={currentPage}
              totalPages={3}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <HomeFooter />
    </div>
  );
};

export default RentalsPage;
