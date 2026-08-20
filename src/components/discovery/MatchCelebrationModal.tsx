'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, MessageCircle, X, ArrowRight, Link2 } from 'lucide-react';

interface MatchCelebrationModalProps {
  isOpen: boolean;
  matchData: any;
  currentUser: any;
  onClose: () => void;
}

export default function MatchCelebrationModal({
  isOpen,
  matchData,
  currentUser,
  onClose,
}: MatchCelebrationModalProps) {
  const router = useRouter();

  if (!isOpen || !matchData) return null;

  const { targetUser, compatibilityScore } = matchData;

  const handleStartChat = () => {
    onClose();
    router.push('/matches');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-slate-900 rounded-[32px] border border-purple-500/40 p-6 sm:p-8 max-w-sm w-full text-center relative shadow-2xl overflow-hidden text-white space-y-6">
        {/* Glow Background effect */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-purple-600/30 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-full bg-slate-800"
        >
          <X size={18} />
        </button>

        {/* Top Tag */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-950 text-purple-300 rounded-full text-xs font-black uppercase tracking-wider border border-purple-800">
          <Link2 size={13} className="text-purple-400" />
          <span>Bucolish MatchBox</span>
        </div>

        {/* Overlapping User Avatars */}
        <div className="flex items-center justify-center -space-x-4 pt-2">
          <div className="relative">
            <img
              src={
                currentUser?.avatar ||
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
              }
              alt="You"
              className="w-20 h-20 rounded-full object-cover border-4 border-slate-900 shadow-xl"
            />
          </div>

          <div className="relative z-10">
            <img
              src={
                targetUser?.avatar ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
              }
              alt={targetUser?.name}
              className="w-20 h-20 rounded-full object-cover border-4 border-purple-500 shadow-2xl scale-110"
            />
          </div>
        </div>

        {/* Headline & Harmony Index Score */}
        <div className="space-y-1.5">
          <h2 className="text-2xl font-black text-white">
            It's a LinkUp!
          </h2>
          <div className="text-xs text-purple-300 font-bold">
            {compatibilityScore || 88}% Bucolish Harmony Score
          </div>
          <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
            You and <span className="text-white font-bold">{targetUser?.name}</span> both mutually approved each other's living budget, schedule, and Gurugram sector.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <button
            onClick={handleStartChat}
            className="w-full btn-primary !py-3.5 text-sm font-black justify-center shadow-xl shadow-purple-600/40"
          >
            <MessageCircle size={16} />
            <span>Open MatchBox Chat</span>
            <ArrowRight size={16} />
          </button>

          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-full text-xs font-bold text-slate-400 hover:text-white"
          >
            Keep Exploring Deck
          </button>
        </div>
      </div>
    </div>
  );
}
