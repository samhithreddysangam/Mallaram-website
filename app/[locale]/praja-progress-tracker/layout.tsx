import { Metadata } from 'next';
import { siteConfig } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = `${siteConfig.url}/${locale}/praja-progress-tracker`;

  const isTelugu = locale === 'te';

  return {
    title: 'Praja Progress Tracker',
    description: isTelugu
      ? 'మల్లారం గ్రామ పంచాయతీ ప్రజా ప్రోగ్రెస్ ట్రాకర్ — పథకాల దరఖాస్తులు, ఆమోదాలు, ప్రయోజనాల పంపిణీని పారదర్శకంగా ట్రాక్ చేయండి.'
      : 'Mallaram Gram Panchayat Praja Progress Tracker — transparently track welfare scheme applications, approvals, and beneficiary distributions in real-time.',
    keywords: isTelugu
      ? 'ప్రజా ప్రోగ్రెస్ ట్రాకర్, మల్లారం పథకాలు, సంక్షేమ పథకాలు, పారదర్శకత, గ్రామ పాలన'
      : 'Praja Progress Tracker, Mallaram welfare schemes, beneficiary tracking, governance transparency, Telangana village schemes, application status, welfare distribution',
    alternates: {
      canonical: baseUrl,
      languages: {
        'en-IN': `${siteConfig.url}/en/praja-progress-tracker`,
        'te-IN': `${siteConfig.url}/te/praja-progress-tracker`,
      },
    },
    openGraph: {
      title: 'Praja Progress Tracker — Mallaram Gram Panchayat',
      description: isTelugu
        ? 'మల్లారం గ్రామ పంచాయతీ ప్రజా ప్రోగ్రెస్ ట్రాకర్ - పారదర్శక డిజిటల్ గవర్నెన్స్'
        : 'Mallaram Gram Panchayat Praja Progress Tracker — Transparent Digital Governance Dashboard.',
      url: baseUrl,
    },
    twitter: {
      title: 'Praja Progress Tracker — Mallaram',
      description: 'Track welfare scheme applications, approvals & benefits delivered transparently.',
    },
  };
}

export default function PrajaProgressTrackerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
