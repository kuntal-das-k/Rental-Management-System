import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface RentalsPaginationProps {
  currentPage: number;
  totalPages?: number;
  onPageChange: (page: number) => void;
}

export const RentalsPagination: React.FC<RentalsPaginationProps> = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  // Generate pagination items window (e.g. 1 2 3 4 5 ... 25)
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, start + maxVisible - 1);

      if (end === totalPages) {
        start = Math.max(1, end - maxVisible + 1);
      }

      if (start > 1) {
        pages.push(1);
        if (start > 2) pages.push('...');
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages) {
        if (end < totalPages - 1) pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageItems = getPageNumbers();

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
      {pageItems.map((p, idx) => {
        if (typeof p === 'string') {
          return (
            <span key={`ellipsis-${idx}`} className="text-neutral-400 text-xs font-bold px-1 select-none">
              ...
            </span>
          );
        }

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

