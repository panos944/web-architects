import { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text, Box, RoundedBox, Cylinder, Cone } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from '@/lib/gsap';

interface ServiceCard3DProps {
  title: string;
  description: string;
  icon: 'web' | 'design' | 'strategy' | 'mobile';
  position: [number, number, number];
  isHovered: boolean;
  onClick?: () => void;
  onHover?: (hovered: boolean) => void;
}

export function ServiceCard3D({ 
  title, 
  description, 
  icon, 
  position, 
  isHovered, 
  onClick, 
  onHover 
}: ServiceCard3DProps) {
  const cardRef = useRef<THREE.Group>(null);
  const iconRef = useRef<THREE.Group>(null);
  const textRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  // Animate card on hover
  useFrame((state, delta) => {
    if (!cardRef.current || !iconRef.current) return;

    // Hover animation
    const targetScale = isHovered ? 1.1 : 1;
    const targetY = isHovered ? position[1] + 0.2 : position[1];
    
    cardRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    cardRef.current.position.y = THREE.MathUtils.lerp(cardRef.current.position.y, targetY, 0.1);

    // Icon rotation
    iconRef.current.rotation.y += delta * (isHovered ? 2 : 0.5);

    // Gentle floating animation
    const floatY = Math.sin(state.clock.elapsedTime * 0.8 + position[0]) * 0.05;
    cardRef.current.position.x = position[0];
    cardRef.current.position.z = position[2] + floatY;
  });

  // Render service icon based on type
  const renderIcon = () => {
    const iconProps = {
      scale: 0.3,
      position: [0, 0.8, 0] as [number, number, number]
    };

    switch (icon) {
      case 'web':
        return (
          <group {...iconProps}>
            {/* Code brackets */}
            <Box args={[0.1, 1.5, 0.1]} position={[-0.4, 0, 0]}>
              <meshStandardMaterial color="#FFA366" />
            </Box>
            <Box args={[0.3, 0.1, 0.1]} position={[-0.25, 0.7, 0]}>
              <meshStandardMaterial color="#FFA366" />
            </Box>
            <Box args={[0.3, 0.1, 0.1]} position={[-0.25, -0.7, 0]}>
              <meshStandardMaterial color="#FFA366" />
            </Box>
            
            <Box args={[0.1, 1.5, 0.1]} position={[0.4, 0, 0]}>
              <meshStandardMaterial color="#FFA366" />
            </Box>
            <Box args={[0.3, 0.1, 0.1]} position={[0.25, 0.7, 0]}>
              <meshStandardMaterial color="#FFA366" />
            </Box>
            <Box args={[0.3, 0.1, 0.1]} position={[0.25, -0.7, 0]}>
              <meshStandardMaterial color="#FFA366" />
            </Box>
          </group>
        );

      case 'design':
        return (
          <group {...iconProps}>
            {/* Color palette */}
            <Box args={[0.3, 0.3, 0.1]} position={[-0.3, 0.3, 0]}>
              <meshStandardMaterial color="#FF6B6B" />
            </Box>
            <Box args={[0.3, 0.3, 0.1]} position={[0, 0.3, 0]}>
              <meshStandardMaterial color="#4ECDC4" />
            </Box>
            <Box args={[0.3, 0.3, 0.1]} position={[0.3, 0.3, 0]}>
              <meshStandardMaterial color="#45B7D1" />
            </Box>
            <Box args={[0.3, 0.3, 0.1]} position={[-0.15, 0, 0]}>
              <meshStandardMaterial color="#FFA366" />
            </Box>
            <Box args={[0.3, 0.3, 0.1]} position={[0.15, 0, 0]}>
              <meshStandardMaterial color="#263226" />
            </Box>
          </group>
        );

      case 'strategy':
        return (
          <group {...iconProps}>
            {/* Chess piece (simplified) */}
            <Cylinder args={[0.2, 0.3, 0.8]} position={[0, 0, 0]}>
              <meshStandardMaterial color="#263226" />
            </Cylinder>
            <Cone args={[0.15, 0.4]} position={[0, 0.6, 0]}>
              <meshStandardMaterial color="#FFA366" />
            </Cone>
          </group>
        );

      case 'mobile':
        return (
          <group {...iconProps}>
            {/* Mobile device */}
            <RoundedBox args={[0.4, 0.8, 0.1]} radius={0.05}>
              <meshStandardMaterial color="#263226" />
            </RoundedBox>
            <RoundedBox args={[0.3, 0.6, 0.05]} radius={0.02} position={[0, 0, 0.06]}>
              <meshStandardMaterial color="#FFA366" />
            </RoundedBox>
          </group>
        );

      default:
        return null;
    }
  };

  return (
    <group 
      ref={cardRef}
      position={position}
      onPointerEnter={() => onHover?.(true)}
      onPointerLeave={() => onHover?.(false)}
      onClick={onClick}
    >
      {/* Card base */}
      <RoundedBox args={[2.5, 3, 0.3]} radius={0.1}>
        <meshStandardMaterial 
          color="#263226"
          transparent
          opacity={0.9}
          roughness={0.3}
          metalness={0.7}
        />
      </RoundedBox>

      {/* Card highlight border */}
      {isHovered && (
        <RoundedBox args={[2.6, 3.1, 0.31]} radius={0.1}>
          <meshStandardMaterial 
            color="#FFA366"
            transparent
            opacity={0.3}
            emissive="#FFA366"
            emissiveIntensity={0.2}
          />
        </RoundedBox>
      )}

      {/* Service icon */}
      <group ref={iconRef}>
        {renderIcon()}
      </group>

      {/* Title */}
      <group ref={textRef} position={[0, -0.3, 0.2]}>
        <Text
          fontSize={0.25}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          maxWidth={2}
        >
          {title}
        </Text>
      </group>

      {/* Description */}
      <group position={[0, -0.8, 0.2]}>
        <Text
          fontSize={0.15}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          maxWidth={2.2}
          opacity={0.8}
        >
          {description}
        </Text>
      </group>

      {/* Hover glow effect */}
      {isHovered && (
        <pointLight
          position={[0, 0, 1]}
          color="#FFA366"
          intensity={0.5}
          distance={3}
        />
      )}
    </group>
  );
}

// Container for multiple service cards
interface ServiceCards3DProps {
  services: Array<{
    title: string;
    description: string;
    icon: 'web' | 'design' | 'strategy' | 'mobile';
  }>;
}

export function ServiceCards3D({ services }: ServiceCards3DProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const groupRef = useRef<THREE.Group>(null);

  // Arrange cards in a grid
  const positions: Array<[number, number, number]> = [
    [-3, 1, 0],   // Top left
    [3, 1, 0],    // Top right
    [-3, -2, 0],  // Bottom left
    [3, -2, 0],   // Bottom right
  ];

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle group rotation
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Ambient lighting */}
      <ambientLight intensity={0.4} />
      
      {/* Key lighting */}
      <directionalLight position={[5, 5, 5]} intensity={0.6} color="#ffffff" />
      <directionalLight position={[-5, 3, 2]} intensity={0.3} color="#FFA366" />

      {/* Service cards */}
      {services.map((service, index) => (
        <ServiceCard3D
          key={index}
          {...service}
          position={positions[index] || [0, 0, 0]}
          isHovered={hoveredIndex === index}
          onHover={(hovered) => setHoveredIndex(hovered ? index : null)}
          onClick={() => console.log(`Clicked on ${service.title}`)}
        />
      ))}
    </group>
  );
}