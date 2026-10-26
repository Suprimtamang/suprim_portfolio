import { useSystemStore } from '../../store/useSystemStore';

export function TopBar() {
  const mode = useSystemStore((s) => s.mode);
  const setMode = useSystemStore((s) => s.setMode);
  const toggleSonar = useSystemStore((s) => s.toggleSonar);
  const activeLayer = useSystemStore((s) => s.activeLayer);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-between items-start gap-3 p-4 pointer-events-none">
      <div className="pointer-events-auto bg-[var(--glass)] border border-[var(--line)] backdrop-blur-md rounded-xl p-3">
        <b className="block text-base tracking-wide">Suprim Tamang</b>
        <span className="text-xs text-[var(--mute)]">Ponte 25 de Abril · System Stack</span>
      </div>
      <div className="flex gap-2 flex-wrap justify-end pointer-events-auto">
        {activeLayer === 0 && (
          <button
            onClick={toggleSonar}
            className="bg-[var(--glass)] text-[var(--ink)] border border-[var(--line)] rounded-lg px-3 py-1.5 text-xs cursor-pointer backdrop-blur-md hover:border-[var(--amber)] hover:text-[var(--amber)]"
          >
            [ Toggle Sonar / Wireframe ]
          </button>
        )}
        <button
          onClick={() => setMode(mode === 'aerial' ? 'scroll' : 'aerial')}
          className="bg-[var(--glass)] text-[var(--ink)] border border-[var(--line)] rounded-lg px-3 py-1.5 text-xs cursor-pointer backdrop-blur-md hover:border-[var(--amber)] hover:text-[var(--amber)]"
        >
          {mode === 'aerial' ? '[ Scroll Tour ]' : '[ Aerial View ]'}
        </button>
        <button
          onClick={() => setMode(mode === 'classic' ? 'aerial' : 'classic')}
          className="bg-[var(--glass)] text-[var(--ink)] border border-[var(--line)] rounded-lg px-3 py-1.5 text-xs cursor-pointer backdrop-blur-md hover:border-[var(--amber)] hover:text-[var(--amber)]"
        >
          {mode === 'classic' ? '[ 3D View ]' : '[ Classic View ]'}
        </button>
      </div>
    </div>
  );
}
export default TopBar;