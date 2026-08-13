import { create } from 'zustand';

export interface FilterState {
  searchQuery: string;
  selectedCategories: string[];
  selectedVendorId: string;
  selectedDuration: string;
  minPrice: number;
  maxPrice: number;
  sortOption: string;

  setSearchQuery: (query: string) => void;
  setSelectedCategories: (cats: string[]) => void;
  toggleCategory: (catId: string) => void;
  setSelectedVendorId: (vendorId: string) => void;
  setSelectedDuration: (duration: string) => void;
  setPriceRange: (min: number, max: number) => void;
  setSortOption: (sort: string) => void;
  resetFilters: () => void;
  setAllFilters: (filters: Partial<Omit<FilterState, 'setSearchQuery' | 'setSelectedCategories' | 'toggleCategory' | 'setSelectedVendorId' | 'setSelectedDuration' | 'setPriceRange' | 'setSortOption' | 'resetFilters' | 'setAllFilters'>>) => void;
}

const DEFAULT_FILTERS = {
  searchQuery: '',
  selectedCategories: [],
  selectedVendorId: '',
  selectedDuration: 'Daily',
  minPrice: 0,
  maxPrice: 50000,
  sortOption: 'Recommended',
};

export const useFilterStore = create<FilterState>((set) => ({
  ...DEFAULT_FILTERS,

  setSearchQuery: (query: string) => set({ searchQuery: query }),

  setSelectedCategories: (cats: string[]) => set({ selectedCategories: cats }),

  toggleCategory: (catId: string) =>
    set((state) => ({
      selectedCategories: state.selectedCategories.includes(catId)
        ? state.selectedCategories.filter((id) => id !== catId)
        : [...state.selectedCategories, catId],
    })),

  setSelectedVendorId: (vendorId: string) => set({ selectedVendorId: vendorId }),

  setSelectedDuration: (duration: string) => set({ selectedDuration: duration }),

  setPriceRange: (min: number, max: number) => set({ minPrice: min, maxPrice: max }),

  setSortOption: (sort: string) => set({ sortOption: sort }),

  resetFilters: () => set(DEFAULT_FILTERS),

  setAllFilters: (filters) => set((state) => ({ ...state, ...filters })),
}));
