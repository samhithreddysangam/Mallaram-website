export const siteConfig = {
  name: 'Mallaram Village',
  shortName: 'Mallaram',
  tagline: 'Mana Ooru',
  description: 'Official website of Mallaram Gram Panchayat, Vemulawada, Telangana — India\'s first fully digital Gram Panchayat. Smart village with transparent governance, digital services, IKP booking, and real-time village updates.',
  url: 'https://www.mallaramgramapanchayat.com',
  locale: 'en_IN',
  localeAlt: 'te_IN',
  author: 'Samhithreddy Sangam',
  authorRole: 'Developer & Founder of Codebuff Digital Solutions',
  authorRelation: 'Son of Sarpanch, Mallaram Gram Panchayat',
  googleVerification: '', // Add your Google Search Console verification code
  social: {
    twitter: '@mallaramvillage',
  },
};

export const siteDescriptions = {
  en: 'India\'s first fully digital Gram Panchayat — Mallaram Village, Vemulawada Rural Mandal, Rajanna Sircilla, Telangana. Access government schemes, book IKP slots, view fund transparency, real-time weather, and village facilities. Digitally empowered by Samhithreddy Sangam, son of the village Sarpanch, through his startup Codebuff Digital Solutions.',
  te: 'భారతదేశపు మొట్టమొదటి పూర్తి డిజిటల్ గ్రామ పంచాయతీ — మల్లారం గ్రామం, వేములవాడ రూరల్ మండల్, రాజన్న సిరిసిల్ల, తెలంగాణ. ప్రభుత్వ పథకాలు, IKP బుకింగ్, నిధుల పారదర్శకత, వాతావరణ సమాచారం మరియు గ్రామ సౌకర్యాలు. సర్పంచ్ పుత్రుడు సామ్‌హిత్‌రెడ్డి సంగం తన స్టార్టప్ కోడ్‌బఫ్ డిజిటల్ సొల్యూషన్స్ ద్వారా డిజిటల్‌గా అభివృద్ధి.',
};

export const siteKeywords = {
  en: [
    'first digital village in India',
    'first digital gram panchayat India',
    'digital village India',
    'Mallaram first digital village',
    'Mallaram village',
    'Mallaram Gram Panchayat',
    'Vemulawada rural mandal',
    'Vemulawada village',
    'Telangana villages',
    'smart village Telangana',
    'digital gram panchayat',
    'Mallaram panchayat',
    'gram panchayat website',
    'Mallaram Vemulawada',
    'Mallaram Telangana',
    'village panchayat Telangana',
    'mallaramgramapanchayat.com',
    'Mana Ooru',
    'Digital Telangana',
    'Samhithreddy Sangam',
    'Codebuff Digital Solutions',
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
    'Rajanna Sircilla villages',
    'digitised gram panchayat',
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
