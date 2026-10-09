import { ReactFlow, Background, Controls, Node, Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useAuditStore } from '@/store/auditStore';
import { useMemo } from 'react';
import dagre from 'dagre';

const getLayout = (ns: Node[], es: Edge[]) => {
  const g = new dagre.graphlib.Graph(); g.setGraph({ rankdir: 'LR' }); g.setDefaultEdgeLabel(() => ({}));
  ns.forEach(n => g.setNode(n.id, { width: 200, height: 60 }));
  es.forEach(e => g.setEdge(e.source, e.target));
  dagre.layout(g);
  return ns.map(n => { const pos = g.node(n.id); n.position = { x: pos.x - 100, y: pos.y - 30 }; return n; });
};

export function ArchitectureMap() {
  const { ir, setSelectedNode } = useAuditStore();
  const { nodes, edges } = useMemo(() => {
    if (!ir) return { nodes:[], edges:[] };
    const initialNodes: Node[] = ir.nodes.map(n => ({ 
      id: n.id, 
      data: { label: n.label }, 
      position: {x:0,y:0}, 
      className: `px-4 py-2 border border-[#1a1a1a] text-[10px] mono-text uppercase tracking-wider bg-black text-[#ededed] rounded-none shadow-none ${n.riskLevel === 'critical' || n.riskLevel === 'high' ? 'border-red-500/50' : ''}` 
    }));
    const initialEdges: Edge[] = ir.edges.map(e => ({ id: e.id, source: e.source, target: e.target, style: { stroke: '#333', strokeWidth: 1 } }));
    return { nodes: getLayout(initialNodes, initialEdges), edges: initialEdges };
  }, [ir]);
  
  if (!ir) return null;
  return ( 
    <div className="w-full h-full bg-[#020202]"> 
      <ReactFlow nodes={nodes} edges={edges} onNodeClick={(_,n)=>setSelectedNode(n.id)} fitView> 
        <Background color="#111" gap={20} /> 
        <Controls className="bg-black border-[#1a1a1a] fill-white rounded-none" /> 
      </ReactFlow> 
    </div> 
  );
}
