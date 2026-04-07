'use client';

import { useState } from 'react';
import type { ParsedIsochrone } from '@/lib/geo-utils';
import { calculateAreaKm2 } from '@/lib/geo-utils';
import { TRANSPORT_MODES, type TransportMode } from '@/lib/constants';
import { classifyZone, getZoneLabel, type Zone } from '@/lib/zones';

interface CoveragePoint {
  id: string;
  coverage: Record<string, number>;
  zone?: string;
}

interface CoverageData {
  points: CoveragePoint[];
}

let coverageData: CoverageData | null = null;
try {
  coverageData = require('@/data/coverage-results.json');
} catch {
  // Not generated yet
}

type CompareMode = 'all' | 'same_zone' | 'central';

const COMPARE_OPTIONS: { value: CompareMode; label: string }[] = [
  { value: 'all', label: 'All London' },
  { value: 'same_zone', label: 'Same zone' },
  { value: 'central', label: 'Central only' },
];

function getPercentile(area: number, modeKey: string, points: CoveragePoint[]): number | null {
  const values = points
    .map((p) => p.coverage[modeKey])
    .filter((v) => v !== undefined && v > 0);
  if (values.length < 3) return null;
  const below = values.filter((v) => v < area).length;
  return Math.round((below / values.length) * 100);
}

function getPercentileColor(pct: number): string {
  if (pct >= 75) return '#4ade80'; // green
  if (pct >= 50) return '#facc15'; // yellow
  if (pct >= 25) return '#fb923c'; // orange
  return '#f87171'; // red
}

function modeKeyForTransport(mode: TransportMode): string {
  const map: Record<TransportMode, string> = {
    walking: 'walking',
    cycling: 'cycling',
    transit: 'transit',
    driving: 'driving',
    multimodal: 'multimodal',
  };
  return map[mode];
}

interface StatsPanelProps {
  postcode: string | null;
  district: string | null;
  isochrones: ParsedIsochrone[];
  origin: { lat: number; lng: number } | null;
}

export default function StatsPanel({ postcode, district, isochrones, origin }: StatsPanelProps) {
  const [compareMode, setCompareMode] = useState<CompareMode>('all');

  if (!postcode) return null;

  const originZone: Zone | null = origin ? classifyZone(origin.lat, origin.lng) : null;

  // Group by mode, show largest band area
  const modeAreas = new Map<TransportMode, { band: number; area: number }>();
  for (const iso of isochrones) {
    const area = calculateAreaKm2(iso.geojson);
    const existing = modeAreas.get(iso.mode);
    if (!existing || iso.band > existing.band) {
      modeAreas.set(iso.mode, { band: iso.band, area });
    }
  }

  // Filter comparison points based on selected mode
  let comparisonPoints: CoveragePoint[] = coverageData?.points || [];
  if (compareMode === 'same_zone' && originZone) {
    comparisonPoints = comparisonPoints.filter((p) => p.zone === originZone);
  } else if (compareMode === 'central') {
    comparisonPoints = comparisonPoints.filter((p) => p.zone === 'central');
  }

  return (
    <div>
      <label className="block text-xs text-white/40 uppercase tracking-wider mb-1.5 font-medium">
        Stats
      </label>
      <div className="space-y-2">
        <div className="flex justify-between items-baseline">
          <span className="text-xs text-white/40">Location</span>
          <span className="text-sm text-white truncate ml-2 text-right">{postcode}</span>
        </div>
        {district && (
          <div className="flex justify-between items-baseline">
            <span className="text-xs text-white/40">District</span>
            <span className="text-sm text-white/70">{district}</span>
          </div>
        )}
        {originZone && (
          <div className="flex justify-between items-baseline">
            <span className="text-xs text-white/40">Zone</span>
            <span className="text-sm text-white/70">{getZoneLabel(originZone)}</span>
          </div>
        )}

        {/* Percentile comparison selector */}
        {coverageData && modeAreas.size > 0 && (
          <div className="pt-1">
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-[10px] text-white/30">Compare vs</span>
              {COMPARE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setCompareMode(opt.value)}
                  className={`px-1.5 py-0.5 rounded text-[10px] transition-colors ${
                    compareMode === opt.value
                      ? 'bg-[#00d4ff]/15 text-[#00d4ff] border border-[#00d4ff]/30'
                      : 'text-white/30 border border-transparent hover:text-white/50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {Array.from(modeAreas.entries()).map(([mode, { band, area }]) => {
          const modeKey = modeKeyForTransport(mode);
          const percentile = coverageData
            ? getPercentile(area, modeKey, comparisonPoints)
            : null;

          return (
            <div key={mode}>
              <div className="flex justify-between items-baseline">
                <span className="text-xs" style={{ color: TRANSPORT_MODES[mode].color }}>
                  {TRANSPORT_MODES[mode].label} ({band}m)
                </span>
                <span className="font-mono text-sm text-white/70">
                  {area.toFixed(1)} km²
                </span>
              </div>
              {percentile !== null && (
                <div className="flex items-center gap-1.5 mt-0.5 ml-0.5">
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: getPercentileColor(percentile) }}
                  />
                  <span className="text-[11px] text-white/40">
                    {percentile >= 50
                      ? `Top ${Math.max(1, 100 - percentile)}%`
                      : `Bottom ${Math.max(1, percentile)}%`}
                    {compareMode === 'same_zone' && originZone
                      ? ` in ${originZone}`
                      : compareMode === 'central'
                      ? ' in central'
                      : ' across London'}
                    <span className="text-white/20"> ({comparisonPoints.length} locations)</span>
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
