// import { useRef, useMemo } from 'react';
// import { useFrame } from '@react-three/fiber';
// import { Sphere, Cylinder, Cone } from '@react-three/drei';
// import * as THREE from 'three';

// interface DesertElement {
//   position: [number, number, number];
//   rotation: [number, number, number];
//   scale: number;
//   type: 'rock' | 'cactus' | 'shrub' | 'sandDune' | 'crystal';
//   color: string;
//   speed: number;
// }

// export function DesertFloatingElements() {
//   const groupRef = useRef<THREE.Group>(null);
//   const mouse = useRef({ x: 0, y: 0 });

//   // Generate floating desert elements
//   const elements = useMemo<DesertElement[]>(() => [
//     // Rock formations - various sizes and positions
//     { position: [-4, 1, -2], rotation: [0.2, 0.3, 0.1], scale: 0.8, type: 'rock', color: '#C49464', speed: 0.001 },
//     { position: [3, -1, -3], rotation: [0.4, -0.2, 0.2], scale: 1.2, type: 'rock', color: '#A67C5A', speed: 0.0015 },
//     { position: [-2, -2, -1], rotation: [0.1, 0.5, -0.1], scale: 0.6, type: 'rock', color: '#D4A574', speed: 0.0008 },
    
//     // Desert cacti - simple and elegant
//     { position: [2, 2, -2], rotation: [0, 0, 0.1], scale: 0.7, type: 'cactus', color: '#7A8450', speed: 0.0005 },
//     { position: [-3, -1, -4], rotation: [0, 0, -0.05], scale: 0.9, type: 'cactus', color: '#8B9A5B', speed: 0.0007 },
    
//     // Sand dune formations - organic shapes
//     { position: [4, 0, -1], rotation: [0.3, 0.2, 0.1], scale: 1.0, type: 'sandDune', color: '#E6B886', speed: 0.0003 },
//     { position: [-1, 3, -3], rotation: [0.2, -0.4, 0.2], scale: 0.8, type: 'sandDune', color: '#F4D29C', speed: 0.0004 },
    
//     // Desert shrubs - sparse vegetation
//     { position: [1, -3, -2], rotation: [0.1, 0.3, 0.05], scale: 0.4, type: 'shrub', color: '#9B8C5A', speed: 0.0012 },
//     { position: [-4, 2, -3], rotation: [0.2, -0.1, 0.1], scale: 0.5, type: 'shrub', color: '#A8956B', speed: 0.001 },
    
//     // Desert crystals - natural minerals
//     { position: [3.5, 1, -4], rotation: [0.4, 0.6, 0.2], scale: 0.3, type: 'crystal', color: '#FFA366', speed: 0.002 },
//     { position: [-2.5, -0.5, -2.5], rotation: [0.3, -0.3, 0.4], scale: 0.4, type: 'crystal', color: '#FFB887', speed: 0.0018 },
//   ], []);

//   // Mouse movement handler for subtle parallax
//   useMemo(() => {
//     const handleMouseMove = (event: MouseEvent) => {
//       mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
//       mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
//     };

//     window.addEventListener('mousemove', handleMouseMove);
//     return () => window.removeEventListener('mousemove', handleMouseMove);
//   }, []);

//   // Animation loop
//   useFrame((state, delta) => {
//     if (!groupRef.current) return;

//     // Very subtle mouse parallax effect
//     const targetX = mouse.current.x * 0.1;
//     const targetY = mouse.current.y * 0.05;
    
//     groupRef.current.rotation.x += (targetY - groupRef.current.rotation.x) * 0.02;
//     groupRef.current.rotation.y += (targetX - groupRef.current.rotation.y) * 0.02;

//     // Individual element animations
//     groupRef.current.children.forEach((child, index) => {
//       const element = elements[index];
//       if (element) {
//         // Very gentle rotation for natural movement
//         child.rotation.x += element.speed * 0.5;
//         child.rotation.y += element.speed;
//         child.rotation.z += element.speed * 0.3;

