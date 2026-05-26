import { Metadata } from 'next';
import { siteConfig } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = `${siteConfig.url}/${locale}/terms`;

  return {
    title: 'Terms of Service',
    description: 'Terms and conditions for using the Mallaram Village Portal. Understand your rights and responsibilities when using village digital services.',
    keywords: 'Mallaram terms, village portal terms, gram panchayat terms, service terms Telangana',
    alternates: {
      canonical: baseUrl,
      languages: {
        'en-IN': `${siteConfig.url}/en/terms`,
        'te-IN': `${siteConfig.url}/te/terms`,
      },
    },
    openGraph: {
      title: 'Terms of Service — Mallaram Village',
      description: 'Terms and conditions for using Mallaram Village Portal services.',
      url: baseUrl,
    },
  };
}

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
