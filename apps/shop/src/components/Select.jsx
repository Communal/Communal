'use client';

import React, { useState, useRef, useEffect, forwardRef } from 'react';
import { cn } from '../utils/cn';
import { ChevronDownIcon } from 'lucide-react';

export const Select = forwardRef(({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  error,
  className,
  label,
}, ref) => {
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const containerRef = useRef(null);
  const triggerRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;
    function handleKey(e) {
      if (e.key === 'ArrowDown') {
        setHighlighted(h => (h + 1) % options.length);
      } else if (e.key === 'ArrowUp') {
        setHighlighted(h => (h - 1 + options.length) % options.length);
      } else if (e.key === 'Enter' && highlighted >= 0) {
        onChange?.(options[highlighted].value);
        setOpen(false);
      } else if (e.key === 'Escape') {
        setOpen(false);
      }
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, highlighted, options, onChange]);

  // Set highlighted to selected value when opening
  useEffect(() => {
    if (open && value !== undefined) {
      const idx = options.findIndex(o => o.value === value);
      setHighlighted(idx);
    } else if (open) {
      setHighlighted(-1);
    }
  }, [open, value, options]);

  const selected = options.find(o => o.value === value);

  return (
    <div ref={containerRef} className={cn('relative w-full', className)}>
      {label && (
        <label className="block font-bold mb-1 text-neutral-400">
          {label}
        </label>
      )}
      <button
        ref={triggerRef}
        type="button"
        className={cn(
          'bg-foreground w-full px-3 py-3 text-left flex items-center justify-between cursor-pointer',
          error && 'control-field-error',
          'border border-neutral-300 rounded-md',
          'focus:outline-none focus:ring-2 focus:ring-primary'
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen(o => !o)}
      >
        <span className={cn(!selected && 'text-gray-400', 'text-white')}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDownIcon className="ml-2 w-4 h-4 text-background" />
      </button>
      {open && (
        <ul
          className="absolute z-10 mt-1 w-full bg-foreground border border-neutral-200 rounded-md shadow-lg max-h-60 overflow-auto"
          role="listbox"
          tabIndex={-1}
        >
          {options.length === 0 && (
            <li className="px-4 py-2 text-gray-400">No options</li>
          )}
          {options.map((opt, i) => (
            <li
              key={opt.value}
              role="option"
              aria-selected={value === opt.value}
              className={cn(
                'px-4 py-3 cursor-pointer text-background',
                value === opt.value && 'bg-primary text-white',
                highlighted === i && value !== opt.value && 'bg-gray-100',
                i !== 0 && 'border-t-2 border-white/20',
                i !== 0 && 'mt-1'
              )}
              onMouseEnter={() => setHighlighted(i)}
              onMouseDown={(e) => {
                e.preventDefault();
                onChange?.(opt.value);
                setOpen(false);
              }}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
      {error && (
        <div className="text-red-500 text-xs mt-1">
          {Array.isArray(error) ? error.join(', ') : error}
        </div>
      )}
    </div>
  );
});

Select.displayName = 'Select';
