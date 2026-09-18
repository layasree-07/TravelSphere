import React from 'react';
import { Booking } from '../types/travel';
import { CheckCircle2, X, Download, Printer, Database, Calendar, Users, MapPin, QrCode } from 'lucide-react';

interface BookingTicketModalProps {
  booking: Booking;
  onClose: () => void;
  onViewInDatabase: () => void;
}

export const BookingTicketModal: React.FC<BookingTicketModalProps> = ({
  booking,
  onClose,
  onViewInDatabase,
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div 
        id="booking-ticket-modal"
        className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto"
      >
        {/* Top green confirmation bar */}
        <div className="bg-emerald-600 text-white p-4 text-center">
          <div className="w-10 h-10 rounded-full bg-emerald-500/80 mx-auto flex items-center justify-center mb-2 shadow-sm">
            <CheckCircle2 className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-bold">Booking Confirmed!</h3>
          <p className="text-xs text-emerald-100">
            Recorded in travelsphere database table <code className="font-mono bg-emerald-700 px-1 py-0.5 rounded">bookings</code>
          </p>
        </div>

        {/* Boarding Pass / Voucher Card */}
        <div className="p-6">
          <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50 shadow-inner">
            {/* Header of pass */}
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono tracking-wider text-teal-400 uppercase">TravelSphere Boarding Pass</span>
                <h4 className="text-sm font-serif font-bold text-white leading-tight mt-0.5">
                  {booking.packageTitle}
                </h4>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-mono">Reference</span>
                <span className="text-sm font-mono font-bold text-teal-300 bg-slate-800 px-2 py-0.5 rounded">
                  {booking.id}
                </span>
              </div>
            </div>

            {/* Perforated divider styling */}
            <div className="relative border-b border-dashed border-slate-300 my-1">
              <div className="absolute -left-2 -top-2 w-4 h-4 rounded-full bg-white border-r border-slate-200"></div>
              <div className="absolute -right-2 -top-2 w-4 h-4 rounded-full bg-white border-l border-slate-200"></div>
            </div>

            {/* Pass details */}
            <div className="p-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 block text-[11px]">Primary Traveler</span>
                  <span className="font-bold text-slate-900 text-sm">{booking.leadTraveler.fullName}</span>
                  <span className="text-slate-500 block text-[11px] truncate">{booking.leadTraveler.email}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Destination</span>
                  <span className="font-bold text-slate-900 text-sm flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-teal-600" />
                    {booking.destinationName}
                  </span>
                  <span className="text-slate-500 block text-[11px]">{booking.country}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[10px]">Departure Date</span>
                  <span className="font-semibold text-slate-900 flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {booking.travelDate}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Party Size</span>
                  <span className="font-semibold text-slate-900 flex items-center gap-1 mt-0.5">
                    <Users className="w-3 h-3 text-slate-400" />
                    {booking.travelersCount} Person(s)
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Total Paid</span>
                  <span className="font-bold text-emerald-700 text-sm">
                    ${booking.totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Barcode & Security stamp */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded text-[10px] tracking-wide border border-emerald-200">
                      STATUS: CONFIRMED
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Txn: {booking.transactionId}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Present this voucher with Government Photo ID upon check-in.
                  </p>
                </div>
                <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm shrink-0">
                  <QrCode className="w-9 h-9 text-slate-800" />
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-5 space-y-2">
            <div className="flex gap-2">
              <button
                id="print-voucher-btn"
                onClick={handlePrint}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5 border border-slate-200"
              >
                <Printer className="w-3.5 h-3.5" />
                Print / Save PDF
              </button>
              <button
                id="view-in-db-btn"
                onClick={onViewInDatabase}
                className="flex-1 bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5 border border-teal-200 font-mono"
              >
                <Database className="w-3.5 h-3.5 text-teal-600" />
                Inspect in DB
              </button>
            </div>

            <button
              id="close-voucher-modal-btn"
              onClick={onClose}
              className="w-full bg-slate-900 hover:bg-teal-800 text-white text-xs font-semibold py-2.5 rounded-xl transition-colors text-center"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
