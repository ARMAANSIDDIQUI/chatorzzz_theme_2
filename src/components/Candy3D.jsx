import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

export default function Candy3D() {
  const groupRef = useRef();

  // Rotate slowly on Y axis
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.5;
    }
  });

  // Generate a swirl texture procedurally
  const swirlTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    
    // Base gradient
    const gradient = ctx.createLinearGradient(0, 0, 1024, 1024);
    gradient.addColorStop(0, '#FFB6E6'); // Cotton Candy Pink
    gradient.addColorStop(0.5, '#CDB4FF'); // Lavender
    gradient.addColorStop(1, '#BFE9FF'); // Pastel Blue
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1024, 1024);

    // Draw swirls
    ctx.lineWidth = 60;
    ctx.lineCap = 'round';
    const colors = ['#ffffff', '#FFF3A6', '#B8FFD8'];

    for (let c = 0; c < colors.length; c++) {
      ctx.strokeStyle = colors[c];
      ctx.beginPath();
      for (let i = 0; i < 800; i++) {
        const angle = 0.05 * i + (c * Math.PI * 2 / colors.length);
        const radius = 0.8 * angle * 20;
        const x = 512 + radius * Math.cos(angle);
        const y = 512 + radius * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.anisotropy = 16;
    return texture;
  }, []);

  return (
    <Float 
      speed={2} // Animation speed
      rotationIntensity={0.5} // XYZ rotation intensity
      floatIntensity={2} // Up/down float intensity
      floatingRange={[-0.2, 0.2]} // Range of y-axis values
    >
      <group ref={groupRef} scale={1.5} position={[0, -0.5, 0]}>
        {/* Candy Head */}
        <mesh position={[0, 1.25, 0]} castShadow receiveShadow>
          {/* Slightly flattened sphere for a lollipop look */}
          <sphereGeometry args={[1, 64, 64]} />
          <meshPhysicalMaterial 
            map={swirlTexture}
            clearcoat={1}
            clearcoatRoughness={0.1}
            roughness={0.1}
            metalness={0.1}
            transmission={0.3} // Slight glassiness
            thickness={2}
            ior={1.5}
          />
        </mesh>
        
        {/* Candy Stick */}
        <mesh position={[0, -0.5, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.1, 0.1, 2.5, 32]} />
          <meshStandardMaterial 
            color="#ffffff" 
            roughness={0.8} 
            metalness={0.1} 
          />
        </mesh>

        {/* Sparkle Particles */}
        <Sparkles 
          count={50} 
          scale={3} 
          size={4} 
          speed={0.4} 
          opacity={0.8} 
          color="#FFF3A6" 
          position={[0, 1.25, 0]} 
        />
      </group>
    </Float>
  );
}
