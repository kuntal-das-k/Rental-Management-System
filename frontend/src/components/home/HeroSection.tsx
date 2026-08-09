import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, ArrowRight, ChevronDown, Clock, X } from 'lucide-react';

interface HeroSectionProps {
  onSearchSubmit?: (query: string, duration?: string, startDate?: string, endDate?: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSearchSubmit }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [duration, setDuration] = useState('Monthly');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const datePickerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close date picker popover on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setShowDatePicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearchSubmit) {
      onSearchSubmit(searchQuery, duration, startDate, endDate);
    } else {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.set('search', searchQuery.trim());
      if (duration) params.set('duration', duration);
      if (startDate) params.set('startDate', startDate);
      if (endDate) params.set('endDate', endDate);

      navigate(`/rentals?${params.toString()}`);
    }
  };

  return (
    <section className="relative pt-12 sm:pt-16 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-16 text-center max-w-6xl mx-auto space-y-6 sm:space-y-8">
      {/* Top Status Pill */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-100/90 border border-neutral-200/80 shadow-xs text-neutral-600 text-[11px] font-bold uppercase tracking-wider">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>NOW RENTING ELECTRONICS & FURNITURE</span>
      </div>

      {/* Main Headline */}
      <div className="space-y-3">
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-neutral-900 tracking-tight leading-[1.12]">
          Experience More. Own Less. <br />
          <span className="text-neutral-800 font-extrabold">Curated rentals for modern living.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-neutral-500 text-xs sm:text-sm md:text-base max-w-2xl mx-auto font-normal leading-relaxed">
          From high-end cameras to premium designer sofas, Twin6Rental provides access to the best products without the commitment of ownership.
        </p>
      </div>

      {/* Search Bar Widget */}
      <div className="relative max-w-2xl mx-auto">
        <form
          onSubmit={handleSearch}
          className="bg-white rounded-full p-2 pl-5 sm:pl-6 shadow-xl border border-neutral-200/80 flex items-center justify-between gap-2 sm:gap-3 transition-all hover:shadow-2xl focus-within:ring-2 focus-within:ring-slate-900"
        >
          {/* Search Input Field */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Search className="w-4 h-4 text-neutral-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for anything to rent..."
              className="w-full text-xs sm:text-sm text-neutral-800 placeholder-neutral-400 bg-transparent focus:outline-none font-medium"
            />
          </div>

          {/* Divider */}
          <div className="h-6 w-[1px] bg-neutral-200 shrink-0" />

          {/* Duration & Calendar Button */}
          <div className="relative shrink-0" ref={datePickerRef}>
            <button
              type="button"
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-neutral-100 text-xs font-semibold text-neutral-800 transition-colors cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-neutral-500 shrink-0" />
              <span className="truncate max-w-[90px] sm:max-w-none">
                {startDate && endDate ? `${startDate} to ${endDate}` : duration}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 transition-transform duration-200 ${showDatePicker ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Popover */}
            {showDatePicker && (
              <div className="absolute right-0 top-12 mt-2 w-72 sm:w-80 bg-white rounded-2xl p-4 shadow-2xl border border-neutral-200/90 z-50 text-left space-y-4 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-neutral-900">
                    <Clock className="w-3.5 h-3.5 text-neutral-500" />
                    <span>Select Rental Period</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowDatePicker(false)}
                    className="text-neutral-400 hover:text-neutral-900 p-1 rounded-full hover:bg-neutral-100"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Duration Pills */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block">
                    Billing Cycle
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {['Daily', 'Weekly', 'Monthly'].map((cycle) => (
                      <button
                        key={cycle}
                        type="button"
                        onClick={() => {
                          setDuration(cycle);
                        }}
                        className={`py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          duration === cycle
                            ? 'bg-slate-900 text-white shadow-2xs'
                            : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                        }`}
                      >
                        {cycle}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date Inputs */}
                <div className="space-y-2 pt-1 border-t border-neutral-100">
                  <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block">
                    Rental Dates (Optional)
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-neutral-400 block font-semibold mb-1">Start Date</span>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-2.5 py-1.5 text-[11px] font-semibold text-neutral-800 focus:outline-none focus:border-slate-900"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-400 block font-semibold mb-1">End Date</span>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-2.5 py-1.5 text-[11px] font-semibold text-neutral-800 focus:outline-none focus:border-slate-900"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  {(startDate || endDate) && (
                    <button
                      type="button"
                      onClick={() => {
                        setStartDate('');
                        setEndDate('');
                      }}
                      className="text-[11px] font-bold text-rose-600 hover:underline cursor-pointer"
                    >
                      Clear Dates
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowDatePicker(false)}
                    className="ml-auto px-3.5 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 cursor-pointer"
                  >
                    Apply Selection
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Submit Arrow Button */}
          <button
            type="submit"
            aria-label="Search"
            className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-neutral-800 transition-all shrink-0 shadow-md group cursor-pointer"
          >
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </form>
      </div>
    </section>
  );
};

export default HeroSection;
