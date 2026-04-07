'use client';

const QUICK_TIMES = [5, 10, 15, 20, 30, 45, 60];

interface TimeSliderProps {
  value: number;
  onChange: (minutes: number) => void;
}

export default function TimeSlider({ value, onChange }: TimeSliderProps) {
  return (
    <div>
      <label
        className="block text-xs uppercase tracking-wider mb-1.5 font-medium"
        style={{ color: 'var(--text-tertiary)' }}
      >
        Travel Time
      </label>
      <div className="flex items-center gap-3 mb-2">
        <input
          type="range"
          min={5}
          max={60}
          step={5}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 h-1"
        />
        <span className="font-mono text-sm min-w-[3.5rem] text-right" style={{ color: 'var(--accent)' }}>
          {value} min
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {QUICK_TIMES.map((t) => (
          <button
            key={t}
            onClick={() => onChange(t)}
            className="px-2 py-1 rounded text-xs font-mono transition-colors"
            style={
              t === value
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
            {t}m
          </button>
        ))}
      </div>
    </div>
  );
}
