'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Locale } from '@/lib/i18n';
import Navigation from '@/components/Navigation/Navigation';
import Footer from '@/components/Footer/Footer';
import {
  BarChart3, Plus, Edit, Trash2, X, Search, Check, AlertTriangle,
  Upload, FileSpreadsheet, Loader2, RefreshCw, Shield, Users,
  Clock, IndianRupee, FileBarChart
} from 'lucide-react';

interface Application {
  id: string;
  applicantName: string;
  applicantPhone: string | null;
  applicantAadhaar: string | null;
  schemeId: string;
  scheme: { title: string; id: string };
  village: string;
  ward: string | null;
  status: string;
  benefitAmount: number | null;
  applicationDate: string;
  approvalDate: string | null;
  rejectionDate: string | null;
  rejectionReason: string | null;
}

interface Scheme {
  id: string;
  title: string;
  type: string;
}

export default function PrajaTrackerAdminPage() {
  const params = useParams();
  const locale = (params?.locale as Locale) || 'en';

  const [applications, setApplications] = useState<Application[]>([]);
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    applicantName: '', applicantPhone: '', applicantAadhaar: '',
    schemeId: '', village: 'Mallaram', ward: '', status: 'PENDING',
    benefitAmount: '', rejectionReason: '',
  });

  const fetchData = async () => {
    try {
      const params = new URLSearchParams({ limit: '50' });
      if (search) params.set('search', search);
      const [appRes, schemeRes] = await Promise.all([
        fetch(`/api/applications?${params}`),
        fetch('/api/schemes'),
      ]);
      const appData = await appRes.json();
      const schemeData = await schemeRes.json();
      setApplications(appData.applications || []);
      setSchemes(Array.isArray(schemeData) ? schemeData : []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);
  useEffect(() => {
    const t = setTimeout(() => fetchData(), 300);
    return () => clearTimeout(t);
  }, [search]);

  const resetForm = () => {
    setForm({
      applicantName: '', applicantPhone: '', applicantAadhaar: '',
      schemeId: '', village: 'Mallaram', ward: '', status: 'PENDING',
      benefitAmount: '', rejectionReason: '',
    });
    setEditingId(null);
  };

  const startEdit = (app: Application) => {
    setForm({
      applicantName: app.applicantName,
      applicantPhone: app.applicantPhone || '',
      applicantAadhaar: app.applicantAadhaar || '',
      schemeId: app.schemeId,
      village: app.village,
      ward: app.ward || '',
      status: app.status,
      benefitAmount: app.benefitAmount?.toString() || '',
      rejectionReason: app.rejectionReason || '',
    });
    setEditingId(app.id);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await fetch('/api/applications', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingId,
            status: form.status,
            benefitAmount: form.benefitAmount,
            rejectionReason: form.rejectionReason,
          }),
        });
      } else {
        await fetch('/api/applications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
      }
      setShowModal(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Failed to save:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this application record?')) return;
    try {
      await fetch(`/api/applications?id=${id}`, { method: 'DELETE' });
      fetchData();
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  const handleBulkReject = async () => {
    const pending = applications.filter(a => a.status === 'PENDING');
    if (pending.length === 0) return alert('No pending applications to reject.');
    if (!confirm(`Reject all ${pending.length} pending applications?`)) return;
    for (const app of pending) {
      await fetch('/api/applications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: app.id, status: 'REJECTED', rejectionReason: 'Admin bulk action' }),
      });
    }
    fetchData();
  };

  const handleBulkApprove = async () => {
    const pending = applications.filter(a => a.status === 'PENDING');
    if (pending.length === 0) return alert('No pending applications to approve.');
    if (!confirm(`Approve all ${pending.length} pending applications?`)) return;
    for (const app of pending) {
      await fetch('/api/applications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: app.id, status: 'APPROVED', benefitAmount: '5000' }),
      });
    }
    fetchData();
  };

  return (
    <main className="min-h-screen bg-gray-50 font-sans">
      <Navigation locale={locale} />
      <div className="pt-48 lg:pt-60 max-w-7xl mx-auto px-4 pb-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <BarChart3 className="w-6 h-6 text-[#15803d]" />
              <h1 className="text-3xl font-black text-[#0A0A0A] tracking-tighter">Praja Progress Tracker — Admin</h1>
            </div>
            <p className="text-gray-500 font-medium">Manage welfare applications, beneficiaries & approvals</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={handleBulkApprove}
              className="px-5 py-3 bg-[#15803d] text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2 shadow-xl shadow-[#15803d]/20">
              <Check className="w-4 h-4" /> Bulk Approve
            </button>
            <button onClick={handleBulkReject}
              className="px-5 py-3 bg-red-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2 shadow-xl shadow-red-600/20">
              <X className="w-4 h-4" /> Bulk Reject
            </button>
            <button onClick={() => { resetForm(); setShowModal(true); }}
              className="px-5 py-3 bg-[#0A0A0A] text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2 shadow-xl shadow-black/10">
              <Plus className="w-4 h-4" /> New Application
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-gray-100">
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total</div>
            <div className="text-2xl font-black text-[#0A0A0A]">{applications.length}</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-100">
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Approved</div>
            <div className="text-2xl font-black text-[#15803d]">{applications.filter(a => a.status === 'APPROVED').length}</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-100">
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Pending</div>
            <div className="text-2xl font-black text-amber-500">{applications.filter(a => a.status === 'PENDING').length}</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-100">
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Rejected</div>
            <div className="text-2xl font-black text-red-500">{applications.filter(a => a.status === 'REJECTED').length}</div>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search applications..."
            className="w-full pl-12 pr-6 py-4 bg-white border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-[#15803d]/10 focus:border-[#15803d] transition-all font-bold" />
        </div>

        {/* Table */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 text-[10px] text-gray-400 font-black uppercase tracking-widest">
                  <th className="px-6 py-5">Applicant</th>
                  <th className="px-6 py-5">Scheme</th>
                  <th className="px-6 py-5">Village</th>
                  <th className="px-6 py-5">Date</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5 text-right">Amount</th>
                  <th className="px-6 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr><td colSpan={7} className="px-6 py-16 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-300" /></td></tr>
                ) : applications.length === 0 ? (
                  <tr><td colSpan={7} className="px-6 py-16 text-center text-gray-300 font-bold italic">No applications found.</td></tr>
                ) : applications.map(app => (
                  <tr key={app.id} className="hover:bg-gray-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-bold text-sm text-[#0A0A0A]">{app.applicantName}</div>
                      {app.applicantPhone && <div className="text-[10px] text-gray-400">{app.applicantPhone}</div>}
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-gray-600">{app.scheme?.title || '—'}</td>
                    <td className="px-6 py-4 text-xs text-gray-500">{app.village}{app.ward ? ` / ${app.ward}` : ''}</td>
                    <td className="px-6 py-4 text-xs text-gray-500">{new Date(app.applicationDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        app.status === 'APPROVED' ? 'bg-green-100 text-[#15803d]' :
                        app.status === 'PENDING' ? 'bg-amber-100 text-amber-600' :
                        'bg-red-100 text-red-600'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          app.status === 'APPROVED' ? 'bg-[#15803d]' :
                          app.status === 'PENDING' ? 'bg-amber-500' : 'bg-red-500'
                        }`} />
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-black text-sm">{app.benefitAmount ? `₹${app.benefitAmount.toLocaleString('en-IN')}` : '—'}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => startEdit(app)} className="p-2 text-gray-400 hover:text-[#15803d] hover:bg-green-50 rounded-lg transition-all">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(app.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[2.5rem] shadow-2xl p-8 w-full max-w-lg relative">
              <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-gray-300 hover:text-[#0A0A0A] transition-colors">
                <X className="w-6 h-6" />
              </button>
              <h3 className="text-2xl font-black text-[#0A0A0A] mb-1 tracking-tighter">
                {editingId ? 'Update Application' : 'New Application'}
              </h3>
              <p className="text-gray-400 mb-6 text-sm font-medium">
                {editingId ? 'Change status or update details' : 'Register a new welfare application'}
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                {!editingId && (
                  <>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Name</label>
                      <input type="text" value={form.applicantName} onChange={e => setForm({...form, applicantName: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#15803d]/20 focus:border-[#15803d]" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Phone</label>
                        <input type="text" value={form.applicantPhone} onChange={e => setForm({...form, applicantPhone: e.target.value})}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#15803d]/20 focus:border-[#15803d]" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Aadhaar (last 4)</label>
                        <input type="text" maxLength={4} value={form.applicantAadhaar} onChange={e => setForm({...form, applicantAadhaar: e.target.value.replace(/\D/g, '').slice(0, 4)})}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-[#15803d]/20 focus:border-[#15803d]" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Scheme</label>
                      <select value={form.schemeId} onChange={e => setForm({...form, schemeId: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#15803d]/20 focus:border-[#15803d]" required>
                        <option value="">Select scheme...</option>
                        {schemes.filter(s => s.type === 'welfare').map(s => (
                          <option key={s.id} value={s.id}>{s.title}</option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Village</label>
                        <input type="text" value={form.village} onChange={e => setForm({...form, village: e.target.value})}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#15803d]/20 focus:border-[#15803d]" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Ward</label>
                        <input type="text" value={form.ward} onChange={e => setForm({...form, ward: e.target.value})}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#15803d]/20 focus:border-[#15803d]" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Status</label>
                      <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#15803d]/20 focus:border-[#15803d]">
                        <option value="PENDING">Pending</option>
                        <option value="APPROVED">Approved</option>
                        <option value="REJECTED">Rejected</option>
                      </select>
                    </div>
                  </>
                )}
                {editingId && (
                  <>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="text-xs font-bold text-gray-500">Applicant: <span className="text-[#0A0A0A]">{form.applicantName}</span></div>
                      {form.applicantPhone && <div className="text-xs font-bold text-gray-500 mt-1">Phone: <span className="text-[#0A0A0A]">{form.applicantPhone}</span></div>}
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Status</label>
                      <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#15803d]/20 focus:border-[#15803d]">
                        <option value="PENDING">Pending</option>
                        <option value="APPROVED">Approved</option>
                        <option value="REJECTED">Rejected</option>
                      </select>
                    </div>
                    {form.status === 'APPROVED' && (
                      <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Benefit Amount (₹)</label>
                        <input type="number" value={form.benefitAmount} onChange={e => setForm({...form, benefitAmount: e.target.value})}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#15803d]/20 focus:border-[#15803d]" />
                      </div>
                    )}
                    {form.status === 'REJECTED' && (
                      <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Rejection Reason</label>
                        <textarea value={form.rejectionReason} onChange={e => setForm({...form, rejectionReason: e.target.value})}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#15803d]/20 focus:border-[#15803d] min-h-[80px]" />
                      </div>
                    )}
                  </>
                )}
                <button type="submit"
                  className="w-full py-4 bg-[#15803d] text-white rounded-[1.5rem] text-xs font-black uppercase tracking-widest hover:scale-[1.02] transition-all shadow-xl shadow-[#15803d]/20">
                  {editingId ? 'Save Changes' : 'Create Application'}
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
