import { useEffect, useRef, useState } from 'react';
import type { PointerEvent } from 'react';
import './LightSwitchOverlay.css';

const STORAGE_KEY = 'suprim_lights_on';
const PULL_THRESHOLD = 120;
const DEFAULT_CORD_LENGTH = 264;

interface CordPhysics {
  position: number;
  velocity: number;
  target: number;
  dragging: boolean;
}

function getInitialLightsState() {
  return typeof window !== 'undefined' && window.sessionStorage.getItem(STORAGE_KEY) === 'true';
}

export function LightSwitchOverlay() {
  const [lightsOn, setLightsOn] = useState(getInitialLightsState);
  const [pullDistance, setPullDistance] = useState(0);
  const [flickering, setFlickering] = useState(false);
  const physicsRef = useRef<CordPhysics>({ position: 0, velocity: 0, target: 0, dragging: false });
  const dragStartRef = useRef(0);
  const sequenceStartedRef = useRef(false);

  useEffect(() => {
    let frame = 0;
    let previousTime = 0;

    const animateCord = (time: number) => {
      const physics = physicsRef.current;
      const delta = previousTime === 0 ? 1 : Math.min(2, (time - previousTime) / 16.67);
      previousTime = time;

      const springForce = (physics.target - physics.position) * 0.18;
      physics.velocity = (physics.velocity + springForce * delta) * Math.pow(0.76, delta);
      physics.position = Math.max(0, physics.position + physics.velocity * delta);

      if (physics.position < 0.08 && !physics.dragging && physics.target === 0) {
        physics.position = 0;
        physics.velocity = 0;
      }

      setPullDistance(physics.position);
      frame = window.requestAnimationFrame(animateCord);
    };

    frame = window.requestAnimationFrame(animateCord);
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const playClick = () => {
    navigator.vibrate?.(12);
    const AudioContextConstructor = window.AudioContext;
    if (!AudioContextConstructor) return;

    const audio = new AudioContextConstructor();
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(740, audio.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(260, audio.currentTime + 0.055);
    gain.gain.setValueAtTime(0.045, audio.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.065);
    oscillator.connect(gain);
    gain.connect(audio.destination);
    oscillator.start();
    oscillator.stop(audio.currentTime + 0.07);
    oscillator.addEventListener('ended', () => void audio.close(), { once: true });
  };

  const turnLightsOn = () => {
    if (lightsOn || sequenceStartedRef.current) return;
    sequenceStartedRef.current = true;
    physicsRef.current.target = 0;
    physicsRef.current.dragging = false;
    playClick();
    setFlickering(true);

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.setTimeout(() => {
      window.sessionStorage.setItem(STORAGE_KEY, 'true');
      setLightsOn(true);
      setFlickering(false);
      sequenceStartedRef.current = false;
    }, reducedMotion ? 50 : 1080);
  };

  const toggleLights = () => {
    if (lightsOn) {
      window.sessionStorage.removeItem(STORAGE_KEY);
      setLightsOn(false);
      setFlickering(false);
      sequenceStartedRef.current = false;
      physicsRef.current.position = 0;
      physicsRef.current.velocity = 0;
      physicsRef.current.target = 0;
      setPullDistance(0);
      return;
    }

    turnLightsOn();
  };

  const handlePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    if (lightsOn || sequenceStartedRef.current) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragStartRef.current = event.clientY;
    physicsRef.current.dragging = true;
    physicsRef.current.target = 0;
  };

  const handlePointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    if (!physicsRef.current.dragging || lightsOn) return;
    const distance = Math.max(0, event.clientY - dragStartRef.current);
    physicsRef.current.target = distance;
    if (distance >= PULL_THRESHOLD) turnLightsOn();
  };

  const handlePointerUp = () => {
    if (!physicsRef.current.dragging) return;
    physicsRef.current.dragging = false;
    physicsRef.current.target = 0;
    if (pullDistance >= PULL_THRESHOLD) turnLightsOn();
  };

  const cordEnd = DEFAULT_CORD_LENGTH + pullDistance;

  return (
    <>
      <button
        aria-label={lightsOn ? 'Turn off the studio lights' : 'Turn on the studio lights'}
        aria-pressed={lightsOn}
        className={`light-switch-chain ${lightsOn ? 'is-on' : 'is-off'}`}
        onClick={toggleLights}
        type="button"
      >
        <svg aria-hidden="true" viewBox="0 0 24 48">
          <path d="M12 0v34" />
          <circle cx="12" cy="39" r="4" />
        </svg>
        <span>💡 Lights {lightsOn ? 'On' : 'Off'}</span>
      </button>

      <div
        aria-hidden={lightsOn}
        className={`light-switch-overlay ${lightsOn ? 'is-revealed' : ''} ${flickering ? 'is-flickering' : ''}`}
      >
        <div aria-hidden="true" className="light-switch-beam" />
        <svg
          aria-hidden="true"
          className="light-switch-lamp"
          preserveAspectRatio="xMidYMin meet"
          viewBox={`0 0 180 ${Math.max(420, cordEnd + 90)}`}
        >
          <defs>
            <linearGradient id="lamp-metal" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0" stopColor="#f4f0e5" />
              <stop offset=".48" stopColor="#aaa99f" />
              <stop offset="1" stopColor="#65645e" />
            </linearGradient>
            <linearGradient id="lamp-shade" x1="0" x2="0.9" y1="0" y2="1">
              <stop offset="0" stopColor="#5b5b59" />
              <stop offset=".45" stopColor="#272726" />
              <stop offset="1" stopColor="#111110" />
            </linearGradient>
          </defs>
          <path className="lamp-ceiling-plate" d="M68 0h44v8H68z" />
          <path className="lamp-stem" d="M87 7h6v30h-6z" />
          <path className="lamp-shade" d="M57 35h66l-12 25H69z" />
          <path className="lamp-shade-rim" d="M69 59h42" />
          <path className="lamp-bulb" d="M84 60h12l-2 8h-8z" />
          <path
            className="lamp-cord"
            d={`M90 66 C84 119 97 155 90 205 C86 229 90 247 90 ${cordEnd}`}
          />
          <path className="lamp-cord-highlight" d={`M92 68 C88 122 99 155 93 204`} />
          <ellipse className="lamp-handle-ring" cx="90" cy={cordEnd} rx="8" ry="3" />
        </svg>
        <button
          aria-label="Pull the light switch cord to reveal the portfolio"
          className="light-switch-handle"
          onClick={turnLightsOn}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          style={{ top: `${cordEnd}px` }}
          type="button"
        >
          <span className="light-switch-handle__loop" />
          <span className="light-switch-handle__weight" />
          <span className="light-switch-handle__hint">PULL TO BEGIN</span>
        </button>
        <p className="light-switch-prompt">A little light before we begin.</p>
        <span aria-live="polite" className="light-switch-status">
          {flickering ? 'LIGHTS ON' : 'PULL THE CORD'}
        </span>
      </div>
    </>
  );
}
