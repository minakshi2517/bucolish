'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import QuickUserSwitcher from '@/components/auth/QuickUserSwitcher';
import AuthModal from '@/components/auth/AuthModal';
import {
  ShieldCheck,
  Briefcase,
  MapPin,
  Sparkles,
  LogOut,
  Trash2,
  CheckCircle2,
  Home,
  Check,
  Upload,
  User,
  Sliders,
  ChevronRight,
  Edit3,
  X,
  Save,
  Plus,
} from 'lucide-react';

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
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
];

export default function ProfilePage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [activeTab, setActiveTab] = useState<'PROFILE' | 'VERIFICATION' | 'SETTINGS'>('PROFILE');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Edit Form State
  const [editName, setEditName] = useState('');
  const [editAge, setEditAge] = useState(25);
  const [editOccupation, setEditOccupation] = useState('');
  const [editCompany, setEditCompany] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editPromptQuestion, setEditPromptQuestion] = useState('My ideal Sunday in Gurugram is...');
  const [editPromptAnswer, setEditPromptAnswer] = useState('');
  const [editBudgetMin, setEditBudgetMin] = useState(15000);
  const [editBudgetMax, setEditBudgetMax] = useState(30000);
  const [editLocations, setEditLocations] = useState<string[]>([]);
  const [editAvatar, setEditAvatar] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/v1/auth/me');
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated) {
          setCurrentUser(data.user);
          populateEditForm(data.user);
        } else {
          setAuthModalOpen(true);
        }
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const populateEditForm = (user: any) => {
    setEditName(user.name || '');
    setEditAge(user.profile?.age || 25);
    setEditOccupation(user.profile?.occupation || '');
    setEditCompany(user.profile?.company || '');
    setEditBio(user.profile?.bio || '');
    setEditPromptQuestion(user.profile?.promptQuestion || 'My ideal Sunday in Gurugram is...');
    setEditPromptAnswer(user.profile?.promptAnswer || '');
    setEditBudgetMin(user.profile?.budgetMin || 15000);
    setEditBudgetMax(user.profile?.budgetMax || 30000);
    setEditAvatar(user.avatar || DEFAULT_AVATARS[0]);

    try {
      const locs = JSON.parse(user.profile?.preferredLocations || '[]');
      setEditLocations(locs.length > 0 ? locs : ['DLF Phase 4']);
    } catch {
      setEditLocations(['DLF Phase 4']);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await fetch('/api/v1/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editName,
          age: editAge,
          occupation: editOccupation,
          company: editCompany,
          bio: editBio,
          promptQuestion: editPromptQuestion,
          promptAnswer: editPromptAnswer,
          photos: [editAvatar],
          budgetMin: editBudgetMin,
          budgetMax: editBudgetMax,
          preferredLocations: editLocations,
        }),
      });

      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
        setEditModalOpen(false);
        fetchUser();
      }
    } catch (err) {
      console.error('Failed to save profile:', err);
    } finally {
      setSavingProfile(false);
    }
  };

  const toggleLocation = (loc: string) => {
    if (editLocations.includes(loc)) {
      setEditLocations(editLocations.filter((l) => l !== loc));
    } else {
      setEditLocations([...editLocations, loc]);
    }
  };

  const handleVerify = async (type: 'ID' | 'WORK') => {
    setVerifying(true);
    try {
      const res = await fetch('/api/v1/verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          docType: type === 'ID' ? 'AADHAAR' : undefined,
          workEmail:
            type === 'WORK'
              ? `${currentUser?.name?.toLowerCase().replace(/\s+/g, '')}@corporate.com`
              : undefined,
        }),
      });
      if (res.ok) {
        fetchUser();
      }
    } catch (err) {
      console.error('Verification error:', err);
    } finally {
      setVerifying(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/v1/auth/me', { method: 'DELETE' });
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-sm font-bold text-gray-500">
        Loading Profile...
      </div>
    );
  }

  let tags: string[] = [];
  try {
    tags = JSON.parse(currentUser?.lifestyleAnswers?.summaryTags || '[]');
  } catch {}

  let locations: string[] = [];
  try {
    locations = JSON.parse(currentUser?.profile?.preferredLocations || '[]');
  } catch {}

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar
        currentUser={currentUser}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      <main className="flex-1 max-w-3xl mx-auto w-full p-4 sm:p-6 space-y-6">
        {/* Success Alert Banner */}
        {saveSuccess && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-bold text-emerald-800 flex items-center gap-2 animate-in fade-in duration-200">
            <CheckCircle2 size={16} className="text-emerald-600" />
            <span>Profile and lifestyle details updated successfully!</span>
          </div>
        )}

        {/* Profile Card Header */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200 flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left relative">
          <img
            src={
              currentUser?.avatar ||
              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'
            }
            alt={currentUser?.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-purple-100 shadow-md"
          />

          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h1 className="text-2xl font-black text-gray-900">
                  {currentUser?.name || 'Resident'}, {currentUser?.profile?.age || 25}
                </h1>
                <div className="text-xs text-gray-500 font-medium mt-0.5">
                  {currentUser?.phone}
                </div>
              </div>

              {currentUser?.verification?.overallStatus === 'VERIFIED' ? (
                <div className="badge-verified self-center sm:self-auto">
                  <ShieldCheck size={14} />
                  <span>Verified Resident</span>
                </div>
              ) : (
                <div className="px-3 py-1 bg-amber-50 text-amber-800 rounded-full text-xs font-bold border border-amber-200 self-center sm:self-auto">
                  KYC Pending
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-3 text-xs text-gray-600 font-semibold">
              <span className="flex items-center gap-1">
                <Briefcase size={13} className="text-purple-600" />
                {currentUser?.profile?.occupation || 'Professional'} (
                {currentUser?.profile?.company || 'Gurugram'})
              </span>
              <span className="flex items-center gap-1">
                <MapPin size={13} className="text-purple-600" />
                {locations[0] || 'Gurugram'}
              </span>
            </div>
          </div>

          {/* Edit Profile Button */}
          <button
            onClick={() => setEditModalOpen(true)}
            className="sm:absolute sm:top-6 sm:right-6 btn-secondary text-xs !py-2 !px-3.5 flex items-center gap-1.5 shadow-xs"
          >
            <Edit3 size={14} />
            <span>Edit Profile</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-white p-1 rounded-2xl border border-gray-200 shadow-xs">
          {[
            { id: 'PROFILE', label: 'My Bio & Housing' },
            { id: 'VERIFICATION', label: 'Verification & KYC' },
            { id: 'SETTINGS', label: 'Account & Safety' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: PROFILE & LIFESTYLE */}
        {activeTab === 'PROFILE' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Bio Card */}
            <div className="bg-white rounded-2xl p-5 border border-gray-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Bio & Personality
                </div>
                <button
                  onClick={() => setEditModalOpen(true)}
                  className="text-xs font-bold text-purple-600 hover:underline flex items-center gap-1"
                >
                  <Edit3 size={12} /> Edit Bio
                </button>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed font-medium">
                "{currentUser?.profile?.bio || 'Add a short bio to let flatmates know about your living habits and hobbies.'}"
              </p>
            </div>

            {/* Prompt Card */}
            {currentUser?.profile?.promptQuestion && (
              <div className="bg-purple-50/70 rounded-2xl p-5 border border-purple-100 space-y-1">
                <div className="text-xs font-extrabold text-purple-900 uppercase tracking-wider">
                  {currentUser.profile.promptQuestion}
                </div>
                <div className="text-sm font-semibold text-purple-950">
                  "{currentUser.profile.promptAnswer || 'Add your answer to break the ice with potential flatmates!'}"
                </div>
              </div>
            )}

            {/* Lifestyle Summary Tags */}
            <div className="bg-white rounded-2xl p-5 border border-gray-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Lifestyle Traits
                </div>
                <button
                  onClick={() => router.push('/quiz')}
                  className="text-xs font-bold text-purple-600 hover:underline"
                >
                  Retake 6-Pillar Quiz
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-800 border border-purple-100"
                  >
                    • {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Budget & Locations */}
            <div className="bg-white rounded-2xl p-5 border border-gray-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Housing Budget & Locations
                </div>
                <button
                  onClick={() => setEditModalOpen(true)}
                  className="text-xs font-bold text-purple-600 hover:underline"
                >
                  Change
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 bg-gray-50 rounded-xl">
                  <div className="text-[11px] text-gray-500 font-semibold">Monthly Budget</div>
                  <div className="text-sm font-extrabold text-gray-900">
                    ₹{(currentUser?.profile?.budgetMin || 15000).toLocaleString()} – ₹
                    {(currentUser?.profile?.budgetMax || 30000).toLocaleString()} / mo
                  </div>
                </div>

                <div className="p-3.5 bg-gray-50 rounded-xl">
                  <div className="text-[11px] text-gray-500 font-semibold">Preferred Sectors</div>
                  <div className="text-xs font-bold text-gray-900 truncate">
                    {locations.join(', ') || 'DLF Phase 4, Cyber City'}
                  </div>
                </div>
              </div>
            </div>

            {/* Flat details if user has flat */}
            {currentUser?.housingProfile && (
              <div className="bg-white rounded-2xl p-5 border border-gray-200 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-purple-700">
                  <Home size={14} />
                  <span>My Listed Flat ({currentUser.housingProfile.flatType})</span>
                </div>
                <div className="text-sm font-bold text-gray-900">
                  {currentUser.housingProfile.title}
                </div>
                <div className="text-xs text-gray-600 font-medium">
                  ₹{currentUser.housingProfile.rent.toLocaleString()} / mo · {currentUser.housingProfile.sector}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: VERIFICATION */}
        {activeTab === 'VERIFICATION' && (
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-lg font-black text-gray-900">
                Verification & Trust Badges
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Verified flatmates get 4x more mutual connections and boost their compatibility trust score.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-gray-900">Phone Verification</div>
                <div className="text-xs text-gray-500">{currentUser?.phone}</div>
              </div>
              <div className="badge-verified">
                <Check size={12} />
                <span>Verified</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-gray-900">Government ID KYC</div>
                <div className="text-xs text-gray-500">Aadhaar or Passport Verification</div>
              </div>

              {currentUser?.verification?.idVerified === 'VERIFIED' ? (
                <div className="badge-verified">
                  <Check size={12} />
                  <span>Verified</span>
                </div>
              ) : (
                <button
                  onClick={() => handleVerify('ID')}
                  disabled={verifying}
                  className="btn-primary text-xs !py-1.5 !px-3"
                >
                  <Upload size={12} />
                  <span>Verify ID</span>
                </button>
              )}
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-gray-900">Corporate Workplace Check</div>
                <div className="text-xs text-gray-500">Work email domain verification</div>
              </div>

              {currentUser?.verification?.workVerified === 'VERIFIED' ? (
                <div className="badge-verified">
                  <Check size={12} />
                  <span>Verified</span>
                </div>
              ) : (
                <button
                  onClick={() => handleVerify('WORK')}
                  disabled={verifying}
                  className="btn-primary text-xs !py-1.5 !px-3"
                >
                  <Upload size={12} />
                  <span>Verify Work</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: SETTINGS */}
        {activeTab === 'SETTINGS' && (
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4 animate-in fade-in duration-200">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Account Management
            </div>

            <button
              onClick={() => router.push('/safety')}
              className="w-full flex items-center justify-between p-3.5 rounded-xl hover:bg-gray-50 border border-gray-100 text-left font-bold text-xs text-gray-800"
            >
              <span>Safety Guidelines & Privacy Center</span>
              <ChevronRight size={14} className="text-gray-400" />
            </button>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-between p-3.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-left font-bold text-xs text-gray-800 transition-colors"
            >
              <span className="flex items-center gap-2">
                <LogOut size={14} className="text-gray-600" />
                Sign Out of Bucolish
              </span>
            </button>

            <button
              onClick={() => {
                if (confirm('Are you sure you want to delete your Bucolish profile and matches?')) {
                  handleLogout();
                }
              }}
              className="w-full flex items-center justify-between p-3.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-left font-bold text-xs text-rose-700 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Trash2 size={14} className="text-rose-600" />
                Delete Account
              </span>
            </button>
          </div>
        )}
      </main>

      {/* EDIT PROFILE MODAL */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative border border-gray-100">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
              <div className="flex items-center gap-2 text-gray-900 font-extrabold text-base">
                <Edit3 size={18} className="text-purple-600" />
                <span>Edit Profile & Bio</span>
              </div>
              <button
                onClick={() => setEditModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              {/* Avatar Selector */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">
                  Profile Photo
                </label>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {DEFAULT_AVATARS.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt="avatar"
                      onClick={() => setEditAvatar(img)}
                      className={`w-14 h-14 rounded-2xl object-cover cursor-pointer border-2 transition-all shrink-0 ${
                        editAvatar === img
                          ? 'border-purple-600 ring-2 ring-purple-500/30 scale-105'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Name & Age */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-600 focus:outline-none text-xs font-semibold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    value={editAge}
                    onChange={(e) => setEditAge(parseInt(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-600 focus:outline-none text-xs font-semibold"
                    min={18}
                    max={65}
                  />
                </div>
              </div>

              {/* Occupation & Company */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Occupation
                  </label>
                  <input
                    type="text"
                    value={editOccupation}
                    onChange={(e) => setEditOccupation(e.target.value)}
                    placeholder="e.g. Product Designer"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-600 focus:outline-none text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Company
                  </label>
                  <input
                    type="text"
                    value={editCompany}
                    onChange={(e) => setEditCompany(e.target.value)}
                    placeholder="e.g. Google / Zomato"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-600 focus:outline-none text-xs font-semibold"
                  />
                </div>
              </div>

              {/* Bio Field */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Short Bio (Personality & Living Style)
                </label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="Tell potential flatmates how you live, your hobbies, and what you value at home..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-600 focus:outline-none text-xs font-medium"
                />
              </div>

              {/* Prompt Question & Answer */}
              <div className="p-4 bg-purple-50/80 rounded-2xl border border-purple-100 space-y-2">
                <label className="block text-xs font-bold text-purple-950">
                  Icebreaker Prompt
                </label>
                <select
                  value={editPromptQuestion}
                  onChange={(e) => setEditPromptQuestion(e.target.value)}
                  className="w-full p-2 bg-white rounded-xl border border-purple-200 text-xs font-bold text-purple-900"
                >
                  <option value="My ideal Sunday in Gurugram is...">
                    My ideal Sunday in Gurugram is...
                  </option>
                  <option value="My flatmate non-negotiable is...">
                    My flatmate non-negotiable is...
                  </option>
                  <option value="I am usually...">I am usually...</option>
                  <option value="The key to a peaceful home is...">
                    The key to a peaceful home is...
                  </option>
                </select>
                <input
                  type="text"
                  value={editPromptAnswer}
                  onChange={(e) => setEditPromptAnswer(e.target.value)}
                  placeholder="Your answer..."
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-purple-200 focus:ring-2 focus:ring-purple-600 focus:outline-none text-xs font-medium"
                />
              </div>

              {/* Budget Range */}
              <div>
                <div className="flex justify-between text-xs font-bold text-gray-700 mb-1">
                  <span>Monthly Budget Range</span>
                  <span className="text-purple-600 font-extrabold">
                    ₹{editBudgetMin.toLocaleString()} – ₹{editBudgetMax.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min={10000}
                  max={50000}
                  step={1000}
                  value={editBudgetMax}
                  onChange={(e) => setEditBudgetMax(parseInt(e.target.value))}
                  className="w-full accent-purple-600 cursor-pointer"
                />
              </div>

              {/* Gurugram Sectors */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Preferred Gurugram Sectors
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
                  {GURUGRAM_SECTORS.map((s) => {
                    const active = editLocations.includes(s);
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => toggleLocation(s)}
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                          active
                            ? 'bg-purple-600 text-white shadow-xs'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2.5 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="btn-outline text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="btn-primary text-xs !py-2.5 !px-5"
                >
                  <Save size={14} />
                  <span>{savingProfile ? 'Saving...' : 'Save Profile Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <QuickUserSwitcher
        currentUserId={currentUser?.id}
        onUserSwitched={fetchUser}
      />
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => router.push('/')}
        onSuccess={(user) => {
          setCurrentUser(user);
          setAuthModalOpen(false);
        }}
      />
    </div>
  );
}
