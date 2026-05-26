import { Metadata } from 'next';
import { siteConfig } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = `${siteConfig.url}/${locale}/privacy`;

  return {
    title: 'Privacy Policy',
    description: 'Privacy Policy of Mallaram Gram Panchayat. Learn how we collect, use, and protect your personal information in compliance with DPDP Act of India.',
    keywords: 'Mallaram privacy policy, gram panchayat privacy, data protection Telangana, DPDP Act, village data privacy',
    alternates: {
      canonical: baseUrl,
      languages: {
        'en-IN': `${siteConfig.url}/en/privacy`,
        'te-IN': `${siteConfig.url}/te/privacy`,
      },
    },
    openGraph: {
      title: 'Privacy Policy — Mallaram Village',
      description: 'Learn how Mallaram Gram Panchayat protects your personal information.',
      url: baseUrl,
    },
  };
}

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
