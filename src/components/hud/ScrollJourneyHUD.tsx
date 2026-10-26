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
  if (mode !== 'scroll') return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-40 flex justify-center px-4">
      <div className="flex w-[min(760px,100%)] items-center justify-between gap-2 rounded-xl border border-[var(--line)] bg-[var(--glass)] px-4 py-3 text-[10px] uppercase tracking-widest text-[var(--mute)] shadow-2xl backdrop-blur-md">
        {SECTIONS.map(([number, title, detail]) => (
          <div key={number} className="hidden min-w-0 text-center sm:block">
            <div className="text-[var(--amber)]">{number}</div>
            <div className="mt-1 truncate text-[var(--ink)]">{title}</div>
            <div className="mt-1 hidden text-[9px] normal-case tracking-normal text-[var(--mute)] lg:block">{detail}</div>
          </div>
        ))}
        <div className="sm:hidden">Scroll · sky → road → train → boat → dive</div>
      </div>
    </div>
  );
}
