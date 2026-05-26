'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker } from 'react-icons/hi';
import { FaInstagram, FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';
import { Locale, getDictionary, getTranslations } from '@/lib/i18n';

interface FooterProps {
  locale: Locale;
}

export default function Footer({ locale }: FooterProps) {
  const dictionary = getDictionary(locale);
  const t = getTranslations(dictionary);

  const quickLinks = [
    { key: 'about', href: `/${locale}#about` },
    { key: 'schemes', href: `/${locale}/schemes` },
    { key: 'facilities', href: `/${locale}#facilities` },
    { key: 'gallery', href: `/${locale}#gallery` },
    { key: 'events', href: `/${locale}#events` },
    { key: 'contact', href: `/${locale}#contact` },
  ];

  const socialLinks = [
    { icon: FaTwitter, label: 'Twitter', href: '#' },
    { icon: FaFacebook, label: 'Facebook', href: '#' },
    { icon: FaInstagram, label: 'Instagram', href: '#' },
    { icon: FaLinkedin, label: 'Linkedin', href: '#' },
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
                  Our Village
                </span>
              </div>
            </Link>
            <p className="text-gray-600 max-w-sm font-medium leading-relaxed mb-10">
              Mallaram is working towards better services, openness, and growth for everyone in the village.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social, i) => (
                <a 
                  key={i} 
                  href={social.href} 
                  className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-[#15803d] hover:text-white transition-all shadow-sm hover:-translate-y-1"
                >
                  <span className="sr-only">{social.label}</span>
                  <social.icon className="w-5 h-5" />
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
            <h4 className="text-[10px] font-black text-[#0A0A0A] uppercase tracking-[0.4em] mb-10">Admin Login</h4>
            <div className="p-8 rounded-[2.5rem] bg-white border border-gray-100 shadow-sm">
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-6 leading-relaxed">
                Only village office staff can log in here to update village information.
              </p>
              <Link
                href={`/${locale}/login`}
                className="inline-flex items-center gap-3 text-[10px] font-black text-[#15803d] uppercase tracking-[0.2em] group"
              >
                Staff Login
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-24 pt-10 border-t border-gray-100 flex flex-col md:flex-row justify-between items-end gap-8">
           <div className="flex flex-col gap-4">
              <p className="text-[10px] font-black text-[#0A0A0A]/40 uppercase tracking-[0.2em] leading-none">
                {dictionary.footer.copyright}
              </p>
              <div className="flex items-center gap-6">
                <p className="text-[9px] font-bold text-[#0A0A0A]/20 uppercase tracking-widest leading-none">
                  Mallaram Village, TS, India 505403
                </p>
                <div className="w-[1px] h-3 bg-gray-100"></div>
                <div className="flex gap-6">
                  <Link href={`/${locale}/privacy`} className="text-[9px] font-black text-[#0A0A0A]/30 hover:text-[#15803d] uppercase tracking-widest transition-colors leading-none">Privacy</Link>
                  <Link href={`/${locale}/terms`} className="text-[9px] font-black text-[#0A0A0A]/30 hover:text-[#15803d] uppercase tracking-widest transition-colors leading-none">Terms</Link>
                </div>
              </div>
           </div>


        </div>
      </div>
    </footer>
  );
}