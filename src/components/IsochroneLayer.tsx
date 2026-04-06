'use client';

import { Source, Layer } from 'react-map-gl/mapbox';
import type { ParsedIsochrone } from '@/lib/geo-utils';
import { TRANSPORT_MODES, type TransportMode } from '@/lib/constants';

interface IsochroneLayerProps {
  isochrones: ParsedIsochrone[];
}

function getOpacity(band: number, maxBand: number): number {
  // Higher bands = more transparent, inner bands = more opaque
  if (band === maxBand) return 0.06;
  if (band >= maxBand * 0.67) return 0.08;
  return 0.10;
}

export default function IsochroneLayer({ isochrones }: IsochroneLayerProps) {
  // Group by mode to find max band per mode
  const maxBandByMode = new Map<TransportMode, number>();
  for (const iso of isochrones) {
    const current = maxBandByMode.get(iso.mode) || 0;
    if (iso.band > current) maxBandByMode.set(iso.mode, iso.band);
  }

  // Sort: largest bands first so smaller (brighter) bands render on top
  const sorted = [...isochrones].sort((a, b) => b.band - a.band);

  return (
    <>
      {sorted.map((iso) => {
        const color = TRANSPORT_MODES[iso.mode].color;
        const maxBand = maxBandByMode.get(iso.mode) || iso.band;
        const opacity = getOpacity(iso.band, maxBand);
        const isOuterBand = iso.band === maxBand;
        const id = `iso-${iso.mode}-${iso.band}`;

        return (
          <Source key={id} id={id} type="geojson" data={iso.geojson}>
            <Layer
              id={`${id}-fill`}
              type="fill"
              paint={{
                'fill-color': color,
                'fill-opacity': opacity,
              }}
            />
            {isOuterBand && (
              <Layer
                id={`${id}-outline`}
                type="line"
                paint={{
                  'line-color': color,
                  'line-opacity': 0.4,
                  'line-width': 1.5,
                  'line-dasharray': [4, 3],
                }}
              />
            )}
          </Source>
        );
      })}
    </>
  );
}
