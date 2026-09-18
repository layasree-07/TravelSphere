import React, { useState } from 'react';
import { UserProfile } from '../types/user';
import { DEFAULT_USERS } from '../data/userData';
import { 
  X, 
  LogIn, 
  UserPlus, 
  Mail, 
  Lock, 
  User, 
  Sparkles, 
  CheckCircle2, 
  Compass, 
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: UserProfile) => void;
  currentUser: UserProfile | null;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  currentUser,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleQuickDemoSelect = (user: UserProfile) => {
    setError(null);
    onLogin(user);
    setSuccessMsg(`Welcome back, ${user.fullName}!`);
    setTimeout(() => {
      setSuccessMsg(null);
      onClose();
    }, 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!password || password.length < 4) {
      setError('Please enter a password with at least 4 characters.');
      return;
    }

    if (mode === 'register') {
      if (!fullName.trim()) {
        setError('Please enter your full name.');
        return;
      }

      const newUser: UserProfile = {
        id: `usr-${Date.now()}`,
        fullName: fullName.trim(),
        email: cleanEmail,
        avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanEmail)}`,
        memberTier: 'Explorer',
        nationality: 'India',
        joinedDate: new Date().toISOString().split('T')[0],
      };

      onLogin(newUser);
      setSuccessMsg(`Account created! Welcome to TravelSphere, ${newUser.fullName}!`);
      setTimeout(() => {
        setSuccessMsg(null);
        onClose();
      }, 700);
    } else {
      // Login mode
      // Check if matches known demo user
      const existing = DEFAULT_USERS.find((u) => u.email.toLowerCase() === cleanEmail);
      if (existing) {
        onLogin(existing);
      } else {
        // Create or restore user profile
        const derivedName = cleanEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
        const user: UserProfile = {
          id: `usr-${cleanEmail.replace(/[^a-zA-Z0-9]/g, '')}`,
          fullName: derivedName || 'Traveler',
          email: cleanEmail,
          avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanEmail)}`,
          memberTier: 'Silver',
          nationality: 'India',
          joinedDate: new Date().toISOString().split('T')[0],
        };
        onLogin(user);
      }
      setSuccessMsg('Logged in successfully!');
      setTimeout(() => {
        setSuccessMsg(null);
        onClose();
      }, 600);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            id="close-login-modal-btn"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500 text-slate-950 flex items-center justify-center font-bold">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-white">
                {mode === 'login' ? 'Traveler Sign In' : 'Create Traveler Account'}
              </h3>
              <p className="text-xs text-slate-400">
                Track visited places, get unvisited recommendations &amp; manage bookings
              </p>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-slate-800/80 p-1 rounded-xl mt-5 text-xs font-semibold">
            <button
              type="button"
              id="switch-to-login-tab"
              onClick={() => { setMode('login'); setError(null); }}
              className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                mode === 'login' ? 'bg-teal-500 text-slate-950 shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              id="switch-to-register-tab"
              onClick={() => { setMode('register'); setError(null); }}
              className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                mode === 'register' ? 'bg-teal-500 text-slate-950 shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>New Account</span>
            </button>
          </div>
        </div>

        {/* Quick Demo Travelers */}
        <div className="bg-teal-50/70 border-b border-teal-100 px-6 py-3.5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-900 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-teal-600" />
              Quick Demo Accounts (1-Click)
            </span>
            <span className="text-[10px] text-teal-700">Instant test</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {DEFAULT_USERS.map((usr) => {
              const isSelected = currentUser?.id === usr.id;
              return (
                <button
                  key={usr.id}
                  id={`demo-user-btn-${usr.id}`}
                  type="button"
                  onClick={() => handleQuickDemoSelect(usr)}
                  className={`p-2 rounded-xl text-left border text-xs transition-all flex items-center gap-2.5 ${
                    isSelected
                      ? 'bg-teal-600 text-white border-teal-700 shadow-xs'
                      : 'bg-white hover:bg-teal-100/50 text-slate-800 border-teal-200'
                  }`}
                >
                  <img
                    src={usr.avatarUrl}
                    alt={usr.fullName}
                    className="w-7 h-7 rounded-full object-cover border border-white shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className={`font-bold truncate text-[11px] ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                      {usr.fullName}
                    </p>
                    <p className={`text-[10px] truncate ${isSelected ? 'text-teal-100' : 'text-slate-500'}`}>
                      {usr.memberTier} Member
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
              <span className="font-bold">Error:</span> {error}
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. Radhika Verma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="e.g. traveler@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
              />
            </div>
          </div>

          <button
            type="submit"
            id="auth-submit-btn"
            className="w-full mt-2 py-2.5 px-4 bg-slate-900 hover:bg-teal-800 text-white rounded-xl font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{mode === 'login' ? 'Sign In to Account' : 'Register & Start Tracking'}</span>
            <ArrowRight className="w-4 h-4 text-teal-300" />
          </button>

          <p className="text-center text-[11px] text-slate-500 mt-3">
            {mode === 'login' ? (
              <>
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('register'); setError(null); }}
                  className="font-bold text-teal-700 hover:underline"
                >
                  Create one here
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('login'); setError(null); }}
                  className="font-bold text-teal-700 hover:underline"
                >
                  Sign in here
                </button>
              </>
            )}
          </p>
        </form>
      </div>
    </div>
  );
};
