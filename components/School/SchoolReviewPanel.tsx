'use client';

import { useState, useEffect } from 'react';
import { Check, X, ExternalLink, Image, Trophy, CalendarDays, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SchoolReviewPanel() {
  const [pendingAchievements, setPendingAchievements] = useState<any[]>([]);
  const [pendingEvents, setPendingEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchPendingItems = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/school-review');
      const data = await res.json();
      setPendingAchievements(Array.isArray(data.pendingAchievements) ? data.pendingAchievements : []);
      setPendingEvents(Array.isArray(data.pendingEvents) ? data.pendingEvents : []);
    } catch (error) {
      console.error('Failed to fetch pending school items:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingItems();
  }, []);

  const handleReview = async (type: 'achievement' | 'event', id: string, action: 'approve' | 'reject') => {
    setActionLoading(`${type}-${id}`);
    try {
      const res = await fetch(`/api/admin/school-review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, id, action }),
      });
      if (res.ok) {
        if (type === 'achievement') {
          setPendingAchievements((prev) => prev.filter((a: any) => a.id !== id));
        } else {
          setPendingEvents((prev) => prev.filter((e: any) => e.id !== id));
        }
      } else {
        const errData = await res.json().catch(() => ({ error: 'Failed' }));
        alert('Failed to review: ' + (errData.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Failed to review item:', error);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-8 h-8 border-2 border-[#15803d] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const totalPending = pendingAchievements.length + pendingEvents.length;

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-5 rounded-2xl bg-amber-50 border border-amber-100">
          <div className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">Pending Review</div>
          <div className="text-3xl font-black text-[#0A0A0A]">{totalPending}</div>
        </div>
        <div className="p-5 rounded-2xl bg-green-50 border border-green-100">
          <div className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-1">Achievements</div>
          <div className="text-3xl font-black text-[#0A0A0A]">{pendingAchievements.length}</div>
        </div>
        <div className="p-5 rounded-2xl bg-blue-50 border border-blue-100">
          <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Events</div>
          <div className="text-3xl font-black text-[#0A0A0A]">{pendingEvents.length}</div>
        </div>
      </div>

      {totalPending === 0 ? (
        <div className="text-center py-12 text-gray-300 font-bold italic bg-gray-50 rounded-2xl border border-gray-100">
          All school content has been reviewed. No pending items.
        </div>
      ) : (
        <div className="space-y-6">
          {/* Pending Achievements */}
          {pendingAchievements.length > 0 && (
            <div>
              <h4 className="text-sm font-black text-[#0A0A0A] uppercase tracking-widest mb-4 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" />
                Pending Achievements
              </h4>
              <div className="space-y-3">
                {pendingAchievements.map((ach: any) => (
                  <motion.div
                    key={ach.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 rounded-2xl bg-white border border-gray-100 hover:border-amber-200 transition-all shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {ach.imageUrl ? (
                            <img src={ach.imageUrl} alt={ach.title} className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
                              <Trophy className="w-5 h-5 text-amber-500" />
                            </div>
                          )}
                          <div>
                            <h5 className="font-black text-sm text-[#0A0A0A] line-clamp-1">{ach.title}</h5>
                            <span className="text-[9px] text-gray-400 font-bold uppercase">
                              {ach.achievementDate ? new Date(ach.achievementDate).toLocaleDateString() : 'No date'}
                            </span>
                          </div>
                        </div>
                        {ach.description && (
                          <p className="text-xs text-gray-500 mt-2 ml-[52px] line-clamp-2">{ach.description}</p>
                        )}
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleReview('achievement', ach.id, 'approve')}
                          disabled={actionLoading === `achievement-${ach.id}`}
                          className="p-2.5 bg-green-100 text-green-600 rounded-xl hover:bg-green-200 transition-all disabled:opacity-50"
                          title="Approve"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleReview('achievement', ach.id, 'reject')}
                          disabled={actionLoading === `achievement-${ach.id}`}
                          className="p-2.5 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-all disabled:opacity-50"
                          title="Reject"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Pending Events */}
          {pendingEvents.length > 0 && (
            <div>
              <h4 className="text-sm font-black text-[#0A0A0A] uppercase tracking-widest mb-4 flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-blue-500" />
                Pending Events
              </h4>
              <div className="space-y-3">
                {pendingEvents.map((evt: any) => (
                  <motion.div
                    key={evt.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 rounded-2xl bg-white border border-gray-100 hover:border-blue-200 transition-all shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {evt.imageUrl ? (
                            <img src={evt.imageUrl} alt={evt.title} className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                              <CalendarDays className="w-5 h-5 text-blue-500" />
                            </div>
                          )}
                          <div>
                            <h5 className="font-black text-sm text-[#0A0A0A] line-clamp-1">{evt.title}</h5>
                            <span className="text-[9px] text-gray-400 font-bold uppercase flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {evt.eventDate ? new Date(evt.eventDate).toLocaleDateString() : 'No date'}
                            </span>
                          </div>
                        </div>
                        {evt.description && (
                          <p className="text-xs text-gray-500 mt-2 ml-[52px] line-clamp-2">{evt.description}</p>
                        )}
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleReview('event', evt.id, 'approve')}
                          disabled={actionLoading === `event-${evt.id}`}
                          className="p-2.5 bg-green-100 text-green-600 rounded-xl hover:bg-green-200 transition-all disabled:opacity-50"
                          title="Approve"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleReview('event', evt.id, 'reject')}
                          disabled={actionLoading === `event-${evt.id}`}
                          className="p-2.5 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-all disabled:opacity-50"
                          title="Reject"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
