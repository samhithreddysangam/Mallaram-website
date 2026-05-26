import { Metadata } from 'next';
import { siteConfig } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = `${siteConfig.url}/${locale}/login`;

  return {
    title: 'Staff Login',
    description: 'Login to Mallaram Gram Panchayat admin dashboard. Authorized village staff only.',
    keywords: 'Mallaram login, gram panchayat login, village admin login, Mallaram staff login',
    alternates: {
      canonical: baseUrl,
    },
    robots: {
      index: false,
      follow: false,
    },
    openGraph: {
      title: 'Staff Login — Mallaram Village',
      description: 'Village administration login portal.',
      url: baseUrl,
    },
  };
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
