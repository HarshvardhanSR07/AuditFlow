import { useAuditStore } from '@/store/auditStore';

export function RisksAssumptions() {
  const { ir } = useAuditStore();
  if (!ir) return null;

  return (
    <div className="flex h-full">
      <div className="w-1/3 border-r border-[#1a1a1a] p-6">
        <h3 className="text-[10px] mono-text text-[#555] uppercase tracking-widest mb-4">Health & Integrity</h3>
        <div className="flex items-baseline gap-2 mb-2">
          <span className={`text-6xl font-light tracking-tighter ${ir.meta.health.grade === 'A' || ir.meta.health.grade === 'B' ? 'text-emerald-500' : ir.meta.health.grade === 'C' ? 'text-amber-500' : 'text-red-500'}`}>
            {ir.meta.health.grade}
          </span>
          <span className="text-xl text-[#666]">/ {ir.meta.health.score}</span>
        </div>
        <p className="text-xs text-[#888] leading-relaxed">
          System integrity score calculated via AST density and LLM structural analysis.
        </p>
      </div>
      
      <div className="w-1/3 border-r border-[#1a1a1a] p-6">
        <h3 className="text-[10px] mono-text text-[#555] uppercase tracking-widest mb-4">Risk Ledger</h3>
        <ul className="space-y-4">
          {ir.risks.map(r => (
            <li key={r.id} className="border-l-2 pl-3 border-[#333]">
              <div className="flex items-center gap-2 mb-1 text-[10px] mono-text uppercase">
                <span className={r.severity === 'critical' ? 'text-red-500' : r.severity === 'high' ? 'text-amber-500' : 'text-blue-500'}>[{r.severity}]</span>
                <span className="text-[#ccc]">{r.title}</span>
              </div>
              <p className="text-[11px] text-[#666] leading-relaxed">{r.description}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="w-1/3 p-6">
        <h3 className="text-[10px] mono-text text-[#555] uppercase tracking-widest mb-4">Assumptions & Artifacts</h3>
        <ul className="space-y-3 list-square pl-4 text-xs text-[#888] marker:text-[#444]">
          {ir.assumptions.map((a, i) => (
            <li key={i} className="leading-relaxed">{a}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
