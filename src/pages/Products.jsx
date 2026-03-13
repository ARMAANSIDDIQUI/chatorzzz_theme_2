import React from 'react';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard';

export default function Products() {
  const allProducts = [
    { name: 'Unicorn Pop', price: '$4.99', image: 'https://cdn-icons-png.flaticon.com/512/2682/2682465.png' },
    { name: 'Gummy Stars', price: '$3.50', image: 'https://cdn-icons-png.flaticon.com/512/3014/3014522.png' },
    { name: 'Cotton Clouds', price: '$5.00', image: 'https://cdn-icons-png.flaticon.com/512/2682/2682467.png' },
    { name: 'Rainbow Swirl', price: '$6.50', image: 'https://cdn-icons-png.flaticon.com/512/2682/2682465.png' },
    { name: 'Berry Blast', price: '$4.00', image: 'https://cdn-icons-png.flaticon.com/512/3014/3014522.png' },
    { name: 'Magic Beans', price: '$3.99', image: 'https://cdn-icons-png.flaticon.com/512/2682/2682467.png' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="pt-32 pb-24 px-6 min-h-screen relative z-10"
    >
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl md:text-7xl font-black text-fuchsia-900 mb-4 drop-shadow-md"
          >
            All Sweets
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-fuchsia-800"
          >
            Discover our entire magical collection.
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {allProducts.map((product, index) => (
            <ProductCard 
              key={index} 
              name={product.name} 
              price={product.price} 
              image={product.image} 
              delay={index * 0.1} 
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
