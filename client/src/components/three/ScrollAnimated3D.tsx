import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { gsap } from '@/lib/gsap';
import * as THREE from 'three';

interface ScrollAnimated3DProps {
  children: React.ReactNode;
  triggerSelector?: string;
  animationType?: 'fade' | 'slideUp' | 'rotate' | 'scale' | 'morph';
  intensity?: number;
}

export function ScrollAnimated3D({ 
  children, 
  triggerSelector = '.scroll-trigger',
  animationType = 'slideUp',
  intensity = 1 
}: ScrollAnimated3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const originalPosition = useRef<THREE.Vector3>(new THREE.Vector3());
  const originalRotation = useRef<THREE.Euler>(new THREE.Euler());
  const originalScale = useRef<THREE.Vector3>(new THREE.Vector3(1, 1, 1));

  useEffect(() => {
    if (!groupRef.current) return;

    // Store original transformations
    originalPosition.current.copy(groupRef.current.position);
    originalRotation.current.copy(groupRef.current.rotation);
    originalScale.current.copy(groupRef.current.scale);

    // Set initial state based on animation type
    switch (animationType) {
      case 'fade':
        groupRef.current.visible = false;
        break;
      case 'slideUp':
        groupRef.current.position.y -= 3 * intensity;
        break;
      case 'rotate':
        groupRef.current.rotation.y += Math.PI * intensity;
        break;
      case 'scale':
        groupRef.current.scale.setScalar(0);
        break;
      case 'morph':
        groupRef.current.scale.setScalar(0.1);
        groupRef.current.rotation.set(Math.PI, 0, Math.PI);
        break;
    }

    // GSAP ScrollTrigger animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: triggerSelector,
        start: "top 80%",
        end: "bottom 20%",
        scrub: false,
        once: true,
        onEnter: () => {
          animateIn();
        }
      }
    });

    const animateIn = () => {
      if (!groupRef.current) return;

      const group = groupRef.current;
      
      switch (animationType) {
        case 'fade':
          group.visible = true;
          gsap.fromTo(group, 
            { userData: { opacity: 0 } },
            { 
              userData: { opacity: 1 }, 
              duration: 1.5, 
              ease: "power3.out" 
            }
          );
          break;

        case 'slideUp':
          gsap.to(group.position, {
            y: originalPosition.current.y,
            duration: 1.5,
            ease: "power3.out"
          });
          break;

        case 'rotate':
          gsap.to(group.rotation, {
            y: originalRotation.current.y,
            duration: 2,
            ease: "power3.out"
          });
          break;

        case 'scale':
          gsap.to(group.scale, {
            x: originalScale.current.x,
            y: originalScale.current.y,
            z: originalScale.current.z,
            duration: 1.5,
            ease: "back.out(1.7)"
          });
          break;

        case 'morph':
          const morphTimeline = gsap.timeline();
          morphTimeline
            .to(group.scale, {
              x: originalScale.current.x * 1.2,
              y: originalScale.current.y * 1.2,
              z: originalScale.current.z * 1.2,
              duration: 1,
              ease: "power3.out"
            })
            .to(group.rotation, {
              x: originalRotation.current.x,
              y: originalRotation.current.y,
              z: originalRotation.current.z,
              duration: 1.2,
              ease: "power3.out"
            }, "-=0.8")
            .to(group.scale, {
              x: originalScale.current.x,
              y: originalScale.current.y,
              z: originalScale.current.z,
              duration: 0.5,
              ease: "power2.out"
            }, "-=0.3");
          break;
      }
    };

    return () => {
      tl.kill();
    };
  }, [triggerSelector, animationType, intensity]);

  // Handle fade animation in render loop
  useFrame(() => {
    if (animationType === 'fade' && groupRef.current) {
      const opacity = groupRef.current.userData.opacity || 0;
      groupRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach(mat => {
              if ('transparent' in mat) {
                mat.transparent = true;
                mat.opacity = opacity;
              }
            });
          } else if ('transparent' in child.material) {
            child.material.transparent = true;
            child.material.opacity = opacity;
          }
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {children}
    </group>
  );
}

// Particle flow system for section transitions
export function ParticleFlow() {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 100;

  const particles = new Float32Array(particleCount * 3);
  const velocities = new Float32Array(particleCount * 3);

  // Initialize particles
  for (let i = 0; i < particleCount; i++) {
    particles[i * 3] = (Math.random() - 0.5) * 20;
    particles[i * 3 + 1] = (Math.random() - 0.5) * 20;
    particles[i * 3 + 2] = (Math.random() - 0.5) * 20;

    velocities[i * 3] = (Math.random() - 0.5) * 0.02;
    velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
    velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
  }

  useFrame((state, delta) => {
    if (!particlesRef.current) return;

    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      // Update positions
      positions[i3] += velocities[i3] * delta * 60;
      positions[i3 + 1] += velocities[i3 + 1] * delta * 60;
      positions[i3 + 2] += velocities[i3 + 2] * delta * 60;

      // Boundary checking and respawn
      if (positions[i3] > 10 || positions[i3] < -10) {
        positions[i3] = (Math.random() - 0.5) * 20;
        velocities[i3] = (Math.random() - 0.5) * 0.02;
      }
      if (positions[i3 + 1] > 10 || positions[i3 + 1] < -10) {
        positions[i3 + 1] = (Math.random() - 0.5) * 20;
        velocities[i3 + 1] = (Math.random() - 0.5) * 0.02;
      }
      if (positions[i3 + 2] > 10 || positions[i3 + 2] < -10) {
        positions[i3 + 2] = (Math.random() - 0.5) * 20;
        velocities[i3 + 2] = (Math.random() - 0.5) * 0.02;
      }
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#FFA366"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

// 3D Section transition component
export function Section3DTransition({ isActive }: { isActive: boolean }) {
  const sectionRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!sectionRef.current) return;

    // Rotate the entire section based on activity
    const targetRotation = isActive ? 0 : Math.PI / 4;
    sectionRef.current.rotation.y = THREE.MathUtils.lerp(
      sectionRef.current.rotation.y,
      targetRotation,
      0.02
    );

    // Move section in/out
    const targetZ = isActive ? 0 : -5;
    sectionRef.current.position.z = THREE.MathUtils.lerp(
      sectionRef.current.position.z,
      targetZ,
      0.03
    );
  });

  return (
    <group ref={sectionRef}>
      <ParticleFlow />
    </group>
  );
}