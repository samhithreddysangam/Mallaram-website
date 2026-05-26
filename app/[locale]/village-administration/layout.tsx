import { Metadata } from 'next';
import { siteConfig } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = `${siteConfig.url}/${locale}/village-administration`;

  return {
    title: 'Village Administration',
    description: 'Meet the Mallaram Gram Panchayat team led by Sarpanch Sangam Arpitha. View village officials, their roles, and responsibilities in village governance.',
    keywords: 'Mallaram administration, gram panchayat members, Mallaram sarpanch, Sangam Arpitha, village officials, panchayat team, Telangana village administration, Mallaram gram panchayat staff',
    alternates: {
      canonical: baseUrl,
      languages: {
        'en-IN': `${siteConfig.url}/en/village-administration`,
        'te-IN': `${siteConfig.url}/te/village-administration`,
      },
    },
    openGraph: {
      title: 'Village Administration — Mallaram',
      description: 'Meet the Mallaram Gram Panchayat team and village officials.',
      url: baseUrl,
    },
    twitter: {
      title: 'Village Administration — Mallaram',
      description: 'Meet the Mallaram Gram Panchayat team and village officials.',
    },
  };
}

export default function VillageAdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
