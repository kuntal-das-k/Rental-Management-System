import React from 'react';
import { Link } from 'react-router-dom';

export const HowItWorksHero: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-16 pt-12 pb-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Text Area */}
        <div className="lg:col-span-6 space-y-6">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-neutral-900 tracking-tight leading-[1.12]">
            Effortless rentals, <br />
            exceptional living.
          </h1>

          <p className="text-neutral-500 text-sm sm:text-base max-w-xl font-normal leading-relaxed">
            We've streamlined the process so you can focus on the experience. Discover how easy it is to secure your next temporary residence.
          </p>

          <div className="pt-2">
            <Link
              to="/rentals"
              className="inline-block bg-black text-white px-8 py-3.5 rounded-full font-bold text-xs hover:bg-neutral-800 transition-all shadow-md"
            >
              Start Exploring
            </Link>
          </div>
        </div>

        {/* Right Architectural Image Card */}
        <div className="lg:col-span-6">
          <div className="relative rounded-[32px] overflow-hidden shadow-2xl border border-neutral-200/60 bg-white p-2.5">
            <div className="rounded-[26px] overflow-hidden h-[360px] sm:h-[420px] bg-neutral-100">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
                alt="Effortless rentals architecture"
                className="w-full h-full object-cover brightness-[0.95] hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
