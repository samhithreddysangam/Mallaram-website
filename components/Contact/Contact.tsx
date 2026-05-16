'use client';

import { motion } from 'framer-motion';
import { Locale, getDictionary } from '@/lib/i18n';

interface ContactProps {
  locale: Locale;
}



export default function Contact({ locale }: ContactProps) {
  const dictionary = getDictionary(locale);

  return (
    <section id="contact" className="py-32 relative bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#15803d]/10 text-[#15803d] text-[10px] font-black uppercase tracking-[0.3em] mb-6 border border-[#15803d]/20">
            Connect
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-[#0A0A0A] mb-6 uppercase tracking-tighter">
            Get In <span className="text-[#15803d]">Touch</span>
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto font-medium">
            Contact the village administration for any assistance, queries, or development suggestions.
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-10 bg-[#FAF9F6] rounded-[3rem] border border-gray-100 flex flex-col justify-between group hover:border-[#15803d]/30 transition-all duration-500"
            >
              <div className="text-[10px] font-black text-[#15803d] uppercase tracking-widest mb-8">Panchayat Office</div>
              <div>
                <h3 className="text-2xl font-black text-[#0A0A0A] mb-4 uppercase tracking-tighter">{dictionary.contact.panchayat}</h3>
                <p className="text-gray-600 font-medium leading-relaxed">Mallaram Village,<br />Telangana, India</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-10 bg-[#FAF9F6] rounded-[3rem] border border-gray-100 flex flex-col justify-between group hover:border-[#15803d]/30 transition-all duration-500"
            >
              <div className="text-[10px] font-black text-[#15803d] uppercase tracking-widest mb-8">Contact Info</div>
              <div>
                <h3 className="text-2xl font-black text-[#0A0A0A] mb-4 uppercase tracking-tighter">Phone Numbers</h3>
                <p className="text-gray-600 font-medium leading-relaxed">+91 9989120933<br />+91 8008253003</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-10 bg-[#FAF9F6] rounded-[3rem] border border-gray-100 flex flex-col justify-between group hover:border-[#15803d]/30 transition-all duration-500 sm:col-span-2 lg:col-span-1"
            >
              <div className="text-[10px] font-black text-[#15803d] uppercase tracking-widest mb-8">Email</div>
              <div>
                <h3 className="text-2xl font-black text-[#0A0A0A] mb-4 uppercase tracking-tighter">Email Address</h3>
                <p className="text-gray-600 font-medium leading-relaxed mb-6">admin@mallaram.in</p>
                <a href="mailto:admin@mallaram.in" className="inline-block px-8 py-4 bg-[#15803d] text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-all">
                  Message Us
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}