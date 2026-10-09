import { useAuditStore } from '@/store/auditStore';
export function RiskLedger() {
  const { ir } = useAuditStore();
  if (!ir) return null;
  return (
    <div className="p-5 border border-[#333538]/50 rounded-2xl bg-[#131314]">
      <h3 className="text-sm font-medium text-[#e3e3e3] mb-4">Risk Ledger</h3>
      <div className="space-y-3">
        {ir.risks.map(r => (
          <div key={r.id} className="text-[13px] bg-[#1e1f22] p-3 rounded-xl border border-[#333538]/30">
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${r.severity === 'critical' ? 'bg-red-500/20 text-red-400' : r.severity === 'high' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'}`}>
                {r.severity}
              </span>
              <span className="font-medium text-[#e3e3e3]">{r.title}</span>
            </div>
            <p className="text-slate-400 mt-1">{r.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
