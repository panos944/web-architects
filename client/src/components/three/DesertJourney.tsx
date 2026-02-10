import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import {
  CatmullRomCurve3,
  Vector3,
  Color,
  PlaneGeometry,
  BufferAttribute,
  FrontSide,
  AdditiveBlending,
} from 'three';
import * as THREE from 'three';

// ============================================================================
// SIMPLEX NOISE IMPLEMENTATION (Embedded to avoid external dependency)
// ============================================================================

const F3 = 1.0 / 3.0;
const G3 = 1.0 / 6.0;

const grad3 = [
  [1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0],
  [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1],
  [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1],
];

function buildPermutationTable(seed: number): Uint8Array {
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;

  // Simple seeded shuffle
  let s = seed;
  for (let i = 255; i > 0; i--) {
    s = (s * 16807) % 2147483647;
    const j = s % (i + 1);
    [p[i], p[j]] = [p[j], p[i]];
  }

  const perm = new Uint8Array(512);
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
  return perm;
}

function createNoise3D(seed: number = 12345) {
  const perm = buildPermutationTable(seed);

  return function noise3D(x: number, y: number, z: number): number {
    const s = (x + y + z) * F3;
    const i = Math.floor(x + s);
    const j = Math.floor(y + s);
    const k = Math.floor(z + s);
    const t = (i + j + k) * G3;

    const X0 = i - t, Y0 = j - t, Z0 = k - t;
    const x0 = x - X0, y0 = y - Y0, z0 = z - Z0;

    let i1, j1, k1, i2, j2, k2;
    if (x0 >= y0) {
      if (y0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 1; k2 = 0; }
      else if (x0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 0; k2 = 1; }
      else { i1 = 0; j1 = 0; k1 = 1; i2 = 1; j2 = 0; k2 = 1; }
    } else {
      if (y0 < z0) { i1 = 0; j1 = 0; k1 = 1; i2 = 0; j2 = 1; k2 = 1; }
      else if (x0 < z0) { i1 = 0; j1 = 1; k1 = 0; i2 = 0; j2 = 1; k2 = 1; }
      else { i1 = 0; j1 = 1; k1 = 0; i2 = 1; j2 = 1; k2 = 0; }
    }

    const x1 = x0 - i1 + G3, y1 = y0 - j1 + G3, z1 = z0 - k1 + G3;
    const x2 = x0 - i2 + 2 * G3, y2 = y0 - j2 + 2 * G3, z2 = z0 - k2 + 2 * G3;
    const x3 = x0 - 1 + 3 * G3, y3 = y0 - 1 + 3 * G3, z3 = z0 - 1 + 3 * G3;

    const ii = i & 255, jj = j & 255, kk = k & 255;

    const gi0 = perm[ii + perm[jj + perm[kk]]] % 12;
    const gi1 = perm[ii + i1 + perm[jj + j1 + perm[kk + k1]]] % 12;
    const gi2 = perm[ii + i2 + perm[jj + j2 + perm[kk + k2]]] % 12;
    const gi3 = perm[ii + 1 + perm[jj + 1 + perm[kk + 1]]] % 12;

    let n0 = 0, n1 = 0, n2 = 0, n3 = 0;

    let t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
    if (t0 >= 0) {
      t0 *= t0;
      n0 = t0 * t0 * (grad3[gi0][0] * x0 + grad3[gi0][1] * y0 + grad3[gi0][2] * z0);
    }

    let t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
    if (t1 >= 0) {
      t1 *= t1;
      n1 = t1 * t1 * (grad3[gi1][0] * x1 + grad3[gi1][1] * y1 + grad3[gi1][2] * z1);
    }

    let t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
    if (t2 >= 0) {
      t2 *= t2;
      n2 = t2 * t2 * (grad3[gi2][0] * x2 + grad3[gi2][1] * y2 + grad3[gi2][2] * z2);
    }

    let t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
    if (t3 >= 0) {
      t3 *= t3;
      n3 = t3 * t3 * (grad3[gi3][0] * x3 + grad3[gi3][1] * y3 + grad3[gi3][2] * z3);
    }

    return 32 * (n0 + n1 + n2 + n3);
  };
}

// ============================================================================
// TYPES
// ============================================================================

interface DesertJourneyProps {
  /** Normalized scroll progress (0 to 1) */
  scrollProgress: number;
}

