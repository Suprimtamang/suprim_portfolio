import { useSystemStore, LAYERS_DATA } from '../../store/useSystemStore';

export function ClassicView() {
  const mode = useSystemStore((s) => s.mode);
  if (mode !== 'classic') return null;

  return (
    <div className="fixed inset-0 overflow-auto bg-[var(--bg)] z-50 p-6 pt-20">
      <main className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Suprim Tamang</h1>
        <p className="text-[var(--mute)]">Systems, AdSecOps and Full-Stack Engineering — Resume view.</p>
        
        {LAYERS_DATA.map((l) => (
          <section key={l.id} className="space-y-2">
            <h2 className="text-lg font-semibold text-[var(--amber)]">{l.title}</h2>
            <div className="text-xs text-[var(--mute)] uppercase tracking-wider">{l.subtitle}</div>
            <ul className="pl-5 space-y-1 text-sm">
              {l.bullets.map((b, i) => (
                <li key={i} className="list-disc">{b}</li>
              ))}
            </ul>
          </section>
        ))}

        <div className="pt-4 border-t border-[var(--line)]">
          <a href="https://github.com/Suprimtamang" target="_blank" rel="noopener noreferrer" className="text-[var(--amber)] underline">
            GitHub · @Suprimtamang
          </a>
        </div>
      </main>
    </div>
  );
}
export default ClassicView;