'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Locale, getDictionary } from '@/lib/i18n';
import Navigation from '@/components/Navigation/Navigation';
import Footer from '@/components/Footer/Footer';
import { motion } from 'framer-motion';
import { Search, Database, Upload, Check, X, IndianRupee, Plus, Bell, MapPin, Calendar, Clock, Trash2, ExternalLink, Edit } from 'lucide-react';
import { WeatherWidget } from '@/components/Agriculture/AgriWidgets';

export default function AdminDashboard() {
  const params = useParams();
  const locale = (params?.locale as Locale) || 'en';
  const [bookings, setBookings] = useState<any[]>([]);
  const [marketPrices, setMarketPrices] = useState<any[]>([]);
  const [slots, setSlots] = useState<any[]>([]);
  const [schemes, setSchemes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modals
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [showSlotModal, setShowSlotModal] = useState(false);
  const [showSchemeModal, setShowSchemeModal] = useState(false);
  
  // Form States
  const [newPrice, setNewPrice] = useState({ cropName: '', price: '', unit: 'Quintal' });
  const [newSlot, setNewSlot] = useState({ 
    date: new Date().toISOString().split('T')[0], 
    startTime: '09:00', 
    endTime: '10:00', 
    capacity: '10',
    location: 'IKP Centre Mallaram'
  });
  const [newScheme, setNewScheme] = useState({ title: '', link: '', description: '' });
  const [editingScheme, setEditingScheme] = useState<string | null>(null);

  const autoExpire = async () => {
    try {
      await fetch('/api/admin/expire-bookings', { method: 'POST' });
    } catch (e) {
      console.error('Auto-expiry failed');
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/bookings');
      const data = await res.json();
      setBookings(data);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    }
  };

  const fetchMarketPrices = async () => {
    try {
      const res = await fetch('/api/market-prices');
      const data = await res.json();
      setMarketPrices(data);
    } catch (error) {
      console.error('Failed to fetch market prices:', error);
    }
  };

  const fetchSlots = async () => {
    try {
      // Fetch all slots (including potentially expired ones for management)
      const res = await fetch('/api/slots?all=true');
      const data = await res.json();
      setSlots(data);
    } catch (error) {
      console.error('Failed to fetch slots:', error);
    }
  };

  const fetchSchemes = async () => {
    try {
      const res = await fetch('/api/schemes');
      const data = await res.json();
      setSchemes(data);
    } catch (error) {
      console.error('Failed to fetch schemes:', error);
    }
  };

  const fetchData = async () => {
    // loading is true by default, so we don't need to set it here
    // unless we want to show loading on subsequent refreshes
    await Promise.all([
      fetchBookings(),
      fetchMarketPrices(),
      fetchSlots(),
      fetchSchemes()
    ]);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    autoExpire();
  }, []);

  const updateBookingStatus = async (id: string, status: string) => {
    // In a real app, this would be a PATCH/PUT request
    setBookings(bookings.map(b => b.id === id ? { ...b, status } : b));
    alert(`Status updated to ${status}`);
  };

  const handleAddPrice = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/market-prices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPrice),
      });
      if (res.ok) {
        setShowPriceModal(false);
        setNewPrice({ cropName: '', price: '', unit: 'Quintal' });
        fetchMarketPrices();
      }
    } catch (error) {
      console.error('Failed to add price:', error);
    }
  };

  const handleAddSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/slots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSlot),
      });
      if (res.ok) {
        setShowSlotModal(false);
        fetchSlots();
      }
    } catch (error) {
      console.error('Failed to add slot:', error);
    }
  };

  const handleAddScheme = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingScheme ? 'PUT' : 'POST';
      const body = editingScheme ? { id: editingScheme, ...newScheme } : newScheme;
      
      const res = await fetch('/api/schemes', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setShowSchemeModal(false);
        setNewScheme({ title: '', link: '', description: '' });
        setEditingScheme(null);
        fetchSchemes();
      }
    } catch (error) {
      console.error('Failed to save scheme:', error);
    }
  };

  const handleDeleteScheme = async (id: string) => {
    if (!confirm('Are you sure you want to delete this scheme?')) return;
    try {
      const res = await fetch(`/api/schemes?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchSchemes();
    } catch (error) {
      console.error('Failed to delete scheme:', error);
    }
  };

  const startEditScheme = (scheme: any) => {
    setNewScheme({ title: scheme.title, link: scheme.link, description: scheme.description || '' });
    setEditingScheme(scheme.id);
    setShowSchemeModal(true);
  };

  const handleDeleteSlot = async (id: string) => {
    if (!confirm('Are you sure you want to delete this slot? Existing bookings may be affected.')) return;
    try {
      const res = await fetch(`/api/slots?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchSlots();
    } catch (error) {
      console.error('Failed to delete slot:', error);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 font-sans">
      <Navigation locale={locale} />
      
      <div className="pt-48 lg:pt-60 max-w-7xl mx-auto px-4 pb-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-black text-[#0A0A0A] tracking-tighter">Admin Control Center</h1>
            <p className="text-gray-500 font-medium">Manage village agricultural operations & infrastructure</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => setShowSlotModal(true)}
              className="px-6 py-3 bg-[#0A0A0A] text-white rounded-2xl text-sm font-bold hover:bg-black transition-all flex items-center gap-2 shadow-xl shadow-black/10"
            >
              <Calendar className="w-4 h-4" />
              Create Slot
            </button>
            <button 
              onClick={() => {
                setEditingScheme(null);
                setNewScheme({ title: '', link: '', description: '' });
                setShowSchemeModal(true);
              }}
              className="px-6 py-3 bg-[#0A0A0A] text-[#22FF88] rounded-2xl text-sm font-bold hover:scale-105 transition-all flex items-center gap-2 shadow-xl shadow-black/10 border border-[#22FF88]/20"
            >
              <ExternalLink className="w-4 h-4" />
              Add Scheme
            </button>
            <button 
              onClick={() => setShowPriceModal(true)}
              className="px-6 py-3 bg-[#22FF88] text-[#0A0A0A] rounded-2xl text-sm font-bold hover:bg-[#1DE97B] transition-all flex items-center gap-2 shadow-xl shadow-[#22FF88]/20"
            >
              <IndianRupee className="w-4 h-4" />
              Update Prices
            </button>
          </div>
        </div>

        {/* Top Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <motion.div whileHover={{ y: -5 }} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Bookings</div>
            <div className="text-4xl font-black text-[#0A0A0A]">{bookings.length}</div>
            <div className="flex items-center gap-1 text-[10px] text-[#22FF88] font-black mt-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22FF88]"></span>
              Active System
            </div>
          </motion.div>
          <motion.div whileHover={{ y: -5 }} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Pending Approval</div>
            <div className="text-4xl font-black text-amber-500">{bookings.filter(b => b.status === 'PENDING').length}</div>
            <div className="text-[10px] text-amber-600 font-bold mt-2">Action Required</div>
          </motion.div>
          <motion.div whileHover={{ y: -5 }} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Location Status</div>
            <div className="text-xl font-black text-[#0A0A0A] flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#22FF88]" />
              IKP Centre
            </div>
            <div className="text-[10px] text-gray-500 font-bold mt-2">Mallaram Village DCF</div>
          </motion.div>
          <motion.div whileHover={{ y: -5 }} className="bg-[#0A0A0A] p-6 rounded-[2rem] shadow-xl text-white relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-[#22FF88]/10 rounded-full blur-2xl group-hover:bg-[#22FF88]/20 transition-all"></div>
            <div className="text-[10px] font-black uppercase mb-1 opacity-50">Quick Alert</div>
            <div className="text-xl font-black mb-4">Emergency Broadcast</div>
            <a href="https://voice.sendgun.in/login.php" target="_blank" className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#22FF88] text-[#0A0A0A] rounded-xl text-xs font-black uppercase tracking-tighter hover:scale-105 transition-all">
              <Bell className="w-4 h-4" />
              Launch Voice Alert
            </a>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Market Prices Section */}
          <div className="lg:col-span-2">
            <div className="bg-white h-full rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
              <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                <h2 className="text-2xl font-black text-[#0A0A0A] tracking-tighter flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#22FF88]/10 flex items-center justify-center text-[#22FF88]">
                    <IndianRupee className="w-6 h-6" />
                  </div>
                  Market Prices
                </h2>
                <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Rajanna Sircilla Dist.</div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50/50 text-[10px] text-gray-400 font-black uppercase tracking-widest">
                      <th className="px-8 py-5">Crop Name</th>
                      <th className="px-8 py-5">Price / Quintal</th>
                      <th className="px-8 py-5">Last Updated</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {marketPrices.length === 0 ? (
                      <tr><td colSpan={3} className="px-8 py-12 text-center text-gray-300 font-bold italic">No pricing data synced.</td></tr>
                    ) : marketPrices.map((price) => (
                      <tr key={price.id} className="hover:bg-gray-50/30 transition-colors group">
                        <td className="px-8 py-5 font-black text-[#0A0A0A]">{price.cropName}</td>
                        <td className="px-8 py-5">
                          <span className="px-4 py-2 bg-green-50 text-green-600 rounded-xl font-black text-lg">
                            ₹{price.price.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-xs font-bold text-gray-400">{new Date(price.date).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Weather Section */}
          <div className="lg:col-span-1">
            <div className="bg-white h-full rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-8">
              <h3 className="text-xl font-black text-[#0A0A0A] mb-6 flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-[#22FF88] animate-pulse"></div>
                Live Weather
              </h3>
              <WeatherWidget />
              <div className="mt-8 p-6 bg-[#0A0A0A] rounded-3xl text-white">
                <div className="text-[10px] font-black uppercase text-[#22FF88] mb-1">Advisory</div>
                <p className="text-xs font-medium text-gray-300">Optimal moisture conditions for paddy collection today.</p>
              </div>
            </div>
          </div>
        </div>

        {/* New Horizontal IKP Slots Section */}
        <div className="mb-12">
          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-8 overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h3 className="text-2xl font-black text-[#0A0A0A] tracking-tighter">IKP Logistics Center</h3>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Collection Windows</p>
              </div>
              <button 
                onClick={() => setShowSlotModal(true)}
                className="px-6 py-3 bg-[#0A0A0A] text-[#22FF88] rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add New Window
              </button>
            </div>

            <div className="flex gap-6 overflow-x-auto pb-6 custom-scrollbar snap-x">
              {slots.length === 0 ? (
                <div className="w-full text-center py-12 text-gray-300 font-bold italic">No collection windows scheduled.</div>
              ) : slots.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((slot) => {
                const isExpired = new Date(slot.date) < new Date(new Date().setHours(0,0,0,0));
                const fillPercent = Math.min(100, (slot.currentBookings / slot.capacity) * 100);
                
                return (
                  <motion.div 
                    key={slot.id} 
                    whileHover={{ y: -5 }}
                    className={`min-w-[280px] md:min-w-[320px] p-6 rounded-3xl border transition-all snap-start relative group ${
                      isExpired ? 'bg-gray-50 border-gray-100 opacity-60' : 'bg-white border-gray-100 hover:border-[#22FF88] shadow-lg shadow-gray-200/20'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-[#0A0A0A]">
                        <Calendar className="w-6 h-6" />
                      </div>
                      <div className="flex flex-col items-end">
                        {isExpired ? (
                          <span className="px-2 py-1 bg-gray-200 text-gray-500 rounded-lg text-[8px] font-black uppercase">Expired</span>
                        ) : (
                          <span className="px-2 py-1 bg-[#22FF88]/10 text-[#22FF88] rounded-lg text-[8px] font-black uppercase animate-pulse">Live Window</span>
                        )}
                        <button 
                          onClick={() => handleDeleteSlot(slot.id)}
                          className="mt-2 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="text-xl font-black text-[#0A0A0A]">
                        {new Date(slot.date).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })}
                      </div>
                      <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        {slot.startTime} — {slot.endTime}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                        <span className="text-gray-400">Capacity Status</span>
                        <span className={fillPercent >= 100 ? 'text-red-500' : 'text-[#22FF88]'}>
                          {slot.currentBookings} / {slot.capacity}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${fillPercent}%` }}
                          className={`h-full transition-all ${isExpired ? 'bg-gray-300' : fillPercent >= 90 ? 'bg-red-500' : 'bg-[#22FF88]'}`}
                        />
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-50 flex items-center gap-2 text-gray-400">
                      <MapPin className="w-4 h-4" />
                      <span className="text-[10px] font-bold uppercase">{slot.location}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Schemes Management Section */}
        <div className="mb-12">
          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h3 className="text-2xl font-black text-[#0A0A0A] tracking-tighter">Government Schemes</h3>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Manage links shown on schemes page</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {schemes.length === 0 ? (
                <div className="col-span-full text-center py-12 text-gray-300 font-bold italic">No schemes configured.</div>
              ) : schemes.map((scheme) => (
                <div key={scheme.id} className="p-6 rounded-3xl bg-gray-50 border border-gray-100 hover:border-blue-200 transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-blue-600 shadow-sm">
                      <ExternalLink className="w-5 h-5" />
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => startEditScheme(scheme)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteScheme(scheme.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <h4 className="font-black text-[#0A0A0A] mb-1 line-clamp-1">{scheme.title}</h4>
                  <p className="text-[10px] text-gray-400 font-medium mb-4 line-clamp-2">{scheme.description || 'No description provided.'}</p>
                  <a href={scheme.link} target="_blank" className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1 hover:underline">
                    View Link <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Booking Table */}
        <div className="bg-white rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          <div className="p-8 lg:p-10 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="text-3xl font-black text-[#0A0A0A] tracking-tighter flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#0A0A0A] flex items-center justify-center text-white">
                  <Search className="w-6 h-6" />
                </div>
                Booking Requests
              </h2>
              <p className="text-gray-400 text-sm font-medium mt-1">Manage paddy collection schedules for local farmers</p>
            </div>
            <div className="relative group">
              <input 
                type="text" 
                placeholder="Search by farmer name or phone..." 
                className="w-full md:w-80 pl-12 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-[1.5rem] text-sm focus:outline-none focus:ring-4 focus:ring-[#22FF88]/10 focus:border-[#22FF88] transition-all font-bold"
              />
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#22FF88] transition-colors" />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 text-[11px] text-gray-400 font-black uppercase tracking-[0.2em]">
                  <th className="px-10 py-6">Farmer Profile</th>
                  <th className="px-10 py-6">Collection Time</th>
                  <th className="px-10 py-6">Location</th>
                  <th className="px-10 py-6">Status</th>
                  <th className="px-10 py-6 text-right">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr><td colSpan={5} className="px-10 py-20 text-center text-gray-400 font-bold animate-pulse">Synchronizing Data...</td></tr>
                ) : bookings.length === 0 ? (
                  <tr><td colSpan={5} className="px-10 py-20 text-center text-gray-300 font-bold italic">No booking requests found in system.</td></tr>
                ) : bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50/50 transition-all group">
                    <td className="px-10 py-7">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center font-black text-[#0A0A0A] text-xs">
                          {booking.user?.name?.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-black text-[#0A0A0A] text-lg leading-tight">{booking.user?.name || 'Anonymous'}</div>
                          <div className="text-xs text-gray-400 font-bold tracking-widest">{booking.user?.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-7">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
                          <Clock className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm font-black text-[#0A0A0A]">{new Date(booking.slot.date).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                          <div className="text-[10px] font-bold text-gray-400 uppercase">{booking.slot.startTime} - {booking.slot.endTime}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-7">
                      <div className="text-sm font-bold text-gray-600">{booking.slot.location}</div>
                      <div className="text-[10px] font-black text-[#22FF88] uppercase mt-1">IKP Verified Centre</div>
                    </td>
                    <td className="px-10 py-7">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center w-fit gap-2 ${
                        booking.status === 'APPROVED' ? 'bg-[#22FF88]/10 text-[#22FF88]' :
                        booking.status === 'PENDING' ? 'bg-amber-100 text-amber-600' :
                        'bg-red-50 text-red-600'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          booking.status === 'APPROVED' ? 'bg-[#22FF88]' :
                          booking.status === 'PENDING' ? 'bg-amber-500' : 'bg-red-500'
                        }`}></span>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-10 py-7 text-right">
                      {booking.status === 'PENDING' ? (
                        <div className="flex justify-end gap-3">
                          <button 
                            onClick={() => updateBookingStatus(booking.id, 'APPROVED')}
                            className="w-10 h-10 bg-[#22FF88] text-[#0A0A0A] rounded-xl flex items-center justify-center hover:scale-110 transition-all shadow-lg shadow-[#22FF88]/20"
                            title="Approve Booking"
                          >
                            <Check className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => updateBookingStatus(booking.id, 'REJECTED')}
                            className="w-10 h-10 bg-white border border-gray-100 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-50 hover:border-red-100 transition-all"
                            title="Reject Booking"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      ) : (
                        <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Decision Finalized</div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Slot Creation Modal */}
        {showSlotModal && (
          <div className="fixed inset-0 bg-[#0A0A0A]/90 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[2.5rem] shadow-2xl p-10 w-full max-w-xl relative">
              <button onClick={() => setShowSlotModal(false)} className="absolute top-8 right-8 text-gray-300 hover:text-[#0A0A0A] transition-colors"><X className="w-6 h-6"/></button>
              <h3 className="text-3xl font-black text-[#0A0A0A] mb-2 tracking-tighter">Create IKP Slot</h3>
              <p className="text-gray-400 mb-8 font-medium">Add a new paddy collection window for farmers</p>
              
              <form onSubmit={handleAddSlot} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Collection Date</label>
                    <input
                      type="date"
                      value={newSlot.date}
                      onChange={(e) => setNewSlot({ ...newSlot, date: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#22FF88]/10 focus:border-[#22FF88] font-bold"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Start Time</label>
                    <input
                      type="time"
                      value={newSlot.startTime}
                      onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#22FF88]/10 focus:border-[#22FF88] font-bold"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">End Time</label>
                    <input
                      type="time"
                      value={newSlot.endTime}
                      onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#22FF88]/10 focus:border-[#22FF88] font-bold"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Farmer Capacity</label>
                    <input
                      type="number"
                      value={newSlot.capacity}
                      onChange={(e) => setNewSlot({ ...newSlot, capacity: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#22FF88]/10 focus:border-[#22FF88] font-bold"
                      placeholder="10"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Location</label>
                    <input
                      type="text"
                      value={newSlot.location}
                      onChange={(e) => setNewSlot({ ...newSlot, location: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#22FF88]/10 focus:border-[#22FF88] font-bold"
                      placeholder="IKP Centre Mallaram"
                    />
                  </div>
                </div>
                <button type="submit" className="w-full py-5 bg-[#0A0A0A] text-[#22FF88] rounded-[1.5rem] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-black/20 mt-4">
                  Deploy Collection Slot
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {/* Market Price Modal */}
        {showPriceModal && (
          <div className="fixed inset-0 bg-[#0A0A0A]/90 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[2.5rem] shadow-2xl p-10 w-full max-w-md relative">
              <button onClick={() => setShowPriceModal(false)} className="absolute top-8 right-8 text-gray-300 hover:text-[#0A0A0A] transition-colors"><X className="w-6 h-6"/></button>
              <h3 className="text-3xl font-black text-[#0A0A0A] mb-8 tracking-tighter">Update Market Pricing</h3>
              <form onSubmit={handleAddPrice} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Crop Specification</label>
                  <input
                    type="text"
                    value={newPrice.cropName}
                    onChange={(e) => setNewPrice({ ...newPrice, cropName: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#22FF88]/10 focus:border-[#22FF88] font-bold"
                    placeholder="e.g., Paddy (Grade A)"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Price Index (₹)</label>
                  <input
                    type="number"
                    value={newPrice.price}
                    onChange={(e) => setNewPrice({ ...newPrice, price: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#22FF88]/10 focus:border-[#22FF88] font-bold"
                    placeholder="2203"
                    required
                  />
                </div>
                <button type="submit" className="w-full py-5 bg-[#22FF88] text-[#0A0A0A] rounded-[1.5rem] font-black uppercase tracking-widest hover:scale-[1.02] transition-all shadow-xl shadow-[#22FF88]/20 mt-4">
                  Broadcast New Price
                </button>
              </form>
            </motion.div>
          </div>
        )}
        {/* Scheme Modal */}
        {showSchemeModal && (
          <div className="fixed inset-0 bg-[#0A0A0A]/90 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[2.5rem] shadow-2xl p-10 w-full max-w-md relative">
              <button onClick={() => setShowSchemeModal(false)} className="absolute top-8 right-8 text-gray-300 hover:text-[#0A0A0A] transition-colors"><X className="w-6 h-6"/></button>
              <h3 className="text-3xl font-black text-[#0A0A0A] mb-2 tracking-tighter">
                {editingScheme ? 'Update Scheme' : 'Add New Scheme'}
              </h3>
              <p className="text-gray-400 mb-8 font-medium">Configure government scheme link and details</p>
              
              <form onSubmit={handleAddScheme} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Scheme Title</label>
                  <input
                    type="text"
                    value={newScheme.title}
                    onChange={(e) => setNewScheme({ ...newScheme, title: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-bold"
                    placeholder="e.g., MGNREGA Portal"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Portal Link (URL)</label>
                  <input
                    type="url"
                    value={newScheme.link}
                    onChange={(e) => setNewScheme({ ...newScheme, link: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-bold"
                    placeholder="https://..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Short Description</label>
                  <textarea
                    value={newScheme.description}
                    onChange={(e) => setNewScheme({ ...newScheme, description: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-bold min-h-[100px]"
                    placeholder="What is this scheme about?"
                  />
                </div>
                <button type="submit" className="w-full py-5 bg-[#0A0A0A] text-[#22FF88] rounded-[1.5rem] font-black uppercase tracking-widest hover:scale-[1.02] transition-all shadow-xl shadow-black/20 mt-4">
                  {editingScheme ? 'Save Changes' : 'Publish Scheme'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </div>

      <Footer locale={locale} />
    </main>
  );
}
