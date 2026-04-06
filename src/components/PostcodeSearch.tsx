'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { autocompletePostcode } from '@/lib/postcodes';

interface PostcodeSearchProps {
  onSelect: (postcode: string) => void;
  initialValue?: string;
}

export default function PostcodeSearch({ onSelect, initialValue = '' }: PostcodeSearchProps) {
  const [query, setQuery] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const debounceRef = useRef<NodeJS.Timeout>();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  const fetchSuggestions = useCallback(async (value: string) => {
    if (value.length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }
    const results = await autocompletePostcode(value);
    setSuggestions(results);
    setIsOpen(results.length > 0);
    setSelectedIndex(-1);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(value), 200);
  };

  const handleSelect = (postcode: string) => {
    setQuery(postcode);
    setIsOpen(false);
    onSelect(postcode);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' && query.length >= 3) {
        onSelect(query);
      }
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0) {
        handleSelect(suggestions[selectedIndex]);
      } else if (query.length >= 3) {
        onSelect(query);
        setIsOpen(false);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <label className="block text-xs text-white/40 uppercase tracking-wider mb-1.5 font-medium">
        Postcode
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          placeholder="e.g. SW1A 1AA"
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white
                     font-mono text-sm placeholder:text-white/20 focus:outline-none focus:border-[#00d4ff]/50
                     focus:ring-1 focus:ring-[#00d4ff]/25 transition-colors"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <svg className="w-4 h-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {isOpen && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-[#0f1119] border border-white/10 rounded-lg overflow-hidden shadow-xl">
          {suggestions.map((pc, i) => (
            <button
              key={pc}
              onMouseDown={() => handleSelect(pc)}
              className={`w-full text-left px-3 py-2 text-sm font-mono transition-colors
                ${i === selectedIndex ? 'bg-[#00d4ff]/10 text-[#00d4ff]' : 'text-white/70 hover:bg-white/5'}`}
            >
              {pc}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
