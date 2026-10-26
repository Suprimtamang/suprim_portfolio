import { useSystemStore, LAYERS_DATA, INTRO_LAYER, GANTRIES_DATA } from '../../store/useSystemStore';
import { useState, useEffect } from 'react';// fallback or standard react hooks

export function LayerCards() {
  const activeLayer = useSystemStore((s) => s.activeLayer);
  const mode = useSystemStore((s) => s.mode);
  const hoveredGantry = useSystemStore((s) => s.hoveredGantry);
  const toastMessage = useSystemStore((s) => s.toastMessage);

  const [timeStr, setTimeStr] = useState({ lisbon: '', ktm: '' });

  useEffect(() => {
    const updateTime = () => {
      const l = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Lisbon', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(new Date());
      const k = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kathmandu', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(new Date());
      setTimeStr({ lisbon: l, ktm: k });
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  if (mode === 'classic') return null;

  const data = activeLayer < 0 ? INTRO_LAYER : LAYERS_DATA[activeLayer];

  return (
    <>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed left-1/2 top-20 -translate-x-1/2 bg-[var(--glass)] border border-[var(--line)] px-4 py-2 rounded-full z-50 text-xs backdrop-blur-md animate-fade-in">
          {toastMessage}
        </div>
      )}

      {/* Gantry Hover Tooltip */}
      {hoveredGantry !== null && (
        <div className="fixed right-4 top-20 w-72 bg-[var(--glass)] border border-[var(--amber)] p-4 rounded-xl z-40 backdrop-blur-md">
          <div className="text-[10px] tracking-wider text-[var(--amber)] uppercase">Simplify · {GANTRIES_DATA[hoveredGantry].code}</div>
          <b className="text-sm block mt-1">{GANTRIES_DATA[hoveredGantry].title}</b>
          <p className="text-xs text-[var(--mute)] mt-1">{GANTRIES_DATA[hoveredGantry].description}</p>
        </div>
      )}

      {/* Main Layer HUD Card */}
      <div className="fixed left-14 bottom-6 w-[min(450px,calc(100vw-72px))] p-5 bg-[var(--glass)] border border-[var(--line)] rounded-xl backdrop-blur-md z-40 shadow-2xl">
        <div className="text-[11px] tracking-widest uppercase text-[var(--amber)]">
          {data.tag} {data.subtitle ? `· ${data.subtitle}` : ''}
        </div>
        <h2 className="text-xl font-bold mt-1 mb-2">{data.title}</h2>
        <ul className="pl-4 mb-3 space-y-1 text-sm">
          {data.bullets.map((b, idx) => (
            <li key={idx} className="list-disc leading-relaxed">{b}</li>
          ))}
        </ul>
        <p className="text-xs text-[var(--mute)]">{data.hint}</p>

        {activeLayer === 3 && (
          <div className="mt-3 pt-3 border-t border-[var(--line)] font-mono text-[11px] leading-relaxed">
            Lisbon, PT · 38.68° N, 9.17° W · {timeStr.lisbon}<br />
            Kathmandu, NP · 27.71° N, 85.32° E · {timeStr.ktm}
            <div className="mt-2">
              <a
                href="https://github.com/Suprimtamang"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-[var(--glass)] border border-[var(--line)] px-3 py-1.5 rounded-lg text-xs hover:border-[var(--amber)] hover:text-[var(--amber)]"
              >
                [ Transmit Signal ]
              </a>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
export default LayerCards;