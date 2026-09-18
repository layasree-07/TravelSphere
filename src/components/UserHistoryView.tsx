import React, { useState } from 'react';
import { Destination } from '../types/travel';
import { UserProfile, VisitedPlaceRecord } from '../types/user';
import { 
  MapPin, 
  Calendar, 
  Star, 
  Sparkles, 
  Compass, 
  Award, 
  Plus, 
  Search, 
  Trash2, 
  ExternalLink, 
  Navigation, 
  ArrowRight,
  Edit3,
  CheckCircle2,
  TrendingUp,
  Globe2,
  Flag
} from 'lucide-react';

interface UserHistoryViewProps {
  currentUser: UserProfile | null;
  visitedPlaces: VisitedPlaceRecord[];
  destinations: Destination[];
  onOpenLogin: () => void;
  onEditVisit: (destination: Destination, record: VisitedPlaceRecord) => void;
  onDeleteVisit: (recordId: string) => void;
  onLogNewPlace: () => void;
  onExploreUnvisited: () => void;
  onSelectDestination: (dest: Destination) => void;
}

export const UserHistoryView: React.FC<UserHistoryViewProps> = ({
  currentUser,
  visitedPlaces,
  destinations,
  onOpenLogin,
  onEditVisit,
  onDeleteVisit,
  onLogNewPlace,
  onExploreUnvisited,
  onSelectDestination,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStateFilter, setSelectedStateFilter] = useState('All');

  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mx-auto mb-4 border border-teal-200">
          <Compass className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-slate-900 mb-2">
          Track Your Travel History &amp; Visited Places
        </h2>
        <p className="text-sm text-slate-600 max-w-md mx-auto mb-6">
          Sign in to your TravelSphere account to log places you&apos;ve visited, record personal travel memories, and filter searches to see places you haven&apos;t explored yet!
        </p>
        <button
          onClick={onOpenLogin}
          className="px-6 py-3 bg-slate-900 hover:bg-teal-800 text-white rounded-xl font-bold text-xs shadow-md transition-colors inline-flex items-center gap-2 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-teal-300" />
          <span>Sign In / Select Demo Traveler</span>
        </button>
      </div>
    );
  }

  // Filter records belonging to current user
  const userRecords = visitedPlaces.filter(
    (r) => r.userId === currentUser.id || r.userEmail.toLowerCase() === currentUser.email.toLowerCase()
  );

  // Derive unique states and stats
  const uniqueStates = Array.from(new Set(userRecords.map((r) => r.state).filter(Boolean))) as string[];
  const uniqueCountries = Array.from(new Set(userRecords.map((r) => r.country).filter(Boolean)));
  const totalIndianStates = 28;
  const statesProgressPercent = Math.min(100, Math.round((uniqueStates.length / totalIndianStates) * 100));

  // Average Rating
  const validRatings = userRecords.map((r) => r.rating || 5);
  const avgRating = validRatings.length > 0 
    ? (validRatings.reduce((a, b) => a + b, 0) / validRatings.length).toFixed(1)
    : '5.0';

  // Filter by search & state
  const filteredRecords = userRecords.filter((r) => {
    const q = searchTerm.toLowerCase().trim();
    const matchesSearch = !q ||
      r.destinationName.toLowerCase().includes(q) ||
      (r.state && r.state.toLowerCase().includes(q)) ||
      r.country.toLowerCase().includes(q) ||
      (r.notes && r.notes.toLowerCase().includes(q));

    const matchesState = selectedStateFilter === 'All' || r.state === selectedStateFilter;
    return matchesSearch && matchesState;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Passport Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-700/50 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <img
              src={currentUser.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser.email}`}
              alt={currentUser.fullName}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-teal-400/60 shadow-md shrink-0"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="bg-teal-500/20 text-teal-300 border border-teal-400/40 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {currentUser.memberTier} Traveler
                </span>
                <span className="text-[11px] text-slate-400">
                  Member since {currentUser.joinedDate}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
                {currentUser.fullName}&apos;s Travel Passport
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                {currentUser.email} &middot; Tracking verified landmarks, heritage sites &amp; vacation spots
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              id="history-log-place-btn"
              onClick={onLogNewPlace}
              className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Log a Visited Place</span>
            </button>
            <button
              id="history-see-unvisited-btn"
              onClick={onExploreUnvisited}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-200 border border-teal-500/30 font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Compass className="w-4 h-4 text-teal-400" />
              <span>See Unvisited Places &rarr;</span>
            </button>
          </div>
        </div>

        {/* Passport Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-8 pt-6 border-t border-slate-700/60">
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 backdrop-blur-xs">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Places Visited</span>
              <CheckCircle2 className="w-4 h-4 text-teal-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-serif text-white">
              {userRecords.length}
            </div>
            <p className="text-[10px] text-teal-300/80 mt-0.5">Destinations logged</p>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 backdrop-blur-xs">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Indian States</span>
              <Flag className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-serif text-white">
              {uniqueStates.length} <span className="text-sm font-normal text-slate-400">/ 28</span>
            </div>
            <div className="w-full bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
              <div 
                className="bg-amber-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${statesProgressPercent}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 backdrop-blur-xs">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Countries</span>
              <Globe2 className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-serif text-white">
              {uniqueCountries.length}
            </div>
            <p className="text-[10px] text-sky-300/80 mt-0.5">Global territories</p>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 backdrop-blur-xs">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Avg Rating</span>
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-serif text-white">
              {avgRating} <span className="text-sm font-normal text-slate-400">/ 5.0</span>
            </div>
            <p className="text-[10px] text-amber-300/80 mt-0.5">Personal satisfaction</p>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search your visited places or memories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <label className="text-xs font-semibold text-slate-600 shrink-0">State Filter:</label>
          <select
            value={selectedStateFilter}
            onChange={(e) => setSelectedStateFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="All">All Visited States ({uniqueStates.length})</option>
            {uniqueStates.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Visited Places Cards Grid */}
      {filteredRecords.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto mb-3">
            <Compass className="w-7 h-7 text-teal-600" />
          </div>
          <h3 className="font-serif text-lg font-bold text-slate-900 mb-1">
            {searchTerm ? 'No matching visited places' : 'No places logged yet'}
          </h3>
          <p className="text-xs text-slate-500 mb-6">
            {searchTerm 
              ? 'Try adjusting your search query or state filter.' 
              : 'Browse the destination catalog and click "Mark as Visited" to start curating your personal travel timeline.'}
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={onLogNewPlace}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-colors"
            >
              Log a Place
            </button>
            <button
              onClick={onExploreUnvisited}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
            >
              Explore Unvisited Spots
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecords.map((record) => {
            const dest = destinations.find(
              (d) => d.id === record.destinationId || d.name.toLowerCase() === record.destinationName.toLowerCase()
            );

            const displayImage = record.imageUrl || dest?.imageUrl || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80';
            const gMapsUrl = dest?.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              `${record.destinationName}${record.state ? ', ' + record.state : ''}, ${record.country}`
            )}`;

            return (
              <div
                key={record.id}
                id={`visited-record-${record.id}`}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                {/* Image & Badges */}
                <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={displayImage}
                    alt={record.destinationName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>

                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Visited
                    </span>
                    {record.state && (
                      <span className="bg-slate-900/80 backdrop-blur text-teal-200 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                        {record.state}
                      </span>
                    )}
                  </div>

                  {/* Rating */}
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-slate-900/85 backdrop-blur text-white text-xs font-semibold px-2 py-1 rounded-lg">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>{record.rating || 5}</span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <p className="text-[11px] text-teal-300 flex items-center gap-1 font-medium">
                      <MapPin className="w-3 h-3 text-teal-400" />
                      <span>{record.state ? `${record.state}, ` : ''}{record.country}</span>
                    </p>
                    <h3 className="text-base font-serif font-bold text-white leading-snug">
                      {record.destinationName}
                    </h3>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-100">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-teal-600" />
                        Visited: {new Date(record.visitedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <button
                        onClick={() => dest && onEditVisit(dest, record)}
                        className="text-[11px] font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1"
                        title="Edit visit notes or rating"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit Log</span>
                      </button>
                    </div>

                    {record.notes ? (
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px] text-slate-700 leading-relaxed italic">
                        &ldquo;{record.notes}&rdquo;
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-400 italic">No notes recorded for this visit.</p>
                    )}
                  </div>

                  {/* Card Actions */}
                  <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <a
                        href={gMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-semibold text-slate-600 hover:text-teal-700 flex items-center gap-1 bg-slate-100 hover:bg-teal-50 px-2 py-1 rounded-lg border border-slate-200 transition-colors"
                      >
                        <Navigation className="w-3 h-3 text-teal-600" />
                        <span>Maps</span>
                      </a>
                      <button
                        onClick={() => onDeleteVisit(record.id)}
                        className="text-[11px] text-rose-600 hover:text-rose-800 p-1 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Delete from visited history"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {dest && (
                      <button
                        onClick={() => onSelectDestination(dest)}
                        className="text-xs font-bold text-teal-700 hover:text-white bg-teal-50 hover:bg-teal-700 px-3 py-1.5 rounded-lg border border-teal-200 hover:border-teal-700 flex items-center gap-1 transition-colors"
                      >
                        <span>View Tours</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
