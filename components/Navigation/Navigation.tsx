'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogOut } from 'lucide-react';
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
    { key: 'prajaTracker', href: `/${locale}/praja-progress-tracker` },
    { key: 'facilities', href: `/${locale}#facilities` },
    { key: 'gallery', href: `/${locale}#gallery` },
    { key: 'events', href: `/${locale}#events` },
    { key: 'complaint', href: `/${locale}#complaint` },
    { key: 'contact', href: `/${locale}#contact` },
    { key: 'villageAdmin', href: `/${locale}/village-administration` },
  ];

  const toggleLanguage = () => {
    const newLocale = locale === 'en' ? 'te' : 'en';
    window.location.href = `/${newLocale}${window.location.hash || ''}`;
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${scrolled ? 'py-2' : 'py-6 md:py-10'}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className={`relative transition-all duration-500 bg-white/80 backdrop-blur-2xl border border-white/40 rounded-[2.5rem] px-6 md:px-10 flex items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.1)] ${scrolled ? 'h-14 md:h-16' : 'h-16 md:h-20'}`}>
          
          {/* LEFT: Village Name */}
          <div className="hidden xl:flex flex-col items-start justify-center">
            <span className="text-xs md:text-sm font-black text-[#0A0A0A] uppercase tracking-[0.1em] leading-none">{dictionary.hero.title}</span>
            <span className="text-[8px] md:text-[9px] font-medium text-[#15803d] uppercase tracking-[0.2em] mt-0.5">{dictionary.hero.tagline}</span>
          </div>

          {/* Nav Links (Desktop) */}
          <div className="hidden xl:flex flex-1 justify-end items-center gap-0.5">              {navItems.slice(0, 5).map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="text-[10px] font-black text-[#0A0A0A]/60 hover:text-[#15803d] uppercase tracking-[0.15em] px-3 py-2 transition-all relative group whitespace-nowrap"
              >
                {t(`nav.${item.key}`)}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#15803d] transition-all group-hover:w-1/2"></span>
              </Link>
            ))}
          </div>

          {/* CENTER: BIG LOGO */}
          <div className="flex-none flex justify-center relative z-10 mx-6">
            <Link href={`/${locale}`} className="relative group">
              {/* Subtle Glow Effect */}
              <div className={`absolute inset-0 rounded-full bg-gradient-to-tr from-[#15803d]/20 via-white/10 to-[#15803d]/20 blur-2xl md:blur-3xl -m-6 md:-m-12 pointer-events-none transition-opacity duration-700 ${scrolled ? 'opacity-40' : 'opacity-80'}`}></div>
              
              <div className={`relative transition-all duration-500 ease-out will-change-transform rounded-full bg-white p-2 md:p-3 shadow-2xl border-[3px] md:border-[5px] border-white flex items-center justify-center overflow-hidden ${scrolled ? 'w-16 h-16 md:w-20 md:h-20' : 'w-20 h-20 md:w-28 md:h-28'}`}>
                <div className="absolute inset-0 bg-[#FAF9F6]/50"></div>
                <Image
                  src="/images/telangana-logo.png"
                  alt="Telangana Logo"
                  fill
                  className="object-contain p-2 md:p-3 z-10 transition-transform duration-700 group-hover:scale-110"
                />
              </div>
            </Link>
          </div>
 
          {/* RIGHT: Nav Links & Controls */}
          <div className="flex-1 flex justify-start items-center gap-3">
            <div className="hidden xl:flex items-center gap-0.5">
              {navItems.slice(5, 9).map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  className="text-[10px] font-black text-[#0A0A0A]/60 hover:text-[#15803d] uppercase tracking-[0.15em] px-3 py-2 transition-all relative group whitespace-nowrap"
                >
                  {t(`nav.${item.key}`)}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#15803d] transition-all group-hover:w-1/2"></span>
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3 ml-auto">
              <button
                onClick={toggleLanguage}
                className="hidden md:block px-5 py-2.5 text-[9px] font-black rounded-xl bg-[#15803d]/10 text-[#15803d] hover:bg-[#15803d] hover:text-white transition-all border border-[#15803d]/20 uppercase tracking-widest active:scale-95"
              >
                {t('language.toggle')}
              </button>
              
              {session ? (
                <button
                  onClick={() => signOut()}
                  className="p-2.5 rounded-xl bg-gray-100 text-gray-500 hover:text-red-500 hover:bg-red-500/10 transition-all border border-gray-200"
                  title="Sign Out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              ) : (
                <Link
                  href={`/${locale}/login`}
                  className="px-6 py-2.5 text-[9px] font-black rounded-xl bg-[#15803d] text-white hover:bg-black transition-all uppercase tracking-widest shadow-lg shadow-[#15803d]/10 active:scale-95"
                >
                  {t('auth.login')}
                </Link>
              )}

              {/* Mobile Toggle */}
              <button
                className="xl:hidden p-2.5 rounded-xl bg-gray-100 text-[#0A0A0A] border border-gray-200"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
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
                    className="text-lg font-black text-[#0A0A0A]/60 hover:text-[#15803d] py-4 px-4 rounded-2xl hover:bg-gray-50 transition-all uppercase tracking-widest flex items-center justify-between group"
                  >
                    {t(`nav.${item.key}`)}
                    <span className="text-[#15803d]/20 group-hover:text-[#15803d] group-hover:translate-x-1 transition-all">→</span>
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
