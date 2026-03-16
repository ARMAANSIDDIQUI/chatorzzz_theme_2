import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiStar, FiCheckCircle, FiShield, FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: Reset
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { forgotPassword, resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await forgotPassword(email);
    setLoading(false);
    if (success) setStep(2);
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await resetPassword({ email, otp, password });
    setLoading(false);
    if (success) navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-32 pb-20 relative z-10">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel p-10 rounded-[3rem] w-full max-w-md relative overflow-hidden shadow-2xl border-white/60"
      >
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <FiShield size={120} className="text-amber-400 animate-pulse" />
        </div>

        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-black italic bg-gradient-to-r from-amber-500 to-fuchsia-500 bg-clip-text text-transparent tracking-tighter mb-2">
            {step === 1 ? 'Lost Magic?' : 'New Spell'}
          </h1>
          <p className="text-gray-500 font-medium italic">
            {step === 1 ? "Don't worry, we'll help you find your way back." : "Enter your magic code and set a new password."}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <form onSubmit={handleForgotSubmit} className="space-y-6">
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500" size={20} />
                  <input 
                    type="email" 
                    placeholder="Your Email Address"
                    className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white/50 border border-white/20 focus:outline-none focus:ring-4 focus:ring-amber-100 transition-all font-bold italic"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <button 
                  disabled={loading}
                  type="submit"
                  className="w-full py-5 rounded-[2rem] bg-gradient-to-r from-amber-400 to-amber-600 text-white font-black text-xl shadow-2xl hover:shadow-amber-200 transform hover:-translate-y-1 transition-all flex items-center justify-center gap-3 active:scale-95"
                >
                  {loading ? 'Sending Magic...' : 'Send Magic OTP'}
                </button>
              </form>

              <div className="mt-10 text-center">
                <Link to="/login" className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-gray-400 hover:text-amber-500 transition-colors">
                  <FiArrowLeft /> Back to Login
                </Link>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <form onSubmit={handleResetSubmit} className="space-y-6">
                <div className="relative">
                  <input 
                    type="text" 
                    maxLength={6}
                    placeholder="OTP CODE"
                    className="w-full text-center py-4 text-4xl tracking-widest rounded-2xl bg-white/50 border border-white/20 focus:outline-none focus:ring-4 focus:ring-fuchsia-100 transition-all font-black"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                  <p className="text-[10px] text-center mt-2 font-black uppercase tracking-widest text-gray-400">Check your email for the secret code</p>
                </div>

                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-fuchsia-400" size={20} />
                  <input 
                    type="password" 
                    placeholder="New Sweet Password"
                    className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white/50 border border-white/20 focus:outline-none focus:ring-4 focus:ring-fuchsia-100 transition-all font-bold italic"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                  />
                </div>

                <button 
                  disabled={loading}
                  type="submit"
                  className="w-full py-5 rounded-[2rem] candy-gradient text-gray-900 font-black text-xl shadow-2xl hover:shadow-fuchsia-300 transform hover:-translate-y-1 transition-all flex items-center justify-center gap-3 active:scale-95"
                >
                  {loading ? 'Casting Spell...' : 'Reset & Log In'}
                </button>
              </form>
              
              <button 
                onClick={() => setStep(1)}
                className="w-full text-center text-sm font-black uppercase tracking-widest text-gray-400 hover:text-fuchsia-500 transition-colors"
              >
                ← Wrong email? Try again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
