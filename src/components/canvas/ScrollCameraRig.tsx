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
  const setJourneyProgress = useSystemStore((state) => state.setJourneyProgress);
  const collectLayer = useSystemStore((state) => state.collectLayer);
  const prefersReducedMotion = usePrefersReducedMotion();

  const desiredPos = useMemo(() => new THREE.Vector3(), []);
  const desiredLook = useMemo(() => new THREE.Vector3(), []);
  const currentLook = useMemo(() => new THREE.Vector3(), []);
  const primed = useRef(false);
  const lastLayer = useRef<LayerIndex | null>(null);
  const lastElevation = useRef(Number.NaN);
  const lastProgress = useRef(Number.NaN);
  const mouse = useMemo(() => new THREE.Vector2(), []);

  useFrame((state, delta) => {
    if (mode === 'classic') return;

    const cam = state.camera;
    const offset = scroll.offset;
    const layer = sampleJourney(offset, desiredPos, desiredLook);

    if (!primed.current) {
      cam.position.copy(desiredPos);
      currentLook.copy(desiredLook);
      primed.current = true;
    }

    const alpha = prefersReducedMotion ? 1 : 1 - Math.exp(-CAMERA_DAMPING * delta);
    cam.position.lerp(desiredPos, alpha);
    currentLook.lerp(desiredLook, alpha);
    if (!prefersReducedMotion) {
      mouse.set(state.pointer.x, state.pointer.y);
      cam.position.x += mouse.x * 2;
      cam.position.y += mouse.y * 1.2 + Math.sin(state.clock.elapsedTime * 0.35) * 0.35;
    }
    cam.lookAt(currentLook);

    if (layer !== lastLayer.current) {
      lastLayer.current = layer;
      setActiveLayer(layer);
      if (layer >= 0) collectLayer(layer as 0 | 1 | 2 | 3);
    }
    if (Math.abs(cam.position.y - lastElevation.current) > ELEVATION_EPSILON) {
      lastElevation.current = cam.position.y;
      setElevation(cam.position.y);
    }
    if (Math.abs(offset - lastProgress.current) > 0.01) {
      lastProgress.current = offset;
      setJourneyProgress(offset);
    }
  });

  return null;
}
