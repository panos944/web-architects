import { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text3D, Center } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from '@/lib/gsap';

interface HeroText3DProps {
  text: string;
  subtext?: string;
  onComplete?: () => void;
}

export function HeroText3D({ text, subtext, onComplete }: HeroText3DProps) {
  const mainTextRef = useRef<THREE.Group>(null);
  const subtextRef = useRef<THREE.Group>(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const { viewport } = useThree();

  // Check if fonts are ready
  useEffect(() => {
    // Simulate font loading - in real implementation you'd load actual 3D fonts
    const timer = setTimeout(() => {
      setFontsLoaded(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Entrance animation
  useEffect(() => {
    if (!fontsLoaded || !mainTextRef.current) return;

    const tl = gsap.timeline();

    // Animate main text
    tl.fromTo(mainTextRef.current.scale, 
      { x: 0, y: 0, z: 0 },
      { x: 1, y: 1, z: 1, duration: 1.5, ease: "back.out(1.7)" }
    )
    .fromTo(mainTextRef.current.rotation,
      { x: Math.PI, y: 0, z: 0 },
      { x: 0, y: 0, z: 0, duration: 1.2, ease: "power3.out" },
      "-=1"
    );

    // Animate subtext if it exists
    if (subtextRef.current && subtext) {
      tl.fromTo(subtextRef.current.position,
        { y: -2, x: 0, z: 0 },
        { y: -1.5, x: 0, z: 0, duration: 1, ease: "power3.out" },
        "-=0.5"
      )
      .fromTo(subtextRef.current.scale,
        { x: 0, y: 0, z: 0 },
        { x: 1, y: 1, z: 1, duration: 0.8, ease: "back.out(1.7)" },
        "-=0.8"
      );
    }

    // Call completion callback
    tl.call(() => {
      if (onComplete) onComplete();
    });

  }, [fontsLoaded, text, subtext, onComplete]);

  // Subtle floating animation
  useFrame((state) => {
    if (mainTextRef.current) {
      mainTextRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      mainTextRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.02;
    }

    if (subtextRef.current) {
      subtextRef.current.position.y = -1.5 + Math.sin(state.clock.elapsedTime * 0.7 + 1) * 0.05;
    }
  });

  // Fallback to regular text if 3D fonts aren't available
  const TextComponent = ({ children, ...props }: any) => {
    return (
      <Text
        {...props}
        font="/fonts/Inter-Bold.woff"
        anchorX="center"
        anchorY="middle"
      >
        {children}
      </Text>
    );
  };

  if (!fontsLoaded) {
    return null; // Show nothing while loading
  }

  return (
    <>
      {/* Main text */}
      <group ref={mainTextRef} position={[0, 0.5, 0]}>
        <Center>
          <TextComponent
            fontSize={viewport.width < 8 ? 0.8 : 1.2}
            color="#ffffff"
            outlineWidth={0.02}
            outlineColor="#263226"
          >
            {text}
          </TextComponent>
        </Center>
      </group>

      {/* Subtext */}
      {subtext && (
        <group ref={subtextRef} position={[0, -1.5, 0]}>
          <Center>
            <TextComponent
              fontSize={viewport.width < 8 ? 0.4 : 0.6}
              color="#FFA366"
              outlineWidth={0.01}
              outlineColor="#263226"
            >
              {subtext}
            </TextComponent>
          </Center>
        </group>
      )}

      {/* Lighting for text */}
      <spotLight
        position={[0, 3, 3]}
        angle={0.3}
        penumbra={1}
        intensity={1}
        color="#ffffff"
        target-position={[0, 0, 0]}
      />
    </>
  );
}

// Fallback Text component using drei's Text
function Text(props: any) {
  return (
    <mesh {...props}>
      <planeGeometry args={[4, 1]} />
      <meshStandardMaterial color={props.color || "#ffffff"} transparent opacity={0.9} />
    </mesh>
  );
}