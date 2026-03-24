import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
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

  if (loading) return <div className="py-24 text-center text-fuchsia-500 font-extrabold italic animate-pulse tracking-widest">LOADING GALLERY...</div>;

  const videos = items.filter(i => i.type === 'video');
  const images = items.filter(i => i.type === 'image' || !i.type); // Fallback for old items

  return (
    <div className="space-y-0">
      {/* Video Showcase Section */}
      {videos.length > 0 && (
        <section className="py-24 bg-transparent relative overflow-hidden">
           <div className="container mx-auto px-6 relative z-10">
              <div className="mb-16 text-center">
                 <h2 className="text-5xl md:text-7xl font-black italic text-fuchsia-900 mb-4 tracking-tighter drop-shadow-sm">Video Showcase</h2>
                 <p className="text-fuchsia-600 font-bold tracking-[0.3em] uppercase text-xs italic">Artisanal craft in motion</p>
              </div>
              
              <div className={`grid grid-cols-1 ${videos.length > 1 ? 'lg:grid-cols-2' : 'max-w-4xl mx-auto'} gap-12`}>
                 {videos.map((vid, idx) => (
                   <motion.div 
                     key={vid._id}
                     initial={{ opacity: 0, scale: 0.95 }}
                     whileInView={{ opacity: 1, scale: 1 }}
                     className="relative aspect-video rounded-[3rem] overflow-hidden border-8 border-white shadow-2xl group"
                   >
                      <video 
                        autoPlay muted loop playsInline 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      >
                         <source src={vid.video} type="video/mp4" />
                      </video>
                      <div className="absolute inset-0 bg-gradient-to-t from-fuchsia-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-10">
                         <h3 className="text-3xl font-black italic text-white tracking-tight">{vid.title}</h3>
                      </div>
                   </motion.div>
                 ))}
              </div>
           </div>
           {/* Subtle Light Decor */}
           <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-white/40 blur-[150px] rounded-full -z-10"></div>
           <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-fuchsia-100/40 blur-[150px] rounded-full -z-10"></div>
        </section>
      )}

      {/* Image Snapshots Section */}
      {images.length > 0 && (
        <section className="py-32 bg-transparent relative overflow-hidden">
           <div className="container mx-auto px-6 relative z-10">
              <div className="mb-16">
                 <h2 className="text-5xl md:text-7xl font-black italic text-fuchsia-950 mb-4 tracking-tighter text-center md:text-left">Artisan Snapshots</h2>
                 <div className="w-24 h-2 bg-fuchsia-500 mb-4 mx-auto md:mx-0"></div>
                 <p className="text-fuchsia-800 font-bold text-center md:text-left uppercase tracking-widest text-xs italic">Frozen moments of pure joy</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
                 {images.map((img, idx) => (
                   <motion.div
                     key={img._id}
                     whileHover={{ y: -10, scale: 1.05 }}
                     className="glass-panel relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white/60 group"
                   >
                      {img.image ? (
                        <img src={img.image} className="w-full h-full object-cover transition-all duration-700" alt={img.title} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-white/10 italic text-fuchsia-300 font-black text-xs uppercase tracking-widest">Image Unavailable</div>
                      )}
                      
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-fuchsia-950/20 backdrop-blur-[4px]">
                         <span className="px-8 py-3 bg-white/95 text-fuchsia-900 font-black italic text-sm rounded-2xl shadow-2xl transform -rotate-2 border-2 border-white">
                            {img.title}
                         </span>
                      </div>
                   </motion.div>
                 ))}
              </div>
           </div>
        </section>
      )}
    </div>
  );
}
