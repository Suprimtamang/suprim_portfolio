import { useSystemStore } from '../../store/useSystemStore';

export function ElevationMeter() {
  const elevation = useSystemStore((s) => s.elevation);
  const percent = Math.min(100, Math.max(0, ((elevation + 20) / 210) * 100));

  return (
    <div className="fixed left-4 top-24 bottom-24 w-0.5 bg-[var(--line)] z-10 font-mono text-[11px] text-[var(--mute)] pointer-events-none">
      <span className="absolute -top-5 -left-1">190</span>
      <div
        className="absolute -left-[5px] w-3 h-3 rounded-full bg-[var(--amber)] shadow-[0_0_12px_var(--amber)] transition-all duration-75"
        style={{ bottom: `${percent}%` }}
      >
        <em className="absolute left-4 -top-0.5 not-italic text-[var(--ink)] whitespace-nowrap">
          {elevation >= 0 ? '+' : ''}
          {elevation.toFixed(0)} m
        </em>
      </div>
      <span className="absolute -bottom-5 -left-2">−20</span>
    </div>
  );
}
export default ElevationMeter;