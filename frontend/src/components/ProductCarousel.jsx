import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiShoppingBag, FiStar } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';

export default function ProductCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('/api/products');
        const productList = Array.isArray(data) ? data : data?.products || [];
        setProducts(productList.slice(0, 8));
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
      setCurrentIndex(prev => (prev + 1) % products.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [products]);

  const next = () => setCurrentIndex((currentIndex + 1) % products.length);
  const prev = () => setCurrentIndex((currentIndex - 1 + products.length) % products.length);

  // On mobile show 1, sm show 2, lg show 4
  const getVisibleItems = (count) => {
    if (products.length === 0) return [];
    const items = [];
    const n = Math.min(products.length, count);
    for (let i = 0; i < n; i++) {
      items.push(products[(currentIndex + i) % products.length]);
    }
    return items;
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 relative z-10 overflow-hidden bg-white/30 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6">

        {/* Header row */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 sm:mb-12">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black italic text-fuchsia-900 tracking-tighter">
              Sweet Trending
            </h2>
            <p className="text-sm sm:text-base text-fuchsia-700 font-bold mt-1">Pick your magic today!</p>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              to="/products"
              className="text-fuchsia-400 font-black italic hover:text-fuchsia-600 transition-all flex items-center gap-1 group text-sm whitespace-nowrap"
            >
              See All <FiChevronRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <button
              onClick={prev}
              className="p-2.5 sm:p-3 rounded-xl bg-white shadow-md text-fuchsia-600 hover:bg-fuchsia-100 transition-all border border-fuchsia-100"
            >
              <FiChevronLeft size={20} />
            </button>
            <button
              onClick={next}
              className="p-2.5 sm:p-3 rounded-xl bg-white shadow-md text-fuchsia-600 hover:bg-fuchsia-100 transition-all border border-fuchsia-100"
            >
              <FiChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Cards grid — 1 col mobile, 2 col sm, 4 col lg */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {loading ? (
            <div className="col-span-full py-16 text-center text-fuchsia-500 font-bold italic animate-pulse">
              Unwrapping sweet trends...
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {/* Show 1 on mobile, 2 on sm, 4 on lg — CSS handles hiding extra cards */}
              {getVisibleItems(4).map((product, idx) => (
                <motion.div
                  key={`${product._id}-${idx}`}
                  layout
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className={`glass-panel p-4 sm:p-5 rounded-[2rem] group ${
                    idx === 0 ? 'block' :
                    idx === 1 ? 'hidden sm:block' :
                    'hidden lg:block'
                  }`}
                >
                  <Link to={`/product/${product.slug || product._id}`} className="block relative mb-4">
                    <div className="aspect-square rounded-[1.5rem] sm:rounded-[2rem] bg-gradient-to-tr from-fuchsia-100 to-cyan-100 overflow-hidden shadow-inner">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="absolute top-3 right-3 px-2 py-1 bg-white/90 rounded-xl shadow-sm text-amber-500 flex items-center gap-1 font-black text-xs">
                      <FiStar fill="currentColor" size={11} />
                      {product.rating}
                    </div>
                  </Link>

                  <div className="text-center">
                    <h3 className="text-base sm:text-lg font-black italic text-gray-800 mb-1 truncate px-1">
                      {product.name}
                    </h3>
                    <div className="text-xl sm:text-2xl font-black text-fuchsia-500 italic mb-4">
                      <span className="text-sm mr-0.5">₹</span>{product.price}
                    </div>
                    <button
                      onClick={() => addToCart(product, 1)}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl sm:rounded-2xl candy-gradient text-gray-900 font-black italic shadow-md hover:shadow-fuchsia-300 transition-all active:scale-95 text-sm"
                    >
                      <FiShoppingBag size={15} />
                      Quick Add
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Dot indicators */}
        {products.length > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {products.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === currentIndex
                    ? 'w-6 h-2 bg-fuchsia-500'
                    : 'w-2 h-2 bg-fuchsia-200 hover:bg-fuchsia-300'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
