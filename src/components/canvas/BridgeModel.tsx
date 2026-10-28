import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSystemStore, GANTRIES_DATA } from '../../store/useSystemStore';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

type Vec3 = [number, number, number];

const RED = '#C0392B';
const STEEL = '#c77b70';
const CONCRETE = '#e6e3dc';
const LEVELS = [0, 35, 70, 105, 140, 175, 188];
const BAYS = Array.from({ length: 43 }, (_, i) => -350 + i * 10);
const DASHES = Array.from({ length: 53 }, (_, i) => -348 + i * 8);

function Beam({ size, position, rotation = [0, 0, 0], color }: {
  size: Vec3;
  position: Vec3;
  rotation?: Vec3;
  color: string;
}) {
  return (
    <mesh position={position} rotation={rotation}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={0.8} metalness={0.1} />
    </mesh>
  );
}

function Tower({ x }: { x: number }) {
  return (
    <group name="Main_Tower_Pylon" position={[x, 0, 0]}>
      {[-9, 9].map((z) => <Beam key={z} size={[3, 190, 3]} position={[0, 95, z]} color={RED} />)}
      {LEVELS.slice(1).map((y) => <Beam key={y} size={[2.6, 3, 18]} position={[0, y, 0]} color={RED} />)}
      {LEVELS.slice(0, -1).flatMap((y0, i) => {
        const dy = LEVELS[i + 1] - y0;
        const len = Math.hypot(dy, 18);
        const angle = Math.atan2(18, dy);
        return [1, -1].map((sign) => (
          <mesh key={`${i}:${sign}`} position={[0, y0 + dy / 2, 0]} rotation={[sign * angle, 0, 0]}>
            <cylinderGeometry args={[0.5, 0.5, len, 6]} />
            <meshStandardMaterial color={RED} roughness={0.8} metalness={0.1} />
          </mesh>
        ));
      })}
      <mesh name="Foundation_Pier" position={[0, -7.5, 0]}>
        <boxGeometry args={[12, 25, 26]} />
        <meshStandardMaterial color={CONCRETE} roughness={0.9} />
      </mesh>
    </group>
  );
}

function Truss() {
  return (
    <group name="Steel_Truss_Frame">
      {[-6, 6].map((z) => (
        <group key={z} position={[0, 0, z]}>
          {[35, 50].map((y) => <Beam key={y} size={[420, 1, 1]} position={[-140, y, 0]} color={STEEL} />)}
          {BAYS.map((x) => <Beam key={x} size={[0.6, 15, 0.6]} position={[x, 42.5, 0]} color={STEEL} />)}
          {BAYS.slice(0, 42).map((x, i) => (
            <Beam
              key={`diagonal-${x}`}
              size={[0.5, Math.hypot(10, 15), 0.5]}
              position={[x + 5, 42.5, 0]}
              rotation={[0, 0, (i % 2 ? 1 : -1) * Math.atan(10 / 15)]}
              color={STEEL}
            />
          ))}
        </group>
      ))}
      <Beam size={[420, 0.6, 10]} position={[-140, 35.3, 0]} color="#2a2f35" />
    </group>
  );
}

function Deck() {
  return (
    <group name="Layer2_HighwayDeck">
      <Beam size={[420, 5, 22]} position={[-140, 52.5, 0]} color="#6b2a22" />
      <Beam size={[420, 0.3, 19]} position={[-140, 55.15, 0]} color="#1d2024" />
      {DASHES.map((x) => (
        <mesh key={x} position={[x, 55.35, 0]}>
          <boxGeometry args={[3, 0.05, 0.35]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.4} />
        </mesh>
      ))}
    </group>
  );
}

const cableY = (x: number) =>
  x >= -280
    ? x <= 0
      ? 62 + 113 * ((x + 140) / 140) ** 2
      : 57 + 118 * Math.max(0, 1 - x / 70) ** 1.6
    : 57 + 118 * Math.max(0, 1 - (-280 - x) / 70) ** 1.6;

