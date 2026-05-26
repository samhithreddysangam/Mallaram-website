'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Locale } from '@/lib/i18n';
import Navigation from '@/components/Navigation/Navigation';
import Footer from '@/components/Footer/Footer';
import {
  Users, IndianRupee, Clock, TrendingUp,
  Search, Printer, X,
  CheckCircle2, XCircle, Loader2, ChevronLeft, ChevronRight, Shield,
  FileBarChart, MapPin, AlertTriangle, RefreshCw, BarChart3,
  Eye, Activity, Award, Zap, Download
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Area, AreaChart
} from 'recharts';

// ─── Premium Color Palette ──────────────────────────────────────
const COLORS = {
  deepBlue: '#1e3a5f',
  deepBlueLight: '#2d6a9f',
  blueAccent: '#3b82f6',
  blueSoft: '#dbeafe',
  green: '#15803d',
  greenLight: '#22c55e',
  greenDark: '#14532d',
  greenGlow: 'rgba(21,128,61,0.3)',
  white: '#FFFFFF',
  bg: '#FAF9F6',
  text: '#0A0A0A',
  red: '#ef4444',
  redSoft: '#fef2f2',
  amber: '#f59e0b',
  amberSoft: '#fffbeb',
  gray: '#6b7280',
  grayLight: '#e5e7eb',
  graySoft: '#f3f4f6',
};

const CHART_PALETTE = ['#15803d', '#1e3a5f', '#22c55e', '#2d6a9f', '#3b82f6', '#14532d', '#60a5fa', '#86efac'];
const PIE_COLORS = ['#15803d', '#1e3a5f', '#ef4444'];

const GLASS_CARD = 'bg-white/90 backdrop-blur-xl border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.04)]';

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

interface Scheme { id: string; title: string; type: string; }

