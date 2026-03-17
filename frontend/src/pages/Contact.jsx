import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiMessageSquare, FiSend, FiShield } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Contact = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post('/api/contact', formData);
      toast.success('Message sent! Our wizards are on it.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      toast.error('Magic failed. Try again soon.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-32 max-w-7xl">
      <div className="text-center mb-16">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl md:text-8xl font-black italic bg-gradient-to-r from-fuchsia-500 to-cyan-500 bg-clip-text text-transparent tracking-tighter"
        >
          Sweet Connections
        </motion.h1>
        <p className="text-gray-500 mt-6 text-xl font-medium max-w-2xl mx-auto italic">
          Need a hand with your candy adventure? We're here to help!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start justify-center">
        {/* Contact Info & Forms */}
        <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1 space-y-6">
            {[
              { icon: FiMail, title: 'Email Us', detail: 'hello@chatorzzz.com', color: 'bg-fuchsia-100 text-fuchsia-500' },
              { icon: FiPhone, title: 'Call Us', detail: 'Moradabad, India', color: 'bg-cyan-100 text-cyan-500' },
              { icon: FiMapPin, title: 'Visit Us', detail: 'Chatorzzz HQ, Moradabad', color: 'bg-amber-100 text-amber-500' }
            ].map((item, i) => (
              <motion.div key={i} className="glass-panel p-8 rounded-[2rem] flex items-center gap-6">
                <div className={`p-4 ${item.color} rounded-2xl`}><item.icon size={24} /></div>
                <div>
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{item.title}</h3>
                  <p className="text-lg font-bold text-gray-800">{item.detail}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div className="lg:col-span-2 glass-panel p-10 rounded-[3rem]">
            <div className="flex items-center gap-4 mb-10">
              <FiMessageSquare size={32} className="text-fuchsia-500" />
              <h2 className="text-3xl font-black italic text-gray-800 tracking-tighter">Direct Inquiry</h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input 
                  type="text" required placeholder="Full Name"
                  className="w-full px-6 py-4 rounded-3xl bg-white/50 border border-white/20 focus:ring-4 focus:ring-fuchsia-100 font-medium"
                  value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
                <input 
                  type="email" required placeholder="Email Address"
                  className="w-full px-6 py-4 rounded-3xl bg-white/50 border border-white/20 focus:ring-4 focus:ring-fuchsia-100 font-medium"
                  value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <input 
                type="text" required placeholder="Subject"
                className="w-full px-6 py-4 rounded-3xl bg-white/50 border border-white/20 focus:ring-4 focus:ring-fuchsia-100 font-medium"
                value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})}
              />
              <textarea 
                required placeholder="Your message..."
                className="w-full px-6 py-4 rounded-3xl bg-white/50 border border-white/20 focus:ring-4 focus:ring-fuchsia-100 font-medium min-h-[150px]"
                value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})}
              />
              <button disabled={submitting} type="submit" className="w-full py-5 rounded-[2rem] candy-gradient text-white font-black text-xl shadow-2xl hover:shadow-fuchsia-300 transform hover:-translate-y-1 transition-all flex items-center justify-center gap-3 active:scale-95">
                {submitting ? 'Sending...' : 'Send Inquiry'} <FiSend size={24} />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
