'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { HiBars3BottomRight, HiXMark, HiArrowRightOnRectangle } from 'react-icons/hi2';
import { Locale, getDictionary, getTranslations } from '@/lib/i18n';
import { useSession, signOut } from 'next-auth/react';

interface NavigationProps {
  locale: Locale;
}

export default function Navigation({ locale }: NavigationProps) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dictionary = getDictionary(locale);
  const t = getTranslations(dictionary);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { key: 'home', href: `/${locale}#home` },
    { key: 'governance', href: `/${locale}#command-center` },
    { key: 'about', href: `/${locale}#about` },
    { key: 'dashboard', href: `/${locale}/ikp-booking` },
    { key: 'schemes', href: `/${locale}/schemes` },
    { key: 'facilities', href: `/${locale}#facilities` },
    { key: 'gallery', href: `/${locale}#gallery` },
    { key: 'events', href: `/${locale}#events` },
    { key: 'complaint', href: `/${locale}#complaint` },
    { key: 'contact', href: `/${locale}#contact` },
  ];

  const toggleLanguage = () => {
    const newLocale = locale === 'en' ? 'te' : 'en';
    window.location.href = `/${newLocale}${window.location.hash || ''}`;
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${scrolled ? 'py-2' : 'py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className={`relative transition-all duration-500 bg-white/70 backdrop-blur-2xl border border-white/40 rounded-[2rem] px-6 md:px-10 flex items-center justify-between shadow-[0_8px_32px_rgba(0,0,0,0.05)] ${scrolled ? 'h-16' : 'h-20'}`}>
          
          {/* LEFT: Identity */}
          <div className="flex-1 flex justify-start items-center gap-4">
            <Link href={`/${locale}`} className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 md:w-12 md:h-12">
                <Image
                  src="/images/telangana-logo.png"
                  alt="Telangana Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-sm md:text-xl font-black text-[#0A0A0A] tracking-tighter leading-none uppercase">
                  {dictionary.hero.title}
                </span>
                <span className="text-[7px] md:text-[9px] font-bold text-[#15803d] uppercase tracking-[0.2em] mt-1">
                  Government of Telangana
                </span>
              </div>
            </Link>
          </div>
 
          {/* CENTER: Desktop Links */}
          <div className="hidden xl:flex items-center gap-1">
            {navItems.slice(0, 7).map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="text-[9px] font-black text-[#0A0A0A]/60 hover:text-[#15803d] uppercase tracking-[0.2em] px-4 py-2 transition-all relative group"
              >
                {t(`nav.${item.key}`)}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#15803d] transition-all group-hover:w-1/2"></span>
              </Link>
            ))}
          </div>
 
          {/* RIGHT: Controls */}
          <div className="flex-1 flex justify-end items-center gap-4">
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={toggleLanguage}
                className="px-5 py-2 text-[9px] font-black rounded-xl bg-[#15803d]/10 text-[#15803d] hover:bg-[#15803d] hover:text-white transition-all border border-[#15803d]/20 uppercase tracking-widest"
              >
                {t('language.toggle')}
              </button>
              
              {session ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => signOut()}
                    className="p-2.5 rounded-xl bg-gray-100 text-gray-500 hover:text-red-500 hover:bg-red-500/10 transition-all border border-gray-200"
                    title="Sign Out"
                  >
                    <HiArrowRightOnRectangle className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <Link
                  href={`/${locale}/login`}
                  className="px-6 py-2 text-[9px] font-black rounded-xl bg-[#15803d] text-white hover:bg-black transition-all uppercase tracking-widest shadow-lg shadow-[#15803d]/10"
                >
                  {t('auth.login')}
                </Link>
              )}
            </div>
            
            {/* Mobile Toggle */}
            <button
              className="xl:hidden p-2.5 rounded-xl bg-gray-100 text-[#0A0A0A] border border-gray-200"
              onClick={() => setIsOpen(!isOpen)}
            >
              <HiBars3BottomRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="xl:hidden absolute top-full left-4 right-4 mt-4 p-8 bg-white/95 backdrop-blur-2xl border border-gray-200 rounded-[2.5rem] shadow-2xl z-[60]"
            >
              <div className="grid grid-cols-1 gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.key}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="text-lg font-black text-[#0A0A0A]/60 hover:text-[#15803d] py-4 px-4 rounded-2xl hover:bg-gray-50 transition-all uppercase tracking-widest flex items-center justify-between"
                  >
                    {t(`nav.${item.key}`)}
                    <span className="text-[#15803d]/20 group-hover:text-[#15803d]">→</span>
                  </Link>
                ))}
                
                <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col gap-4">
                  <button
                    onClick={toggleLanguage}
                    className="w-full py-4 text-xs font-black rounded-2xl bg-[#15803d] text-white uppercase tracking-widest"
                  >
                    {t('language.toggle')}
                  </button>
                  {session ? (
                    <button
                      onClick={() => signOut()}
                      className="w-full py-4 text-xs font-black rounded-2xl bg-red-500/10 text-red-500 uppercase tracking-widest"
                    >
                      Sign Out
                    </button>
                  ) : (
                    <Link
                      href={`/${locale}/login`}
                      className="w-full py-4 text-center text-xs font-black rounded-2xl bg-black text-white uppercase tracking-widest"
                    >
                      {t('auth.login')}
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
