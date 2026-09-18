import React, { useState } from 'react';
import { Destination } from '../types/travel';
import { X, Search, MapPin, Plus, CheckCircle2 } from 'lucide-react';

interface QuickLogPlaceSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  destinations: Destination[];
  visitedDestinationIds: Set<string>;
  onSelectDestinationToLog: (dest: Destination) => void;
}

export const QuickLogPlaceSelectorModal: React.FC<QuickLogPlaceSelectorModalProps> = ({
  isOpen,
  onClose,
  destinations,
  visitedDestinationIds,
  onSelectDestinationToLog,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('All');

  if (!isOpen) return null;

  const states = Array.from(new Set(destinations.map((d) => d.state).filter(Boolean))) as string[];

  const filtered = destinations.filter((dest) => {
    const q = searchTerm.toLowerCase().trim();
    const matchesQuery = !q || 
      dest.name.toLowerCase().includes(q) ||
      (dest.state && dest.state.toLowerCase().includes(q)) ||
      dest.country.toLowerCase().includes(q);

    const matchesState = selectedState === 'All' || dest.state === selectedState;
    return matchesQuery && matchesState;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl max-h-[85vh] overflow-hidden flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div>
            <h3 className="font-serif text-lg font-bold text-white">
              Log a Visited Place
            </h3>
            <p className="text-xs text-slate-400">
              Select any verified destination from the catalog to record your visit
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search controls */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search place name or state..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              autoFocus
            />
          </div>

          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="All">All States ({states.length})</option>
            {states.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        {/* List */}
        <div className="overflow-y-auto p-4 space-y-2 flex-1 divide-y divide-slate-100">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-xs">
              No matching destinations found.
            </div>
          ) : (
            filtered.map((dest) => {
              const alreadyVisited = visitedDestinationIds.has(dest.id);
              return (
                <div
                  key={dest.id}
                  className="pt-2.5 first:pt-0 flex items-center justify-between gap-3 group hover:bg-teal-50/40 p-2 rounded-xl transition-colors cursor-pointer"
                  onClick={() => {
                    onSelectDestinationToLog(dest);
                    onClose();
                  }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={dest.imageUrl}
                      alt={dest.name}
                      className="w-12 h-12 rounded-lg object-cover shrink-0 border border-slate-200"
                    />
                    <div className="min-w-0">
                      <h4 className="font-bold text-xs text-slate-900 truncate group-hover:text-teal-700">
                        {dest.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3 text-teal-600 shrink-0" />
                        <span>{dest.state ? `${dest.state}, ` : ''}{dest.country}</span>
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    {alreadyVisited ? (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-lg flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Logged
                      </span>
                    ) : (
                      <button
                        type="button"
                        className="text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-600 hover:text-white border border-teal-200 hover:border-teal-600 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Select</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
