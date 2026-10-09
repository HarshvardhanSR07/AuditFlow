import { useState } from 'react';
import { ArchitectureMap } from './ArchitectureMap';
import { ArchitectureMap3D } from './ArchitectureMap3D';
import { RiskLedger } from './RiskLedger';
import { HealthScore } from './HealthScore';
import { AssumptionBrief } from './AssumptionBrief';
import { GitDiagram } from './GitDiagram';
import { Img2ThreeJsGen } from './Img2ThreeJsGen';
import { Map, FileText, CheckCircle, BarChart3, Edit3, Sparkles, Box, GitBranch } from 'lucide-react';

export function StudioPanel() {
  const [activeTab, setActiveTab] = useState<'map' | 'map3d' | 'workflow' | 'risks'>('map');

  return (
    <div className="p-4 flex flex-col h-full bg-[#1e1f22]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-[#e3e3e3] flex items-center gap-2">
          Studio
        </h2>
        <button className="p-1 hover:bg-[#282a2c] rounded-md"><div className="w-4 h-4 border-2 border-current rounded-sm"></div></button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 pb-20 custom-scrollbar">
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button onClick={() => setActiveTab('map')} className={`flex items-center gap-3 p-3 rounded-2xl transition-colors border ${activeTab === 'map' ? 'bg-[#282a2c] border-pink-500/50' : 'bg-[#131314] hover:bg-[#282a2c] border-[#333538]/50'}`}>
            <Map size={18} className="text-pink-400" /> <span className="text-[13px] font-medium text-[#e3e3e3]">Architecture Map</span>
          </button>
          <button onClick={() => setActiveTab('map3d')} className={`flex items-center gap-3 p-3 rounded-2xl transition-colors border ${activeTab === 'map3d' ? 'bg-[#282a2c] border-blue-500/50' : 'bg-[#131314] hover:bg-[#282a2c] border-[#333538]/50'}`}>
            <Box size={18} className="text-blue-400" /> <span className="text-[13px] font-medium text-[#e3e3e3]">3D Topology</span>
          </button>
          <button onClick={() => setActiveTab('workflow')} className={`flex items-center gap-3 p-3 rounded-2xl transition-colors border ${activeTab === 'workflow' ? 'bg-[#282a2c] border-emerald-500/50' : 'bg-[#131314] hover:bg-[#282a2c] border-[#333538]/50'}`}>
            <GitBranch size={18} className="text-emerald-400" /> <span className="text-[13px] font-medium text-[#e3e3e3]">GitDiagram</span>
          </button>
          <button onClick={() => setActiveTab('risks')} className={`flex items-center gap-3 p-3 rounded-2xl transition-colors border ${activeTab === 'risks' ? 'bg-[#282a2c] border-amber-500/50' : 'bg-[#131314] hover:bg-[#282a2c] border-[#333538]/50'}`}>
            <BarChart3 size={18} className="text-amber-400" /> <span className="text-[13px] font-medium text-[#e3e3e3]">Risks & Health</span>
          </button>
        </div>
        
        <div className="space-y-4">
          {activeTab === 'map' && <ArchitectureMap />}
          {activeTab === 'map3d' && <ArchitectureMap3D />}
          {activeTab === 'workflow' && <GitDiagram />}
          
          {activeTab === 'risks' && (
            <>
              <HealthScore />
              <AssumptionBrief />
              <RiskLedger />
            </>
          )}

          <Img2ThreeJsGen />
        </div>
      </div>

      <div className="absolute bottom-6 right-6 z-20 flex flex-col items-end">
        <button className="flex items-center gap-2 bg-[#d3e3fd] hover:bg-[#c2d7fa] text-[#041e49] px-4 py-3 rounded-2xl shadow-lg transition-colors font-medium">
          <Edit3 size={18} /> Add note
        </button>
      </div>
    </div>
  );
}
