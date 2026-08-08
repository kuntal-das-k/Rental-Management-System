import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { RentalsPage } from './pages/RentalsPage';
import { AboutPage } from './pages/AboutPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { ProductDetail } from './pages/ProductDetail';
import { Checkout } from './pages/Checkout';
import { ThankYou } from './pages/ThankYou';
import { Login } from './pages/Login';
import { CustomerSignup } from './pages/CustomerSignup';
import { VendorSignup } from './pages/VendorSignup';
import { ResetPassword } from './pages/ResetPassword';
import { VendorDashboard } from './pages/VendorDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminUsers } from './pages/AdminUsers';
import { CustomerOrders } from './pages/CustomerOrders';
import { WishlistPage } from './pages/WishlistPage';
import { ProfilePage } from './pages/ProfilePage';
import { NotFound } from './pages/NotFound';

export const App: React.FC = () => {
  return (
    <Routes>
      {/* Primary Navigation Pages */}
      <Route path="/" element={<HomePage />} />
      <Route path="/rentals" element={<RentalsPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/how-it-works" element={<HowItWorksPage />} />

      {/* Product Detail & Catalog Aliases */}
      <Route path="/products" element={<RentalsPage />} />
      <Route path="/products/:id" element={<ProductDetail />} />

      {/* Cart & Checkout */}
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/thank-you" element={<ThankYou />} />

      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup/customer" element={<CustomerSignup />} />
      <Route path="/signup/vendor" element={<VendorSignup />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Customer Portal */}
      <Route path="/customer/orders" element={<CustomerOrders />} />
      <Route path="/wishlist" element={<WishlistPage />} />
      <Route path="/profile" element={<ProfilePage />} />

      {/* Vendor Portal */}
      <Route path="/vendor/dashboard" element={<VendorDashboard />} />

      {/* Admin Portal */}
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/users" element={<AdminUsers />} />

      {/* 404 Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
