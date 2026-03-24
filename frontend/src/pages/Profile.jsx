import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { 
  FiUser, FiShoppingBag, FiSettings, FiLogOut, FiPackage, 
  FiChevronRight, FiCheckCircle, FiClock, FiTruck 
} from 'react-icons/fi';
import { RiDoubleQuotesL } from 'react-icons/ri';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get('/api/orders/myorders');
        setOrders(data);
        setLoading(false);
      } catch (err) {
        toast.error('Failed to load orders');
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered': return <FiCheckCircle className="text-green-500" />;
      case 'Out for delivery': return <FiTruck className="text-cyan-500" />;
      default: return <FiClock className="text-amber-500" />;
    }
  };

  return (
    <div className="container mx-auto px-4 pt-40 pb-20 max-w-6xl relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-panel p-8 rounded-[2.5rem] text-center"
          >
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 rounded-3xl candy-gradient p-1 shadow-lg">
                <img 
                  src={user?.profileImage || '/assets/images/default-avatar.png'} 
                  alt={user?.name}
                  className="w-full h-full object-cover rounded-[1.4rem] bg-white"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 p-2 bg-white rounded-xl shadow-md text-fuchsia-500">
                <FiSettings size={16} />
              </div>
            </div>
            <h2 className="text-2xl font-black italic text-gray-800">{user?.name}</h2>
            <p className="text-gray-500 font-medium text-sm mb-6">{user?.email}</p>
            
            <button 
              onClick={logout}
              className="w-full flex items-center justify-center gap-3 py-3 rounded-2xl bg-red-50 text-red-500 font-bold hover:bg-red-100 transition-all"
            >
              <FiLogOut />
              Logout
            </button>
          </motion.div>

          <div className="glass-panel p-6 rounded-[2rem] bg-gradient-to-br from-fuchsia-100 to-cyan-100 border-none relative overflow-hidden">
             <RiDoubleQuotesL className="absolute -top-2 -left-2 text-6xl text-white/40" />
             <p className="relative z-10 text-gray-700 font-bold italic leading-relaxed pt-4">
               "Life is sweet, especially with Chatorzzz!"
             </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <h1 className="text-4xl font-black italic bg-gradient-to-r from-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
              Order History
            </h1>
            <div className="p-3 bg-white rounded-2xl shadow-sm border border-white/40">
              <FiShoppingBag className="text-fuchsia-500" size={24} />
            </div>
          </motion.div>

          {loading ? (
             <div className="text-center py-20 text-fuchsia-500 font-black animate-pulse text-2xl">
               Unwrapping Your Orders...
             </div>
          ) : orders.length === 0 ? (
            <div className="glass-panel p-16 rounded-[3rem] text-center">
              <div className="inline-block p-6 bg-gray-50 rounded-full text-gray-300 mb-6">
                <FiPackage size={48} />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">No orders yet</h3>
              <p className="text-gray-500 mb-8 max-w-xs mx-auto">Discover our sweet collection and place your first order today!</p>
              <a href="/products" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl candy-gradient text-white font-bold shadow-lg transform hover:-translate-y-1 transition-all">
                Shop Sweets
                <FiChevronRight />
              </a>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map(order => (
                <motion.div 
                  key={order._id}
                  whileHover={{ scale: 1.01 }}
                  className="glass-panel p-6 rounded-3xl flex flex-col md:flex-row items-center gap-6 border-b-4 border-fuchsia-200"
                >
                  <div className="flex -space-x-4">
                    {order.orderItems?.slice(0, 3).map((item, i) => (
                      <div key={i} className="w-16 h-16 rounded-2xl border-4 border-white shadow-sm overflow-hidden bg-gray-100">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                    ))}
                    {order.orderItems.length > 3 && (
                      <div className="w-16 h-16 rounded-2xl border-4 border-white shadow-sm bg-gray-200 flex items-center justify-center font-black text-gray-500">
                        +{order.orderItems.length - 3}
                      </div>
                    )}
                  </div>

                  <div className="flex-grow text-center md:text-left">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
                      <span className="text-sm font-black text-gray-400 uppercase tracking-widest">ID: {order._id.substring(0, 10)}</span>
                      <span className="hidden md:block text-gray-300">•</span>
                      <span className="text-sm font-bold text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-600 font-medium">
                      {order.orderItems.length} item{order.orderItems.length > 1 ? 's' : ''} • 
                      <span className="text-gray-800 font-black ml-1">Total: ₹{order.totalPrice.toFixed(2)}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 px-6 py-2 bg-white/50 rounded-full border border-white/40 shadow-sm">
                    {getStatusIcon(order.status)}
                    <span className="text-sm font-black italic uppercase tracking-wider text-gray-700">{order.status}</span>
                  </div>

                  <button className="p-4 rounded-2xl bg-white hover:bg-fuchsia-50 text-fuchsia-500 transition-all border border-white/60">
                    <FiChevronRight size={20} />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
