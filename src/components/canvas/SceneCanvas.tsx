import { Canvas } from '@react-three/fiber';
import { CameraRig } from './CameraRig';
import { BridgeModel } from './BridgeModel';

export function SceneCanvas() {
  return (
    <div className="fixed inset-0 w-screen h-screen">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 2, 6], fov: 55, near: 0.1, far: 2500 }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={['#071A24']} />
        <fog attach="fog" args={['#071A24', 5, 35]} />
        <hemisphereLight color="#ffd9b0" groundColor="#0d2b3e" intensity={0.95} />
        <directionalLight position={[60, 120, 80]} intensity={1.1} color="#ffc48a" />
        
        <CameraRig />
        <BridgeModel />
      </Canvas>
    </div>
  );
}