'use client';

import { useState } from 'react';
import { TRANSPORT_MODES, type TransportMode } from '@/lib/constants';

interface CoveragePoint {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: string;
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

export default function Leaderboard({ onSelectLocation }: LeaderboardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMode, setSelectedMode] = useState<string>('transit');

  if (!coverageData) return null;

  const leaderboard = coverageData.leaderboards[selectedMode] || [];
  const pointsMap = new Map(coverageData.points.map((p) => [p.id, p]));

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

          {/* Leaderboard list */}
          <div className="space-y-0.5">
            {leaderboard.slice(0, 10).map((id, index) => {
              const point = pointsMap.get(id);
              if (!point) return null;
              const area = point.coverage[selectedMode];
              const modeConfig =
                TRANSPORT_MODES[
                  MODE_KEYS.find((m) => m.key === selectedMode)?.mode || 'transit'
                ];

              return (
                <button
                  key={id}
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
          </div>

          <p className="text-[10px] text-white/20 pt-1">
            Based on {coverageData.travelTimeMinutes}-min isochrone area from{' '}
            {coverageData.totalPoints} sample points
          </p>
        </div>
      )}
    </div>
  );
}
