import React, { useState } from 'react';
import { ChevronDown, RotateCcw } from 'lucide-react';

interface RentalsSidebarFilterProps {
  selectedCategories: string[];
  onCategoryChange: (categories: string[]) => void;
  selectedDuration: string;
  onDurationChange: (duration: string) => void;
  maxPrice: number;
  onMaxPriceChange: (price: number) => void;
  onReset: () => void;
}

export const RentalsSidebarFilter: React.FC<RentalsSidebarFilterProps> = ({
  selectedCategories,
  onCategoryChange,
  selectedDuration,
  onDurationChange,
  maxPrice,
  onMaxPriceChange,
  onReset,
}) => {
  const [openCategory, setOpenCategory] = useState(true);
  const [openDuration, setOpenDuration] = useState(true);
  const [openPrice, setOpenPrice] = useState(true);

  const categoriesList = [
    { id: 'electronics', label: 'Electronics' },
    { id: 'furniture', label: 'Home & Furniture' },
    { id: 'photography', label: 'Photography' },
    { id: 'sports', label: 'Sports & Outdoors' },
  ];

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

      {/* Category Filter Group */}
      <div className="space-y-3 pb-6 border-b border-neutral-200/80">
        <button
          onClick={() => setOpenCategory(!openCategory)}
          className="w-full flex items-center justify-between text-xs font-extrabold text-neutral-900 tracking-wide uppercase text-left"
        >
          <span>Category</span>
          <ChevronDown
            className={`w-4 h-4 text-neutral-500 transition-transform ${openCategory ? '' : '-rotate-90'}`}
          />
        </button>

        {openCategory && (
          <div className="space-y-2.5 pt-1">
            {categoriesList.map((cat) => {
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
                  <span>{cat.label}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>

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
              max={20000}
              step={500}
              value={maxPrice}
              onChange={(e) => onMaxPriceChange(Number(e.target.value))}
              className="w-full accent-black bg-neutral-200 h-1.5 rounded-lg cursor-pointer"
            />
            <div className="flex items-center justify-between text-xs text-neutral-500 font-bold">
              <span>₹500</span>
              <span className="text-neutral-900 font-extrabold">Max: ₹{maxPrice}+</span>
              <span>₹20,000+</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
