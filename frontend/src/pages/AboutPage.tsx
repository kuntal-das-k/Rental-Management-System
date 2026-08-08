import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 flex flex-col font-sans selection:bg-slate-900 selection:text-white">
      {/* Top Header / Navigation */}
      <header className="w-full bg-[#FAFAFA] border-b border-slate-200/60 sticky top-0 z-50 backdrop-blur-md bg-opacity-90">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-lg font-bold tracking-tight text-slate-900 hover:opacity-80 transition-opacity">
            Twin6Rental
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 text-xs font-medium text-slate-600">
            <Link
              to="/"
              className={`transition-colors hover:text-slate-900 py-1 ${
                isActive('/') ? 'text-slate-900 font-semibold border-b-2 border-slate-900' : ''
              }`}
            >
              Home
            </Link>
            <Link
              to="/rentals"
              className={`transition-colors hover:text-slate-900 py-1 ${
                isActive('/rentals') ? 'text-slate-900 font-semibold border-b-2 border-slate-900' : ''
              }`}
            >
              Rentals
            </Link>
            <Link
              to="/how-it-works"
              className={`transition-colors hover:text-slate-900 py-1 ${
                isActive('/how-it-works') ? 'text-slate-900 font-semibold border-b-2 border-slate-900' : ''
              }`}
            >
              How It Works
            </Link>
            <Link
              to="/about"
              className={`transition-colors hover:text-slate-900 py-1 relative ${
                isActive('/about') ? 'text-slate-900 font-semibold border-b-2 border-slate-900' : ''
              }`}
            >
              About Us
            </Link>
            <Link
              to="/contact"
              className={`transition-colors hover:text-slate-900 py-1 ${
                isActive('/contact') ? 'text-slate-900 font-semibold border-b-2 border-slate-900' : ''
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className="text-xs font-medium text-slate-700 hover:text-slate-900 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/signup/customer"
              className="text-xs font-medium bg-slate-950 text-white px-4 py-2 rounded-full hover:bg-slate-800 transition-all shadow-sm"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 pt-16 pb-20 space-y-14 sm:space-y-16">
        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto space-y-4">
          <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-slate-900">
            Access over Ownership.
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto leading-relaxed font-normal">
            We believe the finest things in life should be experienced, not hoarded. Twin6Rental is the leading marketplace for premium product rentals, curating a collection of high-end lifestyle assets for the modern, sustainable consumer.
          </p>
        </section>

        {/* Hero Showcase Image */}
        <section className="w-full">
          <div className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm border border-slate-200/50 bg-white">
            <img
              src="/images/about-hero.png"
              alt="Twin6Rental Luxury Cinema Camera and Leather Duffel Bag Rental Assets"
              className="w-full h-auto max-h-[540px] object-cover object-center block"
            />
          </div>
        </section>

        {/* Feature Cards Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 pt-4">
          {/* Card 1: Sustainable Luxury */}
          <div className="bg-[#F4F4F6] rounded-2xl sm:rounded-3xl p-8 sm:p-10 flex flex-col justify-between space-y-6">
            <div className="w-8 h-8 flex items-center justify-center text-slate-900">
              {/* Recycle / Circular economy icon matching reference image */}
              <svg
                className="w-7 h-7"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.91 1.78 1.78 0 0 1 .15-1.89L7 11.5" />
                <path d="M11 19h8.185a1.83 1.83 0 0 0 1.57-.91 1.78 1.78 0 0 0-.15-1.89L17 11.5" />
                <path d="M12 4.5l3.5 6H8.5L12 4.5z" />
                <path d="M12 2v2.5" />
                <path d="m14 17 2 2-2 2" />
                <path d="m10 7-2-2 2-2" />
              </svg>
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-slate-900 tracking-tight">
                Sustainable Luxury
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                By facilitating a circular economy for premium goods, we reduce waste without compromising on quality. Enjoy the latest technology, fashion, and gear while minimizing your environmental footprint.
              </p>
            </div>
          </div>

          {/* Card 2: Curated Excellence */}
          <div className="bg-[#F4F4F6] rounded-2xl sm:rounded-3xl p-8 sm:p-10 flex flex-col justify-between space-y-6">
            <div className="w-8 h-8 flex items-center justify-center text-slate-900">
              {/* Scalloped badge checkmark icon matching reference image */}
              <svg
                className="w-7 h-7"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-slate-900 tracking-tight">
                Curated Excellence
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                Every item on our platform is meticulously inspected and authenticated. From professional-grade photography equipment to haute couture, we guarantee a flawless experience with every rental.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#EFEFEF] border-t border-slate-200/80 mt-auto py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          {/* Left Footer Column */}
          <div className="space-y-2 max-w-sm">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Twin6Rental
            </h3>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              © 2024 Twin6Rental. Leading marketplace for premium product rentals.
            </p>
          </div>

          {/* Right Footer Link Columns */}
          <div className="flex items-start space-x-16 sm:space-x-24">
            {/* Legal Column */}
            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-slate-900 block">
                Legal
              </span>
              <ul className="space-y-1 text-[11px] text-slate-500">
                <li>
                  <Link to="#" className="hover:text-slate-900 transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-slate-900 transition-colors">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support Column */}
            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-slate-900 block">
                Support
              </span>
              <ul className="space-y-1 text-[11px] text-slate-500">
                <li>
                  <Link to="#" className="hover:text-slate-900 transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-slate-900 transition-colors">
                    Support
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-slate-900 transition-colors">
                    Newsletter Signup
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

