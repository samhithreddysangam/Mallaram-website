'use client';

import { motion } from 'framer-motion';
import { Locale, getDictionary } from '@/lib/i18n';
import { ShieldCheck, Users, Layers, BarChart } from 'lucide-react';

interface AboutProps {
  locale: Locale;
}

export default function About({ locale }: AboutProps) {
  const dictionary = getDictionary(locale);
  const { about } = dictionary;

  const featureIcons = [
    <ShieldCheck className="w-6 h-6" />,
    <Users className="w-6 h-6" />,
    <Layers className="w-6 h-6" />,
    <BarChart className="w-6 h-6" />
  ];

  const features = [
    { ...about.features.funds, icon: featureIcons[0] },
    { ...about.features.schemes, icon: featureIcons[1] },
    { ...about.features.ikb, icon: featureIcons[2] },
    { ...about.features.updates, icon: featureIcons[3] }
  ];

  return (
    <section id="about" className="py-32 relative bg-[#FAF9F6] overflow-hidden">
      {/* Ambient background */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40">
        <div className="absolute top-[10%] right-[5%] w-[400px] h-[400px] bg-[#15803d]/5 blur-[100px] rounded-full" />
        <div className="absolute bottom-[20%] left-[5%] w-[300px] h-[300px] bg-[#15803d]/5 blur-[80px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#15803d]/10 text-[#15803d] text-[10px] font-black uppercase tracking-[0.3em] mb-8 border border-[#15803d]/20">
              Legacy & Vision
            </span>
            <h2 className="text-5xl md:text-7xl font-black text-[#0A0A0A] mb-10 tracking-tighter uppercase leading-[0.9]">
              {about.title}
            </h2>
            <p className="text-xl text-gray-600 mb-12 leading-relaxed font-medium">
              {about.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
              <div className="p-8 rounded-[2.5rem] bg-white border border-gray-100 shadow-sm group hover:border-[#15803d]/30 transition-all duration-500">
                <div className="text-[10px] font-black text-[#15803d] uppercase tracking-widest mb-4">Our Leader</div>
                <h4 className="text-xl font-bold text-[#0A0A0A] mb-2">{about.leadership}</h4>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Hon'ble Chief Minister</p>
              </div>
              <div className="p-8 rounded-[2.5rem] bg-white border border-gray-100 shadow-sm group hover:border-[#15803d]/30 transition-all duration-500">
                <div className="text-[10px] font-black text-[#15803d] uppercase tracking-widest mb-4">Village Head</div>
                <h4 className="text-xl font-bold text-[#0A0A0A] mb-2">{about.sarpanch}</h4>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Village President</p>
              </div>
            </div>
          </motion.div>

          {/* Features Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
                className="group p-10 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] rounded-[3rem] border border-gray-100 hover:bg-[#15803d] transition-all duration-500 cursor-default"
              >
                <div className="w-16 h-16 rounded-2xl bg-[#15803d]/10 text-[#15803d] flex items-center justify-center mb-8 group-hover:bg-white group-hover:text-[#15803d] transition-colors duration-500">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-black text-[#0A0A0A] mb-4 group-hover:text-white transition-colors duration-500 uppercase tracking-tighter">
                  {feature.title}
                </h3>
                <p className="text-gray-600 group-hover:text-white/80 transition-colors duration-500 font-medium leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Vision Statement */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 p-12 bg-gradient-to-br from-[#15803d]/5 to-transparent rounded-[4rem] border border-[#15803d]/10 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <ShieldCheck className="w-32 h-32 text-[#15803d]" />
          </div>
          <p className="text-2xl md:text-4xl font-black text-[#0A0A0A] text-center leading-tight tracking-tighter uppercase">
            <span className="text-[#15803d]">“</span> {about.vision} <span className="text-[#15803d]">”</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}