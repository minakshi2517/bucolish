'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import BucolishLogo from '../brand/BucolishLogo';
import { MapPin, Sparkles, LogOut, Compass, Users } from 'lucide-react';

interface NavbarProps {
  currentUser: any;
  onOpenAuth: (mode?: 'LOGIN' | 'SIGNUP') => void;
  onLogout?: () => void;
}

export default function Navbar({ currentUser, onOpenAuth, onLogout }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/v1/auth/me', { method: 'DELETE' });
      if (onLogout) onLogout();
      router.push('/');
      window.location.reload();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href={currentUser ? '/discover' : '/'} className="flex items-center gap-2">
          <BucolishLogo size="md" />
        </Link>

        {/* City Launch Callout */}
        <div className="hidden md:flex items-center gap-1.5 px-3.5 py-1 bg-purple-50 border border-purple-200 rounded-full text-xs font-bold text-purple-800">
          <MapPin size={13} className="text-purple-600" />
          <span>Gurugram Official Launch</span>
        </div>

        {/* Right Navigation */}
        <div className="flex items-center gap-2 sm:gap-3">
          {currentUser ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/discover"
                className={`text-xs sm:text-sm font-bold px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
                  pathname === '/discover'
                    ? 'text-purple-700 bg-purple-50 border border-purple-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Compass size={15} />
                <span>Explore Deck</span>
              </Link>

              <Link
                href="/matches"
                className={`text-xs sm:text-sm font-bold px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
                  pathname === '/matches'
                    ? 'text-purple-700 bg-purple-50 border border-purple-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Users size={15} />
                <span>MatchBox</span>
              </Link>

              <Link
                href="/profile"
                className="flex items-center gap-2 p-1 pl-2 pr-3 rounded-full bg-gray-50 hover:bg-purple-50 border border-gray-200 hover:border-purple-200 transition-all"
                title="Resident Profile & Preferences"
              >
                <img
                  src={
                    currentUser.avatar ||
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80'
                  }
                  alt={currentUser.name || 'Resident'}
                  className="w-7 h-7 rounded-full object-cover border border-purple-300"
                />
                <span className="text-xs font-bold text-gray-800 hidden sm:inline">
                  {currentUser.name?.split(' ')[0] || 'Resident'}
                </span>
              </Link>

              <button
                onClick={handleLogout}
                className="p-2 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                title="Sign Out"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => onOpenAuth('LOGIN')}
                className="text-xs sm:text-sm font-bold text-gray-700 hover:text-purple-600 px-3.5 py-2 rounded-xl transition-colors"
              >
                Sign In
              </button>

              <button
                onClick={() => onOpenAuth('SIGNUP')}
                className="btn-primary text-xs sm:text-sm !py-2 !px-4 shadow-md"
              >
                <Sparkles size={14} />
                <span>Find Flatmates</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
