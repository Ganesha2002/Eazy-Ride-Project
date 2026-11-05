import React, { useState } from 'react';
import { Bike, Booking, UserProfile } from '../types';
import { X, Calendar, ShieldCheck, CheckCircle2, MapPin, Gauge, Fuel, Cog, QrCode, FileText, ArrowRight } from 'lucide-react';
import { createBooking } from '../services/api';

interface BookingModalProps {
  bike: Bike | null;
  locations: string[];
  currentUser: UserProfile;
  initialDate?: string;
  initialLocation?: string;
  onClose: () => void;
  onBookingSuccess: (booking: Booking) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  bike,
  locations,
  currentUser,
  initialDate,
  initialLocation,
  onClose,
  onBookingSuccess,
}) => {
  if (!bike) return null;

  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const [pickupLoc, setPickupLoc] = useState(initialLocation && initialLocation !== 'all' ? initialLocation : bike.location);
  const [startDate, setStartDate] = useState(initialDate || todayStr);
  const [endDate, setEndDate] = useState(tomorrowStr);

  const [customerName, setCustomerName] = useState(currentUser.name || 'Rahul Sharma');
  const [customerPhone, setCustomerPhone] = useState(currentUser.phone || '+91 98765 43210');
  const [customerEmail, setCustomerEmail] = useState(currentUser.email || 'customer@eazyride.com');
  const [licenseNumber, setLicenseNumber] = useState(currentUser.licenseNumber || 'DL-04-202300189');

  const [helmetAddon, setHelmetAddon] = useState(true);
  const [insuranceAddon, setInsuranceAddon] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  // Calculate days
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = end.getTime() - start.getTime();
  const calculatedDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  // Pricing math
  const baseRent = calculatedDays * bike.pricePerDay;
  const helmetCost = helmetAddon ? 50 * calculatedDays : 0;
  const insuranceCost = insuranceAddon ? 150 * calculatedDays : 0;
  const securityDeposit = 1000; // Refundable deposit
  const totalAmount = baseRent + helmetCost + insuranceCost + securityDeposit;

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bike.available) {
      setError('This bike is currently reserved. Please choose another bike or check back later.');
      return;
    }
    if (!customerName || !customerPhone || !licenseNumber) {
      setError('Please provide your name, phone number, and valid driving license.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await createBooking({
        bikeId: bike.id,
        customerName,
        customerEmail,
        customerPhone,
        licenseNumber,
        pickupLocation: pickupLoc,
        startDate,
        endDate,
        days: calculatedDays,
        helmetAddon,
        insuranceAddon,
        totalAmount,
      });

      setConfirmedBooking(result);
      onBookingSuccess(result);
    } catch (err: any) {
      setError(err.message || 'Failed to complete booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8">
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
              {confirmedBooking ? 'Booking Confirmed' : 'Instant Reservation'}
            </span>
            <h3 className="text-lg font-extrabold text-slate-900">
              {confirmedBooking ? 'Your Eazy Ride Pass' : `Book ${bike.name}`}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {confirmedBooking ? (
          /* Booking Confirmation State */
          <div className="p-6 sm:p-8 space-y-6">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-3">
              <div className="w-14 h-14 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-slate-900">Booking Confirmed!</h4>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Your bike is blocked and ready for pickup at{' '}
                <strong className="text-slate-900">{confirmedBooking.pickupLocation}</strong>.
              </p>
              <div className="inline-block bg-white border border-emerald-300 rounded-xl px-4 py-2 text-sm font-mono font-bold text-emerald-800 tracking-wider">
                Booking ID: {confirmedBooking.bookingCode}
              </div>
            </div>

            {/* Receipt Details Grid */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-400">Rider:</span>
                <p className="font-semibold text-slate-800">{confirmedBooking.customerName}</p>
              </div>
              <div>
                <span className="text-slate-400">Vehicle:</span>
                <p className="font-semibold text-slate-800">{confirmedBooking.bikeName}</p>
              </div>
              <div>
                <span className="text-slate-400">Duration:</span>
                <p className="font-semibold text-slate-800">
                  {confirmedBooking.startDate} to {confirmedBooking.endDate} ({confirmedBooking.days} day{confirmedBooking.days > 1 ? 's' : ''})
                </p>
              </div>
              <div>
                <span className="text-slate-400">Total Paid:</span>
                <p className="font-bold text-emerald-700 text-sm">₹{confirmedBooking.totalAmount}</p>
              </div>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Security Deposit Note:</p>
                <p className="text-blue-700">₹1,000 security deposit will be automatically credited back to your account upon returning the vehicle safely.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-colors cursor-pointer"
              >
                Close & View Fleet
              </button>
            </div>
          </div>
        ) : (
          /* Active Booking Form */
          <form onSubmit={handleBookingSubmit} className="p-6 sm:p-8 space-y-6">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                {error}
              </div>
            )}

            {/* Bike Summary Card */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
              <img
                src={bike.imageUrl}
                alt={bike.name}
                className="w-24 h-16 object-cover rounded-xl bg-slate-200 shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 truncate">{bike.name}</h4>
                  <span className="font-extrabold text-emerald-600 text-sm whitespace-nowrap">
                    ₹{bike.pricePerDay}/day
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                  <span>{bike.engineCc}</span>
                  <span>·</span>
                  <span>{bike.fuelType}</span>
                  <span>·</span>
                  <span>{bike.transmission}</span>
                </div>
              </div>
            </div>

            {/* Trip Details: Dates & Location */}
            <div className="space-y-4">
              <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                1. Trip Details
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-600">Pickup Hub</label>
                  <select
                    value={pickupLoc}
                    onChange={(e) => setPickupLoc(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-emerald-500"
                  >
                    {locations.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-600">Start Date</label>
                  <input
                    type="date"
                    min={todayStr}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-600">Return Date</label>
                  <input
                    type="date"
                    min={startDate}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Rider Information */}
            <div className="space-y-4">
              <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                2. Rider Information
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-600">Full Name</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-600">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-600">Email Address</label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-600">Driving License Number</label>
                  <input
                    type="text"
                    required
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    placeholder="e.g. DL-04-202300189"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Optional Add-ons */}
            <div className="space-y-3">
              <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                3. Safety & Protection Add-ons
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={helmetAddon}
                    onChange={(e) => setHelmetAddon(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <div className="text-xs">
                    <span className="font-semibold text-slate-800 block">Extra ISI Helmet</span>
                    <span className="text-slate-500">+₹50/day</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={insuranceAddon}
                    onChange={(e) => setInsuranceAddon(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <div className="text-xs">
                    <span className="font-semibold text-slate-800 block">Zero-Deductible Waiver</span>
                    <span className="text-slate-500">+₹150/day</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between text-slate-600">
                <span>Base Rent ({calculatedDays} day{calculatedDays > 1 ? 's' : ''} × ₹{bike.pricePerDay})</span>
                <span className="font-semibold text-slate-900">₹{baseRent}</span>
              </div>
              {helmetAddon && (
                <div className="flex justify-between text-slate-600">
                  <span>Extra ISI Helmet ({calculatedDays} day{calculatedDays > 1 ? 's' : ''})</span>
                  <span className="font-semibold text-slate-900">₹{helmetCost}</span>
                </div>
              )}
              {insuranceAddon && (
                <div className="flex justify-between text-slate-600">
                  <span>Damage Waiver Insurance</span>
                  <span className="font-semibold text-slate-900">₹{insuranceCost}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Refundable Security Deposit</span>
                <span className="font-semibold text-slate-900">₹{securityDeposit}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-extrabold text-slate-900">
                <span>Grand Total</span>
                <span className="text-emerald-600 text-base">₹{totalAmount}</span>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting || !bike.available}
                className="w-full py-3 px-6 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold text-sm rounded-xl transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg hover:shadow-emerald-600/20 active:scale-98 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Reserving Bike in Real-Time DB...</span>
                ) : (
                  <>
                    <span>Confirm & Book Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
