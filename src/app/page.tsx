'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import BucolishLogo from '@/components/brand/BucolishLogo';
import AuthModal from '@/components/auth/AuthModal';
import QuickUserSwitcher from '@/components/auth/QuickUserSwitcher';
import {
  ShieldCheck,
  Users,
  MapPin,
  Sparkles,
  ArrowRight,
  Home,
  CheckCircle2,
  Lock,
  Compass,
  Check,
  Building,
  Sliders,
  Calendar,
  Layers,
} from 'lucide-react';

export default function LandingHomePage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');

  const checkUser = async () => {
    try {
      const res = await fetch('/api/v1/auth/me');
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          setCurrentUser(data.user);
        } else {
          setCurrentUser(null);
        }
      }
    } catch {}
  };

  useEffect(() => {
    checkUser();
  }, []);

  const openAuth = (mode: 'LOGIN' | 'SIGNUP' = 'LOGIN') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-purple-600 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        onOpenAuth={openAuth}
        onLogout={() => setCurrentUser(null)}
      />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:py-24 px-4 bg-gradient-to-b from-white via-purple-50/20 to-slate-50">
        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          {/* Brand Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-purple-100/90 border border-purple-200 rounded-full text-xs font-black tracking-widest text-purple-900 uppercase shadow-xs">
            <Sparkles size={14} className="text-purple-700" />
            <span>FIND YOUR PLACE. FIND YOUR PEOPLE.</span>
          </div>

          {/* Master Headline from Poster */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-950 leading-[1.12]">
            Finding a home is easy.
            <br />
            <span className="text-purple-600">Finding the right people isn’t.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
            The next-generation co-living matching network for Gurugram. Discover verified flatmates based on the <b>Bucolish Harmony Index™</b> — evaluating sleep schedules, cleanliness habits, budget, and shared lifestyle values.
          </p>

          {/* 3 Core Value Props */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm font-extrabold text-slate-800 pt-2">
            <span className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white rounded-full border border-gray-200 shadow-xs">
              <ShieldCheck size={16} className="text-purple-600" />
              Verified Residents
            </span>
            <span className="text-gray-300 hidden sm:inline">|</span>
            <span className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white rounded-full border border-gray-200 shadow-xs">
              <Users size={16} className="text-purple-600" />
              Harmony Score Matching
            </span>
            <span className="text-gray-300 hidden sm:inline">|</span>
            <span className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white rounded-full border border-gray-200 shadow-xs">
              <MapPin size={16} className="text-purple-600" />
              Gurugram Sectors
            </span>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4 max-w-md mx-auto">
            {currentUser ? (
              <Link
                href="/discover"
                className="w-full btn-primary !py-4 text-base font-extrabold shadow-xl shadow-purple-600/30 justify-center"
              >
                <Compass size={18} />
                <span>Launch Discovery Deck</span>
                <ArrowRight size={18} />
              </Link>
            ) : (
              <>
                <button
                  onClick={() => openAuth('SIGNUP')}
                  className="w-full sm:w-auto flex-1 btn-primary !py-4 text-base font-extrabold shadow-xl shadow-purple-600/30 justify-center"
                >
                  <span>Find Your Flatmate</span>
                  <ArrowRight size={18} />
                </button>

                <button
                  onClick={() => openAuth('SIGNUP')}
                  className="w-full sm:w-auto flex-1 btn-secondary !py-4 text-base font-extrabold justify-center"
                >
                  <Home size={18} />
                  <span>List a Spare Room</span>
                </button>
              </>
            )}
          </div>

          {!currentUser && (
            <div className="text-xs text-slate-500 font-semibold pt-1">
              Already a resident?{' '}
              <button
                onClick={() => openAuth('LOGIN')}
                className="text-purple-700 font-black hover:underline"
              >
                Sign In to Bucolish
              </button>
            </div>
          )}
        </div>
      </section>

      {/* BUCOLISH 4-STAGE CO-LIVING WORKFLOW */}
      <section className="py-16 bg-white border-y border-gray-200 px-4">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-4xl font-black text-slate-950">
              The Bucolish Co-Living Model
            </h2>
            <p className="text-sm text-slate-500 max-w-lg mx-auto font-medium">
              A structured, safe, and intuitive discovery workflow engineered for working professionals and modern flats.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Set Logistics & Sectors',
                desc: 'Choose your budget range and target Gurugram sectors (DLF Phase 1-5, Golf Course Rd, Cyber City, Sector 56).',
              },
              {
                step: '02',
                title: 'Bucolish Harmony Index™',
                desc: 'Share your sleep schedule, kitchen hygiene standards, WFH frequency, and guest hosting comfort.',
              },
              {
                step: '03',
                title: 'Mutual Request & Match',
                desc: 'Review candidate harmony breakdown. Express interest or skip. A mutual connection is formed when both agree.',
              },
              {
                step: '04',
                title: 'Bucolish Shield™ Chat',
                desc: 'Chat securely with phone privacy, propose public coffee meet-ups at Cyber Hub, and share verified flat details.',
              },
            ].map((s) => (
              <div
                key={s.step}
                className="p-6 rounded-3xl bg-slate-50 border border-gray-200 hover:border-purple-300 transition-all hover:shadow-lg space-y-3"
              >
                <div className="text-3xl font-black text-purple-600/30">
                  {s.step}
                </div>
                <h3 className="font-extrabold text-slate-900 text-base">{s.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BUCOLISH HARMONY INDEX™ 6-PILLAR SYSTEM */}
      <section className="py-16 px-4 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-purple-400">
              The Science of Living Together
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              Bucolish Harmony Index™
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto font-medium">
              Our 6-pillar compatibility engine eliminates household friction before you sign the lease.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                title: 'Budget & Location Logistics (25%)',
                desc: 'Rent overlap, deposit agreement, lease duration, and target Gurugram sector proximity.',
              },
              {
                title: 'Cleanliness & Common Area Habits (20%)',
                desc: 'Kitchen hygiene, chore rota consensus, and housemaid management rota.',
              },
              {
                title: 'Sleep Schedule & Noise Tolerance (15%)',
                desc: 'Early birds vs. Night owls alignment, quiet hours, and WFH routine balance.',
              },
              {
                title: 'Social Style & Guest Policies (15%)',
                desc: 'Overnight guest comfort and weekend party hosting frequency consensus.',
              },
              {
                title: 'Values & Lifestyle Deal-breakers (15%)',
                desc: 'Smoking policies, pet friendliness, dietary preferences, and habits.',
              },
              {
                title: 'Resident Verification & Trust (10%)',
                desc: 'Phone KYC, Government ID, and Corporate workplace domain authentication.',
              },
            ].map((p, i) => (
              <div
                key={i}
                className="p-6 rounded-3xl bg-slate-800/90 border border-slate-700 hover:border-purple-500 transition-all space-y-2"
              >
                <div className="text-sm font-black text-purple-300">{p.title}</div>
                <div className="text-xs text-slate-400 leading-relaxed font-medium">{p.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 bg-white border-t border-gray-200 px-4 text-center">
        <div className="max-w-4xl mx-auto flex flex-col items-center space-y-3">
          <BucolishLogo size="md" showTagline={true} />
          <div className="text-xs text-slate-500 font-medium">
            © 2026 Bucolish Technologies Inc. Launching in Gurugram, India. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Auth Modal (Log In / Sign Up) */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authMode}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={(user) => {
          setCurrentUser(user);
          if (!user.isOnboarded) {
            router.push('/onboarding');
          } else {
            router.push('/discover');
          }
        }}
      />

      {/* Quick Demo Switcher */}
      <QuickUserSwitcher
        currentUserId={currentUser?.id}
        onUserSwitched={checkUser}
      />
    </div>
  );
}
