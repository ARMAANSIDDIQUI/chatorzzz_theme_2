import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { FiUserPlus, FiMail, FiLock, FiUser, FiStar, FiCheckCircle } from 'react-icons/fi';

const Register = () => {
  const [step, setStep] = useState(1); // 1: Info, 2: OTP
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [otp, setOtp] = useState('');
  const { signup, verifyOTP, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    const success = await signup(formData);
    if (success) setStep(2);
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const success = await verifyOTP(formData.email, otp);
    if (success) navigate('/');
  };

  const onGoogleSuccess = async (credentialResponse) => {
    const success = await googleLogin(credentialResponse.credential);
    if (success) navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-40 pb-20 relative z-10">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel p-10 rounded-[3rem] w-full max-w-md relative overflow-hidden shadow-2xl border-white/60"
      >
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <FiStar size={120} className="text-cyan-400 animate-pulse" />
        </div>

        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-black italic bg-gradient-to-r from-fuchsia-600 to-cyan-600 bg-clip-text text-transparent tracking-tighter mb-2">
            Join the Fun!
          </h1>
          <p className="text-gray-500 font-medium italic">Create your candy account today</p>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <form onSubmit={handleSignupSubmit} className="space-y-5">
                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400" size={20} />
                  <input 
                    type="text" 
                    placeholder="Full Name"
                    className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white/50 border border-white/20 focus:outline-none focus:ring-4 focus:ring-cyan-100 transition-all font-bold italic"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>

                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400" size={20} />
                  <input 
                    type="email" 
                    placeholder="Email Address"
                    className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white/50 border border-white/20 focus:outline-none focus:ring-4 focus:ring-cyan-100 transition-all font-bold italic"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>

                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400" size={20} />
                  <input 
                    type="password" 
                    placeholder="Sweet Password (min 8 chars)"
                    className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white/50 border border-white/20 focus:outline-none focus:ring-4 focus:ring-cyan-100 transition-all font-bold italic"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                    minLength={8}
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-5 rounded-[2rem] candy-gradient text-gray-900 font-black text-xl shadow-2xl hover:shadow-cyan-300 transform hover:-translate-y-1 transition-all flex items-center justify-center gap-3 active:scale-95"
                >
                  <FiUserPlus size={24} />
                  Sign Me Up!
                </button>
              </form>

              <div className="my-8 flex items-center gap-4">
                <div className="flex-grow h-[1px] bg-gray-200"></div>
                <span className="text-sm font-medium text-gray-400">OR</span>
                <div className="flex-grow h-[1px] bg-gray-200"></div>
              </div>

              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={onGoogleSuccess}
                  onError={() => toast.error('Google Signup Failed')}
                  useOneTap
                  shape="pill"
                  theme="filled_blue"
                />
              </div>

              <p className="text-center mt-8 text-sm font-medium text-gray-600">
                Already have an account? <Link to="/login" className="text-cyan-500 hover:underline transition-colors">Log In</Link>
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-center"
            >
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-cyan-100 rounded-full text-cyan-500">
                  <FiCheckCircle size={40} />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Verify Email</h2>
              <p className="text-gray-500 mb-8 px-4">We've sent a magic code to {formData.email}. Enter it below to start your journey!</p>
              
              <form onSubmit={handleOtpSubmit} className="space-y-6">
                <input 
                  type="text" 
                  maxLength={6}
                  placeholder="******"
                  className="w-full text-center py-4 text-4xl tracking-widest rounded-2xl bg-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-300 transition-all font-bold"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
                
                <button 
                  type="submit"
                  className="w-full py-4 rounded-2xl candy-gradient text-white font-bold text-lg shadow-lg hover:shadow-cyan-200/50 transform hover:-translate-y-1 transition-all"
                >
                  Verify & Explore
                </button>
              </form>
              
              <button 
                onClick={() => setStep(1)}
                className="mt-6 text-sm font-semibold text-gray-400 hover:text-cyan-500 transition-colors"
              >
                ← Back to registration
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Register;
