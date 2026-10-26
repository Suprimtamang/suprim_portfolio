import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSystemStore } from '../../store/useSystemStore';

export function CameraRig() {
  const mode = useSystemStore((s) => s.mode);
  const setActiveLayer = useSystemStore((s) => s.setActiveLayer);
  const setElevation = useSystemStore((s) => s.setElevation);

  // High-frequency animation refs (avoiding React re-renders on every frame)
  const ssRef = useRef(0);
  const blRef = useRef(1);
  const mouseRef = useRef({ x: 0, y: 0 });
  const orbitRef = useRef({ az: 0.6, el: 0.2, rad: 230 });
  const pointersRef = useRef<Map<number, [number, number]>>(new Map());

  // Spline Curves for Scroll Tour
  const posCurve = useRef(
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, -8, 18),
      new THREE.Vector3(6, 42, 8),
      new THREE.Vector3(-12, 60, 22),
      new THREE.Vector3(0, 195, 25),
    ])
  ).current;

  const targetCurve = useRef(
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, -5, 0),
      new THREE.Vector3(-10, 41, 0),
      new THREE.Vector3(0, 56, 0),
      new THREE.Vector3(0, 188, 0),
    ])
  ).current;

  const aerialTarget = new THREE.Vector3(-30, 90, 0);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.1);
    const isAerial = mode === 'aerial';

    // 1. Target blend factor (1 for aerial, 0 for scroll tour)
    const targetBl = isAerial ? 1 : 0;
    blRef.current += (targetBl - blRef.current) * Math.min(1, 2.5 * dt);
    const bl = blRef.current;

    // 2. Compute Scroll Tour Progress (if not in aerial mode)
    let s = 0;
    if (!isAerial) {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      s = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;
    }
    ssRef.current += (s - ssRef.current) * Math.min(1, 4 * dt);
    const ss = ssRef.current;

    // 3. Sample Scroll Spline using uniform arc-length (getPointAt)
    const pScroll = posCurve.getPointAt(ss);
    pScroll.x += mouseRef.current.x * 1.5 * (1 - bl);
    pScroll.y += mouseRef.current.y * (1 - bl);
    const tScroll = targetCurve.getPointAt(ss);

    // 4. Compute Spherical Aerial Orbit Position
    const { az, el, rad } = orbitRef.current;
    const ce = Math.cos(el);
    const pAerial = new THREE.Vector3(
      aerialTarget.x + rad * Math.sin(az) * ce,
      aerialTarget.y + rad * Math.sin(el),
      aerialTarget.z + rad * Math.cos(az) * ce
    );

    // 5. Blend Camera Position and LookAt
    state.camera.position.copy(pScroll.clone().lerp(pAerial, bl));
    const currentLook = tScroll.clone().lerp(aerialTarget, bl);
    state.camera.lookAt(currentLook);

    // 6. Update elevation & active layer in store
    const currentY = state.camera.position.y;
    const clampedAlt = Math.min(190, Math.max(-20, currentY));
    setElevation(clampedAlt);

    if (!isAerial) {
      const li = ss < 0.25 ? 0 : ss < 0.55 ? 1 : ss < 0.8 ? 2 : 3;
      setActiveLayer(li);
    }
  });

  return null;
}
export default CameraRig;