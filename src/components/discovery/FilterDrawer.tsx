'use client';

import React from 'react';
import { X, SlidersHorizontal, Check, RefreshCw } from 'lucide-react';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    gender: string;
    maxBudget: number;
    sector: string;
    verifiedOnly: boolean;
  };
  onApplyFilters: (newFilters: any) => void;
}

const GURUGRAM_SECTORS = [
  'ALL',
  'DLF Phase 1',
  'DLF Phase 2',
  'DLF Phase 3',
  'DLF Phase 4',
  'DLF Phase 5',
  'Cyber City',
  'Golf Course Road',
  'Golf Course Ext',
  'Sector 43',
  'Sector 56',
  'Sector 57',
  'Sohna Road',
];

export default function FilterDrawer({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
}: FilterDrawerProps) {
  const [gender, setGender] = React.useState(filters.gender);
  const [maxBudget, setMaxBudget] = React.useState(filters.maxBudget);
  const [sector, setSector] = React.useState(filters.sector);
  const [verifiedOnly, setVerifiedOnly] = React.useState(filters.verifiedOnly);

  if (!isOpen) return null;

  const handleApply = () => {
    onApplyFilters({
      gender,
      maxBudget,
      sector,
      verifiedOnly,
    });
    onClose();
  };

  const handleReset = () => {
    setGender('ANY');
    setMaxBudget(50000);
    setSector('ALL');
    setVerifiedOnly(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl relative border border-gray-100 animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
          <div className="flex items-center gap-2 text-gray-900 font-bold text-base">
            <SlidersHorizontal size={18} className="text-purple-600" />
            <span>Discovery Preferences & Filters</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-5">
          {/* HARD FILTER: GENDER */}
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-2">
              Gender Preference (Hard Filter)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'ANY', label: 'All Genders' },
                { id: 'FEMALE', label: 'Female Only' },
                { id: 'MALE', label: 'Male Only' },
              ].map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setGender(g.id)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                    gender === g.id
                      ? 'border-purple-600 bg-purple-50 text-purple-700 shadow-sm'
                      : 'border-gray-200 text-gray-700'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          {/* HARD FILTER: MAX BUDGET */}
          <div>
            <div className="flex justify-between items-center text-xs font-bold text-gray-800 mb-1.5">
              <span>Max Monthly Rent</span>
              <span className="text-purple-600 font-extrabold text-sm">
                Up to ₹{maxBudget.toLocaleString()} / mo
              </span>
            </div>
            <input
              type="range"
              min={10000}
              max={60000}
              step={2000}
              value={maxBudget}
              onChange={(e) => setMaxBudget(parseInt(e.target.value))}
              className="w-full accent-purple-600 cursor-pointer"
            />
          </div>

          {/* HARD FILTER: SECTOR */}
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-2">
              Gurugram Sector / Location
            </label>
            <select
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-600"
            >
              {GURUGRAM_SECTORS.map((s) => (
                <option key={s} value={s}>
                  {s === 'ALL' ? 'All Gurugram Sectors' : s}
                </option>
              ))}
            </select>
          </div>

          {/* HARD FILTER: VERIFIED ONLY */}
          <div className="flex items-center justify-between p-3 bg-purple-50/60 rounded-xl border border-purple-100">
            <div>
              <div className="text-xs font-bold text-purple-950">
                Verified Profiles Only
              </div>
              <div className="text-[10px] text-purple-700">
                Show only ID & workplace verified candidates
              </div>
            </div>
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(e) => setVerifiedOnly(e.target.checked)}
              className="w-4 h-4 accent-purple-600 cursor-pointer rounded"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-100">
          <button
            onClick={handleReset}
            className="text-xs font-bold text-gray-500 hover:text-gray-900 flex items-center gap-1"
          >
            <RefreshCw size={12} /> Reset
          </button>

          <button
            onClick={handleApply}
            className="btn-primary !py-2.5 !px-5 text-xs font-bold"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