// ============================================================================
// COLOR PALETTE (matching the desert image)
// ============================================================================

const COLORS = {
  skyTop: new Color('#1a0a00'),      // Dark burnt orange/brown at top
  skyBottom: new Color('#ff6b1a'),    // Bright orange at horizon
  sunCore: new Color('#ffffff'),      // White sun center
  sunGlow: new Color('#ffaa44'),      // Orange sun glow
  sandLight: new Color('#e6a050'),    // Light sand (sun-facing)
  sandDark: new Color('#8b4513'),     // Dark sand (shadows)
  sandMid: new Color('#c4783c'),      // Mid-tone sand
  fog: new Color('#ff8844'),          // Orange atmospheric fog
  particle: new Color('#ffd4a3'),     // Light sand particles
  architectureBase: new Color('#2a1a10'), // Dark geometric shapes
  architectureAccent: new Color('#F68238'), // Brand orange accent
};

// ============================================================================
// CAMERA PATH DEFINITION
// ============================================================================

function createCameraPath(): CatmullRomCurve3 {
  // Fly-over path: Start high, sweep down and forward across the landscape
  const points = [
    new Vector3(0, 25, -30),    // Start: High above, behind the scene
    new Vector3(5, 18, -15),    // Descend, slight right drift
    new Vector3(3, 12, 0),      // Mid-point: lower, over the dunes
    new Vector3(-2, 8, 15),     // Continue forward, slight left
    new Vector3(0, 5, 30),      // Lower still, approaching horizon
    new Vector3(2, 3, 50),      // Near ground level
    new Vector3(0, 2.5, 70),    // Final: eye-level, looking at sun
  ];

  return new CatmullRomCurve3(points, false, 'catmullrom', 0.5);
}

// Camera look-at targets along the path
function getCameraTarget(progress: number): Vector3 {
  // Always look slightly ahead and toward the sun/horizon
  const baseZ = 100; // Sun is far in the distance
  const baseY = 5 + (1 - progress) * 10; // Start looking higher, end looking at horizon
  const baseX = Math.sin(progress * Math.PI * 0.3) * 5; // Subtle horizontal drift

  return new Vector3(baseX, baseY, baseZ);
}

// ============================================================================
// PROCEDURAL TERRAIN COMPONENT
// ============================================================================

function DesertTerrain() {
  const meshRef = useRef<THREE.Mesh>(null);

  const { geometry, colors } = useMemo(() => {
    const noise = createNoise3D(42);
    const width = 200;
    const depth = 200;
    const segmentsX = 128;
    const segmentsZ = 128;

    const geo = new PlaneGeometry(width, depth, segmentsX, segmentsZ);
    geo.rotateX(-Math.PI / 2);

    const positions = geo.attributes.position.array as Float32Array;
    const vertexColors = new Float32Array(positions.length);

    // Generate dune heights using layered noise
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const z = positions[i + 2];

      // Layered noise for natural dune shapes
      let height = 0;

      // Large rolling dunes
      height += noise(x * 0.015, 0, z * 0.02) * 8;

      // Medium detail
      height += noise(x * 0.04, 0, z * 0.05) * 3;

      // Fine ripples
      height += noise(x * 0.15, 0, z * 0.15) * 0.5;

      // Create more dramatic dune ridges
      const ridge = Math.sin(x * 0.05 + z * 0.03) * 2;
      height += Math.max(0, ridge);

      // Flatten distant areas slightly for better horizon
      const distFromCenter = Math.sqrt(x * x + z * z);
      const falloff = Math.max(0, 1 - distFromCenter / 100);
      height *= 0.3 + falloff * 0.7;

      positions[i + 1] = height;

      // Calculate vertex color based on height and position
      const normalizedHeight = (height + 5) / 15; // Normalize to 0-1 range
      const sunFacing = (x + z) / 200 + 0.5; // Simple sun direction factor

      // Blend between shadow and lit colors
      const colorMix = normalizedHeight * 0.5 + sunFacing * 0.5;
      const color = new Color().lerpColors(COLORS.sandDark, COLORS.sandLight, colorMix);

      vertexColors[i] = color.r;
      vertexColors[i + 1] = color.g;
      vertexColors[i + 2] = color.b;
    }

    geo.setAttribute('color', new BufferAttribute(vertexColors, 3));
    geo.computeVertexNormals();

    return { geometry: geo, colors: vertexColors };
  }, []);

  return (
    <mesh ref={meshRef} geometry={geometry} receiveShadow>
      <meshStandardMaterial
        vertexColors
        roughness={0.9}
        metalness={0.0}
        side={FrontSide}
        flatShading={false}
      />
    </mesh>
  );
}

