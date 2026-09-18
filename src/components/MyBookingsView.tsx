import React, { useState } from 'react';
import { Booking } from '../types/travel';
import { CalendarCheck, MapPin, Calendar, Users, Printer, Ban, Search, CheckCircle2, AlertCircle } from 'lucide-react';

interface MyBookingsViewProps {
  bookings: Booking[];
  onViewVoucher: (booking: Booking) => void;
  onCancelBooking: (bookingId: string) => void;
  onExploreClick: () => void;
}

export const MyBookingsView: React.FC<MyBookingsViewProps> = ({
  bookings,
  onViewVoucher,
  onCancelBooking,
  onExploreClick,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Confirmed' | 'Cancelled'>('All');
  const [confirmCancelId, setConfirmCancelId] = useState<string | null>(null);

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.packageTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.destinationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.leadTraveler.fullName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'All' || b.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-teal-50 text-teal-700 text-xs font-semibold px-2 py-0.5 rounded border border-teal-200 font-mono">
              travelsphere.bookings
            </span>
            <span className="text-xs text-slate-500">Live Sync</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
            My Travel Reservations
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your booked holiday packages, download vouchers, and view live database status.
          </p>
        </div>

        <button
          id="my-bookings-new-trip-btn"
          onClick={onExploreClick}
          className="bg-slate-900 hover:bg-teal-800 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors shrink-0 flex items-center gap-1.5 self-start sm:self-auto"
        >
          Book Another Tour &rarr;
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="bookings-search-input"
            type="text"
            placeholder="Search by Booking ID, destination, or traveler name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="flex items-center gap-1.5">
          {(['All', 'Confirmed', 'Cancelled'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filterStatus === status
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-3">
            <CalendarCheck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-1">No Reservations Found</h3>
          <p className="text-xs text-slate-500 mb-4">
            {searchTerm || filterStatus !== 'All'
              ? 'No bookings match your current search criteria.'
              : 'You have not booked any tours yet. Discover handpicked global itineraries now!'}
          </p>
          <button
            onClick={onExploreClick}
            className="bg-slate-900 hover:bg-teal-800 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
          >
            Explore Tour Packages
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((b) => (
            <div
              key={b.id}
              id={`booking-item-${b.id}`}
              className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-5 items-start md:items-center justify-between"
            >
              {/* Left Media & Info */}
              <div className="flex items-start sm:items-center gap-4 flex-1">
                <img
                  src={b.imageUrl}
                  alt={b.packageTitle}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover shrink-0 border border-slate-100"
                />

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      {b.id}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        b.status === 'Confirmed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {b.status}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Booked on {b.bookingDate}
                    </span>
                  </div>

                  <h3 className="font-serif text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    {b.packageTitle}
                  </h3>

                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-teal-600" />
                    {b.destinationName}, {b.country}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      Travel: <strong>{b.travelDate}</strong>
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-slate-400" />
                      Guests: <strong>{b.travelersCount}</strong>
                    </span>
                    <span>
                      Passenger: <strong>{b.leadTraveler.fullName}</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Pricing & Actions */}
              <div className="w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 flex md:flex-col items-center md:items-end justify-between gap-3 shrink-0">
                <div className="text-left md:text-right">
                  <span className="text-[11px] text-slate-400 block">Total Paid</span>
                  <span className="text-lg font-bold font-serif text-slate-900">
                    ${b.totalAmount.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-500 block font-mono">
                    {b.paymentMethod} &middot; {b.paymentStatus}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    id={`view-voucher-btn-${b.id}`}
                    onClick={() => onViewVoucher(b)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Voucher
                  </button>

                  {b.status === 'Confirmed' && (
                    <>
                      {confirmCancelId === b.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            id={`cancel-confirm-${b.id}`}
                            onClick={() => {
                              onCancelBooking(b.id);
                              setConfirmCancelId(null);
                            }}
                            className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold rounded-lg transition-colors"
                          >
                            Confirm Cancel
                          </button>
                          <button
                            onClick={() => setConfirmCancelId(null)}
                            className="px-2 py-1 text-slate-500 hover:text-slate-800 text-[11px]"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          id={`cancel-btn-${b.id}`}
                          onClick={() => setConfirmCancelId(b.id)}
                          className="px-3 py-1.5 text-rose-600 hover:bg-rose-50 text-xs font-semibold rounded-lg transition-colors border border-rose-200 flex items-center gap-1"
                        >
                          <Ban className="w-3.5 h-3.5" />
                          Cancel
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
