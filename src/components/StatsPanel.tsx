'use client';

import type { ParsedIsochrone } from '@/lib/geo-utils';
import { calculateAreaKm2 } from '@/lib/geo-utils';
import { TRANSPORT_MODES, type TransportMode } from '@/lib/constants';

interface StatsPanelProps {
  postcode: string | null;
  district: string | null;
  isochrones: ParsedIsochrone[];
}

export default function StatsPanel({ postcode, district, isochrones }: StatsPanelProps) {
  if (!postcode) return null;

  // Group by mode, show largest band area
  const modeAreas = new Map<TransportMode, { band: number; area: number }>();
  for (const iso of isochrones) {
    const area = calculateAreaKm2(iso.geojson);
    const existing = modeAreas.get(iso.mode);
    if (!existing || iso.band > existing.band) {
      modeAreas.set(iso.mode, { band: iso.band, area });
    }
  }

  return (
    <div>
      <label className="block text-xs text-white/40 uppercase tracking-wider mb-1.5 font-medium">
        Stats
      </label>
      <div className="space-y-2">
        <div className="flex justify-between items-baseline">
          <span className="text-xs text-white/40">Postcode</span>
          <span className="font-mono text-sm text-white">{postcode}</span>
        </div>
        {district && (
          <div className="flex justify-between items-baseline">
            <span className="text-xs text-white/40">District</span>
            <span className="text-sm text-white/70">{district}</span>
          </div>
        )}
        {Array.from(modeAreas.entries()).map(([mode, { band, area }]) => (
          <div key={mode} className="flex justify-between items-baseline">
            <span className="text-xs" style={{ color: TRANSPORT_MODES[mode].color }}>
              {TRANSPORT_MODES[mode].label} ({band}m)
            </span>
            <span className="font-mono text-sm text-white/70">
              {area.toFixed(1)} km²
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
