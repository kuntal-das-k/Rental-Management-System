import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface RentalsPaginationProps {
  currentPage: number;
  totalPages?: number;
  onPageChange: (page: number) => void;
}

export const RentalsPagination: React.FC<RentalsPaginationProps> = ({
  currentPage = 1,
  totalPages = 3,
  onPageChange,
}) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2 pt-12 pb-6">
      {/* Previous Page */}
      <button
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-500 hover:text-black disabled:opacity-30 disabled:hover:text-neutral-500 transition-colors"
        aria-label="Previous Page"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Numeric Page Buttons */}
      {pages.map((p) => {
        const isActive = p === currentPage;
        return (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
              isActive
                ? 'bg-black text-white shadow-sm'
                : 'text-neutral-600 hover:bg-neutral-200/70 hover:text-black'
            }`}
          >
            {p}
          </button>
        );
      })}

      {/* Ellipsis indicator if more pages */}
      {totalPages > 3 && <span className="text-neutral-400 text-xs font-bold px-1">...</span>}

      {/* Next Page */}
      <button
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-500 hover:text-black disabled:opacity-30 disabled:hover:text-neutral-500 transition-colors"
        aria-label="Next Page"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};
