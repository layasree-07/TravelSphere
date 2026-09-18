import React from 'react';
import { 
  Compass, 
  Database, 
  Luggage, 
  MapPin, 
  Menu, 
  X, 
  CalendarCheck, 
  Plus, 
  Sparkles, 
  CheckCircle2, 
  User, 
  LogIn, 
  LogOut 
} from 'lucide-react';
import { UserProfile } from '../types/user';

interface NavbarProps {
  activeTab: 'explore' | 'packages' | 'bookings' | 'visited' | 'database';
  setActiveTab: (tab: 'explore' | 'packages' | 'bookings' | 'visited' | 'database') => void;
  bookingCount: number;
  visitedCount: number;
  currentUser: UserProfile | null;
  onOpenLogin: () => void;
  onLogout: () => void;
  onQuickBookClick: () => void;
  onOpenAddPlace: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  bookingCount,
  visitedCount,
  currentUser,
  onOpenLogin,
  onLogout,
  onQuickBookClick,
  onOpenAddPlace,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div 
            id="brand-logo"
            onClick={() => { setActiveTab('explore'); setMobileMenuOpen(false); }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-sm group-hover:bg-teal-700 transition-colors">
              <Compass className="w-5 h-5 text-teal-400 group-hover:rotate-45 transition-transform duration-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-xl font-bold text-slate-900 tracking-tight">TravelSphere</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-teal-50 text-teal-700 px-1.5 py-0.5 rounded border border-teal-200">
                  Global &amp; India
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">Connected to travelsphere DB</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              id="nav-destinations-btn"
              onClick={() => setActiveTab('explore')}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'explore'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <MapPin className="w-4 h-4 text-teal-600" />
              Destinations
            </button>

            <button
              id="nav-packages-btn"
              onClick={() => setActiveTab('packages')}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'packages'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Luggage className="w-4 h-4 text-teal-600" />
              Tour Packages
            </button>

            {/* User History / Visited Places Tab */}
            <button
              id="nav-visited-places-btn"
              onClick={() => setActiveTab('visited')}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 relative ${
                activeTab === 'visited'
                  ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Visited History</span>
              {visitedCount > 0 && (
                <span className="ml-0.5 bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  {visitedCount}
                </span>
              )}
            </button>

            <button
              id="nav-bookings-btn"
              onClick={() => setActiveTab('bookings')}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 relative ${
                activeTab === 'bookings'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <CalendarCheck className="w-4 h-4 text-teal-600" />
              Bookings
              {bookingCount > 0 && (
                <span className="ml-0.5 bg-teal-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  {bookingCount}
                </span>
              )}
            </button>

            <button
              id="nav-database-btn"
              onClick={() => setActiveTab('database')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1 ml-1 border ${
                activeTab === 'database'
                  ? 'bg-slate-900 text-teal-400 border-slate-900 shadow-sm'
                  : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100 hover:border-slate-400'
              }`}
              title="MySQL travelsphere Schema & Live DB Console"
            >
              <Database className="w-3.5 h-3.5 text-teal-500" />
              <span>DB Console</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
            </button>
          </nav>

          {/* User Profile & Quick Actions */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              id="nav-add-place-btn"
              onClick={onOpenAddPlace}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-teal-900 bg-teal-50 hover:bg-teal-100 border border-teal-200 transition-colors shadow-xs"
              title="Add a custom destination or place with AI verification"
            >
              <Plus className="w-3.5 h-3.5 text-teal-700" />
              <span>Add Place</span>
              <Sparkles className="w-3 h-3 text-teal-600" />
            </button>

            {/* User Login / Profile status */}
            {currentUser ? (
              <div className="relative">
                <button
                  id="user-profile-menu-btn"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl border border-slate-200 hover:border-teal-400 bg-slate-50 hover:bg-white transition-all cursor-pointer"
                >
                  <img
                    src={currentUser.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser.email}`}
                    alt={currentUser.fullName}
                    className="w-7 h-7 rounded-lg object-cover border border-slate-300 shrink-0"
                  />
                  <div className="text-left leading-none hidden lg:block pr-1">
                    <p className="text-xs font-bold text-slate-900 truncate max-w-[100px]">
                      {currentUser.fullName}
                    </p>
                    <p className="text-[10px] text-teal-700 font-semibold mt-0.5">
                      {currentUser.memberTier}
                    </p>
                  </div>
                </button>

                {userDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="p-2 border-b border-slate-100 mb-1">
                      <p className="text-xs font-bold text-slate-900">{currentUser.fullName}</p>
                      <p className="text-[10px] text-slate-500 truncate">{currentUser.email}</p>
                      <div className="mt-1 flex items-center justify-between text-[10px] text-teal-700">
                        <span>Visited: {visitedCount} places</span>
                        <span>{currentUser.memberTier}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setActiveTab('visited');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-700 hover:bg-teal-50 hover:text-teal-900 flex items-center gap-2 font-medium"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>My Visited History</span>
                    </button>

                    <button
                      onClick={() => {
                        onOpenLogin();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-700 hover:bg-slate-100 flex items-center gap-2 font-medium"
                    >
                      <User className="w-4 h-4 text-slate-500" />
                      <span>Switch Account</span>
                    </button>

                    <button
                      onClick={() => {
                        onLogout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs text-rose-700 hover:bg-rose-50 flex items-center gap-2 font-medium border-t border-slate-100 mt-1"
                    >
                      <LogOut className="w-4 h-4 text-rose-600" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                id="nav-login-btn"
                onClick={onOpenLogin}
                className="bg-slate-900 hover:bg-teal-800 text-white text-xs font-semibold px-3.5 py-1.5 rounded-xl transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5 text-teal-300" />
                <span>Sign In</span>
              </button>
            )}

            <button
              id="nav-quick-book-btn"
              onClick={onQuickBookClick}
              className="bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors shadow-xs flex items-center gap-1"
            >
              <Luggage className="w-3.5 h-3.5" />
              <span>Plan Trip</span>
            </button>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center gap-2">
            {currentUser ? (
              <button
                onClick={() => setActiveTab('visited')}
                className="p-1 rounded-lg border border-teal-400"
                title={currentUser.fullName}
              >
                <img
                  src={currentUser.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser.email}`}
                  alt={currentUser.fullName}
                  className="w-6 h-6 rounded-md object-cover"
                />
              </button>
            ) : (
              <button
                onClick={onOpenLogin}
                className="p-1.5 text-slate-700 bg-slate-100 rounded-lg text-xs font-bold"
              >
                Sign In
              </button>
            )}

            <button
              id="mobile-add-place-shortcut-btn"
              onClick={onOpenAddPlace}
              className="p-2 text-teal-700 bg-teal-50 rounded-lg border border-teal-200"
              title="Add Place"
            >
              <Plus className="w-4 h-4" />
            </button>

            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2">
          {currentUser && (
            <div className="p-3 bg-teal-50 rounded-xl border border-teal-200 flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.fullName}
                  className="w-8 h-8 rounded-full border border-teal-400"
                />
                <div>
                  <p className="font-bold text-xs text-slate-900">{currentUser.fullName}</p>
                  <p className="text-[10px] text-teal-700">{currentUser.email}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  onLogout();
                  setMobileMenuOpen(false);
                }}
                className="text-[11px] text-rose-600 font-semibold"
              >
                Sign Out
              </button>
            </div>
          )}

          <button
            onClick={() => { setActiveTab('explore'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
              activeTab === 'explore' ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-600'
            }`}
          >
            <MapPin className="w-4 h-4 text-teal-600" />
            Destinations &amp; States
          </button>

          <button
            onClick={() => { setActiveTab('visited'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
              activeTab === 'visited' ? 'bg-emerald-50 text-emerald-900 font-semibold' : 'text-slate-600'
            }`}
          >
            <span className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Places Visited History
            </span>
            {visitedCount > 0 && (
              <span className="bg-emerald-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {visitedCount}
              </span>
            )}
          </button>

          <button
            onClick={() => { setActiveTab('packages'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
              activeTab === 'packages' ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-600'
            }`}
          >
            <Luggage className="w-4 h-4 text-teal-600" />
            Tour Packages
          </button>

          <button
            onClick={() => { setActiveTab('bookings'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
              activeTab === 'bookings' ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-600'
            }`}
          >
            <span className="flex items-center gap-3">
              <CalendarCheck className="w-4 h-4 text-teal-600" />
              My Bookings
            </span>
            {bookingCount > 0 && (
              <span className="bg-teal-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {bookingCount}
              </span>
            )}
          </button>
          
          <button
            onClick={() => { onOpenAddPlace(); setMobileMenuOpen(false); }}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold bg-teal-50 text-teal-900 border border-teal-200"
          >
            <span className="flex items-center gap-2">
              <Plus className="w-4 h-4 text-teal-700" />
              Add Place (AI Checked)
            </span>
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          </button>

          <button
            onClick={() => { setActiveTab('database'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-mono ${
              activeTab === 'database' ? 'bg-slate-900 text-teal-400' : 'text-slate-700 bg-slate-50'
            }`}
          >
            <Database className="w-4 h-4 text-teal-500" />
            MySQL travelsphere Console
          </button>
          
          <div className="pt-2 flex gap-2">
            {!currentUser && (
              <button
                onClick={() => { onOpenLogin(); setMobileMenuOpen(false); }}
                className="flex-1 bg-slate-900 text-white text-sm font-medium py-2.5 rounded-lg text-center"
              >
                Sign In
              </button>
            )}
            <button
              onClick={() => { onQuickBookClick(); setMobileMenuOpen(false); }}
              className="flex-1 bg-teal-600 text-white text-sm font-medium py-2.5 rounded-lg text-center"
            >
              Plan Trip
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

