import { ArchitectureMap } from './ArchitectureMap';
import { ArchitectureMap3D } from './ArchitectureMap3D';
import { GitDiagram } from './GitDiagram';

export function Visualizer({ activeTab }: { activeTab: 'map' | 'map3d' | 'workflow' }) {
  return (
    <div className="absolute inset-0 w-full h-full">
      {activeTab === 'map' && <ArchitectureMap />}
      {activeTab === 'map3d' && <ArchitectureMap3D />}
      {activeTab === 'workflow' && <GitDiagram />}
    </div>
  );
}
