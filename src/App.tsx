import React, { useState, useEffect } from 'react';
import { 
  Destination, 
  TourPackage, 
  Booking, 
  CategoryType 
} from './types/travel';
import { 
  INITIAL_DESTINATIONS, 
  INITIAL_PACKAGES, 
  INITIAL_BOOKINGS,
  generatePackageForDestination
} from './data/travelData';
import { Navbar } from './components/Navbar';
import { HeroSearch } from './components/HeroSearch';
import { DestinationCard } from './components/DestinationCard';
import { PackageCard } from './components/PackageCard';
import { PackageDetailModal } from './components/PackageDetailModal';
import { BookingModal } from './components/BookingModal';
import { BookingTicketModal } from './components/BookingTicketModal';
import { MyBookingsView } from './components/MyBookingsView';
import { DatabaseExplorerModal } from './components/DatabaseExplorerModal';
import { TripCostCalculator } from './components/TripCostCalculator';
import { AddPlaceModal } from './components/AddPlaceModal';
import { LoginModal } from './components/LoginModal';
import { LogVisitModal } from './components/LogVisitModal';
import { UserHistoryView } from './components/UserHistoryView';
import { QuickLogPlaceSelectorModal } from './components/QuickLogPlaceSelectorModal';
import { UserProfile, VisitedPlaceRecord } from './types/user';
import { DEFAULT_USERS, INITIAL_VISITED_PLACES } from './data/userData';
import { 
  Compass, 
  MapPin, 
  Luggage, 
  Database, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight,
  Filter,
  CheckCircle2,
  X,
  Plus,
  Eye
} from 'lucide-react';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<'explore' | 'packages' | 'bookings' | 'visited' | 'database'>('explore');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedState, setSelectedState] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('All');
  const [selectedContinent, setSelectedContinent] = useState<string>('All');
  const [maxBudget, setMaxBudget] = useState<number>(2600);
  const [onlyUnvisited, setOnlyUnvisited] = useState<boolean>(false);

  // User Profile & Authentication State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('travelsphere_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_USERS[0];
      }
    }
    return DEFAULT_USERS[0]; // Priya Reddy default active demo traveler
  });

  // Visited Places History with Persistence
  const [visitedPlaces, setVisitedPlaces] = useState<VisitedPlaceRecord[]>(() => {
    const saved = localStorage.getItem('travelsphere_visited_places');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_VISITED_PLACES;
      }
    }
    return INITIAL_VISITED_PLACES;
  });

  // Data Collections with Persistence
  const [destinations, setDestinations] = useState<Destination[]>(() => {
    const saved = localStorage.getItem('travelsphere_custom_destinations');
    if (saved) {
      try {
        const custom: Destination[] = JSON.parse(saved);
        const filteredCustom = custom.filter(
          (d) => !d.name.toLowerCase().includes('xyz temple') && d.name.toLowerCase().trim() !== 'xyz'
        );
        return [...filteredCustom, ...INITIAL_DESTINATIONS];
      } catch (e) {
        return INITIAL_DESTINATIONS;
      }
    }
    return INITIAL_DESTINATIONS;
  });

  const [packages, setPackages] = useState<TourPackage[]>(INITIAL_PACKAGES);
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('travelsphere_bookings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_BOOKINGS;
      }
    }
    return INITIAL_BOOKINGS;
  });

  // Modal Dialogs
  const [isAddPlaceOpen, setIsAddPlaceOpen] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isLogVisitModalOpen, setIsLogVisitModalOpen] = useState<boolean>(false);
  const [selectedDestForVisit, setSelectedDestForVisit] = useState<Destination | null>(null);
  const [selectedExistingVisitRecord, setSelectedExistingVisitRecord] = useState<VisitedPlaceRecord | null>(null);
  const [isQuickLogSelectorOpen, setIsQuickLogSelectorOpen] = useState<boolean>(false);

  const [detailModalPackage, setDetailModalPackage] = useState<TourPackage | null>(null);
  const [bookingModalPackage, setBookingModalPackage] = useState<TourPackage | null>(null);
  const [bookingGuests, setBookingGuests] = useState<number>(2);
  const [bookingDate, setBookingDate] = useState<string>('');
  const [voucherBooking, setVoucherBooking] = useState<Booking | null>(null);
  
  // Flash Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync bookings, user, and visited places to localStorage
  useEffect(() => {
    localStorage.setItem('travelsphere_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('travelsphere_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('travelsphere_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('travelsphere_visited_places', JSON.stringify(visitedPlaces));
  }, [visitedPlaces]);

  // Hydrate custom destinations from persistent server database
  useEffect(() => {
    fetch('/api/destinations')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.destinations && Array.isArray(data.destinations) && data.destinations.length > 0) {
          setDestinations((prev) => {
            const existingIds = new Set(prev.map((d) => d.id));
            const existingNames = new Set(prev.map((d) => d.name.toLowerCase()));
            const toAdd = data.destinations.filter(
              (d: Destination) => !existingIds.has(d.id) && !existingNames.has((d.name || '').toLowerCase())
            );
            return [...toAdd, ...prev];
          });
        }
      })
      .catch((err) => console.warn('Could not load server destinations on startup:', err));
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Add or Update Verified Place in Database
  const handleAddDestination = (newDest: Destination) => {
    setDestinations((prev) => {
      const destNameLower = newDest.name.toLowerCase().trim();
      const existingIdx = prev.findIndex(
        (d) => d.id === newDest.id || d.name.toLowerCase().trim() === destNameLower
      );

      let updated: Destination[];
      if (existingIdx >= 0) {
        // Update existing record of that place in database
        updated = [...prev];
        updated[existingIdx] = { ...updated[existingIdx], ...newDest };
      } else {
        // Add new record to database
        updated = [newDest, ...prev];
      }

      const customOnly = updated.filter((d) => d.addedByUser);
      localStorage.setItem('travelsphere_custom_destinations', JSON.stringify(customOnly));
      return updated;
    });

    // Also update tour package for this place in database
    const pkg = generatePackageForDestination(newDest);
    setPackages((prev) => {
      const exists = prev.some(
        (p) => p.destinationId === newDest.id || p.destinationName.toLowerCase() === newDest.name.toLowerCase()
      );
      if (exists) {
        return prev.map((p) =>
          p.destinationId === newDest.id || p.destinationName.toLowerCase() === newDest.name.toLowerCase() ? pkg : p
        );
      }
      return [pkg, ...prev];
    });

    if (newDest.state) {
      setSelectedState(newDest.state);
    }
    showToast(`Database of "${newDest.name}" updated successfully with AI-verified records!`);
  };

  // Helper to normalize state aliases (e.g. 'ap' -> 'andhra pradesh', 'up' -> 'uttar pradesh', 'telangana state' -> 'telangana')
  const normalizeQuery = (text: string) => {
    let clean = text.toLowerCase().trim();
    if (clean === 'ap' || clean === 'andhra') return 'andhra pradesh';
    if (clean === 'up') return 'uttar pradesh';
    if (clean === 'mp') return 'madhya pradesh';
    if (clean === 'tn') return 'tamil nadu';
    if (clean === 'hp') return 'himachal pradesh';
    if (clean.endsWith(' state')) clean = clean.replace(' state', '').trim();
    return clean;
  };

  // Active User Visited Records & Lookups
  const currentUserVisitedRecords = currentUser
    ? visitedPlaces.filter(
        (r) => r.userId === currentUser.id || r.userEmail.toLowerCase() === currentUser.email.toLowerCase()
      )
    : [];

  const visitedDestIdSet = new Set(currentUserVisitedRecords.map((r) => r.destinationId));
  const visitedNameSet = new Set(currentUserVisitedRecords.map((r) => r.destinationName.toLowerCase()));

  // Unvisited Places Count
  const unvisitedDestinationsCount = destinations.filter(
    (d) => !visitedDestIdSet.has(d.id) && !visitedNameSet.has(d.name.toLowerCase())
  ).length;

  // Handlers for User & Visited Places
  const handleLogin = (user: UserProfile) => {
    setCurrentUser(user);
    showToast(`Welcome, ${user.fullName}!`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setOnlyUnvisited(false);
    showToast('Signed out of TravelSphere.');
  };

  const handleToggleVisited = (dest: Destination) => {
    if (!currentUser) {
      setIsLoginModalOpen(true);
      return;
    }
    const existing = currentUserVisitedRecords.find(
      (r) => r.destinationId === dest.id || r.destinationName.toLowerCase() === dest.name.toLowerCase()
    );
    setSelectedDestForVisit(dest);
    setSelectedExistingVisitRecord(existing || null);
    setIsLogVisitModalOpen(true);
  };

  const handleSaveVisitRecord = (record: VisitedPlaceRecord) => {
    setVisitedPlaces((prev) => {
      const idx = prev.findIndex((r) => r.id === record.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = record;
        return updated;
      }
      return [record, ...prev];
    });
    showToast(`Logged "${record.destinationName}" in your travel history!`);
  };

  const handleDeleteVisitRecord = (recordId: string) => {
    setVisitedPlaces((prev) => prev.filter((r) => r.id !== recordId));
    showToast('Removed place from visited history.');
  };

  // Filter packages based on active search criteria and state
  const filteredPackages = packages.filter((pkg) => {
    const q = searchQuery.toLowerCase().trim();
    const normalizedQ = normalizeQuery(searchQuery);
    const dest = destinations.find((d) => d.id === pkg.destinationId);

    const matchesSearch = !q ||
      pkg.title.toLowerCase().includes(q) ||
      pkg.destinationName.toLowerCase().includes(q) ||
      pkg.country.toLowerCase().includes(q) ||
      (dest?.state && (dest.state.toLowerCase().includes(q) || dest.state.toLowerCase().includes(normalizedQ))) ||
      pkg.highlights.some((h) => h.toLowerCase().includes(q));

    const matchesCategory = selectedCategory === 'All' || pkg.category === selectedCategory;
    const matchesContinent = selectedContinent === 'All' || (dest && dest.continent === selectedContinent);
    
    // If user explicitly searched, prioritize search match over dropdown
    const isStateSearch = Boolean(q && dest?.state && (dest.state.toLowerCase().includes(q) || dest.state.toLowerCase().includes(normalizedQ)));
    const matchesState = selectedState === 'All' || (dest && dest.state === selectedState) || isStateSearch;
    const matchesBudget = pkg.price <= maxBudget;

    return matchesSearch && matchesCategory && matchesContinent && matchesState && matchesBudget;
  });

  // Filter destinations based on search, state, and unvisited status
  // If user types a state name in the search query OR selects a state from dropdown, ALL places in that state are visible!
  const filteredDestinations = destinations.filter((dest) => {
    // If user enabled "See places that you didn't visit", exclude places already visited by current traveler
    if (onlyUnvisited) {
      const isVisited = visitedDestIdSet.has(dest.id) || visitedNameSet.has(dest.name.toLowerCase());
      if (isVisited) return false;
    }

    const q = searchQuery.toLowerCase().trim();
    const normalizedQ = normalizeQuery(searchQuery);

    const isStateSearchMatch = Boolean(dest.state && (
      dest.state.toLowerCase().includes(q) || 
      dest.state.toLowerCase().includes(normalizedQ)
    ));

    const matchesSearch = !q ||
      isStateSearchMatch ||
      dest.name.toLowerCase().includes(q) ||
      dest.country.toLowerCase().includes(q) ||
      (dest.significance && dest.significance.toLowerCase().includes(q)) ||
      dest.tags.some((t) => t.toLowerCase().includes(q) || t.toLowerCase().includes(normalizedQ));

    const matchesState = selectedState === 'All' || dest.state === selectedState || isStateSearchMatch;
    const matchesContinent = selectedContinent === 'All' || dest.continent === selectedContinent;
    return matchesSearch && matchesState && matchesContinent;
  });

  // Handler: Select destination to view its packages and open itinerary modal
  const handleSelectDestination = (dest: Destination) => {
    // 1. Check for exact destination ID or exact destination name match
    let targetPkg = packages.find((p) => 
      p.destinationId === dest.id || 
      p.destinationName.toLowerCase() === dest.name.toLowerCase()
    );

    // 2. Check for partial name match or state match
    if (!targetPkg) {
      targetPkg = packages.find((p) =>
        p.destinationName.toLowerCase().includes(dest.name.toLowerCase()) ||
        dest.name.toLowerCase().includes(p.destinationName.toLowerCase()) ||
        (dest.state && (
          p.title.toLowerCase().includes(dest.state.toLowerCase()) ||
          p.destinationName.toLowerCase().includes(dest.state.toLowerCase()) ||
          p.highlights.some((h) => h.toLowerCase().includes(dest.state!.toLowerCase()))
        ))
      );
    }

    // 3. If no pre-configured package exists for this place yet, generate an authentic itinerary immediately
    if (!targetPkg) {
      targetPkg = generatePackageForDestination(dest);
      setPackages((prev) => [targetPkg!, ...prev]);
    }

    // Align state filter, clear search text so surrounding tours are visible, and switch to packages tab
    if (dest.state) {
      setSelectedState(dest.state);
    }
    setSearchQuery('');
    setActiveTab('packages');

    // Instantly launch the package detail itinerary modal!
    setDetailModalPackage(targetPkg);
  };

  // Handler: Trigger Booking Flow from package
  const handleOpenBooking = (pkg: TourPackage, guests: number = 2, date: string = '') => {
    setDetailModalPackage(null);
    setBookingModalPackage(pkg);
    setBookingGuests(guests);
    setBookingDate(date || pkg.availableDates[0] || '2026-11-15');
  };

  // Handler: Successful booking confirmed
  const handleBookingSuccess = (newBooking: Booking) => {
    setBookings([newBooking, ...bookings]);
    setBookingModalPackage(null);
    setVoucherBooking(newBooking);
    showToast(`Reservation ${newBooking.id} created & committed to travelsphere.bookings!`);
  };

  // Handler: Cancel Booking
  const handleCancelBooking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'Cancelled' as const } : b))
    );
    showToast(`Booking ${bookingId} has been cancelled in travelsphere DB.`);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-teal-100 selection:text-teal-900">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-3 animate-fade-in text-xs font-medium">
          <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white ml-2">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        bookingCount={bookings.filter((b) => b.status === 'Confirmed').length}
        visitedCount={currentUserVisitedRecords.length}
        currentUser={currentUser}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
        onQuickBookClick={() => {
          if (packages.length > 0) {
            handleOpenBooking(packages[0]);
          }
        }}
        onOpenAddPlace={() => setIsAddPlaceOpen(true)}
      />

      {/* Main Content Areas */}
      <main className="flex-1">
        {/* VIEW 1: EXPLORE / HOME */}
        {activeTab === 'explore' && (
          <div>
            <HeroSearch
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedState={selectedState}
              setSelectedState={setSelectedState}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedContinent={selectedContinent}
              setSelectedContinent={setSelectedContinent}
              maxBudget={maxBudget}
              setMaxBudget={setMaxBudget}
              onlyUnvisited={onlyUnvisited}
              setOnlyUnvisited={setOnlyUnvisited}
              unvisitedCount={unvisitedDestinationsCount}
              visitedCount={currentUserVisitedRecords.length}
              currentUser={currentUser}
              onOpenLogin={() => setIsLoginModalOpen(true)}
              onExplorePackages={() => setActiveTab('packages')}
              onOpenAddPlace={() => setIsAddPlaceOpen(true)}
            />

            {/* Destinations Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
              {/* Header with State Feedback Bar */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-4 pb-4 border-b border-slate-200">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-teal-700 block">
                      {selectedState !== 'All' ? `State Catalog &middot; ${selectedState}` : 'Verified Destinations Catalog'}
                    </span>
                    {selectedState !== 'All' && (
                      <span className="bg-teal-100 text-teal-800 text-[11px] font-bold px-2 py-0.5 rounded-full">
                        {filteredDestinations.length} places
                      </span>
                    )}
                    {onlyUnvisited && (
                      <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <Eye className="w-3 h-3 text-amber-700" />
                        Showing Unvisited Only ({filteredDestinations.length} places)
                      </span>
                    )}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
                    {selectedState !== 'All'
                      ? `Places & Landmarks in ${selectedState}`
                      : searchQuery
                      ? `Search Results for "${searchQuery}"`
                      : onlyUnvisited
                      ? 'Unvisited Places on Your Travel Horizon'
                      : 'Iconic Places Across Indian States & World Escapes'}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
                    {onlyUnvisited
                      ? 'Displaying tourist destinations you have not logged in your visited history yet. Mark places as visited to track your journey!'
                      : 'Every place includes its historical significance, best visiting season, verified Google Maps link, and optional tour packages.'}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
                  {onlyUnvisited && (
                    <button
                      onClick={() => setOnlyUnvisited(false)}
                      className="text-xs font-bold text-amber-800 hover:text-amber-950 bg-amber-50 hover:bg-amber-100 border border-amber-300 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" />
                      Show All (Include Visited)
                    </button>
                  )}
                  {selectedState !== 'All' && (
                    <button
                      onClick={() => setSelectedState('All')}
                      className="text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Reset State Filter
                    </button>
                  )}
                  <button
                    onClick={() => setIsAddPlaceOpen(true)}
                    className="text-xs font-bold text-white bg-teal-600 hover:bg-teal-500 px-3.5 py-1.5 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Place</span>
                    <Sparkles className="w-3 h-3 text-teal-200" />
                  </button>
                </div>
              </div>

              {/* Destination Grid */}
              {filteredDestinations.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center max-w-md mx-auto my-6 shadow-sm">
                  <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center mx-auto mb-3">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-1">
                    {onlyUnvisited
                      ? 'You have visited all matching places!'
                      : `No places found for ${selectedState !== 'All' ? selectedState : `"${searchQuery}"`}`}
                  </h3>
                  <p className="text-xs text-slate-500 mb-4">
                    {onlyUnvisited
                      ? 'Congratulations on exploring these locations! Turn off the unvisited filter or add new tourist spots to discover more.'
                      : 'Be the first traveler to add a place in this state with automatic AI verification!'}
                  </p>
                  <div className="flex items-center justify-center gap-2 flex-wrap">
                    {onlyUnvisited && (
                      <button
                        onClick={() => setOnlyUnvisited(false)}
                        className="px-3.5 py-2 text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 rounded-xl"
                      >
                        Show Visited Places
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedState('All');
                        setSelectedContinent('All');
                        setOnlyUnvisited(false);
                      }}
                      className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
                    >
                      Show All Places
                    </button>
                    <button
                      onClick={() => setIsAddPlaceOpen(true)}
                      className="px-3.5 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-500 rounded-xl flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add This Place
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredDestinations.map((dest) => {
                    const isVisited = visitedDestIdSet.has(dest.id) || visitedNameSet.has(dest.name.toLowerCase());
                    const visitedRecord = currentUserVisitedRecords.find(
                      (r) => r.destinationId === dest.id || r.destinationName.toLowerCase() === dest.name.toLowerCase()
                    );
                    return (
                      <DestinationCard
                        key={dest.id}
                        destination={dest}
                        isVisited={isVisited}
                        visitedRecord={visitedRecord}
                        onToggleVisited={handleToggleVisited}
                        onSelect={handleSelectDestination}
                      />
                    );
                  })}
                </div>
              )}

              {/* Interactive Trip Cost Calculator */}
              <TripCostCalculator
                destinations={destinations}
                packages={packages}
                onSelectPackage={(pkg) => handleOpenBooking(pkg)}
              />

              {/* Top Featured Packages Preview */}
              <div className="mt-10 pt-8 border-t border-slate-200">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
                      Handpicked Signature Expeditions
                    </h3>
                    <p className="text-xs text-slate-500">
                      Top-rated luxury rail journeys, private catamaran sailings, and wildlife safaris
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('packages')}
                    className="bg-slate-900 text-white text-xs font-semibold px-3.5 py-2 rounded-xl hover:bg-teal-800 transition-colors"
                  >
                    All Packages &rarr;
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {packages.slice(0, 3).map((pkg) => (
                    <PackageCard
                      key={pkg.id}
                      tourPackage={pkg}
                      onViewDetails={(p) => setDetailModalPackage(p)}
                      onBookNow={(p) => handleOpenBooking(p)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: ALL PACKAGES */}
        {activeTab === 'packages' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-slate-200">
              <div>
                <span className="text-xs font-mono font-bold text-teal-700 uppercase tracking-wider block mb-1">
                  Travel Catalog &middot; travelsphere.packages
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
                  Curated Tour Packages &amp; Itineraries
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Showing {filteredPackages.length} of {packages.length} holiday packages
                </p>
              </div>

              {/* Active Filter Badges */}
              <div className="flex items-center gap-2 flex-wrap">
                {selectedState !== 'All' && (
                  <span className="inline-flex items-center gap-1 text-xs bg-teal-50 text-teal-800 px-2.5 py-1 rounded-lg border border-teal-200 font-semibold">
                    State: {selectedState}
                    <button onClick={() => setSelectedState('All')} className="hover:text-teal-950 font-bold ml-1">
                      &times;
                    </button>
                  </span>
                )}
                {selectedCategory !== 'All' && (
                  <span className="inline-flex items-center gap-1 text-xs bg-teal-50 text-teal-800 px-2.5 py-1 rounded-lg border border-teal-200">
                    Category: {selectedCategory}
                    <button onClick={() => setSelectedCategory('All')} className="hover:text-teal-950 font-bold ml-1">
                      &times;
                    </button>
                  </span>
                )}
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 text-xs bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg border border-slate-200">
                    "{searchQuery}"
                    <button onClick={() => setSearchQuery('')} className="hover:text-slate-950 font-bold ml-1">
                      &times;
                    </button>
                  </span>
                )}
              </div>
            </div>

            {/* Packages Grid */}
            {filteredPackages.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-3">
                  <Filter className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-800 mb-1">No Matching Packages</h3>
                <p className="text-xs text-slate-500 mb-4">
                  No tour packages match your selected search or budget criteria. Try resetting filters.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedState('All');
                    setSelectedCategory('All');
                    setSelectedContinent('All');
                    setMaxBudget(3000);
                  }}
                  className="bg-slate-900 text-white text-xs font-semibold px-4 py-2 rounded-xl"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPackages.map((pkg) => (
                  <PackageCard
                    key={pkg.id}
                    tourPackage={pkg}
                    onViewDetails={(p) => setDetailModalPackage(p)}
                    onBookNow={(p) => handleOpenBooking(p)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW 3: MY BOOKINGS */}
        {activeTab === 'bookings' && (
          <MyBookingsView
            bookings={bookings}
            onViewVoucher={(b) => setVoucherBooking(b)}
            onCancelBooking={handleCancelBooking}
            onExploreClick={() => setActiveTab('packages')}
          />
        )}

        {/* VIEW 4: VISITED PLACES & TRAVEL PASSPORT */}
        {activeTab === 'visited' && (
          <UserHistoryView
            currentUser={currentUser}
            visitedPlaces={visitedPlaces}
            destinations={destinations}
            onOpenLogin={() => setIsLoginModalOpen(true)}
            onEditVisit={(dest, record) => {
              setSelectedDestForVisit(dest);
              setSelectedExistingVisitRecord(record);
              setIsLogVisitModalOpen(true);
            }}
            onDeleteVisit={handleDeleteVisitRecord}
            onLogNewPlace={() => setIsQuickLogSelectorOpen(true)}
            onExploreUnvisited={() => {
              setOnlyUnvisited(true);
              setActiveTab('explore');
            }}
            onSelectDestination={handleSelectDestination}
          />
        )}

        {/* VIEW 5: DATABASE EXPLORER & MYSQL CONSOLE */}
        {activeTab === 'database' && (
          <DatabaseExplorerModal
            destinations={destinations}
            packages={packages}
            bookings={bookings}
            isFullView={true}
          />
        )}
      </main>

      {/* MODAL: ADD PLACE WITH AI VERIFICATION */}
      {isAddPlaceOpen && (
        <AddPlaceModal
          onClose={() => setIsAddPlaceOpen(false)}
          onAddPlace={handleAddDestination}
        />
      )}

      {/* MODAL 1: PACKAGE DETAIL / ITINERARY */}
      {detailModalPackage && (
        <PackageDetailModal
          tourPackage={detailModalPackage}
          onClose={() => setDetailModalPackage(null)}
          onBook={(pkg, guests, date) => handleOpenBooking(pkg, guests, date)}
        />
      )}

      {/* MODAL 2: BOOKING CHECKOUT */}
      {bookingModalPackage && (
        <BookingModal
          tourPackage={bookingModalPackage}
          initialGuests={bookingGuests}
          initialDate={bookingDate}
          onClose={() => setBookingModalPackage(null)}
          onBookingSuccess={handleBookingSuccess}
        />
      )}

      {/* MODAL 3: BOOKING TICKET VOUCHER */}
      {voucherBooking && (
        <BookingTicketModal
          booking={voucherBooking}
          onClose={() => setVoucherBooking(null)}
          onViewInDatabase={() => {
            setVoucherBooking(null);
            setActiveTab('database');
          }}
        />
      )}

      {/* MODAL 4: USER LOGIN & AUTHENTICATION */}
      {isLoginModalOpen && (
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onLogin={handleLogin}
          currentUser={currentUser}
        />
      )}

      {/* MODAL 5: LOG VISITED PLACE */}
      {isLogVisitModalOpen && selectedDestForVisit && (
        <LogVisitModal
          isOpen={isLogVisitModalOpen}
          destination={selectedDestForVisit}
          existingRecord={selectedExistingVisitRecord}
          currentUser={currentUser}
          onClose={() => {
            setIsLogVisitModalOpen(false);
            setSelectedDestForVisit(null);
            setSelectedExistingVisitRecord(null);
          }}
          onSave={handleSaveVisitRecord}
          onDelete={handleDeleteVisitRecord}
        />
      )}

      {/* MODAL 6: QUICK LOG PLACE SELECTOR */}
      {isQuickLogSelectorOpen && (
        <QuickLogPlaceSelectorModal
          isOpen={isQuickLogSelectorOpen}
          destinations={destinations}
          visitedDestinationIds={visitedDestIdSet}
          onClose={() => setIsQuickLogSelectorOpen(false)}
          onSelectDestinationToLog={(dest: Destination) => {
            const existing = currentUserVisitedRecords.find(
              (r) => r.destinationId === dest.id || r.destinationName.toLowerCase() === dest.name.toLowerCase()
            );
            setSelectedDestForVisit(dest);
            setSelectedExistingVisitRecord(existing || null);
            setIsLogVisitModalOpen(true);
          }}
        />
      )}

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-xs py-10 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-slate-800">
            {/* Col 1 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-white">
                <Compass className="w-5 h-5 text-teal-400" />
                <span className="font-serif text-lg font-bold">TravelSphere</span>
              </div>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                Travel &amp; Tourism Management System featuring curated global tour packages, day-by-day itineraries, instant reservation vouchers, and MySQL database integration.
              </p>
            </div>

            {/* Col 2 */}
            <div>
              <h4 className="text-white font-semibold mb-2">Featured States &amp; Places</h4>
              <ul className="space-y-1 text-[11px]">
                <li>Telangana (Charminar, Golconda, Ramappa)</li>
                <li>Andhra Pradesh (Tirupati, Araku, Gandikota)</li>
                <li>Kerala (Alleppey Backwaters, Munnar)</li>
                <li>Goa (Basilica of Bom Jesus, Beaches)</li>
                <li>Rajasthan (Jaipur, Udaipur, Jaisalmer)</li>
              </ul>
            </div>

            {/* Col 3 */}
            <div>
              <h4 className="text-white font-semibold mb-2">System Architecture</h4>
              <ul className="space-y-1 text-[11px] font-mono">
                <li className="text-teal-400">Database: travelsphere</li>
                <li>Host: localhost:3306</li>
                <li>Driver: com.mysql.cj.jdbc.Driver</li>
                <li>Package: com.travelsphere.util</li>
                <li>Class: DBConnection.java</li>
              </ul>
            </div>

            {/* Col 4 */}
            <div>
              <h4 className="text-white font-semibold mb-2">Project Compatibility</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed mb-2">
                Designed for college and enterprise Java/J2EE + MySQL projects. Synchronized with the <code className="text-teal-300">travelsphere</code> database schema.
              </p>
              <button
                onClick={() => setActiveTab('database')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-[11px] font-mono border border-slate-700 transition-colors"
              >
                <Database className="w-3.5 h-3.5 text-teal-400" />
                Launch DB Console
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
            <p>&copy; {new Date().getFullYear()} TravelSphere Global &amp; Indian Tours. All rights reserved.</p>
            <p className="flex items-center gap-1 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-500" />
              Connected to MySQL (travelsphere) via DBConnection.getConnection()
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
