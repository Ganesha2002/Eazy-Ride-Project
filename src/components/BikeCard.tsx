import React, { useState } from 'react';
import { Gauge, Fuel, Cog, Star, MapPin, CheckCircle2, Clock } from 'lucide-react';
import { Bike } from '../types';

interface BikeCardProps {
  bike: Bike;
  onBook: (bike: Bike) => void;
  isAdmin?: boolean;
  onToggleStatus?: (bikeId: string, currentStatus: boolean) => void;
}

export const BikeCard: React.FC<BikeCardProps> = ({
  bike,
  onBook,
  isAdmin = false,
  onToggleStatus,
}) => {
  const [imageError, setImageError] = useState(false);

  // Fallback image urls based on category
  const categoryFallbacks: Record<string, string> = {
    scooter: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80',
    cruiser: 'https://images.unsplash.com/photo-1558981285-6f0c94958bb6?auto=format&fit=crop&w=800&q=80',
    sports: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80',
    electric: 'https://images.unsplash.com/photo-1558980394-4c7c9299fe96?auto=format&fit=crop&w=800&q=80',
  };

  const imageSrc = !imageError && bike.imageUrl ? bike.imageUrl : (categoryFallbacks[bike.category] || categoryFallbacks.scooter);

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group">
      {/* Card Header & Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={imageSrc}
          alt={bike.name}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          referrerPolicy="no-referrer"
        />

        {/* Live Availability Tag */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md shadow-xs bg-white/90">
          <span
            className={`w-2 h-2 rounded-full ${
              bike.available ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
            }`}
          />
          <span className={bike.available ? 'text-emerald-700' : 'text-amber-800'}>
            {bike.available ? 'Available' : 'Booked'}
          </span>
        </div>

        {/* Location chip */}
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-900/75 text-white backdrop-blur-md">
          <MapPin className="w-3 h-3 text-emerald-400" />
          <span className="truncate max-w-[120px]">{bike.location.split(' ')[0]}</span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title & Price Header */}
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
              {bike.name}
            </h3>
            <span className="text-lg font-extrabold text-emerald-600 whitespace-nowrap tabular-nums">
              ₹{bike.pricePerDay}
              <span className="text-xs font-medium text-emerald-700">/day</span>
            </span>
          </div>

          {/* Description */}
          <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
            {bike.description}
          </p>

          {/* Specifications Row */}
          <div className="pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-xs font-medium text-slate-600 mb-5">
            <div className="flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{bike.engineCc}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Fuel className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{bike.fuelType}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Cog className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{bike.transmission}</span>
            </div>
          </div>
        </div>

        {/* Action Button & Admin Controls */}
        <div className="space-y-2">
          {bike.available ? (
            <button
              onClick={() => onBook(bike)}
              className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-sm rounded-xl transition-colors duration-200 cursor-pointer shadow-xs active:scale-98 flex items-center justify-center gap-2"
            >
              Book Now
            </button>
          ) : (
            <button
              onClick={() => onBook(bike)}
              className="w-full py-2.5 px-4 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 font-semibold text-sm rounded-xl transition-colors duration-200 cursor-pointer flex items-center justify-center gap-2"
            >
              <Clock className="w-4 h-4 text-amber-600" />
              Currently Reserved (Details)
            </button>
          )}

          {isAdmin && onToggleStatus && (
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Admin quick-toggle:</span>
              <button
                type="button"
                onClick={() => onToggleStatus(bike.id, bike.available)}
                className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                  bike.available
                    ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                    : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                }`}
              >
                Set {bike.available ? 'Booked' : 'Available'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
