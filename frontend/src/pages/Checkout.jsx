import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { FiMapPin, FiTruck, FiCreditCard, FiZap, FiCheckCircle } from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';

// Dynamically load Razorpay checkout script
const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (document.getElementById('razorpay-script')) return resolve(true);
    const script = document.createElement('script');
    script.id = 'razorpay-script';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const Checkout = () => {
  const { cartItems, totalPrice, itemsPrice, shippingPrice, taxPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: ''
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Step 1 — Create order in our DB
      const { data: orderData } = await axios.post('/api/orders', {
        orderItems: cartItems,
        shippingAddress,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        paymentMethod: 'Razorpay'
      });

      // Step 2 — Create Razorpay order on backend
      const { data: rzpData } = await axios.post('/api/orders/create-razorpay-order', {
        totalPrice,
        orderId: orderData._id
      });

      // Step 3 — Load Razorpay SDK and open checkout popup
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error('Failed to load Razorpay. Check your internet connection.');
        setIsProcessing(false);
        return;
      }

      const options = {
        key: rzpData.keyId,
        amount: rzpData.amount,
        currency: rzpData.currency,
        name: 'Chatorzzz',
        description: 'Delicious Sweet Order',
        order_id: rzpData.razorpayOrderId,
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
        },
        theme: {
          color: '#d946ef', // fuchsia-500
        },
        handler: async (response) => {
          try {
            // Step 4 — Verify payment on backend
            await axios.post('/api/orders/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: orderData._id
            });

            toast.success('Payment successful! 🎉');
            clearCart();
            navigate(`/order-success/${orderData._id}`);
          } catch (err) {
            toast.error(err.response?.data?.message || 'Payment verification failed');
          }
        },
        modal: {
          ondismiss: () => {
            toast('Payment cancelled. Your cart is still saved.', { icon: 'ℹ️' });
            setIsProcessing(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

      // Keep button disabled until modal closes naturally
      rzp.on('payment.failed', (response) => {
        toast.error(`Payment failed: ${response.error.description}`);
        setIsProcessing(false);
      });

    } catch (err) {
      toast.error(err.response?.data?.message || 'Order failed');
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="mb-12">
        <h1 className="text-4xl font-black italic bg-gradient-to-r from-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
          Complete Your Sweet Order
        </h1>
        <p className="text-gray-500 font-medium">Almost there! Just a few more details</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Shipping Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-panel p-8 rounded-[2.5rem]"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-fuchsia-100 rounded-2xl text-fuchsia-500">
              <FiTruck size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Shipping Details</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <FiMapPin className="absolute left-4 top-4 text-fuchsia-400" size={20} />
              <textarea
                placeholder="Full Shipping Address"
                className="w-full pl-12 pr-4 py-4 rounded-3xl bg-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-fuchsia-300 font-medium min-h-[120px]"
                value={shippingAddress.address}
                onChange={(e) => setShippingAddress({...shippingAddress, address: e.target.value})}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <input
                type="text"
                placeholder="City"
                className="w-full px-6 py-4 rounded-3xl bg-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-fuchsia-300 font-medium"
                value={shippingAddress.city}
                onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Postal Code"
                className="w-full px-6 py-4 rounded-3xl bg-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-fuchsia-300 font-medium"
                value={shippingAddress.postalCode}
                onChange={(e) => setShippingAddress({...shippingAddress, postalCode: e.target.value})}
                required
              />
            </div>

            <input
              type="text"
              placeholder="Country"
              className="w-full px-6 py-4 rounded-3xl bg-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-fuchsia-300 font-medium"
              value={shippingAddress.country}
              onChange={(e) => setShippingAddress({...shippingAddress, country: e.target.value})}
              required
            />

            <div className="flex items-center gap-3 p-6 bg-cyan-50 rounded-3xl text-cyan-700 border border-cyan-100">
              <FiCreditCard size={24} />
              <span className="font-bold">Payment via Razorpay (UPI, Cards, Netbanking & more)</span>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className={`w-full py-5 rounded-[2rem] candy-gradient text-white font-black text-xl shadow-2xl hover:shadow-fuchsia-200 transform hover:-translate-y-1 transition-all flex items-center justify-center gap-3 ${isProcessing ? 'opacity-70' : ''}`}
            >
              {isProcessing ? 'Opening Payment...' : `Pay ₹${totalPrice.toFixed(2)}`}
              <FiZap size={24} />
            </button>
          </form>
        </motion.div>

        {/* Order Summary Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <div className="glass-panel p-8 rounded-[2.5rem]">
            <h2 className="text-2xl font-black italic text-gray-800 mb-6">Order Items</h2>
            <div className="max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
              {cartItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100 last:border-0 last:mb-0 last:pb-0">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-xl" />
                  <div className="flex-grow">
                    <h4 className="font-bold text-gray-800">{item.name}</h4>
                    <span className="text-gray-500 font-bold">{item.qty} x ₹{item.price}</span>
                  </div>
                  <span className="font-black text-gray-800">₹{(item.qty * item.price).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 space-y-3 pt-6 border-t-2 border-dashed border-gray-200">
              <div className="flex justify-between font-bold text-gray-500">
                <span>Subtotal</span>
                <span>₹{itemsPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-800 text-xl italic">
                <span>Total Amount</span>
                <span className="text-fuchsia-500 font-black text-2xl">₹{totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="glass-panel p-8 rounded-[2.5rem] bg-gradient-to-br from-fuchsia-50/50 to-cyan-50/50 border-none">
            <div className="flex items-center gap-3 mb-4">
              <FiCheckCircle size={24} className="text-green-500" />
              <h3 className="font-black text-gray-800 uppercase tracking-widest text-sm">Security Assured</h3>
            </div>
            <p className="text-gray-500 text-sm font-medium">
              Every sweet order is encrypted and protected via Razorpay's secure payment gateway.
              Supports UPI, Cards, Netbanking, and Wallets.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Checkout;
