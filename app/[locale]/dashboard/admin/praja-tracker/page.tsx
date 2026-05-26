'use client';

import { useState, useEffect, type ComponentType } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Locale } from '@/lib/i18n';
import Navigation from '@/components/Navigation/Navigation';
import Footer from '@/components/Footer/Footer';
import {
  BarChart3, Plus, Edit, Trash2, X, Search, Check,
  Loader2, FileBarChart, UserCheck, ExternalLink,
  Download, Upload, FileSpreadsheet
} from 'lucide-react';

interface Application {
  id: string;
  applicantName: string;
  applicantPhone: string | null;
  applicantAadhaar: string | null;
  schemeId: string;
  scheme: { title: string; id: string; type?: string };
  village: string;
  ward: string | null;
  status: string;
  benefitAmount: number | null;
  applicationDate: string;
  approvalDate: string | null;
  rejectionDate: string | null;
  rejectionReason: string | null;
}

interface Beneficiary {
  id: string;
  name: string;
  phone: string | null;
  aadhaarMasked: string | null;
  schemeId: string;
  scheme: { title: string; id: string };
  village: string;
  ward: string | null;
  benefitAmount: number;
  benefitDate: string;
  applicationId: string | null;
}

interface Scheme {
  id: string;
  title: string;
  type: string;
  link: string;
  description: string | null;
}

type TabType = 'applications' | 'beneficiaries' | 'schemes';

