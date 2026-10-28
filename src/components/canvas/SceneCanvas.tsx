import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { useRef } from 'react';
import * as THREE from 'three';
import { BridgeModel } from './BridgeModel';
import { SkyOverview } from './SkyOverview';
import { ScrollJourney } from './ScrollJourney';
import { HologramAvatar } from './HologramAvatar';
import { useSystemStore } from '../../store/useSystemStore';
import { InteractiveWorld } from './InteractiveWorld';

function DayNightEnvironment() {
  const theme = useSystemStore((s) => s.theme);
  const { scene } = useThree();
  const sunRef = useRef<THREE.DirectionalLight>(null);
  const hemiRef = useRef<THREE.HemisphereLight>(null);
  const sunDiscRef = useRef<THREE.Mesh>(null);
  const nightRef = useRef<THREE.Mesh>(null);
  const sunPointRef = useRef<THREE.PointLight>(null);
  const daySky = useRef(new THREE.Color('#74b9e8')).current;
  const nightSky = useRef(new THREE.Color('#0F172A')).current;
  const dayFog = useRef(new THREE.Color('#74b9e8')).current;
  const nightFog = useRef(new THREE.Color('#0F172A')).current;
  const sunColor = useRef(new THREE.Color('#fff1b0')).current;
  const moonColor = useRef(new THREE.Color('#c7d8ff')).current;

  useFrame((_, delta) => {
    const amount = 1 - Math.exp(-delta * 2.5);
    const night = theme === 'night';
    const background = scene.background as THREE.Color;
    const fog = scene.fog as THREE.Fog;
    background.lerp(night ? nightSky : daySky, amount);
    fog.color.lerp(night ? nightFog : dayFog, amount);
    if (sunRef.current) {
      sunRef.current.intensity = THREE.MathUtils.lerp(sunRef.current.intensity, night ? 0.34 : 1.1, amount);
      sunRef.current.color.lerp(night ? moonColor : sunColor, amount);
    }
    if (hemiRef.current) {
      hemiRef.current.intensity = THREE.MathUtils.lerp(hemiRef.current.intensity, night ? 0.38 : 0.95, amount);
    }
    if (nightRef.current) nightRef.current.visible = night;
    if (sunDiscRef.current) sunDiscRef.current.visible = !night;
    if (sunPointRef.current) sunPointRef.current.intensity = THREE.MathUtils.lerp(sunPointRef.current.intensity, night ? 0 : 220, amount);
  });

  return (
    <>
      <hemisphereLight ref={hemiRef} color="#ffd9b0" groundColor="#0d2b3e" intensity={0.95} />
      <directionalLight ref={sunRef} position={[60, 160, 80]} intensity={1.4} color="#ffc48a" />
      <mesh ref={sunDiscRef} position={[120, 170, -180]}>
        <sphereGeometry args={[14, 32, 32]} />
        <meshBasicMaterial color={sunColor} toneMapped={false} />
      </mesh>
      <pointLight ref={sunPointRef} position={[120, 170, -180]} color="#ffd37a" intensity={220} distance={900} decay={2} />
      <mesh ref={nightRef} position={[-120, 175, -170]}>
        <sphereGeometry args={[18, 32, 32]} />
        <meshBasicMaterial color={moonColor} toneMapped={false} />
      </mesh>
      <pointLight position={[-120, 175, -170]} color="#9ab8ff" intensity={80} distance={850} decay={2} />
    </>
  );
}

export function SceneCanvas() {
  const theme = useSystemStore((s) => s.theme);

  return (
    <div className="fixed inset-0 w-screen h-screen">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 2, 6], fov: 55, near: 0.1, far: 2500 }}
        gl={{ antialias: true, alpha: false }}
        onCreated={({ gl }) => gl.setClearColor('#071A24', 1)}
      >
        <color attach="background" args={['#74b9e8']} />
        <fog attach="fog" args={['#74b9e8', 180, 900]} />
        <ScrollJourney damping={0.25}>
          <DayNightEnvironment />
          <BridgeModel />
          <InteractiveWorld />
          <SkyOverview />
          <HologramAvatar />
        </ScrollJourney>
        <EffectComposer enabled={theme === 'night'}>
          <Bloom intensity={1.5} luminanceThreshold={1} mipmapBlur />
        </EffectComposer>
      </Canvas>
    </div>
  );
}