'use client';
import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Float } from '@react-three/drei';
import * as THREE from 'three';

const SKILLS = [
  { label: 'React',     color: '#61dafb', r: 2.4, speed: 0.4,  phase: 0 },
  { label: 'Next.js',   color: '#ffffff', r: 2.4, speed: 0.4,  phase: Math.PI / 3 },
  { label: 'Node.js',   color: '#68a063', r: 2.4, speed: 0.4,  phase: (2 * Math.PI) / 3 },
  { label: 'MongoDB',   color: '#47a248', r: 3.2, speed: -0.3, phase: 0 },
  { label: 'TypeScript',color: '#3178c6', r: 3.2, speed: -0.3, phase: Math.PI / 2 },
  { label: 'PHP',       color: '#8892bf', r: 3.2, speed: -0.3, phase: Math.PI },
  { label: 'MySQL',     color: '#f29111', r: 3.2, speed: -0.3, phase: (3 * Math.PI) / 2 },
  { label: 'Docker',    color: '#0db7ed', r: 4.0, speed: 0.2,  phase: Math.PI / 4 },
  { label: 'Git',       color: '#f05032', r: 4.0, speed: 0.2,  phase: (3 * Math.PI) / 4 },
  { label: 'AWS',       color: '#ff9900', r: 4.0, speed: 0.2,  phase: (5 * Math.PI) / 4 },
  { label: 'Tailwind',  color: '#38bdf8', r: 4.0, speed: 0.2,  phase: (7 * Math.PI) / 4 },
];

function SkillNode({ label, color, r, speed, phase }: typeof SKILLS[0]) {
  const ref = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed + phase;
    if (ref.current) {
      ref.current.position.x = Math.cos(t) * r;
      ref.current.position.z = Math.sin(t) * r;
    }
  });

  return (
    <group ref={ref} position={[r, 0, 0]}>
      <Float speed={3} floatIntensity={0.3}>
        <mesh>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} />
        </mesh>
        <Text
          position={[0, 0.28, 0]}
          fontSize={0.18}
          color={color}
          anchorX="center"
          anchorY="bottom"
          font="/fonts/JetBrainsMono-Regular.woff"
        >
          {label}
        </Text>
      </Float>
    </group>
  );
}

function CoreSphere() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * 0.2;
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.6, 32, 32]} />
      <meshStandardMaterial
        color="#080810"
        emissive="#00d4ff"
        emissiveIntensity={0.15}
        roughness={0.2}
        metalness={0.9}
        wireframe
      />
    </mesh>
  );
}

export default function SkillsOrbit() {
  return (
    <Canvas camera={{ position: [0, 2, 8], fov: 50 }} style={{ background: 'transparent' }} dpr={[1, 2]}>
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 0, 0]} intensity={2} color="#00d4ff" />
      <CoreSphere />
      {SKILLS.map((s) => <SkillNode key={s.label} {...s} />)}
    </Canvas>
  );
}