export default function PrajaTrackerAdminPage() {
  const params = useParams();
  const locale = (params?.locale as Locale) || 'en';

  const [activeTab, setActiveTab] = useState<TabType>('applications');

  // Applications state
  const [applications, setApplications] = useState<Application[]>([]);
  const [appSearch, setAppSearch] = useState('');
  const [appLoading, setAppLoading] = useState(true);
  const [showAppModal, setShowAppModal] = useState(false);
  const [editingAppId, setEditingAppId] = useState<string | null>(null);
  const [appForm, setAppForm] = useState({
    applicantName: '', applicantPhone: '', applicantAadhaar: '',
    schemeId: '', village: 'Mallaram', ward: '', status: 'PENDING',
    benefitAmount: '', rejectionReason: '',
  });

  // Beneficiaries state
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [benSearch, setBenSearch] = useState('');
  const [benLoading, setBenLoading] = useState(true);
  const [showBenModal, setShowBenModal] = useState(false);
  const [editingBenId, setEditingBenId] = useState<string | null>(null);
  const [benForm, setBenForm] = useState({
    name: '', phone: '', aadhaarMasked: '',
    schemeId: '', village: 'Mallaram', ward: '',
    benefitAmount: '', applicationId: '',
  });

  // Schemes state
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [schemeLoading, setSchemeLoading] = useState(true);
  const [showSchemeModal, setShowSchemeModal] = useState(false);
  const [editingSchemeId, setEditingSchemeId] = useState<string | null>(null);
  const [schemeForm, setSchemeForm] = useState({
    title: '', link: '', description: '', type: 'welfare',
  });

  const fetchApplications = async () => {
    try {
      setAppLoading(true);
      const params = new URLSearchParams({ limit: '100' });
      if (appSearch) params.set('search', appSearch);
      const res = await fetch(`/api/applications?${params}`);
      const data = await res.json();
      setApplications(data.applications || []);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    } finally {
      setAppLoading(false);
    }
  };

  const fetchBeneficiaries = async () => {
    try {
      setBenLoading(true);
      const params = new URLSearchParams({ limit: '100' });
      if (benSearch) params.set('search', benSearch);
      const res = await fetch(`/api/beneficiaries?${params}`);
      const data = await res.json();
      setBeneficiaries(data.beneficiaries || []);
    } catch (error) {
      console.error('Failed to fetch beneficiaries:', error);
    } finally {
      setBenLoading(false);
    }
  };

  const fetchSchemes = async () => {
    try {
      setSchemeLoading(true);
      const res = await fetch('/api/schemes');
      const data = await res.json();
      setSchemes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch schemes:', error);
    } finally {
      setSchemeLoading(false);
    }
  };

  useEffect(() => { fetchApplications(); }, []);
  useEffect(() => { fetchBeneficiaries(); }, []);
  useEffect(() => { fetchSchemes(); }, []);

  useEffect(() => {
    if (activeTab === 'applications') fetchApplications();
  }, [appSearch, activeTab]);

  useEffect(() => {
    if (activeTab === 'beneficiaries') fetchBeneficiaries();
  }, [benSearch, activeTab]);

  // ────────────── Application CRUD ──────────────

  const resetAppForm = () => {
    setAppForm({
      applicantName: '', applicantPhone: '', applicantAadhaar: '',
      schemeId: '', village: 'Mallaram', ward: '', status: 'PENDING',
      benefitAmount: '', rejectionReason: '',
    });
    setEditingAppId(null);
  };

  const startEditApp = (app: Application) => {
    setAppForm({
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
    setEditingAppId(app.id);
    setShowAppModal(true);
  };

  const handleAppSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAppId) {
        await fetch('/api/applications', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingAppId,
            status: appForm.status,
            benefitAmount: appForm.benefitAmount,
            rejectionReason: appForm.rejectionReason,
          }),
        });
      } else {
        await fetch('/api/applications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(appForm),
        });
      }
      setShowAppModal(false);
      resetAppForm();
      fetchApplications();
      fetchBeneficiaries();
    } catch (error) {
      console.error('Failed to save:', error);
    }
  };

  const handleDeleteApp = async (id: string) => {
    if (!confirm('Delete this application record? This will also remove associated beneficiary data.')) return;
    try {
      await fetch(`/api/applications?id=${id}`, { method: 'DELETE' });
      fetchApplications();
      fetchBeneficiaries();
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
    fetchApplications();
    fetchBeneficiaries();
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
    fetchApplications();
    fetchBeneficiaries();
  };

  // ────────────── Beneficiary CRUD ──────────────

  const resetBenForm = () => {
    setBenForm({
      name: '', phone: '', aadhaarMasked: '',
      schemeId: '', village: 'Mallaram', ward: '',
      benefitAmount: '', applicationId: '',
    });
    setEditingBenId(null);
  };

  const startEditBen = (ben: Beneficiary) => {
    setBenForm({
      name: ben.name,
      phone: ben.phone || '',
      aadhaarMasked: ben.aadhaarMasked || '',
      schemeId: ben.schemeId,
      village: ben.village,
      ward: ben.ward || '',
      benefitAmount: ben.benefitAmount.toString(),
      applicationId: ben.applicationId || '',
    });
    setEditingBenId(ben.id);
    setShowBenModal(true);
  };

  const handleBenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingBenId) {
        await fetch('/api/beneficiaries', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingBenId, ...benForm }),
        });
      } else {
        await fetch('/api/beneficiaries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(benForm),
        });
      }
      setShowBenModal(false);
      resetBenForm();
      fetchBeneficiaries();
    } catch (error) {
      console.error('Failed to save beneficiary:', error);
    }
  };

  const handleDeleteBen = async (id: string) => {
    if (!confirm('Delete this beneficiary record?')) return;
    try {
      await fetch(`/api/beneficiaries?id=${id}`, { method: 'DELETE' });
      fetchBeneficiaries();
    } catch (error) {
      console.error('Failed to delete beneficiary:', error);
    }
  };

  // ────────────── Scheme CRUD ──────────────

  const resetSchemeForm = () => {
    setSchemeForm({ title: '', link: '', description: '', type: 'welfare' });
    setEditingSchemeId(null);
  };

  const startEditScheme = (scheme: Scheme) => {
    setSchemeForm({
      title: scheme.title,
      link: scheme.link,
      description: scheme.description || '',
      type: scheme.type || 'welfare',
    });
    setEditingSchemeId(scheme.id);
    setShowSchemeModal(true);
  };

  const handleSchemeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const body = editingSchemeId ? { id: editingSchemeId, ...schemeForm } : schemeForm;
      const method = editingSchemeId ? 'PUT' : 'POST';
      await fetch('/api/schemes', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      setShowSchemeModal(false);
      resetSchemeForm();
      fetchSchemes();
    } catch (error) {
      console.error('Failed to save scheme:', error);
    }
  };

  const handleDeleteScheme = async (id: string) => {
    if (!confirm('Delete this scheme? This may affect existing applications linked to it.')) return;
    try {
      await fetch(`/api/schemes?id=${id}`, { method: 'DELETE' });
      fetchSchemes();
    } catch (error) {
      console.error('Failed to delete scheme:', error);
    }
  };

  // ────────────── CSV Export / Import ──────────────

  const [importing, setImporting] = useState(false);
  const [importTab, setImportTab] = useState<TabType | null>(null);
  const [importResult, setImportResult] = useState<{ success: number; failed: number } | null>(null);

  const exportCSV = (data: Record<string, any>[], filename: string, columns: { key: string; label: string }[]) => {
    const header = columns.map(c => `"${c.label}"`).join(',');
    const rows = data.map(row =>
      columns.map(c => {
        const val = row[c.key];
        const str = val == null ? '' : String(val);
        // Escape quotes and wrap in quotes to handle commas
        return `"${str.replace(/"/g, '""')}"`;
      }).join(',')
    );
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportApplicationsCSV = () => {
    const cols = [
      { key: 'applicantName', label: 'Applicant Name' },
      { key: 'applicantPhone', label: 'Phone' },
      { key: 'applicantAadhaar', label: 'Aadhaar (Last 4)' },
      { key: 'scheme.title', label: 'Scheme' },
      { key: 'village', label: 'Village' },
      { key: 'ward', label: 'Ward' },
      { key: 'status', label: 'Status' },
      { key: 'benefitAmount', label: 'Benefit Amount' },
      { key: 'applicationDate', label: 'Application Date' },
      { key: 'approvalDate', label: 'Approval Date' },
      { key: 'rejectionDate', label: 'Rejection Date' },
      { key: 'rejectionReason', label: 'Rejection Reason' },
    ];
    // Resolve nested keys like 'scheme.title'
    const resolved = applications.map(app => {
      const flat: Record<string, any> = {};
      for (const col of cols) {
        const parts = col.key.split('.');
        let val: any = app;
        for (const part of parts) {
          val = val?.[part];
        }
        flat[col.key] = val ?? '';
      }
      return flat;
    });
    exportCSV(resolved, 'praja-applications', cols);
  };

  const exportBeneficiariesCSV = () => {
    const cols = [
      { key: 'name', label: 'Name' },
      { key: 'phone', label: 'Phone' },
      { key: 'aadhaarMasked', label: 'Aadhaar (Last 4)' },
      { key: 'scheme.title', label: 'Scheme' },
      { key: 'village', label: 'Village' },
      { key: 'ward', label: 'Ward' },
      { key: 'benefitAmount', label: 'Benefit Amount' },
      { key: 'benefitDate', label: 'Benefit Date' },
    ];
    const resolved = beneficiaries.map(ben => {
      const flat: Record<string, any> = {};
      for (const col of cols) {
        const parts = col.key.split('.');
        let val: any = ben;
        for (const part of parts) {
          val = val?.[part];
        }
        flat[col.key] = val ?? '';
      }
      return flat;
    });
    exportCSV(resolved, 'praja-beneficiaries', cols);
  };

  const handleCSVImport = async (e: React.ChangeEvent<HTMLInputElement>, tab: TabType) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setImportResult(null);
    setImportTab(tab);

    try {
      const text = await file.text();
      const lines = text.replace(/\r/g, '').split('\n').filter(l => l.trim());
      if (lines.length < 2) {
        alert('CSV file must have a header row and at least one data row.');
        return;
      }

      // Parse header
      const parseLine = (line: string) => {
        const result: string[] = [];
        let current = '';
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
          const ch = line[i];
          if (ch === '"') {
            if (inQuotes && line[i + 1] === '"') {
              current += '"';
              i++;
            } else {
              inQuotes = !inQuotes;
            }
          } else if (ch === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
          } else {
            current += ch;
          }
        }
        result.push(current.trim());
        return result;
      };

      const header = parseLine(lines[0]).map(h => h.replace(/"/g, '').trim().toLowerCase().replace(/\s+/g, ''));

      // Map CSV columns to API fields
      const fieldMap: Record<string, string> = {
        'applicantname': 'applicantName',
        'name': 'name',
        'phone': 'applicantPhone',
        'aadhaar(last4)': 'applicantAadhaar',
        'aadhaar': 'applicantAadhaar',
        'scheme': 'schemeId',
        'village': 'village',
        'ward': 'ward',
        'status': 'status',
        'benefitamount': 'benefitAmount',
        'amount': 'benefitAmount',
      };

      let success = 0;
      let failed = 0;

      for (let i = 1; i < lines.length; i++) {
        try {
          const values = parseLine(lines[i]);
          const row: Record<string, string> = {};
          header.forEach((h, idx) => {
            const field = fieldMap[h] || h;
            row[field] = (values[idx] || '').replace(/"/g, '').trim();
          });

          if (tab === 'applications') {
            // Try to match scheme title to ID
            const schemeTitle = row['schemeId'] || '';
            const matchedScheme = schemes.find(s =>
              s.title.toLowerCase() === schemeTitle.toLowerCase()
            );
            const payload: Record<string, any> = {
              applicantName: row['applicantName'] || '',
              applicantPhone: row['applicantPhone'] || '',
              applicantAadhaar: row['applicantAadhaar'] || '',
              schemeId: matchedScheme?.id || '',
              village: row['village'] || 'Mallaram',
              ward: row['ward'] || '',
              status: (row['status'] || 'PENDING').toUpperCase(),
              benefitAmount: row['benefitAmount'] || '',
            };
            if (!payload.applicantName || !payload.schemeId) {
              failed++;
              continue;
            }
            await fetch('/api/applications', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            });
          } else if (tab === 'beneficiaries') {
            const schemeTitle = row['schemeId'] || '';
            const matchedScheme = schemes.find(s =>
              s.title.toLowerCase() === schemeTitle.toLowerCase()
            );
            const payload: Record<string, any> = {
              name: row['name'] || '',
              phone: row['phone'] || '',
              aadhaarMasked: row['applicantAadhaar'] || row['aadhaarmasked'] || '',
              schemeId: matchedScheme?.id || '',
              village: row['village'] || 'Mallaram',
              ward: row['ward'] || '',
              benefitAmount: row['benefitAmount'] || '',
            };
            if (!payload.name || !payload.schemeId || !payload.benefitAmount) {
              failed++;
              continue;
            }
            await fetch('/api/beneficiaries', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            });
          }
          success++;
        } catch {
          failed++;
        }
      }

      setImportResult({ success, failed });
      // Refresh data
      if (tab === 'applications') fetchApplications();
      if (tab === 'beneficiaries') fetchBeneficiaries();
    } catch (error) {
      console.error('CSV import failed:', error);
      alert('Failed to import CSV. Please check the file format.');
    } finally {
      setImporting(false);
      // Reset the file input
      e.target.value = '';
    }
  };

  // ────────────── Shared ──────────────

  const tabs: { id: TabType; label: string; icon: ComponentType<{ className?: string }> }[] = [
    { id: 'applications', label: 'Applications', icon: FileBarChart },
    { id: 'beneficiaries', label: 'Beneficiaries', icon: UserCheck },
    { id: 'schemes', label: 'Welfare Schemes', icon: ExternalLink },
  ];

  return (
    <main className="min-h-screen bg-gray-50 font-sans">
      <Navigation locale={locale} />
      <div className="pt-48 lg:pt-60 max-w-7xl mx-auto px-4 pb-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <BarChart3 className="w-6 h-6 text-[#15803d]" />
              <h1 className="text-3xl font-black text-[#0A0A0A] tracking-tighter">Praja Progress Tracker — Admin</h1>
            </div>
            <p className="text-gray-500 font-medium">Manage all welfare data: applications, beneficiaries & schemes</p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-8">
          <div className="bg-white p-4 rounded-2xl border border-gray-100">
            <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Apps</div>
            <div className="text-xl font-black text-[#0A0A0A]">{applications.length}</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100">
            <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Approved</div>
            <div className="text-xl font-black text-[#15803d]">{applications.filter(a => a.status === 'APPROVED').length}</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100">
            <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Pending</div>
            <div className="text-xl font-black text-amber-500">{applications.filter(a => a.status === 'PENDING').length}</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100">
            <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Rejected</div>
            <div className="text-xl font-black text-red-500">{applications.filter(a => a.status === 'REJECTED').length}</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100">
            <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Beneficiaries</div>
            <div className="text-xl font-black text-[#15803d]">{beneficiaries.length}</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100">
            <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Schemes</div>
            <div className="text-xl font-black text-[#0A0A0A]">{schemes.filter(s => s.type === 'welfare').length}</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 border-b border-gray-100 pb-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#15803d] text-white shadow-lg shadow-[#15803d]/20'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ──────────────────── APPLICATIONS TAB ──────────────────── */}
        {activeTab === 'applications' && (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" value={appSearch} onChange={e => setAppSearch(e.target.value)}
                  placeholder="Search applications..."
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#15803d]/10 focus:border-[#15803d] transition-all font-bold" />
              </div>
              <div className="flex gap-2 flex-wrap">
                <button onClick={exportApplicationsCSV}
                  className="px-4 py-2.5 bg-white border border-gray-100 text-gray-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 hover:border-[#15803d]/30 hover:text-[#15803d] transition-all flex items-center gap-1.5 shadow-sm">
                  <Download className="w-3.5 h-3.5" /> CSV
                </button>
                <label className={`px-4 py-2.5 border rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-1.5 shadow-sm cursor-pointer ${
                  importing && importTab === 'applications'
                    ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-white border-gray-100 text-gray-600 hover:scale-105 hover:border-[#15803d]/30 hover:text-[#15803d]'
                }`}>
                  {importing && importTab === 'applications' ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Upload className="w-3.5 h-3.5" />
                  )}
                  {importing && importTab === 'applications' ? 'Importing...' : 'Import'}
                  <input type="file" accept=".csv" className="hidden" onChange={e => handleCSVImport(e, 'applications')} disabled={importing} />
                </label>
                <button onClick={handleBulkApprove}
                  className="px-4 py-2.5 bg-[#15803d] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-1.5 shadow-lg shadow-[#15803d]/20">
                  <Check className="w-3.5 h-3.5" /> Bulk Approve
                </button>
                <button onClick={handleBulkReject}
                  className="px-4 py-2.5 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-1.5 shadow-lg shadow-red-600/20">
                  <X className="w-3.5 h-3.5" /> Bulk Reject
                </button>
                <button onClick={() => { resetAppForm(); setShowAppModal(true); }}
                  className="px-4 py-2.5 bg-[#0A0A0A] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-1.5 shadow-lg shadow-black/10">
                  <Plus className="w-3.5 h-3.5" /> New
                </button>
              </div>
            </div>

            {/* Import result toast */}
            {importResult && importTab === 'applications' && (
              <div className={`mb-6 px-5 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 ${
                importResult.failed > 0 ? 'bg-amber-50 border border-amber-100 text-amber-700' : 'bg-green-50 border border-green-100 text-green-700'
              }`}>
                <FileSpreadsheet className="w-4 h-4" />
                Import complete: {importResult.success} imported{importResult.failed > 0 ? `, ${importResult.failed} failed` : ''}
                <button onClick={() => setImportResult(null)} className="ml-auto text-gray-400 hover:text-gray-600"><X className="w-3.5 h-3.5" /></button>
              </div>
            )}

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
                    {appLoading ? (
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
                            <button onClick={() => startEditApp(app)} className="p-2 text-gray-400 hover:text-[#15803d] hover:bg-green-50 rounded-lg transition-all">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDeleteApp(app.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
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
          </div>
        )}

        {/* ──────────────────── BENEFICIARIES TAB ──────────────────── */}
        {activeTab === 'beneficiaries' && (
          <div>              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" value={benSearch} onChange={e => setBenSearch(e.target.value)}
                  placeholder="Search beneficiaries..."
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#15803d]/10 focus:border-[#15803d] transition-all font-bold" />
              </div>
              <div className="flex gap-2 flex-wrap">
                <button onClick={exportBeneficiariesCSV}
                  className="px-4 py-2.5 bg-white border border-gray-100 text-gray-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 hover:border-[#15803d]/30 hover:text-[#15803d] transition-all flex items-center gap-1.5 shadow-sm">
                  <Download className="w-3.5 h-3.5" /> CSV
                </button>
                <label className={`px-4 py-2.5 border rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-1.5 shadow-sm cursor-pointer ${
                  importing && importTab === 'beneficiaries'
                    ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-white border-gray-100 text-gray-600 hover:scale-105 hover:border-[#15803d]/30 hover:text-[#15803d]'
                }`}>
                  {importing && importTab === 'beneficiaries' ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Upload className="w-3.5 h-3.5" />
                  )}
                  {importing && importTab === 'beneficiaries' ? 'Importing...' : 'Import'}
                  <input type="file" accept=".csv" className="hidden" onChange={e => handleCSVImport(e, 'beneficiaries')} disabled={importing} />
                </label>
                <button onClick={() => { resetBenForm(); setShowBenModal(true); }}
                  className="px-4 py-2.5 bg-[#0A0A0A] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-1.5 shadow-lg shadow-black/10">
                  <Plus className="w-3.5 h-3.5" /> Add Beneficiary
                </button>
              </div>
            </div>

            {/* Import result toast */}
            {importResult && importTab === 'beneficiaries' && (
              <div className={`mb-6 px-5 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 ${
                importResult.failed > 0 ? 'bg-amber-50 border border-amber-100 text-amber-700' : 'bg-green-50 border border-green-100 text-green-700'
              }`}>
                <FileSpreadsheet className="w-4 h-4" />
                Import complete: {importResult.success} imported{importResult.failed > 0 ? `, ${importResult.failed} failed` : ''}
                <button onClick={() => setImportResult(null)} className="ml-auto text-gray-400 hover:text-gray-600"><X className="w-3.5 h-3.5" /></button>
              </div>
            )}

            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-green-50/50 text-[10px] text-gray-400 font-black uppercase tracking-widest">
                      <th className="px-6 py-5">Name</th>
                      <th className="px-6 py-5">Scheme</th>
                      <th className="px-6 py-5">Village</th>
                      <th className="px-6 py-5">Benefit Date</th>
                      <th className="px-6 py-5 text-right">Amount</th>
                      <th className="px-6 py-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {benLoading ? (
                      <tr><td colSpan={6} className="px-6 py-16 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-300" /></td></tr>
                    ) : beneficiaries.length === 0 ? (
                      <tr><td colSpan={6} className="px-6 py-16 text-center text-gray-300 font-bold italic">No beneficiaries found.</td></tr>
                    ) : beneficiaries.map(ben => (
                      <tr key={ben.id} className="hover:bg-green-50/20 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="font-bold text-sm text-[#0A0A0A]">{ben.name}</div>
                          {ben.phone && <div className="text-[10px] text-gray-400">{ben.phone}</div>}
                        </td>
                        <td className="px-6 py-4 text-xs font-bold text-gray-600">{ben.scheme?.title || '—'}</td>
                        <td className="px-6 py-4 text-xs text-gray-500">{ben.village}{ben.ward ? ` / ${ben.ward}` : ''}</td>
                        <td className="px-6 py-4 text-xs text-gray-500">{new Date(ben.benefitDate).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-right">
                          <span className="font-black text-sm text-[#15803d]">₹{(ben.benefitAmount || 0).toLocaleString('en-IN')}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => startEditBen(ben)} className="p-2 text-gray-400 hover:text-[#15803d] hover:bg-green-50 rounded-lg transition-all">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDeleteBen(ben.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
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
          </div>
        )}

        {/* ──────────────────── SCHEMES TAB ──────────────────── */}
        {activeTab === 'schemes' && (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  {schemes.filter(s => s.type === 'welfare').length} welfare schemes configured
                </p>
              </div>
              <button onClick={() => { resetSchemeForm(); setShowSchemeModal(true); }}
                className="px-4 py-2.5 bg-[#0A0A0A] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-1.5 shadow-lg shadow-black/10">
                <Plus className="w-3.5 h-3.5" /> Add Scheme
              </button>
            </div>

            {schemeLoading ? (
              <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-16 text-center">
                <Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-300" />
              </div>
            ) : schemes.filter(s => s.type === 'welfare').length === 0 ? (
              <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-16 text-center">
                <div className="text-gray-300 font-bold italic mb-4">No welfare schemes configured.</div>
                <button onClick={() => { resetSchemeForm(); setShowSchemeModal(true); }}
                  className="px-6 py-3 bg-[#15803d] text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all inline-flex items-center gap-2 shadow-xl shadow-[#15803d]/20">
                  <Plus className="w-4 h-4" /> Add Your First Scheme
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {schemes.filter(s => s.type === 'welfare').map(scheme => (
                  <div key={scheme.id} className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-6 hover:border-[#15803d]/30 transition-all group">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-10 h-10 rounded-xl bg-[#15803d]/10 flex items-center justify-center text-[#15803d]">
                        <ExternalLink className="w-5 h-5" />
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => startEditScheme(scheme)} className="p-1.5 text-gray-400 hover:text-[#15803d] hover:bg-green-50 rounded-lg transition-all">
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDeleteScheme(scheme.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <h4 className="font-black text-[#0A0A0A] mb-1">{scheme.title}</h4>
                    <p className="text-[10px] text-gray-400 font-medium mb-4 line-clamp-2">{scheme.description || 'No description.'}</p>
                    <div className="flex items-center gap-2 text-[10px]">
                      <a href={scheme.link} target="_blank" className="font-black text-[#15803d] uppercase tracking-widest flex items-center gap-1 hover:underline">
                        View Link <ExternalLink className="w-3 h-3" />
                      </a>
                      <span className="text-gray-300">|</span>
                      <span className="text-gray-400 font-bold uppercase">{scheme.type}</span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-50 text-[9px] text-gray-300 font-bold">
                      Applications: {applications.filter(a => a.schemeId === scheme.id).length}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ──────────────────── APPLICATION MODAL ──────────────────── */}
        {showAppModal && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[2.5rem] shadow-2xl p-8 w-full max-w-lg relative">
              <button onClick={() => setShowAppModal(false)} className="absolute top-6 right-6 text-gray-300 hover:text-[#0A0A0A] transition-colors">
                <X className="w-6 h-6" />
              </button>
              <h3 className="text-2xl font-black text-[#0A0A0A] mb-1 tracking-tighter">
                {editingAppId ? 'Update Application' : 'New Application'}
              </h3>
              <p className="text-gray-400 mb-6 text-sm font-medium">
                {editingAppId ? 'Change status or update details' : 'Register a new welfare application'}
              </p>
              <form onSubmit={handleAppSubmit} className="space-y-4">
                {!editingAppId && (
                  <>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Name</label>
                      <input type="text" value={appForm.applicantName} onChange={e => setAppForm({...appForm, applicantName: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#15803d]/20 focus:border-[#15803d]" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Phone</label>
                        <input type="text" value={appForm.applicantPhone} onChange={e => setAppForm({...appForm, applicantPhone: e.target.value})}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#15803d]/20 focus:border-[#15803d]" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Aadhaar (last 4)</label>
                        <input type="text" maxLength={4} value={appForm.applicantAadhaar} onChange={e => setAppForm({...appForm, applicantAadhaar: e.target.value.replace(/\D/g, '').slice(0, 4)})}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-[#15803d]/20 focus:border-[#15803d]" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Scheme</label>
                      <select value={appForm.schemeId} onChange={e => setAppForm({...appForm, schemeId: e.target.value})}
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
                        <input type="text" value={appForm.village} onChange={e => setAppForm({...appForm, village: e.target.value})}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#15803d]/20 focus:border-[#15803d]" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Ward</label>
                        <input type="text" value={appForm.ward} onChange={e => setAppForm({...appForm, ward: e.target.value})}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#15803d]/20 focus:border-[#15803d]" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Status</label>
                      <select value={appForm.status} onChange={e => setAppForm({...appForm, status: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#15803d]/20 focus:border-[#15803d]">
                        <option value="PENDING">Pending</option>
                        <option value="APPROVED">Approved</option>
                        <option value="REJECTED">Rejected</option>
                      </select>
                    </div>
                  </>
                )}
                {editingAppId && (
                  <>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="text-xs font-bold text-gray-500">Applicant: <span className="text-[#0A0A0A]">{appForm.applicantName}</span></div>
                      {appForm.applicantPhone && <div className="text-xs font-bold text-gray-500 mt-1">Phone: <span className="text-[#0A0A0A]">{appForm.applicantPhone}</span></div>}
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Status</label>
                      <select value={appForm.status} onChange={e => setAppForm({...appForm, status: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#15803d]/20 focus:border-[#15803d]">
                        <option value="PENDING">Pending</option>
                        <option value="APPROVED">Approved</option>
                        <option value="REJECTED">Rejected</option>
                      </select>
                    </div>
                    {appForm.status === 'APPROVED' && (
                      <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Benefit Amount (₹)</label>
                        <input type="number" value={appForm.benefitAmount} onChange={e => setAppForm({...appForm, benefitAmount: e.target.value})}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#15803d]/20 focus:border-[#15803d]" />
                      </div>
                    )}
                    {appForm.status === 'REJECTED' && (
                      <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Rejection Reason</label>
                        <textarea value={appForm.rejectionReason} onChange={e => setAppForm({...appForm, rejectionReason: e.target.value})}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#15803d]/20 focus:border-[#15803d] min-h-[80px]" />
                      </div>
                    )}
                  </>
                )}
                <button type="submit"
                  className="w-full py-4 bg-[#15803d] text-white rounded-[1.5rem] text-xs font-black uppercase tracking-widest hover:scale-[1.02] transition-all shadow-xl shadow-[#15803d]/20">
                  {editingAppId ? 'Save Changes' : 'Create Application'}
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {/* ──────────────────── BENEFICIARY MODAL ──────────────────── */}
        {showBenModal && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[2.5rem] shadow-2xl p-8 w-full max-w-lg relative">
              <button onClick={() => setShowBenModal(false)} className="absolute top-6 right-6 text-gray-300 hover:text-[#0A0A0A] transition-colors">
                <X className="w-6 h-6" />
              </button>
              <h3 className="text-2xl font-black text-[#0A0A0A] mb-1 tracking-tighter">
                {editingBenId ? 'Update Beneficiary' : 'New Beneficiary'}
              </h3>
              <p className="text-gray-400 mb-6 text-sm font-medium">
                {editingBenId ? 'Edit beneficiary details' : 'Register a new welfare beneficiary'}
              </p>
              <form onSubmit={handleBenSubmit} className="space-y-4">
                {!editingBenId && (
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Link to Application (optional)</label>
                    <select value={benForm.applicationId} onChange={e => setBenForm({...benForm, applicationId: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#15803d]/20 focus:border-[#15803d]">
                      <option value="">No linked application</option>
                      {applications.filter(a => a.status === 'APPROVED' && !beneficiaries.some(b => b.applicationId === a.id)).map(a => (
                        <option key={a.id} value={a.id}>{a.applicantName} — {a.scheme?.title}</option>
                      ))}
                    </select>
                  </div>
                )}
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Name *</label>
                  <input type="text" value={benForm.name} onChange={e => setBenForm({...benForm, name: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#15803d]/20 focus:border-[#15803d]" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Phone</label>
                    <input type="text" value={benForm.phone} onChange={e => setBenForm({...benForm, phone: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#15803d]/20 focus:border-[#15803d]" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Aadhaar (last 4)</label>
                    <input type="text" maxLength={4} value={benForm.aadhaarMasked} onChange={e => setBenForm({...benForm, aadhaarMasked: e.target.value.replace(/\D/g, '').slice(0, 4)})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-[#15803d]/20 focus:border-[#15803d]" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Scheme *</label>
                  <select value={benForm.schemeId} onChange={e => setBenForm({...benForm, schemeId: e.target.value})}
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
                    <input type="text" value={benForm.village} onChange={e => setBenForm({...benForm, village: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#15803d]/20 focus:border-[#15803d]" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Ward</label>
                    <input type="text" value={benForm.ward} onChange={e => setBenForm({...benForm, ward: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#15803d]/20 focus:border-[#15803d]" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Benefit Amount (₹) *</label>
                  <input type="number" value={benForm.benefitAmount} onChange={e => setBenForm({...benForm, benefitAmount: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#15803d]/20 focus:border-[#15803d]" required />
                </div>
                <button type="submit"
                  className="w-full py-4 bg-[#15803d] text-white rounded-[1.5rem] text-xs font-black uppercase tracking-widest hover:scale-[1.02] transition-all shadow-xl shadow-[#15803d]/20">
                  {editingBenId ? 'Save Changes' : 'Add Beneficiary'}
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {/* ──────────────────── SCHEME MODAL ──────────────────── */}
        {showSchemeModal && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[2.5rem] shadow-2xl p-8 w-full max-w-lg relative">
              <button onClick={() => setShowSchemeModal(false)} className="absolute top-6 right-6 text-gray-300 hover:text-[#0A0A0A] transition-colors">
                <X className="w-6 h-6" />
              </button>
              <h3 className="text-2xl font-black text-[#0A0A0A] mb-1 tracking-tighter">
                {editingSchemeId ? 'Edit Scheme' : 'New Welfare Scheme'}
              </h3>
              <p className="text-gray-400 mb-6 text-sm font-medium">
                {editingSchemeId ? 'Update scheme details' : 'Add a new welfare scheme for applications'}
              </p>
              <form onSubmit={handleSchemeSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Title *</label>
                  <input type="text" value={schemeForm.title} onChange={e => setSchemeForm({...schemeForm, title: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#15803d]/20 focus:border-[#15803d]" required />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Link URL *</label>
                  <input type="url" value={schemeForm.link} onChange={e => setSchemeForm({...schemeForm, link: e.target.value})}
                    placeholder="https://..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#15803d]/20 focus:border-[#15803d]" required />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Description</label>
                  <textarea value={schemeForm.description} onChange={e => setSchemeForm({...schemeForm, description: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#15803d]/20 focus:border-[#15803d] min-h-[80px]" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Type</label>
                  <select value={schemeForm.type} onChange={e => setSchemeForm({...schemeForm, type: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#15803d]/20 focus:border-[#15803d]">
                    <option value="welfare">Welfare</option>
                    <option value="portal">Portal</option>
                  </select>
                </div>
                <button type="submit"
                  className="w-full py-4 bg-[#15803d] text-white rounded-[1.5rem] text-xs font-black uppercase tracking-widest hover:scale-[1.02] transition-all shadow-xl shadow-[#15803d]/20">
                  {editingSchemeId ? 'Save Changes' : 'Create Scheme'}
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
