import * as THREE from 'three';
import type { LayerIndex } from '../store/useSystemStore';

export interface JourneyStop {
  id: 'sky' | 'deck' | 'truss' | 'river' | 'dive';
  layer: LayerIndex;
  position: [number, number, number];
  target: [number, number, number];
}

/**
 * Five evenly spaced stations. scroll.offset 0 -> first stop, 1 -> last stop.
 * Edit camera framing here, not in the rig.
 */
export const JOURNEY: readonly JourneyStop[] = [
  { id: 'sky', layer: 3, position: [0, 235, 260], target: [0, 135, 0] },
  { id: 'deck', layer: 2, position: [-80, 74, 105], target: [-80, 54, 0] },
  { id: 'truss', layer: 1, position: [-110, 42.8, 24], target: [-80, 42, 0] },
  { id: 'river', layer: 0, position: [35, 3.2, 46], target: [0, 35, 0] },
  { id: 'dive', layer: 0, position: [-35, -28, 12], target: [-35, -18, 0] },
];

const SEGMENTS = JOURNEY.length - 1;
const camPath = new THREE.CatmullRomCurve3(JOURNEY.map((stop) => new THREE.Vector3(...stop.position)), false, 'catmullrom', 0.5);
const lookPath = new THREE.CatmullRomCurve3(JOURNEY.map((stop) => new THREE.Vector3(...stop.target)), false, 'catmullrom', 0.5);

export function sampleJourney(
  progress: number,
  outPosition: THREE.Vector3,
  outTarget: THREE.Vector3,
): LayerIndex {
  const normalized = THREE.MathUtils.clamp(progress, 0, 1);
  const p = normalized * SEGMENTS;
  camPath.getPointAt(normalized, outPosition);
  lookPath.getPointAt(normalized, outTarget);

  const section = Math.min(JOURNEY.length - 1, Math.floor(p));
  return JOURNEY[section].layer;
}
