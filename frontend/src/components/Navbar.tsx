import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Heart, User as UserIcon, LayoutDashboard, LogOut, ShieldCheck, Search, UserCircle, HelpCircle } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCartStore';

interface NavbarProps {
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ searchQuery, onSearchChange }) => {
  const { user, logout } = useAuthStore();
  const cartItems = useCartStore((state) => state.items);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 glass-panel border-b border-slate-800 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            T6
          </div>
          <div>
            <span className="text-xl font-extrabold bg-gradient-to-r from-white via-slate-200 to-cyan-400 bg-clip-text text-transparent tracking-tight">
              TwinSix Rentals
            </span>
            <span className="block text-[10px] uppercase font-bold tracking-widest text-cyan-400">
              Multi-Vendor Marketplace
            </span>
          </div>
        </Link>

        {/* Global Search Bar */}
        {onSearchChange !== undefined && (
          <div className="flex-1 max-w-sm relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery || ''}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search cameras, EV bikes, gear by name..."
              className="w-full bg-slate-900/80 border border-slate-700/80 rounded-full pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
            />
          </div>
        )}

        {/* Main Nav Links */}
        <nav className="flex items-center gap-1 sm:gap-2 md:gap-4">
          <Link
            to="/"
            className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors ${
              isActive('/') ? 'text-cyan-400 bg-cyan-500/10 font-bold' : 'text-slate-300 hover:text-cyan-400'
            }`}
          >
            Home
          </Link>

          <Link
            to="/rentals"
            className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors ${
              isActive('/rentals') ? 'text-cyan-400 bg-cyan-500/10 font-bold' : 'text-slate-300 hover:text-cyan-400'
            }`}
          >
            Rentals
          </Link>

          <Link
            to="/about"
            className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors hidden sm:block ${
              isActive('/about') ? 'text-cyan-400 bg-cyan-500/10 font-bold' : 'text-slate-300 hover:text-cyan-400'
            }`}
          >
            About Us
          </Link>

          <Link
            to="/contact"
            className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors hidden sm:block ${
              isActive('/contact') ? 'text-cyan-400 bg-cyan-500/10 font-bold' : 'text-slate-300 hover:text-cyan-400'
            }`}
          >
            Contact
          </Link>

          <Link
            to="/how-it-works"
            className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors hidden lg:block ${
              isActive('/how-it-works') ? 'text-cyan-400 bg-cyan-500/10 font-bold' : 'text-slate-300 hover:text-cyan-400'
            }`}
          >
            How It Works
          </Link>

          {user && (
            <Link to="/wishlist" className="relative p-2 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors" title="Wishlist">
              <Heart className="w-4 h-4" />
            </Link>
          )}

          <Link to="/checkout" className="relative p-2 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors" title="Cart">
            <ShoppingBag className="w-4 h-4" />
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-500 text-slate-950 font-bold text-[10px] rounded-full flex items-center justify-center shadow-md">
                {cartItems.length}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              {user.role === 'VENDOR' && (
                <Link
                  to="/vendor/dashboard"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/30 text-xs font-bold transition-all"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Vendor Portal</span>
                </Link>
              )}

              {user.role === 'ADMIN' && (
                <Link
                  to="/admin/dashboard"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/30 text-xs font-bold transition-all"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Admin Panel</span>
                </Link>
              )}

              {user.role === 'CUSTOMER' && (
                <Link
                  to="/customer/orders"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs font-bold transition-all"
                >
                  <UserIcon className="w-4 h-4" />
                  <span>My Orders</span>
                </Link>
              )}

              <Link
                to="/profile"
                className="p-2 text-slate-400 hover:text-cyan-400 rounded-xl hover:bg-slate-800 transition-colors"
                title="Account Profile"
              >
                <UserCircle className="w-4 h-4" />
              </Link>

              <button
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-red-400 rounded-xl hover:bg-red-500/10 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 pl-2">
              <Link
                to="/login"
                className="px-3.5 py-1.5 text-xs font-bold text-slate-200 hover:text-white transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/signup/customer"
                className="px-3.5 py-1.5 text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl shadow-lg shadow-cyan-500/25 transition-all"
              >
                Sign Up
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};
