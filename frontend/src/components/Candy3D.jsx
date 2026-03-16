import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

export default function Candy3D() {
  const groupRef = useRef();
  const [active, setActive] = React.useState(false);
  const spinRef = useRef(0);

  // Rotate based on mouse and time
  useFrame((state, delta) => {
    if (groupRef.current) {
      // Unconditional revolving
      spinRef.current += delta * 0.5;
      
      // Cursor responsiveness (Subtle Tilt)
      // "Rotate to left wen cursor wants it to" - Inverting mouse influence
      const targetX = -state.mouse.x * 0.5; 
      const targetY = state.mouse.y * 0.2;
      
      // Combine base spin with mouse offset
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y, 
        spinRef.current + targetX, 
        0.05
      );
      
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x, 
        -targetY, 
        0.05
      );

      // Pulse on click
      const scale = active ? 1.2 : 1.0;
      groupRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
    }
  });

  // Generate a swirl texture procedurally
  const swirlTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024; // Increased resolution for crispness
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    
    // Fill base white
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 1024, 1024);

    // Create alternating spiral stripes
    const stripeCount = 12; // Number of stripes
    const stripeWidth = 1024 / stripeCount;
    
    for (let i = 0; i < stripeCount; i++) {
      if (i % 2 === 0) continue; // Leave white gaps
      
      ctx.fillStyle = '#ff0080'; // Candy Red/Pink
      ctx.beginPath();
      const xStart = i * stripeWidth;
      
      // Draw diagonal stripe for spiral effect
      // x1,y1 to x2,y2 where x2 is offset to create twist
      ctx.moveTo(xStart, 0);
      ctx.lineTo(xStart + stripeWidth, 0);
      ctx.lineTo(xStart + stripeWidth + 1024, 1024); // Sharp twist
      ctx.lineTo(xStart + 1024, 1024);
      ctx.closePath();
      ctx.fill();
      
      // Fill across gaps (wrap around canvas)
      ctx.beginPath();
      ctx.moveTo(xStart - 1024, 0);
      ctx.lineTo(xStart + stripeWidth - 1024, 0);
      ctx.lineTo(xStart + stripeWidth, 1024);
      ctx.lineTo(xStart, 1024);
      ctx.closePath();
      ctx.fill();
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.anisotropy = 16;
    return texture;
  }, []);
  
  return (
    <Float 
      speed={2} 
      rotationIntensity={0.5} 
      floatIntensity={2} 
      floatingRange={[-0.2, 0.2]} 
    >
      <group 
        ref={groupRef} 
        scale={1.73} 
        position={[0, -0.5, 0]}
        onClick={() => setActive(!active)}
        onPointerOver={() => (document.body.style.cursor = 'pointer')}
        onPointerOut={() => (document.body.style.cursor = 'auto')}
      >
        {/* Candy Stick (Pipe) - Increased Height to 4.0 */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.05, 0.05, 2.5, 32]} />
          <meshStandardMaterial 
            color="#ffffff" 
            roughness={0.5} 
            metalness={0.1} 
          />
        </mesh>

        {/* Candy Head (Sphere on Pipe) */}
        <mesh position={[0, 1.25, 0]} castShadow receiveShadow>
          <sphereGeometry args={[0.95, 64, 64]} />
          <meshPhysicalMaterial 
            map={swirlTexture}
            clearcoat={1}
            clearcoatRoughness={0.05}
            roughness={0.05}
            metalness={0.1}
            transmission={0.4} 
            thickness={1.5}
            ior={1.45}
            color="#ffffff"
          />
        </mesh>
      </group>
    </Float>
  );
}
