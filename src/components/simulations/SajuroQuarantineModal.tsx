import { useEffect } from 'react';
import { useSystemStore } from '../../store/useSystemStore';

export function SajuroQuarantineModal() {
  const status = useSystemStore((s) => s.tokenAnomalyStatus);
  const quarantineToken = useSystemStore((s) => s.quarantineToken);
  const closeQuarantineModal = useSystemStore((s) => s.closeQuarantineModal);

  useEffect(() => {
    if (status !== 'inspecting') return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeQuarantineModal();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [status, closeQuarantineModal]);

  if (status !== 'inspecting') return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 bg-black/35 z-50" onClick={closeQuarantineModal}>
      <div role="dialog" aria-modal="true" aria-labelledby="anomaly-title" className="w-[min(420px,100%)] bg-[#0a0e12]/95 border border-[var(--red)] p-5 rounded-xl backdrop-blur-md shadow-2xl" onClick={(event) => event.stopPropagation()}>
      <div className="flex items-start justify-between gap-4">
        <div id="anomaly-title" className="text-[11px] tracking-widest uppercase text-[#ff8c7e]">Graph API token anomaly</div>
        <button type="button" aria-label="Close anomaly dialog" onClick={closeQuarantineModal} className="text-[var(--mute)] hover:text-[var(--ink)] cursor-pointer">×</button>
      </div>
      <pre className="my-3 font-mono text-xs text-[#ff8c7e] whitespace-pre-wrap leading-relaxed bg-black/40 p-3 rounded">
        {`Scope:     ads_management
Source IP: unauthorized
Status:    ACTIVE — traffic paused`}
      </pre>
      <button
        type="button"
        autoFocus
        onClick={quarantineToken}
        className="bg-[var(--glass)] border border-[var(--line)] text-[var(--ink)] hover:border-[var(--amber)] hover:text-[var(--amber)] px-3 py-1.5 rounded-lg text-xs font-mono cursor-pointer"
      >
        [ Quarantine Token ]
      </button>
      <small className="block mt-3 text-[11px] text-[var(--mute)]">Interactive demo with illustrative data. No live tokens are used.</small>
      </div>
    </div>
  );
}
export default SajuroQuarantineModal;