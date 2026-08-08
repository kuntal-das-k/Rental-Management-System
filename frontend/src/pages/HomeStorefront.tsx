import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { Product } from '../types';
import { Navbar } from '../components/Navbar';
import { Filter, Heart, Sparkles, Check, ArrowRight, Shield } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export const HomeStorefront: React.FC = () => {
  const { user } = useAuthStore();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<number>(500);
  const [durationUnit, setDurationUnit] = useState<string>('all');
  const [wishlistedIds, setWishlistedIds] = useState<string[]>([]);

  // Fetch published products
  const { data: productsData, isLoading } = useQuery({
    queryKey: ['products', search, selectedCategory, maxPrice],
    queryFn: async () => {
      const res = await api.get('/products', {
        params: { isPublished: true, search, categoryId: selectedCategory || undefined },
      });
      return res.data.data as Product[];
    },
  });

  // Fetch categories & attributes
  const { data: categories } = useQuery({
    queryKey: ['categories'],
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

  const filteredProducts = (productsData || []).filter((p) => {
    if (p.sales_price > maxPrice) return false;
    // Hide service deposit products from storefront grid
    if (p.product_type === 'SERVICE') return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col">
      <Navbar searchQuery={search} onSearchChange={setSearch} />

      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-[#030712] border-b border-slate-800/80 py-12 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Multi-Vendor Premium Equipment & EV Rental Marketplace</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-white">
              Rent Top-Tier Gear & Mobility.{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Zero Friction.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-400">
              Browse cinema cameras, audio kits, electric motorbikes, and urban vehicles. Automated security deposits, flexible rental periods, and instant digital invoices.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex items-center gap-6 shadow-2xl">
            <div className="text-center">
              <span className="text-2xl font-black text-cyan-400 block">100%</span>
              <span className="text-[11px] font-semibold text-slate-400">Automated Deposits</span>
            </div>
            <div className="h-10 w-px bg-slate-800"></div>
            <div className="text-center">
              <span className="text-2xl font-black text-emerald-400 block">Fast</span>
              <span className="text-[11px] font-semibold text-slate-400">Odoo Workflow</span>
            </div>
            <div className="h-10 w-px bg-slate-800"></div>
            <div className="text-center">
              <span className="text-2xl font-black text-amber-400 block">Verified</span>
              <span className="text-[11px] font-semibold text-slate-400">Multi-Vendor</span>
            </div>
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
                <Filter className="w-4 h-4 text-cyan-400" />
                Refine Rental Search
              </h3>
              <button
                onClick={() => {
                  setSelectedCategory('');
                  setSelectedBrand('');
                  setSelectedColor('');
                  setMaxPrice(500);
                  setDurationUnit('all');
                }}
                className="text-[11px] text-cyan-400 hover:underline"
              >
                Reset
              </button>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">Category</label>
              <div className="space-y-1">
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

            {/* Rental Duration Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">Rental Duration Unit</label>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                {[
                  { id: 'all', label: 'All Duration' },
                  { id: 'day', label: 'Daily Rate' },
                  { id: 'month', label: '1 Month' },
                  { id: '6month', label: '6 Months' },
                ].map((dur) => (
                  <button
                    key={dur.id}
                    onClick={() => setDurationUnit(dur.id)}
                    className={`px-2.5 py-1.5 rounded-lg font-medium border text-center transition-all ${
                      durationUnit === dur.id
                        ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400 font-bold'
                        : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {dur.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Slider */}
            <div>
              <div className="flex justify-between items-center text-xs font-bold text-slate-300 mb-2">
                <span>Max Daily Rent</span>
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

            {/* Color Swatches */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">Color Swatches</label>
              <div className="flex items-center gap-2">
                {['#000000', '#FFFFFF', '#FF0000', '#0000FF'].map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(selectedColor === color ? '' : color)}
                    style={{ backgroundColor: color }}
                    className={`w-6 h-6 rounded-full border-2 transition-transform ${
                      selectedColor === color ? 'border-cyan-400 scale-110' : 'border-slate-700'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <section className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-100">
              Available Rentals ({filteredProducts.length})
            </h2>
            <span className="text-xs text-slate-400">Showing verified multi-vendor products</span>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="h-72 rounded-2xl bg-slate-900/60 animate-pulse"></div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16 glass-panel rounded-2xl border border-slate-800">
              <p className="text-slate-400 text-sm">No products found matching your current filter criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => {
                const isWishlisted = wishlistedIds.includes(product.id);
                return (
                  <Link
                    key={product.id}
                    to={`/products/${product.id}`}
                    className="glass-card rounded-2xl overflow-hidden border border-slate-800 flex flex-col group"
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
