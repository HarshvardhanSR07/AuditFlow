import { useAuditStore } from '@/store/auditStore';

export function SourcesPanel() {
  const { ir, setSelectedNode } = useAuditStore();
  if (!ir) return null;

  return (
    <div className="flex flex-col h-full bg-[#050505]">
      <div className="px-4 py-3 border-b border-[#1a1a1a]">
        <input 
          type="text" 
          placeholder="FILTER_NODES..." 
          className="w-full bg-transparent border-b border-[#333] text-[11px] mono-text py-1 outline-none focus:border-white transition-colors text-[#ccc] placeholder:text-[#444]" 
        />
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
        <ul className="space-y-[2px]">
          {ir.nodes.map(n => (
            <li 
              key={n.id} 
              onClick={() => setSelectedNode(n.id)} 
              className="group flex items-center justify-between text-[11px] mono-text px-2 py-1.5 cursor-pointer hover:bg-[#1a1a1a] transition-colors"
            >
              <span className="truncate text-[#888] group-hover:text-white transition-colors">{n.label}</span>
              <span className="shrink-0 text-[9px] text-[#333] group-hover:text-[#666]">[{n.riskLevel.charAt(0).toUpperCase()}]</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
