import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { Product } from '../types';
import { Navbar } from '../components/Navbar';
import { Filter, Heart, ArrowRight, Shield, SlidersHorizontal, Search, Sparkles } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export const RentalsPage: React.FC = () => {
  const { user } = useAuthStore();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<number>(500);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'name'>('featured');
  const [wishlistedIds, setWishlistedIds] = useState<string[]>([]);

  // Fetch published products
  const { data: productsData, isLoading } = useQuery({
    queryKey: ['products-rentals-page', search, selectedCategory],
    queryFn: async () => {
      const res = await api.get('/products', {
        params: { isPublished: true, search, categoryId: selectedCategory || undefined },
      });
      return res.data.data as Product[];
    },
  });

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ['categories-rentals-page'],
    queryFn: async () => {
      const res = await api.get('/products/categories');
      return res.data.data;
    },
  });

  const toggleWishlist = async (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      await api.post('/wishlist/toggle', { productId });
      setWishlistedIds((prev) =>
        prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
      );
    } catch (err) {
      console.error(err);
    }
  };

  let filteredProducts = (productsData || []).filter((p) => {
    if (p.sales_price > maxPrice) return false;
    if (p.product_type === 'SERVICE') return false;
    return true;
  });

  if (sortBy === 'price-asc') {
    filteredProducts.sort((a, b) => a.sales_price - b.sales_price);
  } else if (sortBy === 'price-desc') {
    filteredProducts.sort((a, b) => b.sales_price - a.sales_price);
  } else if (sortBy === 'name') {
    filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
  }

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col">
      <Navbar searchQuery={search} onSearchChange={setSearch} />

      {/* Header Banner */}
      <section className="bg-gradient-to-b from-slate-900 via-slate-950 to-[#030712] border-b border-slate-800/80 py-10 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Multi-Vendor Equipment Catalog</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white">Explore All Rentable Equipment</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Cinema cameras, electric mobility, drones, audio gear, and professional tools.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="featured">Sort by: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8 flex-1 w-full grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar Filters */}
        <aside className="space-y-6">
          <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-5 sticky top-24">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
                Filter Equipment
              </h3>
              <button
                onClick={() => {
                  setSelectedCategory('');
                  setSelectedColor('');
                  setMaxPrice(500);
                  setSearch('');
                  setSortBy('featured');
                }}
                className="text-[11px] text-cyan-400 hover:underline font-semibold"
              >
                Reset All
              </button>
            </div>

            {/* Search Input for Mobile/Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Keyword Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Categories */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">Categories</label>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    selectedCategory === '' ? 'bg-cyan-500/20 text-cyan-400 font-bold' : 'text-slate-400 hover:bg-slate-900'
                  }`}
                >
                  All Categories
                </button>
                {(categories || []).map((cat: any) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      selectedCategory === cat.id ? 'bg-cyan-500/20 text-cyan-400 font-bold' : 'text-slate-400 hover:bg-slate-900'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Max Daily Rate Slider */}
            <div>
              <div className="flex justify-between items-center text-xs font-bold text-slate-300 mb-2">
                <span>Max Daily Rate</span>
                <span className="text-cyan-400">${maxPrice} / day</span>
              </div>
              <input
                type="range"
                min={20}
                max={500}
                step={10}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <section className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Showing <strong className="text-white">{filteredProducts.length}</strong> available equipment items</span>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="h-72 rounded-2xl bg-slate-900/60 animate-pulse" />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16 glass-panel rounded-2xl border border-slate-800 space-y-2">
              <p className="text-slate-300 text-sm font-bold">No equipment found matching your criteria</p>
              <p className="text-slate-500 text-xs">Try adjusting your category or max price filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => {
                const isWishlisted = wishlistedIds.includes(product.id);
                return (
                  <Link
                    key={product.id}
                    to={`/products/${product.id}`}
                    className="glass-card rounded-2xl overflow-hidden border border-slate-800 flex flex-col group hover:border-cyan-500/40 transition-all"
                  >
                    {/* Image Container */}
                    <div className="relative h-48 bg-slate-900 overflow-hidden">
                      <img
                        src={product.image_urls[0] || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80'}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <button
                        onClick={(e) => toggleWishlist(product.id, e)}
                        className={`absolute top-3 right-3 p-2 rounded-full glass-panel border transition-colors ${
                          isWishlisted ? 'text-red-500 border-red-500/50' : 'text-slate-400 border-slate-700 hover:text-white'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                      </button>

                      {product.vendor && (
                        <span className="absolute bottom-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-950/80 text-cyan-400 border border-cyan-500/30">
                          {product.vendor.company_name}
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <h3 className="text-sm font-bold text-slate-100 group-hover:text-cyan-400 transition-colors line-clamp-1">
                          {product.name}
                        </h3>
                        <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                          {product.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                        <div>
                          <span className="text-lg font-black text-white">${product.sales_price}</span>
                          <span className="text-xs text-slate-400 font-medium"> / day</span>
                          {product.security_deposit_amount && (
                            <span className="block text-[10px] text-cyan-400 font-semibold">
                              +${product.security_deposit_amount} Dep.
                            </span>
                          )}
                        </div>

                        <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-colors">
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};
