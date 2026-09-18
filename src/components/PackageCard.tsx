import React from 'react';
import { TourPackage } from '../types/travel';
import { Clock, MapPin, Star, Users, Check, ArrowRight } from 'lucide-react';

interface PackageCardProps {
  tourPackage: TourPackage;
  onViewDetails: (pkg: TourPackage) => void;
  onBookNow: (pkg: TourPackage) => void;
}

export const PackageCard: React.FC<PackageCardProps> = ({
  tourPackage,
  onViewDetails,
  onBookNow,
}) => {
  return (
    <div
      id={`package-card-${tourPackage.id}`}
      className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
    >
      <div>
        {/* Card Header Media */}
        <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100">
          <img
            src={tourPackage.image}
            alt={tourPackage.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>

          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span className="bg-slate-900/85 backdrop-blur text-teal-300 text-xs font-semibold px-2.5 py-1 rounded-full border border-slate-700">
              {tourPackage.category}
            </span>
          </div>

          {/* Rating */}
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur text-slate-800 text-xs font-bold px-2 py-0.5 rounded-lg shadow-sm">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>{tourPackage.rating}</span>
            <span className="text-[10px] text-slate-500 font-normal">({tourPackage.reviewsCount})</span>
          </div>

          {/* Destination location overlay */}
          <div className="absolute bottom-3 left-3 text-white">
            <p className="text-xs font-medium text-teal-300 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {tourPackage.destinationName}, {tourPackage.country}
            </p>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 sm:p-5">
          <div className="flex items-center gap-3 text-xs text-slate-500 mb-2">
            <span className="flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {tourPackage.durationDays} Days / {tourPackage.durationNights} Nights
            </span>
            <span className="flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              Max {tourPackage.maxGuests} guests
            </span>
          </div>

          <h3 className="font-serif text-lg font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-teal-800 transition-colors mb-3">
            {tourPackage.title}
          </h3>

          {/* Highlights checklist */}
          <div className="space-y-1.5 mb-4">
            {tourPackage.highlights.slice(0, 2).map((hl, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                <Check className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                <span className="line-clamp-1">{hl}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="p-4 sm:p-5 pt-0">
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-slate-900 font-serif">
                ${tourPackage.price.toLocaleString()}
              </span>
              {tourPackage.originalPrice && (
                <span className="text-xs text-slate-400 line-through">
                  ${tourPackage.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            <span className="text-[11px] text-slate-500 block">per person &middot; all inclusive</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              id={`view-itinerary-${tourPackage.id}`}
              onClick={() => onViewDetails(tourPackage)}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Itinerary
            </button>
            <button
              id={`book-now-${tourPackage.id}`}
              onClick={() => onBookNow(tourPackage)}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-teal-800 transition-colors shadow-sm flex items-center gap-1"
            >
              Book
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
