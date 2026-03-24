import React from 'react';
import { motion } from 'framer-motion';
import { FiShield, FiFileText, FiTruck, FiRefreshCcw } from 'react-icons/fi';

const LegalPage = ({ title, icon: Icon, color, content, secondaryColor }) => {
  const colorMap = {
    fuchsia: {
      bg: 'from-fuchsia-50 to-white',
      glow: 'bg-fuchsia-400/10',
      accent: 'text-fuchsia-600',
      border: 'border-fuchsia-100',
      heading: 'text-fuchsia-900',
      bullet: 'bg-fuchsia-400'
    },
    cyan: {
      bg: 'from-cyan-50 to-white',
      glow: 'bg-cyan-400/10',
      accent: 'text-cyan-600',
      border: 'border-cyan-100',
      heading: 'text-cyan-900',
      bullet: 'bg-cyan-400'
    },
    amber: {
      bg: 'from-amber-50 to-white',
      glow: 'bg-amber-400/10',
      accent: 'text-amber-600',
      border: 'border-amber-100',
      heading: 'text-amber-900',
      bullet: 'bg-amber-400'
    },
    pink: {
      bg: 'from-pink-50 to-white',
      glow: 'bg-pink-400/10',
      accent: 'text-pink-600',
      border: 'border-pink-100',
      heading: 'text-pink-900',
      bullet: 'bg-pink-400'
    }
  };

  const theme = colorMap[color] || colorMap.fuchsia;

  return (
    <div className={`min-h-screen pt-32 pb-20 px-6 relative overflow-hidden bg-linear-to-b ${theme.bg}`}>
      {/* Dynamic Background Glows */}
      <div className={`absolute top-0 left-1/4 w-150 h-150 ${theme.glow} rounded-full blur-[120px] pointer-events-none animate-pulse`}></div>
      <div className={`absolute bottom-0 right-1/4 w-125 h-125 bg-${secondaryColor || 'cyan'}-400/5 rounded-full blur-[100px] pointer-events-none`} style={{ animationDelay: '2s' }}></div>
      
      {/* Floating Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              y: [0, -30, 0], 
              rotate: [0, 20, 0],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ 
              duration: 5 + i, 
              repeat: Infinity, 
              delay: i * 0.5 
            }}
            className="absolute"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          >
            <Icon size={40 + i * 10} className={theme.accent} />
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto max-w-4xl relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`glass-panel p-10 md:p-20 rounded-[4rem] border-white shadow-2xl relative overflow-hidden group`}
        >
          {/* Internal Glow Effect */}
          <div className={`absolute -top-24 -right-24 w-48 h-48 ${theme.glow} rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700`}></div>

          <div className="flex flex-col md:flex-row items-center gap-8 mb-16 text-center md:text-left">
            <motion.div 
              whileHover={{ rotate: 10, scale: 1.1 }}
              className={`w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center ${theme.accent} shadow-2xl border ${theme.border}`}
            >
              <Icon size={48} />
            </motion.div>
            <div>
              <h1 className={`text-6xl md:text-7xl font-black italic ${theme.heading} tracking-tighter leading-none mb-2`}>
                {title}
              </h1>
              <div className={`h-2 w-24 ${theme.bullet} rounded-full mx-auto md:mx-0`}></div>
            </div>
          </div>

          <div className="space-y-16">
            {content.map((section, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="relative pl-8 border-l border-gray-100"
              >
                <div className={`absolute -left-1.25 top-2 w-2.5 h-2.5 rounded-full ${theme.bullet} shadow-[0_0_10px_rgba(0,0,0,0.1)]`}></div>
                <h2 className={`text-3xl font-black italic ${theme.heading} mb-6 tracking-tight flex items-center gap-4`}>
                  {section.heading}
                </h2>
                <p className="text-gray-500 font-medium leading-relaxed text-lg italic bg-white/40 p-6 rounded-3xl border border-white/60">
                  {section.text}
                </p>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-20 pt-10 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
               <div className={`w-2 h-2 rounded-full ${theme.bullet}`}></div>
               <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Official Policy Vault</span>
            </div>
            <p className="text-gray-400 font-black italic uppercase text-[10px] tracking-widest">
              Last Updated: March 2026
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export const PrivacyPolicy = () => (
  <LegalPage 
    title="Privacy Policy" 
    icon={FiShield} 
    color="fuchsia"
    secondaryColor="pink"
    content={[
      { heading: "Artisanal Respect", text: "At Chatorzzz, we treat your data as delicately as our most fragile sweets. Your privacy isn't just a legal requirement for us—it's part of the artisanal respect we have for our community." },
      { heading: "What We Gather", text: "We collect only the essentials needed to get your treats home: your name, email, and shipping address. For payments, we use Stripe, so your card details never even touch our servers." },
      { heading: "Sweet Remembers (Cookies)", text: "We use cookies primarily to remember what's in your bag and whether you're logged in. We don't use them to follow you around the internet like a digital ghost." },
      { heading: "Sharing The Sugar", text: "We never sell your personal information. We only share data with trusted partners like our shipping carriers and payment processors to facilitate your orders." },
      { heading: "Your Control", text: "You have full control over your sweet secrets. If you ever want to delete your account or unsubscribe from our updates, just send us a magic message and we'll wipe the slate clean." }
    ]}
  />
);

export const TermsOfService = () => (
  <LegalPage 
    title="Terms of Service" 
    icon={FiFileText} 
    color="cyan"
    secondaryColor="fuchsia"
    content={[
      { heading: "Usage", text: "By using Chatorzzz, you agree to treat everyone with kindness and enjoy our sweets responsibly." },
      { heading: "Accounts", text: "You are responsible for keeping your magic password safe. Don't share it with ghouls or goblins." },
      { heading: "Purchases", text: "All orders are subject to availability. We reserve the right to refuse service if we suspect any non-sweet activity." }
    ]}
  />
);

export const ShippingInfo = () => (
  <LegalPage 
    title="Shipping info" 
    icon={FiTruck} 
    color="amber"
    secondaryColor="orange"
    content={[
      { heading: "Dispatch", text: "Orders are processed within 24-48 magical hours. We ship globally from our heart in Moradabad." },
      { heading: "Delivery Times", text: "Domestic shipping takes 3-5 days. International sweets may take 7-14 days depending on your local magic levels." },
      { heading: "Tracking", text: "You'll receive a magic link to track your package as soon as it leaves our candy vault." }
    ]}
  />
);

export const Returns = () => (
  <LegalPage 
    title="Returns & Refunds" 
    icon={FiRefreshCcw} 
    color="pink"
    secondaryColor="fuchsia"
    content={[
      { heading: "Our Promise", text: "If your candy isn't magical enough, we want to know. We accept returns within 14 days of delivery." },
      { heading: "Conditions", text: "Sweets must be unopened and in their original beautiful packaging to qualify for a refund." },
      { heading: "Processing", text: "Refunds are processed back to your original payment method within 5-7 business days." }
    ]}
  />
);