function Cables() {
  const points = useMemo(() => {
    const result: THREE.Vector3[] = [];
    for (let x = -350; x <= 70; x += 10) result.push(new THREE.Vector3(x, cableY(x), 0));
    return result;
  }, []);
  const curve = useMemo(() => new THREE.CatmullRomCurve3(points), [points]);

  return (
    <group name="Main_Suspension_Cables">
      {[-11, 11].map((z) => (
        <group key={z} position={[0, 0, z]}>
          <mesh>
            <tubeGeometry args={[curve, 200, 0.45, 6, false]} />
            <meshStandardMaterial color={RED} roughness={0.8} />
          </mesh>
          {points.filter((point) => point.x !== 0 && point.x !== -280).map((point) => {
            const height = point.y - 55.3;
            return (
              <mesh key={point.x} position={[point.x, 55.3 + height / 2, 0]}>
                <cylinderGeometry args={[0.12, 0.12, height, 4]} />
                <meshStandardMaterial color="#d9a89f" roughness={0.8} />
              </mesh>
            );
          })}
        </group>
      ))}
    </group>
  );
}

export function BridgeModel() {
  const tokenAnomalyStatus = useSystemStore((s) => s.tokenAnomalyStatus);
  const openQuarantineModal = useSystemStore((s) => s.openQuarantineModal);
  const triggerToast = useSystemStore((s) => s.triggerToast);
  const setHoveredGantry = useSystemStore((s) => s.setHoveredGantry);
  const theme = useSystemStore((s) => s.theme);
  const prefersReducedMotion = usePrefersReducedMotion();
  const trainRef = useRef<THREE.Group>(null);
  const carsTrafficRef = useRef<THREE.Group[]>([]);
  const kiteRef = useRef<THREE.Mesh>(null);
  const beaconRef = useRef<THREE.Mesh>(null);
  const waterMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: 0x1c6b7a, transparent: true, opacity: 0.6, roughness: 0.3, side: THREE.DoubleSide }),
    []
  );
  const cityMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: 0xf0a04b, emissive: 0xf0a04b, emissiveIntensity: 2.5, toneMapped: false, roughness: 0.9 }),
    []
  );
  const steelMat = useMemo(() => new THREE.MeshStandardMaterial({ color: STEEL, roughness: 0.8, metalness: 0.2 }), []);
  const waterGeo = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(1600, 1600, 140, 140);
    geometry.rotateX(-Math.PI / 2);
    return geometry;
  }, []);
  const initialWaterPos = useMemo(() => Float32Array.from(waterGeo.attributes.position.array), [waterGeo]);
  const gantryGeo = useMemo(() => new THREE.PlaneGeometry(10, 3.1), []);
  const gantryCanvases = useMemo(() => GANTRIES_DATA.map((gantry) => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 160;
    const context = canvas.getContext('2d')!;
    const texture = new THREE.CanvasTexture(canvas);
    const draw = (active: boolean) => {
      context.fillStyle = active ? '#E59838' : '#0f5132';
      context.fillRect(0, 0, 512, 160);
      context.strokeStyle = active ? '#1A1412' : '#fff';
      context.lineWidth = 6;
      context.strokeRect(8, 8, 496, 144);
      context.fillStyle = active ? '#1A1412' : '#fff';
      context.textAlign = 'center';
      context.font = 'bold 46px sans-serif';
      context.fillText(gantry.code, 256, 62);
      context.font = 'bold 38px sans-serif';
      context.fillText(gantry.title, 256, 116);
      texture.needsUpdate = true;
    };
    draw(false);
    return { texture, draw };
  }), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    waterMat.color.lerp(new THREE.Color(theme === 'night' ? '#123b62' : '#2c91a0'), 0.04);
    waterMat.opacity = THREE.MathUtils.lerp(waterMat.opacity, theme === 'night' ? 0.72 : 0.6, 0.04);
    cityMat.emissiveIntensity = THREE.MathUtils.lerp(cityMat.emissiveIntensity, theme === 'night' ? 2.5 : 0.15, 0.04);
    const positions = waterGeo.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      const x = initialWaterPos[i * 3];
      const z = initialWaterPos[i * 3 + 2];
      positions.setY(i, prefersReducedMotion ? 0 : Math.sin(x * 0.08 + t) * 0.5 + Math.cos(z * 0.1 + t * 1.3) * 0.4);
    }
    positions.needsUpdate = true;
    if (trainRef.current && tokenAnomalyStatus !== 'quarantined') trainRef.current.position.x = ((t * 8) % 100) - 50;
    carsTrafficRef.current.forEach((car, index) => {
      const speed = (index % 2 === 0 ? 1 : -1) * 7;
      car.position.x = (((t * speed + index * 26) % 420) + 420) % 420 - 350;
    });
    if (kiteRef.current) {
      kiteRef.current.position.y = 184 + (prefersReducedMotion ? 0 : Math.sin(t * 1.2) * 1.2);
      kiteRef.current.rotation.z = prefersReducedMotion ? 0 : Math.sin(t * 0.9) * 0.2;
    }
    if (beaconRef.current) beaconRef.current.scale.setScalar(prefersReducedMotion ? 1 : 1 + 0.15 * Math.sin(t * 3));
  });

  return (
    <group>
      <mesh geometry={waterGeo} material={waterMat} />
      <group position={[0, 1, 0]}>
        <mesh><boxGeometry args={[10, 2, 3.2]} /><meshStandardMaterial color="#e5762f" /></mesh>
        <mesh position={[-1, 1.7, 0]}><boxGeometry args={[4, 1.6, 2.6]} /><meshStandardMaterial color="#ffffff" /></mesh>
      </group>

      <group position={[0, 41, 0]} ref={trainRef}>
        <mesh position={[-13, 0, 0]} material={steelMat}><boxGeometry args={[11, 4, 4.2]} /></mesh>
        <mesh
          position={[0, 0, 0]}
          onClick={(event) => {
            event.stopPropagation();
            if (tokenAnomalyStatus === 'active') openQuarantineModal();
          }}
          onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
          onPointerOut={() => { document.body.style.cursor = ''; }}
        >
          <boxGeometry args={[11, 4, 4.2]} />
          <meshStandardMaterial
            color={tokenAnomalyStatus === 'quarantined' ? 0x2ecc71 : 0xc0392b}
            emissive={tokenAnomalyStatus === 'quarantined' ? 0x0a5a2a : 0xaa0000}
            emissiveIntensity={tokenAnomalyStatus === 'quarantined' ? 0.5 : 0.8}
            metalness={0.4}
          />
        </mesh>
        <mesh position={[13, 0, 0]} material={steelMat}><boxGeometry args={[11, 4, 4.2]} /></mesh>
      </group>

      {Array.from({ length: 14 }, (_, i) => (
        <mesh key={`city-${i}`} position={[-250 + i * 38, 6 + (i % 3) * 3, i % 2 ? -75 : 72]} material={cityMat}>
          <boxGeometry args={[22, 12 + (i % 4) * 5, 16]} />
        </mesh>
      ))}

      <Tower x={0} />
      <Tower x={-280} />
      <Truss />
      <Deck />
      <Cables />
      {Array.from({ length: 10 }, (_, index) => (
        <group
          key={`traffic-${index}`}
          ref={(group) => {
            if (group) carsTrafficRef.current[index] = group;
          }}
          position={[-350 + index * 36, 56, index % 2 === 0 ? -6 : 6]}
        >
          <mesh>
            <boxGeometry args={[7, 1.2, 2.4]} />
            <meshStandardMaterial
              color={index % 2 === 0 ? '#d97745' : '#e5e7eb'}
              emissive={index % 2 === 0 ? '#6b251b' : '#3b4652'}
              emissiveIntensity={theme === 'night' ? 1.5 : 0.2}
              toneMapped={false}
            />
          </mesh>
          <mesh position={[0, 0.7, 0]}>
            <boxGeometry args={[3, 0.45, 2]} />
            <meshStandardMaterial color="#17202a" roughness={0.45} />
          </mesh>
        </group>
      ))}

      {GANTRIES_DATA.map((_, i) => {
        const x = -9 + i * 18;
        return (
          <group key={i} position={[x, 63.5, 0]}>
            <mesh
              geometry={gantryGeo}
              onPointerOver={() => {
                document.body.style.cursor = 'pointer';
                setHoveredGantry(i);
                gantryCanvases[i].draw(true);
              }}
              onPointerOut={() => {
                document.body.style.cursor = '';
                setHoveredGantry(null);
                gantryCanvases[i].draw(false);
              }}
            >
              <meshBasicMaterial map={gantryCanvases[i].texture} side={THREE.DoubleSide} />
            </mesh>
          </group>
        );
      })}

      <mesh ref={beaconRef} position={[0, 192, 0]}>
        <sphereGeometry args={[1.6, 16, 16]} />
        <meshBasicMaterial color={0xffb347} />
      </mesh>
      <mesh
        ref={kiteRef}
        position={[9, 184, 2]}
        onClick={(event) => {
          event.stopPropagation();
          triggerToast('Namaste from Kathmandu 🪁');
        }}
        onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { document.body.style.cursor = ''; }}
      >
        <octahedronGeometry args={[1.2]} />
        <meshStandardMaterial color={0xe59838} emissive={0x553300} />
      </mesh>
    </group>
  );
}

export default BridgeModel;
