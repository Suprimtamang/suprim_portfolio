import { SceneCanvas } from './components/canvas/SceneCanvas';
import { TopBar } from './components/hud/TopBar';
import { ElevationMeter } from './components/hud/ElevationMeter';
import { LayerCards } from './components/hud/LayerCards';
import { ClassicView } from './components/hud/ClassicView';
import { SajuroQuarantineModal } from './components/simulations/SajuroQuarantineModal';
import { useSystemStore } from './store/useSystemStore';

export default function App() {
  const mode = useSystemStore((s) => s.mode);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0B0C0E] text-[#EDE6DC]">
      <TopBar />
      <ElevationMeter />
      
      {/* Invisible spacer for scroll tour mode */}
      {mode === 'scroll' && <div id="spacer" className="absolute top-0 left-0 w-full h-[600vh] pointer-events-none" />}

      <SceneCanvas />
      <LayerCards />
      <ClassicView />
      <SajuroQuarantineModal />
    </div>
  );
}