//         // Subtle floating motion
//         const floatY = Math.sin(state.clock.elapsedTime * element.speed * 20 + index) * 0.05;
//         child.position.y = element.position[1] + floatY;
//       }
//     });
//   });

//   const renderElement = (element: DesertElement, index: number) => {
//     const props = {
//       key: index,
//       position: element.position,
//       rotation: element.rotation,
//       scale: element.scale,
//     };

//     const material = (
//       <meshStandardMaterial 
//         color={element.color} 
//         transparent 
//         opacity={0.7}
//         roughness={0.8}
//         metalness={0.1}
//       />
//     );

//     switch (element.type) {
//       case 'rock':
//         // Irregular rock shapes using scaled spheres
//         return (
//           <group {...props}>
//             <Sphere args={[0.5, 8, 6]} scale={[1, 0.7, 1.2]}>
//               {material}
//             </Sphere>
//             {/* Add smaller rocks for detail */}
//             <Sphere args={[0.2, 6, 4]} position={[0.3, 0.2, 0]} scale={[0.8, 0.6, 1]}>
//               {material}
//             </Sphere>
//           </group>
//         );

//       case 'cactus':
//         return (
//           <group {...props}>
//             {/* Main cactus body */}
//             <Cylinder args={[0.2, 0.25, 1.5, 8]} position={[0, 0, 0]}>
//               {material}
//             </Cylinder>
//             {/* Small arm */}
//             <Cylinder args={[0.15, 0.15, 0.6, 6]} position={[0.4, 0.3, 0]} rotation={[0, 0, Math.PI / 6]}>
//               {material}
//             </Cylinder>
//           </group>
//         );

//       case 'shrub':
//         return (
//           <group {...props}>
//             {/* Multiple small branches */}
//             {[...Array(5)].map((_, i) => (
//               <Cylinder 
//                 key={i}
//                 args={[0.02, 0.05, 0.3, 4]} 
//                 position={[
//                   Math.cos(i * 1.2) * 0.2,
//                   Math.random() * 0.2,
//                   Math.sin(i * 1.2) * 0.2
//                 ]}
//                 rotation={[Math.random() * 0.5, i * 0.8, Math.random() * 0.3]}
//               >
//                 {material}
//               </Cylinder>
//             ))}
//           </group>
//         );

//       case 'sandDune':
//         // Organic sand formation using stretched spheres
//         return (
//           <group {...props}>
//             <Sphere args={[0.8, 12, 8]} scale={[1.5, 0.3, 1]}>
//               {material}
//             </Sphere>
//           </group>
//         );

//       case 'crystal':
//         return (
//           <group {...props}>
//             {/* Crystal formation using cones */}
//             <Cone args={[0.2, 0.8]} position={[0, 0, 0]} rotation={[0, 0, 0]}>
//               <meshStandardMaterial 
//                 color={element.color} 
//                 transparent 
//                 opacity={0.6}
//                 roughness={0.1}
//                 metalness={0.3}
//                 emissive={element.color}
//                 emissiveIntensity={0.1}
//               />
//             </Cone>
//             {/* Secondary crystal */}
//             <Cone args={[0.1, 0.4]} position={[0.3, 0, 0.2]} rotation={[0.2, 0.5, 0.1]}>
//               <meshStandardMaterial 
//                 color={element.color} 
//                 transparent 
//                 opacity={0.5}
//                 roughness={0.2}
//                 metalness={0.2}
//                 emissive={element.color}
//                 emissiveIntensity={0.05}
//               />
//             </Cone>
//           </group>
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <group ref={groupRef}>
//       {/* Desert lighting */}
//       <ambientLight intensity={0.3} color="#F4D29C" />
      
//       {/* Main desert sun light */}
//       <directionalLight 
//         position={[6, 8, 4]} 
//         intensity={0.6} 
//         color="#FFE5B4"
//         castShadow
//       />
      
//       {/* Warm fill light */}
//       <directionalLight 
//         position={[-3, 4, 2]} 
//         intensity={0.2} 
//         color="#FFA366"
//       />

//       {/* Desert elements */}
//       {elements.map(renderElement)}
//     </group>
//   );
// }