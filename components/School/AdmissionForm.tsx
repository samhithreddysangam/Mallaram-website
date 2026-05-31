'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Locale, getDictionary, getTranslations } from '@/lib/i18n';
import { GraduationCap, CheckCircle, Send, User, Phone, MapPin, BookOpen } from 'lucide-react';

interface AdmissionFormProps {
  locale: Locale;
}

export default function AdmissionForm({ locale }: AdmissionFormProps) {
  const [formData, setFormData] = useState({
    studentName: '',
    classApplying: '',
    parentName: '',
    phone: '',
    address: '',
    previousSchool: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const classes = ['Anganwadi', '1st Class', '2nd Class', '3rd Class', '4th Class', '5th Class'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/school/admissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSubmitted(true);
        setFormData({ studentName: '', classApplying: '', parentName: '', phone: '', address: '', previousSchool: '' });
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to submit. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-8 md:p-12 bg-white rounded-[3rem] border border-green-100 shadow-xl text-center"
      >
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h3 className="text-2xl font-black text-[#0A0A0A] mb-2">Application Submitted!</h3>
        <p className="text-gray-500 font-medium mb-6">We will contact you at {formData.phone} for further steps.</p>
        <button
          onClick={() => setSubmitted(false)}
          className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-blue-600/20"
        >
          Submit Another
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      id="admissions"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="p-8 md:p-10 bg-white rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-200/50"
    >
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
          <GraduationCap className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-xl font-black text-[#0A0A0A] tracking-tighter">Apply for Admission</h3>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">MPPS Mallaram — Anganwadi to 5th Class</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl">
          <p className="text-xs font-bold text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Student Name *</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
              <input type="text" value={formData.studentName} onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-bold" required />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Class Applying For *</label>
            <div className="relative">
              <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
              <select value={formData.classApplying} onChange={(e) => setFormData({ ...formData, classApplying: e.target.value })}
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-bold appearance-none" required>
                <option value="">Select Class</option>
                {classes.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Parent Name *</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
              <input type="text" value={formData.parentName} onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-bold" required />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Phone Number *</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
              <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-bold" required />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Address</label>
          <div className="relative">
            <MapPin className="absolute left-4 top-4 w-4 h-4 text-gray-300" />
            <textarea value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-bold min-h-[80px]" rows={2} />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Previous School (if any)</label>
          <input type="text" value={formData.previousSchool} onChange={(e) => setFormData({ ...formData, previousSchool: e.target.value })}
            className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-bold" />
        </div>

        <button type="submit" disabled={loading}
          className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest hover:scale-[1.02] transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3 disabled:opacity-50">
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <><Send className="w-4 h-4" /> Submit Application</>
          )}
        </button>
      </form>
    </motion.div>
  );
}
