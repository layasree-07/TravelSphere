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
  ArrowRight,
  ShieldCheck,
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

  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) {
    return null;
  }

  // --------------------------------------------------
  // QUICK DEMO LOGIN
  // --------------------------------------------------

  const handleQuickDemoSelect = (user: UserProfile) => {
    setError(null);

    onLogin(user);

    setSuccessMsg(`Welcome back, ${user.fullName}!`);

    setTimeout(() => {
      setSuccessMsg(null);
      onClose();
    }, 600);
  };

  // --------------------------------------------------
  // LOGIN / REGISTER
  // --------------------------------------------------

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);
    setSuccessMsg(null);

    const cleanEmail = email.trim().toLowerCase();

    // Email validation
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    // Password validation
    if (!password || password.length < 8) {
      setError(
        'Password must contain at least 8 characters.'
      );
      return;
    }

    // Name validation for registration
    if (mode === 'register' && !fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }

    // Confirm password validation
    if (
      mode === 'register' &&
      password !== confirmPassword
    ) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      // --------------------------------------------------
      // LOGIN
      // --------------------------------------------------

      if (mode === 'login') {
        const response = await fetch('/api/auth/login', {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({
            email: cleanEmail,
            password: password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              data.error ||
              'Invalid email or password.'
          );
        }

        // Save JWT token
        if (data.token) {
          localStorage.setItem(
            'travelsphere_token',
            data.token
          );
        }

        const backendUser = data.user || data;

        const loggedInUser: UserProfile = {
          id: String(
            backendUser.id ||
              `usr-${Date.now()}`
          ),

          fullName:
            backendUser.fullName ||
            backendUser.name ||
            'Traveler',

          email:
            backendUser.email ||
            cleanEmail,

          avatarUrl:
            backendUser.avatarUrl ||
            `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(
              cleanEmail
            )}`,

          memberTier:
            backendUser.memberTier ||
            'Explorer',

          nationality:
            backendUser.nationality ||
            'India',

          joinedDate:
            backendUser.joinedDate ||
            new Date()
              .toISOString()
              .split('T')[0],
        };

        onLogin(loggedInUser);

        setSuccessMsg(
          'Logged in successfully!'
        );

        setTimeout(() => {
          setSuccessMsg(null);
          onClose();
        }, 700);
      }

      // --------------------------------------------------
      // REGISTER
      // --------------------------------------------------

      else {
        const response = await fetch(
          '/api/auth/register',
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json',
            },

            body: JSON.stringify({
              name: fullName.trim(),
              email: cleanEmail,
              password: password,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              data.error ||
              'Registration failed.'
          );
        }

        // IMPORTANT:
        // Do NOT login here.
        // Backend has sent OTP.
        // Open OTP verification screen.

        setOtpStep(true);
        setOtp('');
        setSuccessMsg(
          'OTP sent to your email.'
        );
      }
    } catch (err) {
      console.error(
        'Authentication error:',
        err
      );

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(
          'Something went wrong. Please try again.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // VERIFY OTP
  // --------------------------------------------------

  const handleVerifyOtp = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError(null);
    setSuccessMsg(null);

    if (!otp || otp.length !== 6) {
      setError(
        'Please enter the 6-digit OTP.'
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        '/api/auth/verify-otp',
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',
          },

          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            otp: otp,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            'OTP verification failed.'
        );
      }

      // Save JWT token
      if (data.token) {
        localStorage.setItem(
          'travelsphere_token',
          data.token
        );
      }

      const backendUser = data.user || {};

      const verifiedUser: UserProfile = {
        id: String(
          backendUser.id ||
            `usr-${Date.now()}`
        ),

        fullName:
          backendUser.fullName ||
          backendUser.name ||
          fullName.trim(),

        email:
          backendUser.email ||
          email.trim().toLowerCase(),

        avatarUrl:
          backendUser.avatarUrl ||
          `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(
            email.trim().toLowerCase()
          )}`,

        memberTier:
          backendUser.memberTier ||
          'Explorer',

        nationality:
          backendUser.nationality ||
          'India',

        joinedDate:
          backendUser.joinedDate ||
          new Date()
            .toISOString()
            .split('T')[0],
      };

      setSuccessMsg(
        'Email verified successfully!'
      );

      onLogin(verifiedUser);

      setTimeout(() => {
        setSuccessMsg(null);
        setOtpStep(false);
        setOtp('');
        onClose();
      }, 900);

    } catch (err) {
      console.error(
        'OTP verification error:',
        err
      );

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(
          'OTP verification failed. Please try again.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // RESEND OTP
  // --------------------------------------------------

  const handleResendOtp = async () => {
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const response = await fetch(
        '/api/auth/resend-otp',
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',
          },

          body: JSON.stringify({
            email: email.trim().toLowerCase(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            'Failed to resend OTP.'
        );
      }

      setOtp('');

      setSuccessMsg(
        'New OTP sent to your email.'
      );

    } catch (err) {
      console.error(
        'Resend OTP error:',
        err
      );

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(
          'Failed to resend OTP.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden flex flex-col relative"
        onClick={(e) =>
          e.stopPropagation()
        }
      >

        {/* HEADER */}

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
              {otpStep ? (
                <ShieldCheck className="w-5 h-5" />
              ) : (
                <Compass className="w-5 h-5" />
              )}
            </div>

            <div>
              <h3 className="font-serif text-lg font-bold text-white">
                {otpStep
                  ? 'Verify Your Email'
                  : mode === 'login'
                  ? 'Traveler Sign In'
                  : 'Create Traveler Account'}
              </h3>

              <p className="text-xs text-slate-400">
                {otpStep
                  ? 'Enter the verification code sent to your email'
                  : 'Track visited places, get unvisited recommendations & manage bookings'}
              </p>
            </div>

          </div>

          {/* LOGIN / REGISTER TABS */}

          {!otpStep && (
            <div className="flex bg-slate-800/80 p-1 rounded-xl mt-5 text-xs font-semibold">

              <button
                type="button"
                id="switch-to-login-tab"
                onClick={() => {
                  setMode('login');
                  setError(null);
                }}
                className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  mode === 'login'
                    ? 'bg-teal-500 text-slate-950 shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>

              <button
                type="button"
                id="switch-to-register-tab"
                onClick={() => {
                  setMode('register');
                  setError(null);
                }}
                className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  mode === 'register'
                    ? 'bg-teal-500 text-slate-950 shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>New Account</span>
              </button>

            </div>
          )}

        </div>

        {/* QUICK DEMO ACCOUNTS */}

        {!otpStep && (
          <div className="bg-teal-50/70 border-b border-teal-100 px-6 py-3.5">

            <div className="flex items-center justify-between mb-2">

              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-900 flex items-center gap-1">

                <Sparkles className="w-3 h-3 text-teal-600" />

                Quick Demo Accounts (1-Click)

              </span>

              <span className="text-[10px] text-teal-700">
                Instant test
              </span>

            </div>

            <div className="grid grid-cols-2 gap-2">

              {DEFAULT_USERS.map((usr) => {

                const isSelected =
                  currentUser?.id === usr.id;

                return (
                  <button
                    key={usr.id}
                    id={`demo-user-btn-${usr.id}`}
                    type="button"
                    onClick={() =>
                      handleQuickDemoSelect(usr)
                    }
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

                      <p
                        className={`font-bold truncate text-[11px] ${
                          isSelected
                            ? 'text-white'
                            : 'text-slate-900'
                        }`}
                      >
                        {usr.fullName}
                      </p>

                      <p
                        className={`text-[10px] truncate ${
                          isSelected
                            ? 'text-teal-100'
                            : 'text-slate-500'
                        }`}
                      >
                        {usr.memberTier} Member
                      </p>

                    </div>

                  </button>
                );
              })}

            </div>
          </div>
        )}

        {/* OTP FORM */}

        {otpStep ? (

          <form
            onSubmit={handleVerifyOtp}
            className="p-6 space-y-5"
          >

            <div className="text-center">

              <div className="mx-auto w-14 h-14 rounded-full bg-teal-50 flex items-center justify-center mb-3">
                <Mail className="w-6 h-6 text-teal-600" />
              </div>

              <h4 className="text-lg font-bold text-slate-900">
                Check your email
              </h4>

              <p className="text-xs text-slate-500 mt-1">
                We sent a 6-digit verification code to
              </p>

              <p className="text-xs font-bold text-teal-700 mt-1 break-all">
                {email}
              </p>

            </div>

            {/* ERROR */}

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs">
                <span className="font-bold">
                  Error:
                </span>{' '}
                {error}
              </div>
            )}

            {/* SUCCESS */}

            {successMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">

                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />

                <span>
                  {successMsg}
                </span>

              </div>
            )}

            {/* OTP */}

            <div>

              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 text-center">
                Enter OTP
              </label>

              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                placeholder="000000"
                value={otp}
                onChange={(e) =>
                  setOtp(
                    e.target.value
                      .replace(/\D/g, '')
                      .slice(0, 6)
                  )
                }
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-center text-2xl font-bold tracking-[0.5em] text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
              />

            </div>

            {/* VERIFY */}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-slate-900 hover:bg-teal-800 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2"
            >

              <span>
                {loading
                  ? 'Verifying...'
                  : 'Verify Email'}
              </span>

              {!loading && (
                <ArrowRight className="w-4 h-4 text-teal-300" />
              )}

            </button>

            {/* RESEND */}

            <div className="text-center">

              <p className="text-[11px] text-slate-500">
                Didn't receive the code?
              </p>

              <button
                type="button"
                onClick={handleResendOtp}
                disabled={loading}
                className="mt-1 font-bold text-teal-700 hover:underline text-xs disabled:opacity-50"
              >
                Resend OTP
              </button>

            </div>

          </form>

        ) : (

          /* NORMAL LOGIN / REGISTER FORM */

          <form
            onSubmit={handleSubmit}
            className="p-6 space-y-4"
          >

            {/* ERROR */}

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">

                <span className="font-bold">
                  Error:
                </span>

                {error}

              </div>
            )}

            {/* SUCCESS */}

            {successMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">

                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />

                <span>
                  {successMsg}
                </span>

              </div>
            )}

            {/* FULL NAME */}

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
                    onChange={(e) =>
                      setFullName(
                        e.target.value
                      )
                    }
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                  />

                </div>

              </div>
            )}

            {/* EMAIL */}

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
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                />

              </div>

            </div>

            {/* PASSWORD */}

            <div>

              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {mode === 'register'
                  ? 'Enter Password'
                  : 'Password'}
              </label>

              <div className="relative">

                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />

                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                />

              </div>

            </div>

            {/* RE-ENTER PASSWORD */}

            {mode === 'register' && (
              <div>

                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Re-enter Password
                </label>

                <div className="relative">

                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />

                  <input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(
                        e.target.value
                      )
                    }
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                  />

                </div>

              </div>
            )}

            {/* SUBMIT BUTTON */}

            <button
              type="submit"
              id="auth-submit-btn"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 bg-slate-900 hover:bg-teal-800 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >

              <span>
                {loading
                  ? 'Please wait...'
                  : mode === 'login'
                  ? 'Sign In to Account'
                  : 'Register & Verify Email'}
              </span>

              {!loading && (
                <ArrowRight className="w-4 h-4 text-teal-300" />
              )}

            </button>

            {/* SWITCH */}

            <p className="text-center text-[11px] text-slate-500 mt-3">

              {mode === 'login' ? (
                <>
                  Don&apos;t have an account?{' '}

                  <button
                    type="button"
                    onClick={() => {
                      setMode('register');
                      setError(null);
                    }}
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
                    onClick={() => {
                      setMode('login');
                      setError(null);
                    }}
                    className="font-bold text-teal-700 hover:underline"
                  >
                    Sign in here
                  </button>
                </>
              )}

            </p>

          </form>

        )}

      </div>
    </div>
  );
};
