'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, User, Phone, Fingerprint, CheckCircle, Search, ArrowLeft } from 'lucide-react';
import { Locale, getDictionary } from '@/lib/i18n';

interface Slot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  capacity: number;
  currentBookings: number;
  location: string;
}

interface BookingSystemProps {
  locale: Locale;
}

export default function BookingSystem({ locale }: BookingSystemProps) {
  const dictionary = getDictionary(locale);
  const { ikp } = dictionary;

  const [view, setView] = useState<'book' | 'check' | 'success'>('book');
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'processing' | 'error'>('idle');

  // Check Status State
  const [searchPhone, setSearchPhone] = useState('');
  const [searchResult, setSearchResult] = useState<any[] | null>(null);
  const [searching, setSearching] = useState(false);

  const fetchSlots = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/slots');
      const data = await res.json();
      setSlots(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch slots:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot || !name || !phone) return;
    
    setBookingStatus('processing');
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, aadhaar, slotId: selectedSlot }),
      });
      if (res.ok) {
        setView('success');
      } else {
        setBookingStatus('error');
      }
    } catch (error) {
      setBookingStatus('error');
    } finally {
      setBookingStatus('idle');
    }
  };

  const handleCheckStatus = async () => {
    if (!searchPhone) return;
    setSearching(true);
    try {
      const res = await fetch(`/api/bookings?phone=${searchPhone}`);
      const data = await res.json();
      setSearchResult(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to check status');
    } finally {
      setSearching(false);
    }
  };

  if (loading) return <div className="p-8 text-center animate-pulse text-earth">Loading...</div>;

  return (
    <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-primary/5">
      {/* Header Tabs */}
      <div className="flex bg-gray-50 border-b border-gray-100">
        <button 
          onClick={() => { setView('book'); setSearchResult(null); }}
          className={`flex-1 py-5 font-black uppercase tracking-widest text-xs transition-all ${view === 'book' || view === 'success' ? 'bg-white text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-earth'}`}
        >
          {ikp.bookNew}
        </button>
        <button 
          onClick={() => setView('check')}
          className={`flex-1 py-5 font-black uppercase tracking-widest text-xs transition-all ${view === 'check' ? 'bg-white text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-earth'}`}
        >
          {ikp.checkStatus}
        </button>
      </div>

      <div className="p-6 md:p-10">
        <AnimatePresence mode="wait">
          {view === 'book' && (
            <motion.form 
              key="book"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleBooking}
              className="space-y-8"
            >
              {/* Farmer Details */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center gap-2 text-xs font-black text-primary uppercase tracking-widest mb-3 px-1">
                    <User className="w-4 h-4" />
                    {ikp.name}
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-xs font-black text-primary uppercase tracking-widest mb-3 px-1">
                    <Phone className="w-4 h-4" />
                    {ikp.phone}
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                    placeholder="99891 XXXXX"
                  />
                </div>
              </div>

              {/* Slot Selection */}
              <div>
                <label className="flex items-center gap-2 text-xs font-black text-primary uppercase tracking-widest mb-4 px-1">
                  <Calendar className="w-4 h-4" />
                  Select Submission Slot
                </label>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {slots.map((slot) => {
                    const isFull = slot.currentBookings >= slot.capacity;
                    const isSelected = selectedSlot === slot.id;
                    const date = new Date(slot.date).toLocaleDateString(locale === 'te' ? 'te-IN' : 'en-IN', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                    });

                    return (
                      <button
                        key={slot.id}
                        type="button"
                        disabled={isFull}
                        onClick={() => setSelectedSlot(slot.id)}
                        className={`relative p-4 rounded-2xl border-2 text-left transition-all ${
                          isSelected 
                            ? 'border-primary bg-primary/5 ring-4 ring-primary/10' 
                            : isFull 
                              ? 'border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed' 
                              : 'border-gray-50 hover:border-primary/30 hover:bg-cream-light'
                        }`}
                      >
                        <div className="font-bold text-primary-dark mb-1">{date}</div>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-earth mb-2 uppercase tracking-tighter">
                          <Clock className="w-3 h-3" />
                          {slot.startTime} - {slot.endTime}
                        </div>
                        <div className={`text-[10px] font-black uppercase ${isFull ? 'text-red-500' : 'text-green-600'}`}>
                          {isFull ? 'Full' : `${slot.capacity - slot.currentBookings} slots left`}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                disabled={!selectedSlot || bookingStatus === 'processing'}
                className={`w-full py-5 rounded-full font-black uppercase tracking-widest transition-all ${
                  selectedSlot 
                    ? 'bg-primary text-white hover:bg-earth shadow-xl shadow-primary/20 active:scale-95' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                {bookingStatus === 'processing' ? 'Processing...' : ikp.confirm}
              </button>
            </motion.form>
          )}

          {view === 'check' && (
            <motion.div 
              key="check"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-8"
            >
              <div className="flex gap-3">
                <input
                  type="tel"
                  value={searchPhone}
                  onChange={(e) => setSearchPhone(e.target.value)}
                  className="flex-grow px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                  placeholder="Enter your phone number"
                />
                <button
                  onClick={handleCheckStatus}
                  disabled={searching}
                  className="px-8 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest shadow-lg hover:bg-earth transition-all"
                >
                  <Search className="w-6 h-6" />
                </button>
              </div>

              {searchResult && (
                <div className="space-y-4">
                  {searchResult.length > 0 ? (
                    searchResult.map((booking: any) => (
                      <div key={booking.id} className="p-6 bg-cream-light rounded-3xl border border-primary/10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4">
                          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            booking.status === 'APPROVED' ? 'bg-green-500 text-white' : 'bg-amber-500 text-white'
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                        <div className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-4">
                          {ikp.statusFound}
                        </div>
                        <h4 className="text-2xl font-black text-primary-dark mb-1">{booking.user.name}</h4>
                        <div className="flex flex-wrap gap-6 mt-4">
                          <div>
                            <div className="text-[10px] font-bold text-earth uppercase mb-1">Date</div>
                            <div className="font-bold">{new Date(booking.slot.date).toLocaleDateString()}</div>
                          </div>
                          <div>
                            <div className="text-[10px] font-bold text-earth uppercase mb-1">Time</div>
                            <div className="font-bold">{booking.slot.startTime}</div>
                          </div>
                          <div>
                            <div className="text-[10px] font-bold text-earth uppercase mb-1">QR Reference</div>
                            <div className="font-bold text-primary">{booking.qrCode}</div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                      <p className="text-earth font-bold">{ikp.noBooking}</p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {view === 'success' && (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-10"
            >
              <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-16 h-16" />
              </div>
              <h3 className="text-3xl font-black text-primary-dark mb-4">{ikp.success}</h3>
              <p className="text-earth max-w-sm mx-auto mb-10 font-medium">
                Your submission slot has been reserved. Please bring your Aadhar card to the IKP centre at the scheduled time.
              </p>
              <button 
                onClick={() => setView('book')}
                className="inline-flex items-center gap-2 px-10 py-4 bg-primary text-white rounded-full font-black uppercase tracking-widest shadow-xl hover:bg-earth transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
                {ikp.bookNew}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
