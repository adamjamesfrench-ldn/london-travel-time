import type { TravelTimeShape, TravelTimeResult } from './traveltime';
import type { TransportMode } from './constants';
import * as turf from '@turf/turf';

export function toGeoJSON(shapes: TravelTimeShape[]): GeoJSON.MultiPolygon {
  return {
    type: 'MultiPolygon',
    coordinates: shapes.map((shape) => {
      const shell = shape.shell.map((p) => [p.lng, p.lat]);
      shell.push(shell[0]); // Close the ring
      const holes = (shape.holes || []).map((hole) => {
        const ring = hole.map((p) => [p.lng, p.lat]);
        ring.push(ring[0]);
        return ring;
      });
      return [shell, ...holes];
    }),
  };
}

export interface ParsedIsochrone {
  mode: TransportMode;
  band: number;
  geojson: GeoJSON.Feature<GeoJSON.MultiPolygon>;
}

export function parseResults(results: TravelTimeResult[]): ParsedIsochrone[] {
  return results.map((result) => {
    const [mode, bandStr] = result.search_id.split('-');
    const band = parseInt(bandStr, 10);
    return {
      mode: mode as TransportMode,
      band,
      geojson: {
        type: 'Feature',
        properties: { mode, band },
        geometry: toGeoJSON(result.shapes),
      },
    };
  });
}

export function calculateAreaKm2(geojson: GeoJSON.Feature<GeoJSON.MultiPolygon>): number {
  try {
    const area = turf.area(geojson);
    return area / 1_000_000; // m² to km²
  } catch {
    return 0;
  }
}
