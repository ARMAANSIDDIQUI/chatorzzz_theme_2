import React, { Suspense, Component } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { Environment, PerspectiveCamera } from '@react-three/drei';
import Candy3D from './Candy3D';

class CanvasErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error) {
    console.warn('[Hero] 3D Canvas failed to render:', error?.message);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="h-full w-full flex items-center justify-center">
          <img
            src="/homeart.jpeg"
            alt="Artisanal Candy"
            className="h-full w-full object-cover rounded-[2rem] shadow-2xl border-4 border-white"
          />
        </div>
      );
    }
    return this.props.children;
  }
}

export default function Hero() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden pt-20 sm:pt-24 pb-10">
      <div className="container mx-auto px-4 sm:px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Left: Text — shown below 3D on mobile, before on desktop */}
        <div className="flex flex-col gap-5 sm:gap-6 text-center lg:text-left order-2 lg:order-1">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter text-fuchsia-900 drop-shadow-lg leading-tight"
          >
            Candies That{' '}
            <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-400">
              Actually Hit Different
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="text-base sm:text-lg md:text-xl text-fuchsia-800 font-medium leading-relaxed"
          >
            Small batches. Big flavor. No shortcuts. Just pure, hand-crafted magic for your sweet tooth.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex justify-center lg:justify-start mt-2"
          >
            <Link
              to="/products"
              className="px-8 sm:px-12 py-4 sm:py-5 rounded-[2.5rem] candy-gradient text-gray-900 font-black italic text-base sm:text-xl shadow-2xl hover:shadow-fuchsia-400/50 transform hover:-translate-y-1 transition-all duration-300"
            >
              Explore the Collection
            </Link>
          </motion.div>
        </div>

        {/* Right: 3D Canvas */}
        <div className="h-[260px] sm:h-[380px] lg:h-[560px] w-full relative order-1 lg:order-2">
          <CanvasErrorBoundary>
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
          </CanvasErrorBoundary>
        </div>
      </div>
    </section>
  );
}
