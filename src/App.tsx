import { SceneCanvas } from './components/canvas/SceneCanvas';
import { TopBar } from './components/hud/TopBar';
import { ElevationMeter } from './components/hud/ElevationMeter';
import { LayerCards } from './components/hud/LayerCards';
import { ClassicView } from './components/hud/ClassicView';
import { SajuroQuarantineModal } from './components/simulations/SajuroQuarantineModal';
import { ScrollJourneyHUD } from './components/hud/ScrollJourneyHUD';
import { SkyMilestones } from './components/hud/SkyMilestones';

export default function App() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0B0C0E] text-[#EDE6DC]">
      <TopBar />
      <ElevationMeter />
      
      <SceneCanvas />
      <ScrollJourneyHUD />
      <SkyMilestones />
      <LayerCards />
      <ClassicView />
      <SajuroQuarantineModal />
    </div>
  );
}