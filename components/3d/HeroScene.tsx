'use client';
import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Sphere, MeshDistortMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';

/* ── Floating code particles ─────────────────────────────────────── */
function CodeParticles() {
  const ref = useRef<THREE.Points>(null!);

  const positions = useMemo(() => {
    const count = 800;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 14;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 14;
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta * 0.04;
      ref.current.rotation.y -= delta * 0.06;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#00d4ff"
        size={0.025}
        sizeAttenuation
        depthWrite={false}
        opacity={0.7}
      />
    </Points>
  );
}

/* ── Glowing distorted sphere ────────────────────────────────────── */
function GlowSphere() {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.15;
      meshRef.current.rotation.z = clock.getElapsedTime() * 0.08;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1.2}>
      <mesh ref={meshRef} scale={1.6}>
        <Sphere args={[1, 64, 64]}>
          <MeshDistortMaterial
            color="#0f0f1a"
            attach="material"
            distort={0.45}
            speed={2.5}
            roughness={0.1}
            metalness={0.9}
            wireframe={false}
          />
        </Sphere>
        {/* Outer glow ring */}
        <mesh scale={1.08}>
          <Sphere args={[1, 32, 32]}>
            <meshBasicMaterial
              color="#00d4ff"
              transparent
              opacity={0.04}
              side={THREE.BackSide}
            />
          </Sphere>
        </mesh>
      </mesh>
    </Float>
  );
}

/* ── Orbiting rings ──────────────────────────────────────────────── */
function OrbitRing({ radius, speed, tilt, color }: {
  radius: number; speed: number; tilt: number; color: string;
}) {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.z = clock.getElapsedTime() * speed;
    }
  });

  return (
    <mesh ref={ref} rotation={[tilt, 0, 0]}>
      <torusGeometry args={[radius, 0.004, 2, 120]} />
      <meshBasicMaterial color={color} transparent opacity={0.35} />
    </mesh>
  );
}

/* ── Floating tech icons (icosahedra) ───────────────────────────── */
function FloatingOrb({ position, color, scale = 1 }: {
  position: [number, number, number]; color: string; scale?: number;
}) {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.y =
        position[1] + Math.sin(clock.getElapsedTime() * 0.8 + position[0]) * 0.15;
      ref.current.rotation.x += 0.008;
      ref.current.rotation.y += 0.012;
    }
  });

  return (
    <mesh ref={ref} position={position} scale={scale}>
      <icosahedronGeometry args={[0.18, 0]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.6}
        roughness={0.1}
        metalness={0.8}
      />
    </mesh>
  );
}

/* ── Scene composition ───────────────────────────────────────────── */
function Scene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} color="#00d4ff" />
      <pointLight position={[-4, -4, -4]} intensity={1.2} color="#a855f7" />
      <pointLight position={[4, 4, 4]}  intensity={0.6} color="#00d4ff" />

      <CodeParticles />
      <GlowSphere />

      <OrbitRing radius={2.4} speed={0.3}  tilt={Math.PI / 6}  color="#00d4ff" />
      <OrbitRing radius={3.0} speed={-0.2} tilt={Math.PI / 3}  color="#a855f7" />
      <OrbitRing radius={3.6} speed={0.15} tilt={Math.PI / 1.5} color="#00d4ff" />

      <FloatingOrb position={[ 2.6,  0.6,  0.4]} color="#00d4ff" />
      <FloatingOrb position={[-2.8, -0.4,  0.2]} color="#a855f7" />
      <FloatingOrb position={[ 0.4,  2.8, -0.3]} color="#00d4ff" scale={0.8} />
      <FloatingOrb position={[-0.6, -2.6,  0.5]} color="#f59e0b" scale={0.7} />
    </>
  );
}

/* ── Export ──────────────────────────────────────────────────────── */
export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 55 }}
      style={{ background: 'transparent' }}
      dpr={[1, 2]}
    >
      <Scene />
    </Canvas>
  );
}
