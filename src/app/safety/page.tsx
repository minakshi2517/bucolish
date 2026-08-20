'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import AuthModal from '@/components/auth/AuthModal';
import QuickUserSwitcher from '@/components/auth/QuickUserSwitcher';
import {
  ShieldCheck,
  Lock,
  EyeOff,
  AlertTriangle,
  FileText,
  CheckCircle2,
  Ban,
} from 'lucide-react';

export default function SafetyPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [blockedList, setBlockedList] = useState<any[]>([]);

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/v1/auth/me');
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated) {
          setCurrentUser(data.user);
          fetchBlocked();
        }
      }
    } catch {}
  };

  const fetchBlocked = async () => {
    try {
      const res = await fetch('/api/v1/safety/block');
      if (res.ok) {
        const data = await res.json();
        setBlockedList(data.blockedList || []);
      }
    } catch {}
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar
        currentUser={currentUser}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      <main className="flex-1 max-w-3xl mx-auto w-full p-4 sm:p-6 space-y-6">
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-600/40 border border-purple-500/50 rounded-full text-xs font-bold text-purple-300">
            <ShieldCheck size={14} className="text-emerald-400" />
            <span>BUCOLISH TRUST & SAFETY CENTER</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Safe Flatmate Finding in Gurugram
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
            Your safety and privacy are fundamental. Bucolish never publicly reveals your phone number or exact address until you mutually choose to share.
          </p>
        </div>

        {/* 4 Safety Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              icon: Lock,
              title: 'Phone Number Protection',
              desc: 'Chat freely in-app without revealing your personal contact number. Reveal it only when both flatmates click "Share Contact".',
            },
            {
              icon: ShieldCheck,
              title: 'Mandatory Phone Verification',
              desc: 'Every resident must verify their phone number with a secure OTP before swiping or messaging.',
            },
            {
              icon: AlertTriangle,
              title: 'Zero Tolerance for Scams',
              desc: 'Never transfer rental deposits or booking fees to any flatmate candidate without signing an agreement and meeting in person.',
            },
            {
              icon: EyeOff,
              title: 'Instant Block & Moderation',
              desc: 'Blocked profiles immediately vanish from your discovery deck and active chats. Reported users are reviewed within 24 hours.',
            },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-2"
              >
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Icon size={18} />
                </div>
                <h3 className="font-bold text-sm text-gray-900">{item.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Blocked Users Section */}
        {blockedList.length > 0 && (
          <div className="bg-white p-5 rounded-2xl border border-gray-200 space-y-3">
            <h3 className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
              <Ban size={16} className="text-red-500" />
              <span>Blocked Profiles ({blockedList.length})</span>
            </h3>
            <div className="space-y-2">
              {blockedList.map((b) => (
                <div
                  key={b.id}
                  className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl text-xs font-semibold text-gray-800"
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={b.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80'}
                      alt={b.name}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <span>{b.name}</span>
                  </div>
                  <span className="text-[10px] text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded-full">
                    Blocked
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <QuickUserSwitcher
        currentUserId={currentUser?.id}
        onUserSwitched={fetchUser}
      />
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={(user) => {
          setCurrentUser(user);
          fetchBlocked();
        }}
      />
    </div>
  );
}
