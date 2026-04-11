'use client';

import { ChevronDown, Check } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface SortOption {
  value: string;
  label: string;
}

interface SortDropdownProps {
  sortOptions: SortOption[];
  currentSort: string;
  onSortChange: (value: string) => void;
}

export default function SortDropdown({ sortOptions, currentSort, onSortChange }: SortDropdownProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentOption = sortOptions.find((o) => o.value === currentSort) ?? sortOptions[0];

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    if (open) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open]);

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
        <span>Sort by</span>
      </div>

      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-800 hover:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700 transition-colors min-w-[200px] justify-between"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{currentOption?.label ?? 'Select sort'}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label="Sort options"
          className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden"
        >
          {sortOptions.map((option) => {
            const isSelected = option.value === currentSort;
            return (
              <li
                key={option.value}
                role="option"
                aria-selected={isSelected}
                className={`flex items-center justify-between px-4 py-3 cursor-pointer text-sm transition-colors ${
                  isSelected
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => {
                  onSortChange(option.value);
                  setOpen(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSortChange(option.value);
                    setOpen(false);
                  }
                }}
                tabIndex={0}
              >
                {option.label}
                {isSelected && <Check className="w-4 h-4 text-blue-700 flex-shrink-0" />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
