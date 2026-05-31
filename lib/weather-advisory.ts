// AI-Powered Farming Advisory Engine
// Generates intelligent, contextual farming recommendations based on
// real-time weather data, agricultural seasons, and agronomy rules.

export interface WeatherData {
  temp: number;
  condition: string;
  humidity: number;
  rainChance: number;
  windSpeed?: number;
  weatherCode?: number;
}

export interface Advisory {
  id: string;
  title: string;
  titleTe: string;
  description: string;
  descriptionTe: string;
  category: 'sowing' | 'harvesting' | 'irrigation' | 'pest_control' | 'general' | 'warning' | 'fertilizer';
  urgency: 'low' | 'medium' | 'high';
  icon: string; // emoji icon
  action: string;
  actionTe: string;
}

export interface AdvisoryResponse {
  primary: Advisory;
  secondary: Advisory[];
  season: string;
  seasonTe: string;
  crop: string;
  cropTe: string;
}

// Detect Telangana agricultural season
export function getSeason(): { season: string; seasonTe: string; crop: string; cropTe: string } {
  const month = new Date().getMonth(); // 0-11

  // Kharif (Monsoon crops): June - October
  if (month >= 5 && month <= 9) {
    return {
      season: 'Kharif (Monsoon)',
      seasonTe: 'ఖరీఫ్ (వర్షాకాలం)',
      crop: 'Paddy, Cotton, Maize',
      cropTe: 'వరి, పత్తి, మొక్కజొన్న'
    };
  }
  // Rabi (Winter crops): October - March
  if (month >= 9 || month <= 2) {
    return {
      season: 'Rabi (Winter)',
      seasonTe: 'రబీ (శీతాకాలం)',
      crop: 'Wheat, Gram, Mustard',
      cropTe: 'గోధుమ, శనగ, ఆవాలు'
    };
  }
  // Zaid (Summer crops): March - June
  return {
    season: 'Zaid (Summer)',
    seasonTe: 'జైద్ (వేసవి)',
    crop: 'Watermelon, Cucumber, Fodder',
    cropTe: 'పుచ్చకాయ, దోసకాయ, మేత'
  };
}

