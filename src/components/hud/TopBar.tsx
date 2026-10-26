import { useSystemStore } from '../../store/useSystemStore';

export function TopBar() {
  const mode = useSystemStore((s) => s.mode);
  const setMode = useSystemStore((s) => s.setMode);
  const toggleSonar = useSystemStore((s) => s.toggleSonar);
  const activeLayer = useSystemStore((s) => s.activeLayer);
  const theme = useSystemStore((s) => s.theme);
  const toggleTheme = useSystemStore((s) => s.toggleTheme);

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] flex justify-between items-start gap-3 p-4 pointer-events-none">
      <div className="pointer-events-auto bg-[var(--glass)] border border-[var(--line)] backdrop-blur-md rounded-xl p-3 shadow-lg">
        <b className="block text-base tracking-wide">Suprim Tamang <span className="text-[var(--amber)]">/</span></b>
        <span className="text-xs text-[var(--mute)]">Systems · security · full-stack</span>
        <span className="mt-2 flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-[#7ee2a8]"><i className="h-1.5 w-1.5 rounded-full bg-[#7ee2a8]" /> Available for thoughtful builds</span>
      </div>
      <div className="flex gap-2 flex-wrap justify-end pointer-events-auto">
        <button
          type="button"
          onClick={toggleTheme}
          aria-pressed={theme === 'night'}
          className="bg-[var(--glass)] text-[var(--ink)] border border-[var(--line)] rounded-lg px-3 py-1.5 text-xs cursor-pointer backdrop-blur-md hover:border-[var(--amber)] hover:text-[var(--amber)]"
        >
          {theme === 'day' ? '☀ Day' : '☾ Night'}
        </button>
        {activeLayer === 0 && (
          <button
            onClick={toggleSonar}
            className="bg-[var(--glass)] text-[var(--ink)] border border-[var(--line)] rounded-lg px-3 py-1.5 text-xs cursor-pointer backdrop-blur-md hover:border-[var(--amber)] hover:text-[var(--amber)]"
          >
            Sonar / Wireframe
          </button>
        )}
        <button
          onClick={() => setMode(mode === 'classic' ? 'scroll' : 'classic')}
          className="bg-[var(--glass)] text-[var(--ink)] border border-[var(--line)] rounded-lg px-3 py-1.5 text-xs cursor-pointer backdrop-blur-md hover:border-[var(--amber)] hover:text-[var(--amber)]"
        >
          {mode === 'classic' ? 'Back to 3D' : 'Read the text version'}
        </button>
      </div>
    </div>
  );
}
export default TopBar;