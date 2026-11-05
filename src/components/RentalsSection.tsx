import React from 'react';
import { Bike, SearchFilter } from '../types';
import { BikeCard } from './BikeCard';
import { Search, SlidersHorizontal, Plus, RefreshCw } from 'lucide-react';

interface RentalsSectionProps {
  bikes: Bike[];
  filter: SearchFilter;
  onFilterChange: (newFilter: Partial<SearchFilter>) => void;
  onBookBike: (bike: Bike) => void;
  isAdmin: boolean;
  onOpenAddBike: () => void;
  onToggleStatus: (bikeId: string, currentStatus: boolean) => void;
  isLoading: boolean;
}

export const RentalsSection: React.FC<RentalsSectionProps> = ({
  bikes,
  filter,
  onFilterChange,
  onBookBike,
  isAdmin,
  onOpenAddBike,
  onToggleStatus,
  isLoading,
}) => {
  const categories = [
    { id: 'all', label: 'All Fleet' },
    { id: 'scooter', label: 'Scooter' },
    { id: 'cruiser', label: 'Cruiser' },
    { id: 'sports', label: 'Sports' },
    { id: 'electric', label: 'Electric' },
  ];

  return (
    <section id="rentals" className="py-20 bg-slate-50/60 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Green Accent */}
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Our Top Rentals
          </h2>
          <div className="w-16 h-1 bg-emerald-500 rounded-full mx-auto mt-3"></div>
          <p className="mt-3 text-sm text-slate-600 max-w-xl mx-auto">
            Choose from well-maintained, fuel-efficient scooters to iconic touring cruisers and sports bikes.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          {/* Category Tabs (Segmented Buttons) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => {
              const active = filter.type === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => onFilterChange({ type: cat.id })}
                  className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-200 whitespace-nowrap cursor-pointer ${
                    active
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Search & Sort Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Live Search Input */}
            <div className="relative flex-1 sm:w-60">
              <input
                type="text"
                placeholder="Search bike name or engine..."
                value={filter.searchQuery}
                onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            {/* Sort Dropdown */}
            <select
              value={filter.sortBy}
              onChange={(e) => onFilterChange({ sortBy: e.target.value as any })}
              aria-label="Sort bikes"
              className="px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="featured">Featured First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>

            {/* Admin Add Bike Shortcut */}
            {isAdmin && (
              <button
                onClick={onOpenAddBike}
                className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-xs sm:text-sm rounded-xl border border-emerald-200 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Bike</span>
              </button>
            )}
          </div>
        </div>

        {/* Fleet Grid */}
        {isLoading ? (
          <div className="py-24 text-center">
            <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-3" />
            <p className="text-sm font-medium text-slate-600">Loading live fleet from database...</p>
          </div>
        ) : bikes.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-slate-300 p-8">
            <p className="text-lg font-bold text-slate-800">No bikes match your criteria</p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Try switching categories or clearing search filters to explore all available rides.
            </p>
            <button
              onClick={() => onFilterChange({ type: 'all', location: 'all', searchQuery: '' })}
              className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {bikes.map((bike) => (
              <BikeCard
                key={bike.id}
                bike={bike}
                onBook={onBookBike}
                isAdmin={isAdmin}
                onToggleStatus={onToggleStatus}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
