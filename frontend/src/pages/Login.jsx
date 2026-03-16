import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { FiLogIn, FiMail, FiLock, FiStar } from 'react-icons/fi';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) navigate('/');
  };

  const onGoogleSuccess = async (credentialResponse) => {
    const success = await googleLogin(credentialResponse.credential);
    if (success) navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-40 pb-20 relative z-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-10 rounded-[3rem] w-full max-w-md relative overflow-hidden shadow-2xl border-white/60"
      >
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <FiStar size={120} className="text-fuchsia-400 animate-pulse" />
        </div>

        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-black italic bg-gradient-to-r from-fuchsia-600 to-cyan-600 bg-clip-text text-transparent tracking-tighter mb-2">
            Welcome Back!
          </h1>
          <p className="text-gray-500 font-medium italic">Log in to continue your sweet journey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-fuchsia-400" size={20} />
            <input 
              type="email" 
              placeholder="Email Address"
              className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white/50 border border-white/20 focus:outline-none focus:ring-4 focus:ring-fuchsia-100 transition-all font-bold italic"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-fuchsia-400" size={20} />
            <input 
              type="password" 
              placeholder="Password"
              className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white/50 border border-white/20 focus:outline-none focus:ring-4 focus:ring-fuchsia-100 transition-all font-bold italic"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="text-right px-2">
            <Link to="/forgot-password" size="sm" className="text-xs font-black uppercase tracking-widest text-fuchsia-500 hover:text-fuchsia-600 transition-colors">
              Forgot Sweet Password?
            </Link>
          </div>

          <button 
            type="submit"
            className="w-full py-5 rounded-[2rem] candy-gradient text-gray-900 font-black text-xl shadow-2xl hover:shadow-fuchsia-300 transform hover:-translate-y-1 transition-all flex items-center justify-center gap-3 active:scale-95"
          >
            <FiLogIn size={24} />
            Let's Go!
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
            onError={() => toast.error('Google Login Failed')}
            useOneTap
            shape="pill"
            theme="filled_blue"
          />
        </div>

        <p className="text-center mt-8 text-sm font-medium text-gray-600">
          New here? <Link to="/register" className="text-fuchsia-500 hover:underline">Create a sweet account</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
