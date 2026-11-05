import React from 'react';
import { MapPin, Bike, KeyRound, Sparkles } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: '1. Choose Location',
      description: 'Select your pick-up point and dates.',
      icon: MapPin,
    },
    {
      number: '2. Select Bike',
      description: 'Browse our wide range of bikes.',
      icon: Bike,
    },
    {
      number: '3. Enjoy the Ride',
      description: 'Pay securely and zoom away!',
      icon: KeyRound,
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Section Heading with Green Underline */}
        <div className="inline-block mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How It Works
          </h2>
          <div className="w-16 h-1 bg-emerald-500 rounded-full mx-auto mt-3"></div>
        </div>

        {/* 3 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-14 max-w-5xl mx-auto">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="group flex flex-col items-center p-6 rounded-2xl bg-white hover:bg-slate-50/70 border border-transparent hover:border-slate-100 transition-all duration-300"
              >
                {/* Green Circular Icon Container */}
                <div className="w-18 h-18 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 shadow-xs">
                  <Icon className="w-8 h-8 stroke-[2.2]" />
                </div>

                {/* Step Title */}
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {step.number}
                </h3>

                {/* Step Description */}
                <p className="text-sm text-slate-600 font-normal leading-relaxed max-w-xs">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
