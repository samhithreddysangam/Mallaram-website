import { Suspense } from 'react';
import Navigation from '@/components/Navigation/Navigation';
import MainHeader from '@/components/Navigation/MainHeader';
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
import { siteConfig } from '@/lib/seo';
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
  const baseUrl = `${siteConfig.url}/${locale}`;
  const isTelugu = locale === 'te';
  
  return {
    title: `${dictionary.common.appName} | ${dictionary.common.tagline}`,
    description: isTelugu
      ? 'మల్లారం గ్రామ పంచాయతీ అధికారిక వెబ్‌సైట్ — స్మార్ట్ విలేజ్. ప్రభుత్వ పథకాలు, IKP బుకింగ్, నిధుల పారదర్శకత, వాతావరణ హెచ్చరికలు మరియు గ్రామ సౌకర్యాలను తెలుసుకోండి.'
      : 'Official website of Mallaram Gram Panchayat — smart village rooted in nature. Access government schemes, book IKP slots, view fund transparency, check weather alerts, and explore village facilities in Vemulawada, Telangana.',
    keywords: isTelugu
      ? 'మల్లారం గ్రామం, మల్లారం గ్రామ పంచాయతీ, వేములవాడ, తెలంగాణ గ్రామాలు, స్మార్ట్ విలేజ్, మన ఊరు, డిజిటల్ తెలంగాణ'
      : 'Mallaram village, Mallaram Gram Panchayat, Vemulawada, Telangana villages, smart village, gram panchayat website, Mallaram Telangana, Mana Ooru, Digital Telangana, IKP booking, paddy procurement, village fund transparency',
    alternates: {
      canonical: baseUrl,
      languages: {
        'en-IN': `${siteConfig.url}/en`,
        'te-IN': `${siteConfig.url}/te`,
      },
    },
    openGraph: {
      title: `${dictionary.common.appName} | ${dictionary.common.tagline} — Smart Village Telangana`,
      description: isTelugu
        ? 'మల్లారం గ్రామ పంచాయతీ అధికారిక వెబ్‌సైట్'
        : 'Official website of Mallaram Gram Panchayat — smart village rooted in nature.',
      url: baseUrl,
      siteName: 'Mallaram Village',
      locale: isTelugu ? 'te_IN' : 'en_IN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${dictionary.common.appName} | ${dictionary.common.tagline}`,
      description: isTelugu
        ? 'మల్లారం గ్రామ పంచాయతీ అధికారిక వెబ్‌సైట్'
        : 'Official website of Mallaram Gram Panchayat — smart village rooted in nature.',
    },
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
      <MainHeader locale={currentLocale} />
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