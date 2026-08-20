'use client';

import React, { useState } from 'react';
import { Users, Check, RefreshCw } from 'lucide-react';

interface QuickUserSwitcherProps {
  currentUserId?: string;
  onUserSwitched: () => void;
}

const DEMO_USERS = [
  {
    phone: '+919876543210',
    name: 'Aryan Sharma',
    tag: 'Looking for Flat (Gurugram)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
  },
  {
    phone: '+919876543211',
    name: 'Priya Nair',
    tag: 'Has 2BHK in DLF Phase 4',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  },
  {
    phone: '+919876543212',
    name: 'Rohan Malhotra',
    tag: 'Tech Lead @ Google',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
  },
  {
    phone: '+919876543213',
    name: 'Ananya Sen',
    tag: 'Has Flat in Sector 56',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
  },
  {
    phone: '+919999999999',
    name: 'Admin Panel',
    tag: 'Platform Moderator',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
  },
];

export default function QuickUserSwitcher({
  currentUserId,
  onUserSwitched,
}: QuickUserSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loadingPhone, setLoadingPhone] = useState<string | null>(null);

  const handleSwitch = async (phone: string) => {
    setLoadingPhone(phone);
    try {
      const res = await fetch('/api/v1/auth/switch-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      if (res.ok) {
        setIsOpen(false);
        onUserSwitched();
        window.location.reload();
      }
    } catch (err) {
      console.error('Failed to switch demo user:', err);
    } finally {
      setLoadingPhone(null);
    }
  };

  return (
    <div className="fixed bottom-16 sm:bottom-4 left-4 z-50">
      {isOpen && (
        <div className="mb-2 w-72 bg-white rounded-2xl shadow-2xl border border-purple-200 p-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100 mb-2">
            <span className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
              <Users size={14} className="text-purple-600" />
              Demo Account Switcher
            </span>
            <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-bold">
              Instant Testing
            </span>
          </div>
          <div className="space-y-1.5 max-h-60 overflow-y-auto">
            {DEMO_USERS.map((u) => (
              <button
                key={u.phone}
                onClick={() => handleSwitch(u.phone)}
                disabled={loadingPhone !== null}
                className="w-full flex items-center gap-2.5 p-2 rounded-xl text-left hover:bg-purple-50/70 transition-colors border border-transparent hover:border-purple-100"
              >
                <img
                  src={u.avatar}
                  alt={u.name}
                  className="w-8 h-8 rounded-full object-cover border border-purple-200 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-gray-900 truncate">
                    {u.name}
                  </div>
                  <div className="text-[10px] text-gray-500 truncate">
                    {u.tag}
                  </div>
                </div>
                {loadingPhone === u.phone ? (
                  <RefreshCw size={12} className="animate-spin text-purple-600" />
                ) : null}
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 rounded-full shadow-lg text-xs font-bold transition-all border border-slate-700 hover:scale-105"
      >
        <Users size={14} className="text-purple-400" />
        <span>Switch Demo User</span>
      </button>
    </div>
  );
}