// ─── Animated Counter ──────────────────────────────────────────
function AnimatedCounter({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<number>(0);

  useEffect(() => {
    let startTime: number | null = null;
    const duration = 2000;
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

// ─── Status Badge ──────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; dot: string; label: string }> = {
    APPROVED: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500', label: 'Approved' },
    PENDING: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500', label: 'Pending' },
    REJECTED: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500', label: 'Rejected' },
  };
  const c = config[status] || config.PENDING;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${c.bg} ${c.text} text-[9px] font-black uppercase tracking-[0.2em]`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}

// ─── Section Header ────────────────────────────────────────────
function SectionHeader({ badge, title, highlight, description, align = 'center' }: {
  badge: string; title: string; highlight: string; description: string; align?: 'center' | 'left';
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`mb-16 md:mb-20 ${align === 'center' ? 'text-center' : ''}`}
    >
      {/* Glassmorphism badge */}
      <motion.span
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#15803d]/10 text-[#15803d] text-[10px] font-black uppercase tracking-[0.3em] mb-6 border border-[#15803d]/20"
      >
        <Eye className="w-3 h-3" />
        {badge}
      </motion.span>
      <h2 className={`text-4xl md:text-6xl font-black text-[#0A0A0A] mb-6 uppercase tracking-tighter ${align === 'left' ? '' : ''}`}>
        {title} <span className="text-[#15803d]">{highlight}</span>
      </h2>
      {/* Animated underline for center-aligned headers */}
      {align === 'center' && (
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: 80 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="h-1 bg-gradient-to-r from-[#15803d] to-[#1e3a5f] rounded-full mx-auto mb-6"
        />
      )}
      <p className={`text-gray-500 font-medium max-w-2xl leading-relaxed ${align === 'center' ? 'mx-auto' : ''}`}>
        {description}
      </p>
    </motion.div>
  );
}

// ─── Transparency Bar ──────────────────────────────────────────
function TransparencyBar({ stats }: { stats: DashboardStats | null }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="flex flex-wrap items-center justify-center gap-4 md:gap-8 mt-10 p-5 bg-[#1e3a5f]/5 rounded-[2rem] border border-[#1e3a5f]/10"
    >
      {/* Live Pulse */}
      <div className="flex items-center gap-2.5">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#15803d] opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#15803d]" />
        </span>
        <span className="text-[9px] font-black text-[#15803d] uppercase tracking-[0.2em]">Live</span>
      </div>

      {/* Last Updated */}
      <div className="flex items-center gap-2">
        <Clock className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">
          Last Updated: {currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      {/* Total Records */}
      {stats && (
        <div className="flex items-center gap-2">
          <FileBarChart className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">
            {stats.totalApplications} Total Applications · {stats.totalBeneficiaries} Beneficiaries
          </span>
        </div>
      )}

      {/* Trust Badge */}
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 rounded-full">
        <Shield className="w-3 h-3 text-emerald-600" />
        <span className="text-[8px] font-black text-emerald-700 uppercase tracking-[0.2em]">Verified Data</span>
      </div>
    </motion.div>
  );
}

// ─── Main Page Component ────────────────────────────────────────
export default function PrajaProgressTrackerPage() {
  const params = useParams();
  const locale = (params?.locale as Locale) || 'en';
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [filters, setFilters] = useState({ schemeId: '', year: '', village: '', status: '', search: '', dateFrom: '', dateTo: '' });

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
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoadingStats(false);
    }
  }, [filters.schemeId, filters.year, filters.village, filters.dateFrom, filters.dateTo]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const resetFilters = () => setFilters({ schemeId: '', year: '', village: '', status: '', search: '', dateFrom: '', dateTo: '' });

  const hasFilters = filters.schemeId || filters.year || filters.village || filters.status || filters.search || filters.dateFrom || filters.dateTo;

  // ─── Animation Variants ──────────────────────────────────────
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
  };

  const kpiCards = stats ? [
    { title: 'Total Applications', value: stats.totalApplications, icon: FileBarChart, accent: COLORS.green, label: 'All Time' },
    { title: 'Approved', value: stats.approvedApplications, icon: CheckCircle2, accent: COLORS.green, label: 'Verified' },
    { title: 'Pending', value: stats.pendingApplications, icon: Clock, accent: COLORS.amber, label: 'In Review' },
    { title: 'Rejected', value: stats.rejectedApplications, icon: XCircle, accent: COLORS.red, label: 'Denied' },
    { title: 'Beneficiaries', value: stats.totalBeneficiaries, icon: Users, accent: COLORS.deepBlue, label: 'Covered' },
    { title: 'Amount Distributed', value: stats.welfareAmountDistributed, icon: IndianRupee, accent: COLORS.deepBlueLight, label: 'Total Disbursed', isCurrency: true },
  ] : [];

  return (
    <main className="min-h-screen bg-[#FAF9F6]">
      <Navigation locale={locale} />

      {/* ═══════════════ HERO SECTION ═══════════════ */}
      <section className="pt-[80px] lg:pt-[200px] pb-20 bg-gradient-to-b from-[#FAF9F6] via-white to-[#FAF9F6] overflow-hidden relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[5%] right-[10%] w-[500px] h-[500px] bg-[#1e3a5f]/[0.03] blur-[120px] rounded-full" />
          <div className="absolute bottom-[10%] left-[5%] w-[400px] h-[400px] bg-[#15803d]/5 blur-[100px] rounded-full" />
          <div className="absolute top-[40%] left-[40%] w-[200px] h-[200px] bg-[#3b82f6]/[0.03] blur-[80px] rounded-full" />
          {/* Grid pattern overlay */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.015]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#0A0A0A" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-center"
          >
            {/* Glassmorphism badge */}
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/70 backdrop-blur-xl border border-white/40 text-[#15803d] text-[10px] font-black uppercase tracking-[0.3em] mb-8 shadow-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#15803d] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#15803d]" />
              </span>
              Transparent Governance
            </motion.span>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-8xl font-black text-[#0A0A0A] uppercase tracking-tighter leading-[0.85] mb-8">
              Praja Progress{' '}
              <span className="relative inline-block">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#15803d] via-[#1e3a5f] to-[#15803d]">
                  Tracker
                </span>
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
                  className="absolute -bottom-2 left-0 right-0 h-2 bg-gradient-to-r from-[#15803d] via-[#1e3a5f] to-[#15803d] rounded-full origin-left"
                />
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-gray-500 max-w-2xl mx-auto text-lg md:text-xl font-medium leading-relaxed">
              Track Applications, Approvals &amp; Welfare Benefits Delivered Transparently
              — powered by real-time digital intelligence.
            </p>

            {/* Quick stat badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap items-center justify-center gap-3 mt-8"
            >
              {[
                { label: 'Real-time Sync', icon: Zap, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
                { label: 'Aadhaar Verified', icon: Shield, color: 'text-blue-600 bg-blue-50 border-blue-200' },
                { label: 'Govt Data', icon: Award, color: 'text-[#1e3a5f] bg-[#1e3a5f]/5 border-[#1e3a5f]/20' },
              ].map((item, i) => (
                <span key={i} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.15em] border ${item.color}`}>
                  <item.icon className="w-3 h-3" />
                  {item.label}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* Transparency Bar */}
          <TransparencyBar stats={stats} />
        </div>
      </section>

      {/* ═══════════════ KPI STATS SECTION ═══════════════ */}
      <section className="py-32 bg-[#FAF9F6] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <div className="absolute top-[20%] right-[5%] w-[300px] h-[300px] bg-[#15803d]/5 blur-[100px] rounded-full" />
          <div className="absolute bottom-[10%] left-[5%] w-[250px] h-[250px] bg-[#1e3a5f]/5 blur-[80px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <SectionHeader
            badge="Key Metrics"
            title="Welfare"
            highlight="Dashboard"
            description="Real-time overview of welfare scheme applications, approvals, and benefits distributed across Mallaram."
          />

          {loadingStats ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="p-8 bg-white rounded-[2.5rem] border border-gray-100 animate-pulse">
                  <div className="w-14 h-14 bg-gray-100 rounded-2xl mb-6" />
                  <div className="h-3 bg-gray-100 rounded w-16 mb-2" />
                  <div className="h-8 bg-gray-100 rounded w-24 mb-4" />
                  <div className="h-2 bg-gray-100 rounded w-20" />
                </div>
              ))}
            </div>
          ) : stats ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5"
            >
              {kpiCards.map((card, i) => (
                <motion.div
                  key={card.title}
                  variants={itemVariants}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="group relative p-8 bg-white shadow-[0_8px_32px_rgba(0,0,0,0.03)] rounded-[2.5rem] border border-gray-100 transition-all duration-500 overflow-hidden"
                >
                  {/* Gradient border on hover */}
                  <div className="absolute inset-0 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background: `linear-gradient(135deg, ${card.accent}08, transparent 60%)`,
                    }}
                  />

                  {/* Icon */}
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-500"
                    style={{ backgroundColor: `${card.accent}12`, color: card.accent }}
                  >
                    <card.icon className="w-7 h-7" />
                  </div>

                  {/* Label */}
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">
                    {card.title}
                  </p>

                  {/* Value */}
                  <div className="text-2xl md:text-3xl font-black text-[#0A0A0A] tracking-tighter mb-4">
                    {card.isCurrency ? (
                      <AnimatedCounter value={card.value} prefix="₹" />
                    ) : (
                      <AnimatedCounter value={card.value} />
                    )}
                  </div>

                  {/* Bottom bar */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: card.accent }}>
                      {card.label}
                    </span>
                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: card.accent }} />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-20">
              <AlertTriangle className="w-16 h-16 text-gray-200 mx-auto mb-4" />
              <h3 className="text-xl font-black text-gray-300">Unable to load data</h3>
              <p className="text-gray-300 font-medium mt-1">Please check the database connection.</p>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════ ANALYTICS SECTION ═══════════════ */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[15%] left-[5%] w-[400px] h-[400px] bg-[#1e3a5f]/[0.02] blur-[100px] rounded-full" />
          <div className="absolute bottom-[5%] right-[10%] w-[300px] h-[300px] bg-[#15803d]/5 blur-[80px] rounded-full" />
          <svg className="absolute inset-0 w-full h-full opacity-[0.012]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid2" width="60" height="60" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="#0A0A0A" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid2)" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <SectionHeader
            badge="Data Analytics"
            title="Application"
            highlight="Analytics"
            description="Comprehensive analytics on welfare distribution, approval trends, and village-wise coverage with smart filtering."
          />

          {/* ─── Smart Filters ─── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            {/* Toggle button (mobile) */}
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="lg:hidden flex items-center gap-2 w-full px-5 py-4 bg-[#FAF9F6] rounded-2xl border border-gray-100 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4"
            >
              <BarChart3 className="w-4 h-4" />
              Filters & Controls
              <motion.span animate={{ rotate: filtersOpen ? 180 : 0 }} className="ml-auto">
                <ChevronLeft className="w-4 h-4" />
              </motion.span>
            </button>

            <motion.div
              initial={false}
              animate={{ height: filtersOpen || typeof window !== 'undefined' && window.innerWidth >= 1024 ? 'auto' : 0 }}
              className="overflow-hidden"
            >
              <div className="p-6 md:p-8 bg-[#FAF9F6] rounded-[2.5rem] border border-gray-100 shadow-sm">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
                  {/* Scheme */}
                  <select value={filters.schemeId} onChange={e => setFilters(f => ({ ...f, schemeId: e.target.value }))}
                    className="col-span-2 md:col-span-1 px-4 py-3 bg-white border border-gray-100 rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#15803d]/20 focus:border-[#15803d] transition-all appearance-none">
                    <option value="">All Schemes</option>
                    {schemes.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                  </select>

                  {/* Year */}
                  <select value={filters.year} onChange={e => setFilters(f => ({ ...f, year: e.target.value }))}
                    className="px-4 py-3 bg-white border border-gray-100 rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#15803d]/20 focus:border-[#15803d] transition-all appearance-none">
                    {Array.from({ length: 6 }, (_, i) => (new Date().getFullYear() - i).toString()).map(y => <option key={y} value={y}>{y}</option>)}
                  </select>

                  {/* Status */}
                  <select value={filters.status} onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
                    className="px-4 py-3 bg-white border border-gray-100 rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#15803d]/20 focus:border-[#15803d] transition-all appearance-none">
                    <option value="">All Status</option>
                    <option value="APPROVED">Approved</option>
                    <option value="PENDING">Pending</option>
                    <option value="REJECTED">Rejected</option>
                  </select>

                  {/* Village */}
                  <select value={filters.village} onChange={e => setFilters(f => ({ ...f, village: e.target.value }))}
                    className="px-4 py-3 bg-white border border-gray-100 rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#15803d]/20 focus:border-[#15803d] transition-all appearance-none">
                    <option value="">All Villages</option>
                    <option value="Mallaram">Mallaram</option>
                    <option value="Vemulawada">Vemulawada</option>
                    <option value="Kodurupaka">Kodurupaka</option>
                  </select>

                  {/* Search */}
                  <div className="relative col-span-2 md:col-span-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                    <input type="text" value={filters.search} onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
                      placeholder="Search..."
                      className="w-full pl-10 pr-4 py-3 bg-white border border-gray-100 rounded-2xl text-xs font-bold placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#15803d]/20 focus:border-[#15803d] transition-all" />
                  </div>

                  {/* Date range */}
                  <div className="col-span-2 md:col-span-1 lg:col-span-2 flex gap-2">
                    <input type="date" value={filters.dateFrom} onChange={e => setFilters(f => ({ ...f, dateFrom: e.target.value }))}
                      className="flex-1 px-3 py-3 bg-white border border-gray-100 rounded-2xl text-[10px] font-bold focus:outline-none focus:ring-2 focus:ring-[#15803d]/20 focus:border-[#15803d] transition-all" title="Date from" />
                    <input type="date" value={filters.dateTo} onChange={e => setFilters(f => ({ ...f, dateTo: e.target.value }))}
                      className="flex-1 px-3 py-3 bg-white border border-gray-100 rounded-2xl text-[10px] font-bold focus:outline-none focus:ring-2 focus:ring-[#15803d]/20 focus:border-[#15803d] transition-all" title="Date to" />
                  </div>
                </div>

                {hasFilters && (
                  <div className="flex justify-end mt-4">
                    <button onClick={resetFilters} className="flex items-center gap-1.5 px-4 py-2 text-[9px] font-black text-red-500 uppercase tracking-[0.2em] hover:bg-red-50 rounded-full transition-all">
                      <X className="w-3 h-3" /> Clear Filters
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>

          {/* ─── Charts Grid ─── */}
          {analytics && (
            <div className="space-y-8">
              {/* Row 1: Scheme-wise + Status Ratio */}
              <div className="grid md:grid-cols-3 gap-8">
                {/* Scheme-wise Distribution */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="md:col-span-2 p-8 md:p-10 bg-[#FAF9F6] rounded-[2.5rem] border border-gray-100 hover:border-[#15803d]/20 transition-all duration-500 shadow-sm"
                >
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#15803d] to-[#1e3a5f] flex items-center justify-center shadow-lg shadow-[#15803d]/20">
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-[#0A0A0A] uppercase tracking-tighter">Scheme-wise Distribution</h3>
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-0.5">Beneficiaries &amp; Amount per Scheme</p>
                    </div>
                  </div>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analytics.schemeWiseDistribution.length > 0 ? analytics.schemeWiseDistribution : [{ name: 'No Data', beneficiaries: 0, amount: 0 }]}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="name" tick={{ fontSize: 10 }} tickLine={false} />
                        <YAxis tick={{ fontSize: 10 }} tickLine={false} />
                        <Tooltip
                          contentStyle={{ borderRadius: '16px', border: '1px solid #e5e7eb', fontSize: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.06)' }}
                          cursor={{ fill: 'rgba(21,128,61,0.05)' }}
                        />
                        <Legend wrapperStyle={{ fontSize: '10px' }} />
                        <Bar dataKey="beneficiaries" name="Beneficiaries" fill={COLORS.green} radius={[6, 6, 0, 0]} maxBarSize={40} />
                        <Bar dataKey="amount" name="Amount (₹)" fill={COLORS.deepBlue} radius={[6, 6, 0, 0]} maxBarSize={40} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>

                {/* Status Ratio */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="p-8 md:p-10 bg-[#FAF9F6] rounded-[2.5rem] border border-gray-100 hover:border-[#15803d]/20 transition-all duration-500 shadow-sm"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-[#0A0A0A] uppercase tracking-tighter">Status Ratio</h3>
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-0.5">Approved / Pending / Rejected</p>
                    </div>
                  </div>
                  <div className="h-64 flex items-center justify-center">
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
                          cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={4} dataKey="value"
                          label={({ name, percent }: { name?: string; percent?: number }) => {
                            if (name === 'No Data' || percent === undefined || percent < 0.05) return '';
                            return `${(percent * 100).toFixed(0)}%`;
                          }}
                          labelLine={false}
                        >
                          {PIE_COLORS.map((color, i) => <Cell key={i} fill={color} />)}
                        </Pie>
                        <Tooltip
                          contentStyle={{ borderRadius: '16px', border: '1px solid #e5e7eb', fontSize: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.06)' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-wrap justify-center gap-4 mt-4">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#15803d]" />
                      <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Approved ({analytics.approvedVsPending.approved})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#1e3a5f]" />
                      <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Pending ({analytics.approvedVsPending.pending})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                      <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Rejected ({analytics.approvedVsPending.rejected})</span>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Row 2: Amount Trends + Monthly Growth */}
              <div className="grid md:grid-cols-2 gap-8">
                {/* Amount Trends */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="p-8 md:p-10 bg-[#FAF9F6] rounded-[2.5rem] border border-gray-100 hover:border-[#15803d]/20 transition-all duration-500 shadow-sm"
                >
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-[#1e3a5f] flex items-center justify-center shadow-lg shadow-blue-500/20">
                      <IndianRupee className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-[#0A0A0A] uppercase tracking-tighter">Welfare Amount Trends</h3>
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-0.5">Monthly disbursement over time</p>
                    </div>
                  </div>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={analytics.welfareAmountTrends.length > 0 ? analytics.welfareAmountTrends : [{ month: 'No Data', amount: 0 }]}>
                        <defs>
                          <linearGradient id="blueGreenGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={COLORS.deepBlue} stopOpacity={0.3} />
                            <stop offset="50%" stopColor={COLORS.green} stopOpacity={0.15} />
                            <stop offset="95%" stopColor={COLORS.green} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="month" tick={{ fontSize: 10 }} tickLine={false} />
                        <YAxis tick={{ fontSize: 10 }} tickLine={false} />
                        <Tooltip
                          contentStyle={{ borderRadius: '16px', border: '1px solid #e5e7eb', fontSize: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.06)' }}
                          cursor={{ stroke: '#15803d', strokeWidth: 1, strokeDasharray: '4 4' }}
                        />
                        <Area type="monotone" dataKey="amount" name="Welfare Amount" stroke={COLORS.deepBlue} strokeWidth={2.5} fill="url(#blueGreenGradient)" dot={{ r: 3, fill: COLORS.deepBlue }} activeDot={{ r: 6, fill: COLORS.green }} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>

                {/* Monthly Growth */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="p-8 md:p-10 bg-[#FAF9F6] rounded-[2.5rem] border border-gray-100 hover:border-[#15803d]/20 transition-all duration-500 shadow-sm"
                >
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#15803d] to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-[#0A0A0A] uppercase tracking-tighter">Monthly Growth</h3>
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-0.5">Applications over months</p>
                    </div>
                  </div>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={analytics.monthWiseGrowth.length > 0 ? analytics.monthWiseGrowth : [{ month: 'No Data', applications: 0, approved: 0, rejected: 0, pending: 0 }]}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="month" tick={{ fontSize: 10 }} tickLine={false} />
                        <YAxis tick={{ fontSize: 10 }} tickLine={false} />
                        <Tooltip
                          contentStyle={{ borderRadius: '16px', border: '1px solid #e5e7eb', fontSize: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.06)' }}
                          cursor={{ stroke: '#1e3a5f', strokeWidth: 1, strokeDasharray: '4 4' }}
                        />
                        <Legend wrapperStyle={{ fontSize: '10px' }} />
                        <Line type="monotone" dataKey="applications" name="Applications" stroke={COLORS.deepBlue} strokeWidth={2.5} dot={{ r: 3, fill: COLORS.deepBlue }} activeDot={{ r: 5, fill: COLORS.deepBlue }} />
                        <Line type="monotone" dataKey="approved" name="Approved" stroke={COLORS.green} strokeWidth={2.5} dot={{ r: 3, fill: COLORS.green }} />
                        <Line type="monotone" dataKey="rejected" name="Rejected" stroke={COLORS.red} strokeWidth={2} dot={{ r: 2, fill: COLORS.red }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              </div>

              {/* Row 3: Village-wise Distribution */}
              {analytics.villageWiseDistribution.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="p-8 md:p-10 bg-[#FAF9F6] rounded-[2.5rem] border border-gray-100 hover:border-[#15803d]/20 transition-all duration-500 shadow-sm"
                >
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1e3a5f] to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-[#0A0A0A] uppercase tracking-tighter">Village-wise Coverage</h3>
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-0.5">Welfare distribution across villages</p>
                    </div>
                  </div>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analytics.villageWiseDistribution} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                        <XAxis type="number" tick={{ fontSize: 10 }} tickLine={false} />
                        <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} tickLine={false} width={100} />
                        <Tooltip
                          contentStyle={{ borderRadius: '16px', border: '1px solid #e5e7eb', fontSize: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.06)' }}
                          cursor={{ fill: 'rgba(21,128,61,0.05)' }}
                        />
                        <Legend wrapperStyle={{ fontSize: '10px' }} />
                        <Bar dataKey="beneficiaries" name="Beneficiaries" fill={COLORS.green} radius={[0, 6, 6, 0]} maxBarSize={24} />
                        <Bar dataKey="amount" name="Amount (₹)" fill={COLORS.deepBlue} radius={[0, 6, 6, 0]} maxBarSize={24} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════ BENEFICIARY TABLE ═══════════════ */}
      <BeneficiaryTableSection locale={locale} />

      {/* ═══════════════ VERIFICATION + TRANSPARENCY ═══════════════ */}
      <section className="py-24 bg-[#FAF9F6] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[20%] left-[5%] w-[400px] h-[400px] bg-[#15803d]/5 blur-[100px] rounded-full" />
          <div className="absolute bottom-[10%] right-[5%] w-[300px] h-[300px] bg-[#1e3a5f]/5 blur-[80px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Verification Widget */}
            <VerificationSystemWidget />

            {/* Transparency Commitment Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-10 md:p-14 bg-gradient-to-br from-[#1e3a5f] to-[#0a1628] rounded-[3rem] text-white relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#15803d]/10 blur-[60px] rounded-full" />

              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center mb-8 border border-white/10">
                  <Shield className="w-8 h-8 text-emerald-400" />
                </div>

                <h3 className="text-3xl font-black uppercase tracking-tighter mb-4">
                  Data Transparency <span className="text-emerald-400">Commitment</span>
                </h3>
                <p className="text-white/60 font-medium leading-relaxed mb-10">
                  All data displayed on this portal is verified from official Gram Panchayat records
                  and updated in real-time to ensure complete transparency.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: 'Aadhaar Masked', desc: 'Only last 4 digits stored', icon: Shield },
                    { label: 'Secure Verification', desc: 'End-to-end encrypted', icon: Eye },
                    { label: 'Real-time Sync', desc: 'Live data from GP records', icon: Activity },
                    { label: 'Open Data', desc: 'Accessible to all citizens', icon: Award },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
                      <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
                        <item.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white uppercase tracking-widest">{item.label}</p>
                        <p className="text-[9px] text-white/40 font-medium mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer locale={locale} />
    </main>
  );
}

// ═══════════════════════════════════════════════════════════════
// BENEFICIARY TABLE SECTION
// ═══════════════════════════════════════════════════════════════
function BeneficiaryTableSection({ locale }: { locale: Locale }) {
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');

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
      a.benefitAmount ? `\u20b9${a.benefitAmount}` : '', new Date(a.applicationDate).toLocaleDateString(),
      a.approvalDate ? new Date(a.approvalDate).toLocaleDateString() : '',
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
    <section className="py-32 bg-white relative overflow-hidden print:py-10">
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-[10%] right-[5%] w-[400px] h-[400px] bg-[#15803d]/5 blur-[100px] rounded-full" />
        <div className="absolute bottom-[20%] left-[5%] w-[300px] h-[300px] bg-[#1e3a5f]/5 blur-[80px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <SectionHeader
          badge="Records"
          title="Beneficiary"
          highlight="Records"
          description="Complete list of all welfare applications and beneficiaries. Search, filter, and export data for offline analysis."
        />

        {/* Controls: Search + Export */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <div className="p-6 md:p-8 bg-[#FAF9F6] rounded-[2.5rem] border border-gray-100 shadow-sm">
            <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text" value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search by name, phone or application ID..."
                  className="w-full pl-12 pr-5 py-4 bg-white border border-gray-100 rounded-2xl text-sm font-bold placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#15803d]/20 focus:border-[#15803d] transition-all"
                />
              </div>
              {/* Export buttons */}
              <div className="flex gap-3 shrink-0">
                <button onClick={exportCSV}
                  className="px-6 py-4 bg-white hover:bg-[#15803d] hover:text-white border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2.5 transition-all group">
                  <Download className="w-4 h-4 text-[#15803d] group-hover:text-white transition-colors" /> CSV
                </button>
                <button onClick={handlePrint}
                  className="px-6 py-4 bg-white hover:bg-gray-50 border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2.5 transition-all">
                  <Printer className="w-4 h-4" /> Print
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white shadow-[0_8px_32px_rgba(0,0,0,0.03)] rounded-[2.5rem] border border-gray-100 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left print:table-auto">                <thead className="sticky top-0 z-10">
                  <tr className="bg-[#FAF9F6] text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">
                  <th className="px-6 md:px-8 py-5">Applicant</th>
                  <th className="px-6 md:px-8 py-5">Scheme</th>
                  <th className="px-6 md:px-8 py-5 hidden md:table-cell">Village</th>
                  <th className="px-6 md:px-8 py-5 hidden sm:table-cell">Date</th>
                  <th className="px-6 md:px-8 py-5">Status</th>
                  <th className="px-6 md:px-8 py-5 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-8 py-20 text-center">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-300" />
                    </td>
                  </tr>
                ) : applications.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-8 py-16 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <FileBarChart className="w-10 h-10 text-gray-200" />
                        <span className="text-gray-300 font-bold italic">No records found.</span>
                      </div>
                    </td>
                  </tr>
                ) : applications.map((app) => (
                  <tr key={app.id} className="hover:bg-[#FAF9F6]/80 transition-colors group">
                    <td className="px-6 md:px-8 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#15803d] to-[#1e3a5f] flex items-center justify-center text-white text-sm font-black shadow-sm">
                          {app.applicantName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-sm text-[#0A0A0A]">{app.applicantName}</div>
                          {app.applicantPhone && <div className="text-[10px] text-gray-400 font-medium">{app.applicantPhone}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 md:px-8 py-4">
                      <span className="inline-block px-3 py-1 bg-[#15803d]/5 text-[#15803d] rounded-xl text-[10px] font-bold">{app.scheme.title}</span>
                    </td>
                    <td className="px-6 md:px-8 py-4 hidden md:table-cell">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span className="text-xs font-medium text-gray-500">{app.village}{app.ward ? ` (${app.ward})` : ''}</span>
                      </div>
                    </td>
                    <td className="px-6 md:px-8 py-4 hidden sm:table-cell">
                      <div className="text-xs font-bold text-gray-500">
                        {new Date(app.applicationDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </div>
                    </td>
                    <td className="px-6 md:px-8 py-4">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="px-6 md:px-8 py-4 text-right">
                      <span className="text-sm font-black text-[#0A0A0A]">
                        {app.benefitAmount ? `\u20b9${app.benefitAmount.toLocaleString('en-IN')}` : '\u2014'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 md:px-8 py-5 border-t border-gray-100 flex items-center justify-between bg-[#FAF9F6]/50">
              <span className="text-[10px] font-bold text-gray-400">Page {page} of {totalPages}</span>
              <div className="flex gap-2">
                <button disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}
                  className="px-4 py-2 bg-white disabled:opacity-30 rounded-xl text-xs font-bold hover:bg-gray-100 transition-all border border-gray-100 shadow-sm">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button disabled={page >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  className="px-4 py-2 bg-white disabled:opacity-30 rounded-xl text-xs font-bold hover:bg-gray-100 transition-all border border-gray-100 shadow-sm">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// VERIFICATION SYSTEM WIDGET
// ═══════════════════════════════════════════════════════════════
function VerificationSystemWidget() {
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
        body: JSON.stringify({ aadhaarLast4: aadhaar || undefined, applicationId: appId || undefined }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Verification failed'); }
      else { setResult(data); }
    } catch {
      setError('Verification failed. Please try again.');
    } finally { setLoading(false); }
  };

  const handleReset = () => { setAadhaar(''); setAppId(''); setResult(null); setError(''); };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="p-10 md:p-14 bg-white rounded-[3rem] border border-gray-100 hover:border-[#15803d]/20 transition-all duration-500 shadow-sm"
    >
      <div className="flex items-center gap-4 mb-10">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#15803d] to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <Shield className="w-7 h-7 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-black text-[#0A0A0A] uppercase tracking-tighter">Public Verification</h3>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-0.5">Verify your application status securely</p>
        </div>
      </div>

      {!result ? (
        <form onSubmit={handleVerify} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2.5">Aadhaar (Last 4 Digits)</label>
              <input type="text" maxLength={4} pattern="[0-9]{4}" value={aadhaar}
                onChange={e => setAadhaar(e.target.value.replace(/\D/g, '').slice(0, 4))} placeholder="XXXX"
                className="w-full px-5 py-4 bg-[#FAF9F6] border border-gray-100 rounded-2xl text-sm font-bold text-center text-2xl tracking-[0.3em] focus:outline-none focus:ring-2 focus:ring-[#15803d]/20 focus:border-[#15803d] transition-all"
                disabled={!!appId} />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2.5">OR Application ID</label>
              <input type="text" value={appId} onChange={e => setAppId(e.target.value)} placeholder="e.g., cm0..."
                className="w-full px-5 py-4 bg-[#FAF9F6] border border-gray-100 rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#15803d]/20 focus:border-[#15803d] transition-all"
                disabled={!!aadhaar} />
            </div>
          </div>
          {error && (
            <div className="flex items-center gap-2.5 p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold border border-red-100">
              <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}
          <button type="submit" disabled={loading || (!aadhaar && !appId)}
            className="w-full px-6 py-5 bg-gradient-to-r from-[#15803d] to-emerald-600 hover:from-[#14532d] hover:to-[#15803d] disabled:opacity-50 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2.5 transition-all shadow-xl shadow-[#15803d]/20">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            {loading ? 'Verifying...' : 'Verify Status'}
          </button>
        </form>
      ) : (
        <div className="space-y-6">
          {result.multiple ? (
            <div>
              <div className="flex items-center gap-2.5 mb-5 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-bold text-emerald-700">{result.applications.length} application(s) found</span>
              </div>
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {result.applications.map((app: any) => (
                  <div key={app.applicationId} className="p-6 bg-[#FAF9F6] rounded-2xl border border-gray-100 hover:bg-white transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{app.schemeName}</span>
                      <StatusBadge status={app.status} />
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div><span className="text-gray-400 font-medium">Applicant:</span> <span className="font-bold">{app.applicantName}</span></div>
                      <div><span className="text-gray-400 font-medium">Date:</span> <span className="font-bold">{new Date(app.applicationDate).toLocaleDateString()}</span></div>
                      {app.benefitAmount && <div><span className="text-gray-400 font-medium">Amount:</span> <span className="font-bold text-emerald-600">\u20b9{app.benefitAmount.toLocaleString('en-IN')}</span></div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 mb-6 p-4 bg-[#FAF9F6] rounded-2xl">
                <div className={`w-3 h-3 rounded-full ${result.application.status === 'APPROVED' ? 'bg-emerald-500' : result.application.status === 'REJECTED' ? 'bg-red-500' : 'bg-amber-500'}`} />
                <span className="text-sm font-bold text-[#0A0A0A]">Application Status</span>
              </div>
              <div className="p-6 bg-[#FAF9F6] rounded-2xl border border-gray-100">
                <div className="grid grid-cols-2 gap-5 text-sm">
                  <div>
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Scheme</div>
                    <div className="font-bold text-[#0A0A0A]">{result.application.schemeName}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Status</div>
                    <StatusBadge status={result.application.status} />
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Application Date</div>
                    <div className="font-bold text-[#0A0A0A]">{new Date(result.application.applicationDate).toLocaleDateString()}</div>
                  </div>
                  {result.application.benefitAmount && (
                    <div>
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Benefit Amount</div>
                      <div className="font-bold text-emerald-600">\u20b9{result.application.benefitAmount.toLocaleString('en-IN')}</div>
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
          <button onClick={handleReset}
            className="w-full px-6 py-4 bg-[#FAF9F6] hover:bg-gray-100 text-gray-500 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2.5 transition-all border border-gray-100">
            <RefreshCw className="w-4 h-4" /> Check Another
          </button>
        </div>
      )}
    </motion.div>
  );
}
