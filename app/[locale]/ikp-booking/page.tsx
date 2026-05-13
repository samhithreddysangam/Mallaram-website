'use client';

import { useParams } from 'next/navigation';
import { Locale, getDictionary } from '@/lib/i18n';
import Navigation from '@/components/Navigation/Navigation';
import Footer from '@/components/Footer/Footer';
import BookingSystem from '@/components/Agriculture/BookingSystem';
import { WeatherWidget, MarketPrices } from '@/components/Agriculture/AgriWidgets';
import { motion } from 'framer-motion';
import { Bell, UserCircle, LogOut } from 'lucide-react';

import { useSession } from 'next-auth/react';

export default function IKPBookingPage() {
  const params = useParams();
  const locale = (params?.locale as Locale) || 'en';
  const dictionary = getDictionary(locale);
  const { ikp } = dictionary;

  return (
    <main className="min-h-screen bg-[#F8F9FA]">
      <Navigation locale={locale} />
      
      <div className="pt-40 lg:pt-48 px-4 pb-20">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <header className="mb-10 text-center">
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 text-primary font-bold uppercase tracking-[0.2em] text-xs mb-4"
            >
              <span className="w-8 h-px bg-primary"></span>
              {ikp.title}
              <span className="w-8 h-px bg-primary"></span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-black text-primary-dark tracking-tighter mb-4"
            >
              {ikp.title}
            </motion.h1>
            <p className="text-earth text-lg md:text-xl max-w-2xl mx-auto">
              {ikp.subtitle}
            </p>
          </header>

          <div className="grid lg:grid-cols-12 gap-8">
            {/* Left Column: Info & Prices */}
            <div className="lg:col-span-4 space-y-8">
              <WeatherWidget />
              <MarketPrices />
              
              {/* Important Notices */}
              <div className="bg-primary-dark rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="font-bold mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-earth"></span>
                    IKP Submission Rules
                  </h3>
                  <div className="space-y-4 text-sm text-gray-300">
                    <div className="flex gap-3">
                      <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-xs text-white shrink-0">1</span>
                      <p>Bring your original Aadhar card and bank passbook.</p>
                    </div>
                    <div className="flex gap-3">
                      <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-xs text-white shrink-0">2</span>
                      <p>Moisture content should be less than 17% for Paddy.</p>
                    </div>
                    <div className="flex gap-3">
                      <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-xs text-white shrink-0">3</span>
                      <p>Arrive 15 minutes before your scheduled slot.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Booking System */}
            <div className="lg:col-span-8">
              <BookingSystem locale={locale} />
            </div>
          </div>
        </div>
      </div>

      <Footer locale={locale} />
    </main>
  );
}
