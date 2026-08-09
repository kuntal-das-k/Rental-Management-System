import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useCartStore } from '../../store/useCartStore';
import { useLocationStore } from '../../store/useLocationStore';
import { ShoppingBag, Heart, LogOut, LayoutDashboard, UserCircle, MapPin, Navigation, Loader2 } from 'lucide-react';

export const NavbarHeader: React.FC = () => {
  const { user, logout } = useAuthStore();
  const cartItems = useCartStore((state) => state.items);
  const { city, pincode, isDetecting, detectGPSLocation } = useLocationStore();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Rentals', path: '/rentals' },
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-neutral-100 px-6 lg:px-16 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo & Location Pill */}
        <div className="flex items-center gap-4 sm:gap-6">
          <Link to="/" className="flex items-center gap-1 text-xl font-bold tracking-tight text-neutral-900 group">
            <span className="font-extrabold text-2xl tracking-tighter">Twin6</span>
            <span className="font-medium text-2xl tracking-tight text-neutral-800">Rental</span>
          </Link>

          {/* GPS Location Pill */}
          <button
            onClick={() => detectGPSLocation()}
            disabled={isDetecting}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200/80 text-[11px] font-bold text-neutral-700 hover:bg-neutral-200 transition-all cursor-pointer"
            title="Click to detect current GPS Location"
          >
            {isDetecting ? (
              <Loader2 className="w-3 h-3 text-neutral-900 animate-spin" />
            ) : (
              <MapPin className="w-3 h-3 text-emerald-600" />
            )}
            <span className="truncate max-w-[120px]">{city} ({pincode})</span>
          </button>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`text-xs font-semibold tracking-wide transition-all relative py-1 ${
                  isActive ? 'text-neutral-900 font-bold' : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-neutral-900 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link to="/wishlist" className="relative p-2 text-neutral-600 hover:text-neutral-900 transition-colors" title="Saved Wishlist">
            <Heart className="w-4 h-4" />
          </Link>

          <Link to="/checkout" className="relative p-2 text-neutral-600 hover:text-neutral-900 transition-colors" title="Cart">
            <ShoppingBag className="w-4 h-4" />
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-black text-white font-bold text-[10px] rounded-full flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              {user.role === 'CUSTOMER' && (
                <Link
                  to="/customer/orders"
                  className="text-xs font-bold px-3 py-1.5 rounded-full bg-neutral-100 text-neutral-800 hover:bg-neutral-200 transition-colors"
                >
                  My Orders
                </Link>
              )}

              {user.role === 'VENDOR' && (
                <Link
                  to="/vendor/dashboard"
                  className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-neutral-900 text-white hover:bg-neutral-800 transition-colors"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Vendor Portal</span>
                </Link>
              )}

              {user.role === 'ADMIN' && (
                <Link
                  to="/admin/dashboard"
                  className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-amber-500 text-neutral-950 hover:bg-amber-400 transition-colors"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Admin Panel</span>
                </Link>
              )}

              <Link to="/profile" className="p-1.5 text-neutral-700 hover:text-black transition-colors" title="Account Profile">
                <UserCircle className="w-5 h-5" />
              </Link>

              <button
                onClick={handleLogout}
                className="p-1.5 text-neutral-400 hover:text-red-600 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-xs font-semibold text-neutral-700 hover:text-black transition-colors px-2 py-1"
              >
                Login
              </Link>

              <Link
                to="/signup/customer"
                className="text-xs font-semibold text-white bg-black hover:bg-neutral-800 px-4 py-2.5 rounded-full shadow-sm transition-all"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
