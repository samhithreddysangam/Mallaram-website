'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Locale, getDictionary } from '@/lib/i18n';
import Navigation from '@/components/Navigation/Navigation';
import Footer from '@/components/Footer/Footer';
import { Clock, ArrowLeft } from 'lucide-react';

export default function SchemesPage() {
  const params = useParams();
  const locale = (params?.locale as Locale) || 'en';
  const dictionary = getDictionary(locale);
  const { comingSoon } = dictionary;

  return (
    <main className="min-h-screen bg-[#FAF9F6]">
      <Navigation locale={locale} />
      
      <div className="pt-40 lg:pt-48 flex items-center justify-center px-4 py-20">
        <div className="max-w-3xl w-full text-center relative">
          {/* Background Decorative Element */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-primary/5 blur-[120px] rounded-full -z-10" />

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-[2rem] shadow-xl border border-primary/10 text-primary mb-4">
              <Clock className="w-12 h-12" />
            </div>

            {/* Content */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold text-primary tracking-tight">
                {comingSoon.title}
              </h1>
              <p className="text-lg md:text-xl text-earth-dark/70 max-w-xl mx-auto leading-relaxed">
                {comingSoon.description}
              </p>
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="pt-8"
            >
              <Link 
                href={`/${locale}`}
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-full shadow-lg hover:bg-earth transition-all active:scale-95"
              >
                <ArrowLeft className="w-5 h-5" />
                {comingSoon.backHome}
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <Footer locale={locale} />
    </main>
  );
}
