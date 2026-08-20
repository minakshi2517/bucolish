'use client';

import React from 'react';
import { Compass, Building, MapPin, Briefcase, ShieldCheck, Home } from 'lucide-react';

interface StoriesBarProps {
  activeFilter: string;
  onSelectFilter: (filter: string) => void;
}

const SECTOR_FILTERS = [
  { id: 'ALL', name: 'All Sectors', icon: Compass },
  { id: 'DLF Phase 4', name: 'DLF Phase 4', icon: Building },
  { id: 'Golf Course Road', name: 'Golf Course Rd', icon: MapPin },
  { id: 'Cyber City', name: 'Cyber City', icon: Briefcase },
  { id: 'VERIFIED', name: 'Verified Only', icon: ShieldCheck },
  { id: 'FLAT_OWNERS', name: 'Has Flat', icon: Home },
];

export default function StoriesBar({ activeFilter, onSelectFilter }: StoriesBarProps) {
  return (
    <div className="w-full overflow-x-auto no-scrollbar py-2.5 px-4 flex items-center gap-2">
      {SECTOR_FILTERS.map((item) => {
        const Icon = item.icon;
        const isActive =
          activeFilter === item.id ||
          (item.id === 'ALL' && !activeFilter) ||
          (item.id === 'DLF Phase 4' && activeFilter === 'DLF Phase 4');

        return (
          <button
            key={item.id}
            onClick={() => onSelectFilter(item.id)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all border ${
              isActive
                ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <Icon size={13} strokeWidth={isActive ? 2.2 : 1.7} />
            <span>{item.name}</span>
          </button>
        );
      })}
    </div>
  );
}
