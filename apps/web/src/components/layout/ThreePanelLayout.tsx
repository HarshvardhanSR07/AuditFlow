import { useState } from 'react';
import { SourcesPanel } from '../sources/SourcesPanel';
import { ChatPanel } from '../chat/ChatPanel';
import { Visualizer } from '../studio/Visualizer';
import { RisksAssumptions } from '../studio/RisksAssumptions';
import { GitBranch, Box, Activity, ShieldAlert, Cpu } from 'lucide-react';
import { useAuditStore } from '@/store/auditStore';

export function ThreePanelLayout() {
  const { ir } = useAuditStore();
  const [activeTab, setActiveTab] = useState<'map' | 'map3d' | 'workflow'>('map');

  return (
    <div className="flex flex-col h-screen bg-black text-[#ededed] overflow-hidden panel-border">
      {/* Top Header */}
      <header className="flex justify-between items-center px-6 py-4 border-b border-[#1a1a1a] shrink-0 bg-black">
        <div className="flex items-center gap-4">
          <div className="w-4 h-4 bg-white"></div>
          <h1 className="text-sm font-semibold tracking-wide uppercase">AuditFlow // Forensic Architecture</h1>
        </div>
        <div className="flex items-center gap-6 text-xs mono-text text-[#888]">
          <div className="flex items-center gap-2"><Cpu size={14}/> SYSTEM_ACTIVE</div>
          <div className="flex items-center gap-2"><Activity size={14}/> {ir?.nodes?.length || 0} NODES</div>
          <button className="hover:text-white transition-colors">NEW_AUDIT</button>
        </div>
      </header>

      {/* Main Grid */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Sidebar: AST & Sources */}
        <div className="w-[280px] border-r border-[#1a1a1a] flex flex-col shrink-0 bg-[#050505]">
          <div className="p-4 border-b border-[#1a1a1a]">
            <h2 className="text-[11px] font-bold tracking-widest text-[#555] uppercase">Target Analysis</h2>
            <div className="mt-2 text-xl font-medium tracking-tight text-white truncate">
              {ir?.meta?.repoName || 'UNKNOWN_REPO'}
            </div>
            <div className="mt-1 text-[10px] mono-text text-emerald-500">
              [ {ir?.meta?.commitSha || 'NO_COMMIT_SHA'} ]
            </div>
          </div>
          <SourcesPanel />
        </div>

        {/* Center: Visualizer & Data */}
        <div className="flex-1 flex flex-col min-w-0 border-r border-[#1a1a1a] bg-black">
          {/* Visualizer Controls */}
          <div className="flex border-b border-[#1a1a1a] bg-[#050505]">
            <button onClick={() => setActiveTab('map')} className={`px-6 py-3 text-xs font-semibold tracking-wider uppercase border-r border-[#1a1a1a] transition-colors ${activeTab === 'map' ? 'bg-white text-black' : 'text-[#888] hover:text-white'}`}>
              Topology
            </button>
            <button onClick={() => setActiveTab('map3d')} className={`px-6 py-3 text-xs font-semibold tracking-wider uppercase border-r border-[#1a1a1a] transition-colors ${activeTab === 'map3d' ? 'bg-white text-black' : 'text-[#888] hover:text-white'}`}>
              3D Construct
            </button>
            <button onClick={() => setActiveTab('workflow')} className={`px-6 py-3 text-xs font-semibold tracking-wider uppercase border-r border-[#1a1a1a] transition-colors ${activeTab === 'workflow' ? 'bg-white text-black' : 'text-[#888] hover:text-white'}`}>
              Workflow
            </button>
          </div>
          
          {/* Visualizer Area */}
          <div className="flex-1 relative overflow-hidden bg-[#020202]">
            <Visualizer activeTab={activeTab} />
          </div>

          {/* Bottom Data Panel */}
          <div className="h-[35%] border-t border-[#1a1a1a] bg-[#050505] overflow-y-auto custom-scrollbar">
            <RisksAssumptions />
          </div>
        </div>

        {/* Right Sidebar: Forensic Chat & Tools */}
        <div className="w-[340px] flex flex-col shrink-0 bg-[#050505]">
          <ChatPanel />
        </div>
      </div>
    </div>
  );
}
