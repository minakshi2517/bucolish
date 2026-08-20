'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import SwipeCard from '@/components/discovery/SwipeCard';
import ProfileModal from '@/components/discovery/ProfileModal';
import FilterDrawer from '@/components/discovery/FilterDrawer';
import MatchCelebrationModal from '@/components/discovery/MatchCelebrationModal';
import StoriesBar from '@/components/discovery/StoriesBar';
import AuthModal from '@/components/auth/AuthModal';
import {
  SlidersHorizontal,
  X,
  Link2,
  Bookmark,
  RefreshCw,
  Sparkles,
  RotateCcw,
  Compass,
} from 'lucide-react';

export default function DiscoverPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [deck, setDeck] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [matchData, setMatchData] = useState<any>(null);
  const [activeStoryFilter, setActiveStoryFilter] = useState('ALL');

  // Filters State
  const [filters, setFilters] = useState({
    gender: 'ANY',
    maxBudget: 50000,
    sector: 'ALL',
    verifiedOnly: false,
  });

  const fetchCurrentUser = async () => {
    try {
      const res = await fetch('/api/v1/auth/me');
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated) {
          setCurrentUser(data.user);
          fetchDeck();
        } else {
          setAuthModalOpen(true);
          setLoading(false);
        }
      }
    } catch {
      setLoading(false);
    }
  };

  const fetchDeck = async (appliedFilters = filters) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (appliedFilters.gender !== 'ANY') params.set('gender', appliedFilters.gender);
      if (appliedFilters.maxBudget < 50000) params.set('maxBudget', appliedFilters.maxBudget.toString());
      if (appliedFilters.sector !== 'ALL') params.set('sector', appliedFilters.sector);
      if (appliedFilters.verifiedOnly) params.set('verifiedOnly', 'true');

      const res = await fetch(`/api/v1/discover?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setDeck(data.deck || []);
        setCurrentIndex(0);
      }
    } catch (err) {
      console.error('Failed to load discovery deck:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const handleStorySelect = (storyId: string) => {
    setActiveStoryFilter(storyId);
    let newFilters = { ...filters };

    if (storyId === 'ALL') {
      newFilters = { gender: 'ANY', maxBudget: 50000, sector: 'ALL', verifiedOnly: false };
    } else if (storyId === 'DLF Phase 4' || storyId === 'Cyber City' || storyId === 'Golf Course Road') {
      newFilters.sector = storyId;
    } else if (storyId === 'VERIFIED') {
      newFilters.verifiedOnly = true;
    }

    setFilters(newFilters);
    fetchDeck(newFilters);
  };

  // Keyboard Shortcuts (ArrowLeft = Pass, ArrowRight = LinkUp, Space = Details)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedProfile || filterOpen || matchData) return;
      if (e.key === 'ArrowLeft') {
        handleSwipe('PASS');
      } else if (e.key === 'ArrowRight') {
        handleSwipe('LIKE');
      } else if (e.key === 'ArrowUp') {
        handleSwipe('SUPER_LIKE');
      } else if (e.key === ' ') {
        e.preventDefault();
        if (deck[currentIndex]) {
          setSelectedProfile(deck[currentIndex]);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, deck, selectedProfile, filterOpen, matchData]);

  const handleSwipe = async (action: 'PASS' | 'LIKE' | 'SUPER_LIKE') => {
    const currentCandidate = deck[currentIndex];
    if (!currentCandidate) return;

    setCurrentIndex((prev) => prev + 1);

    try {
      const res = await fetch('/api/v1/swipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetId: currentCandidate.user.id,
          action,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.isMatch && data.match) {
          setMatchData(data.match);
        }
      }
    } catch (err) {
      console.error('Error submitting swipe:', err);
    }
  };

  const handleRewind = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const currentCard = deck[currentIndex];
  const nextCard = deck[currentIndex + 1];

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-between selection:bg-purple-600 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      {/* Curated Sector Filter Bar */}
      <div className="bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-md mx-auto">
          <StoriesBar
            activeFilter={activeStoryFilter}
            onSelectFilter={handleStorySelect}
          />
        </div>
      </div>

      {/* Discovery Canvas Container */}
      <main className="flex-1 flex flex-col items-center justify-center p-3 sm:p-4 max-w-md mx-auto w-full">
        {/* Top Control Bar */}
        <div className="w-full flex items-center justify-between mb-2 px-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
            <Compass size={14} className="text-purple-400" />
            <span>Gurugram Resident Feed</span>
          </div>

          <button
            onClick={() => setFilterOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors shadow-xs"
          >
            <SlidersHorizontal size={13} className="text-purple-400" />
            <span>Preferences</span>
          </button>
        </div>

        {/* SWIPE DECK STACK */}
        <div className="relative w-full h-[530px] sm:h-[570px]">
          {loading ? (
            <div className="w-full h-full rounded-[24px] bg-slate-800/70 border border-slate-700 flex flex-col items-center justify-center p-6 text-center space-y-3 shadow-xl backdrop-blur-md">
              <RefreshCw size={28} className="animate-spin text-purple-400" />
              <div className="text-sm font-bold text-slate-200">
                Finding compatible residents in Gurugram...
              </div>
            </div>
          ) : currentCard ? (
            <>
              {/* Background Card Preview */}
              {nextCard && (
                <div className="absolute inset-0 scale-95 translate-y-3 opacity-40 pointer-events-none rounded-[24px] overflow-hidden bg-slate-950 border border-slate-800">
                  <img
                    src={
                      nextCard.user.avatar ||
                      (nextCard.user.profile?.photos
                        ? JSON.parse(nextCard.user.profile.photos)[0]
                        : '')
                    }
                    alt="Next Candidate"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Active Swipe Card */}
              <SwipeCard
                key={currentCard.user.id}
                item={currentCard}
                onSwipe={handleSwipe}
                onOpenDetails={(item) => setSelectedProfile(item)}
              />
            </>
          ) : (
            /* EMPTY DECK STATE */
            <div className="w-full h-full rounded-[24px] bg-slate-800/80 border border-slate-700 flex flex-col items-center justify-center p-8 text-center space-y-4 shadow-xl backdrop-blur-md">
              <div className="w-14 h-14 rounded-full bg-purple-900/60 text-purple-400 flex items-center justify-center border border-purple-700">
                <Sparkles size={28} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  No More Profiles in this Sector
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
                  You have reviewed all available profiles for this filter. Reset your filters to explore more sectors across Gurugram.
                </p>
              </div>
              <button
                onClick={() => handleStorySelect('ALL')}
                className="btn-primary text-xs !py-2.5 !px-5"
              >
                <RefreshCw size={13} />
                <span>Reset Sector Filters</span>
              </button>
            </div>
          )}
        </div>

        {/* Action Controls */}
        {currentCard && !loading && (
          <div className="w-full flex items-center justify-center gap-4 mt-3">
            {/* Rewind */}
            <button
              onClick={handleRewind}
              disabled={currentIndex === 0}
              className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 shadow-md flex items-center justify-center transition-transform hover:scale-105 active:scale-95 disabled:opacity-30"
              title="Undo last profile"
            >
              <RotateCcw size={16} />
            </button>

            {/* Skip Sector (X) */}
            <button
              onClick={() => handleSwipe('PASS')}
              className="w-13 h-13 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 shadow-lg flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
              title="Skip Sector"
            >
              <X size={22} strokeWidth={2.2} />
            </button>

            {/* Priority Request */}
            <button
              onClick={() => handleSwipe('SUPER_LIKE')}
              className="w-11 h-11 rounded-full bg-slate-800 hover:bg-purple-900/60 text-purple-300 border border-purple-800/60 shadow-md flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
              title="Priority LinkUp Request"
            >
              <Bookmark size={18} />
            </button>

            {/* LinkUp (Link2) */}
            <button
              onClick={() => handleSwipe('LIKE')}
              className="w-13 h-13 rounded-full bg-purple-600 hover:bg-purple-500 text-white shadow-xl shadow-purple-600/30 flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
              title="LinkUp with Resident"
            >
              <Link2 size={22} strokeWidth={2.4} />
            </button>
          </div>
        )}
      </main>

      {/* Profile Details Sheet */}
      {selectedProfile && (
        <ProfileModal
          item={selectedProfile}
          onClose={() => setSelectedProfile(null)}
          onSwipe={(action) => {
            handleSwipe(action);
            setSelectedProfile(null);
          }}
        />
      )}

      {/* Filter Drawer */}
      <FilterDrawer
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        onApplyFilters={(newFilters) => {
          setFilters(newFilters);
          fetchDeck(newFilters);
        }}
      />

      {/* MatchBox Celebration Screen */}
      <MatchCelebrationModal
        isOpen={!!matchData}
        matchData={matchData}
        currentUser={currentUser}
        onClose={() => setMatchData(null)}
      />

      {/* Real Phone Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={(user) => {
          setCurrentUser(user);
          fetchDeck();
        }}
      />
    </div>
  );
}
