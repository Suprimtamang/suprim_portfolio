import { useSystemStore, LAYERS_DATA } from '../../store/useSystemStore';
import { CvDownloadButton } from '../ui/CvDownloadButton';

export function ClassicView() {
  const mode = useSystemStore((s) => s.mode);
  if (mode !== 'classic') return null;

  return (
    <div className="fixed inset-0 overflow-auto bg-[var(--bg)] z-50 p-6 pt-20">
      <main className="max-w-3xl mx-auto space-y-10 pb-12">
        <header className="max-w-2xl">
          <div className="text-[11px] tracking-widest uppercase text-[var(--amber)]">Portfolio / 2026</div>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mt-2">I build useful systems<br /><span className="text-[var(--amber)]">that people can trust.</span></h1>
          <p className="text-[var(--mute)] mt-5 text-base leading-relaxed">Computer Science student at NOVA FCT in Lisbon, working across full-stack product engineering, low-level systems, and cloud security.</p>
          <div className="flex flex-wrap gap-3 mt-6">
            <a href="mailto:s.tamang@campus.fct.unl.pt" className="bg-[var(--amber)] text-[#1a1412] rounded-lg px-4 py-2 text-sm font-semibold">Start a conversation</a>
            <a href="https://github.com/Suprimtamang" target="_blank" rel="noopener noreferrer" className="border border-[var(--line)] rounded-lg px-4 py-2 text-sm hover:border-[var(--amber)]">GitHub ↗</a>
            <CvDownloadButton variant="solid" />
          </div>
        </header>
        
        <div className="grid gap-4 sm:grid-cols-2">
          {LAYERS_DATA.map((l) => (
            <section key={l.id} className="bg-[var(--glass)] border border-[var(--line)] rounded-xl p-5 space-y-3">
              <div className="text-[10px] tracking-widest uppercase text-[var(--amber)]">{l.tag}</div>
              <h2 className="text-lg font-semibold">{l.title}</h2>
              <div className="text-xs text-[var(--mute)] uppercase tracking-wider">{l.subtitle}</div>
              <ul className="pl-4 space-y-2 text-sm text-[var(--ink)]/85">
                {l.bullets.map((b, i) => <li key={i} className="list-disc leading-relaxed">{b}</li>)}
              </ul>
            </section>
          ))}
        </div>

        <div className="pt-4 border-t border-[var(--line)]">
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <a href="https://linkedin.com/in/suprim-tamang-b864a9242" target="_blank" rel="noopener noreferrer" className="text-[var(--amber)] hover:underline">LinkedIn ↗</a>
            <a href="mailto:s.tamang@campus.fct.unl.pt" className="text-[var(--amber)] hover:underline">s.tamang@campus.fct.unl.pt</a>
            <CvDownloadButton />
            <span className="text-[var(--mute)]">Lisbon, Portugal · Kathmandu, Nepal</span>
          </div>
        </div>
      </main>
    </div>
  );
}
export default ClassicView;