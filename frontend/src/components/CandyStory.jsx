import { motion } from 'framer-motion';
import { RiSparklingFill } from 'react-icons/ri';
import { FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function CandyStory() {
  return (
    <section className="py-24 px-6 relative z-10 overflow-hidden">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, type: "spring" }}
            className="relative"
          >
            <div className="absolute inset-0 bg-fuchsia-300 rounded-[3rem] transform rotate-6 scale-105 opacity-50 blur-xl"></div>
            <img 
              src="/assets/images/candy4.png" 
              alt="Candy Making" 
              className="relative z-10 rounded-[3rem] shadow-2xl object-cover h-[500px] w-full border-4 border-white"
            />
            {/* Floating decoration */}
            <motion.div 
              animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-8 -right-8 w-24 h-24 bg-amber-300 rounded-[2rem] flex items-center justify-center shadow-lg z-20 border-4 border-white"
            >
              <RiSparklingFill size={40} className="text-white" />
            </motion.div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, type: "spring", delay: 0.2 }}
            className="flex flex-col gap-6"
          >
            <h2 className="text-5xl font-black text-fuchsia-900 leading-tight">
              The Magic Behind <br/> Our Sweets
            </h2>
            <p className="text-xl text-fuchsia-800 leading-relaxed">
              Chatorzzz brings magical candy experiences with vibrant flavors and fun shapes. Every piece is crafted with joy, a sprinkle of stardust, and the finest ingredients to make your taste buds dance.
            </p>
            <p className="text-lg text-fuchsia-700 leading-relaxed">
              Whether you're looking for a nostalgic treat or a new flavor adventure, our candy universe has something special waiting just for you.
            </p>
            <div className="mt-4">
              <Link to="/products" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-cyan-400 text-fuchsia-900 font-black italic text-lg shadow-xl hover:bg-cyan-300 hover:scale-105 transition-all duration-300">
                Explore The Magic
                <FiArrowRight />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
