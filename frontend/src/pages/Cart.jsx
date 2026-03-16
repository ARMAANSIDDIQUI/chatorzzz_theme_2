import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Cart = () => {
  const { cartItems, addToCart, removeFromCart, itemsPrice, shippingPrice, taxPrice, totalPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      toast.error('Please login to place an order');
      navigate('/login?redirect=checkout');
    } else {
      navigate('/checkout');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-center flex-col items-center justify-center p-4 pt-32">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="relative inline-block mb-8">
            <FiShoppingBag size={120} className="text-fuchsia-200" />
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -top-4 -right-4 text-fuchsia-400"
            >
              <FiPlus size={48} />
            </motion.div>
          </div>
          <h2 className="text-4xl font-black text-gray-800 mb-4 italic">Cart is Empty!</h2>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">Looks like you haven't added any sweetness to your life yet.</p>
          <Link 
            to="/products" 
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl candy-gradient text-white font-bold text-lg shadow-xl hover:shadow-fuchsia-200/50 transform hover:-translate-y-1 transition-all"
          >
            <FiShoppingBag size={20} />
            Explore Sweets
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-44 pb-20 relative z-10">
      <div className="mb-12">
        <h1 className="text-4xl font-black italic bg-gradient-to-r from-fuchsia-500 to-cyan-500 bg-clip-text text-transparent mb-2">
          Your Candy Bag
        </h1>
        <p className="text-gray-500 font-medium">Ready for checkout? Here's what you've picked!</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence>
            {cartItems.map(item => (
              <motion.div
                key={item.product}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="glass-panel p-6 rounded-3xl flex flex-col sm:flex-row items-center gap-6"
              >
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-2xl shadow-inner bg-white/50" 
                />
                
                <div className="flex-grow text-center sm:text-left">
                  <h3 className="text-2xl font-bold text-gray-800 mb-1">{item.name}</h3>
                  <p className="text-fuchsia-500 font-bold text-lg mb-4 text-center sm:text-left flex justify-center sm:justify-start items-center">
                   <span className="text-sm mr-1">$</span>{item.price}
                  </p>
                  
                  <div className="flex items-center justify-center sm:justify-start gap-4">
                    <div className="flex items-center gap-3 bg-white/50 rounded-2xl p-2 border border-white/20">
                      <button 
                        onClick={() => item.qty > 1 && addToCart({ ...item, _id: item.product }, -1)}
                        className="p-1 hover:text-fuchsia-500 transition-colors"
                      >
                        <FiMinus size={18} />
                      </button>
                      <span className="w-8 text-center font-bold text-lg">{item.qty}</span>
                      <button 
                        onClick={() => item.qty < item.stock && addToCart({ ...item, _id: item.product }, 1)}
                        className="p-1 hover:text-fuchsia-500 transition-colors"
                      >
                        <FiPlus size={18} />
                      </button>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.product)}
                      className="p-3 text-red-400 hover:bg-red-50 rounded-2xl transition-colors"
                    >
                      <FiTrash2 size={20} />
                    </button>
                  </div>
                </div>

                <div className="text-right hidden sm:block">
                  <span className="text-3xl font-black text-gray-800 whitespace-nowrap">
                    ${(item.price * item.qty).toFixed(2)}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="glass-panel p-8 rounded-[2.5rem] sticky top-24 border-2 border-white/40">
            <h2 className="text-2xl font-black italic text-gray-800 mb-8">Summary</h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between font-bold text-gray-500">
                <span>Items Subtotal</span>
                <span>${itemsPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-500">
                <span>Shipping</span>
                <span>{shippingPrice === 0 ? 'FREE' : `$${shippingPrice.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-500">
                <span>Gst / Tax</span>
                <span>${taxPrice.toFixed(2)}</span>
              </div>
              <div className="h-[1px] bg-gray-200 my-4"></div>
              <div className="flex justify-between items-baseline">
                <span className="text-xl font-bold text-gray-800 italic">Total</span>
                <span className="text-4xl font-black text-fuchsia-500">${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <button 
              onClick={handleCheckout}
              className="w-full py-5 rounded-[2rem] candy-gradient text-white font-black text-xl shadow-2xl hover:shadow-fuchsia-200 transform hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              Checkout Now
              <FiArrowRight size={24} />
            </button>
            <p className="text-center mt-6 text-xs font-bold text-gray-400 uppercase tracking-widest">
              Secure Sweet Payment
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
