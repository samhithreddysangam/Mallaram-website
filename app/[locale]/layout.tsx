import { locales, getDictionary, Locale } from '@/lib/i18n';
import { siteConfig, siteDescriptions, siteKeywords, address, phoneNumbers, geoCoordinates, publicRoutes } from '@/lib/seo';
import { notFound } from 'next/navigation';

// Generate locale-specific JSON-LD structured data
function generateJsonLd(locale: Locale) {
  const baseUrl = `${siteConfig.url}/${locale}`;

  const organization = {
    '@context': 'https://schema.org',
    '@type': 'GovernmentOrganization',
    '@id': `${baseUrl}/#organization`,
    name: 'Mallaram Gram Panchayat',
    alternateName: 'మల్లారం గ్రామ పంచాయతీ',
    description: siteDescriptions[locale],
    url: baseUrl,
    logo: `${siteConfig.url}/icon.png`,
    image: `${siteConfig.url}/og-image.png`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: address.street,
      addressLocality: address.area,
      addressRegion: address.district,
      postalCode: address.pincode,
      addressCountry: address.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: geoCoordinates.latitude,
      longitude: geoCoordinates.longitude,
    },
    telephone: phoneNumbers[0],
    email: 'admin@mallaram.in',
    areaServed: [
      {
        '@type': 'City',
        name: 'Mallaram',
        sameAs: `${siteConfig.url}/en`,
      },
    ],
    parentOrganization: {
      '@type': 'GovernmentOrganization',
      name: 'Government of Telangana',
      alternateName: 'తెలంగాణ ప్రభుత్వం',
    },
    foundingDate: '1950',
    numberOfEmployees: { '@type': 'QuantitativeValue', minValue: 10, maxValue: 50 },
    knowsLanguage: ['Telugu', 'English'],
    publicAccess: true,
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '10:00',
        closes: '17:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '10:00',
        closes: '13:00',
      },
    ],
    serviceArea: {
      '@type': 'AdministrativeArea',
      name: 'Mallaram, Vemulawada, Rajanna Sircilla, Telangana',
    },
  };

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${baseUrl}/#website`,
    url: baseUrl,
    name: siteConfig.name,
    alternateName: 'మల్లారం గ్రామం - మన ఊరు',
    description: siteDescriptions[locale],
    inLanguage: locale === 'te' ? 'te' : 'en',
    publisher: { '@id': `${baseUrl}/#organization` },
    isAccessibleForFree: true,
    hasPart: publicRoutes.map((route) => ({
      '@type': 'WebPage',
      url: `${baseUrl}${route.path}`,
      inLanguage: locale === 'te' ? 'te' : 'en',
    })),
  };

  // Only add LocalBusiness if there's relevant service info
  const localBusiness = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${baseUrl}/#localbusiness`,
    name: 'Mallaram Gram Panchayat Office',
    description: 'Gram Panchayat office serving Mallaram village in Vemulawada Mandal, Rajanna Sircilla district, Telangana.',
    url: baseUrl,
    telephone: phoneNumbers,
    email: 'admin@mallaram.in',
    image: `${siteConfig.url}/og-image.png`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: address.street,
      addressLocality: address.area,
      addressRegion: address.district,
      postalCode: address.pincode,
      addressCountry: address.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: geoCoordinates.latitude,
      longitude: geoCoordinates.longitude,
    },
    priceRange: 'Free',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '10:00',
        closes: '17:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '10:00',
        closes: '13:00',
      },
    ],
    sameAs: [
      siteConfig.url,
    ],
  };

  const breadcrumbList = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `${baseUrl}/#breadcrumb`,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
    ],
  };

  return `
${JSON.stringify(organization, null, 2)}
${JSON.stringify(website, null, 2)}
${JSON.stringify(localBusiness, null, 2)}
${JSON.stringify(breadcrumbList, null, 2)}
  `;
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const localeKey = locale as Locale;
  const dict = getDictionary(localeKey);
  const baseUrl = `${siteConfig.url}/${locale}`;

  return {
    title: {
      default: `${dict.common.appName} | ${dict.common.tagline}`,
      template: `%s | ${dict.common.appName}`,
    },
    description: siteDescriptions[localeKey],
    keywords: siteKeywords[localeKey],
    alternates: {
      canonical: baseUrl,
      languages: {
        'en-IN': `${siteConfig.url}/en`,
        'te-IN': `${siteConfig.url}/te`,
      },
    },
    openGraph: {
      locale: localeKey === 'te' ? siteConfig.localeAlt : siteConfig.locale,
      title: `${dict.common.appName} | ${dict.common.tagline}`,
      description: siteDescriptions[localeKey],
      url: baseUrl,
      image: `${siteConfig.url}/og-image.png`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${dict.common.appName} | ${dict.common.tagline}`,
      description: siteDescriptions[localeKey],
      images: [`${siteConfig.url}/og-image.png`],
    },
    other: {
      'og:locale:alternate': 'te_IN',
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const localeKey = locale as Locale;
  const jsonLd = generateJsonLd(localeKey);

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />
      {children}
    </>
  );
}
