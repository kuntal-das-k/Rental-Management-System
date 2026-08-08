import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import {
  Search,
  Calendar,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  ArrowRight,
  UserCheck,
  PackagePlus,
  FileSpreadsheet,
  DollarSign,
  CheckCircle2,
} from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col">
      <Navbar />

      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-[#030712] border-b border-slate-800/80 py-16 px-4 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold">
            <Sparkles className="w-4 h-4" />
            <span>Simple, Frictionless & Secure</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            How <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">TwinSix Rentals</span> Works
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Whether you are renting high-end equipment or listing your fleet as a vendor, our Odoo-standard rental workflow makes the process seamless and transparent.
          </p>
        </div>
      </section>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 lg:px-8 py-16 flex-1 w-full space-y-20">
        {/* SECTION 1: FOR CUSTOMERS */}
        <section className="space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Customer Journey</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">4 Easy Steps to Rent Equipment</h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
              From finding the perfect gear to getting your deposit refunded automatically.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Browse & Choose',
                desc: 'Explore cinema cameras, drones, EV bikes, audio gear, and tools from verified multi-vendor listings.',
                icon: Search,
                color: 'text-cyan-400',
                bg: 'bg-cyan-500/10 border-cyan-500/30',
              },
              {
                step: '02',
                title: 'Select Dates & Deposit',
                desc: 'Choose your pickup and return dates. Transparent pricing with automated, fully refundable security deposits.',
                icon: Calendar,
                color: 'text-blue-400',
                bg: 'bg-blue-500/10 border-blue-500/30',
              },
              {
                step: '03',
                title: 'Pickup or Delivery',
                desc: 'Collect from the vendor store or get express doorstep delivery with digital condition logging.',
                icon: Truck,
                color: 'text-amber-400',
                bg: 'bg-amber-500/10 border-amber-500/30',
              },
              {
                step: '04',
                title: 'Return & Auto-Refund',
                desc: 'Return the equipment on time. Your security deposit is auto-released directly to your payment method.',
                icon: RotateCcw,
                color: 'text-emerald-400',
                bg: 'bg-emerald-500/10 border-emerald-500/30',
              },
            ].map((card, i) => {
              const Icon = card.icon;
              return (
                <div
                  key={i}
                  className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-6 relative overflow-hidden group hover:border-slate-700 transition-all"
                >
                  <span className="absolute top-3 right-4 text-4xl font-black text-slate-800/50 group-hover:text-slate-700/50 transition-colors">
                    {card.step}
                  </span>

                  <div className="space-y-4">
                    <div className={`w-12 h-12 rounded-xl ${card.bg} border flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${card.color}`} />
                    </div>
                    <h3 className="text-base font-bold text-white">{card.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{card.desc}</p>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Instant Confirmation</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 2: FOR VENDORS */}
        <section className="glass-panel rounded-3xl border border-slate-800 p-8 lg:p-12 space-y-10">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Vendor Ecosystem</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">How Vendors Earn on TwinSix</h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
              List products, set dynamic pricelists, and track rentals with our Odoo Kanban Order Management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: PackagePlus,
                title: '1. List Your Inventory',
                desc: 'Upload images, set daily rental rates, refundable deposit amounts, and custom late-fee rates per item.',
              },
              {
                icon: FileSpreadsheet,
                title: '2. Manage Order Lifecycle',
                desc: 'Follow Odoo workflow: Quotation → Quotation Sent → Sales Order → Invoice. Drag & drop orders across the Kanban board.',
              },
              {
                icon: DollarSign,
                title: '3. Collect Payouts & Fees',
                desc: 'Automated digital PDF invoice generation. Late returns automatically apply daily late-fee penalties.',
              },
            ].map((vStep, i) => {
              const VIcon = vStep.icon;
              return (
                <div key={i} className="bg-slate-900/60 rounded-2xl p-6 border border-slate-800 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                    <VIcon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-white">{vStep.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{vStep.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 3: CTA */}
        <section className="bg-gradient-to-r from-cyan-500/10 via-blue-600/10 to-cyan-500/10 rounded-3xl border border-cyan-500/20 p-8 lg:p-12 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Ready to Experience Frictionless Rentals?</h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            Join thousands of customers and verified equipment vendors today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/rentals"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs sm:text-sm shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all"
            >
              Explore Products Catalog <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/signup/vendor"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs sm:text-sm border border-slate-700 transition-all"
            >
              Become a Vendor
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white text-[10px]">
              T6
            </div>
            <span className="font-bold text-slate-400">TwinSix Rentals</span>
          </div>
          <span>© 2026 TwinSix Rentals. Multi-Vendor Rental Marketplace.</span>
          <div className="flex items-center gap-4">
            <Link to="/rentals" className="hover:text-cyan-400 transition-colors">Rentals Catalog</Link>
            <Link to="/about" className="hover:text-cyan-400 transition-colors">About Us</Link>
            <Link to="/how-it-works" className="hover:text-cyan-400 transition-colors">How It Works</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
