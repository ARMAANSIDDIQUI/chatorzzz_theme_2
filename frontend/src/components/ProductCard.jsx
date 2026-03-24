import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiStar, FiPlus, FiInfo } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

    export default function ProductCard({ id, name, price, image, rating, stock, delay, slug }) {
      const { addToCart } = useCart();
    
      const handleAddToCart = (e) => {
        e.preventDefault();
        addToCart({ product: id, name, price, image, stock }, 1);
        toast.success(`${name} added to bag!`, {
          icon: '🍬',
          style: {
            borderRadius: '20px',
            background: '#fff',
            color: '#d946ef',
            fontWeight: 'bold'
          },
        });
      };
      return (
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: delay }}
          whileHover={{ y: -10 }}
          className="glass-panel rounded-[2.5rem] p-6 flex flex-col items-center gap-4 relative overflow-hidden group cursor-pointer border border-white/40"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2.5rem]"></div>
          
          <Link to={`/product/${slug || id}`} className="w-full relative">
            <div className="w-full aspect-square rounded-[2rem] bg-gradient-to-tr from-fuchsia-100/50 to-cyan-100/50 flex items-center justify-center shadow-inner overflow-hidden relative">
          <motion.img 
            whileHover={{ scale: 1.1, rotate: 2 }}
            transition={{ type: 'spring', stiffness: 200, damping: 10 }}
            src={image} 
            alt={name} 
            className="w-full h-full object-cover rounded-[1.8rem] shadow-sm transform transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-3 right-3 flex items-center gap-1 px-3 py-1 bg-white/80 backdrop-blur-md rounded-full text-xs font-black text-amber-500 shadow-sm">
            <FiStar fill="currentColor" size={10} />
            {rating}
          </div>
        </div>
      </Link>
      
      <div className="text-center z-10 w-full">
        <h3 className="text-2xl font-black italic text-gray-800 mb-1 leading-tight">{name}</h3>
        <p className="text-2xl font-black text-fuchsia-500 mb-6 italic">
          <span className="text-sm mr-1">₹</span>{typeof price === 'string' ? price.replace('$', '').replace('₹', '') : price}
        </p>
        
        <div className="flex items-center gap-2">
           <Link 
            to={`/product/${id}`}
            className="flex-grow flex items-center justify-center gap-2 py-3 rounded-2xl bg-white/60 text-gray-700 font-bold hover:bg-white transition-all text-sm border border-white/60"
          >
            <FiInfo />
            Details
          </Link>
          <button 
            onClick={handleAddToCart}
            className="p-3 rounded-2xl candy-gradient text-gray-900 shadow-lg hover:shadow-fuchsia-200 transform active:scale-95 transition-all"
          >
            <FiPlus size={20} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
