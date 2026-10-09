import { create } from 'zustand';
import { AuditFlowIR } from '@auditflow/ir';
interface AuditState { ir: AuditFlowIR | null; selectedNodeId: string | null; selectedRiskId: string | null; setIR: (ir: AuditFlowIR) => void; setSelectedNode: (id: string | null) => void; setSelectedRisk: (id: string | null) => void; }
export const useAuditStore = create<AuditState>((set) => ({ ir: null, selectedNodeId: null, selectedRiskId: null, setIR: (ir) => set({ ir }), setSelectedNode: (id) => set({ selectedNodeId: id }), setSelectedRisk: (id) => set({ selectedRiskId: id }) }));
