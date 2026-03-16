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
  const [ticket, setTicket] = useState({ messages: [] });
  const [chatMessage, setChatMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sendingChat, setSendingChat] = useState(false);

  useEffect(() => {
    if (user) {
      const fetchTicket = async () => {
        try {
          const { data } = await axios.get('/api/support/my');
          setTicket(data);
        } catch (err) {
          console.error('Failed to fetch support chat', err);
        }
      };
      fetchTicket();
      const interval = setInterval(fetchTicket, 10000); // Poll every 10s
      return () => clearInterval(interval);
    }
  }, [user]);

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

  const handleSendChat = async (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    setSendingChat(true);
    try {
      const { data } = await axios.post('/api/support/message', { content: chatMessage });
      setTicket(data);
      setChatMessage('');
    } catch (err) {
      toast.error('Message missed the target.');
    } finally {
      setSendingChat(false);
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
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

        {/* Support Chat Section */}
        <div className="lg:col-span-12 mt-20">
          <div className="text-center mb-12">
             <h2 className="text-4xl font-black italic text-gray-900 tracking-tighter">Support Vault Chat</h2>
             <p className="text-gray-400 font-medium mt-2">Private connection with our support team.</p>
          </div>

          <div className="max-w-4xl mx-auto glass-panel rounded-[3rem] overflow-hidden flex flex-col min-h-[500px] border-white/60 shadow-2xl">
            {user ? (
              <>
                <div className="flex-grow p-8 space-y-4 overflow-y-auto max-h-[500px] no-scrollbar bg-white/30 italic font-medium">
                  {ticket.messages.length === 0 ? (
                    <div className="text-center py-20 text-gray-300 font-black uppercase text-xl tracking-widest">
                      Start a magical conversation...
                    </div>
                  ) : (
                    ticket.messages.map((msg, i) => (
                      <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] p-5 rounded-[2rem] ${
                          msg.sender === 'user' 
                          ? 'bg-gray-900 text-white rounded-tr-none' 
                          : 'bg-white text-gray-800 rounded-tl-none border border-gray-100 shadow-sm'
                        }`}>
                          <p>{msg.content}</p>
                          <div className={`text-[9px] mt-2 font-black uppercase tracking-widest flex items-center gap-2 ${msg.sender === 'user' ? 'text-gray-400' : 'text-fuchsia-400'}`}>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            {msg.sender === 'user' && (
                              <span className="flex items-center gap-1">
                                • {msg.status === 'read' ? 'Seen by Support' : 'Sent'}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <form onSubmit={handleSendChat} className="p-6 bg-white border-t border-gray-100 flex gap-4">
                  <input 
                    type="text" placeholder="Type your spell..."
                    className="flex-grow px-8 py-4 bg-gray-50 rounded-full border-none focus:ring-2 focus:ring-fuchsia-200 font-bold italic"
                    value={chatMessage} onChange={(e) => setChatMessage(e.target.value)}
                  />
                  <button disabled={sendingChat} type="submit" className="px-10 py-4 candy-gradient text-white rounded-full font-black italic shadow-lg active:scale-95">
                    {sendingChat ? '...' : 'Send'}
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-grow flex flex-col items-center justify-center p-20 text-center">
                 <div className="w-20 h-20 bg-fuchsia-50 rounded-full flex items-center justify-center text-fuchsia-300 mb-8">
                    <FiShield size={40} />
                 </div>
                 <h3 className="text-2xl font-black italic text-gray-800 mb-4">Support Vault Locked</h3>
                 <p className="text-gray-400 font-medium mb-10 max-w-sm">Please login to start a private conversation with our magic support team.</p>
                 <Link to="/login" className="px-10 py-5 rounded-3xl candy-gradient text-white font-black italic shadow-2xl">Enter Vault Now</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
