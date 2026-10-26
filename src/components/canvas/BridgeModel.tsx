import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSystemStore, GANTRIES_DATA } from '../../store/useSystemStore';

export function BridgeModel() {
  const sonarMode = useSystemStore((s) => s.sonarMode);
  const tokenAnomalyStatus = useSystemStore((s) => s.tokenAnomalyStatus);
  const openQuarantineModal = useSystemStore((s) => s.openQuarantineModal);
  const triggerToast = useSystemStore((s) => s.triggerToast);
  const setHoveredGantry = useSystemStore((s) => s.setHoveredGantry);

  // Animation refs
  const trainRef = useRef<THREE.Group>(null);
  const carsTrafficRef = useRef<THREE.Group[]>([]);
  const kiteRef = useRef<THREE.Mesh>(null);
  const beaconRef = useRef<THREE.Mesh>(null);
  const pierRef = useRef<THREE.Mesh>(null);

  // Materials & Colors
  const RED = 0xc0392b;
  const STEEL = 0x8f98a0;
  const AMB = 0xe59838;

  const redMat = useMemo(() => new THREE.MeshStandardMaterial({ color: RED, roughness: 0.8, metalness: 0.1 }), []);
  const steelMat = useMemo(() => new THREE.MeshStandardMaterial({ color: STEEL, roughness: 0.8, metalness: 0.2 }), []);
  const waterMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: 0x1c6b7a, transparent: true, opacity: 0.6, roughness: 0.3, side: THREE.DoubleSide }),
    []
  );

  // Water Geometry for Vertex Wave Animation
  const waterGeo = useMemo(() => {
    const g = new THREE.PlaneGeometry(1600, 1600, 140, 140);
    g.rotateX(-Math.PI / 2);
    return g;
  }, []);
  const initialWaterPos = useMemo(() => Float32Array.from(waterGeo.attributes.position.array), [waterGeo]);

  // Canvas textures for Highway Gantries
  const gantryCanvases = useMemo(() => {
    return GANTRIES_DATA.map((g, i) => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 160;
      const ctx = canvas.getContext('2d')!;
      const texture = new THREE.CanvasTexture(canvas);

      const draw = (on: boolean) => {
        ctx.fillStyle = on ? '#E59838' : '#0f5132';
        ctx.fillRect(0, 0, 512, 160);
        ctx.strokeStyle = on ? '#1A1412' : '#fff';
        ctx.lineWidth = 6;
        ctx.strokeRect(8, 8, 496, 144);
        ctx.fillStyle = on ? '#1A1412' : '#fff';
        ctx.textAlign = 'center';
        ctx.font = 'bold 46px sans-serif';
        ctx.fillText(g.code, 256, 62);
        ctx.font = 'bold 38px sans-serif';
        ctx.fillText(g.title, 256, 116);
        texture.needsUpdate = true;
      };

      draw(false);
      return { texture, draw };
    });
  }, []);

  // Frame Loop for Animations (Wave displacement, train, traffic cars, kite)
  useFrame((_, delta) => {
    const t = _.clock.elapsedTime;

    // 1. Water waves vertex displacement
    const posAttr = waterGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const x = initialWaterPos[i * 3];
      const z = initialWaterPos[i * 3 + 2];
      posAttr.setY(i, Math.sin(x * 0.08 + t) * 0.5 + Math.cos(z * 0.1 + t * 1.3) * 0.4);
    }
    posAttr.needsUpdate = true;

    // 2. Train movement (pauses if quarantined)
    if (trainRef.current && tokenAnomalyStatus !== 'quarantined') {
      trainRef.current.position.x = ((t * 8) % 100) - 50;
    }

    // 3. Highway traffic cars
    carsTrafficRef.current.forEach((carGroup, idx) => {
      if (carGroup) {
        const speed = (idx % 2 === 0 ? 1 : -1) * 7;
        const offset = idx * 26;
        carGroup.position.x = (((t * speed + offset) % 420) + 420) % 420 - 350;
      }
    });

    // 4. Kite & Beacon animation
    if (kiteRef.current) {
      kiteRef.current.position.y = 184 + Math.sin(t * 1.2) * 1.2;
      kiteRef.current.rotation.z = Math.sin(t * 0.9) * 0.2;
    }
    if (beaconRef.current) {
      beaconRef.current.scale.setScalar(1 + 0.15 * Math.sin(t * 3));
    }
  });

  return (
    <group>
      {/* ---------- LAYER 0: Sub-surface Tagus & Foundations ---------- */}
      <mesh geometry={waterGeo} material={waterMat} position={[0, 0, 0]} />
      
      {/* Foundation Pier */}
      <mesh
        ref={pierRef}
        position={[0, -7.5, 0]}
        material-wireframe={sonarMode}
        material-color={sonarMode ? '#0fae6e' : '#e6e3dc'}
      >
        <boxGeometry args={[12, 25, 26]} />
      </mesh>
      <mesh position={[-280, -7.5, 0]} material={pierRef.current?.material}>
        <boxGeometry args={[12, 25, 26]} />
      </mesh>

      {/* Cacilheiro Ferry */}
      <group position={[0, 1, 0]}>
        <mesh position={[0, 0, 0]} material={new THREE.MeshStandardMaterial({ color: 0xe5762f })}>
          <boxGeometry args={[10, 2, 3.2]} />
        </mesh>
        <mesh position={[-1, 1.7, 0]} material={new THREE.MeshStandardMaterial({ color: 0xffffff })}>
          <boxGeometry args={[4, 1.6, 2.6]} />
        </mesh>
      </group>

      {/* ---------- LAYER 1: Warren Truss & Fertagus Train ---------- */}
      <group position={[0, 41, 0]} ref={trainRef}>
        {/* Car 1 (Valid) */}
        <mesh position={[-13, 0, 0]} material={steelMat}>
          <boxGeometry args={[11, 4, 4.2]} />
        </mesh>

        {/* Car 2 (Anomalous Token Car - Clickable for Sajuro Simulation) */}
        <mesh
          position={[0, 0, 0]}
          onClick={(e) => {
            e.stopPropagation();
            if (tokenAnomalyStatus === 'active') openQuarantineModal();
          }}
          onPointerOver={() => {
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            document.body.style.cursor = '';
          }}
        >
          <boxGeometry args={[11, 4, 4.2]} />
          <meshStandardMaterial
            color={tokenAnomalyStatus === 'quarantined' ? 0x2ecc71 : 0xc0392b}
            emissive={tokenAnomalyStatus === 'quarantined' ? 0x0a5a2a : 0xaa0000}
            emissiveIntensity={tokenAnomalyStatus === 'quarantined' ? 0.5 : 0.8}
            metalness={0.4}
          />
        </mesh>

        {/* Car 3 (Valid) */}
        <mesh position={[13, 0, 0]} material={steelMat}>
          <boxGeometry args={[11, 4, 4.2]} />
        </mesh>
      </group>

      {/* ---------- LAYER 2: Towers & Upper Road Deck ---------- */}
      {/* Twin Towers */}
      {[-9, 9].map((z) => (
        <group key={z}>
          <mesh position={[0, 95, z]} geometry={new THREE.BoxGeometry(3, 190, 3)} material={redMat} />
          <mesh position={[-280, 95, z]} geometry={new THREE.BoxGeometry(3, 190, 3)} material={redMat} />
        </group>
      ))}

      {/* Highway Road Deck */}
      <mesh position={[-140, 52.5, 0]} material={new THREE.MeshStandardMaterial({ color: 0x6b2a22, roughness: 0.8 })}>
        <boxGeometry args={[420, 5, 22]} />
      </mesh>
      <mesh position={[-140, 55.15, 0]} material={new THREE.MeshStandardMaterial({ color: 0x1d2024, roughness: 0.9 })}>
        <boxGeometry args={[420, 0.3, 19]} />
      </mesh>

      {/* Simplify Highway Gantries */}
      {GANTRIES_DATA.map((_, i) => {
        const x = -9 + i * 18;
        return (
          <group key={i} position={[x, 63.5, 0]}>
            <mesh
              geometry={new THREE.PlaneGeometry(10, 3.1)}
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
              <meshBasicMaterial map={gantryCanvases[i].texture} />
            </mesh>
          </group>
        );
      })}

      {/* ---------- LAYER 3: Tower Summit & Kite ---------- */}
      {/* Beacon */}
      <mesh ref={beaconRef} position={[0, 192, 0]}>
        <sphereGeometry args={[1.6, 16, 16]} />
        <meshBasicMaterial color={0xffb347} />
      </mesh>

      {/* Nepali Kite Easter Egg */}
      <mesh
        ref={kiteRef}
        position={[9, 184, 2]}
        onClick={(e) => {
          e.stopPropagation();
          triggerToast('Namaste from Kathmandu 🪁');
        }}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = '';
        }}
      >
        <octahedronGeometry args={[1.2]} />
        <meshStandardMaterial color={AMB} emissive={0x553300} />
      </mesh>
    </group>
  );
}
export default BridgeModel;