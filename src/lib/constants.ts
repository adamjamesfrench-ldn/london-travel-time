export const TRANSPORT_MODES = {
  walking: {
    label: 'Walking',
    travelTimeType: 'walking',
    color: '#4ade80',
  },
  cycling: {
    label: 'Cycling',
    travelTimeType: 'cycling',
    color: '#2dd4bf',
  },
  transit: {
    label: 'Public Transport',
    travelTimeType: 'public_transport',
    color: '#818cf8',
  },
  driving: {
    label: 'Driving',
    travelTimeType: 'driving',
    color: '#f87171',
  },
  multimodal: {
    label: 'Multimodal',
    travelTimeType: 'driving+public_transport',
    color: '#fb923c',
  },
} as const;

export type TransportMode = keyof typeof TRANSPORT_MODES;

export const TIME_BANDS = [10, 20, 30] as const;
export type TimeBand = (typeof TIME_BANDS)[number];

export const DEFAULT_CENTER = { lat: 51.5074, lng: -0.1278 };
export const DEFAULT_ZOOM = 11;
export const DEFAULT_TRAVEL_TIME_MINUTES = 30;
export const DEFAULT_MODES: TransportMode[] = ['transit'];

export type DayType = 'weekday' | 'weekend';

export const LAYER_OPACITY: Record<number, { fill: number; border: boolean; borderOpacity: number }> = {
  30: { fill: 0.06, border: true, borderOpacity: 0.4 },
  20: { fill: 0.08, border: false, borderOpacity: 0 },
  10: { fill: 0.10, border: false, borderOpacity: 0 },
};

export const COLORS = {
  accent: '#00d4ff',
  surface: '#0a0c13',
  panel: 'rgba(10, 12, 19, 0.93)',
  border: 'rgba(255, 255, 255, 0.05)',
};
