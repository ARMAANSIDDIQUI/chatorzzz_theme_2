import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiShoppingBag, FiStar } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import axios from 'axios';

export default function ProductCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('/api/products');
        const productList = Array.isArray(data) ? data : data?.products || [];
        setProducts(productList.slice(0, 8)); // Grab up to 8 for a good carousel
      } catch (err) {
        console.error('Failed to fetch carousel products', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (products.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % products.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [products]);

  const next = () => setCurrentIndex((currentIndex + 1) % products.length);
  const prev = () => setCurrentIndex((currentIndex - 1 + products.length) % products.length);

  // Get 4 items to display based on current index
  const getVisibleItems = () => {
    if (products.length === 0) return [];
    let items = [];
    const count = Math.min(products.length, 4);
    for (let i = 0; i < count; i++) {
      items.push(products[(currentIndex + i) % products.length]);
    }
    return items;
  };

  return (
    <section className="py-20 relative z-10 overflow-hidden bg-white/30 backdrop-blur-sm">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-end gap-6 mb-2">
            <div>
              <h2 className="text-4xl font-black italic text-fuchsia-900 tracking-tighter">
                Sweet Trending
              </h2>
              <p className="text-fuchsia-700 font-bold">Pick your magic today!</p>
            </div>
            <Link to="/products" className="mb-1 text-fuchsia-400 font-black italic hover:text-fuchsia-600 transition-all flex items-center gap-1 group whitespace-nowrap">
              See All <FiChevronRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="flex gap-4">
            <button onClick={prev} className="p-4 rounded-2xl bg-white shadow-lg text-fuchsia-600 hover:bg-fuchsia-100 transition-all border border-fuchsia-100">
              <FiChevronLeft size={24} />
            </button>
            <button onClick={next} className="p-4 rounded-2xl bg-white shadow-lg text-fuchsia-600 hover:bg-fuchsia-100 transition-all border border-fuchsia-100">
              <FiChevronRight size={24} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {loading ? (
            <div className="col-span-full py-20 text-center text-fuchsia-500 font-bold italic animate-pulse">
              Unwrapping sweet trends...
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {getVisibleItems().map((product, idx) => (
                <motion.div
                  key={`${product._id}-${idx}`}
                  layout
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                  className="glass-panel p-6 rounded-[2.5rem] group"
                >
                  <Link to={`/product/${product.slug || product._id}`} className="block relative mb-6">
                    <div className="aspect-square rounded-[2rem] bg-gradient-to-tr from-fuchsia-100 to-cyan-100 overflow-hidden shadow-inner">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="absolute top-4 right-4 p-2 bg-white/80 rounded-xl shadow-sm text-amber-500 flex items-center gap-1 font-black text-xs">
                      <FiStar fill="currentColor" size={12} />
                      {product.rating}
                    </div>
                  </Link>
                  
                  <div className="text-center">
                    <h3 className="text-xl font-black italic text-gray-800 mb-2">{product.name}</h3>
                    <div className="text-2xl font-black text-fuchsia-500 italic mb-6">
                      <span className="text-sm mr-1">₹</span>{product.price}
                    </div>
                    <button className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl candy-gradient text-gray-900 font-black italic shadow-lg hover:shadow-fuchsia-300 transition-all transform active:scale-95">
                      <FiShoppingBag />
                      Quick Add
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </section>
  );
}
