import React, { useState } from 'react';
import { TourPackage } from '../types/travel';
import { X, Calendar, Clock, Users, Check, AlertCircle, MapPin, Star, ShieldCheck, ArrowRight, ExternalLink, Navigation } from 'lucide-react';

interface PackageDetailModalProps {
  tourPackage: TourPackage;
  onClose: () => void;
  onBook: (tourPackage: TourPackage, guestCount: number, selectedDate: string) => void;
}

export const PackageDetailModal: React.FC<PackageDetailModalProps> = ({
  tourPackage,
  onClose,
  onBook,
}) => {
  const [guests, setGuests] = useState<number>(2);
  const [selectedDate, setSelectedDate] = useState<string>(tourPackage.availableDates[0] || '2026-11-15');
  const [activeTab, setActiveTab] = useState<'itinerary' | 'inclusions'>('itinerary');

  const totalPrice = tourPackage.price * guests;
  const gMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${tourPackage.destinationName}, ${tourPackage.country}`
  )}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div 
        id="package-detail-modal"
        className="relative bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[90vh] flex flex-col"
      >
        {/* Header with image banner */}
        <div className="relative h-60 sm:h-72 w-full shrink-0 overflow-hidden bg-slate-900">
          <img
            src={tourPackage.image}
            alt={tourPackage.title}
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent"></div>

          {/* Close button */}
          <button
            id="close-package-detail-modal"
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white flex items-center justify-center transition-colors shadow-md border border-slate-700"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Badge & Title */}
          <div className="absolute bottom-5 left-5 right-5 text-white">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="bg-teal-500 text-slate-950 text-xs font-bold px-2.5 py-0.5 rounded-full">
                {tourPackage.category} Tour
              </span>
              <span className="bg-white/20 backdrop-blur text-white text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <MapPin className="w-3 h-3 text-teal-300" />
                {tourPackage.destinationName}, {tourPackage.country}
              </span>
              <a
                id="modal-gmaps-link"
                href={gMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-teal-950/80 hover:bg-teal-900 backdrop-blur text-teal-200 border border-teal-500/40 text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1 transition-colors font-medium shadow-xs"
                title="View location on Google Maps"
              >
                <Navigation className="w-3 h-3 text-teal-400" />
                <span>Google Maps</span>
                <ExternalLink className="w-2.5 h-2.5 opacity-70" />
              </a>
              <span className="bg-white/20 backdrop-blur text-white text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                {tourPackage.rating} ({tourPackage.reviewsCount} reviews)
              </span>
            </div>

            <h2 className="text-xl sm:text-3xl font-serif font-bold tracking-tight text-white leading-tight">
              {tourPackage.title}
            </h2>
          </div>
        </div>

        {/* Modal content body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
          {/* Quick info row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 block">Duration</span>
              <span className="font-semibold text-slate-900 text-sm flex items-center gap-1 mt-0.5">
                <Clock className="w-4 h-4 text-teal-600" />
                {tourPackage.durationDays} Days / {tourPackage.durationNights} Nights
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Group Capacity</span>
              <span className="font-semibold text-slate-900 text-sm flex items-center gap-1 mt-0.5">
                <Users className="w-4 h-4 text-teal-600" />
                Max {tourPackage.maxGuests} Travelers
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Pace / Difficulty</span>
              <span className="font-semibold text-slate-900 text-sm flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                {tourPackage.difficulty || 'Easy & Leisure'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Pricing Tier</span>
              <span className="font-semibold text-teal-700 text-sm flex items-center gap-1 mt-0.5">
                ${tourPackage.price} / guest
              </span>
            </div>
          </div>

          {/* Tab buttons */}
          <div className="flex border-b border-slate-200 gap-6">
            <button
              id="tab-itinerary-btn"
              onClick={() => setActiveTab('itinerary')}
              className={`pb-3 text-sm font-semibold transition-colors relative ${
                activeTab === 'itinerary'
                  ? 'text-teal-700 border-b-2 border-teal-700'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Day-by-Day Itinerary ({tourPackage.itinerary.length} Days)
            </button>
            <button
              id="tab-inclusions-btn"
              onClick={() => setActiveTab('inclusions')}
              className={`pb-3 text-sm font-semibold transition-colors relative ${
                activeTab === 'inclusions'
                  ? 'text-teal-700 border-b-2 border-teal-700'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Inclusions &amp; Exclusions
            </button>
          </div>

          {/* Tab 1: Itinerary */}
          {activeTab === 'itinerary' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                Detailed Expedition Schedule
              </h4>
              <div className="space-y-4 border-l-2 border-teal-200 pl-4 ml-2">
                {tourPackage.itinerary.map((day) => (
                  <div key={day.day} className="relative group">
                    {/* Timeline bullet dot */}
                    <div className="absolute -left-[25px] top-1 w-4 h-4 rounded-full bg-teal-600 border-2 border-white shadow-sm"></div>

                    <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                        <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                          Day {day.day}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">{day.meals}</span>
                      </div>
                      <h5 className="font-semibold text-slate-900 text-sm mb-1.5">{day.title}</h5>
                      <p className="text-xs text-slate-600 leading-relaxed mb-2">{day.activities}</p>
                      <div className="text-[11px] text-slate-500 bg-white p-2 rounded-lg border border-slate-100 flex items-center gap-1.5">
                        <span className="font-semibold text-slate-700">Stay:</span>
                        <span>{day.stay}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 2: Inclusions / Exclusions */}
          {activeTab === 'inclusions' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5 mb-3">
                  <Check className="w-4 h-4 text-emerald-600" />
                  What is Included
                </h4>
                <ul className="space-y-2 text-xs text-slate-700">
                  {tourPackage.inclusions.map((inc, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5 mb-3">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  What is Not Included
                </h4>
                <ul className="space-y-2 text-xs text-slate-700">
                  {tourPackage.exclusions.map((exc, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <X className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span>{exc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Booking Configurator Bar */}
          <div className="bg-slate-900 text-white rounded-xl p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Select Departure Date
                  </label>
                  <select
                    id="detail-date-select"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-teal-400"
                  >
                    {tourPackage.availableDates.map((date) => (
                      <option key={date} value={date}>
                        {date} (Guaranteed Departure)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Guests / Travelers
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      id="decrement-guest-btn"
                      onClick={() => setGuests(Math.max(1, guests - 1))}
                      className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-bold text-sm"
                    >
                      -
                    </button>
                    <span className="w-10 text-center font-bold text-sm">{guests}</span>
                    <button
                      id="increment-guest-btn"
                      onClick={() => setGuests(Math.min(tourPackage.maxGuests, guests + 1))}
                      className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-bold text-sm"
                    >
                      +
                    </button>
                    <span className="text-xs text-slate-400 ml-1">
                      (${tourPackage.price} &times; {guests})
                    </span>
                  </div>
                </div>
              </div>

              <div className="sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-800 flex items-center sm:block justify-between">
                <div>
                  <span className="text-xs text-slate-400 block">Total Package Cost</span>
                  <span className="text-2xl font-bold font-serif text-teal-300">
                    ${totalPrice.toLocaleString()}
                  </span>
                </div>
                <button
                  id="modal-proceed-to-book-btn"
                  onClick={() => onBook(tourPackage, guests, selectedDate)}
                  className="mt-2 sm:mt-1 bg-teal-600 hover:bg-teal-500 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl transition-colors shadow-md flex items-center gap-1.5"
                >
                  Reserve Now
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
