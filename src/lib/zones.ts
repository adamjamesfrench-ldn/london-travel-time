const LONDON_CENTER = { lat: 51.5074, lng: -0.1278 };

export type Zone = 'central' | 'inner' | 'mid' | 'outer';

const ZONE_THRESHOLDS: { zone: Zone; maxKm: number }[] = [
  { zone: 'central', maxKm: 3 },
  { zone: 'inner', maxKm: 8 },
  { zone: 'mid', maxKm: 15 },
  { zone: 'outer', maxKm: Infinity },
];

const ZONE_LABELS: Record<Zone, string> = {
  central: 'Central (0-3km)',
  inner: 'Inner (3-8km)',
  mid: 'Mid (8-15km)',
  outer: 'Outer (15km+)',
};

export function distanceFromCentreKm(lat: number, lng: number): number {
  const R = 6371;
  const dLat = ((lat - LONDON_CENTER.lat) * Math.PI) / 180;
  const dLng = ((lng - LONDON_CENTER.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((LONDON_CENTER.lat * Math.PI) / 180) *
      Math.cos((lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function classifyZone(lat: number, lng: number): Zone {
  const dist = distanceFromCentreKm(lat, lng);
  for (const { zone, maxKm } of ZONE_THRESHOLDS) {
    if (dist <= maxKm) return zone;
  }
  return 'outer';
}

export function getZoneLabel(zone: Zone): string {
  return ZONE_LABELS[zone];
}
