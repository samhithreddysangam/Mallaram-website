export const siteConfig = {
  name: 'Mallaram Village',
  shortName: 'Mallaram',
  tagline: 'Mana Ooru',
  description: 'Official website of Mallaram Gram Panchayat, Vemulawada, Telangana. Smart village with transparent governance, digital services, IKP booking, and real-time village updates.',
  url: 'https://www.mallaramgramapanchayat.com',
  locale: 'en_IN',
  localeAlt: 'te_IN',
  author: 'Mallaram Gram Panchayat',
  googleVerification: '', // Add your Google Search Console verification code
  social: {
    twitter: '@mallaramvillage',
  },
};

export const siteDescriptions = {
  en: 'Official website of Mallaram Gram Panchayat — smart village rooted in nature. Access government schemes, book IKP slots, view fund transparency, check weather alerts, and explore village facilities in Vemulawada, Telangana.',
  te: 'మల్లారం గ్రామ పంచాయతీ అధికారిక వెబ్‌సైట్ — స్మార్ట్ విలేజ్. ప్రభుత్వ పథకాలు, IKP బుకింగ్, నిధుల పారదర్శకత, వాతావరణ హెచ్చరికలు మరియు గ్రామ సౌకర్యాలను తెలుసుకోండి.',
};

export const siteKeywords = {
  en: [
    'Mallaram village',
    'Mallaram Gram Panchayat',
    'Vemulawada village',
    'Telangana villages',
    'smart village Telangana',
    'Mallaram panchayat',
    'gram panchayat website',
    'Mallaram Vemulawada',
    'Mallaram Telangana',
    'village panchayat Telangana',
    'mallaramgramapanchayat.com',
    'Mana Ooru',
    'Digital Telangana',
    'IKP booking Telangana',
    'paddy procurement Mallaram',
    'village fund transparency',
    'Mallaram facilities',
    'Mallaram schools',
    'Mallaram water supply',
    'Mallaram pin code',
    'Mallaram population',
    'Mallaram sarpanch',
    'Sangam Arpitha',
  ].join(', '),
  te: [
    'మల్లారం గ్రామం',
    'మల్లారం గ్రామ పంచాయతీ',
    'వేములవాడ గ్రామాలు',
    'తెలంగాణ గ్రామాలు',
    'స్మార్ట్ విలేజ్ తెలంగాణ',
    'మల్లారం పంచాయతీ',
    'మల్లారం వేములవాడ',
    'మల్లారం తెలంగాణ',
    'మన ఊరు',
    'డిజిటల్ తెలంగాణ',
  ].join(', '),
};

export const ogImage = {
  url: '/og-image.png',
  width: 1200,
  height: 630,
  alt: 'Mallaram Village — Smart Village Rooted in Nature',
};

export const phoneNumbers = [
  '+91 9989120933',
  '+91 8008253003',
];

export const address = {
  street: 'Mallaram Village',
  area: 'Vemulawada Mandal',
  district: 'Rajanna Sircilla',
  state: 'Telangana',
  pincode: '505403',
  country: 'India',
};

export const geoCoordinates = {
  latitude: 18.3863,
  longitude: 78.8156,
};

// All public routes for sitemap generation
export const publicRoutes = [
  { path: '', changefreq: 'daily', priority: 1.0 },
  { path: '/schemes', changefreq: 'weekly', priority: 0.8 },
  { path: '/ikp-booking', changefreq: 'daily', priority: 0.7 },
  { path: '/village-administration', changefreq: 'weekly', priority: 0.7 },
  { path: '/privacy', changefreq: 'monthly', priority: 0.3 },
  { path: '/terms', changefreq: 'monthly', priority: 0.3 },
  { path: '/login', changefreq: 'monthly', priority: 0.2 },
  { path: '/praja-progress-tracker', changefreq: 'daily', priority: 0.9 },
] as const;
