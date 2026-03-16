import React from 'react';
import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import FeaturedProducts from '../components/FeaturedProducts';
import CandyStory from '../components/CandyStory';
import CandyGallery from '../components/CandyGallery';
import ProductCarousel from '../components/ProductCarousel';
import CTA from '../components/CTA';

export default function Home() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Hero />
      <ProductCarousel />
      <FeaturedProducts />
      <CandyStory />
      <CandyGallery />
      <CTA />
    </motion.div>
  );
}
