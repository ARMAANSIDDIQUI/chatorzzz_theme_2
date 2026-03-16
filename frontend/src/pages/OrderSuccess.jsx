import React from 'react';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight } from 'react-icons/fi';
import { RiSparklingFill } from 'react-icons/ri';

const OrderSuccess = () => {
  const { id } = useParams();

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel p-12 rounded-[3rem] max-w-2xl w-full text-center relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 candy-gradient"></div>
        
        <div className="flex justify-center mb-8">
          <motion.div 
            initial={{ rotate: -20, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: 'spring', damping: 10 }}
            className="p-6 bg-green-100 rounded-full text-green-500 relative"
          >
            <CheckCircle size={60} />
            <motion.div 
              animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -top-2 -right-2 text-fuchsia-500"
            >
              <RiSparklingFill size={24} />
            </motion.div>
          </motion.div>
        </div>

        <h1 className="text-4xl font-black italic bg-gradient-to-r from-fuchsia-500 to-cyan-500 bg-clip-text text-transparent mb-4">
          Sweet Success!
        </h1>
        <p className="text-gray-600 text-lg font-medium mb-8">
          Your order has been placed and is being prepared with extra sweetness.
        </p>

        <div className="inline-block px-8 py-4 bg-white/50 rounded-2xl border border-white/20 mb-12">
          <span className="text-gray-400 font-bold uppercase tracking-widest text-xs block mb-1">Order Identifier</span>
          <span className="text-xl font-black text-gray-800">{id}</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            to="/profile" 
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/60 text-gray-700 font-bold hover:bg-white transition-all flex items-center justify-center gap-2 border border-white/40"
          >
            <Package size={20} />
            Track Order
          </Link>
          <Link 
            to="/products" 
            className="w-full sm:w-auto px-8 py-4 rounded-2xl candy-gradient text-white font-bold shadow-lg hover:shadow-fuchsia-200/50 transform hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
          >
            Continue Shopping
            <ArrowRight size={20} />
          </Link>
        </div>

        <div className="mt-12 opacity-30 flex justify-center gap-8">
          <RiSparklingFill size={40} className="text-fuchsia-400 animate-pulse" />
          <RiSparklingFill size={40} className="text-cyan-400 animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
      </motion.div>
    </div>
  );
};

export default OrderSuccess;
