import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { Product } from '../types';
import { Navbar } from '../components/Navbar';
import {
  Sparkles,
  ArrowRight,
  Shield,
  Clock,
  Search,
  CheckCircle2,
  Star,
  Users,
  Camera,
  Bike,
  Wrench,
  Compass,
  Truck,
  RotateCcw,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const [search, setSearch] = useState('');

  // Fetch featured published products
  const { data: productsData, isLoading } = useQuery({
    queryKey: ['featured-products-home'],
    queryFn: async () => {
      const res = await api.get('/products', { params: { isPublished: true, limit: 6 } });
      return res.data.data as Product[];
    },
  });

  const featuredProducts = (productsData || []).filter((p) => p.product_type !== 'SERVICE').slice(0, 6);

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col">
      <Navbar searchQuery={search} onSearchChange={setSearch} />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-[#030712] border-b border-slate-800/80 pt-16 pb-24 px-4 lg:px-8">
        {/* Glow backdrop effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Multi-Vendor Rental Marketplace Platform</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Rent Anything.{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Anytime. Zero Friction.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Access cinema cameras, electric motorbikes, drones, audio gear, and heavy tools from verified local vendors. Automated security deposits, flexible rental periods, and instant PDF invoicing.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to="/rentals"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all"
              >
                Browse Equipment <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/how-it-works"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-sm border border-slate-800 transition-all text-center"
              >
                See How It Works
              </Link>
            </div>

            {/* Quick Badges */}
            <div className="pt-6 border-t border-slate-800/80 flex items-center justify-center lg:justify-start gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Verified Vendors</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>Auto Deposit Refund</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                <span>Odoo Workflow</span>
              </div>
            </div>
          </div>

          {/* Hero Banner Feature Card */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Featured Multi-Vendor Fleet</span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                Live Inventory
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { name: 'RED V-Raptor 8K', category: 'Camera & Optics', price: '$150/day', icon: Camera },
                { name: 'Super73 EV Motorbike', category: 'Urban EV Mobility', price: '$45/day', icon: Bike },
                { name: 'Sennheiser MKH416', category: 'Audio Equipment', price: '$35/day', icon: Compass },
                { name: 'DeWalt Power Kit', category: 'Construction & Tools', price: '$25/day', icon: Wrench },
              ].map((item, i) => {
                const ItemIcon = item.icon;
                return (
                  <div key={i} className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 space-y-2 hover:border-cyan-500/40 transition-colors">
                    <ItemIcon className="w-5 h-5 text-cyan-400" />
                    <div>
                      <h4 className="text-xs font-bold text-white line-clamp-1">{item.name}</h4>
                      <span className="text-[10px] text-slate-400 block">{item.category}</span>
                    </div>
                    <span className="text-xs font-black text-cyan-400 block">{item.price}</span>
                  </div>
                );
              })}
            </div>

            <Link
              to="/rentals"
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-400 text-xs font-bold text-center block border border-slate-800 transition-colors"
            >
              View Full Marketplace Catalog →
            </Link>
          </div>
        </div>
      </section>

      {/* CATEGORIES GRID SECTION */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-16 w-full space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-white">Popular Rental Categories</h2>
            <p className="text-xs text-slate-400 mt-1">Browse equipment tailored for your next production or trip</p>
          </div>
          <Link to="/rentals" className="text-xs text-cyan-400 font-bold hover:underline">
            View All Categories →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { title: 'Cameras & Lenses', count: '45+ Items', icon: Camera, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/30' },
            { title: 'Electric Mobility', count: '28+ Vehicles', icon: Bike, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' },
            { title: 'Audio & Microphones', count: '32+ Kits', icon: Compass, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30' },
            { title: 'Tools & Power Gear', count: '50+ Equipment', icon: Wrench, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' },
          ].map((cat, i) => {
            const CatIcon = cat.icon;
            return (
              <Link
                key={i}
                to="/rentals"
                className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4 group hover:border-cyan-500/40 transition-all"
              >
                <div className={`w-10 h-10 rounded-xl ${cat.bg} border flex items-center justify-center`}>
                  <CatIcon className={`w-5 h-5 ${cat.color}`} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">{cat.title}</h3>
                  <span className="text-[11px] text-slate-400">{cat.count}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* FEATURED PRODUCTS SECTION */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-8 w-full space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-white">Trending Equipment</h2>
            <p className="text-xs text-slate-400 mt-1">High-demand items ready for instant booking</p>
          </div>
          <Link to="/rentals" className="text-xs text-cyan-400 font-bold hover:underline">
            Explore All Rentals →
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-64 rounded-2xl bg-slate-900/60 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="glass-card rounded-2xl overflow-hidden border border-slate-800 flex flex-col group hover:border-cyan-500/40 transition-all"
              >
                <div className="relative h-44 bg-slate-900 overflow-hidden">
                  <img
                    src={product.image_urls[0] || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.vendor && (
                    <span className="absolute bottom-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-950/80 text-cyan-400 border border-cyan-500/30">
                      {product.vendor.company_name}
                    </span>
                  )}
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-100 group-hover:text-cyan-400 transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1">{product.description}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <div>
                      <span className="text-lg font-black text-white">${product.sales_price}</span>
                      <span className="text-xs text-slate-400 font-medium"> / day</span>
                    </div>

                    <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-colors">
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* HOW IT WORKS SUMMARY SECTION */}
      <section className="bg-gradient-to-b from-[#030712] via-slate-950 to-[#030712] border-y border-slate-800/80 py-16 px-4 lg:px-8 mt-12">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Streamlined Process</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">How TwinSix Rentals Works</h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
              Automated workflows following Odoo Rental Module standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'Find Equipment', desc: 'Search gear across local verified vendors.', icon: Search },
              { step: '2', title: 'Book & Deposit', desc: 'Pick rental dates. Security deposit auto-calculated.', icon: Shield },
              { step: '3', title: 'Pickup / Delivery', desc: 'Doorstep delivery or in-store pickup.', icon: Truck },
              { step: '4', title: 'Return & Auto Refund', desc: 'Return item and get deposit refunded.', icon: RotateCcw },
            ].map((step, i) => {
              const StepIcon = step.icon;
              return (
                <div key={i} className="glass-panel p-5 rounded-2xl border border-slate-800 text-center space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center mx-auto">
                    <StepIcon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-white">{step.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
                </div>
              );
            })}
          </div>

          <div className="text-center pt-4">
            <Link
              to="/how-it-works"
              className="inline-flex items-center gap-2 text-xs font-bold text-cyan-400 hover:underline"
            >
              Read Detailed How It Works Guide →
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 py-10 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white text-xs">
              T6
            </div>
            <div>
              <span className="font-extrabold text-slate-200 block">TwinSix Rentals</span>
              <span className="text-[10px] text-slate-500">Multi-Vendor Rental Marketplace</span>
            </div>
          </div>

          <span>© 2026 TwinSix Rentals. All rights reserved.</span>

          <div className="flex items-center gap-6">
            <Link to="/rentals" className="hover:text-cyan-400 transition-colors">Rentals Catalog</Link>
            <Link to="/about" className="hover:text-cyan-400 transition-colors">About Us</Link>
            <Link to="/how-it-works" className="hover:text-cyan-400 transition-colors">How It Works</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
