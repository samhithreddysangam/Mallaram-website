'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Locale, getDictionary } from '@/lib/i18n';
import Navigation from '@/components/Navigation/Navigation';
import Footer from '@/components/Footer/Footer';
import { motion } from 'framer-motion';
import { Upload, Check, X, Plus, Trash2, Edit, Image, CalendarDays, BookOpen, GraduationCap, Users, Clock, ExternalLink, AlertCircle } from 'lucide-react';

export default function SchoolDashboard() {
  const params = useParams();
  const locale = (params?.locale as Locale) || 'en';

  // Admissions
  const [admissions, setAdmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Achievements
  const [achievements, setAchievements] = useState<any[]>([]);
  const [showAchievementModal, setShowAchievementModal] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<string | null>(null);
  const [uploadingAchievement, setUploadingAchievement] = useState(false);
  const [achievementForm, setAchievementForm] = useState({ title: '', description: '', file: null as File | null });

  // Events
  const [schoolEvents, setSchoolEvents] = useState<any[]>([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingSchoolEvent, setEditingSchoolEvent] = useState<string | null>(null);
  const [uploadingEvent, setUploadingEvent] = useState(false);
  const [eventForm, setEventForm] = useState({ title: '', description: '', date: '', time: '', file: null as File | null });

  // Active tab
  const [activeTab, setActiveTab] = useState('overview');

  const fetchAdmissions = async () => {
    try {
      const res = await fetch('/api/school/admissions');
      const data = await res.json();
      setAdmissions(data.admissions || []);
    } catch (error) {
      console.error('Failed to fetch admissions:', error);
    }
  };

  const fetchAchievements = async () => {
    try {
      const res = await fetch('/api/school/achievements');
      const data = await res.json();
      setAchievements(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch achievements:', error);
    }
  };

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/school/events');
      const data = await res.json();
      setSchoolEvents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch school events:', error);
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      await Promise.all([fetchAdmissions(), fetchAchievements(), fetchEvents()]);
      setLoading(false);
    };
    fetchAll();
  }, []);

  // Achievement CRUD
  const handleAddAchievement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!achievementForm.title) return;
    setUploadingAchievement(true);
    try {
      const method = editingAchievement ? 'PUT' : 'POST';
      const url = editingAchievement ? `/api/school/achievements?id=${editingAchievement}` : '/api/school/achievements';

      if (achievementForm.file) {
        const formData = new FormData();
        formData.append('title', achievementForm.title);
        formData.append('description', achievementForm.description || '');
        formData.append('image', achievementForm.file);
        const res = await fetch(url, { method, body: formData });
        if (res.ok) {
          setShowAchievementModal(false);
          setAchievementForm({ title: '', description: '', file: null });
          setEditingAchievement(null);
          fetchAchievements();
        }
      } else {
        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: achievementForm.title, description: achievementForm.description }),
        });
        if (res.ok) {
          setShowAchievementModal(false);
          setAchievementForm({ title: '', description: '', file: null });
          setEditingAchievement(null);
          fetchAchievements();
        }
      }
    } catch (error) {
      console.error('Failed to save achievement:', error);
    } finally {
      setUploadingAchievement(false);
    }
  };

  const handleDeleteAchievement = async (id: string) => {
    if (!confirm('Delete this achievement?')) return;
    try {
      const res = await fetch(`/api/school/achievements?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchAchievements();
    } catch (error) {
      console.error('Failed to delete achievement:', error);
    }
  };

  const startEditAchievement = (achievement: any) => {
    setAchievementForm({
      title: achievement.title,
      description: achievement.description || '',
      file: null,
    });
    setEditingAchievement(achievement.id);
    setShowAchievementModal(true);
  };

  // Event CRUD
  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventForm.title || !eventForm.date) return;
    setUploadingEvent(true);
    try {
      const method = editingSchoolEvent ? 'PUT' : 'POST';
      const url = editingSchoolEvent ? `/api/school/events?id=${editingSchoolEvent}` : '/api/school/events';

      if (eventForm.file) {
        const formData = new FormData();
        formData.append('title', eventForm.title);
        formData.append('description', eventForm.description || '');
        formData.append('date', eventForm.date);
        formData.append('time', eventForm.time || '');
        formData.append('image', eventForm.file);
        const res = await fetch(url, { method, body: formData });
        if (res.ok) {
          setShowEventModal(false);
          setEventForm({ title: '', description: '', date: '', time: '', file: null });
          setEditingSchoolEvent(null);
          fetchEvents();
        }
      } else {
        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: eventForm.title, description: eventForm.description, date: eventForm.date, time: eventForm.time }),
        });
        if (res.ok) {
          setShowEventModal(false);
          setEventForm({ title: '', description: '', date: '', time: '', file: null });
          setEditingSchoolEvent(null);
          fetchEvents();
        }
      }
    } catch (error) {
      console.error('Failed to save event:', error);
    } finally {
      setUploadingEvent(false);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm('Delete this event?')) return;
    try {
      const res = await fetch(`/api/school/events?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchEvents();
    } catch (error) {
      console.error('Failed to delete event:', error);
    }
  };

  const startEditEvent = (event: any) => {
    setEventForm({
      title: event.title,
      description: event.description || '',
      date: event.date || '',
      time: event.time || '',
      file: null,
    });
    setEditingSchoolEvent(event.id);
    setShowEventModal(true);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'admissions', label: 'Admissions', icon: '📋' },
    { id: 'achievements', label: 'Achievements', icon: '🏆' },
    { id: 'events', label: 'Events', icon: '🎉' },
  ];

  const getStatusBadge = (status: string) => {
    if (status === 'APPROVED') return { color: 'bg-green-100 text-green-600', dot: 'bg-green-500' };
    if (status === 'REJECTED') return { color: 'bg-red-100 text-red-600', dot: 'bg-red-500' };
    return { color: 'bg-amber-100 text-amber-600', dot: 'bg-amber-500' };
  };

  return (
    <main className="min-h-screen bg-[#FAF9F6]">
      <Navigation locale={locale} />

      <div className="pt-32 pb-20 max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-[#0A0A0A] tracking-tighter">MPPS Mallaram</h1>
              <p className="text-sm font-bold text-gray-400">School Management Dashboard</p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <motion.div whileHover={{ y: -5 }} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <Users className="w-5 h-5 text-blue-500" />
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Admissions</div>
            </div>
            <div className="text-4xl font-black text-[#0A0A0A]">{admissions.length}</div>
            <div className="text-[10px] text-gray-500 font-bold mt-2">Applications received so far</div>
          </motion.div>
          <motion.div whileHover={{ y: -5 }} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <BookOpen className="w-5 h-5 text-amber-500" />
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Achievements</div>
            </div>
            <div className="text-4xl font-black text-[#0A0A0A]">{achievements.length}</div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[10px] font-bold text-amber-500">{achievements.filter(a => a.status === 'PENDING').length} pending</span>
              <span className="text-[10px] font-bold text-green-500">{achievements.filter(a => a.status === 'APPROVED').length} approved</span>
            </div>
          </motion.div>
          <motion.div whileHover={{ y: -5 }} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <CalendarDays className="w-5 h-5 text-purple-500" />
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Upcoming Events</div>
            </div>
            <div className="text-4xl font-black text-[#0A0A0A]">{schoolEvents.length}</div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[10px] font-bold text-amber-500">{schoolEvents.filter(e => e.status === 'PENDING').length} pending</span>
              <span className="text-[10px] font-bold text-green-500">{schoolEvents.filter(e => e.status === 'APPROVED').length} approved</span>
            </div>
          </motion.div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 border-b border-gray-100">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-8 mb-8">
              <h3 className="text-xl font-black text-[#0A0A0A] mb-4 tracking-tighter">Welcome to MPPS Mallaram Dashboard</h3>
              <p className="text-gray-500 font-medium mb-8">Manage school admissions, achievements, and events. All submissions require admin approval before appearing on the public website.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-6 rounded-2xl bg-blue-50 border border-blue-100">
                  <div className="text-2xl font-black text-blue-600 mb-2">{admissions.length}</div>
                  <div className="text-xs font-bold text-gray-500">Admissions Received</div>
                  <button onClick={() => setActiveTab('admissions')} className="mt-3 text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">
                    View Details →
                  </button>
                </div>
                <div className="p-6 rounded-2xl bg-amber-50 border border-amber-100">
                  <div className="text-2xl font-black text-amber-600 mb-2">{achievements.filter(a => a.status === 'PENDING').length}</div>
                  <div className="text-xs font-bold text-gray-500">Pending Approval — Achievements</div>
                  <button onClick={() => setActiveTab('achievements')} className="mt-3 text-[10px] font-black text-amber-600 uppercase tracking-widest hover:underline">
                    Manage →
                  </button>
                </div>
                <div className="p-6 rounded-2xl bg-purple-50 border border-purple-100">
                  <div className="text-2xl font-black text-purple-600 mb-2">{schoolEvents.filter(e => e.status === 'PENDING').length}</div>
                  <div className="text-xs font-bold text-gray-500">Pending Approval — Events</div>
                  <button onClick={() => setActiveTab('events')} className="mt-3 text-[10px] font-black text-purple-600 uppercase tracking-widest hover:underline">
                    Manage →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Admissions Tab */}
        {activeTab === 'admissions' && (
          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-black text-[#0A0A0A] tracking-tighter">Student Admissions</h3>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Applications from (Anganwadi to 5th Class)</p>
              </div>
              <div className="px-4 py-2 bg-blue-50 rounded-xl">
                <span className="text-xl font-black text-blue-600">{admissions.length}</span>
                <span className="text-xs font-bold text-gray-500 ml-1">Total</span>
              </div>
            </div>

            {admissions.length === 0 ? (
              <div className="text-center py-16 text-gray-300 font-bold italic">No applications received yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-blue-50/50 text-[10px] text-gray-400 font-black uppercase tracking-widest">
                      <th className="px-6 py-4">Student Name</th>
                      <th className="px-6 py-4">Class</th>
                      <th className="px-6 py-4">Parent</th>
                      <th className="px-6 py-4">Phone</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {admissions.map((admission: any) => (
                      <tr key={admission.id} className="hover:bg-blue-50/20 transition-colors">
                        <td className="px-6 py-4 font-bold text-[#0A0A0A]">{admission.studentName}</td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-[10px] font-bold">{admission.classApplying}</span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-600">{admission.parentName}</td>
                        <td className="px-6 py-4 text-xs text-gray-500">{admission.phone}</td>
                        <td className="px-6 py-4 text-xs text-gray-500">{new Date(admission.submittedAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-green-100 text-green-600`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            {admission.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Achievements Tab */}
        {activeTab === 'achievements' && (
          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h3 className="text-2xl font-black text-[#0A0A0A] tracking-tighter">School Achievements</h3>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Submit achievements — requires admin approval</p>
              </div>
              <button
                onClick={() => {
                  setEditingAchievement(null);
                  setAchievementForm({ title: '', description: '', file: null });
                  setShowAchievementModal(true);
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2 shadow-xl shadow-blue-600/20"
              >
                <Plus className="w-4 h-4" />
                Add Achievement
              </button>
            </div>

            {achievements.length === 0 ? (
              <div className="text-center py-16 text-gray-300 font-bold italic">No achievements submitted yet.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {achievements.map((achievement) => {
                  const badge = getStatusBadge(achievement.status);
                  return (
                    <div key={achievement.id} className="p-6 rounded-3xl bg-gray-50 border border-gray-100 hover:border-blue-200 transition-all group">
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-14 h-14 rounded-2xl overflow-hidden bg-white">
                          {achievement.imageUrl ? (
                            <img src={achievement.imageUrl} alt={achievement.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                              <Image className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${badge.color}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                            {achievement.status}
                          </span>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {achievement.status !== 'APPROVED' && (
                              <button onClick={() => startEditAchievement(achievement)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button onClick={() => handleDeleteAchievement(achievement.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <h4 className="font-black text-[#0A0A0A] mb-2">{achievement.title}</h4>
                      <p className="text-xs text-gray-500 font-medium line-clamp-3">{achievement.description || 'No description'}</p>
                      <div className="mt-4 text-[10px] font-bold text-gray-400">
                        Submitted: {new Date(achievement.submittedAt).toLocaleDateString()}
                      </div>
                      {achievement.rejectionReason && achievement.status === 'REJECTED' && (
                        <div className="mt-3 p-3 bg-red-50 rounded-xl text-[10px] text-red-600 font-bold">
                          Reason: {achievement.rejectionReason}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h3 className="text-2xl font-black text-[#0A0A0A] tracking-tighter">School Events</h3>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Submit upcoming events — requires admin approval</p>
              </div>
              <button
                onClick={() => {
                  setEditingSchoolEvent(null);
                  setEventForm({ title: '', description: '', date: '', time: '', file: null });
                  setShowEventModal(true);
                }}
                className="px-6 py-3 bg-purple-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2 shadow-xl shadow-purple-600/20"
              >
                <Plus className="w-4 h-4" />
                Add Event
              </button>
            </div>

            {schoolEvents.length === 0 ? (
              <div className="text-center py-16 text-gray-300 font-bold italic">No events submitted yet.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {schoolEvents.map((event) => {
                  const badge = getStatusBadge(event.status);
                  return (
                    <div key={event.id} className="p-6 rounded-3xl bg-gray-50 border border-gray-100 hover:border-purple-200 transition-all group">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-14 rounded-2xl overflow-hidden bg-white">
                            {event.imageUrl ? (
                              <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-300">
                                <CalendarDays className="w-5 h-5" />
                              </div>
                            )}
                          </div>
                          <div>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${badge.color}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                              {event.status}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {event.status !== 'APPROVED' && (
                            <button onClick={() => startEditEvent(event)} className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all">
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button onClick={() => handleDeleteEvent(event.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <h4 className="font-black text-[#0A0A0A] mb-1">{event.title}</h4>
                      <div className="flex items-center gap-3 text-xs text-gray-400 font-bold mb-2">
                        <span>📅 {event.date}</span>
                        {event.time && <span>⏰ {event.time}</span>}
                      </div>
                      <p className="text-xs text-gray-500 font-medium line-clamp-2">{event.description || 'No description'}</p>
                      {event.rejectionReason && event.status === 'REJECTED' && (
                        <div className="mt-3 p-3 bg-red-50 rounded-xl text-[10px] text-red-600 font-bold">
                          Reason: {event.rejectionReason}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Achievement Modal */}
        {showAchievementModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-[2.5rem] p-8 max-w-lg w-full mx-4 shadow-2xl">
              <h3 className="text-xl font-black text-[#0A0A0A] mb-6">{editingAchievement ? 'Edit Achievement' : 'New Achievement'}</h3>
              <form onSubmit={handleAddAchievement} className="space-y-5">
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Title *</label>
                  <input type="text" value={achievementForm.title} onChange={(e) => setAchievementForm({ ...achievementForm, title: e.target.value })}
                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-bold" required />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Description</label>
                  <textarea value={achievementForm.description} onChange={(e) => setAchievementForm({ ...achievementForm, description: e.target.value })}
                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-bold min-h-[100px]" rows={3} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Image</label>
                  <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => setAchievementForm({ ...achievementForm, file: e.target.files?.[0] || null })}
                    className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={uploadingAchievement}
                    className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest hover:scale-[1.02] transition-all shadow-xl shadow-blue-600/20 disabled:opacity-50">
                    {uploadingAchievement ? 'Uploading...' : editingAchievement ? 'Save Changes' : 'Submit for Approval'}
                  </button>
                  <button type="button" onClick={() => setShowAchievementModal(false)}
                    className="px-6 py-4 bg-gray-100 text-gray-600 rounded-2xl font-black uppercase tracking-widest hover:bg-gray-200 transition-all">
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Event Modal */}
        {showEventModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-[2.5rem] p-8 max-w-lg w-full mx-4 shadow-2xl">
              <h3 className="text-xl font-black text-[#0A0A0A] mb-6">{editingSchoolEvent ? 'Edit Event' : 'New Event'}</h3>
              <form onSubmit={handleAddEvent} className="space-y-5">
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Title *</label>
                  <input type="text" value={eventForm.title} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 font-bold" required />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Date *</label>
                  <input type="text" value={eventForm.date} onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                    placeholder="e.g., July 15, 2025"
                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 font-bold" required />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Time</label>
                  <input type="text" value={eventForm.time} onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                    placeholder="e.g., 10:00 AM"
                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 font-bold" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Description</label>
                  <textarea value={eventForm.description} onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 font-bold min-h-[100px]" rows={3} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Image</label>
                  <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => setEventForm({ ...eventForm, file: e.target.files?.[0] || null })}
                    className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={uploadingEvent}
                    className="flex-1 py-4 bg-purple-600 text-white rounded-2xl font-black uppercase tracking-widest hover:scale-[1.02] transition-all shadow-xl shadow-purple-600/20 disabled:opacity-50">
                    {uploadingEvent ? 'Uploading...' : editingSchoolEvent ? 'Save Changes' : 'Submit for Approval'}
                  </button>
                  <button type="button" onClick={() => setShowEventModal(false)}
                    className="px-6 py-4 bg-gray-100 text-gray-600 rounded-2xl font-black uppercase tracking-widest hover:bg-gray-200 transition-all">
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>

      <Footer locale={locale} />
    </main>
  );
}
