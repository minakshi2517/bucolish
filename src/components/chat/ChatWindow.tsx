'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Calendar,
  Phone,
  Home,
  ShieldCheck,
  Flag,
  Ban,
  ArrowLeft,
  Sparkles,
  MapPin,
  CheckCheck,
  Check,
  Heart,
  Smile,
  Image as ImageIcon,
} from 'lucide-react';

interface ChatWindowProps {
  conversationId: string;
  onBack: () => void;
}

export default function ChatWindow({ conversationId, onBack }: ChatWindowProps) {
  const [data, setData] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputMsg, setInputMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [meetupModalOpen, setMeetupModalOpen] = useState(false);
  const [meetupPlace, setMeetupPlace] = useState('Cyber Hub, DLF Phase 2');
  const [meetupTime, setMeetupTime] = useState('Saturday 4:00 PM');
  const [likedMessageIds, setLikedMessageIds] = useState<Record<string, boolean>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/v1/conversations/${conversationId}/messages`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
        setMessages(json.messages || []);
      }
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (
    content: string,
    msgType = 'TEXT',
    metaData: any = null
  ) => {
    if (!content && !metaData) return;
    setSending(true);
    try {
      const res = await fetch(`/api/v1/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, msgType, metaData }),
      });
      if (res.ok) {
        setInputMsg('');
        fetchMessages();
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setSending(false);
    }
  };

  const handleShareContact = () => {
    handleSendMessage('I have shared my verified contact details with you.', 'CONTACT_SHARE');
  };

  const handleShareFlat = () => {
    if (data?.otherUser?.housing) {
      handleSendMessage(
        `Here are the verified flat details: ${data.otherUser.housing.title}`,
        'FLAT_CARD',
        data.otherUser.housing
      );
    } else {
      handleSendMessage(
        'Sharing flat location & rent details for our Gurugram search.',
        'FLAT_CARD',
        { title: 'Gurugram Flat Listing', rent: 22000, sector: 'DLF Phase 4' }
      );
    }
  };

  const handleProposeMeetup = () => {
    handleSendMessage(
      `Proposed a coffee meet-up at ${meetupPlace} on ${meetupTime}.`,
      'MEETUP_PROPOSAL',
      { place: meetupPlace, time: meetupTime }
    );
    setMeetupModalOpen(false);
  };

  const toggleHeartMessage = (id: string) => {
    setLikedMessageIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center p-8 text-gray-400 text-xs font-bold">
        Loading chat with Bucolish resident...
      </div>
    );
  }

  const { otherUser, compatibilityScore, isMutualContactShared } = data || {};

  return (
    <div className="h-full flex flex-col bg-slate-950 text-white relative">
      {/* Top Header (Instagram DM style) */}
      <div className="bg-slate-900/90 backdrop-blur-md px-4 py-3 border-b border-slate-800 flex items-center justify-between shadow-md z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white sm:hidden"
          >
            <ArrowLeft size={18} />
          </button>

          <div className="relative">
            <img
              src={
                otherUser?.avatar ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
              }
              alt={otherUser?.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-purple-500 shadow-md"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-white">
                {otherUser?.name}
              </span>
              <span className="text-[10px] font-black text-purple-300 bg-purple-950 px-2 py-0.5 rounded-full border border-purple-800">
                {compatibilityScore}% Match
              </span>
            </div>
            <div className="text-[10px] text-slate-400">
              Active now in Gurugram
            </div>
          </div>
        </div>

        {/* Contact info pill */}
        {isMutualContactShared && otherUser?.phone ? (
          <div className="flex items-center gap-1.5 bg-emerald-950/80 text-emerald-300 px-3 py-1 rounded-full text-xs font-bold border border-emerald-700 shadow-sm">
            <Phone size={12} />
            <span>{otherUser.phone}</span>
          </div>
        ) : (
          <div className="text-[10px] font-semibold text-slate-500 bg-slate-800 px-2.5 py-1 rounded-full">
            Private Chat
          </div>
        )}
      </div>

      {/* Quick Action Dock */}
      <div className="bg-slate-900/60 px-4 py-2 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setMeetupModalOpen(true)}
          className="shrink-0 flex items-center gap-1 px-3 py-1 bg-slate-800 hover:bg-purple-900/40 text-purple-300 rounded-full text-xs font-bold border border-slate-700 transition-colors shadow-xs"
        >
          <Calendar size={12} className="text-purple-400" />
          <span>Propose Meet-up</span>
        </button>

        <button
          onClick={handleShareContact}
          className="shrink-0 flex items-center gap-1 px-3 py-1 bg-slate-800 hover:bg-purple-900/40 text-purple-300 rounded-full text-xs font-bold border border-slate-700 transition-colors shadow-xs"
        >
          <Phone size={12} className="text-purple-400" />
          <span>Share Contact</span>
        </button>

        <button
          onClick={handleShareFlat}
          className="shrink-0 flex items-center gap-1 px-3 py-1 bg-slate-800 hover:bg-purple-900/40 text-purple-300 rounded-full text-xs font-bold border border-slate-700 transition-colors shadow-xs"
        >
          <Home size={12} className="text-purple-400" />
          <span>Share Flat Card</span>
        </button>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <div className="text-center my-2">
          <span className="text-[10px] text-slate-400 font-bold bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
            🔒 Protected by Bucolish Trust & Safety · Phone numbers hidden until mutual consent
          </span>
        </div>

        {messages.map((m) => {
          const isMine = m.isMine;
          const isLiked = likedMessageIds[m.id];

          // Render Rich Card Messages
          if (m.msgType === 'MEETUP_PROPOSAL') {
            return (
              <div
                key={m.id}
                className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
              >
                <div className="bg-gradient-to-tr from-purple-900 to-indigo-900 text-white p-4 rounded-3xl max-w-xs sm:max-w-sm shadow-xl space-y-2 border border-purple-600/50">
                  <div className="flex items-center gap-1.5 text-xs font-black text-yellow-300 uppercase tracking-wider">
                    <Calendar size={14} />
                    <span>Flatmate Coffee Meet-up</span>
                  </div>
                  <div className="text-sm font-extrabold flex items-center gap-1">
                    <MapPin size={14} className="text-purple-400" />
                    <span>{m.metaData?.place || 'Cyber Hub, DLF Phase 2'}</span>
                  </div>
                  <div className="text-xs text-purple-200 font-medium">
                    🕒 {m.metaData?.time || 'This Weekend'}
                  </div>
                  <div className="text-[10px] text-purple-300 pt-2 border-t border-purple-800 flex justify-between">
                    <span>{isMine ? 'You sent invitation' : `${otherUser?.name} sent invitation`}</span>
                    <span>{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </div>
            );
          }

          if (m.msgType === 'FLAT_CARD') {
            return (
              <div
                key={m.id}
                className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
              >
                <div className="bg-slate-900 text-white p-4 rounded-3xl max-w-xs sm:max-w-sm shadow-xl space-y-2 border border-slate-700">
                  <div className="flex items-center gap-1.5 text-xs font-black text-purple-400">
                    <Home size={14} />
                    <span>Verified Flat Listing</span>
                  </div>
                  <div className="text-sm font-black">
                    {m.metaData?.title || 'Luxury Flat in Gurugram'}
                  </div>
                  <div className="text-xs font-extrabold text-purple-300">
                    ₹{(m.metaData?.rent || 24000).toLocaleString()} / mo · {m.metaData?.sector || 'DLF Phase 4'}
                  </div>
                  <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800 flex justify-between">
                    <span>{isMine ? 'You shared' : `${otherUser?.name} shared`}</span>
                    <span>{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </div>
            );
          }

          if (m.msgType === 'CONTACT_SHARE') {
            return (
              <div
                key={m.id}
                className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
              >
                <div className="bg-emerald-950/80 text-emerald-200 p-3.5 rounded-3xl max-w-xs sm:max-w-sm shadow-md border border-emerald-700/60 space-y-1">
                  <div className="flex items-center gap-1 text-xs font-black text-emerald-400">
                    <Phone size={13} />
                    <span>Contact Exchange Request</span>
                  </div>
                  <div className="text-xs font-medium text-slate-200">
                    {m.content}
                  </div>
                  <div className="text-[10px] text-emerald-400 pt-1 flex justify-between">
                    <span>{isMutualContactShared ? 'Both shared ✓ Number unlocked' : 'Pending other user confirmation'}</span>
                    <span>{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </div>
            );
          }

          // Standard Text Message (Instagram Gradient Bubble style)
          return (
            <div
              key={m.id}
              className={`flex ${isMine ? 'justify-end' : 'justify-start'} group relative`}
            >
              <div
                onDoubleClick={() => toggleHeartMessage(m.id)}
                className={`p-3.5 rounded-3xl max-w-xs sm:max-w-md text-sm shadow-md transition-transform active:scale-98 select-none relative ${
                  isMine
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-br-xs'
                    : 'bg-slate-800 text-slate-100 border border-slate-700 rounded-bl-xs'
                }`}
              >
                <div>{m.content}</div>

                <div
                  className={`text-[9px] mt-1 text-right flex items-center justify-end gap-1 ${
                    isMine ? 'text-purple-200' : 'text-slate-400'
                  }`}
                >
                  <span>
                    {new Date(m.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  {isMine &&
                    (m.isRead ? (
                      <CheckCheck size={11} className="text-purple-200" />
                    ) : (
                      <Check size={11} />
                    ))}
                </div>

                {/* Heart Reaction Badge */}
                {isLiked && (
                  <div className="absolute -bottom-2 -left-2 bg-slate-900 border border-slate-700 rounded-full p-1 shadow-md">
                    <Heart size={12} fill="#EC4899" className="text-pink-500" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Meetup Proposal Modal */}
      {meetupModalOpen && (
        <div className="absolute inset-0 z-30 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 text-white rounded-3xl p-5 w-full max-w-sm shadow-2xl border border-slate-700 space-y-4 animate-in zoom-in-95 duration-200">
            <h3 className="font-black text-white text-sm flex items-center gap-1.5">
              <Calendar size={16} className="text-purple-400" />
              Propose Safe Gurugram Meet-up
            </h3>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Suggested Public Location
              </label>
              <select
                value={meetupPlace}
                onChange={(e) => setMeetupPlace(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl bg-slate-800 border border-slate-700 font-bold text-white focus:outline-none"
              >
                <option value="Cyber Hub, DLF Phase 2">Cyber Hub, DLF Phase 2</option>
                <option value="Galleria Market, DLF Phase 4">Galleria Market, DLF Phase 4</option>
                <option value="One Horizon Center, Golf Course Road">One Horizon Center, Golf Course Rd</option>
                <option value="Starbucks, Sector 29">Starbucks, Sector 29</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Day & Time
              </label>
              <input
                type="text"
                value={meetupTime}
                onChange={(e) => setMeetupTime(e.target.value)}
                placeholder="e.g. Saturday 5:00 PM"
                className="w-full text-xs p-2.5 rounded-xl bg-slate-800 border border-slate-700 font-medium text-white focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setMeetupModalOpen(false)}
                className="text-xs px-3 py-1.5 text-slate-400 hover:text-white font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleProposeMeetup}
                className="btn-primary !py-2 !px-4 text-xs font-bold shadow-lg"
              >
                Send Meet-up Invite
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Message Bar (Instagram DM style) */}
      <div className="bg-slate-900 p-3 border-t border-slate-800 flex items-center gap-2">
        <input
          type="text"
          value={inputMsg}
          onChange={(e) => setInputMsg(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage(inputMsg);
            }
          }}
          placeholder="Message..."
          className="flex-1 px-4 py-2.5 rounded-full bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs sm:text-sm font-medium"
        />
        <button
          onClick={() => handleSendMessage(inputMsg)}
          disabled={!inputMsg.trim() || sending}
          className="p-2.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white disabled:opacity-30 transition-transform active:scale-95 shadow-md"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
