'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Locale } from '@/lib/i18n';
import { 
  Leaf, CheckCircle2, AlertTriangle, Phone, MapPin, 
  Globe, Wheat, Droplets, Shield, ArrowRight, ChevronRight,
  Cloud, Sun, Wind, CloudRain, Sparkles
} from 'lucide-react';

interface FarmerEnrollmentProps {
  locale: Locale;
}

export default function FarmerEnrollment({ locale }: FarmerEnrollmentProps) {
  const t = (en: string, te: string) => locale === 'te' ? te : en;

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    village: 'Mallaram',
    ward: '',
    landArea: '',
    crops: '',
    soilType: '',
    language: locale,
    consentAlerts: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);

    try {
      const res = await fetch('/api/farmers/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok) {
        setResult({ success: true, message: data.message });
        setFormData({
          name: '',
          phone: '',
          village: 'Mallaram',
          ward: '',
          landArea: '',
          crops: '',
          soilType: '',
          language: locale,
          consentAlerts: true,
        });
      } else {
        setResult({ success: false, message: data.error || 'Something went wrong.' });
      }
    } catch (err) {
      setResult({ success: false, message: 'Failed to submit. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const cropOptions = [
    { value: 'paddy', labelEn: 'Paddy (Rice)', labelTe: 'వరి' },
    { value: 'cotton', labelEn: 'Cotton', labelTe: 'పత్తి' },
    { value: 'maize', labelEn: 'Maize', labelTe: 'మొక్కజొన్న' },
    { value: 'chilli', labelEn: 'Chilli', labelTe: 'మిరప' },
    { value: 'sugarcane', labelEn: 'Sugarcane', labelTe: 'చెరకు' },
    { value: 'groundnut', labelEn: 'Groundnut', labelTe: 'వేరుశనగ' },
    { value: 'pulses', labelEn: 'Pulses', labelTe: 'పప్పు ధాన్యాలు' },
    { value: 'vegetables', labelEn: 'Vegetables', labelTe: 'కూరగాయలు' },
  ];

  return (
    <section id="farmer-enrollment" className="py-24 bg-gradient-to-b from-[#FAF9F6] to-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-[#15803d]/5 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-blue-500/5 blur-[100px] rounded-full translate-x-1/2 translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left: Info Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#15803d]/10 text-[#15803d] text-[10px] font-black uppercase tracking-[0.2em] mb-8 border border-[#15803d]/20">
              <Leaf className="w-3.5 h-3.5" />
              {t('Farmer Registration', 'రైతు నమోదు')}
            </span>

            <h2 className="text-5xl md:text-7xl font-black text-[#0A0A0A] tracking-tighter uppercase leading-[0.9] mb-8">
              {t('Get', 'వాతావరణ')}{' '}
              <span className="text-[#15803d]">
                {t('Weather Alerts', 'హెచ్చరికలు')}
              </span>
              <br />
              {t('Directly on Your Phone', 'నేరుగా మీ ఫోన్‌కు')}
            </h2>

            <p className="text-lg text-gray-600 font-medium leading-relaxed mb-10">
              {t(
                'Register your details to receive instant weather alerts customized for your farm. Our AI system analyzes weather patterns and notifies you when conditions affect your crops.',
                'మీ పొలానికి తగిన వాతావరణ హెచ్చరికలను తక్షణమే పొందడానికి మీ వివరాలను నమోదు చేయండి. మా AI వ్యవస్థ వాతావరణ నమూనాలను విశ్లేషించి, మీ పంటలను ప్రభావితం చేసే పరిస్థితుల గురించి మీకు తెలియజేస్తుంది.'
              )}
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {[
                { icon: CloudRain, color: 'text-blue-500', bg: 'bg-blue-50', labelEn: 'Rain Alerts', labelTe: 'వర్ష హెచ్చరికలు', descEn: 'Get notified before heavy rain', descTe: 'భారీ వర్షానికి ముందే సమాచారం' },
                { icon: Sun, color: 'text-amber-500', bg: 'bg-amber-50', labelEn: 'Heat Warnings', labelTe: 'వేడి హెచ్చరికలు', descEn: 'Protect crops from heatwaves', descTe: 'వేడి నుండి పంటలను రక్షించండి' },
                { icon: Wind, color: 'text-sky-500', bg: 'bg-sky-50', labelEn: 'Wind Advisory', labelTe: 'గాలి సూచనలు', descEn: 'Secure farms before strong winds', descTe: 'గాలులకు ముందే జాగ్రత్తలు' },
                { icon: Wheat, color: 'text-[#15803d]', bg: 'bg-green-50', labelEn: 'Crop-Specific', labelTe: 'పంటల ఆధారితం', descEn: 'Alerts based on your crops', descTe: 'మీ పంటల ఆధారంగా హెచ్చరికలు' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-5 rounded-2xl bg-white border border-gray-100 flex items-start gap-4 hover:shadow-md transition-all group"
                >
                  <div className={`p-3 rounded-xl ${item.bg} ${item.color} group-hover:scale-110 transition-transform`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-black text-[#0A0A0A] text-sm">{t(item.labelEn, item.labelTe)}</h4>
                    <p className="text-xs text-gray-500 font-medium">{t(item.descEn, item.descTe)}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 px-6 py-5 rounded-3xl bg-[#0A0A0A] text-white">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full bg-[#15803d]/30 border-2 border-[#0A0A0A] flex items-center justify-center text-xs font-black">
                    {String(i).charAt(0)}
                  </div>
                ))}
              </div>
              <p className="text-sm font-bold leading-snug">
                {t(
                  'Free service for Mallaram farmers. No spam, only critical alerts.',
                  'మల్లారం రైతులకు ఉచిత సేవ. కేవలం అవసరమైన హెచ్చరికలు మాత్రమే.'
                )}
              </p>
            </div>
          </motion.div>

          {/* Right: Enrollment Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="bg-white p-8 md:p-12 rounded-[3rem] border border-gray-100 shadow-xl shadow-[#15803d]/5 relative">
              {/* Form Header */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-[#15803d] flex items-center justify-center shadow-lg">
                  <Leaf className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-[#0A0A0A] tracking-tighter">
                    {t('Enroll Now', 'ఇప్పుడే నమోదు చేయండి')}
                  </h3>
                  <p className="text-sm text-gray-500 font-medium">
                    {t('It takes less than 2 minutes', '2 నిమిషాల కంటే తక్కువ సమయం పడుతుంది')}
                  </p>
                </div>
              </div>

              {/* Success / Error Message */}
              <AnimatePresence>
                {result && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    className={`p-5 rounded-2xl mb-8 flex items-start gap-3 ${
                      result.success ? 'bg-green-50 border border-green-100' : 'bg-red-50 border border-red-100'
                    }`}
                  >
                    {result.success ? (
                      <CheckCircle2 className="w-6 h-6 text-[#15803d] flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className={`font-bold ${result.success ? 'text-[#15803d]' : 'text-red-600'}`}>
                        {result.success ? t('Success!', 'విజయం!') : t('Error', 'లోపం')}
                      </p>
                      <p className={`text-sm font-medium ${result.success ? 'text-green-700' : 'text-red-600'}`}>
                        {result.message}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Full Name */}
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                    {t('Full Name', 'పూర్తి పేరు')} *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder={t('Enter your full name', 'మీ పూర్తి పేరు నమోదు చేయండి')}
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-[#15803d]/10 focus:border-[#15803d] transition-all"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                    {t('Phone Number', 'ఫోన్ నంబర్')} *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      maxLength={10}
                      placeholder="9876543210"
                      className="w-full pl-12 pr-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-[#15803d]/10 focus:border-[#15803d] transition-all"
                    />
                  </div>
                </div>

                {/* Village & Ward Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                      {t('Village', 'గ్రామం')}
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        name="village"
                        value={formData.village}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-[#15803d]/10 focus:border-[#15803d] transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                      {t('Ward', 'వార్డ్')}
                    </label>
                    <input
                      type="text"
                      name="ward"
                      value={formData.ward}
                      onChange={handleChange}
                      placeholder={t('e.g. Ward 3', 'ఉదా: వార్డ్ 3')}
                      className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-[#15803d]/10 focus:border-[#15803d] transition-all"
                    />
                  </div>
                </div>

                {/* Land Area & Soil Type Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                      {t('Land Area', 'భూమి విస్తీర్ణం')}
                    </label>
                    <input
                      type="text"
                      name="landArea"
                      value={formData.landArea}
                      onChange={handleChange}
                      placeholder={t('e.g. 5 acres', 'ఉదా: 5 ఎకరాలు')}
                      className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-[#15803d]/10 focus:border-[#15803d] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                      {t('Soil Type', 'నేల రకం')}
                    </label>
                    <select
                      name="soilType"
                      value={formData.soilType}
                      onChange={handleChange}
                      className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-[#15803d]/10 focus:border-[#15803d] transition-all appearance-none"
                    >
                      <option value="">{t('Select...', 'ఎంచుకోండి...')}</option>
                      <option value="black">{t('Black Soil', 'నల్ల రేగడి')}</option>
                      <option value="red">{t('Red Soil', 'ఎర్ర నేల')}</option>
                      <option value="sandy">{t('Sandy Soil', 'ఇసుక నేల')}</option>
                      <option value="loamy">{t('Loamy Soil', 'లోమీ నేల')}</option>
                      <option value="clay">{t('Clay Soil', 'బంకమట్టి నేల')}</option>
                    </select>
                  </div>
                </div>

                {/* Crops */}
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                    {t('Crops You Grow', 'మీరు పండించే పంటలు')}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {cropOptions.map((crop) => {
                      const selected = formData.crops?.toLowerCase().includes(crop.value);
                      return (
                        <button
                          key={crop.value}
                          type="button"
                          onClick={() => {
                            const current = formData.crops ? formData.crops.split(', ').map(s => s.trim().toLowerCase()) : [];
                            const updated = selected
                              ? current.filter(c => c !== crop.value)
                              : [...current, crop.value];
                            setFormData(prev => ({ ...prev, crops: updated.join(', ') }));
                          }}
                          className={`px-3 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                            selected
                              ? 'bg-[#15803d] text-white shadow-md'
                              : 'bg-gray-50 text-gray-500 border border-gray-100 hover:border-[#15803d]/30'
                          }`}
                        >
                          {t(crop.labelEn, crop.labelTe)}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Language Preference */}
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                    {t('Alert Language', 'హెచ్చరిక భాష')}
                  </label>
                  <div className="flex gap-3">
                    {[
                      { value: 'te', label: 'తెలుగు' },
                      { value: 'en', label: 'English' },
                    ].map((lang) => (
                      <button
                        key={lang.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, language: lang.value }))}
                        className={`flex-1 px-5 py-4 rounded-2xl text-sm font-black transition-all ${
                          formData.language === lang.value
                            ? 'bg-[#15803d] text-white shadow-lg'
                            : 'bg-gray-50 text-gray-500 border border-gray-100 hover:border-[#15803d]/30'
                        }`}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Consent */}
                <label className="flex items-start gap-3 p-5 rounded-2xl bg-gray-50 border border-gray-100 cursor-pointer hover:bg-[#15803d]/5 transition-all">
                  <input
                    type="checkbox"
                    name="consentAlerts"
                    checked={formData.consentAlerts}
                    onChange={handleChange}
                    className="mt-0.5 w-5 h-5 rounded-lg border-gray-300 text-[#15803d] focus:ring-[#15803d]"
                  />
                  <div>
                    <span className="text-sm font-bold text-[#0A0A0A]">
                      {t('I agree to receive weather alerts', 'వాతావరణ హెచ్చరికలను స్వీకరించడానికి అంగీకరిస్తున్నాను')}
                    </span>
                    <p className="text-xs text-gray-500 font-medium mt-0.5">
                      {t(
                        'You will receive SMS/WhatsApp alerts during extreme weather events.',
                        'తీవ్రమైన వాతావరణ పరిస్థితుల్లో మీకు SMS/WhatsApp హెచ్చరికలు వస్తాయి.'
                      )}
                    </p>
                  </div>
                </label>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-5 bg-[#15803d] text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:scale-[1.02] hover:bg-[#0A0A0A] transition-all shadow-xl shadow-[#15803d]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {t('Enrolling...', 'నమోదు చేస్తోంది...')}
                    </span>
                  ) : (
                    <>
                      {t('Enroll Now — Get Alerts', 'నమోదు చేయండి — హెచ్చరికలు పొందండి')}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              <p className="text-center text-[10px] text-gray-400 font-medium mt-6">
                {t(
                  'Your data is secure and used only for weather alerts.',
                  'మీ డేటా సురక్షితం మరియు వాతావరణ హెచ్చరికల కోసం మాత్రమే ఉపయోగించబడుతుంది.'
                )}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
