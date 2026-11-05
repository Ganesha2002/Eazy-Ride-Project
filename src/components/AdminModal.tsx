import React, { useState } from 'react';
import { Bike, Booking, FleetStats } from '../types';
import { X, Plus, Trash2, Edit2, CheckCircle2, Clock, DollarSign, Bike as BikeIcon, RefreshCw, AlertTriangle, ShieldCheck } from 'lucide-react';
import { createBike, updateBike, deleteBike, toggleBikeStatus, updateBookingStatus, resetDatabase } from '../services/api';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  bikes: Bike[];
  bookings: Booking[];
  stats: FleetStats | null;
  locations: string[];
  isRealtimeConnected: boolean;
  onDataRefresh: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  bikes,
  bookings,
  stats,
  locations,
  isRealtimeConnected,
  onDataRefresh,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'fleet' | 'bookings' | 'add'>('fleet');
  const [editingBike, setEditingBike] = useState<Bike | null>(null);

  // Form State for Adding / Editing Bike
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'scooter' | 'cruiser' | 'sports' | 'electric'>('scooter');
  const [pricePerDay, setPricePerDay] = useState<number>(600);
  const [description, setDescription] = useState('');
  const [engineCc, setEngineCc] = useState('125cc');
  const [fuelType, setFuelType] = useState<'Petrol' | 'Electric'>('Petrol');
  const [transmission, setTransmission] = useState<'Auto' | 'Manual'>('Auto');
  const [location, setLocation] = useState(locations[0] || 'City Center Hub');
  const [imageUrl, setImageUrl] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleStartEdit = (b: Bike) => {
    setEditingBike(b);
    setName(b.name);
    setCategory(b.category);
    setPricePerDay(b.pricePerDay);
    setDescription(b.description);
    setEngineCc(b.engineCc);
    setFuelType(b.fuelType);
    setTransmission(b.transmission);
    setLocation(b.location);
    setImageUrl(b.imageUrl);
    setActiveTab('add');
  };

  const handleSaveBike = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingBike) {
        await updateBike(editingBike.id, {
          name,
          category,
          pricePerDay,
          description,
          engineCc,
          fuelType,
          transmission,
          location,
          imageUrl: imageUrl || undefined,
        });
        showNotification(`Updated ${name} in real-time database!`);
      } else {
        await createBike({
          name,
          category,
          pricePerDay,
          description,
          engineCc,
          fuelType,
          transmission,
          location,
          imageUrl: imageUrl || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80',
          available: true,
        });
        showNotification(`Added ${name} to fleet!`);
      }

      // Reset form
      setEditingBike(null);
      setName('');
      setDescription('');
      setActiveTab('fleet');
      onDataRefresh();
    } catch (err: any) {
      alert(err.message || 'Error saving bike');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleBike = async (id: string, currentAvailable: boolean) => {
    try {
      await toggleBikeStatus(id, !currentAvailable);
      showNotification(`Availability toggled for bike ${id}`);
    } catch (err: any) {
      alert(err.message || 'Failed to toggle status');
    }
  };

  const handleDelete = async (id: string, bikeName: string) => {
    if (!window.confirm(`Are you sure you want to delete "${bikeName}"?`)) return;
    try {
      await deleteBike(id);
      showNotification(`Deleted ${bikeName}`);
      onDataRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to delete bike');
    }
  };

  const handleStatusUpdate = async (bookingId: string, status: Booking['status']) => {
    try {
      await updateBookingStatus(bookingId, status);
      showNotification(`Booking status updated to "${status}"`);
      onDataRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to update booking');
    }
  };

  const handleReset = async () => {
    if (!window.confirm('Reset database to default seed state? This restores default bikes and bookings.')) return;
    try {
      await resetDatabase();
      showNotification('Database successfully restored to initial demo state!');
      onDataRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to reset database');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Eazy Ride Admin Control</h3>
                <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-emerald-400 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {isRealtimeConnected ? 'Live SSE Connected' : 'Connecting...'}
                </span>
              </div>
              <p className="text-xs text-slate-400">Manage fleet availability, edit bikes, and track live bookings</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Real-time KPI Stats Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 border-b border-slate-100 text-xs">
          <div className="p-3 bg-white rounded-xl border border-slate-200">
            <span className="text-slate-500 block">Total Fleet</span>
            <span className="text-xl font-black text-slate-900">{stats?.totalBikes ?? bikes.length} Bikes</span>
          </div>
          <div className="p-3 bg-white rounded-xl border border-slate-200">
            <span className="text-slate-500 block">Available Now</span>
            <span className="text-xl font-black text-emerald-600">
              {stats?.availableBikes ?? bikes.filter((b) => b.available).length}
            </span>
          </div>
          <div className="p-3 bg-white rounded-xl border border-slate-200">
            <span className="text-slate-500 block">Active Bookings</span>
            <span className="text-xl font-black text-blue-600">{stats?.activeBookings ?? bookings.length}</span>
          </div>
          <div className="p-3 bg-white rounded-xl border border-slate-200">
            <span className="text-slate-500 block">Total Revenue</span>
            <span className="text-xl font-black text-emerald-700">₹{stats?.totalRevenue ?? 0}</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 py-2 border-b border-slate-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setEditingBike(null);
                setActiveTab('fleet');
              }}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
                activeTab === 'fleet' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Fleet Inventory ({bikes.length})
            </button>
            <button
              onClick={() => {
                setEditingBike(null);
                setActiveTab('bookings');
              }}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
                activeTab === 'bookings' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Customer Bookings ({bookings.length})
            </button>
            <button
              onClick={() => {
                setEditingBike(null);
                setName('');
                setDescription('');
                setActiveTab('add');
              }}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
                activeTab === 'add' ? 'bg-emerald-600 text-white' : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{editingBike ? 'Edit Bike' : 'Add New Bike'}</span>
            </button>
          </div>

          <button
            onClick={handleReset}
            title="Reset database to initial demo values"
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-red-600 transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset Demo DB</span>
          </button>
        </div>

        {/* Notification Toast in modal */}
        {notification && (
          <div className="bg-emerald-600 text-white text-xs font-medium py-2 px-6 text-center animate-fade-in">
            {notification}
          </div>
        )}

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'fleet' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Click the availability toggle to simulate real-time reservation updates across all open tabs.</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bikes.map((bike) => (
                  <div
                    key={bike.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={bike.imageUrl}
                        alt={bike.name}
                        className="w-14 h-14 rounded-xl object-cover bg-slate-100 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-sm truncate">{bike.name}</h4>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                            {bike.category}
                          </span>
                        </div>
                        <p className="text-xs text-emerald-600 font-extrabold">₹{bike.pricePerDay}/day</p>
                        <p className="text-[11px] text-slate-400 truncate">{bike.location} · {bike.engineCc}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {/* Availability Toggle */}
                      <button
                        onClick={() => handleToggleBike(bike.id, bike.available)}
                        className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                          bike.available
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                        }`}
                      >
                        {bike.available ? 'Available' : 'Booked'}
                      </button>

                      {/* Edit Button */}
                      <button
                        onClick={() => handleStartEdit(bike)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                        title="Edit bike details"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(bike.id, bike.name)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete bike"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="space-y-4">
              {bookings.length === 0 ? (
                <div className="py-16 text-center text-slate-400 text-sm">
                  No bookings found in the database yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-600">
                    <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="p-3 rounded-l-xl">Code</th>
                        <th className="p-3">Customer</th>
                        <th className="p-3">Vehicle</th>
                        <th className="p-3">Dates</th>
                        <th className="p-3">Total</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 rounded-r-xl">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {bookings.map((b) => (
                        <tr key={b.id} className="hover:bg-slate-50">
                          <td className="p-3 font-mono font-bold text-slate-900">{b.bookingCode}</td>
                          <td className="p-3">
                            <span className="font-semibold text-slate-900 block">{b.customerName}</span>
                            <span className="text-[11px] text-slate-400">{b.customerPhone}</span>
                          </td>
                          <td className="p-3 font-medium text-slate-800">{b.bikeName}</td>
                          <td className="p-3">
                            {b.startDate} to {b.endDate} ({b.days}d)
                          </td>
                          <td className="p-3 font-bold text-emerald-700">₹{b.totalAmount}</td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                b.status === 'confirmed'
                                  ? 'bg-blue-100 text-blue-800'
                                  : b.status === 'active'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : b.status === 'completed'
                                  ? 'bg-slate-200 text-slate-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {b.status}
                            </span>
                          </td>
                          <td className="p-3">
                            <select
                              value={b.status}
                              onChange={(e) => handleStatusUpdate(b.id, e.target.value as any)}
                              className="px-2 py-1 text-xs bg-white border border-slate-300 rounded-lg font-medium text-slate-700 cursor-pointer"
                            >
                              <option value="confirmed">Confirmed</option>
                              <option value="active">Active (Riding)</option>
                              <option value="completed">Completed (Free Bike)</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'add' && (
            <form onSubmit={handleSaveBike} className="max-w-2xl mx-auto space-y-4">
              <h4 className="text-sm font-bold text-slate-900">
                {editingBike ? `Edit Details: ${editingBike.name}` : 'Register New Bike in Fleet'}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Bike Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Enfield Hunter 350"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="scooter">Scooter</option>
                    <option value="cruiser">Cruiser</option>
                    <option value="sports">Sports</option>
                    <option value="electric">Electric</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Price per Day (₹) *</label>
                  <input
                    type="number"
                    required
                    min={100}
                    value={pricePerDay}
                    onChange={(e) => setPricePerDay(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Engine / Capacity</label>
                  <input
                    type="text"
                    placeholder="e.g. 350cc or 3.7 kWh"
                    value={engineCc}
                    onChange={(e) => setEngineCc(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Fuel Type</label>
                  <select
                    value={fuelType}
                    onChange={(e) => setFuelType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Electric">Electric</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Transmission</label>
                  <select
                    value={transmission}
                    onChange={(e) => setTransmission(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Auto">Automatic</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="font-semibold text-slate-700">Pickup Hub Location</label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  >
                    {locations.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="font-semibold text-slate-700">Short Description</label>
                  <textarea
                    rows={2}
                    placeholder="Brief highlights of this bike..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="font-semibold text-slate-700">Image URL (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 text-xs"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setEditingBike(null);
                    setActiveTab('fleet');
                  }}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
                >
                  {isSubmitting ? 'Saving to Database...' : editingBike ? 'Update Bike' : 'Save Bike'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
