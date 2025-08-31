import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';

export function DesertScene3D() {
  const sandParticlesRef = useRef<THREE.Points>(null);
  const sunRaysRef = useRef<THREE.Group>(null);
  const dustRef = useRef<THREE.Points>(null);

  // Sand particles floating in the air - reduced count
  const sandParticles = useMemo(() => {
    const particleCount = 20;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    
    const sandColors = [
      new THREE.Color('#FFA366'), // Main orange
      new THREE.Color('#E6B886'), // Light sand
      new THREE.Color('#D4A574'), // Medium sand
      new THREE.Color('#C49464'), // Dark sand
    ];
    
    for (let i = 0; i < particleCount; i++) {
      // Spread particles across a wide desert area
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = Math.random() * 6 - 2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15;
      
      // Random sand colors
      const color = sandColors[Math.floor(Math.random() * sandColors.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
      
      // Varying particle sizes
      sizes[i] = Math.random() * 0.04 + 0.01;
    }
    
    return { positions, colors, sizes, particleCount };
  }, []);

  // Dust motes for atmosphere - reduced count
  const dustMotes = useMemo(() => {
    const particleCount = 30;
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = Math.random() * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    
    return { positions, particleCount };
  }, []);

  // Animation loop
  useFrame((state, delta) => {
    // Animate sand particles - floating rightward like dust
    if (sandParticlesRef.current) {
      const positions = sandParticlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < sandParticles.particleCount; i++) {
        // Move particles toward the right (positive X direction)
        positions[i * 3] += delta * (0.5 + Math.random() * 0.3); // X - rightward movement
        
        // Gentle vertical floating motion
        positions[i * 3 + 1] += Math.sin(state.clock.elapsedTime * 0.3 + i * 0.1) * 0.01;
        
        // Slight forward/backward drift
        positions[i * 3 + 2] += Math.sin(state.clock.elapsedTime * 0.2 + i * 0.15) * 0.005;
        
        // Reset particles that have moved too far right
        if (positions[i * 3] > 15) {
          positions[i * 3] = -15; // Reset to left side
          positions[i * 3 + 1] = Math.random() * 6 - 2; // Random Y position
          positions[i * 3 + 2] = (Math.random() - 0.5) * 15; // Random Z position
        }
      }
      sandParticlesRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Animate dust motes - also floating rightward
    if (dustRef.current) {
      const positions = dustRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < dustMotes.particleCount; i++) {
        // Move dust particles toward the right (slower than sand)
        positions[i * 3] += delta * (0.2 + Math.random() * 0.2); // X - rightward movement
        
        // Very gentle vertical movement
        positions[i * 3 + 1] += Math.sin(state.clock.elapsedTime * 0.1 + i * 0.05) * 0.005;
        
        // Subtle depth movement
        positions[i * 3 + 2] += Math.cos(state.clock.elapsedTime * 0.08 + i * 0.03) * 0.002;
        
        // Reset particles that have moved too far right
        if (positions[i * 3] > 20) {
          positions[i * 3] = -20; // Reset to left side
          positions[i * 3 + 1] = Math.random() * 8; // Random Y position
          positions[i * 3 + 2] = (Math.random() - 0.5) * 20; // Random Z position
        }
      }
      dustRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* Atmospheric sand particles */}
      <points ref={sandParticlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={sandParticles.particleCount}
            array={sandParticles.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={sandParticles.particleCount}
            array={sandParticles.colors}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={sandParticles.particleCount}
            array={sandParticles.sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          vertexColors
          transparent
          opacity={0.4}
          sizeAttenuation
          size={0.02}
        />
      </points>

      {/* Fine atmospheric dust */}
      <points ref={dustRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={dustMotes.particleCount}
            array={dustMotes.positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.01}
          color="#F4D29C"
          transparent
          opacity={0.3}
          sizeAttenuation
        />
      </points>
    </group>
  );
}