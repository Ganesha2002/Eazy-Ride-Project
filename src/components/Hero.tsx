import React from 'react';
import { Calendar, ChevronDown, MapPin, Search, Sparkles } from 'lucide-react';
import { SearchFilter } from '../types';

interface HeroProps {
  locations: string[];
  filter: SearchFilter;
  onFilterChange: (newFilter: Partial<SearchFilter>) => void;
  onSearchSubmit: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  locations,
  filter,
  onFilterChange,
  onSearchSubmit,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit();
  };

  return (
    <section id="home" className="relative min-h-[580px] lg:min-h-[660px] flex items-center justify-center overflow-hidden bg-slate-950">
      {/* Background Motorcycle Image with Dark Cinematic Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=2000&q=85"
          alt="Eazy Ride high performance motorcycle"
          className="w-full h-full object-cover object-center opacity-45 transform scale-105 transition-transform duration-1000 ease-out"
          referrerPolicy="no-referrer"
        />
        {/* Subtle radial and gradient contrast scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/65 to-slate-950/40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(2,6,23,0.8)_90%)]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center flex flex-col items-center">
        {/* Hero Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight text-balance leading-tight max-w-4xl drop-shadow-md">
          Explore the City with Eazy Ride
        </h1>

        {/* Hero Subtitle */}
        <p className="mt-4 text-base sm:text-lg lg:text-xl text-slate-200/90 font-normal max-w-2xl text-balance">
          Rent top-quality bikes and scooters at affordable rates.
        </p>

        {/* Floating Search & Booking Widget */}
        <div className="mt-10 w-full max-w-4xl">
          <form
            onSubmit={handleSubmit}
            className="bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 md:p-6 shadow-2xl border border-white/20 text-left transition-all hover:shadow-emerald-500/10"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              {/* Field 1: Location */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Location
                </label>
                <div className="relative">
                  <select
                    value={filter.location}
                    onChange={(e) => onFilterChange({ location: e.target.value })}
                    className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-hidden transition-all pr-8 cursor-pointer"
                  >
                    <option value="all">Select Location</option>
                    {locations.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Field 2: Date */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={filter.date}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => onFilterChange({ date: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-hidden transition-all cursor-pointer"
                  />
                  {!filter.date && (
                    <Calendar className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none hidden sm:block" />
                  )}
                </div>
              </div>

              {/* Field 3: Type */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Type
                </label>
                <div className="relative">
                  <select
                    value={filter.type}
                    onChange={(e) => onFilterChange({ type: e.target.value })}
                    className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-hidden transition-all pr-8 cursor-pointer"
                  >
                    <option value="all">Select Type</option>
                    <option value="scooter">Scooter (110cc - 125cc)</option>
                    <option value="cruiser">Cruiser (350cc - 750cc)</option>
                    <option value="sports">Sports (250cc - 650cc)</option>
                    <option value="electric">Electric (Smart EV)</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Action Button: Find Bike */}
              <div>
                <button
                  type="submit"
                  className="w-full h-[42px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:shadow-emerald-600/25 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <Search className="w-4 h-4 stroke-[2.5]" />
                  <span>Find Bike</span>
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Quick Highlights beneath widget */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-300 font-medium">
          <span className="flex items-center gap-1.5">
            <span className="text-emerald-400">✓</span> Instant Zero-Paperwork KYC
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-emerald-400">✓</span> Complimentary ISI Helmet
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-emerald-400">✓</span> Fully Sanitized & Serviced
          </span>
        </div>
      </div>
    </section>
  );
};
