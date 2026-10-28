import { SceneCanvas } from './components/canvas/SceneCanvas';
import { TopBar } from './components/hud/TopBar';
import { ElevationMeter } from './components/hud/ElevationMeter';
import { ClassicView } from './components/hud/ClassicView';
import { SajuroQuarantineModal } from './components/simulations/SajuroQuarantineModal';
import { ScrollJourneyHUD } from './components/hud/ScrollJourneyHUD';
import { GameHUD } from './components/hud/GameHUD';
import { MiniGames } from './components/hud/MiniGames';

export default function App() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0B0C0E] text-[#EDE6DC]">
      <TopBar />
      <ElevationMeter />
      
      <SceneCanvas />
      <ScrollJourneyHUD />
      <GameHUD />
      <MiniGames />
      <ClassicView />
      <SajuroQuarantineModal />
    </div>
  );
}