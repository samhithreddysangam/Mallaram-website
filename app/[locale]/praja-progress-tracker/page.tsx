'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Locale } from '@/lib/i18n';
import Navigation from '@/components/Navigation/Navigation';
import Footer from '@/components/Footer/Footer';
import {
  BarChart3, Users, ClipboardCheck, IndianRupee, Clock, TrendingUp,
  Search, Download, FileSpreadsheet, Printer, Filter, X, Sun, Moon,
  CheckCircle2, XCircle, Loader2, ChevronLeft, ChevronRight, Shield,
  ExternalLink, FileBarChart, Layers, MapPin, Calendar, ArrowUpRight,
  AlertTriangle, Check, RefreshCw
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Area, AreaChart
} from 'recharts';

// ─── Types ────────────────────────────────────────────────────────
interface DashboardStats {
  totalApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  pendingApplications: number;
  totalBeneficiaries: number;
  welfareAmountDistributed: number;
}

interface AnalyticsData {
  schemeWiseDistribution: { name: string; beneficiaries: number; amount: number }[];
  monthWiseGrowth: { month: string; applications: number; approved: number; rejected: number; pending: number }[];
  approvedVsPending: { approved: number; pending: number; rejected: number };
  villageWiseDistribution: { name: string; beneficiaries: number; amount: number }[];
  welfareAmountTrends: { month: string; amount: number }[];
}

interface ApplicationRecord {
  id: string;
  applicantName: string;
  applicantPhone: string | null;
  schemeId: string;
  scheme: { title: string };
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

// ─── Color Theme (site-consistent: green only) ────────────────────
const COLORS = {
  primary: '#15803d',
  primaryLight: '#22c55e',
  primaryDark: '#14532d',
  red: '#ef4444',
  gray: '#6b7280',
};

const PIE_COLORS = ['#15803d', '#22c55e', '#166534', '#14532d', '#4ade80', '#86efac', '#bbf7d0', '#dcfce7'];
const STATUS_COLORS: Record<string, string> = {
  APPROVED: '#15803d',
  PENDING: '#d97706',
  REJECTED: '#ef4444',
};

// ─── Animated Counter ──────────────────────────────────────────────
function AnimatedCounter({ value, suffix = '', prefix = '', decimals = 0 }: { value: number; suffix?: string; prefix?: string; decimals?: number }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<number>(0);

  useEffect(() => {
    let startTime: number | null = null;
    const duration = 1500;
    const startValue = ref.current;
    const endValue = value;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startValue + (endValue - startValue) * eased);
      setDisplay(current);
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
    ref.current = value;
  }, [value]);

  return <span>{prefix}{display.toLocaleString('en-IN')}{suffix}</span>;
}

// ─── Stats Card (site-card style) ─────────────────────────────────
function StatsCard({ title, value, icon: Icon, accentColor = 'text-green-600' }: {
  title: string; value: number; icon: any; accentColor?: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      className="group relative overflow-hidden bg-white dark:bg-gray-900 shadow-[0_8px_32px_rgba(0,0,0,0.03)] rounded-[3rem] border border-gray-100 dark:border-gray-800 hover:border-[#15803d]/40 p-8 transition-all duration-500"
    >
      <div className="absolute top-0 right-0 w-48 h-48 -mr-12 -mt-12 rounded-full bg-[#15803d]/5 opacity-40 transition-transform duration-500 group-hover:scale-150" />
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-5">
          <div className="w-14 h-14 rounded-2xl bg-[#15803d]/8 flex items-center justify-center group-hover:bg-[#15803d] group-hover:text-white transition-all duration-500">
            <Icon className="w-6 h-6 text-[#15803d] group-hover:text-white transition-colors" />
          </div>
          <div className="px-3 py-1 rounded-full bg-[#15803d]/8 text-[9px] font-black uppercase tracking-[0.2em] text-[#15803d]">
            Live
          </div>
        </div>
        <div className={`text-3xl font-black tracking-tighter ${accentColor}`}>
          <AnimatedCounter value={value} />
        </div>          <div className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mt-1.5">
            {title}
          </div>
        <div className="mt-4 h-px w-0 group-hover:w-full bg-gradient-to-r from-[#15803d]/40 to-transparent transition-all duration-500" />
      </div>
    </motion.div>
  );
}

