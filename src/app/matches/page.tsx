'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import ChatWindow from '@/components/chat/ChatWindow';
import AuthModal from '@/components/auth/AuthModal';
import {
  Sparkles,
  Users,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  Search,
  MessageSquare,
  Link2,
} from 'lucide-react';

export default function MatchBoxPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [newMatches, setNewMatches] = useState<any[]>([]);
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchMatches = async () => {
    try {
      const res = await fetch('/api/v1/matches');
      if (res.ok) {
        const data = await res.json();
        setNewMatches(data.newMatches || []);
        setConversations(data.conversations || []);

        if (!selectedConversationId && data.conversations?.length > 0 && window.innerWidth >= 768) {
          setSelectedConversationId(data.conversations[0].conversationId);
        }
      }
    } catch (err) {
      console.error('Failed to load MatchBox:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const res = await fetch('/api/v1/auth/me');
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated) {
          setCurrentUser(data.user);
          fetchMatches();
        } else {
          setAuthModalOpen(true);
        }
      }
    } catch {}
  };

  useEffect(() => {
    fetchCurrentUser();
    const interval = setInterval(fetchMatches, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredConversations = conversations.filter((c) =>
    c.user.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-between selection:bg-purple-600 selection:text-white">
      <Navbar
        currentUser={currentUser}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      <main className="flex-1 max-w-6xl mx-auto w-full p-3 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 h-[calc(100vh-5rem)]">
        {/* Left Column: MatchBox Feed */}
        <div
          className={`md:col-span-5 bg-slate-950 rounded-3xl border border-slate-800 shadow-2xl p-4 overflow-y-auto flex flex-col ${
            selectedConversationId ? 'hidden md:flex' : 'flex'
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-purple-950 text-purple-400 flex items-center justify-center border border-purple-800">
                <Link2 size={16} />
              </div>
              <h2 className="text-lg font-black text-white">
                MatchBox
              </h2>
            </div>

            <button
              onClick={fetchMatches}
              className="text-slate-400 hover:text-purple-400 p-1.5 rounded-full"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>

          {/* Search bar */}
          <div className="relative mb-4">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search LinkUps & flatmates..."
              className="w-full pl-9 pr-3 py-2 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500 font-medium"
            />
          </div>

          {/* SECTION: NEW LINKUPS REEL */}
          {newMatches.length > 0 && (
            <div className="mb-4">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                New LinkUps ({newMatches.length})
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                {newMatches.map((m) => (
                  <button
                    key={m.matchId}
                    onClick={() => setSelectedConversationId(m.conversationId)}
                    className="shrink-0 flex flex-col items-center gap-1.5 w-18 group active:scale-95 transition-transform"
                  >
                    <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 shadow-md">
                      <img
                        src={
                          m.user.avatar ||
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
                        }
                        alt={m.user.name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-slate-950"
                      />
                      <span className="absolute -bottom-1 -right-1 bg-purple-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full border border-slate-900 shadow-xs">
                        {m.compatibilityScore}%
                      </span>
                    </div>
                    <span className="text-xs font-bold text-slate-200 truncate w-full text-center">
                      {m.user.name?.split(' ')[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* SECTION: CONVERSATIONS LIST */}
          <div className="flex-1 flex flex-col">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Conversations ({filteredConversations.length})
            </div>

            {loading ? (
              <div className="p-8 text-center text-xs text-slate-500 font-bold">
                Loading MatchBox...
              </div>
            ) : filteredConversations.length === 0 && newMatches.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-slate-900 text-purple-400 flex items-center justify-center border border-slate-800 shadow-inner">
                  <Link2 size={26} />
                </div>
                <div className="text-sm font-bold text-white">
                  Your MatchBox is empty
                </div>
                <div className="text-xs text-slate-400 max-w-xs leading-relaxed">
                  Go to Explore Deck and LinkUp with compatible flatmate profiles in Gurugram!
                </div>
              </div>
            ) : (
              <div className="space-y-1.5 overflow-y-auto flex-1">
                {filteredConversations.map((c) => {
                  const isSelected = selectedConversationId === c.conversationId;
                  return (
                    <button
                      key={c.conversationId}
                      onClick={() => setSelectedConversationId(c.conversationId)}
                      className={`w-full flex items-center gap-3 p-3 rounded-2xl text-left transition-all ${
                        isSelected
                          ? 'bg-purple-950/70 border border-purple-800 shadow-md'
                          : 'hover:bg-slate-900 border border-transparent'
                      }`}
                    >
                      <div className="relative shrink-0">
                        <img
                          src={
                            c.user.avatar ||
                            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
                          }
                          alt={c.user.name}
                          className="w-12 h-12 rounded-full object-cover border border-purple-500 shadow-sm"
                        />
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-950 rounded-full" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-bold text-white truncate">
                            {c.user.name}
                          </div>
                          {c.lastMessage && (
                            <span className="text-[10px] text-slate-400 shrink-0">
                              {new Date(c.lastMessage.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-slate-400 truncate mt-0.5 font-medium">
                          {c.lastMessage?.content || 'LinkUp formed'}
                        </div>
                      </div>

                      <ChevronRight size={14} className="text-slate-600 shrink-0" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Chat Window */}
        <div
          className={`md:col-span-7 bg-slate-950 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col ${
            !selectedConversationId ? 'hidden md:flex' : 'flex'
          }`}
        >
          {selectedConversationId ? (
            <ChatWindow
              conversationId={selectedConversationId}
              onBack={() => setSelectedConversationId(null)}
            />
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-900 text-purple-400 flex items-center justify-center border border-slate-800 shadow-inner">
                <Link2 size={32} />
              </div>
              <div className="text-base font-bold text-white">
                Select a LinkUp to open Resident Chat
              </div>
              <div className="text-xs text-slate-400 max-w-sm">
                Discuss flat requirements, propose coffee meet-ups at Cyber Hub, and safely connect.
              </div>
            </div>
          )}
        </div>
      </main>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={(user) => {
          setCurrentUser(user);
          fetchMatches();
        }}
      />
    </div>
  );
}
