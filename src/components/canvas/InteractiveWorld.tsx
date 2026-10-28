import { Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useSystemStore } from '../../store/useSystemStore';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

type Checkpoint = {
  layer: 1 | 2 | 3;
  position: [number, number, number];
  label: string;
  color: string;
};

const CHECKPOINTS: Checkpoint[] = [
  { layer: 2, position: [-180, 57, 0], label: 'Simplify 2024', color: '#f0a04b' },
  { layer: 1, position: [-80, 44, 0], label: 'Sajuro AdSecOps 2025', color: '#ef806a' },
  { layer: 3, position: [20, 57, 0], label: 'Cloud & Community 2026', color: '#8bd5ff' },
];

function VoxelAvatar({ waving, submerged }: { waving: boolean; submerged: boolean }) {
  const armRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (armRef.current) armRef.current.rotation.z = waving ? Math.sin(clock.elapsedTime * 9) * 0.65 : 0;
  });
  return (
    <group scale={submerged ? 0.8 : 1}>
      <mesh position={[0, 1.2, 0]}><boxGeometry args={[0.7, 0.9, 0.5]} /><meshStandardMaterial color="#0ea5e9" emissive="#073b58" emissiveIntensity={0.6} /></mesh>
      <mesh position={[0, 2, 0]}><boxGeometry args={[0.58, 0.58, 0.58]} /><meshStandardMaterial color="#c98d68" /></mesh>
      <mesh position={[0, 2.38, 0]}><boxGeometry args={[0.7, 0.16, 0.7]} /><meshStandardMaterial color="#c83e2b" /></mesh>
      <mesh position={[-0.48, 1.2, 0]}><boxGeometry args={[0.18, 0.72, 0.18]} /><meshStandardMaterial color="#f0a04b" /></mesh>
      <group ref={armRef} position={[0.48, 1.42, 0]}><mesh position={[0, -0.22, 0]}><boxGeometry args={[0.18, 0.72, 0.18]} /><meshStandardMaterial color="#f0a04b" /></mesh></group>
      <mesh position={[0, 1.1, -0.38]}><boxGeometry args={[0.65, 0.85, 0.18]} /><meshStandardMaterial color="#17202a" /></mesh>
      <mesh position={[-0.2, 0.55, 0]}><boxGeometry args={[0.18, 0.5, 0.2]} /><meshStandardMaterial color="#1f2937" /></mesh>
      <mesh position={[0.2, 0.55, 0]}><boxGeometry args={[0.18, 0.5, 0.2]} /><meshStandardMaterial color="#1f2937" /></mesh>
    </group>
  );
}

function Tram({ boarded }: { boarded: boolean }) {
  return (
    <group position={[-325, 58, 0]} scale={boarded ? 1.08 : 1}>
      <mesh><boxGeometry args={[8, 3.2, 3.2]} /><meshStandardMaterial color="#f3c342" roughness={0.55} /></mesh>
      <mesh position={[0, 0.9, 0]}><boxGeometry args={[6.5, 1.1, 3.25]} /><meshStandardMaterial color="#fff4cc" /></mesh>
      {[-2.2, 0, 2.2].map((x) => <mesh key={x} position={[x, 0.8, 1.66]}><boxGeometry args={[1.3, 0.7, 0.05]} /><meshStandardMaterial color="#19384a" emissive="#8bd5ff" emissiveIntensity={1.5} /></mesh>)}
      {[-2.4, 2.4].map((x) => <mesh key={x} position={[x, -1.7, 0]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.55, 0.55, 0.3, 12]} /><meshStandardMaterial color="#20252b" /></mesh>)}
      <Text position={[0, 2.2, 0]} fontSize={0.65} color="#fff4cc" anchorX="center">CARRIS</Text>
    </group>
  );
}

function CheckpointKiosk({ checkpoint, onVisit }: { checkpoint: Checkpoint; onVisit: () => void }) {
  return (
    <group position={checkpoint.position} onClick={(event) => { event.stopPropagation(); onVisit(); }}>
      <mesh position={[0, 1.2, 0]}><boxGeometry args={[1.6, 2.4, 0.7]} /><meshStandardMaterial color="#102b3b" emissive={checkpoint.color} emissiveIntensity={1.5} /></mesh>
      <mesh position={[0, 1.45, 0.38]}><boxGeometry args={[1.1, 0.75, 0.05]} /><meshBasicMaterial color={checkpoint.color} toneMapped={false} /></mesh>
      <Text position={[0, 2.9, 0]} fontSize={0.55} color={checkpoint.color} anchorX="center">{checkpoint.label}</Text>
      <pointLight color={checkpoint.color} intensity={4} distance={8} />
    </group>
  );
}

