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
        className="flex items-center justify-between w-full text-xs text-white/40 uppercase tracking-wider font-medium hover:text-white/60 transition-colors"
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
                  className={`px-2 py-1 rounded text-xs transition-colors ${
                    active
                      ? 'border'
                      : 'bg-white/5 text-white/30 border border-transparent hover:bg-white/10'
                  }`}
                  style={
                    active
                      ? {
                          backgroundColor: `${config.color}20`,
                          color: config.color,
                          borderColor: `${config.color}40`,
                        }
                      : undefined
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
                className="text-[10px] text-white/30 hover:text-white/50 transition-colors flex items-center gap-0.5"
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
                  className={`px-1.5 py-0.5 rounded text-[10px] transition-colors ${
                    zoneFilter === z.value
                      ? 'bg-[#00d4ff]/15 text-[#00d4ff] border border-[#00d4ff]/30'
                      : 'text-white/30 border border-transparent hover:text-white/50'
                  }`}
                >
                  {z.label}
                </button>
              ))}
            </div>
            {showZoneInfo && (
              <div className="mt-1.5 p-2 rounded-lg bg-white/[0.03] border border-white/5 space-y-1">
                <p className="text-[11px] text-white/40 leading-relaxed">
                  Zones are based on distance from central London (Charing Cross):
                </p>
                <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-[11px]">
                  <span className="text-white/50">Central</span><span className="text-white/30">0 – 3 km</span>
                  <span className="text-white/50">Inner</span><span className="text-white/30">3 – 8 km</span>
                  <span className="text-white/50">Mid</span><span className="text-white/30">8 – 15 km</span>
                  <span className="text-white/50">Outer</span><span className="text-white/30">15 km+</span>
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
                  className="flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-left
                             hover:bg-white/[0.05] transition-colors group"
                >
                  <span
                    className="text-xs font-mono w-5 text-right shrink-0"
                    style={{ color: `${modeConfig.color}80` }}
                  >
                    {index + 1}
                  </span>
                  <span className="text-sm text-white/70 group-hover:text-white truncate flex-1">
                    {point.name}
                  </span>
                  <span className="text-xs font-mono text-white/40 shrink-0">
                    {area} km²
                  </span>
                </button>
              );
            })}
            {entries.length === 0 && (
              <p className="text-xs text-white/30 py-2">No data for this zone</p>
            )}
          </div>

          <p className="text-[10px] text-white/20 pt-1">
            Top 10 of {filteredCount} locations
            {zoneFilter !== 'all' ? ` in ${zoneFilter} London` : ''}
          </p>
        </div>
      )}
    </div>
  );
}
