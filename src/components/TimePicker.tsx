'use client';

const PRESETS = [
  { label: 'Morning Peak', time: '08:30' },
  { label: 'Midday', time: '12:00' },
  { label: 'Evening Peak', time: '18:00' },
  { label: 'Night', time: '23:00' },
];

interface TimePickerProps {
  value: string; // HH:mm
  onChange: (time: string) => void;
}

export default function TimePicker({ value, onChange }: TimePickerProps) {
  return (
    <div>
      <label
        className="block text-xs uppercase tracking-wider mb-1.5 font-medium"
        style={{ color: 'var(--text-tertiary)' }}
      >
        Departure Time
      </label>
      <input
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg px-3 py-2 font-mono text-sm focus:outline-none transition-colors"
        style={{
          background: 'var(--input-bg)',
          border: '1px solid var(--input-border)',
          color: 'var(--text-primary)',
          colorScheme: 'var(--color-scheme)',
        }}
      />
      <div className="flex flex-wrap gap-1.5 mt-2">
        {PRESETS.map((p) => (
          <button
            key={p.time}
            onClick={() => onChange(p.time)}
            className="px-2 py-1 rounded text-xs transition-colors"
            style={
              value === p.time
                ? {
                    background: 'var(--accent-bg)',
                    color: 'var(--accent)',
                    border: '1px solid var(--accent-border)',
                  }
                : {
                    background: 'var(--input-bg)',
                    color: 'var(--text-tertiary)',
                    border: '1px solid transparent',
                  }
            }
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}
