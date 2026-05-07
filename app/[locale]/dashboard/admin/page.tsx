'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Locale, getDictionary } from '@/lib/i18n';
import Navigation from '@/components/Navigation/Navigation';
import Footer from '@/components/Footer/Footer';
import { motion } from 'framer-motion';
import { HiOutlineDocumentSearch, HiOutlineDatabase, HiOutlineCloudUpload, HiOutlineCheck, HiOutlineX, HiOutlineCurrencyRupee, HiOutlinePlus, HiOutlineBell, HiOutlineLocationMarker, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';
import { WeatherWidget } from '@/components/Agriculture/AgriWidgets';

export default function AdminDashboard() {
  const params = useParams();
  const locale = (params?.locale as Locale) || 'en';
  const [bookings, setBookings] = useState<any[]>([]);
  const [marketPrices, setMarketPrices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPrice, setEditingPrice] = useState<any>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [editingBooking, setEditingBooking] = useState<any>(null);
  const [newPrice, setNewPrice] = useState({ cropName: '', price: '', unit: 'Quintal' });

  useEffect(() => {
    fetchBookings();
    fetchMarketPrices();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/bookings');
      const data = await res.json();
      setBookings(data);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
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

  const handleEditPrice = (price: any) => {
    setEditingPrice({ ...price });
    setShowEditModal(true);
  };

  const handleUpdatePrice = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/market-prices?id=${editingPrice.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cropName: editingPrice.cropName,
          price: editingPrice.price,
          unit: editingPrice.unit,
        }),
      });
      if (res.ok) {
        setShowEditModal(false);
        setEditingPrice(null);
        fetchMarketPrices();
      }
    } catch (error) {
      console.error('Failed to update price:', error);
    }
  };

  const handleDeletePrice = async (id: string) => {
    if (!confirm('Are you sure you want to delete this price?')) return;
    try {
      const res = await fetch(`/api/market-prices?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchMarketPrices();
      }
    } catch (error) {
      console.error('Failed to delete price:', error);
    }
  };

  const updateBookingStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/bookings?id=${id}&status=${status}`, { method: 'PUT' });
      if (res.ok) {
        setBookings(bookings.map(b => b.id === id ? { ...b, status } : b));
      }
    } catch (error) {
      console.error('Failed to update booking status:', error);
    }
  };

  const handleEditBooking = (booking: any) => {
    setEditingBooking({ ...booking });
    setShowBookingModal(true);
  };

  const handleUpdateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/bookings?id=${editingBooking.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editingBooking.user?.name,
          phone: editingBooking.user?.phone,
        }),
      });
      if (res.ok) {
        setShowBookingModal(false);
        setEditingBooking(null);
        fetchBookings();
      }
    } catch (error) {
      console.error('Failed to update booking:', error);
    }
  };

  const handleDeleteBooking = async (id: string) => {
    if (!confirm('Are you sure you want to delete this booking?')) return;
    try {
      const res = await fetch(`/api/bookings?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchBookings();
      }
    } catch (error) {
      console.error('Failed to delete booking:', error);
    }
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

  return (
    <main className="min-h-screen bg-gray-50">
      <Navigation locale={locale} />
      
      <div className="pt-40 lg:pt-48 max-w-7xl mx-auto px-4 pb-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-black text-primary-dark tracking-tighter">Admin Control Center</h1>
            <p className="text-earth">Manage village agricultural operations</p>
          </div>
          <div className="flex gap-2">
            <button className="px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all flex items-center gap-2">
              <HiOutlineDatabase className="w-4 h-4" />
              Export Data
            </button>
            <button 
              onClick={() => setShowPriceModal(true)}
              className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary-dark transition-all flex items-center gap-2"
            >
              <HiOutlineCloudUpload className="w-4 h-4" />
              Update Prices
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8 mb-12">
          {/* Stats Cards */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="text-sm font-bold text-gray-400 uppercase mb-1">Total Bookings</div>
            <div className="text-4xl font-black text-primary-dark">{bookings.length}</div>
            <div className="text-xs text-green-600 font-bold mt-2">+12% from yesterday</div>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="text-sm font-bold text-gray-400 uppercase mb-1">Pending Approval</div>
            <div className="text-4xl font-black text-amber-500">{bookings.filter(b => b.status === 'PENDING').length}</div>
            <div className="text-xs text-amber-600 font-bold mt-2">Requires immediate action</div>
          </div>
          <div className="bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-3xl shadow-lg shadow-red-500/20 text-white">
            <div className="text-sm font-bold uppercase mb-1 opacity-80">Send Alert</div>
            <div className="text-lg font-black mb-3">Village Broadcast</div>
            <a 
              href="https://voice.sendgun.in/login.php" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-red-600 rounded-xl text-sm font-bold hover:bg-red-50 transition-all shadow-lg"
            >
              <HiOutlineBell className="w-4 h-4" />
              Send Alert
            </a>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="text-sm font-bold text-gray-400 uppercase mb-1">Location</div>
            <div className="text-xl font-black text-primary-dark flex items-center gap-2">
              <HiOutlineLocationMarker className="w-5 h-5 text-earth" />
              Mallaram
            </div>
            <div className="text-xs text-gray-500 font-bold mt-2">IKP Centre, DCF Office</div>
          </div>
        </div>

        {/* Weather & Quick Actions */}
        <div className="grid lg:grid-cols-4 gap-8 mb-12">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-black text-primary-dark mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                Weather Report
              </h3>
              <WeatherWidget />
            </div>
          </div>
          <div className="lg:col-span-3">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-12">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-xl font-bold text-primary-dark flex items-center gap-2">
              <HiOutlineCurrencyRupee className="text-earth" />
              Market Prices
            </h2>
            <button 
              onClick={() => setShowPriceModal(true)}
              className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary-dark transition-all flex items-center gap-2"
            >
              <HiOutlinePlus className="w-4 h-4" />
              Add Price
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                  <th className="px-6 py-4">Crop Name</th>
                  <th className="px-6 py-4">Price (per Quintal)</th>
                  <th className="px-6 py-4">District</th>
                  <th className="px-6 py-4">Last Updated</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {marketPrices.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400 italic">No market prices available.</td></tr>
                ) : marketPrices.map((price) => (
                  <tr key={price.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-primary-dark">{price.cropName}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-black text-green-600">₹{price.price.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{price.district}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{new Date(price.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleEditPrice(price)}
                          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                          title="Edit"
                        >
                          <HiOutlinePencil className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeletePrice(price.id)}
                          className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                          title="Delete"
                        >
                          <HiOutlineTrash className="w-4 h-4" />
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
      </div>

        {/* Booking Management Table */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-xl font-bold text-primary-dark flex items-center gap-2">
              <HiOutlineDocumentSearch className="text-earth" />
              IKP Centre Bookings
            </h2>
            <div className="flex items-center gap-2">
              <input 
                type="text" 
                placeholder="Search farmers..." 
                className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                  <th className="px-6 py-4">Farmer</th>
                  <th className="px-6 py-4">Date & Time</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400 italic">Loading bookings...</td></tr>
                ) : bookings.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400 italic">No bookings found.</td></tr>
                ) : bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-primary-dark">{booking.user?.name || 'Unknown Farmer'}</div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase">{booking.user?.phone || 'No phone'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium">{new Date(booking.slot.date).toLocaleDateString()}</div>
                      <div className="text-xs text-gray-500">{booking.slot.startTime} - {booking.slot.endTime}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{booking.slot.location}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                        booking.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                        booking.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {booking.status === 'PENDING' && (
                          <>
                            <button 
                              onClick={() => updateBookingStatus(booking.id, 'APPROVED')}
                              className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                              title="Approve"
                            >
                              <HiOutlineCheck className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => updateBookingStatus(booking.id, 'REJECTED')}
                              className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                              title="Reject"
                            >
                              <HiOutlineX className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button 
                          onClick={() => handleEditBooking(booking)}
                          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                          title="Edit"
                        >
                          <HiOutlinePencil className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteBooking(booking.id)}
                          className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                          title="Delete"
                        >
                          <HiOutlineTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Price Modal */}
        {showPriceModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-md">
              <h3 className="text-xl font-black text-primary-dark mb-4">Add Market Price</h3>
              <form onSubmit={handleAddPrice} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-1">Crop Name</label>
                  <input
                    type="text"
                    value={newPrice.cropName}
                    onChange={(e) => setNewPrice({ ...newPrice, cropName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="e.g., Paddy, Cotton, Maize"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-1">Price (per Quintal)</label>
                  <input
                    type="number"
                    value={newPrice.price}
                    onChange={(e) => setNewPrice({ ...newPrice, price: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="e.g., 2203"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-1">Unit</label>
                  <select
                    value={newPrice.unit}
                    onChange={(e) => setNewPrice({ ...newPrice, unit: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="Quintal">Quintal</option>
                    <option value="Kg">Kg</option>
                    <option value="Ton">Ton</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowPriceModal(false)}
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary-dark transition-all"
                  >
                    Add Price
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Price Modal */}
        {showEditModal && editingPrice && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-md">
              <h3 className="text-xl font-black text-primary-dark mb-4">Edit Market Price</h3>
              <form onSubmit={handleUpdatePrice} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-1">Crop Name</label>
                  <input
                    type="text"
                    value={editingPrice.cropName}
                    onChange={(e) => setEditingPrice({ ...editingPrice, cropName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-1">Price (per Quintal)</label>
                  <input
                    type="number"
                    value={editingPrice.price}
                    onChange={(e) => setEditingPrice({ ...editingPrice, price: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-1">Unit</label>
                  <select
                    value={editingPrice.unit}
                    onChange={(e) => setEditingPrice({ ...editingPrice, unit: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="Quintal">Quintal</option>
                    <option value="Kg">Kg</option>
                    <option value="Ton">Ton</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => { setShowEditModal(false); setEditingPrice(null); }}
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-xl text-sm font-bold hover:bg-blue-600 transition-all"
                  >
                    Update Price
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Booking Modal */}
        {showBookingModal && editingBooking && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-md">
              <h3 className="text-xl font-black text-primary-dark mb-4">Edit Booking</h3>
              <form onSubmit={handleUpdateBooking} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-1">Farmer Name</label>
                  <input
                    type="text"
                    value={editingBooking.user?.name || ''}
                    onChange={(e) => setEditingBooking({ ...editingBooking, user: { ...editingBooking.user, name: e.target.value } })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={editingBooking.user?.phone || ''}
                    onChange={(e) => setEditingBooking({ ...editingBooking, user: { ...editingBooking.user, phone: e.target.value } })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-1">Status</label>
                  <select
                    value={editingBooking.status}
                    onChange={(e) => setEditingBooking({ ...editingBooking, status: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="APPROVED">Approved</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => { setShowBookingModal(false); setEditingBooking(null); }}
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-xl text-sm font-bold hover:bg-blue-600 transition-all"
                  >
                    Update Booking
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <Footer locale={locale} />
    </main>
  );
}