// ─── Filters (site-card style) ────────────────────────────────────
function FilterBar({ schemes, filters, onChange, onReset }: {
  schemes: Scheme[];
  filters: { schemeId: string; year: string; village: string; status: string; search: string; dateFrom: string; dateTo: string };
  onChange: (f: typeof filters) => void;
  onReset: () => void;
}) {
  const years = Array.from({ length: 6 }, (_, i) => (new Date().getFullYear() - i).toString());

  return (
    <div className="bg-white dark:bg-gray-900 shadow-[0_8px_32px_rgba(0,0,0,0.03)] rounded-[3rem] border border-gray-100 dark:border-gray-800 hover:border-[#15803d]/40 transition-all duration-500 p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Filters</span>
          {(filters.schemeId || filters.year || filters.village || filters.status || filters.search || filters.dateFrom || filters.dateTo) && (
            <button onClick={onReset} className="flex items-center gap-1 px-3 py-1 text-[9px] font-black text-red-500 uppercase tracking-[0.2em] hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all">
              <X className="w-3 h-3" /> Clear
            </button>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
        <select
          value={filters.schemeId}
          onChange={e => onChange({ ...filters, schemeId: e.target.value })}
          className="px-4 py-3 bg-[#FAF9F6] dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl text-xs font-bold dark:text-white focus:outline-none focus:ring-2 focus:ring-[#15803d]/20 focus:border-[#15803d] transition-all"
        >
          <option value="">All Schemes</option>
          {schemes.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
        </select>
        <select
          value={filters.year}
          onChange={e => onChange({ ...filters, year: e.target.value })}
          className="px-4 py-3 bg-[#FAF9F6] dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl text-xs font-bold dark:text-white focus:outline-none focus:ring-2 focus:ring-[#15803d]/20 focus:border-[#15803d] transition-all"
        >
          <option value="">All Years</option>
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        <select
          value={filters.status}
          onChange={e => onChange({ ...filters, status: e.target.value })}
          className="px-4 py-3 bg-[#FAF9F6] dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl text-xs font-bold dark:text-white focus:outline-none focus:ring-2 focus:ring-[#15803d]/20 focus:border-[#15803d] transition-all"
        >
          <option value="">All Status</option>
          <option value="APPROVED">Approved</option>
          <option value="PENDING">Pending</option>
          <option value="REJECTED">Rejected</option>
        </select>
        <select
          value={filters.village}
          onChange={e => onChange({ ...filters, village: e.target.value })}
          className="px-4 py-3 bg-[#FAF9F6] dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl text-xs font-bold dark:text-white focus:outline-none focus:ring-2 focus:ring-[#15803d]/20 focus:border-[#15803d] transition-all"
        >
          <option value="">All Villages</option>
          <option value="Mallaram">Mallaram</option>
          <option value="Vemulawada">Vemulawada</option>
          <option value="Kodurupaka">Kodurupaka</option>
        </select>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            value={filters.search}
            onChange={e => onChange({ ...filters, search: e.target.value })}
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-3 bg-[#FAF9F6] dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl text-xs font-bold dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#15803d]/20 focus:border-[#15803d] transition-all"
          />
        </div>
        <div className="relative col-span-2 md:col-span-1 lg:col-span-2 flex gap-2">
          <input
            type="date"
            value={filters.dateFrom}
            onChange={e => onChange({ ...filters, dateFrom: e.target.value })}
            className="flex-1 px-3 py-3 bg-[#FAF9F6] dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl text-[10px] font-bold dark:text-white focus:outline-none focus:ring-2 focus:ring-[#15803d]/20 focus:border-[#15803d] transition-all"
            title="Date from"
          />
          <input
            type="date"
            value={filters.dateTo}
            onChange={e => onChange({ ...filters, dateTo: e.target.value })}
            className="flex-1 px-3 py-3 bg-[#FAF9F6] dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl text-[10px] font-bold dark:text-white focus:outline-none focus:ring-2 focus:ring-[#15803d]/20 focus:border-[#15803d] transition-all"
            title="Date to"
          />
        </div>
      </div>
    </div>
  );
}

// ─── Verification System ──────────────────────────────────────────
function VerificationSystem({ locale }: { locale: Locale }) {
  const [aadhaar, setAadhaar] = useState('');
  const [appId, setAppId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          aadhaarLast4: aadhaar || undefined,
          applicationId: appId || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Verification failed');
      } else {
        setResult(data);
      }
    } catch {
      setError('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setAadhaar('');
    setAppId('');
    setResult(null);
    setError('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white dark:bg-gray-900 shadow-[0_8px_32px_rgba(0,0,0,0.03)] rounded-[3rem] border border-gray-100 dark:border-gray-800 hover:border-[#15803d]/40 transition-all duration-500 p-8 md:p-10"
    >
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-2xl bg-[#15803d]/8 flex items-center justify-center">
          <Shield className="w-6 h-6 text-[#15803d]" />
        </div>
        <div>
          <h3 className="text-xl font-black text-[#0A0A0A] dark:text-white uppercase tracking-tighter">Public Verification</h3>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-0.5">Verify your application status securely</p>
        </div>
      </div>

      {!result ? (
        <form onSubmit={handleVerify} className="space-y-5">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">
                Aadhaar (Last 4 Digits)
              </label>
              <input
                type="text"
                maxLength={4}
                pattern="[0-9]{4}"
                value={aadhaar}
                onChange={e => setAadhaar(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="XXXX"
                className="w-full px-4 py-3 bg-[#FAF9F6] dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl text-sm font-bold text-center text-2xl tracking-[0.3em] focus:outline-none focus:ring-2 focus:ring-[#15803d]/20 focus:border-[#15803d] transition-all"
                disabled={!!appId}
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">
                OR Application ID
              </label>
              <input
                type="text"
                value={appId}
                onChange={e => setAppId(e.target.value)}
                placeholder="e.g., cm0..."
                className="w-full px-4 py-3 bg-[#FAF9F6] dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl text-xs font-bold dark:text-white focus:outline-none focus:ring-2 focus:ring-[#15803d]/20 focus:border-[#15803d] transition-all"
                disabled={!!aadhaar}
              />
            </div>
          </div>
          {error && (
            <div className="flex items-center gap-2.5 p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold border border-red-100">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading || (!aadhaar && !appId)}
            className="w-full px-6 py-4 bg-[#15803d] hover:bg-[#14532d] disabled:opacity-50 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2.5 transition-all shadow-lg shadow-[#15803d]/20"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            {loading ? 'Verifying...' : 'Verify Status'}
          </button>
        </form>
      ) : (
        <div className="space-y-5">
          {result.multiple ? (
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <CheckCircle2 className="w-5 h-5 text-[#15803d]" />
                <span className="text-sm font-bold text-[#15803d]">{result.applications.length} application(s) found</span>
              </div>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {result.applications.map((app: any) => (
                  <div key={app.applicationId} className="p-5 bg-[#FAF9F6] rounded-2xl border border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{app.schemeName}</span>
                      <StatusBadge status={app.status} />
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div><span className="text-gray-400 font-medium">Applicant:</span> <span className="font-bold">{app.applicantName}</span></div>
                      <div><span className="text-gray-400 font-medium">Date:</span> <span className="font-bold">{new Date(app.applicationDate).toLocaleDateString()}</span></div>
                      {app.benefitAmount && <div><span className="text-gray-400 font-medium">Amount:</span> <span className="font-bold text-[#15803d]">₹{app.benefitAmount.toLocaleString('en-IN')}</span></div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 mb-5">
                <div className={`w-3 h-3 rounded-full ${result.application.status === 'APPROVED' ? 'bg-[#15803d]' : result.application.status === 'REJECTED' ? 'bg-red-500' : 'bg-amber-500'}`} />
                <span className="text-sm font-bold text-[#0A0A0A] dark:text-white">Application Status</span>
              </div>
              <div className="p-6 bg-[#FAF9F6] rounded-2xl border border-gray-100">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Scheme</div>
                    <div className="font-bold text-[#0A0A0A] dark:text-white">{result.application.schemeName}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Status</div>
                    <StatusBadge status={result.application.status} />
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Application Date</div>
                    <div className="font-bold text-[#0A0A0A] dark:text-white">{new Date(result.application.applicationDate).toLocaleDateString()}</div>
                  </div>
                  {result.application.benefitAmount && (
                    <div>
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Benefit Amount</div>
                      <div className="font-bold text-[#15803d]">₹{result.application.benefitAmount.toLocaleString('en-IN')}</div>
                    </div>
                  )}
                  {result.application.rejectionReason && (
                    <div className="col-span-2">
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Reason</div>
                      <div className="font-bold text-red-500">{result.application.rejectionReason}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleReset}
            className="w-full px-6 py-4 bg-[#FAF9F6] hover:bg-gray-100 text-gray-500 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2.5 transition-all border border-gray-100"
          >
            <RefreshCw className="w-4 h-4" />
            Check Another
          </button>
        </div>
      )}
    </motion.div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config = {
    APPROVED: { bg: 'bg-green-100', text: 'text-[#15803d]', dot: 'bg-[#15803d]', label: 'Approved' },
    PENDING: { bg: 'bg-amber-100', text: 'text-amber-600', dot: 'bg-amber-500', label: 'Pending' },
    REJECTED: { bg: 'bg-red-100', text: 'text-red-600', dot: 'bg-red-500', label: 'Rejected' },
  };
  const c = config[status as keyof typeof config] || config.PENDING;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${c.bg} ${c.text} text-[9px] font-black uppercase tracking-[0.2em]`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}

// ─── Beneficiary Table (site-card style) ──────────────────────────
function BeneficiaryTable({ locale }: { locale: Locale }) {
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchData = useCallback(async (searchTerm = '', pageNum = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.set('search', searchTerm);
      params.set('page', pageNum.toString());
      params.set('limit', '15');
      const res = await fetch(`/api/applications?${params}`);
      const data = await res.json();
      setApplications(data.applications || []);
      setTotalPages(data.totalPages || 1);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(search, page); }, [page]);
  useEffect(() => { const t = setTimeout(() => { setPage(1); fetchData(search, 1); }, 300); return () => clearTimeout(t); }, [search]);

  const exportCSV = () => {
    const headers = ['Applicant Name', 'Scheme', 'Village', 'Ward', 'Status', 'Amount', 'Application Date', 'Approval Date'];
    const rows = applications.map(a => [
      a.applicantName, a.scheme.title, a.village, a.ward || '', a.status,
      a.benefitAmount ? `₹${a.benefitAmount}` : '', new Date(a.applicationDate).toLocaleDateString(),
      a.approvalDate ? new Date(a.approvalDate).toLocaleDateString() : ''
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `praja-progress-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => window.print();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white dark:bg-gray-900 shadow-[0_8px_32px_rgba(0,0,0,0.03)] rounded-[3rem] border border-gray-100 dark:border-gray-800 hover:border-[#15803d]/40 transition-all duration-500 overflow-hidden"
    >
      <div className="p-8 border-b border-gray-100 dark:border-gray-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
          <div>
            <h3 className="text-xl font-black text-[#0A0A0A] dark:text-white uppercase tracking-tighter">Beneficiary Records</h3>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-0.5">Complete list of all welfare applications and beneficiaries</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] text-gray-400 font-bold flex items-center gap-1.5">
              <Clock className="w-3 h-3" /> Updated {lastUpdated.toLocaleTimeString()}
            </span>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, phone or application ID..."
              className="w-full pl-11 pr-4 py-3 bg-[#FAF9F6] dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl text-sm font-bold dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#15803d]/20 focus:border-[#15803d] transition-all"
            />
          </div>
          <div className="flex gap-2">
            <button onClick={exportCSV} className="px-5 py-3 bg-[#FAF9F6] dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-100 dark:border-gray-700 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2.5 transition-all">
              <FileSpreadsheet className="w-4 h-4 text-[#15803d]" /> CSV
            </button>
            <button onClick={handlePrint} className="px-5 py-3 bg-[#FAF9F6] dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-100 dark:border-gray-700 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2.5 transition-all">
              <Printer className="w-4 h-4" /> Print
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left print:table-auto">
          <thead>
            <tr className="bg-[#FAF9F6] dark:bg-gray-800/50 text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">
              <th className="px-8 py-4">Applicant</th>
              <th className="px-8 py-4">Scheme</th>
              <th className="px-8 py-4">Village</th>
              <th className="px-8 py-4">Date</th>
              <th className="px-8 py-4">Status</th>
              <th className="px-8 py-4 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
            {loading ? (
              <tr><td colSpan={6} className="px-8 py-20 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-300" /></td></tr>
            ) : applications.length === 0 ? (
              <tr><td colSpan={6} className="px-8 py-16 text-center text-gray-300 font-bold italic">No records found.</td></tr>
            ) : applications.map((app) => (
              <tr key={app.id} className="hover:bg-[#FAF9F6]/80 dark:hover:bg-gray-800/30 transition-colors group">
                <td className="px-8 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-2xl bg-[#15803d]/8 flex items-center justify-center text-[#15803d] text-sm font-black">
                      {app.applicantName.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-[#0A0A0A] dark:text-white">{app.applicantName}</div>
                      {app.applicantPhone && <div className="text-[10px] text-gray-400 font-medium">{app.applicantPhone}</div>}
                    </div>
                  </div>
                </td>
                <td className="px-8 py-4">
                  <span className="text-xs font-bold text-gray-600 dark:text-gray-300">{app.scheme.title}</span>
                </td>
                <td className="px-8 py-4">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-gray-400" />
                    <span className="text-xs font-medium text-gray-500">{app.village}{app.ward ? ` (${app.ward})` : ''}</span>
                  </div>
                </td>
                <td className="px-8 py-4">
                  <div className="text-xs font-bold text-gray-500">
                    {new Date(app.applicationDate).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-8 py-4">
                  <StatusBadge status={app.status} />
                </td>
                <td className="px-8 py-4 text-right">
                  <span className="text-sm font-black text-[#0A0A0A] dark:text-white">
                    {app.benefitAmount ? `₹${app.benefitAmount.toLocaleString('en-IN')}` : '—'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="px-8 py-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <span className="text-[10px] font-bold text-gray-400">Page {page} of {totalPages}</span>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}
              className="px-3 py-1.5 bg-[#FAF9F6] dark:bg-gray-800 disabled:opacity-30 rounded-xl text-xs font-bold hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button disabled={page >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              className="px-3 py-1.5 bg-[#FAF9F6] dark:bg-gray-800 disabled:opacity-30 rounded-xl text-xs font-bold hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}

// ─── Main Dashboard Component ────────────────────────────────────────
export default function PrajaProgressTrackerPage() {
  const params = useParams();
  const locale = (params?.locale as Locale) || 'en';
  const [darkMode, setDarkMode] = useState(false);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const [filters, setFilters] = useState({ schemeId: '', year: '', village: '', status: '', search: '', dateFrom: '', dateTo: '' });
  const [activeChartTab, setActiveChartTab] = useState('schemes');

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  const fetchData = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filters.schemeId) params.set('schemeId', filters.schemeId);
      if (filters.year) params.set('year', filters.year);
      if (filters.village) params.set('village', filters.village);
      if (filters.dateFrom) params.set('dateFrom', filters.dateFrom);
      if (filters.dateTo) params.set('dateTo', filters.dateTo);

      const [statsRes, analyticsRes, schemesRes] = await Promise.all([
        fetch('/api/praja-stats'),
        fetch(`/api/praja-analytics?${params}`),
        fetch('/api/schemes'),
      ]);

      const statsData = await statsRes.json();
      const analyticsData = await analyticsRes.json();
      const schemesData = await schemesRes.json();

      setStats(statsData);
      setAnalytics(analyticsData);
      setSchemes(Array.isArray(schemesData) ? schemesData.filter((s: Scheme) => s.type === 'welfare') : []);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoadingStats(false);
    }
  }, [filters.schemeId, filters.year, filters.village, filters.dateFrom, filters.dateTo]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const resetFilters = () => setFilters({ schemeId: '', year: '', village: '', status: '', search: '', dateFrom: '', dateTo: '' });

  const chartConfigs = [
    { id: 'schemes', label: 'Scheme-wise', icon: Layers },
    { id: 'growth', label: 'Monthly Growth', icon: TrendingUp },
    { id: 'ratio', label: 'Status Ratio', icon: ClipboardCheck },
    { id: 'villages', label: 'Village-wise', icon: MapPin },
    { id: 'amounts', label: 'Amount Trends', icon: IndianRupee },
  ];

  return (
    <main className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-950' : 'bg-[#FAF9F6]'}`}>
      <Navigation locale={locale} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-[80px] lg:pt-[200px] max-w-7xl mx-auto px-4 pb-20"
      >
        {/* ─── Section Header (site-consistent) ─── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="inline-block px-4 py-1.5 rounded-full bg-[#15803d]/10 text-[#15803d] text-[10px] font-black uppercase tracking-[0.3em] mb-6 border border-[#15803d]/20">
                <span className="flex items-center gap-2">
                  <BarChart3 className="w-3.5 h-3.5" />
                  Transparent Governance
                </span>
              </span>
              <h1 className="text-5xl md:text-7xl font-black text-[#0A0A0A] dark:text-white uppercase tracking-tighter leading-[0.9] mb-4">
                Praja Progress <span className="text-[#15803d]">Tracker</span>
              </h1>
              <p className="text-gray-500 font-medium max-w-2xl text-lg">
                Track Applications, Approvals &amp; Welfare Benefits Delivered Transparently
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="flex items-center gap-2.5 px-5 py-3 bg-white dark:bg-gray-900 shadow-[0_8px_32px_rgba(0,0,0,0.03)] rounded-2xl border border-gray-100 dark:border-gray-800">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-[10px] font-bold text-gray-400">
                  Last Updated: {lastUpdated.toLocaleTimeString()}
                </span>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="w-11 h-11 flex items-center justify-center bg-white dark:bg-gray-900 shadow-[0_8px_32px_rgba(0,0,0,0.03)] rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-[#15803d]/40 transition-all"
                title={darkMode ? 'Light Mode' : 'Dark Mode'}
              >
                {darkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-gray-400" />}
              </button>
            </div>
          </div>
        </motion.div>

        {/* ─── Stats Cards (grid with whileInView) ─── */}
        {loadingStats ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 mb-12">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-900 shadow-[0_8px_32px_rgba(0,0,0,0.03)] rounded-[3rem] border border-gray-100 dark:border-gray-800 p-8 animate-pulse">
                <div className="h-14 w-14 bg-gray-100 rounded-2xl mb-5" />
                <div className="h-8 bg-gray-100 rounded w-20 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-24" />
              </div>
            ))}
          </div>
        ) : stats ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 mb-12">
              {[
                { title: 'Total Applications', value: stats.totalApplications, icon: FileBarChart, color: 'text-green-600' },
                { title: 'Approved', value: stats.approvedApplications, icon: CheckCircle2, color: 'text-green-600' },
                { title: 'Pending', value: stats.pendingApplications, icon: Clock, color: 'text-amber-500' },
                { title: 'Rejected', value: stats.rejectedApplications, icon: XCircle, color: 'text-red-500' },
                { title: 'Beneficiaries', value: stats.totalBeneficiaries, icon: Users, color: 'text-green-600' },
                { title: 'Amount Distributed', value: stats.welfareAmountDistributed, icon: IndianRupee, color: 'text-green-600' },
              ].map((card, i) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <StatsCard
                    title={card.title}
                    value={card.value}
                    icon={card.icon}
                    accentColor={card.color}
                  />
                </motion.div>
              ))}
            </div>

            {/* ─── Filters ─── */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <FilterBar schemes={schemes} filters={filters} onChange={setFilters} onReset={resetFilters} />
            </motion.div>

            {/* ─── Charts Section ─── */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <div className="bg-white dark:bg-gray-900 shadow-[0_8px_32px_rgba(0,0,0,0.03)] rounded-[3rem] border border-gray-100 dark:border-gray-800 hover:border-[#15803d]/40 transition-all duration-500 overflow-hidden">
                <div className="flex items-center border-b border-gray-100 dark:border-gray-800 overflow-x-auto no-scrollbar">
                  {chartConfigs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveChartTab(tab.id)}
                      className={`flex items-center gap-2.5 px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] transition-all border-b-2 shrink-0 ${
                        activeChartTab === tab.id
                          ? 'text-[#15803d] border-[#15803d] bg-[#15803d]/5'
                          : 'text-gray-400 border-transparent hover:text-gray-500 hover:bg-[#FAF9F6] dark:hover:bg-gray-800'
                      }`}
                    >
                      <tab.icon className="w-3.5 h-3.5" />
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="p-8">
                  {analytics && (
                    <>
                      {activeChartTab === 'schemes' && (
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={analytics.schemeWiseDistribution.length > 0 ? analytics.schemeWiseDistribution : [{ name: 'No Data', beneficiaries: 0, amount: 0 }]}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                              <XAxis dataKey="name" tick={{ fontSize: 11 }} tickLine={false} />
                              <YAxis tick={{ fontSize: 11 }} tickLine={false} />
                              <Tooltip
                                contentStyle={{ borderRadius: '16px', border: '1px solid #e5e7eb', fontSize: '12px' }}
                                formatter={(value: any) => [value.toLocaleString('en-IN'), '']}
                              />
                              <Legend />
                              <Bar dataKey="beneficiaries" name="Beneficiaries" fill={COLORS.primary} radius={[8, 8, 0, 0]} />
                              <Bar dataKey="amount" name="Amount (₹)" fill={COLORS.primaryLight} radius={[8, 8, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      )}

                      {activeChartTab === 'growth' && (
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={analytics.monthWiseGrowth.length > 0 ? analytics.monthWiseGrowth : [{ month: 'No Data', applications: 0, approved: 0, rejected: 0, pending: 0 }]}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                              <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} />
                              <YAxis tick={{ fontSize: 11 }} tickLine={false} />
                              <Tooltip contentStyle={{ borderRadius: '16px', border: '1px solid #e5e7eb', fontSize: '12px' }} />
                              <Legend />
                              <Line type="monotone" dataKey="applications" name="Applications" stroke={COLORS.primary} strokeWidth={2.5} dot={{ r: 4, fill: COLORS.primary }} activeDot={{ r: 6 }} />
                              <Line type="monotone" dataKey="approved" name="Approved" stroke={COLORS.primaryLight} strokeWidth={2.5} dot={{ r: 4 }} />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      )}

                      {activeChartTab === 'ratio' && (
                        <div className="h-80 flex items-center justify-center">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={(() => {
                                  const raw = [
                                    { name: 'Approved', value: analytics.approvedVsPending.approved },
                                    { name: 'Pending', value: analytics.approvedVsPending.pending },
                                    { name: 'Rejected', value: analytics.approvedVsPending.rejected },
                                  ];
                                  const filtered = raw.filter(d => d.value > 0);
                                  return filtered.length > 0 ? filtered : [{ name: 'No Data', value: 1 }];
                                })()}
                                cx="50%" cy="50%"
                                innerRadius={80}
                                outerRadius={130}
                                paddingAngle={4}
                                dataKey="value"
                                label={({ name, percent }: { name?: string; percent?: number }) => {
                                  if (name === 'No Data' || percent === undefined) return '';
                                  return `${name} ${(percent * 100).toFixed(0)}%`;
                                }}
                              >
                                {(() => {
                                  const hasData = [analytics.approvedVsPending.approved, analytics.approvedVsPending.pending, analytics.approvedVsPending.rejected].some(v => v > 0);
                                  if (!hasData) return <Cell fill="#e5e7eb" />;
                                  return [COLORS.primary, COLORS.primaryLight, COLORS.red].map((color, i) => <Cell key={i} fill={color} />);
                                })()}
                              </Pie>
                              <Tooltip contentStyle={{ borderRadius: '16px', border: '1px solid #e5e7eb' }} />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      )}

                      {activeChartTab === 'villages' && (
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={analytics.villageWiseDistribution.length > 0 ? analytics.villageWiseDistribution : [{ name: 'No Data', beneficiaries: 0, amount: 0 }]}
                              layout="vertical">
                              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                              <XAxis type="number" tick={{ fontSize: 11 }} tickLine={false} />
                              <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} tickLine={false} />
                              <Tooltip contentStyle={{ borderRadius: '16px', border: '1px solid #e5e7eb', fontSize: '12px' }} />
                              <Legend />
                              <Bar dataKey="beneficiaries" name="Beneficiaries" fill={COLORS.primary} radius={[0, 8, 8, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      )}

                      {activeChartTab === 'amounts' && (
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={analytics.welfareAmountTrends.length > 0 ? analytics.welfareAmountTrends : [{ month: 'No Data', amount: 0 }]}>
                              <defs>
                                <linearGradient id="amountGradient" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3} />
                                  <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                              <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} />
                              <YAxis tick={{ fontSize: 11 }} tickLine={false} />
                              <Tooltip contentStyle={{ borderRadius: '16px', border: '1px solid #e5e7eb', fontSize: '12px' }}
                                formatter={(value: any) => [`₹${value.toLocaleString('en-IN')}`, 'Amount']} />
                              <Area type="monotone" dataKey="amount" name="Welfare Amount" stroke={COLORS.primary} strokeWidth={2.5} fill="url(#amountGradient)" />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </motion.div>

            {/* ─── Grid: Beneficiary Table + Verification ─── */}
            <div className="grid lg:grid-cols-3 gap-8 mb-12">
              <div className="lg:col-span-2">
                <BeneficiaryTable locale={locale} />
              </div>
              <div>
                <VerificationSystem locale={locale} />
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <AlertTriangle className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-xl font-black text-gray-300">Unable to load dashboard data</h3>
            <p className="text-gray-300 font-medium mt-1">Please check the database connection.</p>
          </div>
        )}

        {/* ─── Footer info banner ─── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}              className="mt-20 p-8 bg-white dark:bg-gray-900 shadow-[0_8px_32px_rgba(0,0,0,0.03)] rounded-[3rem] border border-gray-100 dark:border-gray-800 hover:border-[#15803d]/40 transition-all duration-500"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-[#15803d]" />
              <div>
                <div className="text-sm font-bold text-[#0A0A0A] dark:text-white">Data Transparency Commitment</div>
                <p className="text-[10px] text-gray-400 font-medium mt-0.5">All data displayed is verified and updated in real-time from official Gram Panchayat records.</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-[10px] text-gray-400 font-bold flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#15803d]" /> Aadhaar data masked
              </span>
              <span className="text-[10px] text-gray-400 font-bold flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#15803d]" /> Secure verification
              </span>
              <span className="text-[10px] text-gray-400 font-bold flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#15803d]" /> Real-time sync
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <Footer locale={locale} />
    </main>
  );
}
