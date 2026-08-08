import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import { Product } from '../types';

// Import modular Home components
import { NavbarHeader } from '../components/home/NavbarHeader';
import { HeroSection } from '../components/home/HeroSection';
import { CategoryBentoGrid } from '../components/home/CategoryBentoGrid';
import { FeaturedRentals } from '../components/home/FeaturedRentals';
import { HomeFooter } from '../components/home/HomeFooter';

export const HomePage: React.FC = () => {
  // Fetch real published products from API
  const { data: productsData, isLoading } = useQuery({
    queryKey: ['featured-products-home'],
    queryFn: async () => {
      const res = await api.get('/products', { params: { isPublished: true, limit: 8 } });
      return res.data.data as Product[];
    },
  });

  const featuredProducts = (productsData || []).filter((p) => p.product_type !== 'SERVICE');

  return (
    <div className="min-h-screen bg-[#f8f8fa] text-neutral-900 flex flex-col font-sans">
      {/* Navbar Header */}
      <NavbarHeader />

      {/* Main Content */}
      <main className="flex-1 space-y-4">
        {/* Hero Section with Search Bar Widget */}
        <HeroSection />

        {/* Trending Categories Bento Grid */}
        <CategoryBentoGrid />

        {/* Featured Rentals Grid */}
        <FeaturedRentals apiProducts={featuredProducts} isLoading={isLoading} />
      </main>

      {/* Home Footer */}
      <HomeFooter />
    </div>
  );
};

export default HomePage;
