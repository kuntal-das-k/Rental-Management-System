import React, { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { api } from '../api/client';
import { Product } from '../types';
import { useFilterStore } from '../store/useFilterStore';

import { NavbarHeader } from '../components/home/NavbarHeader';
import { RentalsSidebarFilter, CategoryOption, VendorOption } from '../components/rentals/RentalsSidebarFilter';
import { RentalsCatalogCard, CatalogCardProps } from '../components/rentals/RentalsCatalogCard';
import { RentalsPagination } from '../components/rentals/RentalsPagination';
import { HomeFooter } from '../components/home/HomeFooter';

export const RentalsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const filterStore = useFilterStore();
  const [currentPage, setCurrentPage] = useState(1);

  // Sync URL search parameters to global filter store on load or navigation change
  useEffect(() => {
    const q = searchParams.get('search') || '';
    const cat = searchParams.get('category') || searchParams.get('categoryId') || searchParams.get('cat') || '';
    const dur = searchParams.get('duration') || 'Daily';
    const maxP = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : 50000;
    const sort = searchParams.get('sort') || 'Recommended';

    filterStore.setAllFilters({
      searchQuery: q,
      selectedCategories: cat ? [cat] : filterStore.selectedCategories,
      selectedDuration: dur,
      maxPrice: maxP,
      sortOption: sort,
    });
  }, [searchParams]);

  // Fetch categories
  const { data: dbCategories = [] } = useQuery<CategoryOption[]>({
    queryKey: ['rentals-categories'],
    queryFn: async () => {
      const res = await api.get('/products/categories');
      return (res.data.data as any[]) || [];
    },
  });

  // Fetch API products with server-side filtering & pagination over 300+ items
  const { data: apiResponse, isLoading } = useQuery({
    queryKey: [
      'rentals-catalog-products',
      currentPage,
      filterStore.searchQuery,
      filterStore.selectedVendorId,
      filterStore.selectedCategories,
      filterStore.maxPrice,
      filterStore.sortOption,
    ],
    queryFn: async () => {
      const catParam = filterStore.selectedCategories.length > 0 ? filterStore.selectedCategories[0] : undefined;
      const res = await api.get('/products', {
        params: {
          isPublished: true,
          page: currentPage,
          limit: 12,
          search: filterStore.searchQuery || undefined,
          vendorId: filterStore.selectedVendorId || undefined,
          categoryId: catParam || undefined,
          maxPrice: filterStore.maxPrice < 50000 ? filterStore.maxPrice : undefined,
          sortBy: filterStore.sortOption,
        },
      });
      return res.data;
    },
  });

  const apiProducts: Product[] = apiResponse?.data || [];
  const meta = apiResponse?.meta || { total: apiProducts.length, page: 1, limit: 12, totalPages: 1 };

  // Build vendors list dynamically from current response or system
  const vendorsList: VendorOption[] = useMemo(() => {
    const map = new Map<string, string>();
    apiProducts.forEach((p) => {
      if (p.vendor_id && (p as any).vendor?.company_name) {
        map.set(p.vendor_id, (p as any).vendor.company_name);
      }
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [apiProducts]);

  // Format cards
  const catalogCards: CatalogCardProps[] = useMemo(() => {
    return apiProducts
      .filter((p) => p.product_type !== 'SERVICE')
      .map((p, idx) => ({
        id: p.id,
        title: p.name,
        description: p.description || 'Curated high-end rental item for your lifestyle requirements.',
        price: p.sales_price || 45,
        billingCycle: filterStore.selectedDuration === 'Monthly' ? '/ month' : '/ day',
        isNew: idx % 2 === 0,
        imageUrl: p.image_urls?.[0] || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
        vendorName: (p as any).vendor?.company_name || 'Verified Vendor',
        vendorLogo: (p as any).vendor?.logo_url,
        categoryName: (p as any).category?.name,
        productRaw: p,
      }));
  }, [apiProducts, filterStore.selectedDuration]);

  const handleResetFilters = () => {
    filterStore.resetFilters();
    setCurrentPage(1);
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
            selectedCategories={filterStore.selectedCategories}
            onCategoryChange={(cats) => {
              filterStore.setSelectedCategories(cats);
              setCurrentPage(1);
            }}
            selectedVendorId={filterStore.selectedVendorId}
            onVendorChange={(vId) => {
              filterStore.setSelectedVendorId(vId);
              setCurrentPage(1);
            }}
            selectedDuration={filterStore.selectedDuration}
            onDurationChange={filterStore.setSelectedDuration}
            maxPrice={filterStore.maxPrice}
            onMaxPriceChange={(price) => {
              filterStore.setPriceRange(0, price);
              setCurrentPage(1);
            }}
            categoriesList={dbCategories}
            vendorsList={vendorsList}
            onReset={handleResetFilters}
          />

          {/* Right Main Catalog Content */}
          <div className="flex-1 w-full space-y-6">
            {/* Catalog Top Header Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
                  Browse Rental Products
                </h1>
                <p className="text-xs text-neutral-500 font-medium mt-0.5">
                  Showing {catalogCards.length} of {meta.total} vendor-listed items available for instant booking.
                </p>
              </div>

              {/* Search & Sort Controls */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                {/* Search Input Box */}
                <div className="relative flex-1 sm:w-60">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
                  <input
                    type="text"
                    value={filterStore.searchQuery}
                    onChange={(e) => {
                      filterStore.setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Search gear, bikes, cameras..."
                    className="w-full bg-[#efeff3] border border-neutral-200/80 text-xs text-neutral-900 placeholder-neutral-400 rounded-full pl-9 pr-4 py-2 focus:outline-none focus:border-black transition-all font-medium"
                  />
                </div>

                {/* Sort Dropdown */}
                <div className="relative">
                  <select
                    value={filterStore.sortOption}
                    onChange={(e) => {
                      filterStore.setSortOption(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="bg-white border border-neutral-200/80 rounded-full pl-4 pr-8 py-2 text-xs font-semibold text-neutral-800 shadow-sm appearance-none focus:outline-none cursor-pointer"
                  >
                    <option value="Recommended">Recommended</option>
                    <option value="PriceLowHigh">Price: Low to High</option>
                    <option value="PriceHighLow">Price: High to Low</option>
                    <option value="Newest">Newest Arrivals</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Catalog Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
                  <div key={n} className="h-80 rounded-3xl bg-neutral-200/60 animate-pulse" />
                ))}
              </div>
            ) : catalogCards.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {catalogCards.map((card) => (
                  <RentalsCatalogCard key={card.id} {...card} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-neutral-200/60 space-y-3">
                <p className="text-sm font-bold text-neutral-800">No rental products match your current filters.</p>
                <button
                  onClick={handleResetFilters}
                  className="text-xs font-bold text-black underline hover:no-underline"
                >
                  Reset all filters
                </button>
              </div>
            )}

            {/* Server Pagination Controls */}
            <RentalsPagination
              currentPage={currentPage}
              totalPages={meta.totalPages}
              onPageChange={(page) => {
                setCurrentPage(page);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
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
