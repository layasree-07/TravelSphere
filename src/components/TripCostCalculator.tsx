import React, { useState } from 'react';
import { Destination, TourPackage } from '../types/travel';
import { Calculator, Users, Calendar, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

interface TripCostCalculatorProps {
  destinations: Destination[];
  packages: TourPackage[];
  onSelectPackage: (pkg: TourPackage) => void;
}

export const TripCostCalculator: React.FC<TripCostCalculatorProps> = ({
  destinations,
  packages,
  onSelectPackage,
}) => {
  const [selectedDestId, setSelectedDestId] = useState<string>(destinations[0]?.id || 'dest-bali');
  const [durationDays, setDurationDays] = useState<number>(6);
  const [travelerCount, setTravelerCount] = useState<number>(2);
  const [hotelTier, setHotelTier] = useState<'Standard' | 'Boutique' | 'Luxury'>('Boutique');
  const [includeFlights, setIncludeFlights] = useState<boolean>(true);

  const currentDest = destinations.find((d) => d.id === selectedDestId) || destinations[0];
  const matchingPackage = packages.find((p) => p.destinationId === selectedDestId) || packages[0];

  // Price modeling
  const baseDailyRate = currentDest ? currentDest.startingPrice / 5 : 180;
  const tierMultiplier = hotelTier === 'Standard' ? 0.85 : hotelTier === 'Boutique' ? 1.0 : 1.45;
  const flightEstimatePerPerson = includeFlights ? 450 : 0;
  
  const estimatedStayAndTour = Math.round(baseDailyRate * durationDays * tierMultiplier * travelerCount);
  const estimatedFlights = flightEstimatePerPerson * travelerCount;
  const estimatedTotal = estimatedStayAndTour + estimatedFlights;

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl my-10">
      <div className="max-w-3xl mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-950/80 border border-teal-800 text-xs font-medium text-teal-300 mb-3">
          <Calculator className="w-3.5 h-3.5 text-teal-400" />
          <span>Interactive Cost Estimator</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
          Plan &amp; Estimate Your Custom Journey
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Adjust parameters to get an instant cost projection before matching with curated packages.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Destination
              </label>
              <select
                id="calc-dest-select"
                value={selectedDestId}
                onChange={(e) => setSelectedDestId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {destinations.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}, {d.country}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Trip Duration: {durationDays} Days
              </label>
              <input
                id="calc-duration-slider"
                type="range"
                min="3"
                max="14"
                value={durationDays}
                onChange={(e) => setDurationDays(Number(e.target.value))}
                className="w-full accent-teal-400 h-2 bg-slate-700 rounded-lg cursor-pointer mt-3"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Number of Travelers
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setTravelerCount(Math.max(1, travelerCount - 1))}
                  className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700"
                >
                  -
                </button>
                <span className="w-12 text-center font-bold text-sm">{travelerCount} Person(s)</span>
                <button
                  type="button"
                  onClick={() => setTravelerCount(Math.min(10, travelerCount + 1))}
                  className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700"
                >
                  +
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Accommodation Tier
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['Standard', 'Boutique', 'Luxury'] as const).map((tier) => (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => setHotelTier(tier)}
                    className={`py-2 px-2 text-xs font-medium rounded-lg transition-all ${
                      hotelTier === tier
                        ? 'bg-teal-600 text-slate-950 font-bold shadow-sm'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={includeFlights}
                onChange={(e) => setIncludeFlights(e.target.checked)}
                className="w-4 h-4 accent-teal-500 rounded cursor-pointer"
              />
              <span>Include estimated round-trip international flight allowance (~$450/person)</span>
            </label>
          </div>
        </div>

        {/* Output Estimation Card */}
        <div className="bg-slate-800/90 rounded-2xl p-5 border border-slate-700 flex flex-col justify-between">
          <div>
            <span className="text-xs text-slate-400 block mb-1 font-mono">Estimated Trip Budget</span>
            <div className="text-3xl font-serif font-bold text-teal-300">
              ${estimatedTotal.toLocaleString()}
            </div>
            <span className="text-xs text-slate-400 block mt-0.5">
              ~${Math.round(estimatedTotal / travelerCount).toLocaleString()} per traveler
            </span>

            <div className="mt-4 pt-4 border-t border-slate-700 space-y-1.5 text-xs text-slate-300">
              <div className="flex justify-between">
                <span>Resorts &amp; Guided Tours:</span>
                <span className="font-semibold text-white">${estimatedStayAndTour.toLocaleString()}</span>
              </div>
              {includeFlights && (
                <div className="flex justify-between">
                  <span>Flight Estimates:</span>
                  <span className="font-semibold text-white">${estimatedFlights.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-teal-400 pt-1">
                <span>Selected Destination:</span>
                <span className="font-semibold">{currentDest.name}</span>
              </div>
            </div>
          </div>

          <div className="pt-5 border-t border-slate-700 mt-4">
            {matchingPackage && (
              <button
                id="calc-match-package-btn"
                onClick={() => onSelectPackage(matchingPackage)}
                className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <span>View Curated {matchingPackage.durationDays}D Tour</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
