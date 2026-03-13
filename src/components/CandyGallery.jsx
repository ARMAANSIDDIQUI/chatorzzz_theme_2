import React from 'react';
import { motion } from 'framer-motion';

export default function CandyGallery() {
  const items = [
    { id: 1, src: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?auto=format&fit=crop&q=80&w=800', alt: 'Candy Pops', span: 'col-span-2 row-span-2' },
    { id: 2, src: 'https://images.unsplash.com/photo-1575224300306-1b8da36134ec?auto=format&fit=crop&q=80&w=800', alt: 'Candy Flowers', span: 'col-span-1 row-span-1' },
    { id: 3, src: 'https://images.unsplash.com/photo-1532117182044-870ce0a6f541?auto=format&fit=crop&q=80&w=800', alt: 'Watermelon Candies', span: 'col-span-1 row-span-2' },
    { id: 4, src: 'https://images.unsplash.com/photo-1550867428-138aec9fce23?auto=format&fit=crop&q=80&w=800', alt: 'Fruit Sweets', span: 'col-span-1 row-span-1' },
    { id: 5, src: 'https://images.unsplash.com/photo-1499195333224-3ce974eecb47?auto=format&fit=crop&q=80&w=800', alt: 'Gummy Bears', span: 'col-span-2 row-span-1' },
  ];

  return (
    <section className="py-24 px-6 relative z-10">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-black text-fuchsia-900 mb-4">Candy Gallery</h2>
          <p className="text-lg text-fuchsia-800">A visual feast of our sweetest treats.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[200px]">
          {items.map((item, index) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative rounded-3xl overflow-hidden group ${item.span}`}
            >
              <img 
                src={item.src} 
                alt={item.alt} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-2"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-fuchsia-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <h3 className="text-white font-bold text-xl translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{item.alt}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
