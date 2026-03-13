import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Environment, PerspectiveCamera, ContactShadows } from '@react-three/drei';
import Candy3D from './Candy3D';
import FloatingCandies from './FloatingCandies';

export default function Hero() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background 3D Canvas */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Canvas>
          <Suspense fallback={null}>
            <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} color="#FFB6E6" />
            <pointLight position={[-10, -10, -10]} intensity={0.5} color="#BFE9FF" />
            <Environment preset="city" />
            <FloatingCandies />
            <ContactShadows position={[0, -3, 0]} opacity={0.4} scale={20} blur={2} far={4.5} />
          </Suspense>
        </Canvas>
      </div>

      <div className="container mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center h-full pt-10 lg:pt-0">
        {/* Left Side: Text */}
        <div className="flex flex-col gap-6 text-center lg:text-left order-2 lg:order-1">
          <motion.h1 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-6xl md:text-8xl font-black tracking-tighter text-fuchsia-900 drop-shadow-lg leading-tight"
          >
            Welcome To The <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-400">
              Sweetest World
            </span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-xl md:text-2xl text-fuchsia-800 font-medium"
          >
            Magical candies bursting with color and flavor.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap gap-4 justify-center lg:justify-start mt-4"
          >
            <button className="px-8 py-4 rounded-full bg-fuchsia-500 text-white font-bold text-lg shadow-xl hover:bg-fuchsia-400 hover:scale-105 transition-all duration-300">
              Explore Candies
            </button>
            <button className="px-8 py-4 rounded-full glass-panel text-fuchsia-900 font-bold text-lg hover:bg-white/60 hover:scale-105 transition-all duration-300">
              Shop Now
            </button>
          </motion.div>
        </div>

        {/* Right Side: 3D Candy */}
        <div className="h-[400px] lg:h-[600px] w-full relative pointer-events-none order-1 lg:order-2">
          <Canvas>
            <Suspense fallback={null}>
              <PerspectiveCamera makeDefault position={[0, 0, 7]} fov={50} />
              <ambientLight intensity={0.8} />
              <directionalLight position={[5, 5, 5]} intensity={1.5} color="#ffffff" />
              <pointLight position={[-10, -10, -10]} intensity={1} color="#BFE9FF" />
              <Environment preset="city" />
              <Candy3D />
            </Suspense>
          </Canvas>
        </div>
      </div>
    </section>
  );
}
