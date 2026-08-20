'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, Users, MessageSquare, ShieldCheck, User } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();

  // Hide on landing page, onboarding wizard, quiz, and admin console
  if (
    pathname === '/' ||
    pathname.startsWith('/onboarding') ||
    pathname.startsWith('/quiz') ||
    pathname.startsWith('/admin')
  ) {
    return null;
  }

  const navItems = [
    { label: 'Explore', href: '/discover', icon: Compass },
    { label: 'MatchBox', href: '/matches', icon: Users },
    { label: 'Messages', href: '/matches', icon: MessageSquare },
    { label: 'Shield™', href: '/safety', icon: ShieldCheck },
    { label: 'Profile', href: '/profile', icon: User },
  ];

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 px-3 py-2 flex items-center justify-around shadow-sm">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          pathname === item.href ||
          (item.href === '/matches' && pathname.startsWith('/chat'));

        return (
          <Link
            key={item.label}
            href={item.href}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-colors ${
              isActive
                ? 'text-purple-700 font-extrabold'
                : 'text-gray-500 hover:text-gray-800 font-medium'
            }`}
          >
            <Icon size={19} strokeWidth={isActive ? 2.3 : 1.6} />
            <span className="text-[10px] mt-0.5 tracking-tight font-bold">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