// Core advisory generation logic
function generateAdvisories(weather: WeatherData, seasonInfo: { season: string; seasonTe: string; crop: string; cropTe: string }): { primary: Advisory; secondary: Advisory[] } {
  const { temp, humidity, rainChance, condition, windSpeed = 0 } = weather;
  const advisories: Advisory[] = [];
  const isRaining = condition === 'Rainy' || condition === 'Thunderstorm' || condition === 'Showers' || condition === 'Drizzle';
  const isVeryHot = temp > 42;
  const isHot = temp > 38;
  const isHumid = humidity > 75;
  const isDry = humidity < 30;
  const isWindy = windSpeed > 30;
  const isVeryWindy = windSpeed > 45;
  const rainLikely = rainChance > 50;
  const rainVeryLikely = rainChance > 75;

  // --- PRIMARY ADVISORY ---
  if (isVeryHot && isDry) {
    advisories.push({
      id: 'heatwave',
      title: '⚠️ Extreme Heat — Avoid Field Work',
      titleTe: '⚠️ అత్యంత వేడి — పొలం పనులు మానుకోండి',
      description: `Temperature of ${temp}°C with very low humidity. Risk of heatstroke is high. Postpone all outdoor farming activities until evening (after 5 PM). Ensure livestock has shade and plenty of water.`,
      descriptionTe: `${temp}°C ఉష్ణోగ్రత, చాలా తక్కువ తేమ. వడదెబ్బ ప్రమాదం ఎక్కువ. సాయంత్రం 5 గంటల వరకు బయట వ్యవసాయ పనులను వాయిదా వేయండి. పశువులకు నీడ మరియు తగినంత నీరు అందించండి.`,
      category: 'warning', urgency: 'high', icon: '🌡️',
      action: 'Stay Hydrated, Stay Indoors',
      actionTe: 'నీరు తాగండి, ఇంట్లో ఉండండి'
    });
  } else if (rainVeryLikely || (isRaining && rainLikely)) {
    advisories.push({
      id: 'heavy-rain',
      title: '🌧️ Heavy Rain Expected — Secure Crops',
      titleTe: '🌧️ భారీ వర్షం అంచనా — పంటలను భద్రపరచండి',
      description: `${rainChance}% chance of rain. If you have harvested crops drying in the open, cover them immediately. Avoid applying fertilizers or pesticides today — rain will wash them away. Check drainage in low-lying fields.`,
      descriptionTe: `${rainChance}% వర్షం అవకాశం. బయట ఎండబెడుతున్న పంటలను వెంటనే కప్పండి. ఈ రోజు ఎరువులు లేదా పురుగుమందులు వేయవద్దు — వర్షంలో కొట్టుకుపోతాయి. పల్లపు పొలాల్లో నీటి ఎద్దడిని తనిఖీ చేయండి.`,
      category: 'warning', urgency: 'high', icon: '🌧️',
      action: 'Cover Crops & Check Drains',
      actionTe: 'పంటలను కప్పండి, కాలువలు తనిఖీ చేయండి'
    });
  } else if (isVeryWindy) {
    advisories.push({
      id: 'strong-wind',
      title: '💨 Strong Winds Warning',
      titleTe: '💨 బలమైన గాలులు — జాగ్రత్త',
      description: `Wind speeds of ${windSpeed} km/h detected. Secure thatched roofs, shade nets, and polyhouse covers. Avoid spraying pesticides in windy conditions — drift will waste chemicals. Delay any planned stubble burning.`,
      descriptionTe: `${windSpeed} km/h గాలి వేగం నమోదైంది. గడ్డి కప్పులు, షేడ్ నెట్లు, పాలీహౌస్ కవర్లను భద్రపరచండి. గాలిలో పురుగుమందులు పిచికారీ చేయవద్దు — రసాయనాలు వృథా అవుతాయి.`,
      category: 'warning', urgency: 'high', icon: '💨',
      action: 'Secure Structures',
      actionTe: 'నిర్మాణాలను భద్రపరచండి'
    });
  } else if (temp >= 22 && temp <= 35 && humidity >= 50 && humidity <= 80 && rainChance >= 30 && rainChance <= 70 && !isWindy) {
    advisories.push({
      id: 'optimal-sowing',
      title: '🌱 Optimal Conditions for Sowing',
      titleTe: '🌱 విత్తనాలు వేయడానికి అనువైన పరిస్థితులు',
      description: `Current temperature ${temp}°C and humidity ${humidity}% create ideal conditions for sowing. ${rainChance}% rain chance provides good moisture for germination. Recommended crops for current ${seasonInfo.season} season: ${seasonInfo.crop}.`,
      descriptionTe: `ప్రస్తుత ఉష్ణోగ్రత ${temp}°C మరియు తేమ ${humidity}% విత్తనాలు వేయడానికి అనువుగా ఉన్నాయి. ${rainChance}% వర్షం అవకాశం మొలకెత్తడానికి మంచి తేమను అందిస్తుంది. ప్రస్తుత ${seasonInfo.seasonTe} సీజన్‌కు సిఫార్సు చేసే పంటలు: ${seasonInfo.cropTe}.`,
      category: 'sowing', urgency: 'medium', icon: '🌱',
      action: 'Start Sowing Today',
      actionTe: 'ఈ రోజు విత్తనాలు వేయండి'
    });
  } else if (isDry && temp >= 28 && temp <= 40 && !isRaining && !rainLikely && !isWindy) {
    advisories.push({
      id: 'good-harvest',
      title: '☀️ Good Day for Harvesting',
      titleTe: '☀️ కోతకు అనువైన రోజు',
      description: `Dry weather with ${temp}°C temperature. Low rain chance (${rainChance}%) — perfect for harvesting and threshing. Harvested grain can be safely sun-dried. Start early morning to avoid afternoon heat.`,
      descriptionTe: `${temp}°C ఉష్ణోగ్రతతో పొడి వాతావరణం. వర్షం అవకాశం ${rainChance}% — కోత మరియు నూర్పిడికి అనువైనది. కోసిన ధాన్యాన్ని ఎండలో సురక్షితంగా ఆరబెట్టవచ్చు. మధ్యాహ్నం వేడిని నివారించడానికి ఉదయాన్నే ప్రారంభించండి.`,
      category: 'harvesting', urgency: 'medium', icon: '☀️',
      action: 'Harvest & Sun-Dry',
      actionTe: 'కోత వేయండి & ఎండబెట్టండి'
    });
  } else if (isDry && temp > 32 && humidity < 40 && !rainLikely) {
    advisories.push({
      id: 'irrigation-needed',
      title: '💧 Irrigation Required — Soil Drying',
      titleTe: '💧 నీటి తడి అవసరం — నేల ఎండిపోతోంది',
      description: `Low humidity (${humidity}%) and high temperature (${temp}°C) with only ${rainChance}% rain chance. Soil moisture is evaporating quickly. Irivate paddy fields to 5cm standing water. For vegetable crops, use drip irrigation in the evening to reduce evaporation.`,
      descriptionTe: `తక్కువ తేమ (${humidity}%) మరియు అధిక ఉష్ణోగ్రత (${temp}°C), కేవలం ${rainChance}% వర్షం అవకాశం. నేల తేమ వేగంగా ఆవిరైపోతోంది. వరి పొలాలకు 5cm నీరు నిలబెట్టండి. కూరగాయల పంటలకు సాయంత్రం డ్రిప్ ఇరిగేషన్ ఉపయోగించండి.`,
      category: 'irrigation', urgency: 'medium', icon: '💧',
      action: 'Irrigate Fields Today',
      actionTe: 'పొలాలకు నీరు పెట్టండి'
    });
  } else if (humidity >= 40 && humidity <= 70 && temp >= 20 && temp <= 35 && !rainLikely && !isRaining && !isWindy) {
    advisories.push({
      id: 'fertilizer-optimal',
      title: '🧪 Ideal for Fertilizer Application',
      titleTe: '🧪 ఎరువులు వేయడానికి అనువైన సమయం',
      description: `Current conditions (${temp}°C, ${humidity}% humidity) are ideal for fertilizer application. No significant rain expected (${rainChance}%) — nutrients will stay in soil. Apply basal dose for Kharif crops. Consider split application for better nitrogen efficiency.`,
      descriptionTe: `ప్రస్తుత పరిస్థితులు (${temp}°C, ${humidity}% తేమ) ఎరువులు వేయడానికి అనువుగా ఉన్నాయి. వర్షం అవకాశం ${rainChance}% — పోషకాలు నేలలో ఉంటాయి. ఖరీఫ్ పంటలకు బేసల్ డోస్ వేయండి. మెరుగైన నత్రజని సామర్థ్యం కోసం విడతల వారీగా వేయండి.`,
      category: 'fertilizer', urgency: 'low', icon: '🧪',
      action: 'Apply Fertilizer',
      actionTe: 'ఎరువులు వేయండి'
    });
  } else if (isHumid && temp > 28 && !isRaining && !rainLikely) {
    advisories.push({
      id: 'pest-risk',
      title: '🐛 Pest Risk: Humidity + Warmth',
      titleTe: '🐛 తెగుళ్ల ప్రమాదం: తేమ + వెచ్చదనం',
      description: `High humidity (${humidity}%) combined with warm temperature (${temp}°C) creates favorable conditions for fungal diseases and pest infestation. Monitor paddy for blast disease and cotton for bollworms. Consider prophylactic fungicide spray if needed.`,
      descriptionTe: `అధిక తేమ (${humidity}%) మరియు వెచ్చని ఉష్ణోగ్రత (${temp}°C) శిలీంధ్ర వ్యాధులు మరియు తెగుళ్ల బెడదకు అనుకూల పరిస్థితులు సృష్టిస్తాయి. వరిలో బ్లాస్ట్ వ్యాధి మరియు పత్తిలో బోల్‌వార్మ్‌లను గమనించండి. అవసరమైతే ముందస్తు ఫంగిసైడ్ పిచికారీ చేయండి.`,
      category: 'pest_control', urgency: 'medium', icon: '🐛',
      action: 'Inspect Crops Today',
      actionTe: 'పంటలను తనిఖీ చేయండి'
    });
  } else if (temp >= 25 && temp <= 35 && humidity >= 40 && humidity <= 70 && !isRaining && !rainLikely) {
    advisories.push({
      id: 'good-conditions',
      title: '✅ Favorable Weather for All Farm Work',
      titleTe: '✅ అన్ని వ్యవసాయ పనులకు అనుకూల వాతావరణం',
      description: `Mild conditions with ${temp}°C and ${humidity}% humidity. No rain expected (${rainChance}% chance). Good day for weeding, inter-culture operations, and field preparation for the next crop.`,
      descriptionTe: `${temp}°C మరియు ${humidity}% తేమతో సౌమ్య పరిస్థితులు. వర్షం అంచనా లేదు (${rainChance}% అవకాశం). కలుపు తీయడం, ఇంటర్-కల్చర్ మరియు తదుపరి పంటకు పొలం సిద్ధం చేయడానికి మంచి రోజు.`,
      category: 'general', urgency: 'low', icon: '✅',
      action: 'Good for Field Work',
      actionTe: 'పొలం పనులకు అనుకూలం'
    });
  } else {
    advisories.push({
      id: 'general-advisory',
      title: '📋 Daily Farm Advisory',
      titleTe: '📋 రోజువారీ వ్యవసాయ సలహా',
      description: `Current conditions: ${temp}°C, ${humidity}% humidity, ${rainChance}% rain chance. ${isWindy ? 'Strong winds present — delay spraying operations.' : ''} ${isHumid ? 'High humidity — monitor for pest activity.' : ''} Plan your farm work accordingly for the ${seasonInfo.season} season.`,
      descriptionTe: `ప్రస్తుత పరిస్థితులు: ${temp}°C, ${humidity}% తేమ, ${rainChance}% వర్షం అవకాశం. ${isWindy ? 'గాలులు వీస్తున్నాయి — పిచికారీ వాయిదా వేయండి.' : ''} ${isHumid ? 'అధిక తేమ — తెగుళ్ల కోసం గమనించండి.' : ''} ${seasonInfo.seasonTe} సీజన్ కోసం మీ వ్యవసాయ పనులను తదనుగుణంగా ప్లాన్ చేసుకోండి.`,
      category: 'general', urgency: 'low', icon: '📋',
      action: 'Plan Accordingly',
      actionTe: 'తదనుగుణంగా ప్రణాళిక'
    });
  }

  // SECONDARY ADVISORIES
  const secondary: Advisory[] = [];

  if (seasonInfo.season === 'Kharif (Monsoon)') {
    secondary.push({
      id: 'season-kharif',
      title: '🌾 Kharif Tip: Monitor for Pests',
      titleTe: '🌾 ఖరీఫ్ టిప్: తెగుళ్ల కోసం గమనించండి',
      description: 'Kharif season is active. Monitor paddy for stem borer and leaf folder. Set up pheromone traps at 12-15 per acre. Ensure proper drainage channels are clear before heavy rains.',
      descriptionTe: 'ఖరీఫ్ సీజన్ కొనసాగుతోంది. వరిలో కాండం తొలుచు పురుగు మరియు ఆకు ముడత కోసం గమనించండి. ఎకరాకు 12-15 ఫెరోమోన్ ట్రాప్‌లు ఏర్పాటు చేయండి. భారీ వర్షాలకు ముందు డ్రైనేజీ మార్గాలు స్పష్టంగా ఉన్నాయని నిర్ధారించుకోండి.',
      category: 'general', urgency: 'low', icon: '🌾',
      action: 'Set Pheromone Traps',
      actionTe: 'ఫెరోమోన్ ట్రాప్‌లు ఏర్పాటు చేయండి'
    });
  } else if (seasonInfo.season === 'Rabi (Winter)') {
    secondary.push({
      id: 'season-rabi',
      title: '🌾 Rabi Tip: Prepare Nursery Beds',
      titleTe: '🌾 రబీ టిప్: నర్సరీ బెడ్‌లు సిద్ధం చేయండి',
      description: 'Rabi season is here. Prepare nursery beds for Rabi crops. Apply well-decomposed FYM 2-3 weeks before sowing. Maintain proper spacing for better yield.',
      descriptionTe: 'రబీ సీజన్ వచ్చింది. రబీ పంటలకు నర్సరీ బెడ్‌లు సిద్ధం చేయండి. విత్తడానికి 2-3 వారాల ముందు బాగా కుళ్ళిన పశువుల ఎరువు వేయండి. మంచి దిగుబడి కోసం సరైన అంతరం ఉంచండి.',
      category: 'general', urgency: 'low', icon: '🌾',
      action: 'Prepare Nursery',
      actionTe: 'నర్సరీ సిద్ధం చేయండి'
    });
  } else {
    secondary.push({
      id: 'season-zaid',
      title: '☀️ Summer Tip: Mulch & Conserve Water',
      titleTe: '☀️ వేసవి టిప్: మల్చ్ & నీటి సంరక్షణ',
      description: 'Zaid/summer season. Use organic mulch (paddy straw, dried leaves) around plants to conserve soil moisture and reduce temperature by 3-5°C. Irivate during early morning or late evening to minimize evaporation loss.',
      descriptionTe: 'జైద్/వేసవి కాలం. నేల తేమను కాపాడటానికి మరియు ఉష్ణోగ్రతను 3-5°C తగ్గించడానికి మొక్కల చుట్టూ సేంద్రియ మల్చ్ (వరి గడ్డి, ఎండిన ఆకులు) ఉపయోగించండి. ఆవిరి నష్టాన్ని తగ్గించడానికి ఉదయం లేదా సాయంత్రం నీరు పెట్టండి.',
      category: 'irrigation', urgency: 'low', icon: '☀️',
      action: 'Mulch & Irivate Smart',
      actionTe: 'మల్చ్ & తెలివిగా నీరు పెట్టండి'
    });
  }

  if (isRaining && rainChance > 30) {
    secondary.push({
      id: 'post-rain',
      title: '🌦️ Post-Rain: Check for Waterlogging',
      titleTe: '🌦️ వర్షం తర్వాత: నీటి నిల్వ తనిఖీ',
      description: 'After rain, check low-lying areas for waterlogging. Paddy can tolerate standing water, but other crops need drainage within 24 hours. Look for signs of nutrient leaching in sandy soils.',
      descriptionTe: 'వర్షం తర్వాత, పల్లపు ప్రాంతాల్లో నీరు నిల్వ ఉందేమో తనిఖీ చేయండి. వరి నిల్వ నీటిని తట్టుకోగలదు, కానీ ఇతర పంటలకు 24 గంటల్లో డ్రైనేజీ అవసరం. ఇసుక నేలల్లో పోషకాలు కొట్టుకుపోయాయేమో గమనించండి.',
      category: 'general', urgency: 'low', icon: '🌦️',
      action: 'Check Low-Lying Fields',
      actionTe: 'పల్లపు పొలాలు తనిఖీ చేయండి'
    });
  } else if (temp > 35 && humidity > 60) {
    secondary.push({
      id: 'heat-humidity',
      title: '🌡️ Heat + Humidity: Livestock Care',
      titleTe: '🌡️ వేడి + తేమ: పశు సంరక్షణ',
      description: 'High heat and humidity stress livestock. Ensure cattle have access to clean drinking water at all times. Consider mist cooling in poultry sheds. Avoid transporting animals during peak heat hours (11 AM - 4 PM).',
      descriptionTe: 'అధిక వేడి మరియు తేమ పశువులకు ఒత్తిడి కలిగిస్తాయి. పశువులకు ఎల్లప్పుడూ శుభ్రమైన తాగునీరు అందుబాటులో ఉండేలా చూసుకోండి. పౌల్ట్రీ షెడ్‌లలో మిస్ట్ కూలింగ్ పరిగణించండి. వేడి సమయంలో (11 AM - 4 PM) జంతువులను రవాణా చేయడం మానుకోండి.',
      category: 'general', urgency: 'medium', icon: '🌡️',
      action: 'Protect Livestock',
      actionTe: 'పశువులను రక్షించండి'
    });
  }

  const primary = advisories[0];
  return { primary, secondary: secondary.slice(0, 3) };
}

// Main function to get AI advisory
export function getAiAdvisory(weather: WeatherData): AdvisoryResponse {
  const seasonInfo = getSeason();
  const { primary, secondary } = generateAdvisories(weather, seasonInfo);

  return {
    primary,
    secondary,
    season: seasonInfo.season,
    seasonTe: seasonInfo.seasonTe,
    crop: seasonInfo.crop,
    cropTe: seasonInfo.cropTe,
  };
}
