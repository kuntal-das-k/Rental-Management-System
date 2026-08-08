import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowRight } from 'lucide-react';

export const CategoryBentoGrid: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-16 py-12 space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-2">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-neutral-900">Trending Categories</h2>
          <p className="text-xs text-neutral-500 mt-1 font-medium">Explore our most popular rental collections.</p>
        </div>
        <Link
          to="/rentals"
          className="text-xs font-bold text-neutral-800 hover:text-black flex items-center gap-1 transition-colors"
        >
          <span>View All Categories</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Large Card: Designer Furniture */}
        <Link
          to="/rentals?category=furniture"
          className="lg:col-span-7 relative h-[380px] rounded-3xl overflow-hidden group shadow-lg light-card border-none"
        >
          <img
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80"
            alt="Designer Furniture"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.9]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-8 justify-between">
            <div className="space-y-1">
              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Designer Furniture</h3>
              <p className="text-xs sm:text-sm text-neutral-300 font-medium">Elevate your space</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all shadow-lg">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </Link>

        {/* Right Stacked Cards */}
        <div className="lg:col-span-5 grid grid-cols-1 gap-6">
          {/* Top Right Card: Pro Gear */}
          <Link
            to="/rentals?category=cameras"
            className="relative h-[178px] rounded-3xl overflow-hidden group shadow-md light-card border-none"
          >
            <img
              src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80"
              alt="Pro Gear"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.85]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-6 justify-between">
              <div className="space-y-0.5">
                <h3 className="text-xl font-bold text-white tracking-tight">Pro Gear</h3>
                <p className="text-xs text-neutral-300 font-medium">Cameras & Lenses</p>
              </div>
            </div>
          </Link>

          {/* Bottom Right Card: Tech & Gaming */}
          <Link
            to="/rentals?category=electronics"
            className="relative h-[178px] rounded-3xl overflow-hidden group shadow-md light-card border-none"
          >
            <img
              src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80"
              alt="Tech & Gaming"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.85]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-6 justify-between">
              <div className="space-y-0.5">
                <h3 className="text-xl font-bold text-white tracking-tight">Tech & Gaming</h3>
                <p className="text-xs text-neutral-300 font-medium">Laptops & Consoles</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};
