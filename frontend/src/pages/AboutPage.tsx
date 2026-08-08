import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import {
  Shield,
  Zap,
  Clock,
  DollarSign,
  Truck,
  FileText,
  Users,
  Star,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Automated Security Deposits',
    description:
      'Every rental automatically calculates and collects a refundable security deposit. When the item is returned in good condition, the deposit is auto-settled — minus any late fees.',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10 border-cyan-500/30',
  },
  {
    icon: Clock,
    title: 'Odoo Rental Workflow',
    description:
      'Our order lifecycle follows Odoo conventions: Quotation → Quotation Sent → Sales Order → Invoice. Vendors manage orders through an intuitive Kanban board.',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/30',
  },
  {
    icon: DollarSign,
    title: 'Dynamic Pricing Engine',
    description:
      'Vendors set flexible pricing rules via Pricelists — apply percentage discounts, fixed prices, minimum quantity thresholds, and validity windows.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/30',
  },
  {
    icon: Truck,
    title: 'Pickup & Return Tracking',
    description:
      'Full pickup/return log with condition notes and timestamps. Choose between home delivery or in-store pickup for maximum flexibility.',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/30',
  },
  {
    icon: FileText,
    title: 'Instant PDF Invoices',
    description:
      'Generate professional PDF invoices with GST details, rental line items, vendor information, and payment summaries — all automatically.',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10 border-purple-500/30',
  },
  {
    icon: Users,
    title: 'Multi-Vendor Marketplace',
    description:
      'Multiple verified vendors list their equipment on one platform. Customers browse across vendors, compare prices, and rent from the best.',
    color: 'text-rose-400',
    bg: 'bg-rose-500/10 border-rose-500/30',
  },
];

const stats = [
  { label: 'Verified Vendors', value: '10+', icon: Users },
  { label: 'Products Listed', value: '200+', icon: Star },
  { label: 'Orders Processed', value: '1,500+', icon: FileText },
  { label: 'Uptime SLA', value: '99.9%', icon: Zap },
];

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative bg-gradient-to-b from-slate-900 via-slate-950 to-[#030712] border-b border-slate-800/80 py-20 px-4 lg:px-8">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>About TwinSix Rentals</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            The Future of{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Multi-Vendor Equipment Rental
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            TwinSix Rentals is a full-stack rental marketplace platform built with modern technologies.
            Vendors list products, customers browse and book, and the platform automates security deposits,
            late-fee detection, and digital invoicing — all following the Odoo Rental module workflow.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-5xl mx-auto px-4 lg:px-8 -mt-8 relative z-10">
        <div className="glass-panel rounded-2xl border border-slate-800 p-6 grid grid-cols-2 sm:grid-cols-4 gap-6">
          {stats.map((stat, i) => {
            const StatIcon = stat.icon;
            return (
              <div key={i} className="text-center space-y-1">
                <StatIcon className="w-5 h-5 mx-auto text-cyan-400" />
                <span className="text-2xl font-black text-white block">{stat.value}</span>
                <span className="text-[11px] font-semibold text-slate-400">{stat.label}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-6xl mx-auto px-4 lg:px-8 py-16 space-y-10">
        <div className="text-center space-y-3">
          <h2 className="text-2xl font-extrabold text-white">Platform Features</h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Everything you need to run a professional rental marketplace — built in, not bolted on.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => {
            const FeatureIcon = feature.icon;
            return (
              <div
                key={i}
                className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4 group"
              >
                <div className={`w-12 h-12 rounded-xl ${feature.bg} border flex items-center justify-center`}>
                  <FeatureIcon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-sm font-bold text-slate-100 group-hover:text-cyan-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="max-w-5xl mx-auto px-4 lg:px-8 pb-16">
        <div className="glass-panel rounded-2xl border border-slate-800 p-8 space-y-6">
          <h2 className="text-xl font-extrabold text-white text-center">Technology Stack</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            {[
              { name: 'React + TypeScript', desc: 'Frontend SPA' },
              { name: 'Tailwind CSS', desc: 'UI Styling' },
              { name: 'Node.js + Express', desc: 'REST API Backend' },
              { name: 'Prisma ORM', desc: 'Database Layer' },
              { name: 'React Query', desc: 'Server State' },
              { name: 'Zustand', desc: 'Client State' },
              { name: 'BullMQ + Redis', desc: 'Background Jobs' },
              { name: 'PDFKit', desc: 'Invoice Generation' },
            ].map((tech, i) => (
              <div key={i} className="bg-slate-900/60 rounded-xl p-3 space-y-1">
                <span className="text-xs font-bold text-cyan-400">{tech.name}</span>
                <span className="text-[10px] text-slate-400 block">{tech.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-4 lg:px-8 pb-16">
        <div className="bg-gradient-to-r from-cyan-500/10 to-blue-600/10 rounded-2xl border border-cyan-500/20 p-8 text-center space-y-4">
          <h2 className="text-xl font-extrabold text-white">Ready to Start Renting?</h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Browse our multi-vendor marketplace, find premium equipment, and book with zero friction.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              to="/"
              className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-cyan-500/25 flex items-center gap-2 transition-all"
            >
              Browse Rentals <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/signup/vendor"
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm border border-slate-700 transition-all"
            >
              Become a Vendor
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white text-[10px]">
              T6
            </div>
            <span className="font-bold text-slate-400">TwinSix Rentals</span>
          </div>
          <span>© 2026 TwinSix Rentals. Built with ❤️ for premium equipment rental.</span>
          <div className="flex items-center gap-4">
            <Link to="/" className="hover:text-cyan-400 transition-colors">Storefront</Link>
            <Link to="/login" className="hover:text-cyan-400 transition-colors">Log In</Link>
            <Link to="/signup/customer" className="hover:text-cyan-400 transition-colors">Sign Up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
