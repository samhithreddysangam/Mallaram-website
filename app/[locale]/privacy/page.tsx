'use client';

import { useParams } from 'next/navigation';
import { getDictionary, Locale } from '@/lib/i18n';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';

export default function PrivacyPage() {
  const params = useParams();
  const locale = params.locale as Locale;
  const dictionary = getDictionary(locale);
  const privacy = dictionary.privacy;

  return (
    <main className="min-h-screen bg-[#FAF9F6] pt-32 pb-24 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Navigation */}
        <Link 
          href={`/${locale}`}
          className="inline-flex items-center gap-2 text-xs font-black text-gray-400 hover:text-[#15803d] uppercase tracking-widest transition-colors mb-12 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="mb-16">
          <div className="w-16 h-16 rounded-[2rem] bg-[#15803d]/5 flex items-center justify-center mb-8">
            <Shield className="w-8 h-8 text-[#15803d]" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-[#0A0A0A] uppercase tracking-tighter mb-6">
            {privacy.title}
          </h1>
          <p className="text-lg text-gray-600 font-medium leading-relaxed max-w-2xl">
            {privacy.introduction}
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-16">
          {privacy.sections.map((section, i) => (
            <motion.section 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative pl-8 border-l border-gray-100"
            >
              <h2 className="text-[10px] font-black text-[#15803d] uppercase tracking-[0.4em] mb-4">
                0{i + 1} / {section.title}
              </h2>
              <p className="text-base text-gray-600 font-medium leading-relaxed">
                {section.content}
              </p>
            </motion.section>
          ))}
        </div>

        {/* Footer info */}
        <div className="mt-24 pt-12 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
            Last Updated: May 2026
          </p>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
            Gram Panchayat Mallaram
          </p>
        </div>
      </div>
    </main>
  );
}
