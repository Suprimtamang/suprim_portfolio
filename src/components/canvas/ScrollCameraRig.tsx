import { useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { sampleJourney } from '../../scene/journey';
import { useSystemStore, type LayerIndex } from '../../store/useSystemStore';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

const CAMERA_DAMPING = 3.5;
const ELEVATION_EPSILON = 0.25;

export function ScrollCameraRig() {
  const scroll = useScroll();
  const mode = useSystemStore((state) => state.mode);
  const setActiveLayer = useSystemStore((state) => state.setActiveLayer);
  const setElevation = useSystemStore((state) => state.setElevation);
  const prefersReducedMotion = usePrefersReducedMotion();

  const desiredPos = useMemo(() => new THREE.Vector3(), []);
  const desiredLook = useMemo(() => new THREE.Vector3(), []);
  const currentLook = useMemo(() => new THREE.Vector3(), []);
  const primed = useRef(false);
  const lastLayer = useRef<LayerIndex | null>(null);
  const lastElevation = useRef(Number.NaN);

  useFrame((state, delta) => {
    if (mode === 'classic') return;

    const cam = state.camera;
    const layer = sampleJourney(scroll.offset, desiredPos, desiredLook);

    if (!primed.current) {
      cam.position.copy(desiredPos);
      currentLook.copy(desiredLook);
      primed.current = true;
    }

    const alpha = prefersReducedMotion ? 1 : 1 - Math.exp(-CAMERA_DAMPING * delta);
    cam.position.lerp(desiredPos, alpha);
    currentLook.lerp(desiredLook, alpha);
    cam.lookAt(currentLook);

    if (layer !== lastLayer.current) {
      lastLayer.current = layer;
      setActiveLayer(layer);
    }
    if (Math.abs(cam.position.y - lastElevation.current) > ELEVATION_EPSILON) {
      lastElevation.current = cam.position.y;
      setElevation(cam.position.y);
    }
  });

  return null;
}
