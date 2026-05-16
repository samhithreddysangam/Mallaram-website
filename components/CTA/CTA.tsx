'use client';

import { motion } from 'framer-motion';
import { Locale, getDictionary } from '@/lib/i18n';
import { Shield, Zap, Fingerprint } from 'lucide-react';

interface CTAProps {
  locale: Locale;
}

const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSe105PrT3jPSh76kQmuyjyHPcmXqzVo4zkHNRq0qJO4FjEcnA/viewform?usp=publish-editor';

export default function CTA({ locale }: CTAProps) {
  const dictionary = getDictionary(locale);

  return (
    <section id="complaint" className="py-24 md:py-32 bg-[#15803d] relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 border-[40px] border-white rounded-full" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 border-[40px] border-white rounded-full" />
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-10"
        >
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-[2.5rem] bg-white/10 backdrop-blur-md mb-4 border border-white/20">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>

          <h2 className="text-4xl md:text-6xl font-black text-white leading-[0.9] tracking-tighter uppercase">
            {dictionary.complaint.title}
          </h2>
          
          <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto font-medium leading-relaxed">
            {dictionary.complaint.description}
          </p>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="pt-6"
          >
            <a
              href={GOOGLE_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-4 px-12 py-6 bg-white text-[#15803d] text-[12px] font-black uppercase tracking-[0.2em] rounded-3xl shadow-2xl hover:bg-gray-50 transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {dictionary.complaint.cta}
            </a>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4 md:gap-8 pt-12">
            {[
              { label: 'Secure & Private', icon: <Shield className="w-4 h-4" /> },
              { label: 'Quick Response', icon: <Zap className="w-4 h-4" /> },
              { label: 'Complaint Number', icon: <Fingerprint className="w-4 h-4" /> }
            ].map((item, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-white/70 hover:bg-white/10 hover:text-white hover:border-white/20 transition-all duration-300 group"
              >
                <div className="text-[#22FF88] group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">{item.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}