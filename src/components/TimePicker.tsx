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
      <label className="block text-xs text-white/40 uppercase tracking-wider mb-1.5 font-medium">
        Departure Time
      </label>
      <input
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white
                   font-mono text-sm focus:outline-none focus:border-[#00d4ff]/50 transition-colors
                   [color-scheme:dark]"
      />
      <div className="flex flex-wrap gap-1.5 mt-2">
        {PRESETS.map((p) => (
          <button
            key={p.time}
            onClick={() => onChange(p.time)}
            className={`px-2 py-1 rounded text-xs transition-colors
              ${value === p.time
                ? 'bg-[#00d4ff]/20 text-[#00d4ff] border border-[#00d4ff]/30'
                : 'bg-white/5 text-white/40 border border-transparent hover:bg-white/10 hover:text-white/60'
              }`}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}
