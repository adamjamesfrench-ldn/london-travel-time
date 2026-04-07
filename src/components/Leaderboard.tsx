'use client';

import { useState, useMemo } from 'react';
import { TRANSPORT_MODES, type TransportMode } from '@/lib/constants';
import { classifyZone, type Zone } from '@/lib/zones';

interface CoveragePoint {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: string;
  zone?: string;
  coverage: Record<string, number>;
}

interface CoverageData {
  generatedAt: string;
  travelTimeMinutes: number;
  totalPoints: number;
  points: CoveragePoint[];
  leaderboards: Record<string, string[]>;
}

interface LeaderboardProps {
  onSelectLocation: (lat: number, lng: number, name: string) => void;
}

let coverageData: CoverageData | null = null;
try {
  coverageData = require('@/data/coverage-results.json');
} catch {
  // File not generated yet
}

const MODE_KEYS: { key: string; mode: TransportMode }[] = [
  { key: 'transit', mode: 'transit' },
  { key: 'walking', mode: 'walking' },
  { key: 'cycling', mode: 'cycling' },
  { key: 'driving', mode: 'driving' },
  { key: 'multimodal', mode: 'multimodal' },
];

type ZoneFilter = 'all' | Zone;

const ZONE_FILTERS: { value: ZoneFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'central', label: 'Central' },
  { value: 'inner', label: 'Inner' },
  { value: 'mid', label: 'Mid' },
  { value: 'outer', label: 'Outer' },
];

export default function Leaderboard({ onSelectLocation }: LeaderboardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMode, setSelectedMode] = useState<string>('transit');
  const [zoneFilter, setZoneFilter] = useState<ZoneFilter>('all');
  const [showZoneInfo, setShowZoneInfo] = useState(false);

  // Compute sorted leaderboard filtered by zone
  const { entries, filteredCount } = useMemo(() => {
    if (!coverageData) return { entries: [], filteredCount: 0 };

    let points = coverageData.points.filter(
      (p) => p.coverage[selectedMode] !== undefined && p.coverage[selectedMode] > 0
    );

    if (zoneFilter !== 'all') {
      points = points.filter((p) => {
        const zone = p.zone || classifyZone(p.lat, p.lng);
        return zone === zoneFilter;
      });
    }

    points.sort((a, b) => (b.coverage[selectedMode] || 0) - (a.coverage[selectedMode] || 0));

    return { entries: points.slice(0, 10), filteredCount: points.length };
  }, [selectedMode, zoneFilter]);

  if (!coverageData) return null;

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-xs uppercase tracking-wider font-medium transition-colors"
        style={{ color: 'var(--text-tertiary)' }}
      >
        <span>Coverage Leaderboard</span>
        <svg
          className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="mt-2 space-y-2">
          {/* Mode tabs */}
          <div className="flex flex-wrap gap-1">
            {MODE_KEYS.map(({ key, mode }) => {
              const config = TRANSPORT_MODES[mode];
              const active = selectedMode === key;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedMode(key)}
                  className="px-2 py-1 rounded text-xs transition-colors"
                  style={
                    active
                      ? {
                          backgroundColor: `${config.color}20`,
                          color: config.color,
                          border: `1px solid ${config.color}40`,
                        }
                      : {
                          background: 'var(--input-bg)',
                          color: 'var(--text-muted)',
                          border: '1px solid transparent',
                        }
                  }
                >
                  {config.label}
                </button>
              );
            })}
          </div>

          {/* Zone filter */}
          <div>
            <div className="flex items-center gap-1 flex-wrap">
              <button
                onClick={() => setShowZoneInfo(!showZoneInfo)}
                className="text-[10px] transition-colors flex items-center gap-0.5"
                style={{ color: 'var(--text-muted)' }}
              >
                Zone
                <svg
                  className={`w-3 h-3 transition-transform ${showZoneInfo ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {ZONE_FILTERS.map((z) => (
                <button
                  key={z.value}
                  onClick={() => setZoneFilter(z.value)}
                  className="px-1.5 py-0.5 rounded text-[10px] transition-colors"
                  style={
                    zoneFilter === z.value
                      ? {
                          background: 'var(--accent-bg)',
                          color: 'var(--accent)',
                          border: '1px solid var(--accent-border)',
                        }
                      : {
                          color: 'var(--text-muted)',
                          border: '1px solid transparent',
                        }
                  }
                >
                  {z.label}
                </button>
              ))}
            </div>
            {showZoneInfo && (
              <div
                className="mt-1.5 p-2 rounded-lg space-y-1"
                style={{ background: 'var(--info-bg)', border: '1px solid var(--info-border)' }}
              >
                <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
                  Zones are based on distance from central London (Charing Cross):
                </p>
                <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-[11px]">
                  <span style={{ color: 'var(--text-secondary)' }}>Central</span>
                  <span style={{ color: 'var(--text-muted)' }}>0 – 3 km</span>
                  <span style={{ color: 'var(--text-secondary)' }}>Inner</span>
                  <span style={{ color: 'var(--text-muted)' }}>3 – 8 km</span>
                  <span style={{ color: 'var(--text-secondary)' }}>Mid</span>
                  <span style={{ color: 'var(--text-muted)' }}>8 – 15 km</span>
                  <span style={{ color: 'var(--text-secondary)' }}>Outer</span>
                  <span style={{ color: 'var(--text-muted)' }}>15 km+</span>
                </div>
              </div>
            )}
          </div>

          {/* Leaderboard list */}
          <div className="space-y-0.5">
            {entries.map((point, index) => {
              const area = point.coverage[selectedMode];
              const modeConfig =
                TRANSPORT_MODES[
                  MODE_KEYS.find((m) => m.key === selectedMode)?.mode || 'transit'
                ];

              return (
                <button
                  key={point.id}
                  onClick={() => onSelectLocation(point.lat, point.lng, point.name)}
                  className="flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-left transition-colors group"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--hover-bg)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '';
                  }}
                >
                  <span
                    className="text-xs font-mono w-5 text-right shrink-0"
                    style={{ color: `${modeConfig.color}80` }}
                  >
                    {index + 1}
                  </span>
                  <span
                    className="text-sm truncate flex-1"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {point.name}
                  </span>
                  <span
                    className="text-xs font-mono shrink-0"
                    style={{ color: 'var(--text-tertiary)' }}
                  >
                    {area} km²
                  </span>
                </button>
              );
            })}
            {entries.length === 0 && (
              <p className="text-xs py-2" style={{ color: 'var(--text-muted)' }}>
                No data for this zone
              </p>
            )}
          </div>

          <p className="text-[10px] pt-1" style={{ color: 'var(--text-faint)' }}>
            Top 10 of {filteredCount} locations
            {zoneFilter !== 'all' ? ` in ${zoneFilter} London` : ''}
          </p>
        </div>
      )}
    </div>
  );
}
