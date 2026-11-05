import React, { useState } from 'react';
import { UserProfile, Booking } from '../types';
import { X, User, Shield, CheckCircle2, Clock, Calendar, Phone, Mail } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onUpdateUser: (user: UserProfile) => void;
  bookings: Booking[];
  onOpenAdmin: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateUser,
  bookings,
  onOpenAdmin,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'profile' | 'my-bookings'>('profile');
  const [name, setName] = useState(currentUser.name || 'Rahul Sharma');
  const [email, setEmail] = useState(currentUser.email || 'rahul.s@example.com');
  const [phone, setPhone] = useState(currentUser.phone || '+91 98765 12345');
  const [licenseNumber, setLicenseNumber] = useState(currentUser.licenseNumber || 'DL-04-202200192');

  const myBookings = bookings.filter(
    (b) =>
      b.customerEmail.toLowerCase() === email.toLowerCase() ||
      b.customerName.toLowerCase() === name.toLowerCase() ||
      b.customerPhone === phone
  );

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      name,
      email,
      phone,
      licenseNumber,
      isAdmin: currentUser.isAdmin,
    });
    onClose();
  };

  const handleSwitchToAdmin = () => {
    onUpdateUser({
      ...currentUser,
      name: 'Fleet Administrator',
      isAdmin: true,
    });
    onClose();
    onOpenAdmin();
  };

  const handleSwitchToCustomer = () => {
    setName('Rahul Sharma');
    setEmail('rahul.s@example.com');
    setPhone('+91 98765 12345');
    setLicenseNumber('DL-04-202200192');
    onUpdateUser({
      name: 'Rahul Sharma',
      email: 'rahul.s@example.com',
      phone: '+91 98765 12345',
      licenseNumber: 'DL-04-202200192',
      isAdmin: false,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">User Account</h3>
              <p className="text-xs text-slate-500">Fast one-click profile and booking ledger</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-100 px-6 pt-2 bg-white">
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'profile'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Profile & Fast KYC
          </button>
          <button
            onClick={() => setActiveTab('my-bookings')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'my-bookings'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            My Bookings ({myBookings.length})
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6">
          {activeTab === 'profile' ? (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              {/* Quick Persona Switcher */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Quick Demo Switch:</span>
                  <span className="text-[11px] text-slate-500">Test as Customer or Fleet Admin</span>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleSwitchToCustomer}
                    className="px-2.5 py-1 text-xs font-semibold bg-white border border-slate-200 rounded-lg hover:border-emerald-500"
                  >
                    Customer
                  </button>
                  <button
                    type="button"
                    onClick={handleSwitchToAdmin}
                    className="px-2.5 py-1 text-xs font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-1"
                  >
                    <Shield className="w-3 h-3" />
                    Admin
                  </button>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Driving License Number
                  </label>
                  <input
                    type="text"
                    required
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Save Profile
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {myBookings.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  No previous bookings found under this name.
                </div>
              ) : (
                myBookings.map((b) => (
                  <div
                    key={b.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-slate-900 text-sm">
                        {b.bookingCode}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          b.status === 'confirmed'
                            ? 'bg-blue-100 text-blue-800'
                            : b.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {b.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between font-semibold text-slate-800">
                      <span>{b.bikeName}</span>
                      <span className="text-emerald-700 font-bold">₹{b.totalAmount}</span>
                    </div>
                    <p className="text-slate-500 text-[11px]">
                      {b.startDate} to {b.endDate} · {b.pickupLocation}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
