'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Locale, getDictionary } from '@/lib/i18n';
import Navigation from '@/components/Navigation/Navigation';
import Footer from '@/components/Footer/Footer';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Search, Database, Upload, Check, X, IndianRupee, Plus, Bell, MapPin, Calendar, CalendarDays, Clock, Trash2, ExternalLink, Edit, Image, Landmark, DollarSign, Tag, Activity, Droplets, Shield, BarChart3 } from 'lucide-react';
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
  
  // Gallery
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [galleryForm, setGalleryForm] = useState({ alt: '', description: '', file: null as File | null });
  
  // Fund Usage
  const [fundRecords, setFundRecords] = useState<any[]>([]);
  const [showFundModal, setShowFundModal] = useState(false);
  const [editingFund, setEditingFund] = useState<string | null>(null);
  const [newFund, setNewFund] = useState({ label: '', amount: '', description: '', date: new Date().toISOString().split('T')[0], category: '', phase: 'Completed', fundSource: '' });
  
  // Fund Allocations
  const [fundAllocations, setFundAllocations] = useState<any[]>([]);
  const [showAllocModal, setShowAllocModal] = useState(false);
  const [editingAlloc, setEditingAlloc] = useState<string | null>(null);
  const [newAlloc, setNewAlloc] = useState({ totalAmount: '', source: '', fiscalYear: '2025-2026', description: '' });
  
  // Market Prices editing
  const [editingPrice, setEditingPrice] = useState<string | null>(null);
  const [priceSearch, setPriceSearch] = useState('');
  
  // Village Metrics
  const [villageMetrics, setVillageMetrics] = useState<any[]>([]);
  const [showVillageMetricModal, setShowVillageMetricModal] = useState(false);
  const [editingVillageMetric, setEditingVillageMetric] = useState<string | null>(null);
  const [newVillageMetric, setNewVillageMetric] = useState({ label: '', value: '', status: 'Active', icon: 'Activity', color: 'text-green-500', bg: 'bg-green-500/10', order: '0' });
  
  // Village Performance
  const [villagePerformance, setVillagePerformance] = useState<any[]>([]);
  const [showVillagePerfModal, setShowVillagePerfModal] = useState(false);
  const [editingVillagePerf, setEditingVillagePerf] = useState<string | null>(null);
  const [newVillagePerf, setNewVillagePerf] = useState({ label: '', value: '', percentage: '85', order: '0' });
  
  // Water Sources
  const [waterSources, setWaterSources] = useState<any[]>([]);
  const [showWaterSourceModal, setShowWaterSourceModal] = useState(false);
  const [editingWaterSource, setEditingWaterSource] = useState<string | null>(null);
  const [newWaterSource, setNewWaterSource] = useState({ label: '', level: '50', status: 'Normal', icon: 'Droplets', order: '0' });
  
  // Village Officials
  const [villageOfficials, setVillageOfficials] = useState<any[]>([]);
  const [showOfficialModal, setShowOfficialModal] = useState(false);
  const [editingOfficial, setEditingOfficial] = useState<string | null>(null);
  const [uploadingOfficial, setUploadingOfficial] = useState(false);
  const [officialForm, setOfficialForm] = useState({ name: '', title: '', description: '', order: '0', file: null as File | null });
  
  // Village Events
  const [villageEvents, setVillageEvents] = useState<any[]>([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<string | null>(null);
  const [newEvent, setNewEvent] = useState({ title: '', description: '', imageUrl: '', date: '', category: 'local', order: '0' });
  
  // Form States
  const [newPrice, setNewPrice] = useState({ cropName: '', price: '', unit: 'Quintal', district: 'Rajanna Sircilla' });
  const [newSlot, setNewSlot] = useState({ 
    date: new Date().toISOString().split('T')[0], 
    startTime: '09:00', 
    endTime: '10:00', 
    capacity: '10',
    location: 'IKP Centre Mallaram'
  });
  const [newScheme, setNewScheme] = useState({ title: '', link: '', description: '' });
  const [editingScheme, setEditingScheme] = useState<string | null>(null);
  
  // Praja Tracker
  const [prajaApplications, setPrajaApplications] = useState<any[]>([]);
  const [prajaStats, setPrajaStats] = useState({ total: 0, approved: 0, pending: 0, rejected: 0 });

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
      setBookings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    }
  };

  const fetchMarketPrices = async () => {
    try {
      const res = await fetch('/api/market-prices');
      const data = await res.json();
      setMarketPrices(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch market prices:', error);
    }
  };

  const fetchSlots = async () => {
    try {
      // Fetch all slots (including potentially expired ones for management)
      const res = await fetch('/api/slots?all=true');
      const data = await res.json();
      setSlots(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch slots:', error);
    }
  };

  const fetchGallery = async () => {
    try {
      const res = await fetch('/api/gallery');
      const data = await res.json();
      setGalleryImages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch gallery:', error);
    }
  };

  const fetchFundUsage = async () => {
    try {
      const res = await fetch('/api/fund-usage');
      const data = await res.json();
      setFundRecords(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch fund usage:', error);
    }
  };

  const fetchFundAllocations = async () => {
    try {
      const res = await fetch('/api/fund-allocations');
      const data = await res.json();
      setFundAllocations(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch fund allocations:', error);
    }
  };

  const fetchSchemes = async () => {
    try {
      const res = await fetch('/api/schemes');
      const data = await res.json();
      setSchemes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch schemes:', error);
    }
  };

  const fetchVillageMetrics = async () => {
    try {
      const res = await fetch('/api/village-metrics');
      const data = await res.json();
      setVillageMetrics(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch village metrics:', error);
    }
  };

  const fetchVillagePerformance = async () => {
    try {
      const res = await fetch('/api/village-performance');
      const data = await res.json();
      setVillagePerformance(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch village performance:', error);
    }
  };

  const fetchWaterSources = async () => {
    try {
      const res = await fetch('/api/water-sources');
      const data = await res.json();
      setWaterSources(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch water sources:', error);
    }
  };

  const fetchVillageOfficials = async () => {
    try {
      const res = await fetch('/api/village-officials');
      const data = await res.json();
      setVillageOfficials(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch village officials:', error);
    }
  };

  const fetchVillageEvents = async () => {
    try {
      const res = await fetch('/api/events');
      const data = await res.json();
      setVillageEvents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
  };

  const fetchPrajaApplications = async () => {
    try {
      // Fetch stats from dedicated endpoint for accurate counts
      const [statsRes, appsRes] = await Promise.all([
        fetch('/api/praja-stats'),
        fetch('/api/applications?limit=5'),
      ]);
      const stats = await statsRes.json();
      const appsData = await appsRes.json();
      
      setPrajaApplications(appsData.applications || []);
      setPrajaStats({
        total: stats.totalApplications || 0,
        approved: stats.approvedApplications || 0,
        pending: stats.pendingApplications || 0,
        rejected: stats.rejectedApplications || 0,
      });
    } catch (error) {
      console.error('Failed to fetch praja applications:', error);
    }
  };

  const fetchData = async () => {
    // loading is true by default, so we don't need to set it here
    // unless we want to show loading on subsequent refreshes
    await Promise.all([
      fetchBookings(),
      fetchMarketPrices(),
      fetchSlots(),
      fetchSchemes(),
      fetchGallery(),
      fetchFundUsage(),
      fetchFundAllocations(),
      fetchVillageMetrics(),
      fetchVillagePerformance(),
      fetchWaterSources(),
      fetchVillageOfficials(),
      fetchVillageEvents(),
      fetchPrajaApplications(),
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
      const method = editingPrice ? 'PUT' : 'POST';
      const url = editingPrice 
        ? `/api/market-prices?id=${editingPrice}`
        : '/api/market-prices';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPrice),
      });
      if (res.ok) {
        setShowPriceModal(false);
        setNewPrice({ cropName: '', price: '', unit: 'Quintal', district: 'Rajanna Sircilla' });
        setEditingPrice(null);
        fetchMarketPrices();
      }
    } catch (error) {
      console.error('Failed to save price:', error);
    }
  };

  const handleDeletePrice = async (id: string) => {
    if (!confirm('Are you sure you want to delete this market price entry?')) return;
    try {
      const res = await fetch(`/api/market-prices?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchMarketPrices();
    } catch (error) {
      console.error('Failed to delete price:', error);
    }
  };

  const startEditPrice = (price: any) => {
    setNewPrice({
      cropName: price.cropName,
      price: price.price.toString(),
      unit: price.unit || 'Quintal',
      district: price.district || 'Rajanna Sircilla',
    });
    setEditingPrice(price.id);
    setShowPriceModal(true);
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

  const handleGalleryUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryForm.file) return;
    
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', galleryForm.file);
      formData.append('alt', galleryForm.alt || 'Mallaram Gallery');
      formData.append('description', galleryForm.description || '');

      const res = await fetch('/api/gallery', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        setShowGalleryModal(false);
        setGalleryForm({ alt: '', description: '', file: null });
        fetchGallery();
      }
    } catch (error) {
      console.error('Failed to upload image:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteGalleryImage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;
    try {
      const res = await fetch(`/api/gallery?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchGallery();
    } catch (error) {
      console.error('Failed to delete image:', error);
    }
  };

  const handleAddFund = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingFund ? 'PUT' : 'POST';
      const body = editingFund 
        ? { id: editingFund, ...newFund }
        : newFund;
      
      const res = await fetch('/api/fund-usage', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setShowFundModal(false);
        setNewFund({ label: '', amount: '', description: '', date: new Date().toISOString().split('T')[0], category: '', phase: 'Completed', fundSource: '' });
        setEditingFund(null);
        fetchFundUsage();
      }
    } catch (error) {
      console.error('Failed to save fund record:', error);
    }
  };

  const handleDeleteFund = async (id: string) => {
    if (!confirm('Are you sure you want to delete this fund record?')) return;
    try {
      const res = await fetch(`/api/fund-usage?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchFundUsage();
    } catch (error) {
      console.error('Failed to delete fund record:', error);
    }
  };

  const startEditFund = (record: any) => {
    setNewFund({
      label: record.label,
      amount: record.amount.toString(),
      description: record.description || '',
      date: new Date(record.date).toISOString().split('T')[0],
      category: record.category || '',
      phase: record.phase || 'Completed',
      fundSource: record.fundSource || '',
    });
    setEditingFund(record.id);
    setShowFundModal(true);
  };

  // Fund Allocations CRUD
  const handleAddAlloc = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingAlloc ? 'PUT' : 'POST';
      const body = editingAlloc 
        ? { id: editingAlloc, ...newAlloc }
        : newAlloc;
      
      const res = await fetch('/api/fund-allocations', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setShowAllocModal(false);
        setNewAlloc({ totalAmount: '', source: '', fiscalYear: '2025-2026', description: '' });
        setEditingAlloc(null);
        fetchFundAllocations();
      }
    } catch (error) {
      console.error('Failed to save fund allocation:', error);
    }
  };

  const handleDeleteAlloc = async (id: string) => {
    if (!confirm('Are you sure you want to delete this fund allocation?')) return;
    try {
      const res = await fetch(`/api/fund-allocations?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchFundAllocations();
    } catch (error) {
      console.error('Failed to delete fund allocation:', error);
    }
  };

  const startEditAlloc = (record: any) => {
    setNewAlloc({
      totalAmount: record.totalAmount.toString(),
      source: record.source || '',
      fiscalYear: record.fiscalYear || '2025-2026',
      description: record.description || '',
    });
    setEditingAlloc(record.id);
    setShowAllocModal(true);
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

  // Village Metric CRUD
  const handleAddVillageMetric = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingVillageMetric ? 'PUT' : 'POST';
      const url = editingVillageMetric ? `/api/village-metrics?id=${editingVillageMetric}` : '/api/village-metrics';
      const body = { ...newVillageMetric, order: parseInt(newVillageMetric.order) || 0 };
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setShowVillageMetricModal(false);
        setNewVillageMetric({ label: '', value: '', status: 'Active', icon: 'Activity', color: 'text-green-500', bg: 'bg-green-500/10', order: '0' });
        setEditingVillageMetric(null);
        fetchVillageMetrics();
      }
    } catch (error) {
      console.error('Failed to save village metric:', error);
    }
  };

  const handleDeleteVillageMetric = async (id: string) => {
    if (!confirm('Delete this metric from the Village Overview section?')) return;
    try {
      const res = await fetch(`/api/village-metrics?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchVillageMetrics();
    } catch (error) {
      console.error('Failed to delete village metric:', error);
    }
  };

  const startEditVillageMetric = (metric: any) => {
    setNewVillageMetric({
      label: metric.label,
      value: metric.value,
      status: metric.status || 'Active',
      icon: metric.icon || 'Activity',
      color: metric.color || 'text-green-500',
      bg: metric.bg || 'bg-green-500/10',
      order: metric.order?.toString() || '0',
    });
    setEditingVillageMetric(metric.id);
    setShowVillageMetricModal(true);
  };

  // Village Performance CRUD
  const handleAddVillagePerf = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingVillagePerf ? 'PUT' : 'POST';
      const url = editingVillagePerf ? `/api/village-performance?id=${editingVillagePerf}` : '/api/village-performance';
      const body = { ...newVillagePerf, percentage: parseInt(newVillagePerf.percentage) || 85, order: parseInt(newVillagePerf.order) || 0 };
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setShowVillagePerfModal(false);
        setNewVillagePerf({ label: '', value: '', percentage: '85', order: '0' });
        setEditingVillagePerf(null);
        fetchVillagePerformance();
      }
    } catch (error) {
      console.error('Failed to save village performance:', error);
    }
  };

  const handleDeleteVillagePerf = async (id: string) => {
    if (!confirm('Delete this performance metric?')) return;
    try {
      const res = await fetch(`/api/village-performance?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchVillagePerformance();
    } catch (error) {
      console.error('Failed to delete village performance:', error);
    }
  };

  const startEditVillagePerf = (record: any) => {
    setNewVillagePerf({
      label: record.label,
      value: record.value,
      percentage: record.percentage?.toString() || '85',
      order: record.order?.toString() || '0',
    });
    setEditingVillagePerf(record.id);
    setShowVillagePerfModal(true);
  };

  // Water Source CRUD
  const handleAddWaterSource = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingWaterSource ? 'PUT' : 'POST';
      const url = editingWaterSource ? `/api/water-sources?id=${editingWaterSource}` : '/api/water-sources';
      const body = { ...newWaterSource, level: parseInt(newWaterSource.level) || 50, order: parseInt(newWaterSource.order) || 0 };
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setShowWaterSourceModal(false);
        setNewWaterSource({ label: '', level: '50', status: 'Normal', icon: 'Droplets', order: '0' });
        setEditingWaterSource(null);
        fetchWaterSources();
      }
    } catch (error) {
      console.error('Failed to save water source:', error);
    }
  };

  const handleDeleteWaterSource = async (id: string) => {
    if (!confirm('Delete this water source?')) return;
    try {
      const res = await fetch(`/api/water-sources?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchWaterSources();
    } catch (error) {
      console.error('Failed to delete water source:', error);
    }
  };

  // Village Official CRUD
  const handleAddOfficial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!officialForm.name || !officialForm.title) return;
    setUploadingOfficial(true);
    try {
      const formData = new FormData();
      formData.append('name', officialForm.name);
      formData.append('title', officialForm.title);
      formData.append('description', officialForm.description || '');
      formData.append('order', officialForm.order || '0');
      if (officialForm.file) {
        formData.append('image', officialForm.file);
      }

      const method = editingOfficial ? 'PUT' : 'POST';
      const url = editingOfficial ? `/api/village-officials?id=${editingOfficial}` : '/api/village-officials';
      const res = await fetch(url, { method, body: formData });
      if (res.ok) {
        setShowOfficialModal(false);
        setOfficialForm({ name: '', title: '', description: '', order: '0', file: null as File | null });
        setEditingOfficial(null);
        fetchVillageOfficials();
      }
    } catch (error) {
      console.error('Failed to save official:', error);
    } finally {
      setUploadingOfficial(false);
    }
  };

  const handleDeleteOfficial = async (id: string) => {
    if (!confirm('Delete this official from the Village Administration page?')) return;
    try {
      const res = await fetch(`/api/village-officials?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchVillageOfficials();
    } catch (error) {
      console.error('Failed to delete official:', error);
    }
  };

  const startEditOfficial = (official: any) => {
    setOfficialForm({
      name: official.name,
      title: official.title,
      description: official.description || '',
      order: official.order?.toString() || '0',
      file: null,
    });
    setEditingOfficial(official.id);
    setShowOfficialModal(true);
  };

  // Village Events CRUD
  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingEvent ? 'PUT' : 'POST';
      const url = editingEvent ? `/api/events?id=${editingEvent}` : '/api/events';
      const body = { ...newEvent, order: parseInt(newEvent.order) || 0 };
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setShowEventModal(false);
        setNewEvent({ title: '', description: '', imageUrl: '', date: '', category: 'local', order: '0' });
        setEditingEvent(null);
        fetchVillageEvents();
      }
    } catch (error) {
      console.error('Failed to save event:', error);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm('Delete this event from the Village Events page?')) return;
    try {
      const res = await fetch(`/api/events?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchVillageEvents();
    } catch (error) {
      console.error('Failed to delete event:', error);
    }
  };

  const startEditEvent = (event: any) => {
    setNewEvent({
      title: event.title,
      description: event.description || '',
      imageUrl: event.imageUrl || '',
      date: event.date || '',
      category: event.category || 'local',
      order: event.order?.toString() || '0',
    });
    setEditingEvent(event.id);
    setShowEventModal(true);
  };

  const startEditWaterSource = (source: any) => {
    setNewWaterSource({
      label: source.label,
      level: source.level?.toString() || '50',
      status: source.status || 'Normal',
      icon: source.icon || 'Droplets',
      order: source.order?.toString() || '0',
    });
    setEditingWaterSource(source.id);
    setShowWaterSourceModal(true);
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
            <Link
              href={`/${locale}/dashboard/admin/praja-tracker`}
              className="px-6 py-3 bg-[#15803d] text-white rounded-2xl text-sm font-bold hover:bg-[#14532d] transition-all flex items-center gap-2 shadow-xl shadow-[#15803d]/20"
            >
              <BarChart3 className="w-4 h-4" />
              Praja Tracker
            </Link>
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
              onClick={() => {
                setEditingPrice(null);
                setNewPrice({ cropName: '', price: '', unit: 'Quintal', district: 'Rajanna Sircilla' });
                setShowPriceModal(true);
              }}
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

        {/* Section Navigation Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-12 scrollbar-hide border-b border-gray-100">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'praja', label: 'Praja Tracker', icon: '📋' },
            { id: 'prices', label: 'Market Prices', icon: '💰' },
            { id: 'weather', label: 'Weather', icon: '🌤' },
            { id: 'metrics', label: 'Village Metrics', icon: '📈' },
            { id: 'performance', label: 'Performance', icon: '🏆' },
            { id: 'water', label: 'Water Supply', icon: '💧' },
            { id: 'officials', label: 'Officials', icon: '👤' },
            { id: 'events', label: 'Events', icon: '🎉' },
            { id: 'slots', label: 'IKP Slots', icon: '📅' },
            { id: 'schemes', label: 'Schemes', icon: '🔗' },
            { id: 'gallery', label: 'Gallery', icon: '🖼' },
            { id: 'funds', label: 'Fund Usage', icon: '💰' },
            { id: 'allocations', label: 'Allocations', icon: '💵' },
            { id: 'bookings', label: 'Bookings', icon: '📋' },
          ].map((tab) => (
            tab.id === 'praja' ? (
              <Link
                key={tab.id}
                href={`/${locale}/dashboard/admin/praja-tracker`}
                className="flex-shrink-0 px-4 py-2.5 rounded-xl bg-[#15803d] text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#14532d] transition-all flex items-center gap-1.5 shadow-sm"
              >
                <BarChart3 className="w-3.5 h-3.5" />
                {tab.label}
              </Link>
            ) : (
              <a
                key={tab.id}
                href={`#section-${tab.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(`section-${tab.id}`)?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex-shrink-0 px-4 py-2.5 rounded-xl bg-gray-100 text-gray-600 text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 hover:text-[#0A0A0A] transition-all"
              >
                {tab.icon} {tab.label}
              </a>
            )
          ))}
        </div>

        {/* Praja Progress Tracker Section */}
        <div id="section-praja" className="mb-12 scroll-mt-48">
          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#15803d]/10 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-[#15803d]" />
                  </div>
                  <h3 className="text-2xl font-black text-[#0A0A0A] tracking-tighter">Praja Progress Tracker</h3>
                </div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2 ml-[52px]">Welfare applications & beneficiary management</p>
              </div>
              <Link
                href={`/${locale}/dashboard/admin/praja-tracker`}
                className="px-6 py-3 bg-[#15803d] text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2 shadow-xl shadow-[#15803d]/20"
              >
                <BarChart3 className="w-4 h-4" />
                Full Management →
              </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Applications</div>
                <div className="text-3xl font-black text-[#0A0A0A]">{prajaStats.total || 0}</div>
              </div>
              <div className="p-5 rounded-2xl bg-green-50 border border-green-100">
                <div className="text-[10px] font-black text-[#15803d] uppercase tracking-widest mb-1">Approved</div>
                <div className="text-3xl font-black text-[#15803d]">{prajaStats.approved || 0}</div>
              </div>
              <div className="p-5 rounded-2xl bg-amber-50 border border-amber-100">
                <div className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">Pending</div>
                <div className="text-3xl font-black text-amber-600">{prajaStats.pending || 0}</div>
              </div>
              <div className="p-5 rounded-2xl bg-red-50 border border-red-100">
                <div className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-1">Rejected</div>
                <div className="text-3xl font-black text-red-500">{prajaStats.rejected || 0}</div>
              </div>
            </div>

            {/* Recent Applications Preview */}
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50 text-[10px] text-gray-400 font-black uppercase tracking-widest">
                    <th className="px-6 py-4">Applicant</th>
                    <th className="px-6 py-4">Scheme</th>
                    <th className="px-6 py-4">Village</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {prajaApplications.length === 0 ? (
                    <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-300 font-bold italic">No applications found.</td></tr>
                  ) : prajaApplications.slice(0, 5).map((app: any) => (
                    <tr key={app.id} className="hover:bg-gray-50/30 transition-colors">
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Section IDs for existing sections */}
        <div id="section-overview"></div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* Market Prices Section - Redesigned with full CRUD */}
          <div id="section-prices" className="lg:col-span-2 scroll-mt-48">
            <div className="bg-white h-full rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
              <div className="p-8 border-b border-gray-50">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-[#22FF88]/10 flex items-center justify-center text-[#22FF88]">
                        <IndianRupee className="w-6 h-6" />
                      </div>
                      <h2 className="text-2xl font-black text-[#0A0A0A] tracking-tighter">Market Prices</h2>
                    </div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2 ml-[52px]">Rajanna Sircilla District • Manage crop price data</p>
                  </div>
                  <button 
                    onClick={() => {
                      setEditingPrice(null);
                      setNewPrice({ cropName: '', price: '', unit: 'Quintal', district: 'Rajanna Sircilla' });
                      setShowPriceModal(true);
                    }}
                    className="px-6 py-3 bg-[#22FF88] text-[#0A0A0A] rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2 shadow-xl shadow-[#22FF88]/20"
                  >
                    <Plus className="w-4 h-4" />
                    Add Price
                  </button>
                </div>

                {/* Search Bar */}
                <div className="relative group">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#22FF88] transition-colors" />
                  <input
                    type="text"
                    value={priceSearch}
                    onChange={(e) => setPriceSearch(e.target.value)}
                    placeholder="Search crops..."
                    className="w-full pl-12 pr-6 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-[#22FF88]/10 focus:border-[#22FF88] transition-all font-bold"
                  />
                </div>

                {/* Stats Row */}
                {marketPrices.length > 0 && (
                  <div className="grid grid-cols-3 gap-4 mt-6">
                    <div className="p-4 rounded-2xl bg-green-50 border border-green-100">
                      <div className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-1">Total Crops</div>
                      <div className="text-xl font-black text-[#0A0A0A]">{marketPrices.length}</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-green-50 border border-green-100">
                      <div className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-1">Avg Price</div>
                      <div className="text-xl font-black text-[#0A0A0A]">
                        ₹{Math.round(marketPrices.reduce((s: number, p: any) => s + p.price, 0) / marketPrices.length).toLocaleString()}
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
                      <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Last Updated</div>
                      <div className="text-sm font-black text-[#0A0A0A]">
                        {new Date(Math.max(...marketPrices.map((p: any) => new Date(p.date).getTime()))).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50/50 text-[10px] text-gray-400 font-black uppercase tracking-widest">
                      <th className="px-8 py-5">Crop Name</th>
                      <th className="px-8 py-5">Price / Quintal</th>
                      <th className="px-8 py-5">Last Updated</th>
                      <th className="px-8 py-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {marketPrices.length === 0 ? (
                      <tr><td colSpan={4} className="px-8 py-12 text-center text-gray-300 font-bold italic">No pricing data synced.</td></tr>
                    ) : (() => {
                      const filtered = priceSearch 
                        ? marketPrices.filter((p: any) => p.cropName.toLowerCase().includes(priceSearch.toLowerCase()))
                        : marketPrices;
                      
                      return filtered.length === 0 ? (
                        <tr><td colSpan={4} className="px-8 py-12 text-center text-gray-300 font-bold italic">No crops match your search.</td></tr>
                      ) : filtered.map((price: any) => (
                        <tr key={price.id} className="hover:bg-gray-50/30 transition-colors group">
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-[#22FF88]/10 flex items-center justify-center text-[#0A0A0A] font-black">
                                {price.cropName[0]}
                              </div>
                              <div className="font-black text-[#0A0A0A]">{price.cropName}</div>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <span className="px-4 py-2 bg-green-50 text-green-600 rounded-xl font-black text-lg">
                              ₹{price.price.toLocaleString()}
                            </span>
                            <span className="ml-2 text-[9px] font-bold text-gray-400 uppercase">/{price.unit || 'Quintal'}</span>
                          </td>
                          <td className="px-8 py-5">
                            <div className="text-xs font-bold text-gray-400">
                              {new Date(price.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                            </div>
                            <div className="text-[9px] font-bold text-gray-300 uppercase">
                              {new Date(price.date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </td>
                          <td className="px-8 py-5 text-right">
                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => startEditPrice(price)}
                                className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                                title="Edit price"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDeletePrice(price.id)}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                title="Delete price"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Weather Section */}
          <div id="section-weather" className="lg:col-span-1 scroll-mt-48">
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

        {/* Village Metrics Management Section */}
        <div id="section-metrics" className="mb-12 scroll-mt-48">
          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-green-50 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-black text-[#0A0A0A] tracking-tighter">Village Overview — Metrics</h3>
                </div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2 ml-[52px]">Manage service metrics shown in the Village Overview section</p>
              </div>
              <button 
                onClick={() => {
                  setEditingVillageMetric(null);
                  setNewVillageMetric({ label: '', value: '', status: 'Active', icon: 'Activity', color: 'text-green-500', bg: 'bg-green-500/10', order: '0' });
                  setShowVillageMetricModal(true);
                }}
                className="px-6 py-3 bg-green-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2 shadow-xl shadow-green-600/20"
              >
                <Plus className="w-4 h-4" />
                Add Metric
              </button>
            </div>

            {villageMetrics.length === 0 ? (
              <div className="text-center py-16 text-gray-300 font-bold italic">
                No metrics configured. Click "Add Metric" to show data in the Village Overview section.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-green-50/50 text-[10px] text-gray-400 font-black uppercase tracking-widest">
                      <th className="px-6 py-4">Label</th>
                      <th className="px-6 py-4">Value</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Order</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {villageMetrics.map((metric) => (
                      <tr key={metric.id} className="hover:bg-green-50/20 transition-colors group">
                        <td className="px-6 py-4 font-black text-[#0A0A0A]">{metric.label}</td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-green-50 text-green-600 rounded-lg font-black">{metric.value}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-bold text-gray-500">{metric.status}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-bold text-gray-400">#{metric.order}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => startEditVillageMetric(metric)}
                              className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteVillageMetric(metric.id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Village Performance Management Section */}
        <div id="section-performance" className="mb-12 scroll-mt-48">
          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-black text-[#0A0A0A] tracking-tighter">Village Performance Summary</h3>
                </div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2 ml-[52px]">Manage performance bars shown in the Village Overview section</p>
              </div>
              <button 
                onClick={() => {
                  setEditingVillagePerf(null);
                  setNewVillagePerf({ label: '', value: '', percentage: '85', order: '0' });
                  setShowVillagePerfModal(true);
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2 shadow-xl shadow-blue-600/20"
              >
                <Plus className="w-4 h-4" />
                Add Metric
              </button>
            </div>

            {villagePerformance.length === 0 ? (
              <div className="text-center py-16 text-gray-300 font-bold italic">
                No performance metrics configured. Click "Add Metric" to show performance bars.
              </div>
            ) : (
              <div className="space-y-4">
                {villagePerformance.map((record) => (
                  <div key={record.id} className="p-6 rounded-2xl bg-gray-50 border border-gray-100 group hover:border-blue-200 transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex justify-between text-xs font-black uppercase tracking-widest mb-2">
                          <span className="text-gray-500">{record.label}</span>
                          <span className="text-blue-600">{record.value}</span>
                        </div>
                        <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-600 rounded-full" style={{ width: `${record.percentage}%` }} />
                        </div>
                        <span className="text-[10px] font-bold text-gray-400 mt-1 block">{record.percentage}%</span>
                      </div>
                      <div className="flex gap-2 ml-6 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => startEditVillagePerf(record)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteVillagePerf(record.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Water Sources Management Section */}
        <div id="section-water" className="mb-12 scroll-mt-48">
          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-sky-50 flex items-center justify-center">
                    <Droplets className="w-5 h-5 text-sky-600" />
                  </div>
                  <h3 className="text-2xl font-black text-[#0A0A0A] tracking-tighter">Water Supply — Sources</h3>
                </div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2 ml-[52px]">Manage water sources shown in the Water Supply section</p>
              </div>
              <button 
                onClick={() => {
                  setEditingWaterSource(null);
                  setNewWaterSource({ label: '', level: '50', status: 'Normal', icon: 'Droplets', order: '0' });
                  setShowWaterSourceModal(true);
                }}
                className="px-6 py-3 bg-sky-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2 shadow-xl shadow-sky-600/20"
              >
                <Plus className="w-4 h-4" />
                Add Source
              </button>
            </div>

            {waterSources.length === 0 ? (
              <div className="text-center py-16 text-gray-300 font-bold italic">
                No water sources configured. Click "Add Source" to show data in the Water Supply section.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {waterSources.map((source) => (
                  <div key={source.id} className="p-6 rounded-2xl bg-sky-50 border border-sky-100 group hover:border-sky-300 transition-all relative">
                    <div className="flex justify-between items-start mb-3">
                      <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600">
                        <Droplets className="w-5 h-5" />
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => startEditWaterSource(source)}
                          className="p-1.5 text-gray-400 hover:text-sky-600 hover:bg-sky-100 rounded-lg transition-all"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteWaterSource(source.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <h4 className="font-black text-[#0A0A0A] mb-1">{source.label}</h4>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex-1 h-2 bg-sky-200 rounded-full overflow-hidden">
                        <div className="h-full bg-sky-500 rounded-full" style={{ width: `${source.level}%` }} />
                      </div>
                      <span className="text-sm font-black text-sky-600">{source.level}%</span>
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{source.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Village Officials Management Section */}
        <div id="section-officials" className="mb-12 scroll-mt-48">
          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-8 overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#15803d]/10 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-[#15803d]" />
                  </div>
                  <h3 className="text-2xl font-black text-[#0A0A0A] tracking-tighter">Village Administrators</h3>
                </div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2 ml-[52px]">Manage officials shown on the Village Administration page</p>
              </div>
              <button 
                onClick={() => {
                  setEditingOfficial(null);
                  setOfficialForm({ name: '', title: '', description: '', order: '0', file: null });
                  setShowOfficialModal(true);
                }}
                className="px-6 py-3 bg-[#15803d] text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2 shadow-xl shadow-[#15803d]/20"
              >
                <Plus className="w-4 h-4" />
                Add Official
              </button>
            </div>

            {villageOfficials.length === 0 ? (
              <div className="text-center py-16 text-gray-300 font-bold italic">
                No officials added yet. Click "Add Official" to show village administration details.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {villageOfficials.map((official) => (
                  <div key={official.id} className="p-6 rounded-2xl bg-gray-50 border border-gray-100 group hover:border-[#15803d]/30 transition-all relative">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-14 h-14 rounded-xl bg-white overflow-hidden shadow-sm">
                        {official.imageUrl ? (
                          <img src={official.imageUrl} alt={official.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#15803d]/30">
                            <Shield className="w-6 h-6" />
                          </div>
                        )}
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => startEditOfficial(official)}
                          className="p-1.5 text-gray-400 hover:text-[#15803d] hover:bg-[#15803d]/10 rounded-lg transition-all"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteOfficial(official.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <h4 className="font-black text-[#0A0A0A] mb-1">{official.name}</h4>
                    <div className="inline-block px-2 py-0.5 rounded-md bg-[#15803d]/10 text-[#15803d] text-[9px] font-black uppercase tracking-widest mb-2">
                      {official.title}
                    </div>
                    {official.description && (
                      <p className="text-[10px] text-gray-400 font-medium mt-2 line-clamp-2">{official.description}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* New Horizontal IKP Slots Section */}
        <div id="section-slots" className="mb-12 scroll-mt-48">
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
        <div id="section-schemes" className="mb-12 scroll-mt-48">
          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center">
                    <ExternalLink className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-black text-[#0A0A0A] tracking-tighter">Government Schemes</h3>
                </div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2 ml-[52px]">Manage links shown on schemes page</p>
              </div>
              <button 
                onClick={() => {
                  setEditingScheme(null);
                  setNewScheme({ title: '', link: '', description: '' });
                  setShowSchemeModal(true);
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2 shadow-xl shadow-blue-600/20"
              >
                <Plus className="w-4 h-4" />
                Add Scheme
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {schemes.length === 0 ? (
                <div className="col-span-full text-center py-16 text-gray-300 font-bold italic">
                  No schemes configured yet.
                  <div className="mt-6">
                    <button 
                      onClick={() => {
                        setEditingScheme(null);
                        setNewScheme({ title: '', link: '', description: '' });
                        setShowSchemeModal(true);
                      }}
                      className="px-8 py-4 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all inline-flex items-center gap-2 shadow-xl shadow-blue-600/20"
                    >
                      <Plus className="w-4 h-4" />
                      Add Your First Scheme
                    </button>
                  </div>
                </div>
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

        {/* Gallery Management Section */}
        <div id="section-gallery" className="mb-12 scroll-mt-48">
          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-8 overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-green-50 flex items-center justify-center">
                    <Image className="w-5 h-5 text-[#15803d]" />
                  </div>
                  <h3 className="text-2xl font-black text-[#0A0A0A] tracking-tighter">Gallery Manager</h3>
                </div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2 ml-[52px]">Upload & manage village photos</p>
              </div>
              <button 
                onClick={() => setShowGalleryModal(true)}
                className="px-6 py-3 bg-[#15803d] text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2 shadow-xl shadow-[#15803d]/20"
              >
                <Upload className="w-4 h-4" />
                Upload Photo
              </button>
            </div>

            {galleryImages.length === 0 ? (
              <div className="text-center py-16 text-gray-300 font-bold italic">
                No photos uploaded yet. Click "Upload Photo" to add village photos.
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {galleryImages.map((img) => (
                  <div key={img.id} className="relative group aspect-[4/5] rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
                    <img 
                      src={img.url} 
                      alt={img.alt || 'Gallery'} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300" />
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleDeleteGalleryImage(img.id)}
                        className="p-2 bg-white/90 backdrop-blur-sm rounded-xl text-red-600 hover:bg-red-50 transition-all shadow-lg"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                      <p className="text-white text-[10px] font-bold truncate">{img.alt || 'Mallaram Gallery'}</p>
                      <p className="text-white/60 text-[8px]">{new Date(img.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Fund Usage Management Section */}
        <div id="section-funds" className="mb-12 scroll-mt-48">
          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-8 overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center">
                    <Landmark className="w-5 h-5 text-amber-600" />
                  </div>
                  <h3 className="text-2xl font-black text-[#0A0A0A] tracking-tighter">Fund Usage Tracker</h3>
                </div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2 ml-[52px]">Record village fund expenditures with labels</p>
              </div>
              <button 
                onClick={() => {
                  setEditingFund(null);
                  setNewFund({ label: '', amount: '', description: '', date: new Date().toISOString().split('T')[0], category: '', phase: 'Completed', fundSource: '' });
                  setShowFundModal(true);
                }}
                className="px-6 py-3 bg-amber-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2 shadow-xl shadow-amber-600/20"
              >
                <Plus className="w-4 h-4" />
                Add Fund Entry
              </button>
            </div>

            {fundRecords.length === 0 ? (
              <div className="text-center py-16 text-gray-300 font-bold italic">
                No fund usage records yet. Click "Add Fund Entry" to track village expenditures.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-amber-50/50 text-[10px] text-gray-400 font-black uppercase tracking-widest">
                      <th className="px-6 py-4">Label / Purpose</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Phase</th>
                      <th className="px-6 py-4">Source</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {fundRecords.map((record) => (
                      <tr key={record.id} className="hover:bg-amber-50/20 transition-colors group">
                        <td className="px-6 py-4 font-black text-[#0A0A0A]">{record.label}</td>
                        <td className="px-6 py-4">
                          {record.category ? (
                            <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-[9px] font-black uppercase tracking-widest">
                              {record.category}
                            </span>
                          ) : (
                            <span className="text-gray-300 text-[10px] font-bold">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest"
                            style={{
                              backgroundColor: record.phase === 'Completed' ? '#dcfce7' :
                                record.phase === 'In Progress' ? '#fef3c7' :
                                record.phase === 'Planning' ? '#dbeafe' :
                                record.phase === 'Approved' ? '#f3e8ff' : '#f3f4f6',
                              color: record.phase === 'Completed' ? '#15803d' :
                                record.phase === 'In Progress' ? '#b45309' :
                                record.phase === 'Planning' ? '#1d4ed8' :
                                record.phase === 'Approved' ? '#7c3aed' : '#374151'
                            }}
                          >
                            {record.phase || 'Completed'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {record.fundSource ? (
                            <span className="text-[10px] font-bold text-gray-500">{record.fundSource}</span>
                          ) : (
                            <span className="text-gray-300 text-[10px] font-bold">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-black text-lg text-[#0A0A0A]">
                            ₹{record.amount.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-bold text-gray-500">
                            {new Date(record.date).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-medium text-gray-400 line-clamp-1">
                            {record.description || '—'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => startEditFund(record)}
                              className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteFund(record.id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Summary Cards */}
            {fundRecords.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8 pt-8 border-t border-gray-100">
                <div className="p-6 rounded-2xl bg-amber-50 border border-amber-100">
                  <div className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-2">Total Recorded</div>
                  <div className="text-2xl font-black text-[#0A0A0A]">
                    ₹{fundRecords.reduce((sum: number, r: any) => sum + r.amount, 0).toLocaleString()}
                  </div>
                </div>
                <div className="p-6 rounded-2xl bg-green-50 border border-green-100">
                  <div className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-2">Total Entries</div>
                  <div className="text-2xl font-black text-[#0A0A0A]">{fundRecords.length}</div>
                </div>
                <div className="p-6 rounded-2xl bg-blue-50 border border-blue-100">
                  <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2">Categories</div>
                  <div className="text-2xl font-black text-[#0A0A0A]">
                    {new Set(fundRecords.map((r: any) => r.category).filter(Boolean)).size}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Fund Allocations Management Section */}
        <div id="section-allocations" className="mb-12 scroll-mt-48">
          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-8 overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-black text-[#0A0A0A] tracking-tighter">Fund Allocations</h3>
                </div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2 ml-[52px]">Manage total government fund grants allocated to the village</p>
              </div>
              <button 
                onClick={() => {
                  setEditingAlloc(null);
                  setNewAlloc({ totalAmount: '', source: '', fiscalYear: '2025-2026', description: '' });
                  setShowAllocModal(true);
                }}
                className="px-6 py-3 bg-emerald-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2 shadow-xl shadow-emerald-600/20"
              >
                <Plus className="w-4 h-4" />
                Add Allocation
              </button>
            </div>

            {fundAllocations.length === 0 ? (
              <div className="text-center py-16 text-gray-300 font-bold italic">
                No fund allocations yet. Click "Add Allocation" to record government fund grants.
              </div>
            ) : (
              <>
                {/* Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-100">
                    <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2">Total Allocated</div>
                    <div className="text-2xl font-black text-[#0A0A0A]">
                      ₹{fundAllocations.reduce((sum: number, a: any) => sum + a.totalAmount, 0).toLocaleString()}
                    </div>
                  </div>
                  <div className="p-6 rounded-2xl bg-green-50 border border-green-100">
                    <div className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-2">Used So Far</div>
                    <div className="text-2xl font-black text-[#0A0A0A]">
                      ₹{fundRecords.reduce((sum: number, r: any) => sum + r.amount, 0).toLocaleString()}
                    </div>
                  </div>
                  <div className="p-6 rounded-2xl bg-blue-50 border border-blue-100">
                    <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2">Remaining</div>
                    <div className="text-2xl font-black text-[#0A0A0A]">
                      ₹{(fundAllocations.reduce((sum: number, a: any) => sum + a.totalAmount, 0) - fundRecords.reduce((sum: number, r: any) => sum + r.amount, 0)).toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-emerald-50/50 text-[10px] text-gray-400 font-black uppercase tracking-widest">
                        <th className="px-6 py-4">Source</th>
                        <th className="px-6 py-4">Fiscal Year</th>
                        <th className="px-6 py-4">Amount</th>
                        <th className="px-6 py-4">Description</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {fundAllocations.map((alloc) => (
                        <tr key={alloc.id} className="hover:bg-emerald-50/20 transition-colors group">
                          <td className="px-6 py-4 font-black text-[#0A0A0A]">{alloc.source || 'General Grant'}</td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-[9px] font-black uppercase tracking-widest">
                              {alloc.fiscalYear}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-black text-lg text-[#0A0A0A]">
                              ₹{alloc.totalAmount.toLocaleString()}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-xs font-medium text-gray-400 line-clamp-1">
                              {alloc.description || '—'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => startEditAlloc(alloc)}
                                className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDeleteAlloc(alloc.id)}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Village Events Management Section */}
        <div id="section-events" className="mb-12 scroll-mt-48">
          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-50 flex items-center justify-center">
                    <CalendarDays className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="text-2xl font-black text-[#0A0A0A] tracking-tighter">Village Events</h3>
                </div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2 ml-[52px]">Manage events shown on the home page Events section — Festivals & Local Events</p>
              </div>
              <button 
                onClick={() => {
                  setEditingEvent(null);
                  setNewEvent({ title: '', description: '', imageUrl: '', date: '', category: 'local', order: '0' });
                  setShowEventModal(true);
                }}
                className="px-6 py-3 bg-purple-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2 shadow-xl shadow-purple-600/20"
              >
                <Plus className="w-4 h-4" />
                Add Event
              </button>
            </div>

            {villageEvents.length === 0 ? (
              <div className="text-center py-16 text-gray-300 font-bold italic">
                No events added yet. Click "Add Event" to show village events on the home page.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {villageEvents.map((event) => (
                  <div key={event.id} className="p-6 rounded-2xl bg-gray-50 border border-gray-100 group hover:border-purple-300 transition-all relative">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-14 h-14 rounded-xl bg-white overflow-hidden shadow-sm">
                        {event.imageUrl ? (
                          <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-purple-600/30">
                            <CalendarDays className="w-6 h-6" />
                          </div>
                        )}
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => startEditEvent(event)}
                          className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteEvent(event.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="text-[#15803d] text-[9px] font-black uppercase tracking-widest mb-1">{event.date}</div>
                    <h4 className="font-black text-[#0A0A0A] mb-1">{event.title}</h4>
                    <div className="inline-block px-2 py-0.5 rounded-md bg-purple-100 text-purple-700 text-[9px] font-black uppercase tracking-widest mb-2">
                      {event.category === 'festivals' ? 'Festival' : 'Local Event'}
                    </div>
                    {event.description && (
                      <p className="text-[10px] text-gray-400 font-medium mt-1 line-clamp-2">{event.description}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Booking Table */}
        <div id="section-bookings" className="scroll-mt-48">
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
        </div> {/* end section-bookings */}

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

        {/* Market Price Modal - Redesigned with edit/create + more fields */}
        {showPriceModal && (
          <div className="fixed inset-0 bg-[#0A0A0A]/90 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[2.5rem] shadow-2xl p-10 w-full max-w-lg relative">
              <button onClick={() => setShowPriceModal(false)} className="absolute top-8 right-8 text-gray-300 hover:text-[#0A0A0A] transition-colors"><X className="w-6 h-6"/></button>
              <h3 className="text-3xl font-black text-[#0A0A0A] mb-2 tracking-tighter">
                {editingPrice ? 'Update Price' : 'Add Market Price'}
              </h3>
              <p className="text-gray-400 mb-8 font-medium">
                {editingPrice ? 'Update crop pricing information' : 'Register a new crop price for the market dashboard'}
              </p>
              
              <form onSubmit={handleAddPrice} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Crop Name</label>
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
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Price (₹)</label>
                    <input
                      type="number"
                      value={newPrice.price}
                      onChange={(e) => setNewPrice({ ...newPrice, price: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#22FF88]/10 focus:border-[#22FF88] font-bold"
                      placeholder="2203"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Unit</label>
                    <select
                      value={newPrice.unit}
                      onChange={(e) => setNewPrice({ ...newPrice, unit: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#22FF88]/10 focus:border-[#22FF88] font-bold"
                    >
                      <option value="Quintal">Quintal</option>
                      <option value="Kg">Kg</option>
                      <option value="Ton">Ton</option>
                      <option value="Bag">Bag</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">District</label>
                    <select
                      value={newPrice.district}
                      onChange={(e) => setNewPrice({ ...newPrice, district: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#22FF88]/10 focus:border-[#22FF88] font-bold"
                    >
                      <option value="Rajanna Sircilla">Rajanna Sircilla</option>
                      <option value="Karimnagar">Karimnagar</option>
                      <option value="Jagtial">Jagtial</option>
                      <option value="Peddapalli">Peddapalli</option>
                      <option value="Warangal">Warangal</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="p-4 bg-[#22FF88]/5 rounded-2xl border border-[#22FF88]/10">
                  <div className="flex items-center gap-2 text-[10px] font-black text-[#22FF88] uppercase tracking-widest mb-1">
                    <IndianRupee className="w-3 h-3" />
                    Market Info
                  </div>
                  <p className="text-xs font-medium text-gray-400">
                    {editingPrice 
                      ? 'Saving will update the price and refresh the timestamp with current date.'
                      : 'New prices will appear immediately on the admin dashboard and public market prices widget.'}
                  </p>
                </div>

                <button 
                  type="submit" 
                  className="w-full py-5 bg-[#22FF88] text-[#0A0A0A] rounded-[1.5rem] font-black uppercase tracking-widest hover:scale-[1.02] transition-all shadow-xl shadow-[#22FF88]/20"
                >
                  {editingPrice ? 'Save Changes' : 'Publish Price'}
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

        {/* Gallery Upload Modal */}
        {showGalleryModal && (
          <div className="fixed inset-0 bg-[#0A0A0A]/90 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[2.5rem] shadow-2xl p-10 w-full max-w-md relative">
              <button onClick={() => setShowGalleryModal(false)} className="absolute top-8 right-8 text-gray-300 hover:text-[#0A0A0A] transition-colors"><X className="w-6 h-6"/></button>
              <h3 className="text-3xl font-black text-[#0A0A0A] mb-2 tracking-tighter">Upload Gallery Photo</h3>
              <p className="text-gray-400 mb-8 font-medium">Add a new photo to the village gallery</p>
              
              <form onSubmit={handleGalleryUpload} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Photo File</label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={(e) => setGalleryForm({ ...galleryForm, file: e.target.files?.[0] || null })}
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#15803d]/10 focus:border-[#15803d] font-bold file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-[#15803d]/10 file:text-[#15803d] file:font-black file:text-[10px] file:uppercase file:tracking-widest hover:file:bg-[#15803d]/20"
                      required
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 font-medium mt-2">JPEG, PNG, WebP, or GIF. Max 10MB.</p>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Alt Text / Label</label>
                  <input
                    type="text"
                    value={galleryForm.alt}
                    onChange={(e) => setGalleryForm({ ...galleryForm, alt: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#15803d]/10 focus:border-[#15803d] font-bold"
                    placeholder="e.g., Mallaram Temple Festival 2026"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Short Description</label>
                  <textarea
                    value={galleryForm.description}
                    onChange={(e) => setGalleryForm({ ...galleryForm, description: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#15803d]/10 focus:border-[#15803d] font-bold min-h-[80px]"
                    placeholder="What is this photo about?"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={uploading || !galleryForm.file}
                  className="w-full py-5 bg-[#15803d] text-white rounded-[1.5rem] font-black uppercase tracking-widest hover:scale-[1.02] transition-all shadow-xl shadow-[#15803d]/20 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                >
                  {uploading ? 'Uploading...' : 'Upload to Gallery'}
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {/* Fund Usage Modal */}
        {showFundModal && (
          <div className="fixed inset-0 bg-[#0A0A0A]/90 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[2.5rem] shadow-2xl p-10 w-full max-w-md relative">
              <button onClick={() => setShowFundModal(false)} className="absolute top-8 right-8 text-gray-300 hover:text-[#0A0A0A] transition-colors"><X className="w-6 h-6"/></button>
              <h3 className="text-3xl font-black text-[#0A0A0A] mb-2 tracking-tighter">
                {editingFund ? 'Update Fund Entry' : 'Add Fund Usage'}
              </h3>
              <p className="text-gray-400 mb-8 font-medium">Record how village funds were used</p>
              
              <form onSubmit={handleAddFund} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Label / Purpose</label>
                  <input
                    type="text"
                    value={newFund.label}
                    onChange={(e) => setNewFund({ ...newFund, label: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 font-bold"
                    placeholder="e.g., CC Road Construction Ward 3"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Amount (₹)</label>
                  <input
                    type="number"
                    value={newFund.amount}
                    onChange={(e) => setNewFund({ ...newFund, amount: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 font-bold"
                    placeholder="1250000"
                    min="0"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Date</label>
                    <input
                      type="date"
                      value={newFund.date}
                      onChange={(e) => setNewFund({ ...newFund, date: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Category</label>
                    <select
                      value={newFund.category}
                      onChange={(e) => setNewFund({ ...newFund, category: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 font-bold"
                    >
                      <option value="">Select category</option>
                      <option value="Infrastructure">Infrastructure</option>
                      <option value="Education">Education</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Agriculture">Agriculture</option>
                      <option value="Sanitation">Sanitation</option>
                      <option value="Water">Water</option>
                      <option value="Electricity">Electricity</option>
                      <option value="Emergency">Emergency</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Phase</label>
                    <select
                      value={newFund.phase}
                      onChange={(e) => setNewFund({ ...newFund, phase: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 font-bold"
                    >
                      <option value="Planning">Planning</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Approved">Approved</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Fund Source</label>
                    <select
                      value={newFund.fundSource}
                      onChange={(e) => setNewFund({ ...newFund, fundSource: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 font-bold"
                    >
                      <option value="">Select source</option>
                      <option value="State Government">State Government</option>
                      <option value="Central Government">Central Government</option>
                      <option value="15th Finance Commission">15th Finance Commission</option>
                      <option value="Panchayat Funds">Panchayat Funds</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Full Description</label>
                  <textarea
                    value={newFund.description}
                    onChange={(e) => setNewFund({ ...newFund, description: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 font-bold min-h-[100px]"
                    placeholder="Detailed description of how the funds were used..."
                  />
                </div>
                <button type="submit" className="w-full py-5 bg-amber-600 text-white rounded-[1.5rem] font-black uppercase tracking-widest hover:scale-[1.02] transition-all shadow-xl shadow-amber-600/20 mt-4">
                  {editingFund ? 'Save Changes' : 'Record Fund Usage'}
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {/* Village Metric Modal */}
        {showVillageMetricModal && (
          <div className="fixed inset-0 bg-[#0A0A0A]/90 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[2.5rem] shadow-2xl p-10 w-full max-w-lg relative">
              <button onClick={() => setShowVillageMetricModal(false)} className="absolute top-8 right-8 text-gray-300 hover:text-[#0A0A0A] transition-colors"><X className="w-6 h-6"/></button>
              <h3 className="text-3xl font-black text-[#0A0A0A] mb-2 tracking-tighter">
                {editingVillageMetric ? 'Update Metric' : 'Add Village Metric'}
              </h3>
              <p className="text-gray-400 mb-8 font-medium">Configure a service metric for the Village Overview section</p>
              
              <form onSubmit={handleAddVillageMetric} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Label</label>
                    <input
                      type="text"
                      value={newVillageMetric.label}
                      onChange={(e) => setNewVillageMetric({ ...newVillageMetric, label: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500 font-bold"
                      placeholder="e.g., Street Lights"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Value</label>
                    <input
                      type="text"
                      value={newVillageMetric.value}
                      onChange={(e) => setNewVillageMetric({ ...newVillageMetric, value: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500 font-bold"
                      placeholder="e.g., 142/145"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Status</label>
                    <input
                      type="text"
                      value={newVillageMetric.status}
                      onChange={(e) => setNewVillageMetric({ ...newVillageMetric, status: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500 font-bold"
                      placeholder="e.g., Working Well"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Icon</label>
                    <select
                      value={newVillageMetric.icon}
                      onChange={(e) => setNewVillageMetric({ ...newVillageMetric, icon: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500 font-bold"
                    >
                      <option value="Activity">Activity</option>
                      <option value="Lightbulb">Lightbulb</option>
                      <option value="Video">Video</option>
                      <option value="Recycle">Recycle</option>
                      <option value="Zap">Zap</option>
                      <option value="Leaf">Leaf</option>
                      <option value="Droplets">Droplets</option>
                      <option value="Shield">Shield</option>
                      <option value="Wifi">Wifi</option>
                      <option value="TreePine">TreePine</option>
                      <option value="Building2">Building2</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Color Class</label>
                    <select
                      value={newVillageMetric.color}
                      onChange={(e) => setNewVillageMetric({ ...newVillageMetric, color: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500 font-bold"
                    >
                      <option value="text-green-500">Green</option>
                      <option value="text-amber-500">Amber</option>
                      <option value="text-blue-500">Blue</option>
                      <option value="text-red-500">Red</option>
                      <option value="text-purple-500">Purple</option>
                      <option value="text-sky-500">Sky</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Bg Class</label>
                    <select
                      value={newVillageMetric.bg}
                      onChange={(e) => setNewVillageMetric({ ...newVillageMetric, bg: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500 font-bold"
                    >
                      <option value="bg-green-500/10">Green</option>
                      <option value="bg-amber-500/10">Amber</option>
                      <option value="bg-blue-500/10">Blue</option>
                      <option value="bg-red-500/10">Red</option>
                      <option value="bg-purple-500/10">Purple</option>
                      <option value="bg-sky-500/10">Sky</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Order</label>
                    <input
                      type="number"
                      value={newVillageMetric.order}
                      onChange={(e) => setNewVillageMetric({ ...newVillageMetric, order: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500 font-bold"
                      placeholder="0"
                    />
                  </div>
                </div>
                <button type="submit" className="w-full py-5 bg-green-600 text-white rounded-[1.5rem] font-black uppercase tracking-widest hover:scale-[1.02] transition-all shadow-xl shadow-green-600/20 mt-4">
                  {editingVillageMetric ? 'Save Changes' : 'Add Metric'}
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {/* Village Performance Modal */}
        {showVillagePerfModal && (
          <div className="fixed inset-0 bg-[#0A0A0A]/90 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[2.5rem] shadow-2xl p-10 w-full max-w-lg relative">
              <button onClick={() => setShowVillagePerfModal(false)} className="absolute top-8 right-8 text-gray-300 hover:text-[#0A0A0A] transition-colors"><X className="w-6 h-6"/></button>
              <h3 className="text-3xl font-black text-[#0A0A0A] mb-2 tracking-tighter">
                {editingVillagePerf ? 'Update Performance' : 'Add Performance Metric'}
              </h3>
              <p className="text-gray-400 mb-8 font-medium">Configure a performance bar for the Village Performance Summary</p>
              
              <form onSubmit={handleAddVillagePerf} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Label</label>
                    <input
                      type="text"
                      value={newVillagePerf.label}
                      onChange={(e) => setNewVillagePerf({ ...newVillagePerf, label: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-bold"
                      placeholder="e.g., Energy Usage"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Value</label>
                    <input
                      type="text"
                      value={newVillagePerf.value}
                      onChange={(e) => setNewVillagePerf({ ...newVillagePerf, value: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-bold"
                      placeholder="e.g., 12% Reduction"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Percentage (0-100)</label>
                    <input
                      type="number"
                      value={newVillagePerf.percentage}
                      onChange={(e) => setNewVillagePerf({ ...newVillagePerf, percentage: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-bold"
                      placeholder="85"
                      min="0"
                      max="100"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Order</label>
                    <input
                      type="number"
                      value={newVillagePerf.order}
                      onChange={(e) => setNewVillagePerf({ ...newVillagePerf, order: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-bold"
                      placeholder="0"
                    />
                  </div>
                </div>
                <button type="submit" className="w-full py-5 bg-blue-600 text-white rounded-[1.5rem] font-black uppercase tracking-widest hover:scale-[1.02] transition-all shadow-xl shadow-blue-600/20 mt-4">
                  {editingVillagePerf ? 'Save Changes' : 'Add Metric'}
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {/* Water Source Modal */}
        {showWaterSourceModal && (
          <div className="fixed inset-0 bg-[#0A0A0A]/90 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[2.5rem] shadow-2xl p-10 w-full max-w-lg relative">
              <button onClick={() => setShowWaterSourceModal(false)} className="absolute top-8 right-8 text-gray-300 hover:text-[#0A0A0A] transition-colors"><X className="w-6 h-6"/></button>
              <h3 className="text-3xl font-black text-[#0A0A0A] mb-2 tracking-tighter">
                {editingWaterSource ? 'Update Water Source' : 'Add Water Source'}
              </h3>
              <p className="text-gray-400 mb-8 font-medium">Configure a water source for the Water Supply section</p>
              
              <form onSubmit={handleAddWaterSource} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Label</label>
                    <input
                      type="text"
                      value={newWaterSource.label}
                      onChange={(e) => setNewWaterSource({ ...newWaterSource, label: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 font-bold"
                      placeholder="e.g., Main Reservoir"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Level (0-100)</label>
                    <input
                      type="number"
                      value={newWaterSource.level}
                      onChange={(e) => setNewWaterSource({ ...newWaterSource, level: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 font-bold"
                      placeholder="50"
                      min="0"
                      max="100"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Status</label>
                    <select
                      value={newWaterSource.status}
                      onChange={(e) => setNewWaterSource({ ...newWaterSource, status: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 font-bold"
                    >
                      <option value="Stable">Stable</option>
                      <option value="Normal">Normal</option>
                      <option value="High">High</option>
                      <option value="Low">Low</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Icon</label>
                    <select
                      value={newWaterSource.icon}
                      onChange={(e) => setNewWaterSource({ ...newWaterSource, icon: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 font-bold"
                    >
                      <option value="Droplets">Droplets</option>
                      <option value="Droplet">Droplet</option>
                      <option value="Waves">Waves</option>
                      <option value="Target">Target</option>
                      <option value="Thermometer">Thermometer</option>
                      <option value="Gauge">Gauge</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Order</label>
                    <input
                      type="number"
                      value={newWaterSource.order}
                      onChange={(e) => setNewWaterSource({ ...newWaterSource, order: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 font-bold"
                      placeholder="0"
                    />
                  </div>
                </div>
                <button type="submit" className="w-full py-5 bg-sky-600 text-white rounded-[1.5rem] font-black uppercase tracking-widest hover:scale-[1.02] transition-all shadow-xl shadow-sky-600/20 mt-4">
                  {editingWaterSource ? 'Save Changes' : 'Add Source'}
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {/* Village Official Modal */}
        {showOfficialModal && (
          <div className="fixed inset-0 bg-[#0A0A0A]/90 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[2.5rem] shadow-2xl p-10 w-full max-w-lg relative">
              <button onClick={() => setShowOfficialModal(false)} className="absolute top-8 right-8 text-gray-300 hover:text-[#0A0A0A] transition-colors"><X className="w-6 h-6"/></button>
              <h3 className="text-3xl font-black text-[#0A0A0A] mb-2 tracking-tighter">
                {editingOfficial ? 'Update Official' : 'Add Village Official'}
              </h3>
              <p className="text-gray-400 mb-8 font-medium">
                {editingOfficial ? 'Update official details and photo' : 'Add a new village administrator or official'}
              </p>

              <form onSubmit={handleAddOfficial} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Full Name</label>
                    <input
                      type="text"
                      value={officialForm.name}
                      onChange={(e) => setOfficialForm({ ...officialForm, name: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#15803d]/10 focus:border-[#15803d] font-bold"
                      placeholder="e.g., Sangam Arpitha"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Title / Position</label>
                    <input
                      type="text"
                      value={officialForm.title}
                      onChange={(e) => setOfficialForm({ ...officialForm, title: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#15803d]/10 focus:border-[#15803d] font-bold"
                      placeholder="e.g., Sarpanch, Mallaram"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Photo</label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        onChange={(e) => setOfficialForm({ ...officialForm, file: e.target.files?.[0] || null })}
                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#15803d]/10 focus:border-[#15803d] font-bold file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-[#15803d]/10 file:text-[#15803d] file:font-black file:text-[10px] file:uppercase file:tracking-widest hover:file:bg-[#15803d]/20"
                      />
                    </div>
                    <p className="text-[10px] text-gray-400 font-medium mt-2">JPEG, PNG, WebP, or GIF. Max 10MB. Leave empty to keep existing photo when editing.</p>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Description / Bio</label>
                    <textarea
                      value={officialForm.description}
                      onChange={(e) => setOfficialForm({ ...officialForm, description: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#15803d]/10 focus:border-[#15803d] font-bold min-h-[80px]"
                      placeholder="Brief description or bio of the official..."
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Display Order</label>
                    <input
                      type="number"
                      value={officialForm.order}
                      onChange={(e) => setOfficialForm({ ...officialForm, order: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#15803d]/10 focus:border-[#15803d] font-bold"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="p-4 bg-[#15803d]/5 rounded-2xl border border-[#15803d]/10">
                  <div className="flex items-center gap-2 text-[10px] font-black text-[#15803d] uppercase tracking-widest mb-1">
                    <Shield className="w-3 h-3" />
                    Village Administration
                  </div>
                  <p className="text-xs font-medium text-gray-400">
                    {editingOfficial
                      ? 'Changes will reflect on the public Village Administration page immediately.'
                      : 'The official will appear on the public Village Administration page ordered by display order.'}
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={uploadingOfficial || !officialForm.name || !officialForm.title}
                  className="w-full py-5 bg-[#15803d] text-white rounded-[1.5rem] font-black uppercase tracking-widest hover:scale-[1.02] transition-all shadow-xl shadow-[#15803d]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploadingOfficial ? 'Uploading...' : editingOfficial ? 'Save Changes' : 'Add Official'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
        {/* Fund Allocations Modal */}
        {showAllocModal && (
          <div className="fixed inset-0 bg-[#0A0A0A]/90 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[2.5rem] shadow-2xl p-10 w-full max-w-lg relative">
              <button onClick={() => setShowAllocModal(false)} className="absolute top-8 right-8 text-gray-300 hover:text-[#0A0A0A] transition-colors"><X className="w-6 h-6"/></button>
              <h3 className="text-3xl font-black text-[#0A0A0A] mb-2 tracking-tighter">
                {editingAlloc ? 'Update Allocation' : 'Add Fund Allocation'}
              </h3>
              <p className="text-gray-400 mb-8 font-medium">
                {editingAlloc ? 'Update government fund grant details' : 'Record a new government fund grant allocated to the village'}
              </p>
              
              <form onSubmit={handleAddAlloc} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Total Amount (₹)</label>
                  <input
                    type="number"
                    value={newAlloc.totalAmount}
                    onChange={(e) => setNewAlloc({ ...newAlloc, totalAmount: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 font-bold"
                    placeholder="5000000"
                    min="0"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Fund Source</label>
                    <select
                      value={newAlloc.source}
                      onChange={(e) => setNewAlloc({ ...newAlloc, source: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 font-bold"
                    >
                      <option value="">Select source</option>
                      <option value="State Government">State Government</option>
                      <option value="Central Government">Central Government</option>
                      <option value="15th Finance Commission">15th Finance Commission</option>
                      <option value="Panchayat Funds">Panchayat Funds</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Fiscal Year</label>
                    <select
                      value={newAlloc.fiscalYear}
                      onChange={(e) => setNewAlloc({ ...newAlloc, fiscalYear: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 font-bold"
                    >
                      <option value="2024-2025">2024-2025</option>
                      <option value="2025-2026">2025-2026</option>
                      <option value="2026-2027">2026-2027</option>
                      <option value="2027-2028">2027-2028</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Description (Optional)</label>
                  <textarea
                    value={newAlloc.description}
                    onChange={(e) => setNewAlloc({ ...newAlloc, description: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 font-bold min-h-[80px]"
                    placeholder="e.g., 15th Finance Commission Grant for Mallaram Panchayat"
                  />
                </div>
                <button type="submit" className="w-full py-5 bg-emerald-600 text-white rounded-[1.5rem] font-black uppercase tracking-widest hover:scale-[1.02] transition-all shadow-xl shadow-emerald-600/20 mt-4">
                  {editingAlloc ? 'Save Changes' : 'Add Allocation'}
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {/* Events Modal */}
        {showEventModal && (
          <div className="fixed inset-0 bg-[#0A0A0A]/90 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[2.5rem] shadow-2xl p-10 w-full max-w-lg relative">
              <button onClick={() => setShowEventModal(false)} className="absolute top-8 right-8 text-gray-300 hover:text-[#0A0A0A] transition-colors"><X className="w-6 h-6"/></button>
              <h3 className="text-3xl font-black text-[#0A0A0A] mb-2 tracking-tighter">
                {editingEvent ? 'Update Event' : 'Add Village Event'}
              </h3>
              <p className="text-gray-400 mb-8 font-medium">
                {editingEvent ? 'Update the event details below.' : 'Add a new event to show on the home page.'}
              </p>
              <form onSubmit={handleAddEvent} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Event Title</label>
                  <input
                    type="text"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 font-bold"
                    placeholder="e.g., Bathukamma Celebrations"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Description</label>
                  <textarea
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 font-bold min-h-[80px]"
                    placeholder="Describe the event..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Date</label>
                    <input
                      type="text"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 font-bold"
                      placeholder="e.g., 15 Oct 2025"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Category</label>
                    <select
                      value={newEvent.category}
                      onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 font-bold appearance-none"
                    >
                      <option value="local">Local Event</option>
                      <option value="festivals">Festival</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Image URL</label>
                  <input
                    type="url"
                    value={newEvent.imageUrl}
                    onChange={(e) => setNewEvent({ ...newEvent, imageUrl: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 font-bold"
                    placeholder="https://example.com/event.jpg"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Display Order</label>
                  <input
                    type="number"
                    value={newEvent.order}
                    onChange={(e) => setNewEvent({ ...newEvent, order: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 font-bold"
                    placeholder="0"
                  />
                </div>
                <button type="submit" className="w-full py-5 bg-purple-600 text-white rounded-[1.5rem] font-black uppercase tracking-widest hover:scale-[1.02] transition-all shadow-xl shadow-purple-600/20 mt-4">
                  {editingEvent ? 'Save Changes' : 'Add Event'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      <Footer locale={locale} />
    </main>
  );
}
