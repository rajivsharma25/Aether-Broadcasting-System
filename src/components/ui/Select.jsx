'use client';
// Custom Select component for a premium, consistent dropdown experience.
import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';

export const Select = ({ label, icon, value, onChange, options, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value) || options[0];

  return (
    <div className={clsx("w-full space-y-1.5", className)} ref={containerRef}>
      {label && (
        <label className="text-sm font-bold text-muted-foreground ml-1 uppercase tracking-wider text-[11px]">
          {label}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={clsx(
            "flex w-full items-center justify-between rounded-xl border border-border bg-background px-4 py-2.5 text-sm transition-all focus:border-primary outline-hidden ring-primary/20 focus:ring-2",
            isOpen && "border-primary ring-2"
          )}
        >
          <div className="flex items-center space-x-3">
            {icon && <div className="text-slate-400">{icon}</div>}
            <span className="font-medium text-slate-700">{selectedOption.label}</span>
          </div>
          <ChevronDown className={clsx("h-4 w-4 text-slate-400 transition-transform duration-300", isOpen && "rotate-180")} />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-white/20 bg-white/90 p-1.5 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={clsx(
                  "flex w-full items-center px-3 py-2 text-sm font-medium transition-colors rounded-lg",
                  value === option.value 
                    ? "bg-primary text-white" 
                    : "text-slate-600 hover:bg-slate-50"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
