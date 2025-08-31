import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text, Box, Octahedron, Torus, Cylinder } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from '@/lib/gsap';

interface FloatingElement {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  type: 'cube' | 'octahedron' | 'torus' | 'cylinder' | 'wireframe';
  color: string;
  speed: number;
}

export function FloatingElements() {
  const groupRef = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const { viewport } = useThree();

  // Generate floating architectural elements
  const elements = useMemo<FloatingElement[]>(() => [
    // Large hero elements
    { position: [-3, 2, -1], rotation: [0.3, 0.4, 0], scale: 0.8, type: 'cube', color: '#263226', speed: 0.002 },
    { position: [4, -1, -2], rotation: [0.2, -0.3, 0.1], scale: 1.2, type: 'octahedron', color: '#FFA366', speed: 0.003 },
    { position: [-2, -2, -3], rotation: [0.5, 0.2, -0.1], scale: 0.6, type: 'torus', color: '#263226', speed: 0.001 },
    
    // Medium elements
    { position: [2, 3, -1.5], rotation: [0.1, 0.6, 0.2], scale: 0.4, type: 'cylinder', color: '#FFA366', speed: 0.004 },
    { position: [-4, 0, -2.5], rotation: [0.4, -0.2, 0.3], scale: 0.5, type: 'wireframe', color: '#263226', speed: 0.002 },
    { position: [1, -3, -1], rotation: [0.2, 0.5, -0.2], scale: 0.7, type: 'cube', color: '#FFA366', speed: 0.003 },
    
    // Small accent elements
    { position: [3, 1, -4], rotation: [0.6, 0.1, 0.4], scale: 0.3, type: 'octahedron', color: '#263226', speed: 0.005 },
    { position: [-1, 2, -3.5], rotation: [0.3, -0.4, 0.1], scale: 0.35, type: 'torus', color: '#FFA366', speed: 0.004 },
    { position: [4.5, -0.5, -3], rotation: [0.1, 0.3, -0.3], scale: 0.25, type: 'cylinder', color: '#263226', speed: 0.006 },
    { position: [-3.5, -1.5, -2], rotation: [0.4, 0.2, 0.5], scale: 0.4, type: 'wireframe', color: '#FFA366', speed: 0.003 },
  ], []);

  // Mouse movement handler
  useMemo(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Animation loop
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Mouse parallax effect
    const targetX = mouse.current.x * 0.3;
    const targetY = mouse.current.y * 0.2;
    
    groupRef.current.rotation.x += (targetY - groupRef.current.rotation.x) * 0.05;
    groupRef.current.rotation.y += (targetX - groupRef.current.rotation.y) * 0.05;

    // Individual element rotations
    groupRef.current.children.forEach((child, index) => {
      const element = elements[index];
      if (element) {
        child.rotation.x += element.speed;
        child.rotation.y += element.speed * 0.7;
        child.rotation.z += element.speed * 0.5;

        // Gentle floating motion
        const floatY = Math.sin(state.clock.elapsedTime * element.speed * 50 + index) * 0.1;
        child.position.y = element.position[1] + floatY;
      }
    });
  });

  const renderElement = (element: FloatingElement, index: number) => {
    const props = {
      key: index,
      position: element.position,
      rotation: element.rotation,
      scale: element.scale,
    };

    const material = (
      <meshStandardMaterial 
        color={element.color} 
        transparent 
        opacity={0.8}
        roughness={0.4}
        metalness={0.6}
      />
    );

    switch (element.type) {
      case 'cube':
        return (
          <Box {...props}>
            {material}
          </Box>
        );
      case 'octahedron':
        return (
          <Octahedron {...props}>
            {material}
          </Octahedron>
        );
      case 'torus':
        return (
          <Torus {...props} args={[0.5, 0.2, 8, 16]}>
            {material}
          </Torus>
        );
      case 'cylinder':
        return (
          <Cylinder {...props} args={[0.3, 0.3, 1, 8]}>
            {material}
          </Cylinder>
        );
      case 'wireframe':
        return (
          <Box {...props}>
            <meshStandardMaterial 
              color={element.color} 
              wireframe 
              transparent 
              opacity={0.6}
            />
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <group ref={groupRef}>
      {/* Ambient lighting */}
      <ambientLight intensity={0.4} />
      
      {/* Key light */}
      <directionalLight 
        position={[5, 5, 5]} 
        intensity={0.8} 
        color="#ffffff"
        castShadow
      />
      
      {/* Fill light with brand color */}
      <directionalLight 
        position={[-3, 3, 2]} 
        intensity={0.3} 
        color="#FFA366"
      />

      {/* Floating elements */}
      {elements.map(renderElement)}
    </group>
  );
}