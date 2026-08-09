import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Clock, RotateCcw, ArrowRight } from 'lucide-react';

export const CommonQuestionsFAQ: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-16 py-12 space-y-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-2">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-neutral-900">Common Questions</h2>
          <p className="text-xs text-neutral-500 mt-1 font-medium">Everything you need to know about your stay.</p>
        </div>
        <Link
          to="/about"
          className="text-xs font-bold text-neutral-800 hover:text-black flex items-center gap-1 transition-colors"
        >
          <span>View all FAQs</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Grid Layout */}
      <div className="space-y-6">
        {/* Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Card 1: Damage Protection */}
          <div className="lg:col-span-7 bg-[#f2f2f5]/90 border border-neutral-200/80 p-7 rounded-3xl space-y-4">
            <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center shadow-sm">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-sm text-neutral-900">Damage Protection & Security Deposits</h3>
              <p className="text-xs text-neutral-500 leading-relaxed font-medium">
                We value the high standard of our properties. A standard security hold is placed on your card 24 hours prior to arrival and released within 48 hours of departure, provided the property is returned in its original state. For extended stays, comprehensive damage waivers are available during checkout for complete peace of mind.
              </p>
            </div>
          </div>

          {/* Card 2: Check-In & Returns */}
          <div className="lg:col-span-5 bg-[#f2f2f5]/90 border border-neutral-200/80 p-7 rounded-3xl space-y-4 flex flex-col justify-between">
            <div className="w-9 h-9 rounded-full bg-neutral-200/80 text-neutral-800 flex items-center justify-center">
              <Clock className="w-4 h-4 text-neutral-800" />
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-sm text-neutral-900">Check-In & Returns</h3>
              <p className="text-xs text-neutral-500 leading-relaxed font-medium">
                Standard check-in is at 3:00 PM, and departure is at 11:00 AM. Keyless entry codes are activated exactly at your check-in time.
              </p>
            </div>
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Card 3: Cancellation Policy */}
          <div className="lg:col-span-4 bg-[#f2f2f5]/90 border border-neutral-200/80 p-7 rounded-3xl space-y-4">
            <div className="w-9 h-9 rounded-full bg-neutral-200/80 text-neutral-800 flex items-center justify-center">
              <RotateCcw className="w-4 h-4 text-neutral-800" />
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-sm text-neutral-900">Cancellation Policy</h3>
              <p className="text-xs text-neutral-500 leading-relaxed font-medium">
                Full refunds are issued for cancellations made up to 14 days before arrival. A 50% refund applies to cancellations made 7 days prior.
              </p>
            </div>
          </div>

          {/* Card 4: Black Callout - Need More Assistance */}
          <div className="lg:col-span-8 bg-black text-white p-8 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white tracking-tight">Need more assistance?</h3>
              <p className="text-xs text-neutral-400 max-w-md font-medium leading-relaxed">
                Our dedicated concierge team is available 24/7 to answer any specific questions about our properties or terms.
              </p>
            </div>
            <Link
              to="/contact"
              className="bg-white text-black text-xs font-bold px-7 py-3 rounded-full hover:bg-neutral-200 transition-colors shrink-0 shadow-sm"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
