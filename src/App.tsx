/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Bike, Booking, FleetStats, SearchFilter, UserProfile } from './types';
import { fetchBikes, fetchBookings, fetchStats, subscribeToRealtimeUpdates, toggleBikeStatus } from './services/api';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { RentalsSection } from './components/RentalsSection';
import { StatsBar } from './components/StatsBar';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { AdminModal } from './components/AdminModal';
import { AuthModal } from './components/AuthModal';
import { ToastNotification, ToastItem } from './components/ToastNotification';

export default function App() {
  // Database States
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [locations, setLocations] = useState<string[]>([
    'City Center Hub',
    'Airport Terminal 2',
    'Metro Hub - North',
    'Tech Park Station',
    'Beach Promenade',
  ]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<FleetStats | null>(null);
  const [isLoadingBikes, setIsLoadingBikes] = useState(true);
  const [isRealtimeConnected, setIsRealtimeConnected] = useState(false);

  // Search & Filter State
  const [filter, setFilter] = useState<SearchFilter>({
    location: 'all',
    date: '',
    type: 'all',
    searchQuery: '',
    sortBy: 'featured',
  });

  // User & Auth State
  const [currentUser, setCurrentUser] = useState<UserProfile>({
    name: 'Rahul Sharma',
    email: 'rahul.s@example.com',
    phone: '+91 98765 12345',
    licenseNumber: 'DL-04-202200192',
    isAdmin: false,
  });

  // Modal Dialogs
  const [selectedBikeForBooking, setSelectedBikeForBooking] = useState<Bike | null>(null);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Live Toast Notifications
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((title: string, message: string) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev.slice(-3), { id, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Initial Data Fetch
  const loadData = useCallback(async () => {
    try {
      const [bikesRes, bookingsRes, statsRes] = await Promise.all([
        fetchBikes(),
        fetchBookings(),
        fetchStats(),
      ]);

      setBikes(bikesRes.bikes);
      if (bikesRes.locations?.length) setLocations(bikesRes.locations);
      setBookings(bookingsRes);
      setStats(statsRes);
    } catch (err) {
      console.error('Failed to load initial data:', err);
    } finally {
      setIsLoadingBikes(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Subscribe to Real-Time SSE Updates from Server
  useEffect(() => {
    const unsubscribe = subscribeToRealtimeUpdates(
      (event) => {
        switch (event.type) {
          case 'CONNECTED':
            setIsRealtimeConnected(true);
            break;

          case 'BIKE_ADDED': {
            const newBike: Bike = event.payload;
            setBikes((prev) => [newBike, ...prev.filter((b) => b.id !== newBike.id)]);
            addToast('Fleet Expanded', `${newBike.name} added to the rental fleet!`);
            fetchStats().then(setStats).catch(() => {});
            break;
          }

          case 'BIKE_UPDATED': {
            const updatedBike: Bike = event.payload;
            setBikes((prev) => prev.map((b) => (b.id === updatedBike.id ? updatedBike : b)));
            addToast('Fleet Update', `${updatedBike.name} specifications updated.`);
            break;
          }

          case 'BIKE_STATUS_CHANGED': {
            const bike: Bike = event.payload;
            setBikes((prev) => prev.map((b) => (b.id === bike.id ? bike : b)));
            addToast(
              'Real-Time Fleet Status',
              `${bike.name} is now ${bike.available ? 'AVAILABLE' : 'RESERVED'}`
            );
            fetchStats().then(setStats).catch(() => {});
            break;
          }

          case 'BIKE_DELETED': {
            const { id } = event.payload;
            setBikes((prev) => prev.filter((b) => b.id !== id));
            fetchStats().then(setStats).catch(() => {});
            break;
          }

          case 'BOOKING_CREATED': {
            const newBooking: Booking = event.payload;
            setBookings((prev) => [newBooking, ...prev]);
            addToast('New Live Booking', `${newBooking.bikeName} booked (${newBooking.bookingCode})`);
            fetchStats().then(setStats).catch(() => {});
            break;
          }

          case 'BOOKING_STATUS_CHANGED': {
            const updatedBooking: Booking = event.payload;
            setBookings((prev) => prev.map((b) => (b.id === updatedBooking.id ? updatedBooking : b)));
            fetchStats().then(setStats).catch(() => {});
            break;
          }

          case 'DATABASE_RESET': {
            loadData();
            addToast('Database Synced', 'Database restored to initial demo state');
            break;
          }

          default:
            break;
        }
      },
      (connected) => {
        setIsRealtimeConnected(connected);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [addToast, loadData]);

  // Filter & Search Logic
  const filteredBikes = useMemo(() => {
    let list = [...bikes];

    // Category filter
    if (filter.type && filter.type !== 'all') {
      list = list.filter((b) => b.category === filter.type);
    }

    // Location filter
    if (filter.location && filter.location !== 'all') {
      list = list.filter((b) => b.location.toLowerCase().includes(filter.location.toLowerCase()));
    }

    // Text Search
    if (filter.searchQuery.trim()) {
      const q = filter.searchQuery.toLowerCase();
      list = list.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q) ||
          b.engineCc.toLowerCase().includes(q)
      );
    }

    // Sorting
    if (filter.sortBy === 'price-asc') {
      list.sort((a, b) => a.pricePerDay - b.pricePerDay);
    } else if (filter.sortBy === 'price-desc') {
      list.sort((a, b) => b.pricePerDay - a.pricePerDay);
    } else if (filter.sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [bikes, filter]);

  // Navigation Smooth Scroll Handler
  const handleNavSelect = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleHeroSearch = () => {
    handleNavSelect('rentals');
  };

  const handleToggleBikeStatus = async (id: string, currentAvailable: boolean) => {
    try {
      await toggleBikeStatus(id, !currentAvailable);
    } catch (err) {
      console.error('Error toggling status:', err);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* 1. Header Navigation Bar */}
      <Navbar
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
        onSelectNav={handleNavSelect}
        isRealtimeConnected={isRealtimeConnected}
      />

      <main className="flex-1">
        {/* 2. Hero Section with Motorcycle Backdrop & Filter Bar */}
        <Hero
          locations={locations}
          filter={filter}
          onFilterChange={(newF) => setFilter((prev) => ({ ...prev, ...newF }))}
          onSearchSubmit={handleHeroSearch}
        />

        {/* 3. How It Works - 3 Step Flow */}
        <HowItWorks />

        {/* 4. Our Top Rentals Section with Fleet Cards */}
        <RentalsSection
          bikes={filteredBikes}
          filter={filter}
          onFilterChange={(newF) => setFilter((prev) => ({ ...prev, ...newF }))}
          onBookBike={(bike) => setSelectedBikeForBooking(bike)}
          isAdmin={currentUser.isAdmin}
          onOpenAddBike={() => setIsAdminModalOpen(true)}
          onToggleStatus={handleToggleBikeStatus}
          isLoading={isLoadingBikes}
        />

        {/* 5. Stats Counter Section */}
        <StatsBar stats={stats} isRealtimeConnected={isRealtimeConnected} />
      </main>

      {/* 6. Footer */}
      <Footer
        onSelectNav={handleNavSelect}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
      />

      {/* Booking Flow Modal */}
      {selectedBikeForBooking && (
        <BookingModal
          bike={selectedBikeForBooking}
          locations={locations}
          currentUser={currentUser}
          initialDate={filter.date}
          initialLocation={filter.location}
          onClose={() => setSelectedBikeForBooking(null)}
          onBookingSuccess={() => {
            // Live broadcast will automatically sync state across tabs
          }}
        />
      )}

      {/* Admin Management Modal */}
      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        bikes={bikes}
        bookings={bookings}
        stats={stats}
        locations={locations}
        isRealtimeConnected={isRealtimeConnected}
        onDataRefresh={loadData}
      />

      {/* User Login & Profile Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onUpdateUser={setCurrentUser}
        bookings={bookings}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
      />

      {/* Real-Time Database Push Notifications */}
      <ToastNotification toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
}
