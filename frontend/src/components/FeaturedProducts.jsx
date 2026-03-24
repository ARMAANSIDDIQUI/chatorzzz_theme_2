import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { RiSparklingFill } from 'react-icons/ri';
import axios from 'axios';
import ProductCard from './ProductCard';

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('/api/products');
        const productList = Array.isArray(data) ? data : data?.products || [];
        setProducts(productList.slice(0, 3));
      } catch (err) {
        console.error('Failed to fetch featured products', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className="py-24 px-6 relative z-10">
      <div className="container mx-auto max-w-6xl">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="text-center mb-16"
        >
          <motion.div variants={itemVariants} className="flex justify-center mb-4">
             <RiSparklingFill size={40} className="text-amber-400 animate-pulse" />
          </motion.div>
          <motion.h2 variants={itemVariants} className="text-5xl font-black italic text-fuchsia-900 mb-4 tracking-tighter">
            Featured Sweets
          </motion.h2>
          <motion.p variants={itemVariants} className="text-lg text-fuchsia-800 font-medium">Our most magical creations, just for you.</motion.p>
        </motion.div>
        
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {loading ? (
            <div className="col-span-full py-12 text-center text-fuchsia-500 font-bold italic animate-pulse">
              Sprinkling magic on products...
            </div>
          ) : products.map((product) => (
            <motion.div key={product._id} variants={itemVariants}>
              <ProductCard 
                id={product._id}
                name={product.name} 
                price={product.price} 
                image={product.image} 
                rating={product.rating}
              />
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <Link to="/products" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl candy-gradient text-white font-black italic shadow-xl hover:shadow-fuchsia-200 transform hover:-translate-y-1 transition-all">
            See All Sweets
            <FiArrowRight />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
