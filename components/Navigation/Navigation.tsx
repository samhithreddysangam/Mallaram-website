'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
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
    { key: 'about', href: `/${locale}#about` },
    { key: 'dashboard', href: `/${locale}/ikp-booking` },
    { key: 'schemes', href: `/${locale}/schemes` },
    { key: 'facilities', href: `/${locale}#facilities` },
    { key: 'gallery', href: `/${locale}#gallery` },
    { key: 'events', href: `/${locale}#events` },
    { key: 'complaint', href: `/${locale}#complaint` },
    { key: 'contact', href: `/${locale}#contact` },
  ];

  const isAdmin = (session?.user as any)?.role === 'ADMIN';

  const toggleLanguage = () => {
    const newLocale = locale === 'en' ? 'te' : 'en';
    window.location.href = `/${newLocale}${window.location.hash || ''}`;
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100' : 'bg-white shadow-sm border-b border-transparent'}`}>
      {/* Decorative top strip */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 z-[60]"></div>
      
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className={`flex items-center justify-between transition-all duration-500 ease-in-out ${scrolled ? 'h-16 lg:h-20' : 'h-20 lg:h-44'}`}>
          
          {/* LEFT: Village Identity */}
          <div className={`flex-1 flex justify-start transition-transform duration-500 ${scrolled ? 'scale-90' : 'scale-100'}`}>
            <Link href={`/${locale}`} className="flex flex-col items-start group">
              <span className="text-xl md:text-3xl font-black text-primary tracking-tighter transition-colors duration-300 group-hover:text-earth whitespace-nowrap">
                {dictionary.hero.title}
              </span>
              <div className="flex items-center gap-2">
                <span className="h-px w-3 md:w-4 bg-earth/40"></span>
                <span className="text-[7px] md:text-[10px] font-bold text-earth uppercase tracking-[0.2em] md:tracking-[0.4em] whitespace-nowrap">
                  {dictionary.hero.tagline}
                </span>
              </div>
            </Link>
          </div>
 
          {/* CENTER: MAIN LOGO */}
          <div className="flex-none flex justify-center relative px-2">
            <Link href={`/${locale}`} className="relative group flex items-center justify-center">
              {/* Outer glow ring */}
              <div 
                className={`absolute inset-0 rounded-full bg-gradient-to-tr from-earth/20 via-primary/10 to-earth/20 blur-2xl md:blur-3xl -m-6 md:-m-12 pointer-events-none transition-opacity duration-700 ${scrolled ? 'opacity-30' : 'opacity-60'}`}
              ></div>
              
              <div 
                className={`relative transition-all duration-500 ease-out will-change-transform rounded-full bg-white p-1.5 md:p-2 shadow-xl md:shadow-2xl border-[3px] md:border-[4px] border-earth/20 flex items-center justify-center overflow-hidden ${scrolled ? 'w-14 h-14 md:w-24 md:h-24' : 'w-16 h-16 md:w-44 md:h-44'}`}
              >
                <img
                  src="/images/telangana-state-logo.png"
                  alt="Telangana State Logo"
                  className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110 z-10"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
              </div>
            </Link>
          </div>
 
          {/* RIGHT: Nav Links & Controls */}
          <div className={`flex-1 flex justify-end items-center gap-2 lg:gap-6 transition-transform duration-500 ${scrolled ? 'scale-95' : 'scale-100'}`}>
            <div className="hidden xl:flex items-center gap-4">
              {navItems.slice(0, 4).map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  className="text-[9px] font-black text-gray-600 hover:text-primary uppercase tracking-[0.2em] relative group px-2 py-1 transition-colors"
                >
                  {t(`nav.${item.key}`)}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-earth transition-all group-hover:w-full"></span>
                </Link>
              ))}
              {isAdmin && (
                <Link
                  href={`/${locale}/dashboard/admin`}
                  className="text-[9px] font-black text-red-600 hover:text-red-700 uppercase tracking-[0.2em] relative group px-2 py-1 transition-colors"
                >
                  Admin
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-red-600 transition-all group-hover:w-full"></span>
                </Link>
              )}
            </div>
            
            <div className="flex items-center gap-2 md:gap-3">
              <button
                onClick={toggleLanguage}
                className="px-3 py-1.5 lg:px-6 lg:py-2.5 text-[8px] lg:text-[10px] font-black rounded-full bg-primary text-white hover:bg-earth transition-all shadow-md active:scale-95 uppercase tracking-widest whitespace-nowrap"
              >
                {t('language.toggle')}
              </button>
              
              {/* Desktop Login/Sign Out */}
              {session ? (
                <div className="flex items-center gap-2">
                  <span className="hidden md:block text-[10px] font-black text-primary-dark uppercase truncate max-w-[80px]">
                    {session.user?.name}
                  </span>
                  <button
                    onClick={() => signOut()}
                    className="p-2 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors shadow-sm"
                    title="Sign Out"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                </div>
              ) : (
                <Link
                  href={`/${locale}/login`}
                  className="px-4 py-2 lg:px-6 lg:py-2.5 text-[9px] lg:text-[10px] font-black rounded-full bg-primary-dark text-white hover:bg-earth transition-all shadow-md active:scale-95 uppercase tracking-widest whitespace-nowrap"
                >
                  {t('auth.login')}
                </Link>
              )}
              
              {/* Mobile Menu Toggle */}
              <button
                className="lg:hidden p-1.5 rounded-full bg-gray-50 text-primary hover:bg-gray-100 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 8h16M4 16h16" />
                  )}
                </svg>
              </button>

              {/* Desktop Complaint Button */}
              <Link
                href={`/${locale}#complaint`}
                className="hidden sm:flex items-center gap-2 px-4 py-2 lg:px-5 lg:py-2.5 text-[9px] lg:text-[10px] font-black rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all active:scale-95 uppercase tracking-widest"
              >
                <svg className="w-3 h-3 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                {t('nav.complaint')}
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden overflow-hidden bg-white/95 backdrop-blur-md"
            >
              <div className="flex flex-col gap-1 py-6">
                {navItems.map((item) => (
                  <Link
                    key={item.key}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="text-base font-black text-gray-700 hover:text-primary py-3 px-2 border-b border-gray-50 transition-colors uppercase tracking-wider flex items-center justify-between"
                  >
                    {t(`nav.${item.key}`)}
                    <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
                {isAdmin && (
                  <Link
                    href={`/${locale}/dashboard/admin`}
                    onClick={() => setIsOpen(false)}
                    className="text-base font-black text-red-600 hover:text-red-700 py-3 px-2 border-b border-gray-50 transition-colors uppercase tracking-wider flex items-center justify-between"
                  >
                    Admin Control
                    <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                )}
                {/* Mobile Complaint Button inside menu */}
                <Link
                  href={`/${locale}#complaint`}
                  onClick={() => setIsOpen(false)}
                  className="mt-4 flex items-center justify-center gap-3 px-6 py-4 text-sm font-black rounded-xl bg-primary text-white hover:bg-earth transition-all shadow-lg uppercase tracking-widest"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  {t('nav.complaint')}
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
