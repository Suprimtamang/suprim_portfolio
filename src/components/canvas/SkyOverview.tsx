import { useMemo } from 'react';
import { Text } from '@react-three/drei';

export function SkyOverview() {
  const clouds = useMemo(() => Array.from({ length: 10 }, (_, index) => ({
    position: [index * 45 - 200, 125 + (index % 3) * 22, index % 2 ? 80 : -75] as [number, number, number],
    scale: 12 + (index % 3) * 5,
  })), []);

  return (
    <group>
      <Text
        position={[0, 225, 0]}
        fontSize={8}
        color="#f8fafc"
        letterSpacing={0.25}
        fillOpacity={0.65}
        material-fog
        anchorX="center"
        anchorY="middle"
      >
        CAREER / ABOVE THE TAGUS
      </Text>
      {clouds.map((cloud, index) => (
        <mesh key={index} position={cloud.position} scale={cloud.scale}>
          <sphereGeometry args={[1, 16, 12]} />
          <meshBasicMaterial color="#dbeafe" transparent opacity={0.16} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}
