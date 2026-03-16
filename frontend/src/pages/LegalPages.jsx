import React from 'react';
import { motion } from 'framer-motion';
import { FiShield, FiFileText, FiTruck, FiRefreshCcw } from 'react-icons/fi';

const LegalPage = ({ title, icon: Icon, color, content }) => {
  return (
    <div className="min-h-screen pt-32 pb-20 px-6 relative overflow-hidden">
      <div className={`absolute top-32 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-${color}-400/5 rounded-full blur-[120px] pointer-events-none`}></div>
      
      <div className="container mx-auto max-w-4xl relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-12 md:p-16 rounded-[4rem] border-white/60 shadow-2xl"
        >
          <div className="flex items-center gap-6 mb-12">
            <div className={`w-20 h-20 bg-${color}-100 rounded-3xl flex items-center justify-center text-${color}-500 shadow-inner`}>
              <Icon size={40} />
            </div>
            <h1 className={`text-5xl md:text-6xl font-black italic text-${color}-900 tracking-tighter`}>
              {title}
            </h1>
          </div>

          <div className="prose prose-lg max-w-none prose-fuchsia">
            {content.map((section, idx) => (
              <div key={idx} className="mb-10">
                <h2 className={`text-2xl font-black italic text-${color}-800 mb-4 flex items-center gap-3`}>
                  <span className={`w-8 h-1 bg-${color}-400 rounded-full`}></span>
                  {section.heading}
                </h2>
                <p className="text-gray-600 font-medium leading-relaxed">
                  {section.text}
                </p>
              </div>
            ))}
          </div>
          
          <div className="mt-16 pt-8 border-t border-gray-100 text-center">
            <p className="text-gray-400 font-bold italic">Last Updated: March 2026</p>
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
    content={[
      { heading: "Data Collection", text: "We collect only the essentials: your name, email, and shipping address to ensure your candy arrives safely. We don't sell your data—your sweet secrets are safe with us." },
      { heading: "How We Use Data", text: "Your information is used to process orders, improve our service, and occasionally send you sweet updates (only if you want them)." },
      { heading: "Security", text: "We use high-end encryption to protect your personal information. Our magical safeguards are active 24/7." }
    ]}
  />
);

export const TermsOfService = () => (
  <LegalPage 
    title="Terms of Service" 
    icon={FiFileText} 
    color="cyan"
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
    content={[
      { heading: "Our Promise", text: "If your candy isn't magical enough, we want to know. We accept returns within 14 days of delivery." },
      { heading: "Conditions", text: "Sweets must be unopened and in their original beautiful packaging to qualify for a refund." },
      { heading: "Processing", text: "Refunds are processed back to your original payment method within 5-7 business days." }
    ]}
  />
);
