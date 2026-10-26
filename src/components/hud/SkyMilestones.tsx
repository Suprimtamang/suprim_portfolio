import { useSystemStore } from '../../store/useSystemStore';

const MILESTONES = [
  ['2021', 'Systems foundation', 'C, OCaml and Java work across filesystems, interpreters and data structures.'],
  ['2023', 'Simplify', 'Built an admissions guide for international students navigating Portugal.'],
  ['2025', 'AdSecOps', 'Designed Sajuro, an identity-monitoring and token-quarantine simulator.'],
  ['2026', 'Cloud & community', 'Google Cloud cybersecurity certification and Nepalese in Tech Europe.'],
];

export function SkyMilestones() {
  const mode = useSystemStore((state) => state.mode);
  const activeLayer = useSystemStore((state) => state.activeLayer);
  if (mode !== 'scroll' || activeLayer !== 3) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden px-6 pt-28">
      <div className="mx-auto grid max-w-5xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {MILESTONES.map(([year, title, detail]) => (
          <article key={year} className="rounded-2xl border border-white/20 bg-[#17374b]/65 p-4 shadow-xl backdrop-blur-md">
            <div className="font-mono text-[10px] tracking-[0.24em] text-[#ffd27d]">{year}</div>
            <h2 className="mt-2 text-sm font-semibold text-white">{title}</h2>
            <p className="mt-2 text-xs leading-relaxed text-white/70">{detail}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