function KernelStructures() {
  const packet = useRef<THREE.Mesh>(null);
  const portal = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const time = clock.elapsedTime;
    if (packet.current) packet.current.position.x = -65 + ((time * 3) % 12);
    if (portal.current) portal.current.rotation.z = time * 0.6;
  });
  return (
    <group>
      <group position={[-80, -35, -8]}>
        {[-5, 0, 5].map((x, index) => <group key={x} position={[x, index % 2, 0]}><mesh><boxGeometry args={[3, 2.2, 2]} /><meshStandardMaterial color="#063c51" emissive="#00d9ff" emissiveIntensity={1.7} wireframe /></mesh><Text position={[0, 1.6, 0]} fontSize={0.55} color="#8beaff" anchorX="center">{['inode', 'fs_ls', 'fs_write'][index]}</Text></group>)}
        <mesh ref={packet} position={[-5, 1, 1.2]}><sphereGeometry args={[0.35, 8, 8]} /><meshBasicMaterial color="#fff38a" toneMapped={false} /></mesh>
      </group>
      <group position={[-25, -33, -5]}>
        {[[-4, -2], [4, -2], [0, 2], [0, 6]].map(([x, y]) => <mesh key={`${x}-${y}`} position={[x, y, 0]}><sphereGeometry args={[0.8, 12, 12]} /><meshStandardMaterial color="#67e8f9" emissive="#00b8d4" emissiveIntensity={2} /></mesh>)}
        {[-2, 2, 4].map((y) => <mesh key={y} position={[0, y, 0]} rotation={[0, 0, y === 4 ? Math.PI / 2 : y < 0 ? -0.35 : 0.35]}><cylinderGeometry args={[0.12, 0.12, 5, 8]} /><meshBasicMaterial color="#67e8f9" /></mesh>)}
        <Text position={[0, 7.5, 0]} fontSize={0.6} color="#67e8f9" anchorX="center">Java AVL Tree</Text>
      </group>
      <group position={[35, -34, -4]}>
        <mesh ref={portal}><torusGeometry args={[4, 0.45, 12, 32]} /><meshStandardMaterial color="#a78bfa" emissive="#7c3aed" emissiveIntensity={2} /></mesh>
        <Text position={[0, -5.2, 0]} fontSize={0.6} color="#c4b5fd" anchorX="center">OCaml Lambda Portal</Text>
      </group>
    </group>
  );
}

