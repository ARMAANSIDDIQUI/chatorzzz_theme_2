import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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

  if (loading) {
    return (
      <div className="py-16 text-center text-fuchsia-500 font-extrabold italic animate-pulse tracking-widest text-sm">
        Loading Gallery...
      </div>
    );
  }

  const videos = items.filter(i => i.type === 'video');
  const images = items.filter(i => i.type === 'image' || !i.type);

  // Nothing to show
  if (videos.length === 0 && images.length === 0) return null;

  return (
    <div className="space-y-0">

      {/* Video Showcase */}
      {videos.length > 0 && (
        <section className="py-12 sm:py-16 md:py-24 bg-transparent relative overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="mb-8 sm:mb-12 md:mb-16 text-center">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black italic text-fuchsia-900 mb-2 sm:mb-4 tracking-tighter drop-shadow-sm">
                Video Showcase
              </h2>
              <p className="text-fuchsia-600 font-bold tracking-[0.25em] sm:tracking-[0.3em] uppercase text-xs italic">
                Artisanal craft in motion
              </p>
            </div>

            <div className={`grid grid-cols-1 ${videos.length > 1 ? 'lg:grid-cols-2' : 'max-w-3xl mx-auto'} gap-6 sm:gap-8 lg:gap-12`}>
              {videos.map(vid => (
                <motion.div
                  key={vid._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="relative aspect-video rounded-[1.5rem] sm:rounded-[2rem] lg:rounded-[3rem] overflow-hidden border-4 sm:border-8 border-white shadow-2xl group"
                >
                  <video autoPlay muted loop playsInline className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">
                    <source src={vid.video} type="video/mp4" />
                  </video>
                  <div className="absolute inset-0 bg-gradient-to-t from-fuchsia-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-5 sm:p-8 lg:p-10">
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-black italic text-white tracking-tight">{vid.title}</h3>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="absolute top-0 right-0 w-[20rem] sm:w-[40rem] h-[20rem] sm:h-[40rem] bg-white/40 blur-[100px] rounded-full -z-10" />
          <div className="absolute bottom-0 left-0 w-[20rem] sm:w-[40rem] h-[20rem] sm:h-[40rem] bg-fuchsia-100/40 blur-[100px] rounded-full -z-10" />
        </section>
      )}

      {/* Image Snapshots */}
      {images.length > 0 && (
        <section className="py-12 sm:py-16 md:py-24 bg-transparent relative overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="mb-8 sm:mb-12 md:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black italic text-fuchsia-950 mb-3 sm:mb-4 tracking-tighter text-center md:text-left">
                Snapshots
              </h2>
              <div className="w-16 sm:w-24 h-1.5 sm:h-2 bg-fuchsia-500 mb-3 sm:mb-4 mx-auto md:mx-0" />
              <p className="text-fuchsia-800 font-bold text-center md:text-left uppercase tracking-widest text-xs italic">
                Frozen moments of pure joy
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
              {images.map((img, idx) => (
                <motion.div
                  key={img._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ y: -8, scale: 1.04 }}
                  className="glass-panel relative aspect-square rounded-2xl sm:rounded-[2rem] lg:rounded-[3rem] overflow-hidden shadow-xl border-2 sm:border-4 border-white/60 group"
                >
                  {img.image ? (
                    <img src={img.image} className="w-full h-full object-cover transition-all duration-700" alt={img.title} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-white/10 italic text-fuchsia-300 font-black text-[10px] sm:text-xs uppercase tracking-widest text-center px-2">
                      Unavailable
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-fuchsia-950/20 backdrop-blur-[3px]">
                    <span className="px-4 sm:px-6 py-2 sm:py-3 bg-white/95 text-fuchsia-900 font-black italic text-xs sm:text-sm rounded-xl sm:rounded-2xl shadow-xl -rotate-2 border border-white text-center max-w-[80%]">
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
