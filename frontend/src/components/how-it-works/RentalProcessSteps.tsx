import React from 'react';
import { Search, Calendar, CreditCard, Key } from 'lucide-react';

export const RentalProcessSteps: React.FC = () => {
  const steps = [
    {
      step: '1',
      title: '1. Find Your Item',
      desc: 'Browse our curated selection of premium properties using advanced filters to match your exact lifestyle requirements.',
      icon: Search,
    },
    {
      step: '2',
      title: '2. Choose Duration',
      desc: "Select your desired dates. Whether it's a weekend retreat or a season-long stay, our availability is real-time and flexible.",
      icon: Calendar,
    },
    {
      step: '3',
      title: '3. Quick Checkout',
      desc: 'Complete your reservation securely in minutes. Transparent pricing means no hidden fees or unexpected costs.',
      icon: CreditCard,
    },
    {
      step: '4',
      title: '4. Enjoy & Return',
      desc: 'Arrive at a pristine property. When your time concludes, simply lock up—we handle the cleaning and turnaround.',
      icon: Key,
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-16 py-16">
      {/* Section Header */}
      <div className="text-center space-y-1 mb-12">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900">The Rental Process</h2>
        <p className="text-xs text-neutral-500 font-medium">Four simple steps to your curated experience.</p>
      </div>

      {/* Timeline Grid */}
      <div className="relative">
        {/* Horizontal Connecting Line (Desktop) */}
        <div className="hidden md:block absolute top-[28px] left-[10%] right-[10%] h-[1.5px] bg-neutral-200/90 z-0" />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
          {steps.map((s, idx) => {
            const StepIcon = s.icon;
            return (
              <div key={idx} className="flex flex-col items-center text-center space-y-3">
                {/* Circle Icon Container */}
                <div className="w-14 h-14 rounded-full bg-neutral-100 border border-neutral-200/80 flex items-center justify-center text-neutral-800 shadow-sm hover:scale-105 hover:border-black transition-all">
                  <StepIcon className="w-5 h-5 text-neutral-800 stroke-[1.8]" />
                </div>

                {/* Title & Description */}
                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-neutral-900">{s.title}</h3>
                  <p className="text-[11px] text-neutral-400 leading-relaxed font-medium max-w-[240px]">
                    {s.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
