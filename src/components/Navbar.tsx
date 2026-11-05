import React, { useState } from 'react';
import { Bike, Shield, User, Menu, X, Radio } from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  currentUser: UserProfile;
  onOpenAuth: () => void;
  onOpenAdmin: () => void;
  onSelectNav: (sectionId: string) => void;
  isRealtimeConnected: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onOpenAuth,
  onOpenAdmin,
  onSelectNav,
  isRealtimeConnected,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    onSelectNav(sectionId);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-6">
        {/* Brand Zone */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2.5 group cursor-pointer focus:outline-hidden"
          aria-label="Eazy Ride Home"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-200">
            <Bike className="w-6 h-6 stroke-[2.2]" />
          </div>
          <span className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-1">
            <span className="text-emerald-600">Eazy</span>
            <span>Ride</span>
          </span>
        </button>

        {/* Live Database Sync Indicator */}
        <div className="hidden lg:flex items-center gap-2 text-xs font-medium text-slate-500 bg-slate-50 border border-slate-200/60 rounded-full px-3 py-1">
          <span className="relative flex h-2 w-2">
            {isRealtimeConnected && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            )}
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                isRealtimeConnected ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
            ></span>
          </span>
          <span>{isRealtimeConnected ? 'Live DB Synced' : 'Connecting DB...'}</span>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-700">
          <button
            onClick={() => handleNavClick('home')}
            className="hover:text-emerald-600 transition-colors cursor-pointer py-1"
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick('rentals')}
            className="hover:text-emerald-600 transition-colors cursor-pointer py-1"
          >
            bikes
          </button>
          <button
            onClick={() => handleNavClick('how-it-works')}
            className="hover:text-emerald-600 transition-colors cursor-pointer py-1"
          >
            How It Works
          </button>
          <button
            onClick={onOpenAdmin}
            className="flex items-center gap-1.5 hover:text-emerald-600 transition-colors cursor-pointer py-1 font-medium text-slate-800"
          >
            <Shield className="w-4 h-4 text-emerald-600" />
            <span>Admin</span>
          </button>
        </nav>

        {/* Right Action Button (Login / User Account) */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-lg border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all duration-200 cursor-pointer shadow-xs active:scale-95"
          >
            <User className="w-4 h-4" />
            <span>{currentUser.name ? currentUser.name.split(' ')[0] : 'Login'}</span>
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={onOpenAuth}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-emerald-600 text-emerald-600 hover:bg-emerald-50"
          >
            {currentUser.name ? currentUser.name.split(' ')[0] : 'Login'}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-700 hover:text-emerald-600 focus:outline-hidden"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <button
            onClick={() => handleNavClick('home')}
            className="block w-full text-left py-2 text-base font-semibold text-slate-800 hover:text-emerald-600"
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick('rentals')}
            className="block w-full text-left py-2 text-base font-semibold text-slate-800 hover:text-emerald-600"
          >
            bikes
          </button>
          <button
            onClick={() => handleNavClick('how-it-works')}
            className="block w-full text-left py-2 text-base font-semibold text-slate-800 hover:text-emerald-600"
          >
            How It Works
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenAdmin();
            }}
            className="flex items-center gap-2 w-full text-left py-2 text-base font-semibold text-slate-800 hover:text-emerald-600"
          >
            <Shield className="w-4 h-4 text-emerald-600" />
            <span>Admin Dashboard</span>
          </button>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isRealtimeConnected ? 'Backend Database Connected' : 'Connecting to DB...'}</span>
            </span>
          </div>
        </div>
      )}
    </header>
  );
};
