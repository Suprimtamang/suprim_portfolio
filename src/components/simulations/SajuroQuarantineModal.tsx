import { useSystemStore } from '../../store/useSystemStore';

export function SajuroQuarantineModal() {
  const status = useSystemStore((s) => s.tokenAnomalyStatus);
  const quarantineToken = useSystemStore((s) => s.quarantineToken);

  if (status !== 'inspecting') return null;

  return (
    <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(420px,calc(100vw-32px))] bg-[#0a0e12]/92 border border-[var(--red)] p-5 rounded-xl z-50 backdrop-blur-md shadow-2xl">
      <div className="text-[11px] tracking-widest uppercase text-[#ff8c7e]">Graph API token anomaly</div>
      <pre className="my-3 font-mono text-xs text-[#ff8c7e] whitespace-pre-wrap leading-relaxed bg-black/40 p-3 rounded">
        {`Scope:     ads_management
Source IP: unauthorized
Status:    ACTIVE — traffic paused`}
      </pre>
      <button
        onClick={quarantineToken}
        className="bg-[var(--glass)] border border-[var(--line)] text-[var(--ink)] hover:border-[var(--amber)] hover:text-[var(--amber)] px-3 py-1.5 rounded-lg text-xs font-mono cursor-pointer"
      >
        [ Quarantine Token ]
      </button>
      <small className="block mt-3 text-[11px] text-[var(--mute)]">Simulation only — no real tokens or data.</small>
    </div>
  );
}
export default SajuroQuarantineModal;