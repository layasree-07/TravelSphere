import React from 'react';
import { Destination } from '../types/travel';
import { VisitedPlaceRecord } from '../types/user';
import { 
  MapPin, 
  Star, 
  Calendar, 
  ArrowUpRight, 
  ExternalLink, 
  Sparkles, 
  Navigation,
  CheckCircle2,
  Check
} from 'lucide-react';

interface DestinationCardProps {
  destination: Destination;
  onSelect: (destination: Destination) => void;
  isVisited?: boolean;
  visitedRecord?: VisitedPlaceRecord | null;
  onToggleVisited?: (destination: Destination) => void;
}

export const DestinationCard: React.FC<DestinationCardProps> = ({
  destination,
  onSelect,
  isVisited = false,
  visitedRecord,
  onToggleVisited,
}) => {
  const [showFullSignificance, setShowFullSignificance] = React.useState(false);

  const isWikiImage =
    destination.imageUrl?.includes('wikimedia.org') ||
    destination.imageUrl?.includes('wikipedia.org');

  const gMapsUrl =
    destination.googleMapsUrl ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${destination.name}${destination.state ? ', ' + destination.state : ''}, ${destination.country}`
    )}`;

  return (
    <div
      id={`destination-card-${destination.id}`}
      onClick={() => onSelect(destination)}
      className={`group bg-white rounded-2xl border overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col relative ${
        isVisited ? 'border-emerald-200 ring-1 ring-emerald-400/30' : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      {/* Image container */}
      <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-slate-100">
        <img
          src={destination.imageUrl}
          alt={destination.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/20 to-transparent"></div>

        {/* Top Left Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 max-w-[70%]">
          {isVisited && (
            <span className="bg-emerald-600/95 backdrop-blur text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1 border border-emerald-400/50">
              <CheckCircle2 className="w-3 h-3 text-white" />
              <span>Visited</span>
            </span>
          )}
          {destination.state ? (
            <span className="bg-teal-950/90 border border-teal-700/60 backdrop-blur text-teal-200 text-[11px] font-semibold px-2.5 py-0.5 rounded-full shadow-sm">
              {destination.state}
            </span>
          ) : (
            <span className="bg-white/90 backdrop-blur text-slate-800 text-[11px] font-semibold px-2 py-0.5 rounded-full shadow-sm">
              {destination.continent}
            </span>
          )}
          {destination.verifiedByAi && (
            <span className="bg-emerald-600/90 backdrop-blur text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" />
              AI Verified
            </span>
          )}
          {destination.featured && (
            <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              Featured
            </span>
          )}
          {isWikiImage && (
            <span className="bg-slate-900/85 backdrop-blur text-white text-[10px] font-medium px-2 py-0.5 rounded-full shadow-sm border border-slate-700/70">
              Wikipedia
            </span>
          )}
        </div>

        {/* Rating Badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-slate-900/85 backdrop-blur text-white text-xs font-medium px-2 py-1 rounded-lg border border-slate-800">
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span>{destination.rating}</span>
          <span className="text-slate-400 text-[10px]">({destination.reviewCount})</span>
        </div>

        {/* Bottom Title over image */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <p className="text-[11px] font-medium text-teal-300 flex items-center gap-1 mb-0.5">
            <MapPin className="w-3 h-3 text-teal-400 shrink-0" />
            <span>
              {destination.state ? `${destination.state}, ` : ''}{destination.country}
            </span>
          </p>
          <h3 className="text-base sm:text-lg font-serif font-bold tracking-tight text-white leading-snug drop-shadow-sm">
            {destination.name}
          </h3>
        </div>
      </div>

      {/* Body content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {destination.significance ? (
            <div className="mb-2.5 p-2.5 rounded-xl bg-teal-50/70 border border-teal-100 text-[11px] text-teal-950 leading-relaxed font-medium">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-teal-900 flex items-center gap-1">
                  <span>Significance</span>
                  <span className="text-[10px] text-teal-600 font-normal">(Up to 5 sentences)</span>
                </span>
                {destination.significance.length > 120 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowFullSignificance(!showFullSignificance);
                    }}
                    className="text-[10px] font-bold text-teal-700 hover:text-teal-900 underline underline-offset-2 ml-2 transition-colors cursor-pointer"
                  >
                    {showFullSignificance ? 'Show less' : 'Read full'}
                  </button>
                )}
              </div>
              <p className={showFullSignificance ? 'text-slate-800' : 'line-clamp-2 text-slate-700'}>
                {destination.significance}
              </p>
            </div>
          ) : (
            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
              {destination.description}
            </p>
          )}

          {/* Visited Log Highlight (if user visited) */}
          {isVisited && visitedRecord && (
            <div className="mb-2.5 p-2 bg-emerald-50/80 border border-emerald-100 rounded-lg text-[11px] text-emerald-900 flex items-center justify-between">
              <span className="flex items-center gap-1 font-semibold">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                Visited {new Date(visitedRecord.visitedDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </span>
              {visitedRecord.rating && (
                <span className="flex items-center gap-0.5 font-bold text-amber-600">
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                  {visitedRecord.rating}/5
                </span>
              )}
            </div>
          )}

          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-[11px]">Season:</span>
            <span className="font-medium text-slate-700 text-[11px]">{destination.bestTimeToVisit}</span>
          </div>

          <div className="flex flex-wrap gap-1 mb-3">
            {destination.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-1.5">
          {/* Mark Visited Toggle Button */}
          {onToggleVisited && (
            <button
              id={`btn-toggle-visited-${destination.id}`}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleVisited(destination);
              }}
              className={`text-[11px] font-bold px-2.5 py-1.5 rounded-lg border flex items-center gap-1 transition-all ${
                isVisited
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100 shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-teal-50 hover:text-teal-800 hover:border-teal-200'
              }`}
              title={isVisited ? 'You have visited this place (Click to edit log)' : 'Mark this place as visited'}
            >
              <CheckCircle2 className={`w-3.5 h-3.5 ${isVisited ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span>{isVisited ? 'Visited' : 'Mark Visited'}</span>
            </button>
          )}

          {/* Direct Google Maps Link */}
          <a
            id={`gmaps-link-${destination.id}`}
            href={gMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-teal-700 bg-slate-100 hover:bg-teal-50 px-2 py-1.5 rounded-lg border border-slate-200 hover:border-teal-200 transition-colors"
            title={`Open ${destination.name} on Google Maps`}
          >
            <Navigation className="w-3 h-3 text-teal-600" />
            <span className="hidden sm:inline">Maps</span>
            <ExternalLink className="w-2.5 h-2.5 opacity-60" />
          </a>

          <button
            id={`btn-view-tours-${destination.id}`}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(destination);
            }}
            className="text-xs font-semibold text-teal-700 hover:text-white bg-teal-50 hover:bg-teal-700 px-3 py-1.5 rounded-lg border border-teal-200 hover:border-teal-700 flex items-center gap-1 shrink-0 transition-colors shadow-xs"
          >
            <span>Tours</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

