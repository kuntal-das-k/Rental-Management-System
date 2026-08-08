import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  onSearchSubmit?: (query: string, duration?: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSearchSubmit }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [duration, setDuration] = useState('Daily');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearchSubmit) {
      onSearchSubmit(searchQuery, duration);
    } else {
      navigate(`/rentals?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <section className="relative pt-16 pb-20 px-6 lg:px-16 text-center max-w-6xl mx-auto space-y-8">
      {/* Top Status Pill */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-100/90 border border-neutral-200/80 shadow-sm text-neutral-600 text-[11px] font-bold uppercase tracking-wider">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>NOW RENTING ELECTRONICS & FURNITURE</span>
      </div>

      {/* Main Headline */}
      <div className="space-y-3">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-neutral-900 tracking-tight leading-[1.12]">
          Experience More. Own Less. <br />
          <span className="text-neutral-800 font-extrabold">Curated rentals for modern living.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-neutral-500 text-sm sm:text-base max-w-2xl mx-auto font-normal leading-relaxed">
          From high-end cameras to premium designer sofas, Twin6Rental provides access to the best products without the commitment of ownership.
        </p>
      </div>

      {/* Search Bar Widget */}
      <form
        onSubmit={handleSearch}
        className="bg-white rounded-full p-2 pl-6 shadow-xl border border-neutral-200/80 max-w-2xl mx-auto flex items-center justify-between gap-3 transition-all hover:shadow-2xl"
      >
        {/* Search Input Field */}
        <div className="flex items-center gap-3 flex-1">
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
        <div className="h-6 w-[1px] bg-neutral-200 hidden sm:block" />

        {/* Duration Dropdown Picker */}
        <div className="hidden sm:flex items-center gap-2 shrink-0 pr-2">
          <Calendar className="w-4 h-4 text-neutral-400" />
          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="text-xs font-semibold text-neutral-700 bg-transparent focus:outline-none cursor-pointer pr-2"
          >
            <option value="Daily">Duration</option>
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
          </select>
        </div>

        {/* Submit Arrow Button */}
        <button
          type="submit"
          aria-label="Search"
          className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-neutral-800 transition-all shrink-0 shadow-md group"
        >
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </form>
    </section>
  );
};
