import { useAuditStore } from '@/store/auditStore';
export function HealthScore() {
  const { ir } = useAuditStore();
  if (!ir) return null;
  const { score, grade } = ir.meta.health;
  return (
    <div className="p-5 border border-[#333538]/50 rounded-2xl bg-[#131314] flex justify-between items-center hover:border-[#444649] transition-colors">
      <div>
        <h3 className="text-sm font-medium text-[#e3e3e3] mb-1 flex items-center gap-2">Architecture Health</h3>
        <div className="text-3xl font-semibold text-[#e3e3e3]">{score}<span className="text-sm text-slate-500 font-normal ml-1">/100</span></div>
      </div>
      <div className={`text-4xl font-bold ${grade === 'A' || grade === 'B' ? 'text-emerald-400' : grade === 'C' ? 'text-amber-400' : 'text-red-400'}`}>{grade}</div>
    </div>
  );
}
