import React from 'react';
import { FleetStats } from '../types';
import { ShieldCheck, Headphones, Zap } from 'lucide-react';

interface StatsBarProps {
  stats: FleetStats | null;
  isRealtimeConnected: boolean;
}

export const StatsBar: React.FC<StatsBarProps> = ({ stats, isRealtimeConnected }) => {
  return (
    <section className="bg-[#243548] text-white py-14 border-t border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-700/60">
          {/* Stat 1: Bike Models */}
          <div className="pt-4 md:pt-0">
            <div className="text-4xl sm:text-5xl font-black text-emerald-400 tracking-tight tabular-nums">
              {stats ? `${stats.totalBikes}+` : '50+'}
            </div>
            <div className="mt-2 text-xs sm:text-sm font-bold tracking-widest uppercase text-slate-300">
              BIKE MODELS
            </div>
            <p className="mt-1 text-xs text-slate-400">
              {stats ? `${stats.availableBikes} ready for immediate ride` : 'Premium cruisers & commuters'}
            </p>
          </div>

          {/* Stat 2: Happy Customers */}
          <div className="pt-6 md:pt-0">
            <div className="text-4xl sm:text-5xl font-black text-emerald-400 tracking-tight tabular-nums">
              10k+
            </div>
            <div className="mt-2 text-xs sm:text-sm font-bold tracking-widest uppercase text-slate-300">
              HAPPY CUSTOMERS
            </div>
            <p className="mt-1 text-xs text-slate-400">
              {stats ? `${stats.activeBookings} active trips right now` : 'Verified 5-star trip reviews'}
            </p>
          </div>

          {/* Stat 3: 24/7 Roadside Support */}
          <div className="pt-6 md:pt-0">
            <div className="text-4xl sm:text-5xl font-black text-emerald-400 tracking-tight">
              24/7
            </div>
            <div className="mt-2 text-xs sm:text-sm font-bold tracking-widest uppercase text-slate-300">
              ROADSIDE SUPPORT
            </div>
            <p className="mt-1 text-xs text-slate-400 flex items-center justify-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isRealtimeConnected ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              <span>{isRealtimeConnected ? 'Instant Assistance & Fleet GPS' : 'Support Dispatch Standby'}</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
