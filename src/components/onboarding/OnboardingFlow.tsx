'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import BucolishLogo from '../brand/BucolishLogo';
import {
  Home,
  Users,
  Search,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Building,
  Bed,
  Check,
  ShieldCheck,
  MapPin,
} from 'lucide-react';

interface OnboardingFlowProps {
  initialUser: any;
  onComplete: () => void;
}

const GURUGRAM_SECTORS = [
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

const DEFAULT_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
];

export default function OnboardingFlow({ initialUser, onComplete }: OnboardingFlowProps) {
  const router = useRouter();
  const [step, setStep] = useState(0); // 0: Purpose, 1: Basics, 2: Budget & Sectors, 3: Harmony Habits
  const [loading, setLoading] = useState(false);

  // STEP 0: Housing Purpose / Intent
  const [intent, setIntent] = useState<string>(
    initialUser?.intent || 'NEED_FLAT_AND_FLATMATE'
  );

  // STEP 1: Basic Info
  const [name, setName] = useState(initialUser?.name || '');
  const [age, setAge] = useState(initialUser?.profile?.age || 24);
  const [gender, setGender] = useState(initialUser?.profile?.gender || 'MALE');
  const [occupation, setOccupation] = useState(initialUser?.profile?.occupation || '');
  const [company, setCompany] = useState(initialUser?.profile?.company || '');
  const [selectedPhoto, setSelectedPhoto] = useState(
    initialUser?.profile?.photos ? JSON.parse(initialUser.profile.photos)[0] : DEFAULT_AVATARS[0]
  );
  const [bio, setBio] = useState('');

  // STEP 2: Location & Budget Requirements
  const [budgetMin, setBudgetMin] = useState(15000);
  const [budgetMax, setBudgetMax] = useState(30000);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([
    'DLF Phase 4',
    'Cyber City',
  ]);

  // Flat Details (If intent === 'HAVE_FLAT_NEED_FLATMATE')
  const [flatTitle, setFlatTitle] = useState('');
  const [flatRent, setFlatRent] = useState(24000);
  const [flatDeposit, setFlatDeposit] = useState(48000);
  const [flatSector, setFlatSector] = useState('DLF Phase 4');
  const [flatType, setFlatType] = useState('2BHK');

  // STEP 3: Bucolish Harmony Living Habits
  const [cleanlinessLevel, setCleanlinessLevel] = useState(4); // 1-5
  const [sleepSchedule, setSleepSchedule] = useState('Early bird (10pm - 6am)');
  const [workArrangement, setWorkArrangement] = useState('Hybrid');
  const [guestComfort, setGuestComfort] = useState('Weekends only');
  const [smokingPreference, setSmokingPreference] = useState('Strict non-smoker');
  const [petPreference, setPetPreference] = useState('Loves pets');

  const toggleLocation = (loc: string) => {
    if (selectedLocations.includes(loc)) {
      if (selectedLocations.length > 1) {
        setSelectedLocations(selectedLocations.filter((l) => l !== loc));
      }
    } else {
      setSelectedLocations([...selectedLocations, loc]);
    }
  };

  const handleFinishOnboarding = async () => {
    setLoading(true);
    try {
      // 1. Save Profile & Housing Data
      const profilePayload: any = {
        name: name.trim() || 'Resident',
        intent,
        age,
        gender,
        occupation: occupation.trim() || 'Working Professional',
        company: company.trim() || 'Gurugram',
        bio: bio.trim() || 'Looking for compatible flatmates in Gurugram.',
        promptQuestion: 'My ideal Sunday in Gurugram is...',
        promptAnswer: 'Exploring cafes and relaxing in a clean home.',
        photos: [selectedPhoto],
        budgetMin,
        budgetMax,
        preferredCity: 'Gurugram',
        preferredLocations: selectedLocations,
      };

      if (intent === 'HAVE_FLAT_NEED_FLATMATE') {
        profilePayload.housing = {
          title: flatTitle.trim() || `${flatType} Room in ${flatSector}`,
          description: bio.trim() || 'Spacious room in Gurugram.',
          photos: [
            'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
          ],
          city: 'Gurugram',
          sector: flatSector,
          rent: flatRent,
          deposit: flatDeposit,
          flatType,
          furnishing: 'Semi Furnished',
          availableRoom: 'Private Room',
          totalFlatmates: 2,
          availableFrom: new Date(),
          amenities: ['High-speed WiFi', 'AC', 'Power Backup', 'Daily Maid'],
        };
      }

      await fetch('/api/v1/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profilePayload),
      });

      // 2. Save Harmony Living Quiz Habits
      await fetch('/api/v1/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cleanlinessLevel,
          sleepSchedule,
          workArrangement,
          guestComfort,
          smokingPreference,
          petPreference,
        }),
      });

      // 3. Immediately redirect to live Explore Deck
      router.push('/discover');
      if (onComplete) onComplete();
    } catch (err) {
      console.error('Failed to complete onboarding:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between py-6 sm:py-10 px-4 text-slate-900">
      <div className="max-w-xl mx-auto w-full bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-gray-100">
        {/* Top Header with Instagram-style Step Indicator */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
          <BucolishLogo size="sm" showTagline={false} />
          <div className="flex items-center gap-1.5">
            {[0, 1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all duration-300 ${
                  step === s
                    ? 'w-8 bg-purple-600'
                    : step > s
                    ? 'w-3 bg-purple-300'
                    : 'w-3 bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* STEP 0: HOUSING PURPOSE / INTENT */}
        {step === 0 && (
          <div className="animate-in fade-in duration-200 space-y-6">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-purple-600">
                Step 1 of 4 · Housing Purpose
              </span>
              <h2 className="text-2xl font-black text-slate-950 mt-1">
                What are you looking for on Bucolish?
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Select your current housing status so we can accurately match your deck.
              </p>
            </div>

            <div className="space-y-3">
              {[
                {
                  id: 'HAVE_FLAT_NEED_FLATMATE',
                  title: 'I have a flat & need a roommate',
                  desc: 'I already have a flat in Gurugram and have a spare room to rent out.',
                  icon: Home,
                },
                {
                  id: 'NEED_FLAT_AND_FLATMATE',
                  title: 'I need a flat & a flatmate',
                  desc: 'Looking for a flatmate to search and lease a new 2BHK/3BHK together.',
                  icon: Search,
                },
                {
                  id: 'NEED_ROOM_ONLY',
                  title: 'I only need a private room',
                  desc: 'Looking to move into a pre-occupied flat with existing flatmates.',
                  icon: Bed,
                },
              ].map((item) => {
                const Icon = item.icon;
                const selected = intent === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setIntent(item.id)}
                    className={`w-full p-4 rounded-2xl text-left border-2 transition-all flex items-start gap-4 ${
                      selected
                        ? 'border-purple-600 bg-purple-50/60 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div
                      className={`p-3 rounded-xl shrink-0 ${
                        selected ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <Icon size={22} />
                    </div>
                    <div>
                      <div className="font-extrabold text-slate-950 text-sm">
                        {item.title}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5 leading-relaxed font-medium">
                        {item.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setStep(1)}
              className="w-full btn-primary !py-3.5 !rounded-xl text-sm font-black justify-center shadow-lg"
            >
              <span>Continue to Profile Setup</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* STEP 1: PERSONAL DETAILS & PHOTO */}
        {step === 1 && (
          <div className="animate-in fade-in duration-200 space-y-6">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-purple-600">
                Step 2 of 4 · Resident Profile
              </span>
              <h2 className="text-2xl font-black text-slate-950 mt-1">
                Tell us about yourself
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Your profile picture and professional background build initial trust.
              </p>
            </div>

            {/* Avatar Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-2">
                Choose Profile Photo
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                {DEFAULT_AVATARS.map((imgUrl, i) => (
                  <img
                    key={i}
                    src={imgUrl}
                    alt="avatar option"
                    onClick={() => setSelectedPhoto(imgUrl)}
                    className={`w-full h-16 rounded-2xl object-cover cursor-pointer border-2 transition-all ${
                      selectedPhoto === imgUrl
                        ? 'border-purple-600 ring-2 ring-purple-600/30 scale-105'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-950 placeholder:text-slate-400 focus:ring-2 focus:ring-purple-600 focus:outline-none text-xs font-bold shadow-inner"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">
                  Age <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(parseInt(e.target.value) || 20)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-950 focus:ring-2 focus:ring-purple-600 focus:outline-none text-xs font-bold shadow-inner"
                  min={18}
                  max={60}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-950 focus:ring-2 focus:ring-purple-600 focus:outline-none text-xs font-bold shadow-inner"
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="NON_BINARY">Non-Binary</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">
                  Occupation / Role
                </label>
                <input
                  type="text"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  placeholder="e.g. Software Engineer / Consultant"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-950 placeholder:text-slate-400 focus:ring-2 focus:ring-purple-600 focus:outline-none text-xs font-bold shadow-inner"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1">
                Company / Organization
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Google / Zomato / Deloitte"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-950 placeholder:text-slate-400 focus:ring-2 focus:ring-purple-600 focus:outline-none text-xs font-bold shadow-inner"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1">
                Short Bio (Your Personality & Vibe)
              </label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell potential flatmates how you live, your hobbies, and living habits..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-950 placeholder:text-slate-400 focus:ring-2 focus:ring-purple-600 focus:outline-none text-xs font-medium shadow-inner"
              />
            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(0)}
                className="btn-outline text-xs"
              >
                <ArrowLeft size={14} /> Back
              </button>
              <button
                type="button"
                disabled={!name.trim()}
                onClick={() => setStep(2)}
                className="btn-primary text-xs font-bold disabled:opacity-40"
              >
                Next: Budget & Sectors <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: BUDGET & GURUGRAM SECTORS */}
        {step === 2 && (
          <div className="animate-in fade-in duration-200 space-y-6">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-purple-600">
                Step 3 of 4 · Gurugram Logistics
              </span>
              <h2 className="text-2xl font-black text-slate-950 mt-1">
                {intent === 'HAVE_FLAT_NEED_FLATMATE'
                  ? 'Your Listed Flat Details'
                  : 'Budget & Preferred Sectors'}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Specify your rent ceiling and the areas in Gurugram you want to live in.
              </p>
            </div>

            {intent === 'HAVE_FLAT_NEED_FLATMATE' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1">
                    Flat Listing Headline
                  </label>
                  <input
                    type="text"
                    value={flatTitle}
                    onChange={(e) => setFlatTitle(e.target.value)}
                    placeholder="e.g. Spacious Master Bedroom in DLF Phase 4"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-950 placeholder:text-slate-400 focus:ring-2 focus:ring-purple-600 focus:outline-none text-xs font-bold shadow-inner"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-900 mb-1">
                      Monthly Rent (₹)
                    </label>
                    <input
                      type="number"
                      value={flatRent}
                      onChange={(e) => setFlatRent(parseInt(e.target.value) || 0)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-950 focus:ring-2 focus:ring-purple-600 focus:outline-none text-xs font-bold shadow-inner"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-900 mb-1">
                      Security Deposit (₹)
                    </label>
                    <input
                      type="number"
                      value={flatDeposit}
                      onChange={(e) => setFlatDeposit(parseInt(e.target.value) || 0)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-950 focus:ring-2 focus:ring-purple-600 focus:outline-none text-xs font-bold shadow-inner"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-900 mb-1">
                      Sector / Area
                    </label>
                    <select
                      value={flatSector}
                      onChange={(e) => setFlatSector(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-950 focus:ring-2 focus:ring-purple-600 focus:outline-none text-xs font-bold shadow-inner"
                    >
                      {GURUGRAM_SECTORS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-900 mb-1">
                      Flat Configuration
                    </label>
                    <select
                      value={flatType}
                      onChange={(e) => setFlatType(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-950 focus:ring-2 focus:ring-purple-600 focus:outline-none text-xs font-bold shadow-inner"
                    >
                      <option value="2BHK">2 BHK</option>
                      <option value="3BHK">3 BHK</option>
                      <option value="4BHK">4 BHK</option>
                      <option value="Studio">Studio / 1BHK</option>
                    </select>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-900 mb-2">
                    <span>Monthly Budget Range</span>
                    <span className="text-purple-600 font-black text-sm">
                      ₹{budgetMin.toLocaleString()} – ₹{budgetMax.toLocaleString()} / mo
                    </span>
                  </div>
                  <input
                    type="range"
                    min={10000}
                    max={50000}
                    step={1000}
                    value={budgetMax}
                    onChange={(e) => setBudgetMax(parseInt(e.target.value))}
                    className="w-full accent-purple-600 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-2">
                    Select Target Gurugram Sectors
                  </label>
                  <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto">
                    {GURUGRAM_SECTORS.map((loc) => {
                      const active = selectedLocations.includes(loc);
                      return (
                        <button
                          key={loc}
                          type="button"
                          onClick={() => toggleLocation(loc)}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                            active
                              ? 'bg-purple-600 text-white shadow-sm'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {loc}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="btn-outline text-xs"
              >
                <ArrowLeft size={14} /> Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="btn-primary text-xs font-bold"
              >
                Next: Harmony Living Habits <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: BUCOLISH HARMONY INDEX™ (INSTANT LIVING HABITS QUIZ) */}
        {step === 3 && (
          <div className="animate-in fade-in duration-200 space-y-5">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-purple-600">
                Step 4 of 4 · Bucolish Harmony Index™
              </span>
              <h2 className="text-2xl font-black text-slate-950 mt-1">
                Your Living Habits & Rules
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                This powers our mathematical compatibility engine so you match with harmonious flatmates.
              </p>
            </div>

            {/* Q1: Cleanliness */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-900">
                1. Cleanliness & Kitchen Standard
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Spick & Span', val: 5 },
                  { label: 'Moderate', val: 3 },
                  { label: 'Relaxed', val: 1 },
                ].map((opt) => (
                  <button
                    key={opt.val}
                    type="button"
                    onClick={() => setCleanlinessLevel(opt.val)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      cleanlinessLevel === opt.val
                        ? 'border-purple-600 bg-purple-50 text-purple-900 shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Q2: Sleep Schedule */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-900">
                2. Sleep & Wake Schedule
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  'Early bird (10pm - 6am)',
                  'Night owl (1am - 9am)',
                ].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSleepSchedule(s)}
                    className={`p-2 rounded-xl text-xs font-bold border text-left transition-all ${
                      sleepSchedule === s
                        ? 'border-purple-600 bg-purple-50 text-purple-900 shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Q3: WFH & Work Routine */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-900">
                3. Work Routine
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['Daily Office', 'Hybrid', '100% WFH'].map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => setWorkArrangement(w)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      workArrangement === w
                        ? 'border-purple-600 bg-purple-50 text-purple-900 shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>

            {/* Q4: Guests & Parties */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-900">
                4. Guest Comfort Policy
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  'Weekends only',
                  'Quiet home (No overnight)',
                ].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGuestComfort(g)}
                    className={`p-2 rounded-xl text-xs font-bold border text-left transition-all ${
                      guestComfort === g
                        ? 'border-purple-600 bg-purple-50 text-purple-900 shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Q5: Smoking */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-900">
                5. Smoking Policy
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  'Strict non-smoker',
                  'Balcony smoker',
                ].map((smk) => (
                  <button
                    key={smk}
                    type="button"
                    onClick={() => setSmokingPreference(smk)}
                    className={`p-2 rounded-xl text-xs font-bold border text-left transition-all ${
                      smokingPreference === smk
                        ? 'border-purple-600 bg-purple-50 text-purple-900 shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {smk}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="btn-outline text-xs"
              >
                <ArrowLeft size={14} /> Back
              </button>
              <button
                type="button"
                onClick={handleFinishOnboarding}
                disabled={loading}
                className="btn-primary text-xs !py-3 !px-6 font-black shadow-xl shadow-purple-600/30"
              >
                {loading ? 'Creating Profile...' : 'Complete & Launch Deck'}
                <Sparkles size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
