'use client';

import { useState } from 'react';
import { TRANSPORT_MODES, type TransportMode } from '@/lib/constants';

const MODE_DESCRIPTIONS: Record<TransportMode, string> = {
  walking: 'Walking speed on real road/footpath networks from OpenStreetMap.',
  cycling: 'Cycling speed on road and cycle lane networks.',
  transit: 'Any combination of tube, bus, DLR, Overground, Elizabeth line, and National Rail — plus walking to/from stops. Varies by departure time and timetable.',
  driving: 'Car travel on the road network, accounting for road type and typical speeds.',
  multimodal: 'Drive to a station, then take public transport — useful for park & ride scenarios.',
};

interface ModeTogglesProps {
  activeModes: TransportMode[];
  onChange: (modes: TransportMode[]) => void;
}

export default function ModeToggles({ activeModes, onChange }: ModeTogglesProps) {
  const [showInfo, setShowInfo] = useState(false);

  const toggle = (mode: TransportMode) => {
    if (activeModes.includes(mode)) {
      onChange(activeModes.filter((m) => m !== mode));
    } else {
      onChange([...activeModes, mode]);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label
          className="block text-xs uppercase tracking-wider font-medium"
          style={{ color: 'var(--text-tertiary)' }}
        >
          Transport Mode
        </label>
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="text-xs transition-colors flex items-center gap-1"
          style={{ color: 'var(--text-muted)' }}
        >
          <svg
            className={`w-3.5 h-3.5 transition-transform ${showInfo ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          How these work
        </button>
      </div>

      {showInfo && (
        <div
          className="mb-2 space-y-2 p-2.5 rounded-lg"
          style={{ background: 'var(--info-bg)', border: '1px solid var(--info-border)' }}
        >
          {(Object.entries(TRANSPORT_MODES) as [TransportMode, typeof TRANSPORT_MODES[TransportMode]][]).map(
            ([key, config]) => (
              <div key={key}>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: config.color }}
                  />
                  <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                    {config.label}
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed pl-3.5" style={{ color: 'var(--text-muted)' }}>
                  {MODE_DESCRIPTIONS[key]}
                </p>
              </div>
            )
          )}
          <p className="text-[10px] pt-1" style={{ color: 'var(--text-faint)' }}>
            All calculations by TravelTime API using real timetable and road network data.
          </p>
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        {(Object.entries(TRANSPORT_MODES) as [TransportMode, typeof TRANSPORT_MODES[TransportMode]][]).map(
          ([key, config]) => {
            const active = activeModes.includes(key);
            return (
              <button
                key={key}
                onClick={() => toggle(key)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all"
                style={{
                  background: active ? 'var(--active-bg)' : 'transparent',
                  border: active ? '1px solid var(--input-border)' : '1px solid transparent',
                }}
              >
                <div
                  className={`w-2.5 h-2.5 rounded-full transition-all ${active ? 'scale-100' : 'scale-75 opacity-30'}`}
                  style={{ backgroundColor: config.color }}
                />
                <span style={{ color: active ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                  {config.label}
                </span>
              </button>
            );
          }
        )}
      </div>
    </div>
  );
}
