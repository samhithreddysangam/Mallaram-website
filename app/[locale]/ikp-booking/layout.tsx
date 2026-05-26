import { Metadata } from 'next';
import { siteConfig } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = `${siteConfig.url}/${locale}/ikp-booking`;

  return {
    title: 'IKP Centre Booking — Paddy Submission Slot',
    description: 'Book your slot for paddy submission at IKP Centre Mallaram. Check availability, reserve your time for paddy procurement, and get real-time market prices for your crops.',
    keywords: 'IKP booking Mallaram, paddy submission booking, IKP centre booking, paddy procurement Telangana, crop booking slot, Mallaram IKP, paddy MSP, farmers booking, agriculture services Telangana',
    alternates: {
      canonical: baseUrl,
      languages: {
        'en-IN': `${siteConfig.url}/en/ikp-booking`,
        'te-IN': `${siteConfig.url}/te/ikp-booking`,
      },
    },
    openGraph: {
      title: 'IKP Centre Booking — Mallaram Village',
      description: 'Book your paddy submission slot at IKP Centre Mallaram. Easy online booking for farmers.',
      url: baseUrl,
    },
    twitter: {
      title: 'IKP Centre Booking — Mallaram Village',
      description: 'Book your paddy submission slot at IKP Centre Mallaram.',
    },
  };
}

export default function IkpBookingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
