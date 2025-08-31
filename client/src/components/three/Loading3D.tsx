import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Torus } from '@react-three/drei';
import * as THREE from 'three';

interface Loading3DProps {
  progress: number; // 0 to 100
}

export function Loading3D({ progress }: Loading3DProps) {
  const particlesRef = useRef<THREE.Points>(null);
  
  // Subtle sand particle system
  const particleCount = 150;
  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      // Spread particles in a wider, more natural distribution
      positions[i * 3] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
      
      // Desert sand colors - warm oranges and beiges
      const sandColors = ['#FFA366', '#D4A574', '#E6B886', '#F4D29C'];
      const color = new THREE.Color(sandColors[Math.floor(Math.random() * sandColors.length)]);
      
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    
    return { positions, colors };
  }, []);

  // Animate particles with gentle floating motion
  useFrame((state, delta) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += delta * 0.1;
      
      // Gentle floating sand particles
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] += Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.005;
        positions[i * 3] += Math.cos(state.clock.elapsedTime * 0.3 + i) * 0.002;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* Warm desert lighting */}
      <ambientLight intensity={0.6} color="#F4D29C" />
      
      {/* Sun-like directional light */}
      <directionalLight 
        position={[4, 6, 2]} 
        intensity={0.8}
        color="#FFE5B4"
      />
      
      {/* Subtle sand particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={particles.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={particleCount}
            array={particles.colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.03}
          vertexColors
          transparent
          opacity={0.4}
          sizeAttenuation
        />
      </points>

      {/* Minimal progress ring - very subtle */}
      <Torus 
        args={[2.5, 0.05, 6, 24]} 
        position={[0, -3, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <meshStandardMaterial 
          color="#D4A574" 
          transparent 
          opacity={0.2}
        />
      </Torus>
      
      {/* Progress indicator - desert orange */}
      <Torus 
        args={[2.5, 0.06, 6, 24, (progress / 100) * Math.PI * 2]} 
        position={[0, -3, 0]}
        rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
      >
        <meshStandardMaterial 
          color="#FFA366" 
          emissive="#FFA366"
          emissiveIntensity={0.2}
          transparent
          opacity={0.8}
        />
      </Torus>
    </group>
  );
}