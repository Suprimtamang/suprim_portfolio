import { useEffect, useMemo, useRef, useState } from 'react';
import { useSystemStore } from '../../store/useSystemStore';

type GameMode = 'defense' | 'kite' | null;
type Token = { id: number; bad: boolean; x: number };

const scrollTo = (progress: number) => {
  const element = document.querySelector<HTMLElement>('[aria-label="Scroll through the cinematic bridge journey"]');
  if (element) element.scrollTo({ top: progress * (element.scrollHeight - element.clientHeight), behavior: 'smooth' });
};

function readNumber(key: string) {
  const value = Number(localStorage.getItem(key));
  return Number.isFinite(value) ? value : 0;
}

function DefenseGame({ onClose }: { onClose: () => void }) {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [quarantined, setQuarantined] = useState(0);
  const [passed, setPassed] = useState(0);
  const [seconds, setSeconds] = useState(30);
  const [finished, setFinished] = useState(false);
  const nextId = useRef(0);
  const best = readNumber('sajuro-best-score');

  useEffect(() => {
    const spawn = window.setInterval(() => {
      const bad = Math.random() < 0.32;
      setTokens((current) => [...current.slice(-7), { id: nextId.current++, bad, x: -8 }]);
    }, 650);
    const move = window.setInterval(() => {
      setTokens((current) => {
        const passedTokens = current.filter((token) => token.x >= 94);
        if (passedTokens.length) setPassed((value) => value + passedTokens.length);
        return current.filter((token) => token.x < 94).map((token) => ({ ...token, x: token.x + 5 }));
      });
    }, 250);
    const timer = window.setInterval(() => setSeconds((value) => Math.max(0, value - 1)), 1000);
    return () => { clearInterval(spawn); clearInterval(move); clearInterval(timer); };
  }, []);

  useEffect(() => {
    if (seconds !== 0 || finished) return;
    setFinished(true);
    const score = quarantined * 10;
    localStorage.setItem('sajuro-best-score', String(Math.max(best, score)));
    localStorage.setItem('sajuro-quarantined-count', String(readNumber('sajuro-quarantined-count') + quarantined));
  }, [best, finished, quarantined, seconds]);

  const quarantine = (id: number) => {
    setTokens((current) => current.filter((token) => token.id !== id));
    setQuarantined((value) => value + 1);
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.code !== 'Space' || finished) return;
      event.preventDefault();
      const target = tokens.find((token) => token.bad && token.x > 45);
      if (target) quarantine(target.id);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const uptime = Math.max(0, Math.round(((30 - passed) / 30) * 100));
  return (
    <section className="mini-game-panel" role="dialog" aria-modal="true" aria-labelledby="defense-title">
      <div className="mini-game-header"><span className="game-kicker">TRUSS LAYER / SAJURO SANDBOX</span><button type="button" onClick={onClose} aria-label="Close mini-game">×</button></div>
      <h2 id="defense-title">🛡️ Quarantine the Rogue Tokens</h2>
      <p className="mini-game-copy">Green traffic is legitimate. Click or press Space when a red token reaches the shield.</p>
      <div className="mini-game-stats"><span>QUARANTINED <b>{quarantined}</b></span><span>UPTIME <b>{uptime}%</b></span><span>BEST SCORE <b>{best}</b></span><span>TIME <b>{seconds}s</b></span></div>
      <div className="token-lane" aria-label="Sajuro token stream">
        <div className="token-cable" /><div className="token-shield">🛡️</div><div className="token-server">SERVER</div>
        {tokens.map((token) => <button key={token.id} type="button" className={`api-token ${token.bad ? 'is-rogue' : 'is-legit'}`} style={{ left: `${token.x}%` }} onClick={() => token.bad && quarantine(token.id)} aria-label={token.bad ? 'Quarantine rogue token' : 'Legitimate API token'}>{token.bad ? '●' : '●'}</button>)}
      </div>
      {finished && <div className="mini-game-result"><strong>100% Resolution Quality!</strong><span>You protected the infrastructure like Sajuro.</span><button type="button" onClick={onClose}>Return to the bridge</button></div>}
    </section>
  );
}

