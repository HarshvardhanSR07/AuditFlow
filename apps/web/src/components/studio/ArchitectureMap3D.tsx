import { useAuditStore } from '@/store/auditStore';
import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

function NodesAndEdges({ nodes, edges }) {
  const group = useRef<THREE.Group>(null);
  useFrame(() => {
    if (group.current) {
      group.current.rotation.y += 0.001;
    }
  });

  return (
    <group ref={group}>
      {nodes.map((n, i) => (
        <group key={n.id} position={[n.x, n.y, n.z]}>
          <mesh>
            <sphereGeometry args={[0.4, 16, 16]} />
            <meshStandardMaterial color={n.riskLevel === 'critical' ? '#ef4444' : '#3b82f6'} />
          </mesh>
          <Text position={[0, -0.6, 0]} fontSize={0.2} color="#e3e3e3" anchorX="center" anchorY="middle">
            {n.label}
          </Text>
        </group>
      ))}
      {edges.map((e, i) => {
        const source = nodes.find(n => n.id === e.source);
        const target = nodes.find(n => n.id === e.target);
        if (!source || !target) return null;
        
        const p1 = new THREE.Vector3(source.x, source.y, source.z);
        const p2 = new THREE.Vector3(target.x, target.y, target.z);
        const distance = p1.distanceTo(p2);
        const position = p1.clone().lerp(p2, 0.5);
        const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), p2.clone().sub(p1).normalize());

        return (
          <mesh key={i} position={position} quaternion={quaternion}>
            <cylinderGeometry args={[0.02, 0.02, distance, 8]} />
            <meshBasicMaterial color="#555" />
          </mesh>
        );
      })}
    </group>
  );
}

export function ArchitectureMap3D() {
  const { ir } = useAuditStore();

  const { nodes, edges } = useMemo(() => {
    if (!ir) return { nodes: [], edges: [] };
    // random 3D positions for demo purposes, in reality we'd use a 3D force layout
    const positionedNodes = ir.nodes.map((n, i) => {
      const radius = 5;
      const phi = Math.acos(-1 + (2 * i) / ir.nodes.length);
      const theta = Math.sqrt(ir.nodes.length * Math.PI) * phi;
      return {
        ...n,
        x: radius * Math.cos(theta) * Math.sin(phi),
        y: radius * Math.sin(theta) * Math.sin(phi),
        z: radius * Math.cos(phi),
      };
    });
    return { nodes: positionedNodes, edges: ir.edges };
  }, [ir]);

  return (
    <div className="w-full h-full bg-[#020202]">
      <Canvas camera={{ position: [0, 0, 12] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <NodesAndEdges nodes={nodes} edges={edges} />
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      </Canvas>
    </div>
  );
}
