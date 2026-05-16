export type Locale = 'en' | 'te';

export type Dictionary = {
  common: { appName: string; tagline: string; subtitle: string };
  nav: { home: string; about: string; dashboard: string; schemes: string; facilities: string; gallery: string; events: string; contact: string; complaint: string; governance: string };
  hero: { title: string; tagline: string; subtitle: string; cta: string };
  ikp: {
    title: string;
    subtitle: string;
    name: string;
    phone: string;
    aadhaar: string;
    checkStatus: string;
    bookNew: string;
    statusFound: string;
    noBooking: string;
    confirm: string;
    success: string;
  };
about: { 
    title: string; 
    tagline: string;
    description: string;
    leadership: string;
    sarpanch: string;
    vision: string;
    features: {
      funds: { title: string; desc: string };
      schemes: { title: string; desc: string };
      ikb: { title: string; desc: string };
      updates: { title: string; desc: string };
    };
    footer: string;
  };
  comingSoon: {
    title: string;
    description: string;
    backHome: string;
  };
  facilities: { title: string; schools: string; healthcare: string; roads: string; water: string; electricity: string };
  alerts: {
    livePulse: string;
    description: string;
    realTimeWeather: string;
    forecast: string;
    humidity: string;
    wind: string;
    villageSafe: string;
    emergencyNotifications: string;
    stayNotified: string;
    subscribeDesc: string;
    whatsappCta: string;
  };
  emergency: {
    title: string;
    available: string;
    services: string;
    callNow: string;
  };
  gallery: { title: string };
  events: { title: string; festivals: string; localEvents: string };
  complaint: { title: string; description: string; cta: string };
  contact: { title: string; panchayat: string; phone: string; address: string };
  auth: {
    login: string;
    register: string;
    email: string;
    password: string;
    signIn: string;
    noAccount: string;
    alreadyAccount: string;
    error: string;
  };
  footer: { copyright: string };
  language: { toggle: string };
  privacy: {
    title: string;
    introduction: string;
    sections: { title: string; content: string }[];
  };
  terms: {
    title: string;
    introduction: string;
    sections: { title: string; content: string }[];
  };
};

// Supported locales
export const locales: Locale[] = ['en', 'te'];
export const defaultLocale: Locale = 'en';