export function InteractiveWorld() {
  const player = useRef<THREE.Group>(null);
  const velocityY = useRef(0);
  const keys = useRef(new Set<string>());
  const tramPrompted = useRef(false);
  const guideTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const [waving, setWaving] = useState(false);
  const [boarded, setBoarded] = useState(false);
  const [showSubmarine, setShowSubmarine] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const triggerToast = useSystemStore((state) => state.triggerToast);
  const collectLayer = useSystemStore((state) => state.collectLayer);
  const setFocusedLayer = useSystemStore((state) => state.setFocusedLayer);
  const journeyProgress = useSystemStore((state) => state.journeyProgress);

  const checkpointDistances = useMemo(() => CHECKPOINTS.map((checkpoint) => new THREE.Vector3(...checkpoint.position)), []);

  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      keys.current.add(event.key.toLowerCase());
      if (event.code === 'Space') event.preventDefault();
      if (event.key.toLowerCase() === 'n') {
        setWaving(true);
        window.setTimeout(() => setWaving(false), 900);
      }
      if (event.key.toLowerCase() === 'e' && player.current) {
        const distance = player.current.position.distanceTo(new THREE.Vector3(-325, 58, 0));
        if (distance < 3) {
          setBoarded((value) => !value);
          triggerToast(boarded ? 'You stepped off the Lisbon Tram.' : 'Lisbon Tram boarded — ride speed increased!');
        }
      }
      if (event.key.toLowerCase() === 'g') {
        const element = document.querySelector<HTMLElement>('[aria-label="Scroll through the cinematic bridge journey"]');
        if (guideTimer.current) clearInterval(guideTimer.current);
        let stop = 0;
        const stops = [0, 0.25, 0.5, 0.75, 1];
        const move = () => element?.scrollTo({ top: (element.scrollHeight - element.clientHeight) * stops[stop], behavior: 'smooth' });
        move();
        guideTimer.current = setInterval(() => {
          stop += 1;
          if (stop >= stops.length) {
            if (guideTimer.current) clearInterval(guideTimer.current);
            guideTimer.current = null;
            return;
          }
          move();
        }, 5000);
        triggerToast('Auto-guide engaged — visiting every checkpoint.');
      }
    };
    const up = (event: KeyboardEvent) => keys.current.delete(event.key.toLowerCase());
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
      if (guideTimer.current) clearInterval(guideTimer.current);
    };
  }, [boarded, triggerToast]);

  useFrame((_, delta) => {
    if (!player.current) return;
    const moving = keys.current.has('w') || keys.current.has('arrowup') || keys.current.has('s') || keys.current.has('arrowdown') || keys.current.has('a') || keys.current.has('arrowleft') || keys.current.has('d') || keys.current.has('arrowright');
    const speed = boarded ? 26 : 12;
    if (keys.current.has('w') || keys.current.has('arrowup')) player.current.position.x += speed * delta;
    if (keys.current.has('s') || keys.current.has('arrowdown')) player.current.position.x -= speed * delta;
    if (keys.current.has('a') || keys.current.has('arrowleft')) player.current.position.z = THREE.MathUtils.damp(player.current.position.z, -8, 8, delta);
    if (keys.current.has('d') || keys.current.has('arrowright')) player.current.position.z = THREE.MathUtils.damp(player.current.position.z, 8, 8, delta);
    player.current.position.x = THREE.MathUtils.clamp(player.current.position.x, -345, 55);
    const nearTram = player.current.position.distanceTo(new THREE.Vector3(-325, 58, 0)) < 3;
    if (nearTram && !boarded && !tramPrompted.current) {
      tramPrompted.current = true;
      triggerToast("There's a Lisbon Tram beside you. Press E or walk up to ride!");
    }
    if (!nearTram) tramPrompted.current = false;
    if (!moving && !reducedMotion) player.current.rotation.y += Math.sin(performance.now() * 0.002) * 0.001;
    if (keys.current.has(' ') && player.current.position.y <= 57.1) velocityY.current = boarded ? 0 : 10;
    velocityY.current -= 25 * delta;
    player.current.position.y += velocityY.current * delta;
    const journeyDive = journeyProgress > 0.75;
    const diveAmount = journeyDive ? (journeyProgress - 0.75) * 4 : 0;
    const targetY = THREE.MathUtils.lerp(57.1, -40, diveAmount);
    player.current.position.y = THREE.MathUtils.damp(player.current.position.y, targetY, 8, delta);
    const underwater = player.current.position.y < 0;
    if (underwater !== showSubmarine) setShowSubmarine(underwater);
    if (underwater) player.current.position.y = Math.max(player.current.position.y, -40);
    else if (!journeyDive) player.current.position.y = Math.max(player.current.position.y, 57.1);
    checkpointDistances.forEach((point, index) => {
      if (player.current && player.current.position.distanceTo(point) < 6) {
        const checkpoint = CHECKPOINTS[index];
        setFocusedLayer(checkpoint.layer);
        collectLayer(checkpoint.layer);
      }
    });
  });

  const visit = (checkpoint: Checkpoint) => {
    setFocusedLayer(checkpoint.layer);
    collectLayer(checkpoint.layer);
    triggerToast(`${checkpoint.label} checkpoint unlocked.`);
  };

  return (
    <>
      <group ref={player} position={[-315, 57.1, 4]}>
        {showSubmarine ? <group><mesh><sphereGeometry args={[1.7, 12, 8]} /><meshStandardMaterial color="#f3c342" emissive="#d97706" emissiveIntensity={1.5} /></mesh><mesh position={[1.4, 0, 0]}><sphereGeometry args={[0.4, 8, 8]} /><meshBasicMaterial color="#fff3a3" /></mesh><mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[2.8, 0.08, 8, 32]} /><meshBasicMaterial color="#67e8f9" transparent opacity={0.6} /></mesh></group> : <VoxelAvatar waving={waving} submerged={showSubmarine} />}
      </group>
      <Tram boarded={boarded} />
      <mesh
        position={[-140, 57.15, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        onPointerDown={(event) => {
          event.stopPropagation();
          if (player.current) player.current.position.x = THREE.MathUtils.clamp(event.point.x, -345, 55);
        }}
      >
        <planeGeometry args={[420, 18]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      {CHECKPOINTS.map((checkpoint) => <CheckpointKiosk key={checkpoint.label} checkpoint={checkpoint} onVisit={() => visit(checkpoint)} />)}
      <KernelStructures />
    </>
  );
}

export default InteractiveWorld;
