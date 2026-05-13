import { Suspense } from 'react';
import Navigation from '@/components/Navigation/Navigation';
import OfficialsSection from '@/components/Navigation/OfficialsSection';
import Hero from '@/components/Hero/Hero';
import Stats from '@/components/Stats/Stats';
import About from '@/components/About/About';
import Facilities from '@/components/Facilities/Facilities';
import Gallery from '@/components/Gallery/Gallery';
import Events from '@/components/Events/Events';
import CTA from '@/components/CTA/CTA';
import Contact from '@/components/Contact/Contact';
import Footer from '@/components/Footer/Footer';
import SmartAgriculture from '@/components/SmartVillage/SmartAgriculture';
import SmartCommandCenter from '@/components/SmartVillage/SmartCommandCenter';
import WaterGovernance from '@/components/SmartVillage/WaterGovernance';
import TransparencyPortal from '@/components/SmartVillage/TransparencyPortal';
import EmergencyAlerts from '@/components/SmartVillage/EmergencyAlerts';
import GrievanceSystem from '@/components/SmartVillage/GrievanceSystem';
import VillageMap from '@/components/SmartVillage/VillageMap';
import { locales, getDictionary, Locale } from '@/lib/i18n';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  
  if (!locales.includes(locale as Locale)) {
    return notFound();
  }
  
  const dictionary = getDictionary(locale as Locale);
  
  return {
    title: `${dictionary.common.appName} | ${dictionary.common.tagline}`,
    description: dictionary.common.subtitle,
  };
}

export default async function LocalePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  
  if (!locales.includes(locale as Locale)) {
    notFound();
  }
  
  const currentLocale = locale as Locale;
  
  return (
    <main className="min-h-screen bg-[#FAF9F6] pt-[80px] lg:pt-[200px]">
      <Suspense fallback={<div className="h-16 bg-cream" />}>
        <Navigation locale={currentLocale} />
      </Suspense>
      <OfficialsSection locale={currentLocale} />
      <Hero locale={currentLocale} />
      <Stats locale={currentLocale} />
      <SmartCommandCenter locale={currentLocale} />
      <SmartAgriculture locale={currentLocale} />
      <WaterGovernance locale={currentLocale} />
      <TransparencyPortal locale={currentLocale} />
      <EmergencyAlerts locale={currentLocale} />
      <GrievanceSystem locale={currentLocale} />
      <VillageMap locale={currentLocale} />
      <About locale={currentLocale} />
      <Facilities locale={currentLocale} />
      <Gallery locale={currentLocale} />
      <Events locale={currentLocale} />
      <Contact locale={currentLocale} />
      <CTA locale={currentLocale} />
      <Footer locale={currentLocale} />
    </main>
  );
}