function KiteGame({ onClose }: { onClose: () => void }) {
  const [pulling, setPulling] = useState(false);
  const [height, setHeight] = useState(50);
  const [score, setScore] = useState(0);
  const [rivals, setRivals] = useState([20, 50, 78]);
  const [finished, setFinished] = useState(false);
  const started = useRef(Date.now());
  const best = readNumber('kite-best-score');

  useEffect(() => {
    const frame = window.setInterval(() => {
      setHeight((value) => Math.max(8, Math.min(92, value + (pulling ? -3 : 2))));
      setRivals((values) => values.map((value) => (value + (Math.random() - 0.5) * 8 + 100) % 100));
      if (Date.now() - started.current > 30000) setFinished(true);
    }, 250);
    return () => clearInterval(frame);
  }, [pulling]);

  useEffect(() => {
    if (!finished) return;
    localStorage.setItem('kite-best-score', String(Math.max(best, score)));
  }, [best, finished, score]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.code === 'Space') { event.preventDefault(); setPulling(event.type === 'keydown'); }
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('keyup', onKey);
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('keyup', onKey); };
  }, []);

  const kiteStyle = useMemo(() => ({ left: `${height}%`, bottom: `${height}%` }), [height]);
  const cut = () => {
    const target = rivals.find((rival) => Math.abs(rival - height) < 12);
    if (!target) return;
    setScore((value) => value + 100);
    setRivals((values) => values.filter((value) => value !== target));
  };

  return (
    <section className="mini-game-panel kite-game-panel" role="dialog" aria-modal="true" aria-labelledby="kite-title">
      <div className="mini-game-header"><span className="game-kicker">TOWER SUMMIT / DASHain WIND</span><button type="button" onClick={onClose} aria-label="Close mini-game">×</button></div>
      <h2 id="kite-title">🪁 Fly a Kite over the Tagus</h2>
      <p className="mini-game-copy">Hold Click or Space to pull the manjha and dive. Release to climb. Align with a rival and cut its string — Chait!</p>
      <div className="kite-stats"><span>SCORE <b>{score}</b></span><span>BEST <b>{best}</b></span><span>RIVALS <b>{rivals.length}</b></span></div>
      <div className="kite-sky" onPointerDown={() => setPulling(true)} onPointerUp={() => setPulling(false)} onPointerLeave={() => setPulling(false)} onClick={cut}>
        <div className="kite-horizon">PONTE 25 DE ABRIL · TAGUS · CRISTO REI</div>
        <div className="player-kite" style={kiteStyle}>◆</div>
        {rivals.map((rival) => <div key={rival} className="rival-kite" style={{ left: `${rival}%`, bottom: `${rival}%` }}>◇</div>)}
        <div className="kite-string" style={{ left: `${height}%` }} />
      </div>
      {finished && <div className="mini-game-result"><strong>Chait! {score > 0 ? 'Beautiful cut.' : 'The wind wins this round.'}</strong><span>Your Tagus kite run is saved to your local scoreboard.</span><div><button type="button" onClick={() => window.location.reload()}>Fly Again</button><button type="button" onClick={onClose}>Land on Bridge</button></div></div>}
    </section>
  );
}

export function MiniGames() {
  const mode = useSystemStore((state) => state.mode);
  const activeLayer = useSystemStore((state) => state.activeLayer);
  const [game, setGame] = useState<GameMode>(null);
  useEffect(() => {
    if (mode === 'classic') setGame(null);
  }, [mode]);
  if (mode !== 'scroll') return null;
  if (game === 'defense') return <DefenseGame onClose={() => setGame(null)} />;
  if (game === 'kite') return <KiteGame onClose={() => setGame(null)} />;
  return (
    <div className="mini-game-launchers" aria-label="Bridge mini-games">
      {activeLayer === 1 && <button type="button" onClick={() => { scrollTo(0.5); setGame('defense'); }}>🛡️ Defend the Graph API</button>}
      {activeLayer === 3 && <button type="button" onClick={() => { scrollTo(0); setGame('kite'); }}>🪁 Fly a Kite over the Tagus</button>}
    </div>
  );
}

export default MiniGames;
