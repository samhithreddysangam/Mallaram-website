import { Metadata } from 'next';
import { siteConfig } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = `${siteConfig.url}/${locale}/schemes`;

  return {
    title: 'Government Schemes',
    description: 'Access essential government schemes and welfare programs for Mallaram village residents. MGNREGA, Swachh Bharat, eGramSwaraj, and more from Government of Telangana.',
    keywords: 'government schemes Telangana, Mallaram schemes, MGNREGA, Swachh Bharat, eGramSwaraj, welfare schemes, village schemes, Telangana government programs, rural development schemes',
    alternates: {
      canonical: baseUrl,
      languages: {
        'en-IN': `${siteConfig.url}/en/schemes`,
        'te-IN': `${siteConfig.url}/te/schemes`,
      },
    },
    openGraph: {
      title: 'Government Schemes — Mallaram Village',
      description: 'Access essential government schemes and welfare programs for Mallaram village residents.',
      url: baseUrl,
    },
    twitter: {
      title: 'Government Schemes — Mallaram Village',
      description: 'Access essential government schemes and welfare programs for Mallaram village residents.',
    },
  };
}

export default function SchemesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