// ============================================================================
// SAND PARTICLES COMPONENT
// ============================================================================

interface SandParticlesProps {
  count?: number;
}

function SandParticles({ count = 500 }: SandParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, velocities, sizes } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const siz = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Spread particles across the scene
      pos[i * 3] = (Math.random() - 0.5) * 150;
      pos[i * 3 + 1] = Math.random() * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 150;

      // Random velocities for wind effect
      vel[i * 3] = (Math.random() * 0.5 + 0.3); // Rightward drift
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.1; // Slight vertical
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.2; // Slight depth

      // Varying sizes
      siz[i] = Math.random() * 0.15 + 0.05;
    }

    return { positions: pos, velocities: vel, sizes: siz };
  }, [count]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;

    const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const time = state.clock.elapsedTime;

    for (let i = 0; i < count; i++) {
      // Apply velocity with wind turbulence
      pos[i * 3] += velocities[i * 3] * delta * 15;
      pos[i * 3 + 1] += velocities[i * 3 + 1] * delta * 5 + Math.sin(time + i) * 0.01;
      pos[i * 3 + 2] += velocities[i * 3 + 2] * delta * 10;

      // Reset particles that go too far
      if (pos[i * 3] > 75) {
        pos[i * 3] = -75;
        pos[i * 3 + 1] = Math.random() * 20;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 150;
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        color={COLORS.particle}
        transparent
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

// ============================================================================
// SUN AND LENS FLARE COMPONENT
// ============================================================================

function Sun() {
  const sunRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (glowRef.current) {
      // Subtle pulsing glow
      const pulse = Math.sin(state.clock.elapsedTime * 0.5) * 0.1 + 1;
      glowRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group ref={sunRef} position={[0, 12, 100]}>
      {/* Sun core */}
      <mesh>
        <sphereGeometry args={[3, 32, 32]} />
        <meshBasicMaterial color={COLORS.sunCore} />
      </mesh>

      {/* Inner glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[5, 32, 32]} />
        <meshBasicMaterial
          color={COLORS.sunGlow}
          transparent
          opacity={0.6}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Outer glow / lens flare */}
      <mesh>
        <sphereGeometry args={[12, 32, 32]} />
        <meshBasicMaterial
          color={COLORS.sunGlow}
          transparent
          opacity={0.15}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Sun rays (sprite-based) */}
      <sprite scale={[60, 60, 1]}>
        <spriteMaterial
          color={COLORS.sunGlow}
          transparent
          opacity={0.1}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </sprite>
    </group>
  );
}

// ============================================================================
// GEOMETRIC ARCHITECTURAL ELEMENTS
// ============================================================================

function ArchitecturalElements() {
  const groupRef = useRef<THREE.Group>(null);

  // Abstract geometric shapes in the distance
  const elements = useMemo(() => [
    // Distant monoliths (left side)
    { position: [-40, 8, 60], rotation: [0, 0.3, 0], scale: [2, 16, 2], type: 'box' as const },
    { position: [-45, 5, 70], rotation: [0, -0.2, 0.1], scale: [1.5, 10, 1.5], type: 'box' as const },

    // Right side structures
    { position: [50, 6, 55], rotation: [0, 0.5, 0], scale: [3, 12, 2], type: 'box' as const },
    { position: [55, 4, 65], rotation: [0, -0.4, 0.05], scale: [1, 8, 1], type: 'box' as const },

    // Center-distant pyramid hint
    { position: [10, 3, 80], rotation: [0, Math.PI / 4, 0], scale: [8, 6, 8], type: 'pyramid' as const },

    // Floating geometric accent (brand element)
    { position: [-20, 15, 50], rotation: [0.2, 0.5, 0.1], scale: [2, 2, 2], type: 'octahedron' as const },
  ], []);

  return (
    <group ref={groupRef}>
      {elements.map((el, i) => (
        <mesh
          key={i}
          position={el.position as [number, number, number]}
          rotation={el.rotation as [number, number, number]}
          scale={el.scale as [number, number, number]}
        >
          {el.type === 'box' && <boxGeometry args={[1, 1, 1]} />}
          {el.type === 'pyramid' && <coneGeometry args={[1, 1, 4]} />}
          {el.type === 'octahedron' && <octahedronGeometry args={[1]} />}
          <meshStandardMaterial
            color={i === elements.length - 1 ? COLORS.architectureAccent : COLORS.architectureBase}
            roughness={0.7}
            metalness={0.2}
            transparent
            opacity={i === elements.length - 1 ? 0.8 : 0.6}
          />
        </mesh>
      ))}
    </group>
  );
}

// ============================================================================
// SKY GRADIENT BACKGROUND
// ============================================================================

function SkyGradient() {
  return (
    <mesh position={[0, 0, 150]} scale={[400, 200, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          varying vec2 vUv;
          uniform vec3 colorTop;
          uniform vec3 colorBottom;
          uniform vec3 sunColor;

          void main() {
            // Gradient from bottom (bright) to top (dark)
            vec3 color = mix(colorBottom, colorTop, vUv.y);

            // Add sun glow near center-bottom
            float sunDist = distance(vUv, vec2(0.5, 0.3));
            float sunGlow = exp(-sunDist * 3.0) * 0.5;
            color += sunColor * sunGlow;

            gl_FragColor = vec4(color, 1.0);
          }
        `}
        uniforms={{
          colorTop: { value: COLORS.skyTop },
          colorBottom: { value: COLORS.skyBottom },
          sunColor: { value: COLORS.sunGlow },
        }}
        depthWrite={false}
      />
    </mesh>
  );
}

// ============================================================================
// MAIN CAMERA CONTROLLER
// ============================================================================

interface CameraControllerProps {
  scrollProgress: number;
  cameraPath: CatmullRomCurve3;
}

function CameraController({ scrollProgress, cameraPath }: CameraControllerProps) {
  const { camera } = useThree();
  const targetRef = useRef(new Vector3());
  const positionRef = useRef(new Vector3());

  useFrame(() => {
    // Get position along the path based on scroll progress
    const pathProgress = Math.min(scrollProgress, 0.95); // Don't go all the way to end
    cameraPath.getPoint(pathProgress, positionRef.current);

    // Smooth camera position
    camera.position.lerp(positionRef.current, 0.1);

    // Get look-at target
    const target = getCameraTarget(scrollProgress);
    targetRef.current.lerp(target, 0.1);

    camera.lookAt(targetRef.current);
  });

  return null;
}

// ============================================================================
// MAIN DESERT JOURNEY COMPONENT
// ============================================================================

export function DesertJourney({ scrollProgress }: DesertJourneyProps) {
  const cameraPath = useMemo(() => createCameraPath(), []);

  // Calculate fog intensity based on scroll progress
  // Fog gets denser as we approach the horizon, then lifts for transition
  const fogDensity = useMemo(() => {
    if (scrollProgress < 0.3) return 0.008;
    if (scrollProgress < 0.7) return 0.012;
    if (scrollProgress < 0.9) return 0.015;
    return 0.02 * (1 - (scrollProgress - 0.9) / 0.1); // Fade out at end
  }, [scrollProgress]);

  return (
    <>
      {/* Atmospheric fog */}
      <fog attach="fog" args={[COLORS.fog.getHex(), 10, 120]} />

      {/* Ambient lighting */}
      <ambientLight intensity={0.4} color="#ffaa77" />

      {/* Sun directional light */}
      <directionalLight
        position={[20, 30, 100]}
        intensity={1.5}
        color="#ffcc88"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />

      {/* Fill light from below (sand reflection) */}
      <hemisphereLight
        args={['#ff8844', '#442200', 0.3]}
      />

      {/* Camera controller */}
      <CameraController scrollProgress={scrollProgress} cameraPath={cameraPath} />

      {/* Sky background */}
      <SkyGradient />

      {/* Sun with lens flare */}
      <Sun />

      {/* Desert terrain */}
      <DesertTerrain />

      {/* Sand particles */}
      <SandParticles count={400} />

      {/* Architectural elements */}
      <ArchitecturalElements />
    </>
  );
}

export default DesertJourney;
