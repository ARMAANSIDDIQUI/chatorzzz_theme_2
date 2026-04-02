import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { FiShoppingBag, FiSearch, FiFilter, FiStar, FiPlus, FiArrowRight } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import toast from 'react-hot-toast';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          axios.get('/api/products'),
          axios.get('/api/categories')
        ]);
        setProducts(prodRes.data);
        setCategories(['All', ...catRes.data.map(c => c.name)]);
        setLoading(false);
      } catch (err) {
        toast.error('Failed to load sweets');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === 'All' || p.category === category;
    const matchesMinPrice = minPrice === '' || p.price >= Number(minPrice);
    const matchesMaxPrice = maxPrice === '' || p.price <= Number(maxPrice);
    return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <div className="container mx-auto px-4 pt-44 md:pt-40 pb-20 max-w-7xl">
      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-block px-4 py-1.5 rounded-full bg-fuchsia-100 text-fuchsia-600 font-black text-xs uppercase tracking-widest mb-4"
        >
          Our Curated Collection
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-6xl lg:text-7xl font-black italic bg-gradient-to-r from-fuchsia-500 to-cyan-500 bg-clip-text text-transparent tracking-tighter"
        >
          Sweet Universe
        </motion.h1>
        <p className="text-gray-500 mt-6 text-xl font-medium max-w-2xl mx-auto italic">
          Indulge in our collection of artisanal candies, crafted to spark joy in every bite.
        </p>
      </div>

      {/* Prominent Wide Search Bar */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-5xl mx-auto mb-8 relative group"
      >
        <div className="absolute inset-0 bg-fuchsia-100/30 blur-[60px] rounded-full -z-10 group-focus-within:bg-fuchsia-200/50 transition-all"></div>
        <div className="glass-panel p-1.5 md:p-2 rounded-[2.5rem] md:rounded-[3.5rem] flex flex-col md:flex-row items-center border-white/80 shadow-2xl backdrop-blur-xl gap-2 md:gap-0">
          <div className="flex-grow relative group w-full">
            <FiSearch className="absolute left-6 md:left-8 top-1/2 -translate-y-1/2 text-fuchsia-400 group-focus-within:text-fuchsia-600 transition-colors" size={20} />
            <input
              type="text"
              placeholder="What magic are you seeking?"
              className="w-full pl-14 md:pl-20 pr-8 md:pr-10 py-5 md:py-6 rounded-[2rem] md:rounded-[3rem] bg-transparent border-none focus:ring-0 font-bold text-gray-800 placeholder:text-gray-400 italic text-lg md:text-xl transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`w-full md:w-auto px-8 py-4 md:py-5 rounded-[2rem] md:rounded-[3rem] flex items-center justify-center gap-3 font-black italic transition-all md:mr-2 ${showFilters ? 'candy-gradient text-white shadow-lg' : 'bg-fuchsia-50 text-fuchsia-600 hover:bg-fuchsia-100'}`}
          >
            <FiFilter size={20} />
            <span>Filters</span>
          </button>
        </div>
      </motion.div>

      {/* Advanced Filter Section */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="max-w-5xl mx-auto mb-16 overflow-hidden"
          >
            <div className="glass-panel p-6 md:p-10 rounded-[2.5rem] md:rounded-[3rem] border-white/60 bg-white/40 shadow-xl grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              {/* Categories */}
              <div>
                <h4 className="text-xs font-black text-fuchsia-900 uppercase tracking-[0.2em] mb-6 italic">Artisan Collections</h4>
                <div className="flex flex-wrap gap-2">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${category === cat ? 'candy-gradient text-white shadow-md' : 'bg-white/80 text-fuchsia-400 hover:bg-fuchsia-50 hover:text-fuchsia-600'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h4 className="text-xs font-black text-fuchsia-900 uppercase tracking-[0.2em] mb-6 italic">Price Range (₹)</h4>
                <div className="flex items-center gap-3">
                  <input
                    type="number" placeholder="Min"
                    className="w-full bg-white/80 border-none rounded-2xl p-3 text-xs font-bold text-fuchsia-900 focus:ring-2 focus:ring-fuchsia-300"
                    value={minPrice} onChange={(e) => setMinPrice(e.target.value)}
                  />
                  <div className="w-4 h-[2px] bg-fuchsia-100 italic"></div>
                  <input
                    type="number" placeholder="Max"
                    className="w-full bg-white/80 border-none rounded-2xl p-3 text-xs font-bold text-fuchsia-900 focus:ring-2 focus:ring-fuchsia-300"
                    value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}
                  />
                </div>
              </div>

              {/* Sorting */}
              <div>
                <h4 className="text-xs font-black text-fuchsia-900 uppercase tracking-[0.2em] mb-6 italic">Sort By</h4>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-white/80 border-none rounded-2xl p-3 text-xs font-black text-fuchsia-900 focus:ring-2 focus:ring-fuchsia-300 italic"
                >
                  <option value="newest">Newest Reveals</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
                <button
                  onClick={() => { setSearchTerm(''); setCategory('All'); setMinPrice(''); setMaxPrice(''); setSortBy('newest'); }}
                  className="mt-6 text-[10px] font-black text-fuchsia-400 hover:text-fuchsia-600 uppercase tracking-widest flex items-center gap-2 transition-all"
                >
                  Reset All Filters
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product Grid */}
      {loading ? (
        <div className="text-center py-40">
          <div className="text-4xl font-black italic text-fuchsia-500 animate-pulse uppercase tracking-widest">Loading Sweets...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product, idx) => (
              <ProductCard
                key={product._id}
                id={product._id}
                slug={product.slug}
                name={product.name}
                price={product.price.toString()}
                image={product.image}
                rating={product.rating}
                stock={product.stock}
                delay={idx * 0.05}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {!loading && filteredProducts.length === 0 && (
        <div className="glass-panel p-20 rounded-[3rem] text-center border-white/40 max-w-2xl mx-auto">
          <div className="inline-block p-6 bg-gray-50 rounded-full text-gray-300 mb-6">
            <FiShoppingBag size={64} />
          </div>
          <h2 className="text-3xl font-black italic text-gray-800 mb-4">No sweets found!</h2>
          <p className="text-gray-500 text-lg font-medium mb-8">We couldn't find any products matching your criteria. Try adjusting your search or category!</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setCategory('All');
              setMinPrice('');
              setMaxPrice('');
              setSortBy('newest');
            }}
            className="px-10 py-4 candy-gradient text-white rounded-2xl font-black italic shadow-lg hover:shadow-fuchsia-200 transition-all"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Products;
