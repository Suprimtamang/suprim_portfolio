import { useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect } from 'react';
import * as THREE from 'three';
import { useSystemStore } from '../../store/useSystemStore';

const skyPos = new THREE.Vector3(0, 235, 260);
const skyTarget = new THREE.Vector3(0, 135, 0);
const bridgePos = new THREE.Vector3(-80, 74, 105);
const bridgeTarget = new THREE.Vector3(-80, 54, 0);
const trainPos = new THREE.Vector3(-110, 42.8, 24);
const trainTarget = new THREE.Vector3(-80, 42, 0);
const boatPos = new THREE.Vector3(35, 3.2, 46);
const boatTarget = new THREE.Vector3(0, 35, 0);
const subPos = new THREE.Vector3(-35, -28, 12);
const subTarget = new THREE.Vector3(-35, -18, 0);

export function ScrollCameraRig() {
  const scroll = useScroll();
  const mode = useSystemStore((state) => state.mode);
  const setActiveLayer = useSystemStore((state) => state.setActiveLayer);
  const setElevation = useSystemStore((state) => state.setElevation);

  useEffect(() => {
    scroll.el.scrollTop = 0;
    scroll.el.dispatchEvent(new Event('scroll'));
    setActiveLayer(3);
  }, [scroll.el, setActiveLayer]);

  useFrame((state) => {
    if (mode === 'classic') return;

    // scroll.offset goes from 0.0 (top) to 1.0 (bottom).
    const offset = scroll.offset;

    if (offset < 0.25) {
      state.camera.position.lerpVectors(skyPos, bridgePos, offset * 4);
    } else if (offset < 0.5) {
      state.camera.position.lerpVectors(bridgePos, trainPos, (offset - 0.25) * 4);
    } else if (offset < 0.75) {
      state.camera.position.lerpVectors(trainPos, boatPos, (offset - 0.5) * 4);
    } else {
      state.camera.position.lerpVectors(boatPos, subPos, (offset - 0.75) * 4);
    }

    const target = new THREE.Vector3();
    if (offset < 0.25) {
      target.lerpVectors(skyTarget, bridgeTarget, offset * 4);
    } else if (offset < 0.5) {
      target.lerpVectors(bridgeTarget, trainTarget, (offset - 0.25) * 4);
    } else if (offset < 0.75) {
      target.lerpVectors(trainTarget, boatTarget, (offset - 0.5) * 4);
    } else {
      target.lerpVectors(boatTarget, subTarget, (offset - 0.75) * 4);
    }
    state.camera.lookAt(target);
    setActiveLayer(offset < 0.2 ? 3 : offset < 0.4 ? 2 : offset < 0.65 ? 1 : 0);
    setElevation(state.camera.position.y);
  });

  return null;
}
