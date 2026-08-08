import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { Product } from '../types';
import { NavbarHeader } from '../components/home/NavbarHeader';
import { HomeFooter } from '../components/home/HomeFooter';
import { Heart, ArrowRight } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const { data: wishlistProducts, isLoading } = useQuery({
    queryKey: ['wishlist'],
    queryFn: async () => {
      const res = await api.get('/wishlist');
      return res.data.data as Product[];
    },
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans selection:bg-slate-900 selection:text-white">
      <NavbarHeader />

      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-10 flex-1 w-full space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 shadow-xs">
            <Heart className="w-6 h-6 fill-current" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Saved Gear & Wishlist</h1>
            <p className="text-xs text-slate-500 font-medium">Quickly access items you saved for future rental projects</p>
          </div>
        </div>

        {isLoading ? (
          <div className="text-slate-400 text-xs font-semibold">Loading saved wishlist...</div>
        ) : !wishlistProducts || wishlistProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
              <Heart className="w-6 h-6" />
            </div>
            <p className="text-slate-500 text-xs font-bold">Your wishlist is currently empty.</p>
            <Link
              to="/rentals"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-sm transition-all"
            >
              <span>Explore Gear Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistProducts.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs flex flex-col group hover:shadow-md hover:border-slate-400 transition-all"
              >
                <div className="h-48 bg-[#F1F3F5] overflow-hidden relative flex items-center justify-center p-4">
                  <img
                    src={product.image_urls[0] || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80'}
                    alt={product.name}
                    className="w-full h-full object-contain filter drop-shadow-xs group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
                      {product.category?.name || 'EQUIPMENT'}
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900 group-hover:text-slate-700 line-clamp-1">
                      {product.name}
                    </h3>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                    <div>
                      <span className="text-base font-extrabold text-slate-900">₹{product.sales_price}</span>
                      <span className="text-xs text-slate-500 font-medium"> /day</span>
                    </div>
                    <span className="p-2 rounded-xl bg-slate-100 text-slate-800 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <HomeFooter />
    </div>
  );
};
