import { Float } from '@react-three/drei';
import { useMemo } from 'react';
import * as THREE from 'three';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

type HologramAvatarProps = {
  model?: THREE.Object3D;
  position?: [number, number, number];
  scale?: number;
};

function AvatarSilhouette() {
  return (
    <group>
      <mesh position={[0, 4.8, 0]}>
        <sphereGeometry args={[1.25, 16, 16]} />
        <meshStandardMaterial
          color="#0EA5E9"
          emissive="#0EA5E9"
          emissiveIntensity={2}
          wireframe
          transparent
          opacity={0.4}
        />
      </mesh>
      <mesh position={[0, 2.4, 0]}>
        <capsuleGeometry args={[1.45, 3.2, 8, 16]} />
        <meshStandardMaterial
          color="#0EA5E9"
          emissive="#0EA5E9"
          emissiveIntensity={2}
          wireframe
          transparent
          opacity={0.4}
        />
      </mesh>
      {[
        [-2, 2.6, 0, 0, 0, -0.18],
        [2, 2.6, 0, 0, 0, 0.18],
        [-0.75, -0.8, 0, 0, 0, -0.08],
        [0.75, -0.8, 0, 0, 0, 0.08],
      ].map(([x, y, z, rx, ry, rz], index) => (
        <mesh key={index} position={[x, y, z]} rotation={[rx, ry, rz]}>
          <capsuleGeometry args={[0.38, 2.8, 6, 10]} />
          <meshStandardMaterial
            color="#0EA5E9"
            emissive="#0EA5E9"
            emissiveIntensity={2}
            wireframe
            transparent
            opacity={0.4}
          />
        </mesh>
      ))}
    </group>
  );
}

export function HologramAvatar({ model, position = [120, 8, -90], scale = 10 }: HologramAvatarProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const hologramModel = useMemo(() => {
    if (!model) return null;
    const clone = model.clone(true);
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshStandardMaterial({
          color: '#0EA5E9',
          emissive: '#0EA5E9',
          emissiveIntensity: 2,
          wireframe: true,
          transparent: true,
          opacity: 0.4,
        });
      }
    });
    return clone;
  }, [model]);

  return (
    <group name="Cristo_Rei_Hologram_Cliff">
      <mesh position={[position[0], position[1] - 4, position[2]]} rotation={[0, 0.2, 0]}>
        <coneGeometry args={[18, 8, 7]} />
        <meshStandardMaterial color="#263b4a" roughness={1} />
      </mesh>
      <Float
        speed={prefersReducedMotion ? 0 : 1.4}
        rotationIntensity={prefersReducedMotion ? 0 : 0.12}
        floatIntensity={prefersReducedMotion ? 0 : 0.65}
        floatingRange={[-0.35, 0.35]}
      >
        <group position={position} scale={scale}>
          {hologramModel ? <primitive object={hologramModel} /> : <AvatarSilhouette />}
        </group>
      </Float>
    </group>
  );
}

export default HologramAvatar;
