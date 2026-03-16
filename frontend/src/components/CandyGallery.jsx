import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiImage, FiHeart } from 'react-icons/fi';
import axios from 'axios';

export default function CandyGallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const { data } = await axios.get('/api/gallery');
        setItems(data);
      } catch (err) {
        console.error('Failed to fetch gallery', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  if (loading) return <div className="py-24 text-center text-fuchsia-500 font-bold italic">Loading Gallery...</div>;

  return (
    <section className="py-24 px-6 relative z-10">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4 text-cyan-500">
             <FiImage size={40} />
          </div>
          <h2 className="text-5xl font-black italic text-fuchsia-900 mb-4 tracking-tighter">Candy Gallery</h2>
          <p className="text-lg text-fuchsia-800 font-medium">A visual feast of our sweetest treats.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[200px]">
          {items
            .filter(item => item.image && item.image.trim() !== '')
            .map((item, index) => (
            <motion.div 
              key={item.id || item._id}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative rounded-3xl overflow-hidden group border-2 border-white/40 shadow-sm ${item.span || ''}`}
            >
              <img 
                src={item.image} 
                alt={item.title || 'Sweet Candy'} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-fuchsia-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <div className="flex items-center gap-2 text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <FiHeart className="text-fuchsia-300" />
                  <h3 className="font-black italic text-xl tracking-wide">{item.title || 'Gourmet Candy'}</h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
