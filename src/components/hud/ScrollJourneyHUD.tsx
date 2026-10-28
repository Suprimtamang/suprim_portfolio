import { useSystemStore } from '../../store/useSystemStore';

const SECTIONS = [
  ['01', 'Plane / sky', 'Career milestones above Lisbon'],
  ['02', 'Road deck', 'Application and product systems'],
  ['03', 'Fertagus', 'Security, data and infrastructure'],
  ['04', 'Tagus', 'River-level perspective'],
  ['05', 'Dive', 'Kernel and memory below the surface'],
];

export function ScrollJourneyHUD() {
  const mode = useSystemStore((state) => state.mode);
  const progress = useSystemStore((state) => state.journeyProgress);
  if (mode !== 'scroll') return null;
  const activeSection = Math.min(SECTIONS.length - 1, Math.floor(progress * SECTIONS.length));

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-40 flex justify-center px-4">
      <div className="relative flex w-[min(760px,100%)] items-center justify-between gap-2 rounded-xl border border-[var(--line)] bg-[var(--glass)] px-4 py-3 text-[10px] uppercase tracking-widest text-[var(--mute)] shadow-2xl backdrop-blur-md">
        {SECTIONS.map(([number, title, detail], index) => (
          <div key={number} className={`hidden min-w-0 text-center transition-opacity sm:block ${activeSection === index ? 'text-[var(--ink)] opacity-100' : 'opacity-55'}`}>
            <div className="text-[var(--amber)]">{number}</div>
            <div className="mt-1 truncate text-[var(--ink)]">{title}</div>
            <div className="mt-1 hidden text-[9px] normal-case tracking-normal text-[var(--mute)] lg:block">{detail}</div>
          </div>
        ))}
        <div className="sm:hidden">Scroll · sky → road → train → boat → dive</div>
        <div className="absolute inset-x-0 bottom-0 h-0.5 overflow-hidden rounded-full bg-white/10">
          <div className="h-full bg-[var(--amber)] transition-[width] duration-150" style={{ width: `${progress * 100}%` }} />
        </div>
      </div>
    </div>
  );
}
