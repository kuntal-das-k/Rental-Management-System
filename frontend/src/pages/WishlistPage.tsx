import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { Product } from '../types';
import { Navbar } from '../components/Navbar';
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
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-10 flex-1 w-full space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-red-500/10 text-red-400 border border-red-500/30">
            <Heart className="w-6 h-6 fill-current" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white">Saved Gear & Wishlist</h1>
            <p className="text-xs text-slate-400">Quickly access items you saved for future projects</p>
          </div>
        </div>

        {isLoading ? (
          <div className="text-slate-400 text-xs">Loading saved wishlist...</div>
        ) : !wishlistProducts || wishlistProducts.length === 0 ? (
          <div className="text-center py-16 glass-panel rounded-2xl border border-slate-800">
            <p className="text-slate-400 text-sm">Your wishlist is currently empty.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistProducts.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="glass-card rounded-2xl overflow-hidden border border-slate-800 flex flex-col group"
              >
                <div className="h-44 bg-slate-900 overflow-hidden relative">
                  <img
                    src={product.image_urls[0] || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                  <h3 className="text-sm font-bold text-slate-100 group-hover:text-cyan-400 line-clamp-1">
                    {product.name}
                  </h3>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-800/80">
                    <span className="text-base font-extrabold text-white">${product.sales_price}/day</span>
                    <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
