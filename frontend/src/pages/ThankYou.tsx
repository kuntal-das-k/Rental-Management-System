import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { NavbarHeader } from '../components/home/NavbarHeader';
import {
  CheckCircle2,
  Download,
  ShieldCheck,
  FileSpreadsheet,
  ArrowRight,
  ShoppingBag,
  PackageCheck,
  Sparkles,
  HelpCircle,
} from 'lucide-react';

export const ThankYou: React.FC = () => {
  const location = useLocation();
  const state = location.state || {};
  const order = state.order;
  const invoice = state.invoice;
  const totalPaid = state.totalPaid || 0;

  const pdfUrl = invoice?.pdf_url ? `http://localhost:5000${invoice.pdf_url}` : null;

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 flex flex-col font-sans selection:bg-slate-900 selection:text-white">
      {/* Navigation Header */}
      <NavbarHeader />

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 pt-16 pb-20 space-y-12 sm:space-y-16">
        {/* Success Hero Banner */}
        <section className="text-center max-w-2xl mx-auto space-y-4">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm border border-emerald-200/60">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          
          <div className="inline-flex items-center space-x-2 bg-emerald-100/60 border border-emerald-200/80 px-3 py-1 rounded-full text-[11px] font-semibold text-emerald-800">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Booking Confirmed</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-slate-900">
            Rental Reserved Successfully.
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto leading-relaxed font-normal">
            Thank you for choosing Twin6Rental. Your reservation payment of{' '}
            <strong className="text-slate-900 font-semibold">
              ${totalPaid > 0 ? totalPaid.toFixed(2) : '0.00'}
            </strong>{' '}
            has been processed and verified.
          </p>
        </section>

        {/* Main Grid: Order Details & Next Steps */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Order Summary Card */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white border border-slate-200/80 rounded-2xl sm:rounded-3xl p-8 sm:p-10 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 tracking-tight">
                    Reservation Receipt
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Official booking confirmation summary
                  </p>
                </div>
                <span className="bg-slate-100 text-slate-700 text-[11px] font-semibold px-3 py-1 rounded-full border border-slate-200">
                  Paid & Reserved
                </span>
              </div>

              {/* Order Attributes */}
              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Order Reference ID</span>
                  <span className="text-slate-900 font-mono font-semibold">
                    #{order?.id?.slice(0, 8) || 'T6-ORD-8823'}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Invoice Number</span>
                  <span className="text-slate-900 font-mono font-semibold">
                    {invoice?.invoice_number || 'INV/2026/00001'}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Amount Paid</span>
                  <span className="text-slate-900 font-semibold text-sm">
                    ${totalPaid > 0 ? totalPaid.toFixed(2) : '0.00'}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2">
                  <span className="text-slate-500 font-medium">Security Deposit</span>
                  <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Held & Fully Refundable
                  </span>
                </div>
              </div>

              {/* Download Invoice Button */}
              <div className="pt-2">
                {pdfUrl ? (
                  <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-slate-950 hover:bg-slate-800 text-white font-semibold text-xs py-3.5 rounded-full transition-all shadow-sm flex items-center justify-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Official PDF Invoice</span>
                  </a>
                ) : (
                  <button
                    onClick={() => alert('Official PDF invoice copy generated.')}
                    className="w-full bg-slate-950 hover:bg-slate-800 text-white font-semibold text-xs py-3.5 rounded-full transition-all shadow-sm flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>Download Official Invoice</span>
                  </button>
                )}
              </div>
            </div>

            {/* Link to Orders */}
            <div className="flex flex-col sm:flex-row items-center justify-between bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-900 flex items-center justify-center shrink-0">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-slate-900 block text-xs">Track Your Order</span>
                  <p className="text-[11px] text-slate-500">View status updates and rental history in your portal.</p>
                </div>
              </div>
              <Link
                to="/customer/orders"
                className="text-xs font-semibold text-slate-900 hover:text-slate-600 transition-colors flex items-center gap-1 shrink-0"
              >
                <span>My Orders</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Column: Next Steps Guide */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#F4F4F6] rounded-2xl sm:rounded-3xl p-8 space-y-6">
              <h2 className="text-lg font-semibold text-slate-900 tracking-tight">
                What Happens Next?
              </h2>

              <div className="space-y-5 text-xs">
                <div className="flex items-start space-x-3.5">
                  <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-slate-900 shadow-sm shrink-0 font-semibold text-[11px] mt-0.5">
                    1
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900 block text-xs">Concierge Review</span>
                    <p className="text-slate-600 leading-relaxed mt-0.5">
                      Our white-glove concierge verifies equipment specifications and schedules fulfillment.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-slate-900 shadow-sm shrink-0 font-semibold text-[11px] mt-0.5">
                    2
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900 block text-xs">Preparation & Dispatch</span>
                    <p className="text-slate-600 leading-relaxed mt-0.5">
                      The rental asset undergoes inspection, sanitization, and packaging before dispatch.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-slate-900 shadow-sm shrink-0 font-semibold text-[11px] mt-0.5">
                    3
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900 block text-xs">Seamless Return</span>
                    <p className="text-slate-600 leading-relaxed mt-0.5">
                      At the end of your rental period, enjoy prepaid hassle-free return pickup.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Assistance Card */}
            <div className="bg-[#F4F4F6] rounded-2xl sm:rounded-3xl p-6 flex items-center justify-between">
              <div className="flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-2xl bg-slate-950 text-white flex items-center justify-center shrink-0">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div className="space-y-0.5 text-xs">
                  <span className="font-semibold text-slate-900 block">Need Modification?</span>
                  <p className="text-slate-500">Contact our 24/7 concierge desk.</p>
                </div>
              </div>
              <Link
                to="/contact"
                className="text-xs font-semibold text-slate-900 border-b border-slate-900 pb-0.5 hover:opacity-75 transition-opacity shrink-0"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>

        {/* Back to Marketplace Storefront */}
        <section className="text-center pt-4">
          <Link
            to="/rentals"
            className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-700 hover:text-slate-950 transition-colors"
          >
            <span>Explore More Marketplace Rentals</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </section>
      </main>

      {/* Navigation Footer */}
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
                  <Link to="/contact" className="hover:text-slate-900 transition-colors">
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

export default ThankYou;
