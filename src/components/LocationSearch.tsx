'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export interface LocationResult {
  name: string;
  lat: number;
  lng: number;
  district: string | null;
}

interface Suggestion {
  mapboxId: string;
  label: string;
  sublabel: string;
}

interface LocationSearchProps {
  onSelect: (location: LocationResult) => void;
  initialValue?: string;
}

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

// Generate a session token for Mapbox Search Box API billing
function generateSessionToken(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

let sessionToken = generateSessionToken();

async function suggestLocations(query: string): Promise<Suggestion[]> {
  if (query.length < 2 || !MAPBOX_TOKEN) return [];

  const params = new URLSearchParams({
    q: query,
    access_token: MAPBOX_TOKEN,
    session_token: sessionToken,
    proximity: '-0.13,51.51', // London center
    country: 'gb',
    limit: '6',
    language: 'en',
    types: 'poi,address,postcode,place,street',
  });

  const res = await fetch(
    `https://api.mapbox.com/search/searchbox/v1/suggest?${params}`
  );
  if (!res.ok) return [];

  const data = await res.json();
  return (data.suggestions || []).map((s: {
    mapbox_id: string;
    name: string;
    place_formatted?: string;
    full_address?: string;
  }) => ({
    mapboxId: s.mapbox_id,
    label: s.name,
    sublabel: s.place_formatted || s.full_address || '',
  }));
}

async function retrieveLocation(mapboxId: string): Promise<LocationResult | null> {
  if (!MAPBOX_TOKEN) return null;

  const params = new URLSearchParams({
    access_token: MAPBOX_TOKEN,
    session_token: sessionToken,
  });

  const res = await fetch(
    `https://api.mapbox.com/search/searchbox/v1/retrieve/${mapboxId}?${params}`
  );
  if (!res.ok) return null;

  const data = await res.json();
  const feature = data.features?.[0];
  if (!feature) return null;

  const props = feature.properties;
  const [lng, lat] = feature.geometry.coordinates;
  const district = props.context?.place?.name || props.context?.locality?.name || null;

  // Rotate session token after a retrieve (Mapbox billing best practice)
  sessionToken = generateSessionToken();

  return {
    name: props.name || props.full_address,
    lat,
    lng,
    district,
  };
}

export default function LocationSearch({ onSelect, initialValue = '' }: LocationSearchProps) {
  const [query, setQuery] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const debounceRef = useRef<NodeJS.Timeout>(undefined);

  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  const fetchSuggestions = useCallback(async (value: string) => {
    if (value.length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }
    const results = await suggestLocations(value);
    setSuggestions(results);
    setIsOpen(results.length > 0);
    setSelectedIndex(-1);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(value), 250);
  };

  const handleSelect = async (suggestion: Suggestion) => {
    setQuery(suggestion.label);
    setIsOpen(false);
    const location = await retrieveLocation(suggestion.mapboxId);
    if (location) {
      onSelect(location);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' && query.length >= 2) {
        suggestLocations(query).then((results) => {
          if (results.length > 0) handleSelect(results[0]);
        });
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
      } else if (suggestions.length > 0) {
        handleSelect(suggestions[0]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <label
        className="block text-xs uppercase tracking-wider mb-1.5 font-medium"
        style={{ color: 'var(--text-tertiary)' }}
      >
        Search Location
      </label>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          placeholder="e.g. Norbiton Station, SW1A 1AA"
          className="w-full rounded-lg px-3 py-2.5 text-sm transition-colors focus:outline-none"
          style={{
            background: 'var(--input-bg)',
            border: '1px solid var(--input-border)',
            color: 'var(--text-primary)',
          }}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <svg className="w-4 h-4" style={{ color: 'var(--text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {isOpen && suggestions.length > 0 && (
        <div
          className="absolute z-50 w-full mt-1 rounded-lg overflow-hidden shadow-xl"
          style={{
            background: 'var(--dropdown-bg)',
            border: '1px solid var(--input-border)',
          }}
        >
          {suggestions.map((s, i) => (
            <button
              key={s.mapboxId}
              onMouseDown={() => handleSelect(s)}
              className="w-full text-left px-3 py-2 transition-colors"
              style={{
                background: i === selectedIndex ? 'var(--accent-bg)' : undefined,
              }}
              onMouseEnter={(e) => {
                if (i !== selectedIndex) e.currentTarget.style.background = 'var(--hover-bg)';
              }}
              onMouseLeave={(e) => {
                if (i !== selectedIndex) e.currentTarget.style.background = '';
              }}
            >
              <div
                className="text-sm"
                style={{ color: i === selectedIndex ? 'var(--accent)' : 'var(--text-secondary)' }}
              >
                {s.label}
              </div>
              <div className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                {s.sublabel}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
