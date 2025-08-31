import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Stats } from '@react-three/drei';
import { FloatingElements } from './FloatingElements';
import { HeroText3D } from './HeroText3D';
import * as THREE from 'three';

interface Scene3DProps {
  showText?: boolean;
  enableControls?: boolean;
  className?: string;
  children?: React.ReactNode;
}

function CameraController() {
  const ref = useRef<THREE.PerspectiveCamera>(null);

  useFrame((state) => {
    if (!ref.current) return;
    
    // Gentle camera movement
    ref.current.position.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.5;
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.3;
    ref.current.lookAt(0, 0, 0);
  });

  return (
    <perspectiveCamera
      ref={ref}
      makeDefault
      position={[0, 0, 8]}
      fov={50}
      near={0.1}
      far={100}
    />
  );
}

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="#263226" wireframe />
    </mesh>
  );
}

export function Scene3D({ showText = false, enableControls = false, className = "", children }: Scene3DProps) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        camera={{
          position: [0, 0, 8],
          fov: 50,
        }}
      >
        <Suspense fallback={<LoadingFallback />}>
          {/* Camera controller */}
          <CameraController />

          {/* Environment */}
          <Environment preset="studio" />
          
          {/* Fog for depth */}
          <fog attach="fog" args={['#263226', 8, 15]} />

          {/* Floating elements */}
          <FloatingElements />

          {/* 3D Text */}
          {showText && (
            <HeroText3D 
              text="Web Architects" 
              subtext="Building Digital Experiences"
            />
          )}

          {/* Custom children */}
          {children}

          {/* Debug controls (only in development) */}
          {enableControls && process.env.NODE_ENV === 'development' && (
            <>
              <OrbitControls enableDamping dampingFactor={0.05} />
              <Stats />
            </>
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}

// Performance optimized version for mobile
export function Scene3DMobile({ className = "" }: { className?: string }) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        dpr={1}
        performance={{ min: 0.3 }}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "low-power",
        }}
        camera={{
          position: [0, 0, 10],
          fov: 45,
        }}
      >
        <Suspense fallback={<LoadingFallback />}>
          {/* Simplified lighting */}
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={0.4} />

          {/* Reduced floating elements for mobile */}
          <group>
            <mesh position={[-2, 1, -1]} rotation={[0.3, 0.4, 0]}>
              <boxGeometry args={[0.8, 0.8, 0.8]} />
              <meshStandardMaterial color="#263226" transparent opacity={0.7} />
            </mesh>
            
            <mesh position={[2, -1, -2]} rotation={[0.2, -0.3, 0.1]}>
              <octahedronGeometry args={[1]} />
              <meshStandardMaterial color="#FFA366" transparent opacity={0.7} />
            </mesh>
          </group>
        </Suspense>
      </Canvas>
    </div>
  );
}