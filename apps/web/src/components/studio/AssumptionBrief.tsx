import { useAuditStore } from '@/store/auditStore';
export function AssumptionBrief() {
  const { ir } = useAuditStore();
  if (!ir) return null;
  return (
    <div className="p-5 border border-[#333538]/50 rounded-2xl bg-[#131314]">
      <h3 className="text-sm font-medium text-[#e3e3e3] mb-3">Assumptions</h3>
      <ul className="space-y-2 text-[13px] text-slate-300">
        {ir.assumptions.map((a,i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="text-blue-400 mt-0.5">•</span> {a}
          </li>
        ))}
      </ul>
    </div>
  );
}
