'use client';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';

export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center space-x-2 py-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="rounded-lg border border-border p-2 hover:bg-accent disabled:opacity-50 transition-colors"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={clsx(
            'h-10 w-10 rounded-lg border text-sm font-medium transition-colors',
            currentPage === page
              ? 'bg-primary border-primary text-white'
              : 'border-border hover:bg-accent'
          )}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="rounded-lg border border-border p-2 hover:bg-accent disabled:opacity-50 transition-colors"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
};
