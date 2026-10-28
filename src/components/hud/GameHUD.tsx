import { useEffect, useRef, useState } from 'react';
import { useSystemStore } from '../../store/useSystemStore';

const CHECKPOINTS = {
  3: { year: '2026', title: 'Cloud & Community', body: 'Google Cloud cybersecurity, community building, and the signal above the bridge.', link: 'https://github.com/Suprimtamang' },
  2: { year: '2024', title: 'Application & UX', body: 'Simplify turns Portugal university admissions into a clearer route for international students.', link: 'https://portugal-admission-guide-app-production-y4byxb.laravel.cloud' },
  1: { year: '2025', title: 'AdSecOps & Sajuro', body: 'Token monitoring and quarantine made visible as an interactive security system.', link: 'https://github.com/Suprimtamang' },
  0: { year: '2023', title: 'Kernel & Memory', body: 'C filesystems, OCaml interpreters, and the low-level foundations beneath useful products.', link: 'https://github.com/Suprimtamang' },
} as const;

const PERMIT_LAYERS = [0, 2, 1, 3] as const;

function scrollToJourney(progress: number) {
  const element = document.querySelector<HTMLElement>('[aria-label="Scroll through the cinematic bridge journey"]');
  if (!element) return;
  element.scrollTo({ top: progress * (element.scrollHeight - element.clientHeight), behavior: 'smooth' });
  element.focus({ preventScroll: true });
}

function Radar({ progress }: { progress: number }) {
  const playerX = 25 + progress * 100;
  return (
    <div className="game-radar" aria-label="Bridge radar minimap">
      <svg viewBox="0 0 140 140" role="img" aria-label="Bridge span, piers, player position and architecture milestones">
        <circle cx="70" cy="70" r="64" />
        <circle cx="70" cy="70" r="54" className="game-radar-ring" />
        <path d="M12 82 C38 56, 100 56, 128 82" className="game-radar-bridge" />
        <path d="M26 92 L114 28" className="game-radar-cone" />
        {[25, 52, 80, 107].map((x, index) => <circle key={x} cx={x} cy={index % 2 ? 63 : 76} r="3" className={`game-blip blip-${index}`} />)}
        {[30, 70, 110].map((x) => <rect key={x} x={x - 2} y="67" width="4" height="22" rx="1" className="game-radar-pier" />)}
        <circle cx={playerX} cy="73" r="5" className="game-player-dot" />
      </svg>
      <span>BRIDGE RADAR</span>
    </div>
  );
}

function LaunchModal({ onEnter }: { onEnter: (progress: number) => void }) {
  const [ambient, setAmbient] = useState(false);
  const setMode = useSystemStore((state) => state.setMode);
  return (
    <div className="game-launch-backdrop">
      <section className="game-launch-card" role="dialog" aria-modal="true" aria-labelledby="launch-title">
        <div className="game-kicker">PONTE 25 DE ABRIL / STACK ACCESS</div>
        <h1 id="launch-title">Cross the Bridge with Suprim</h1>
        <p>A journey from <strong>+70m Cloud Summit</strong> to <strong>-40m Kernel Memory</strong>.</p>
        <div className="game-launch-actions">
          <button type="button" onClick={() => onEnter(0.25)}>🌉 Bridge &amp; Truss Tour</button>
          <button type="button" onClick={() => onEnter(1)}>🌊 Sub-Surface Kernel Dive</button>
        </div>
        <label className="game-audio-toggle"><input type="checkbox" checked={ambient} onChange={(event) => setAmbient(event.target.checked)} /> 🔊 Ambient Audio <span>Tagus wind · traffic · sonar pings</span></label>
        <button type="button" className="game-classic-link" onClick={() => setMode('classic')}>Prefer a normal page? Classic View</button>
      </section>
    </div>
  );
}

export function GameHUD() {
  const mode = useSystemStore((state) => state.mode);
  const activeLayer = useSystemStore((state) => state.activeLayer);
  const focusedLayer = useSystemStore((state) => state.focusedLayer);
  const progress = useSystemStore((state) => state.journeyProgress);
  const collected = useSystemStore((state) => state.collectedLayers);
  const toastMessage = useSystemStore((state) => state.toastMessage);
  const [launchOpen, setLaunchOpen] = useState(mode === 'scroll');
  const [guide, setGuide] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const guideTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const count = Object.values(collected).filter(Boolean).length;
  const checkpoint = CHECKPOINTS[focusedLayer as keyof typeof CHECKPOINTS] ?? CHECKPOINTS[activeLayer as keyof typeof CHECKPOINTS] ?? CHECKPOINTS[3];

  useEffect(() => {
    setLaunchOpen(mode === 'scroll');
  }, [mode]);

  useEffect(() => {
    if (count !== 4) return;
    setConfetti(true);
    const timer = setTimeout(() => setConfetti(false), 3500);
    return () => clearTimeout(timer);
  }, [count]);

  useEffect(() => () => {
    if (guideTimer.current) clearInterval(guideTimer.current);
  }, []);

  const enter = (jump: number) => {
    setLaunchOpen(false);
    scrollToJourney(jump);
  };

  const toggleGuide = () => {
    if (guideTimer.current) {
      clearInterval(guideTimer.current);
      guideTimer.current = null;
      setGuide(false);
      return;
    }
    setGuide(true);
    let index = 0;
    const stops = [0, 0.25, 0.5, 0.75, 1];
    scrollToJourney(stops[index]);
    guideTimer.current = setInterval(() => {
      index += 1;
      if (index >= stops.length) {
        if (guideTimer.current) clearInterval(guideTimer.current);
        guideTimer.current = null;
        setGuide(false);
        return;
      }
      scrollToJourney(stops[index]);
    }, 5000);
  };

  if (mode !== 'scroll') return null;

  return (
    <>
      {toastMessage && <div role="status" aria-live="polite" className="game-toast">{toastMessage}</div>}
      {launchOpen && <LaunchModal onEnter={enter} />}
      <Radar progress={progress} />
      <div className="game-right-rail">
        <div className="game-toolbar" aria-label="3D world actions">
          <button type="button" title="Guide Me" aria-label="Guide Me" onClick={toggleGuide}>{guide ? '⏸' : '🧭'}</button>
        </div>
        <section className="game-permit">
          <div className="game-kicker">STACK PERMIT</div>
          <strong>{count}/4 CHECKPOINTS</strong>
          <div className="game-permit-years">{(['2023', '2024', '2025', '2026'] as const).map((year, index) => {
            const layer = PERMIT_LAYERS[index];
            return <span key={year} className={collected[layer] ? 'is-collected' : ''}>{collected[layer] ? '✓' : '○'} {year}</span>;
          })}</div>
        </section>
        <section className="game-project-card">
          <div className="game-kicker">ACTIVE CHECKPOINT / {checkpoint.year}</div>
          <h2>{checkpoint.title}</h2>
          <p>{checkpoint.body}</p>
          <a href={checkpoint.link} target="_blank" rel="noreferrer">Visit Live Project / Repo ↗</a>
        </section>
      </div>
      {confetti && <div className="game-confetti" aria-hidden="true">{Array.from({ length: 28 }, (_, index) => <i key={index} style={{ left: `${(index * 37) % 100}%`, animationDelay: `${(index % 7) * 70}ms` }} />)}</div>}
      <div className="game-controls-hint" aria-label="World controls">WASD: Move/Drive · Space: Jump/Ascend · E: Ride/Interact · N: Namaste · Drag: Look · G: Auto-Guide</div>
    </>
  );
}

export default GameHUD;
