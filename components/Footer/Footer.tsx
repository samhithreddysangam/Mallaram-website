'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Locale, getDictionary, getTranslations } from '@/lib/i18n';

interface FooterProps {
  locale: Locale;
}

export default function Footer({ locale }: FooterProps) {
  const dictionary = getDictionary(locale);
  const t = getTranslations(dictionary);

  const quickLinks = [
    { key: 'about', href: `/${locale}#about` },
    { key: 'facilities', href: `/${locale}#facilities` },
    { key: 'gallery', href: `/${locale}#gallery` },
    { key: 'events', href: `/${locale}#events` },
    { key: 'contact', href: `/${locale}#contact` },
  ];

  return (
    <footer className="bg-[#FAF9F6] border-t border-gray-100 py-24 px-4 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#15803d]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8">
          
          {/* Brand Identity */}
          <div className="md:col-span-5">
            <Link href={`/${locale}`} className="inline-block group mb-8">
              <span className="text-3xl font-black text-[#0A0A0A] tracking-tighter uppercase group-hover:text-[#15803d] transition-colors">
                {dictionary.hero.title}
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className="h-[2px] w-4 bg-[#15803d]"></span>
                <span className="text-[10px] font-black text-[#15803d] uppercase tracking-[0.3em]">
                  Digital Village
                </span>
              </div>
            </Link>
            <p className="text-gray-600 max-w-sm font-medium leading-relaxed mb-10">
              A pioneering smart village initiative focused on transparency, digital inclusion, and community-driven progress.
            </p>
            <div className="flex gap-4">
              {['Twitter', 'Facebook', 'Instagram'].map(social => (
                <a key={social} href="#" className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-[#15803d] hover:text-white transition-all shadow-sm">
                  <span className="sr-only">{social}</span>
                  <div className="w-5 h-5 bg-current rounded-sm opacity-20" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3">
            <h4 className="text-[10px] font-black text-[#0A0A0A] uppercase tracking-[0.4em] mb-10">Navigation</h4>
            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.key}>
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-[#15803d] transition-all text-sm font-bold uppercase tracking-widest flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-[1px] bg-gray-200 group-hover:w-3 group-hover:bg-[#15803d] transition-all"></span>
                    {t(`nav.${link.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Admin Access */}
          <div className="md:col-span-4">
            <h4 className="text-[10px] font-black text-[#0A0A0A] uppercase tracking-[0.4em] mb-10">Governance Portal</h4>
            <div className="p-8 rounded-[2.5rem] bg-white border border-gray-100 shadow-sm">
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-6 leading-relaxed">
                Administrative access only. Authorized personnel can log in to manage village data.
              </p>
              <Link
                href={`/${locale}/login`}
                className="inline-flex items-center gap-3 text-[10px] font-black text-[#15803d] uppercase tracking-[0.2em] group"
              >
                Access Admin Panel
                <span className="w-10 h-[2px] bg-[#15803d]/20 group-hover:bg-[#15803d] transition-all group-hover:w-16"></span>
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-24 pt-10 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            {dictionary.footer.copyright} — Mallaram Village, TS, India 505403
          </p>
          <div className="flex gap-8">
            <Link href="#" className="text-[9px] font-black text-gray-400 hover:text-[#0A0A0A] uppercase tracking-widest transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-[9px] font-black text-gray-400 hover:text-[#0A0A0A] uppercase tracking-widest transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}