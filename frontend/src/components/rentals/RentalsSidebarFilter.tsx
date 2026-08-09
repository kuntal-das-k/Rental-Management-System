import React, { useState } from 'react';
import { ChevronDown, RotateCcw, Store, Tag, MapPin, Navigation, Loader2 } from 'lucide-react';
import { useLocationStore } from '../../store/useLocationStore';

export interface CategoryOption {
  id: string;
  name: string;
}

export interface VendorOption {
  id: string;
  name: string;
}

interface RentalsSidebarFilterProps {
  selectedCategories: string[];
  onCategoryChange: (categories: string[]) => void;
  selectedVendorId: string;
  onVendorChange: (vendorId: string) => void;
  selectedDuration: string;
  onDurationChange: (duration: string) => void;
  maxPrice: number;
  onMaxPriceChange: (price: number) => void;
  categoriesList?: CategoryOption[];
  vendorsList?: VendorOption[];
  onReset: () => void;
}

export const RentalsSidebarFilter: React.FC<RentalsSidebarFilterProps> = ({
  selectedCategories,
  onCategoryChange,
  selectedVendorId,
  onVendorChange,
  selectedDuration,
  onDurationChange,
  maxPrice,
  onMaxPriceChange,
  categoriesList = [],
  vendorsList = [],
  onReset,
}) => {
  const { city, pincode, isDetecting, detectGPSLocation } = useLocationStore();

  const [openCategory, setOpenCategory] = useState(true);
  const [openVendor, setOpenVendor] = useState(true);
  const [openDuration, setOpenDuration] = useState(true);
  const [openPrice, setOpenPrice] = useState(true);

  const defaultCategories = [
    { id: 'cat-cam', name: 'Cameras & Audio' },
    { id: 'cat-ev', name: 'E-Bikes & Scooters' },
    { id: 'cat-drone', name: 'Drones & Aerial Gear' },
    { id: 'cat-audio', name: 'Audio & Sound Systems' },
    { id: 'cat-tools', name: 'Tools & Construction Equipment' },
    { id: 'cat-event', name: 'Event & Party Supplies' },
    { id: 'cat-outdoor', name: 'Outdoor & Camping Gear' },
    { id: 'cat-gaming', name: 'Gaming & VR Tech' },
  ];

  const categoriesToDisplay = categoriesList.length > 0 ? categoriesList : defaultCategories;

  const toggleCategory = (catId: string) => {
    if (selectedCategories.includes(catId)) {
      onCategoryChange(selectedCategories.filter((c) => c !== catId));
    } else {
      onCategoryChange([...selectedCategories, catId]);
    }
  };

  return (
    <aside className="w-full lg:w-64 space-y-8 shrink-0">
      {/* Reset Header */}
      <div className="flex items-center justify-between pb-2 border-b border-neutral-200/80">
        <span className="text-xs font-extrabold text-neutral-900 tracking-wider uppercase">Filters</span>
        <button
          onClick={onReset}
          className="text-[11px] font-bold text-neutral-500 hover:text-black flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset All</span>
        </button>
      </div>

      {/* GPS Location Widget */}
      <div className="bg-neutral-100/90 border border-neutral-200/80 p-4 rounded-2xl space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-neutral-900 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>GPS Location</span>
          </span>
          <button
            onClick={() => detectGPSLocation()}
            disabled={isDetecting}
            className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-black text-white hover:bg-neutral-800 transition-colors flex items-center gap-1 disabled:opacity-50"
          >
            {isDetecting ? (
              <Loader2 className="w-2.5 h-2.5 animate-spin" />
            ) : (
              <Navigation className="w-2.5 h-2.5" />
            )}
            <span>Detect</span>
          </button>
        </div>
        <p className="text-xs font-bold text-neutral-800 truncate">
          📍 {city} ({pincode})
        </p>
        <span className="text-[10px] font-medium text-emerald-700 block">
          Showing items available for local delivery
        </span>
      </div>

      {/* Category Filter Group */}
      <div className="space-y-3 pb-6 border-b border-neutral-200/80">
        <button
          onClick={() => setOpenCategory(!openCategory)}
          className="w-full flex items-center justify-between text-xs font-extrabold text-neutral-900 tracking-wide uppercase text-left"
        >
          <div className="flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-neutral-500" />
            <span>Category</span>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-neutral-500 transition-transform ${openCategory ? '' : '-rotate-90'}`}
          />
        </button>

        {openCategory && (
          <div className="space-y-2 pt-1 max-h-60 overflow-y-auto pr-1">
            {categoriesToDisplay.map((cat) => {
              const isChecked = selectedCategories.includes(cat.id);
              return (
                <label
                  key={cat.id}
                  className="flex items-center gap-2.5 text-xs font-semibold text-neutral-700 hover:text-black cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleCategory(cat.id)}
                    className="w-4 h-4 rounded border-neutral-300 text-black focus:ring-black cursor-pointer accent-black"
                  />
                  <span className="truncate">{cat.name}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Vendor Filter Group */}
      {vendorsList.length > 0 && (
        <div className="space-y-3 pb-6 border-b border-neutral-200/80">
          <button
            onClick={() => setOpenVendor(!openVendor)}
            className="w-full flex items-center justify-between text-xs font-extrabold text-neutral-900 tracking-wide uppercase text-left"
          >
            <div className="flex items-center gap-1.5">
              <Store className="w-3.5 h-3.5 text-neutral-500" />
              <span>Rental Company</span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-neutral-500 transition-transform ${openVendor ? '' : '-rotate-90'}`}
            />
          </button>

          {openVendor && (
            <div className="space-y-1.5 pt-1">
              <button
                onClick={() => onVendorChange('')}
                className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedVendorId === ''
                    ? 'bg-neutral-900 text-white'
                    : 'text-neutral-700 hover:bg-neutral-200/60'
                }`}
              >
                All Vendor Stores
              </button>
              {vendorsList.map((v) => (
                <button
                  key={v.id}
                  onClick={() => onVendorChange(v.id)}
                  className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-bold transition-all truncate ${
                    selectedVendorId === v.id
                      ? 'bg-neutral-900 text-white'
                      : 'text-neutral-700 hover:bg-neutral-200/60'
                  }`}
                >
                  {v.name}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Rental Duration Filter Group */}
      <div className="space-y-3 pb-6 border-b border-neutral-200/80">
        <button
          onClick={() => setOpenDuration(!openDuration)}
          className="w-full flex items-center justify-between text-xs font-extrabold text-neutral-900 tracking-wide uppercase text-left"
        >
          <span>Rental Duration</span>
          <ChevronDown
            className={`w-4 h-4 text-neutral-500 transition-transform ${openDuration ? '' : '-rotate-90'}`}
          />
        </button>

        {openDuration && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {['Daily', 'Monthly', 'Quarterly'].map((dur) => {
              const isActive = selectedDuration === dur;
              return (
                <button
                  key={dur}
                  onClick={() => onDurationChange(dur)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-black text-white shadow-sm'
                      : 'bg-white text-neutral-700 border border-neutral-200 hover:border-neutral-400'
                  }`}
                >
                  {dur}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Price Range Filter Group */}
      <div className="space-y-3">
        <button
          onClick={() => setOpenPrice(!openPrice)}
          className="w-full flex items-center justify-between text-xs font-extrabold text-neutral-900 tracking-wide uppercase text-left"
        >
          <span>Price Range</span>
          <ChevronDown
            className={`w-4 h-4 text-neutral-500 transition-transform ${openPrice ? '' : '-rotate-90'}`}
          />
        </button>

        {openPrice && (
          <div className="space-y-3 pt-1">
            <input
              type="range"
              min={500}
              max={50000}
              step={500}
              value={maxPrice}
              onChange={(e) => onMaxPriceChange(Number(e.target.value))}
              className="w-full accent-black bg-neutral-200 h-1.5 rounded-lg cursor-pointer"
            />
            <div className="flex items-center justify-between text-xs text-neutral-500 font-bold">
              <span>₹500</span>
              <span className="text-neutral-900 font-extrabold">Max: ₹{maxPrice.toLocaleString()}+</span>
              <span>₹50,000+</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
