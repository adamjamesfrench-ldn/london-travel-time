'use client';

const QUICK_TIMES = [5, 10, 15, 20, 30, 45, 60];

interface TimeSliderProps {
  value: number;
  onChange: (minutes: number) => void;
}

export default function TimeSlider({ value, onChange }: TimeSliderProps) {
  return (
    <div>
      <label className="block text-xs text-white/40 uppercase tracking-wider mb-1.5 font-medium">
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
          className="flex-1 accent-[#00d4ff] h-1"
        />
        <span className="font-mono text-[#00d4ff] text-sm min-w-[3.5rem] text-right">
          {value} min
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {QUICK_TIMES.map((t) => (
          <button
            key={t}
            onClick={() => onChange(t)}
            className={`px-2 py-1 rounded text-xs font-mono transition-colors
              ${t === value
                ? 'bg-[#00d4ff]/20 text-[#00d4ff] border border-[#00d4ff]/30'
                : 'bg-white/5 text-white/40 border border-transparent hover:bg-white/10 hover:text-white/60'
              }`}
          >
            {t}m
          </button>
        ))}
      </div>
    </div>
  );
}
