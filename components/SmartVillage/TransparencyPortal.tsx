'use client';

import { motion } from 'framer-motion';
import { Locale, getDictionary } from '@/lib/i18n';

interface TransparencyPortalProps {
  locale: Locale;
}

export default function TransparencyPortal({ locale }: TransparencyPortalProps) {
  const dictionary = getDictionary(locale);

  const projects = [
    { title: 'Digital Library', budget: '₹12.5L', progress: 85, status: 'Active' },
    { title: 'CC Roads Ward 3', budget: '₹8.2L', progress: 100, status: 'Completed' },
    { title: 'Solar Grid Exp', budget: '₹15.0L', progress: 40, status: 'Active' },
    { title: 'School Reno', budget: '₹5.5L', progress: 95, status: 'Ending' },
  ];

  return (
    <section id="transparency" className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#15803d]/10 text-[#15803d] text-[10px] font-black uppercase tracking-[0.2em] mb-8 border border-[#15803d]/20">
              Public Information
            </span>
            <h2 className="text-5xl md:text-7xl font-black text-[#0A0A0A] mb-10 tracking-tighter uppercase leading-[0.9]">
              Village <br /><span className="text-[#15803d]">Funds & Projects</span>
            </h2>
            <p className="text-xl text-gray-600 mb-12 leading-relaxed font-medium">
              See how village funds are being used, which projects are running, and how decisions are made. Everything is open to the public.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-8 rounded-[2.5rem] bg-[#FAF9F6] border border-gray-100 group hover:border-[#15803d]/30 transition-all duration-500">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 block">Total Funds Received</span>
                <span className="text-3xl font-black text-[#0A0A0A] tracking-tighter">₹10 Lakh</span>
                <p className="text-[10px] font-black text-[#15803d] uppercase tracking-widest mt-4">FY 2024-25</p>
              </div>
              <div className="p-8 rounded-[2.5rem] bg-[#FAF9F6] border border-gray-100 group hover:border-[#15803d]/30 transition-all duration-500">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 block">Funds Used</span>
                <span className="text-3xl font-black text-[#0A0A0A] tracking-tighter">92%</span>
                <p className="text-[10px] font-black text-[#15803d] uppercase tracking-widest mt-4">Well Spent</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-black text-[#0A0A0A] mb-8 uppercase tracking-tighter">Ongoing <span className="text-[#15803d]">Works</span></h3>
            {projects.map((project, i) => (
              <div key={i} className="p-8 bg-[#FAF9F6] shadow-sm rounded-[3rem] border border-gray-100 group hover:bg-white transition-all duration-500">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h4 className="text-xl font-black text-[#0A0A0A] uppercase tracking-tighter group-hover:text-[#15803d] transition-colors">{project.title}</h4>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Budget: {project.budget}</p>
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${project.status === 'Completed' ? 'bg-[#15803d] text-white' : 'bg-[#15803d]/10 text-[#15803d]'}`}>
                    {project.status}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                    <span className="text-gray-400">Completion</span>
                    <span className="text-[#15803d]">{project.progress}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${project.progress}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, delay: i * 0.1 }}
                      className={`h-full ${project.progress === 100 ? 'bg-[#15803d]' : 'bg-[#15803d]/60'}`}
                    />
                  </div>
                </div>
              </div>
            ))}
            <button className="w-full py-5 border border-gray-200 text-[#0A0A0A] text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-[#15803d] hover:text-white hover:border-[#15803d] transition-all">
              Download Reports
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