// English dictionary (default)
const enDict: Dictionary = {
  common: { appName: "Mallaram Village", tagline: "Mana Ooru", subtitle: "Smart village rooted in nature" },
  nav: { home: "Home", about: "About", dashboard: "IKP Booking", schemes: "Govt Schemes", facilities: "Facilities", gallery: "Gallery", events: "Events", contact: "Contact", complaint: "Complaint", governance: "Smart Village" },
  hero: { title: "Mallaram", tagline: "Mana Ooru", subtitle: "Smart village rooted in nature", cta: "Submit Complaint" },
  ikp: {
    title: "IKP Centre Booking",
    subtitle: "Book your slot for paddy submission",
    name: "Full Name",
    phone: "Phone Number",
    aadhaar: "Aadhar Number (Last 4 digits)",
    checkStatus: "Check Booking Status",
    bookNew: "New Booking",
    statusFound: "Booking Found",
    noBooking: "No booking found for this number",
    confirm: "Book Slot",
    success: "Slot Booked Successfully!",
  },
  about: {
    title: "About Our Village",
    tagline: "One Vision, Digital Telangana",
    description: "Under the leadership of Revanth Reddy, our village has taken a crucial step towards transparent and accountable governance through Digital Telangana's 'One Vision'.",
    leadership: "Leadership of Revanth Reddy",
    sarpanch: "Led by Sarpanch Sangam Arpitha",
    vision: "Our goal is simple: a village where services are predictable, systems are transparent, and people are empowered.",
    features: {
      funds: {
        title: "Full Fund Transparency",
        desc: "Every rupee received and spent by the village is clearly visible to the public. No hidden policies."
      },
      schemes: {
        title: "Direct Access to Schemes",
        desc: "People can directly learn about, apply for, and track government schemes without any middlemen."
      },
      ikb: {
        title: "Service Booking System",
        desc: "Book your time for village services easily — no long waits, no confusion."
      },
      updates: {
        title: "Real-time Updates",
        desc: "Stay informed about village development works, decisions, and progress in real-time."
      }
    },
    footer: "This website helps our village run smoothly, openly, and with responsibility."
  },
  comingSoon: {
    title: "Coming Soon",
    description: "We are currently working hard to bring you the full details of all government schemes. Please check back soon!",
    backHome: "Back to Home"
  },
  facilities: { title: "Facilities", schools: "Schools", healthcare: "Healthcare", roads: "Roads", water: "Water", electricity: "Electricity" },
  alerts: {
    livePulse: "Weather & Alerts",
    description: "Today's weather, weekly forecast, and important safety alerts for our farming community.",
    realTimeWeather: "Real-time Weather",
    forecast: "Live 7-Day Forecast",
    humidity: "Humidity",
    wind: "Wind",
    villageSafe: "Village Safe",
    emergencyNotifications: "Emergency Notifications",
    stayNotified: "Stay Notified",
    subscribeDesc: "Get real-time alerts via WhatsApp & SMS",
    whatsappCta: "Get Alerts on WhatsApp"
  },
  emergency: {
    title: "Emergency Help",
    available: "Help Available 24 Hours",
    services: "Police / Fire / Medical",
    callNow: "Call Now"
  },
  gallery: { title: "Gallery" },
  events: { title: "Events", festivals: "Festivals", localEvents: "Local Events" },
  complaint: { title: "Have a Complaint?", description: "We value your feedback. Help us improve by submitting your complaints or suggestions.", cta: "Submit Complaint / suggestion" },
  contact: { title: "Contact Us", panchayat: "Panchayat Office", phone: "Phone", address: "Address" },
  auth: {
    login: "Login",
    register: "Register",
    email: "Email Address",
    password: "Password",
    signIn: "Sign In",
    noAccount: "Don't have an account?",
    alreadyAccount: "Already have an account?",
    error: "Invalid email or password",
  },
  footer: { copyright: "© 2026 Mallaram Village. All rights reserved." },
  language: { toggle: "తెలుగు" },
  privacy: {
    title: "Privacy Policy",
    introduction: "This Privacy Policy explains how the Mallaram Gram Panchayat collects, uses, and protects your personal information when you use our village portal.",
    sections: [
      {
        title: "Information We Collect",
        content: "We collect basic information such as your name, phone number, and the last 4 digits of your Aadhaar card when you use services like the IKP Slot Booking system. This is required for verification and service delivery."
      },
      {
        title: "How We Use Your Data",
        content: "Your data is used solely for providing village services, verifying identities for government schemes, and maintaining the Transparency Portal. We do not sell or share your data with private third parties."
      },
      {
        title: "Data Security",
        content: "In line with Digital Telangana policies and the Digital Personal Data Protection (DPDP) Act of India, we use secure servers and encryption to protect your personal information."
      },
      {
        title: "Governing Authority",
        content: "This portal is managed by the Gram Panchayat Mallaram under the IT guidelines of the Government of Telangana."
      }
    ]
  },
  terms: {
    title: "Terms of Service",
    introduction: "By using the Mallaram Village Portal, you agree to the following terms and conditions designed to ensure fair and transparent service for all residents.",
    sections: [
      {
        title: "User Responsibility",
        content: "Users must provide accurate and truthful information when applying for schemes or booking IKP slots. Providing false information may lead to cancellation of services."
      },
      {
        title: "Service Availability",
        content: "While we strive for 100% uptime, some digital services may be temporarily unavailable during maintenance. The physical records at the Panchayat Office remain the final authority."
      },
      {
        title: "Governing Law",
        content: "These terms are governed by the laws of the State of Telangana and the Republic of India. Any disputes will be subject to the jurisdiction of the courts in Telangana."
      }
    ]
  }
};
// Telugu dictionary
const teDict: Dictionary = {
  common: { appName: "మల్లారం గ్రామం", tagline: "మనా ఊరు", subtitle: "స్మార్ట్ విలేజ్" },
  nav: { home: "హోమ్", about: "పాలన", dashboard: "IKP బుకింగ్", schemes: "పథకాలు", facilities: "సౌకర్యాలు", gallery: "ఫోటోలు", events: "కార్యక్రమాలు", contact: "సంప్రదింపు", complaint: "ఫిర్యాదు", governance: "స్మార్ట్ విలేజ్" },
  hero: { title: "మల్లారం", tagline: "మనా ఊరు", subtitle: "స్మార్ట్ విలేజ్", cta: "ఫిర్యాదు" },
  ikp: {
    title: "IKP సెంటర్ బుకింగ్",
    subtitle: "వరి ధాన్యం సేకరణ కోసం మీ స్లాట్‌ను బుక్ చేసుకోండి",
    name: "పూర్తి పేరు",
    phone: "ఫోన్ నంబర్",
    aadhaar: "ఆధార్ నంబర్ (చివరి 4 అంకెలు)",
    checkStatus: "బుకింగ్ స్థితిని తనిఖీ చేయండి",
    bookNew: "కొత్త బుకింగ్",
    statusFound: "బుకింగ్ కనుగొనబడింది",
    noBooking: "ఈ నంబర్‌కు ఎటువంటి బుకింగ్ కనుగొనబడలేదు",
    confirm: "స్లాట్ బుక్ చేయండి",
    success: "స్లాట్ విజయవంతంగా బుక్ చేయబడింది!",
  },
about: { 
    title: "మా గ్రామం గురించి",
    tagline: "డిజిటల్ తెలంగాణ “వన్ విజన్”",
    description: "Revanth Reddy నాయకత్వంలో, డిజిటల్ తెలంగాణ “వన్ విజన్” దిశగా మా గ్రామం పారదర్శకమైన మరియు బాధ్యతాయుతమైన పాలన వైపు ఒక కీలక అడుగు వేసింది.",
    leadership: "రేవంత్ రెడ్డి నాయకత్వంలో",
    sarpanch: "సర్పంచ్ సంగం అర్పిత నాయకత్వంలో",
    vision: "మా లక్ష్యం సులభం: సేవలు ముందుగా అంచనా వేసుకునే విధంగా, వ్యవస్థలు పారదర్శకంగా, ప్రజలు శక్తివంతంగా ఉండే గ్రామం.",
    features: {
      funds: {
        title: "నిధుల పూర్తి పారదర్శకత",
        desc: "గ్రామానికి వచ్చే ప్రతి రూపాయి, ఖర్చయ్యే ప్రతి రూపాయి ప్రజలకు స్పష్టంగా కనిపిస్తుంది. ఎటువంటి దాచిపెట్టే విధానం లేదు."
      },
      schemes: {
        title: "ప్రభుత్వ పథకాలపై నేరుగా ప్రాప్తి",
        desc: "ప్రజలు స్వయంగా పథకాలను తెలుసుకొని, దరఖాస్తు చేసుకొని, వాటి స్థితిని ట్రాక్ చేసుకోవచ్చు — మధ్యవర్తులు అవసరం లేదు."
      },
      ikb: {
        title: "సేవల బుకింగ్ విధానం",
        desc: "గ్రామ సేవలను సులభంగా, ఎటువంటి గందరగోళం లేకుండా పొందడానికి మీ సమయాన్ని ఇక్కడే బుక్ చేసుకోండి."
      },
      updates: {
        title: "రియల్-టైమ్ అప్డేట్స్",
        desc: "గ్రామ అభివృద్ధి పనులు, నిర్ణయాలు, పురోగతి — అన్నీ ప్రజలకు అందుబాటులో ఉంటాయి."
      }
    },
    footer: "ఈ వెబ్సైట్ మా గ్రామం సులభంగా, పారదర్శకంగా మరియు బాధ్యతాయుతంగా నడవడానికి సహాయపడుతుంది."
  },
  comingSoon: {
    title: "త్వరలో వస్తుంది",
    description: "మేము ప్రస్తుతం అన్ని ప్రభుత్వ పథకాల పూర్తి వివరాలను మీకు అందించడానికి కృషి చేస్తున్నాము. దయచేసి త్వరలో మళ్ళీ చూడండి!",
    backHome: "తిరిగి హోమ్ పేజీకి"
  },
  facilities: { title: "సౌకర్యాలు", schools: "పాఠశాలలు", healthcare: "వైద్యం", roads: "రోడ్లు", water: "మంచినీరు", electricity: "విద్యుత్" },
  alerts: {
    livePulse: "వాతావరణం & హెచ్చరికలు",
    description: "ఈ రోజు వాతావరణం, వారపు అంచనా మరియు మన రైతు సోదరులకు ముఖ్యమైన సూచనలు.",
    realTimeWeather: "ప్రస్తుత వాతావరణం",
    forecast: "లైవ్ 7 రోజుల వాతావరణం",
    humidity: "గాలిలో తేమ",
    wind: "గాలి వేగం",
    villageSafe: "గ్రామం సురక్షితం",
    emergencyNotifications: "అత్యవసర హెచ్చరికలు",
    stayNotified: "ఎప్పటికప్పుడు సమాచారం",
    subscribeDesc: "వాట్సాప్ మరియు SMS ద్వారా తాజా సమాచారం పొందండి",
    whatsappCta: "వాట్సాప్‌లో అలర్ట్స్ పొందండి"
  },
  emergency: {
    title: "అత్యవసర సహాయం",
    available: "24 గంటల సేవ",
    services: "పోలీస్ / ఫైర్ / మెడికల్",
    callNow: "ఇప్పుడే కాల్ చేయండి"
  },
  gallery: { title: "ఫోటోలు" },
  events: { title: "కార్యక్రమాలు", festivals: "పండుగలు", localEvents: "స్థానిక ఈవెంట్స్" },
  complaint: { title: "ఫిర్యాదు ఉందా?", description: "మీ ఫీడ్‌బ్యాక్ మాకు ముఖ్యం. మీ ఫిర్యాదులు లేదా సూచనలను సమర్పించడం ద్వారా మాకు సహాయపడండి.", cta: "ఫిర్యాదును సమర్పించండి" },
  contact: { title: "సంప్రదించండి", panchayat: "పంచాయతీ కార్యాలయం", phone: "ఫోన్", address: "చిరునామా" },
  auth: {
    login: "లాగిన్",
    register: "రిజిస్టర్",
    email: "ఈమెయిల్ చిరునామా",
    password: "పాస్‌వర్డ్",
    signIn: "సైన్ ఇన్",
    noAccount: "ఖాతా లేదా?",
    alreadyAccount: "ఇప్పటికే ఖాతా ఉందా?",
    error: "చెల్లని ఈమెయిల్ లేదా పాస్‌వర్డ్",
  },
  footer: { copyright: "© 2026 మల్లారం గ్రామం. అన్ని హక్కులు ప్రత్యేకించబడ్డాయి." },
  language: { toggle: "EN" },
  privacy: {
    title: "గోప్యతా విధానం (Privacy Policy)",
    introduction: "మీరు మా గ్రామ పోర్టల్‌ను ఉపయోగించినప్పుడు మల్లారం గ్రామ పంచాయితీ మీ వ్యక్తిగత సమాచారాన్ని ఎలా సేకరిస్తుంది, ఉపయోగిస్తుంది మరియు రక్షిస్తుంది అనేది ఈ విధానం వివరిస్తుంది.",
    sections: [
      {
        title: "మేము సేకరించే సమాచారం",
        content: "మీరు IKP స్లాట్ బుకింగ్ వంటి సేవలను ఉపయోగించినప్పుడు మీ పేరు, ఫోన్ నంబర్ మరియు మీ ఆధార్ కార్డ్ చివరి 4 అంకెలు వంటి ప్రాథమిక సమాచారాన్ని మేము సేకరిస్తాము. ఇది ధృవీకరణ కోసం అవసరం."
      },
      {
        title: "మేము డేటాను ఎలా ఉపయోగిస్తాము",
        content: "మీ డేటా కేవలం గ్రామ సేవలను అందించడానికి, ప్రభుత్వ పథకాల కోసం గుర్తింపును ధృవీకరించడానికి మరియు పారదర్శకత పోర్టల్‌ను నిర్వహించడానికి మాత్రమే ఉపయోగించబడుతుంది."
      },
      {
        title: "డేటా భద్రత",
        content: "డిజిటల్ తెలంగాణ విధానాలు మరియు భారత ప్రభుత్వ డిజిటల్ వ్యక్తిగత డేటా రక్షణ (DPDP) చట్టం ప్రకారం, మీ సమాచారాన్ని రక్షించడానికి మేము సురక్షితమైన సర్వర్లను ఉపయోగిస్తాము."
      },
      {
        title: "నిర్వహణ సంస్థ",
        content: "ఈ పోర్టల్ తెలంగాణ ప్రభుత్వ ఐటి మార్గదర్శకాల ప్రకారం మల్లారం గ్రామ పంచాయతీ ద్వారా నిర్వహించబడుతుంది."
      }
    ]
  },
  terms: {
    title: "నిబంధనలు మరియు షరతులు (Terms of Service)",
    introduction: "మల్లారం గ్రామ పోర్టల్‌ను ఉపయోగించడం ద్వారా, నివాసితులందరికీ పారదర్శకమైన సేవలను అందించడానికి రూపొందించబడిన ఈ క్రింది నిబంధనలకు మీరు అంగీకరిస్తున్నారు.",
    sections: [
      {
        title: "వినియోగదారు బాధ్యత",
        content: "పథకాల కోసం దరఖాస్తు చేసినప్పుడు లేదా IKP స్లాట్‌లను బుక్ చేసినప్పుడు వినియోగదారులు ఖచ్చితమైన మరియు నిజమైన సమాచారాన్ని అందించాలి."
      },
      {
        title: "సేవల అందుబాటు",
        content: "డిజిటల్ సేవలు కొన్నిసార్లు నిర్వహణ సమయంలో అందుబాటులో ఉండకపోవచ్చు. అటువంటి సమయంలో పంచాయితీ కార్యాలయంలోని భౌతిక రికార్డులే తుది నిర్ణయంగా పరిగణించబడతాయి."
      },
      {
        title: "పాలక చట్టం",
        content: "ఈ నిబంధనలు తెలంగాణ రాష్ట్ర మరియు భారత ప్రభుత్వ చట్టాల ద్వారా నిర్వహించబడతాయి. ఏవైనా వివాదాలు తెలంగాణలోని కోర్టుల పరిధికి లోబడి ఉంటాయి."
      }
    ]
  }
};

// Dictionary map
export const dictionaries: Record<Locale, Dictionary> = {
  en: enDict,
  te: teDict
};

// Get dictionary by locale
export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] || dictionaries.en;
}

// Get translation function
export function getTranslations(dictionary: Dictionary) {
  return (key: string): string => {
    const keys = key.split('.');
    let value: any = dictionary;
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return key;
      }
    }
    
    return typeof value === 'string' ? value : key;
  };
}