import React, { useState } from 'react';
import { TourPackage, Booking, LeadTraveler } from '../types/travel';
import { X, Calendar, Users, CreditCard, ShieldCheck, Check, Lock, Luggage, MapPin } from 'lucide-react';

interface BookingModalProps {
  tourPackage: TourPackage;
  initialGuests: number;
  initialDate: string;
  onClose: () => void;
  onBookingSuccess: (newBooking: Booking) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  tourPackage,
  initialGuests,
  initialDate,
  onClose,
  onBookingSuccess,
}) => {
  const [guests, setGuests] = useState<number>(initialGuests || 2);
  const [travelDate, setTravelDate] = useState<string>(initialDate || tourPackage.availableDates[0] || '2026-11-15');
  const [fullName, setFullName] = useState<string>('Priya Reddy');
  const [email, setEmail] = useState<string>('priya.reddy@bvrithyderabad.edu.in');
  const [phone, setPhone] = useState<string>('+91 98480 22338');
  const [nationality, setNationality] = useState<string>('India');
  const [paymentMethod, setPaymentMethod] = useState<'Credit Card' | 'PayPal' | 'UPI / NetBanking'>('Credit Card');
  const [specialRequests, setSpecialRequests] = useState<string>('Vegetarian meals preference & high floor room.');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const subtotal = tourPackage.price * guests;
  const taxesAndFees = Math.round(subtotal * 0.05); // 5% service & conservation fee
  const totalAmount = subtotal + taxesAndFees;

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setErrorMessage('Please provide your full name, email address, and phone number.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    // Simulate database transaction & confirmation
    setTimeout(() => {
      const randomCode = Math.floor(1000 + Math.random() * 9000);
      const newBookingId = `TS-2026-${randomCode}`;
      const randomTxn = `TXN-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

      const leadTraveler: LeadTraveler = {
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        nationality: nationality.trim() || 'Global Traveler',
      };

      const bookingRecord: Booking = {
        id: newBookingId,
        packageId: tourPackage.id,
        packageTitle: tourPackage.title,
        destinationName: tourPackage.destinationName,
        country: tourPackage.country,
        imageUrl: tourPackage.image,
        travelDate,
        travelersCount: guests,
        leadTraveler,
        totalAmount,
        status: 'Confirmed',
        paymentMethod,
        paymentStatus: 'Paid',
        transactionId: randomTxn,
        bookingDate: new Date().toISOString().split('T')[0],
        specialRequests: specialRequests.trim() || undefined,
      };

      setIsSubmitting(false);
      onBookingSuccess(bookingRecord);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div 
        id="booking-checkout-modal"
        className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[95vh] flex flex-col"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div>
            <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider block mb-1">
              Secure Reservation Checkout
            </span>
            <h3 className="text-lg sm:text-xl font-serif font-bold text-white">
              {tourPackage.title}
            </h3>
            <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-1">
              <MapPin className="w-3.5 h-3.5 text-teal-400" />
              {tourPackage.destinationName}, {tourPackage.country} &middot; {tourPackage.durationDays} Days / {tourPackage.durationNights} Nights
            </p>
          </div>
          <button
            id="close-booking-modal-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors shrink-0"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmitBooking} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
              {errorMessage}
            </div>
          )}

          {/* Section 1: Trip Configuration */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <Luggage className="w-4 h-4 text-teal-600" />
              1. Trip Preferences &amp; Schedule
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Departure Date
                </label>
                <select
                  id="checkout-travel-date"
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {tourPackage.availableDates.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Number of Travelers
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setGuests(Math.max(1, guests - 1))}
                    className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm border border-slate-200"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-bold text-sm text-slate-900">{guests}</span>
                  <button
                    type="button"
                    onClick={() => setGuests(Math.min(tourPackage.maxGuests, guests + 1))}
                    className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm border border-slate-200"
                  >
                    +
                  </button>
                  <span className="text-xs text-slate-500 ml-2">
                    ${tourPackage.price} &times; {guests}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Traveler Details */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-teal-600" />
              2. Primary Traveler Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  id="checkout-full-name"
                  type="text"
                  required
                  placeholder="e.g. Priya Reddy"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Email Address *
                </label>
                <input
                  id="checkout-email"
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Phone Number *
                </label>
                <input
                  id="checkout-phone"
                  type="tel"
                  required
                  placeholder="+91 98480 22338"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Nationality
                </label>
                <input
                  id="checkout-nationality"
                  type="text"
                  placeholder="India"
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="mt-3">
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Special Requests or Dietary Requirements
              </label>
              <textarea
                id="checkout-special-requests"
                rows={2}
                placeholder="e.g. Vegetarian/Jain meal options, airport pick-up time, king bed..."
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Section 3: Payment Method */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-teal-600" />
              3. Payment Selection
            </h4>
            <div className="grid grid-cols-3 gap-2.5">
              {(['Credit Card', 'UPI / NetBanking', 'PayPal'] as const).map((method) => (
                <button
                  key={method}
                  type="button"
                  id={`pay-method-${method.replace(/\s+/g, '-').toLowerCase()}`}
                  onClick={() => setPaymentMethod(method)}
                  className={`p-3 rounded-xl border text-xs font-medium text-center transition-all ${
                    paymentMethod === method
                      ? 'border-teal-600 bg-teal-50 text-teal-900 font-bold shadow-sm ring-1 ring-teal-600'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          {/* Pricing Breakdown Card */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Package Base ({guests} &times; ${tourPackage.price})</span>
              <span className="font-semibold text-slate-900">${subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Park Conservation, Taxes &amp; Port Fees (5%)</span>
              <span className="font-semibold text-slate-900">${taxesAndFees.toLocaleString()}</span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold text-slate-900">
              <span>Total Amount</span>
              <span className="text-base text-teal-700 font-serif font-bold">
                ${totalAmount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              id="confirm-booking-submit-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-slate-900 hover:bg-teal-800 text-white font-bold text-sm py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Writing to travelsphere DB...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-teal-400" />
                  <span>Confirm Reservation &middot; Pay ${totalAmount.toLocaleString()}</span>
                </>
              )}
            </button>
            <p className="text-[11px] text-center text-slate-400 mt-2 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              Direct sync with MySQL DB travelsphere &middot; Instant Voucher Generation
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
