import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { CheckCircle2, Download, Printer, ArrowRight, ShieldCheck, FileSpreadsheet } from 'lucide-react';

export const ThankYou: React.FC = () => {
  const location = useLocation();
  const state = location.state || {};
  const order = state.order;
  const invoice = state.invoice;
  const totalPaid = state.totalPaid || 0;

  const pdfUrl = invoice?.pdf_url ? `http://localhost:5000${invoice.pdf_url}` : null;

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 py-12 flex-1 w-full flex flex-col items-center justify-center">
        <div className="glass-panel rounded-3xl p-8 lg:p-10 border border-slate-800 w-full text-center space-y-6 shadow-2xl animate-in fade-in zoom-in-95">
          {/* Success Check Icon */}
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Rental Reserved Successfully!</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Your payment of <strong className="text-emerald-400">${totalPaid.toFixed(2)}</strong> has been confirmed via mock gateway.
            </p>
          </div>

          {/* Invoice Summary Box */}
          <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 text-left space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 font-bold">
              <span className="text-slate-400">Order ID</span>
              <span className="text-cyan-400 font-mono">#{order?.id?.slice(0, 8) || 'T6-ORD-8823'}</span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-800 pb-3 font-bold">
              <span className="text-slate-400">Invoice Number</span>
              <span className="text-white font-mono">{invoice?.invoice_number || 'INV/2026/00001'}</span>
            </div>

            <div className="flex items-center justify-between font-bold">
              <span className="text-slate-400">Security Deposit Status</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" />
                Held & Fully Refundable
              </span>
            </div>
          </div>

          {/* Download PDF Invoice Action */}
          {pdfUrl ? (
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs shadow-xl shadow-cyan-500/25 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download Official PDF Invoice</span>
            </a>
          ) : (
            <button
              onClick={() => alert('Invoice PDF generated.')}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-cyan-500 text-slate-950 font-extrabold text-xs"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Invoice Generated</span>
            </button>
          )}

          <div className="pt-4 border-t border-slate-800 flex justify-center">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-cyan-400 transition-colors"
            >
              <span>Return to Marketplace Storefront</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};
