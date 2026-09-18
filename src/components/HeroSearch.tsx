import React from 'react';
import { 
  Search, 
  Compass, 
  Sparkles, 
  MapPin, 
  SlidersHorizontal, 
  Plus, 
  ChevronDown,
  CheckCircle2,
  Eye,
  EyeOff
} from 'lucide-react';
import { CategoryType } from '../types/travel';
import { UserProfile } from '../types/user';
import { INDIAN_STATES_LIST } from '../data/indianPlacesData';

interface HeroSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedState: string;
  setSelectedState: (state: string) => void;
  selectedCategory: CategoryType;
  setSelectedCategory: (cat: CategoryType) => void;
  selectedContinent: string;
  setSelectedContinent: (cont: string) => void;
  maxBudget: number;
  setMaxBudget: (budget: number) => void;
  onExplorePackages: () => void;
  onOpenAddPlace: () => void;
  // Unvisited filter props
  onlyUnvisited: boolean;
  setOnlyUnvisited: (val: boolean) => void;
  unvisitedCount?: number;
  visitedCount?: number;
  currentUser: UserProfile | null;
  onOpenLogin: () => void;
}

export const HeroSearch: React.FC<HeroSearchProps> = ({
  searchQuery,
  setSearchQuery,
  selectedState,
  setSelectedState,
  selectedCategory,
  setSelectedCategory,
  selectedContinent,
  setSelectedContinent,
  maxBudget,
  setMaxBudget,
  onExplorePackages,
  onOpenAddPlace,
  onlyUnvisited,
  setOnlyUnvisited,
  unvisitedCount,
  visitedCount = 0,
  currentUser,
  onOpenLogin,
}) => {
  const categories: CategoryType[] = ['All', 'Adventure', 'Cultural', 'Luxury', 'Romantic', 'Wildlife', 'Beach'];
  const continents = ['All', 'Asia', 'Europe', 'Africa', 'Americas'];
  const quickStates = ['All States', 'Telangana', 'Andhra Pradesh', 'Kerala', 'Goa', 'Gujarat', 'Karnataka', 'Maharashtra', 'Himachal Pradesh', 'Rajasthan', 'Tamil Nadu', 'Assam', 'West Bengal'];

  const handleToggleUnvisited = () => {
    if (!currentUser) {
      onOpenLogin();
      return;
    }
    setOnlyUnvisited(!onlyUnvisited);
  };

  return (
    <section className="relative bg-slate-900 text-white overflow-hidden py-12 sm:py-16 border-b border-slate-800">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#0d9488_1px,transparent_1px)] [background-size:24px_24px]"></div>
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-medium text-teal-300 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>TravelSphere &middot; Worldwide &amp; All 28 Indian States Catalog</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight text-white leading-tight">
              Explore Iconic Places &amp; State Destinations
            </h1>
            <p className="mt-2 text-xs sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              Discover verified heritage sites, cave formations, national parks, and holy shrines across all Indian states and global getaways.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start lg:self-auto">
            <button
              id="hero-add-place-btn"
              onClick={onOpenAddPlace}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 text-slate-950" />
              <span>Add a Place (AI Checked)</span>
              <Sparkles className="w-3 h-3 text-slate-950" />
            </button>
          </div>
        </div>

        {/* Search & Filter Card */}
        <div className="bg-white text-slate-900 rounded-2xl p-4 sm:p-6 shadow-xl border border-slate-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search Input */}
            <div>
              <label htmlFor="travel-search-input" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Search Destination or State
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="travel-search-input"
                  type="text"
                  placeholder="e.g. Telangana, Andhra, Kerala, Tirupati, Charminar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all font-medium"
                />
              </div>
            </div>

            {/* Indian State Dropdown Selector */}
            <div>
              <label htmlFor="state-filter-select" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Filter By State (India)</span>
                {selectedState !== 'All' && (
                  <button 
                    onClick={() => setSelectedState('All')} 
                    className="text-[10px] text-teal-700 hover:underline font-semibold lowercase"
                  >
                    clear
                  </button>
                )}
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-teal-600 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  id="state-filter-select"
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all font-medium appearance-none cursor-pointer"
                >
                  <option value="All">All States (Full Catalog)</option>
                  {INDIAN_STATES_LIST.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Region / Continent */}
            <div>
              <label htmlFor="region-select" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Continent / Region
              </label>
              <div className="relative">
                <Compass className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  id="region-select"
                  value={selectedContinent}
                  onChange={(e) => setSelectedContinent(e.target.value)}
                  className="w-full pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all font-medium appearance-none cursor-pointer"
                >
                  {continents.map((cont) => (
                    <option key={cont} value={cont}>
                      {cont === 'All' ? 'All Regions' : cont}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Max Budget Slider */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="budget-slider" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Tour Budget
                </label>
                <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-100">
                  ${maxBudget.toLocaleString()}
                </span>
              </div>
              <input
                id="budget-slider"
                type="range"
                min="300"
                max="3000"
                step="50"
                value={maxBudget}
                onChange={(e) => setMaxBudget(Number(e.target.value))}
                className="w-full accent-teal-600 cursor-pointer h-2 bg-slate-200 rounded-lg mt-2"
              />
            </div>
          </div>

          {/* Quick State Pills */}
          <div className="mt-4 pt-3.5 border-t border-slate-100">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-teal-600" /> States:
              </span>
              {quickStates.map((st) => {
                const isSelected = (st === 'All States' && selectedState === 'All') || selectedState === st;
                return (
                  <button
                    key={st}
                    onClick={() => setSelectedState(st === 'All States' ? 'All' : st)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all shrink-0 ${
                      isSelected
                        ? 'bg-teal-700 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                    }`}
                  >
                    {st}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category Filter Pills & Unvisited Places Option */}
          <div className="mt-3.5 pt-3.5 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs text-slate-500 font-medium mr-1 flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5" /> Category:
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  id={`cat-filter-${cat.toLowerCase()}`}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* UNVISITED PLACES TOGGLE */}
            <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
              <button
                id="toggle-unvisited-places-btn"
                type="button"
                onClick={handleToggleUnvisited}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border cursor-pointer ${
                  onlyUnvisited
                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-md shadow-emerald-600/20'
                    : 'bg-slate-50 hover:bg-teal-50 text-slate-700 hover:text-teal-900 border-slate-300 hover:border-teal-300'
                }`}
                title="Filter search to display only places you haven't visited yet"
              >
                {onlyUnvisited ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                    <span>Seeing places you didn&apos;t visit</span>
                    {unvisitedCount !== undefined && (
                      <span className="bg-emerald-800 text-emerald-100 text-[10px] font-mono px-1.5 py-0.5 rounded-full">
                        {unvisitedCount}
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 text-teal-600" />
                    <span>See places that you didn&apos;t visit</span>
                    {currentUser && visitedCount > 0 && (
                      <span className="bg-slate-200 text-slate-700 text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
                        {visitedCount} visited
                      </span>
                    )}
                  </>
                )}
              </button>

              <button
                id="hero-view-packages-cta"
                onClick={onExplorePackages}
                className="bg-slate-900 hover:bg-teal-900 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <span>Packages</span>
                <span>&rarr;</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
