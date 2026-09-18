import React, { useState } from 'react';
import { Destination } from '../types/travel';
import { VisitedPlaceRecord, UserProfile } from '../types/user';
import { 
  X, 
  CheckCircle2, 
  Calendar, 
  Star, 
  MapPin, 
  Sparkles,
  Camera,
  Trash2
} from 'lucide-react';

interface LogVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  destination: Destination | null;
  existingRecord?: VisitedPlaceRecord | null;
  onSave: (record: VisitedPlaceRecord) => void;
  onDelete?: (recordId: string) => void;
  currentUser: UserProfile | null;
}

export const LogVisitModal: React.FC<LogVisitModalProps> = ({
  isOpen,
  onClose,
  destination,
  existingRecord,
  onSave,
  onDelete,
  currentUser,
}) => {
  const [visitedDate, setVisitedDate] = useState<string>(
    existingRecord?.visitedDate || new Date().toISOString().split('T')[0]
  );
  const [rating, setRating] = useState<number>(existingRecord?.rating || 5);
  const [notes, setNotes] = useState<string>(existingRecord?.notes || '');

  if (!isOpen || !destination) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const record: VisitedPlaceRecord = {
      id: existingRecord?.id || `vis-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      userId: currentUser?.id || 'guest',
      userEmail: currentUser?.email || 'guest@travelsphere.internal',
      destinationId: destination.id,
      destinationName: destination.name,
      state: destination.state,
      country: destination.country,
      imageUrl: destination.imageUrl,
      visitedDate: visitedDate || new Date().toISOString().split('T')[0],
      rating,
      notes: notes.trim(),
      createdAt: existingRecord?.createdAt || new Date().toISOString(),
    };

    onSave(record);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with image preview */}
        <div className="relative h-36 sm:h-40 w-full bg-slate-900 overflow-hidden">
          <img
            src={destination.imageUrl}
            alt={destination.name}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-900/70 text-white hover:bg-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-3 left-4 right-4 text-white">
            <div className="flex items-center gap-1 text-[11px] text-teal-300 font-semibold mb-0.5">
              <MapPin className="w-3.5 h-3.5 text-teal-400" />
              <span>{destination.state ? `${destination.state}, ` : ''}{destination.country}</span>
            </div>
            <h3 className="text-lg sm:text-xl font-serif font-bold text-white leading-tight">
              {destination.name}
            </h3>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="font-bold text-slate-900 text-sm">
                {existingRecord ? 'Edit Travel Log' : 'Add to Visited Places'}
              </span>
              <p className="text-[11px] text-slate-500">
                Logging for <strong>{currentUser?.fullName || 'Traveler'}</strong>
              </p>
            </div>
            <span className="bg-teal-50 text-teal-800 border border-teal-200 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-teal-600" />
              Travel Passport
            </span>
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Date You Visited
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="date"
                value={visitedDate}
                max={new Date().toISOString().split('T')[0]}
                onChange={(e) => setVisitedDate(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
              />
            </div>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Your Experience Rating
            </label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 rounded-lg hover:bg-slate-100 transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= rating
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-xs font-bold text-slate-700">
                {rating === 5 ? 'Exceptional (5/5)' : rating === 4 ? 'Great (4/5)' : rating === 3 ? 'Good (3/5)' : 'Fair'}
              </span>
            </div>
          </div>

          {/* Personal Memories / Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Personal Memories &amp; Travel Highlights
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Visited during sunset, loved the scenic river views, had delicious local cuisine nearby..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
            {existingRecord && onDelete ? (
              <button
                type="button"
                onClick={() => {
                  onDelete(existingRecord.id);
                  onClose();
                }}
                className="px-3 py-2 rounded-xl text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 font-semibold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove Visit</span>
              </button>
            ) : (
              <div></div>
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 font-semibold text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{existingRecord ? 'Update Travel Log' : 'Save as Visited'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
