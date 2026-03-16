import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sphere, Cylinder } from '@react-three/drei';

function MiniLollipop({ position, color, speed, rotationIntensity, floatIntensity, scale }) {
  return (
    <Float speed={speed} rotationIntensity={rotationIntensity} floatIntensity={floatIntensity} position={position}>
      <group scale={scale}>
        <Sphere args={[1, 32, 32]} position={[0, 0.75, 0]}>
          <meshPhysicalMaterial color={color} transmission={0.9} roughness={0.1} clearcoat={1} />
        </Sphere>
        <Cylinder args={[0.1, 0.1, 2.5, 16]} position={[0, -0.5, 0]}>
          <meshStandardMaterial color="#ffffff" />
        </Cylinder>
      </group>
    </Float>
  );
}

export default function FloatingCandies() {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      <MiniLollipop position={[-4, 2, -2]} color="#BFE9FF" speed={2} rotationIntensity={1} floatIntensity={2} scale={0.4} />
      <MiniLollipop position={[4, -1, -3]} color="#B8FFD8" speed={3} rotationIntensity={2} floatIntensity={1.5} scale={0.5} />
      <MiniLollipop position={[-3, -2, 1]} color="#FFB6E6" speed={2.5} rotationIntensity={1.5} floatIntensity={2} scale={0.3} />
      <MiniLollipop position={[3, 3, 0]} color="#FFF3A6" speed={1.5} rotationIntensity={2} floatIntensity={3} scale={0.45} />
    </group>
  );
}
