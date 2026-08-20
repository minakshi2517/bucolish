'use client';

import React, { useState } from 'react';
import {
  X,
  MapPin,
  Briefcase,
  ShieldCheck,
  Sparkles,
  Home,
  CheckCircle2,
  AlertTriangle,
  Heart,
  MessageCircle,
  Flag,
  Ban,
  Calendar,
  IndianRupee,
  Check,
} from 'lucide-react';

interface ProfileModalProps {
  item: any;
  onClose: () => void;
  onSwipe: (action: 'PASS' | 'LIKE') => void;
}

export default function ProfileModal({ item, onClose, onSwipe }: ProfileModalProps) {
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState('SCAM');
  const [reportDesc, setReportDesc] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [blocked, setBlocked] = useState(false);

  if (!item) return null;

  const { user, compatibility } = item;

  let photos: string[] = [];
  try {
    photos = JSON.parse(user.profile?.photos || '[]');
  } catch {
    photos = user.avatar ? [user.avatar] : [];
  }
  if (photos.length === 0 && user.avatar) photos = [user.avatar];

  let housingPhotos: string[] = [];
  let amenities: string[] = [];
  if (user.housingProfile) {
    try {
      housingPhotos = JSON.parse(user.housingProfile.photos || '[]');
      amenities = JSON.parse(user.housingProfile.amenities || '[]');
    } catch {}
  }

  const handleReport = async () => {
    try {
      await fetch('/api/v1/safety/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportedId: user.id,
          reason: reportReason,
          description: reportDesc,
        }),
      });
      setReportSubmitted(true);
    } catch (err) {
      console.error('Report submission failed:', err);
    }
  };

  const handleBlock = async () => {
    try {
      await fetch('/api/v1/safety/block', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blockedId: user.id }),
      });
      setBlocked(true);
      setTimeout(() => {
        onClose();
        window.location.reload();
      }, 1000);
    } catch (err) {
      console.error('Block failed:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-t-3xl sm:rounded-3xl overflow-y-auto shadow-2xl relative border border-gray-100 animate-in slide-in-from-bottom duration-300">
        {/* Top Sticky Bar */}
        <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-gray-900 text-lg">
              {user.name}
            </span>
            <span className="text-purple-600 font-bold text-xs bg-purple-50 px-2.5 py-0.5 rounded-full">
              {compatibility?.overallScore || 85}% Match
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Photo Gallery Grid */}
          <div className="grid grid-cols-2 gap-2 rounded-2xl overflow-hidden">
            {photos.map((p, i) => (
              <img
                key={i}
                src={p}
                alt={`${user.name} photo ${i}`}
                className={`w-full object-cover rounded-xl ${
                  i === 0 && photos.length % 2 !== 0 ? 'col-span-2 h-64' : 'h-48'
                }`}
              />
            ))}
          </div>

          {/* User Basic Info */}
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-gray-900">
                  {user.name}, {user.profile?.age || 25}
                </h2>
                <div className="flex items-center gap-1.5 text-xs text-gray-600 font-semibold mt-1">
                  <Briefcase size={13} className="text-purple-600" />
                  <span>
                    {user.profile?.occupation} · {user.profile?.company}
                  </span>
                </div>
              </div>

              {user.verification?.overallStatus === 'VERIFIED' && (
                <div className="badge-verified">
                  <ShieldCheck size={14} />
                  <span>ID & Work Verified</span>
                </div>
              )}
            </div>

            {user.profile?.bio && (
              <p className="text-sm text-gray-700 mt-3 leading-relaxed bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
                "{user.profile.bio}"
              </p>
            )}
          </div>

          {/* Prompt Answer Card */}
          {user.profile?.promptQuestion && user.profile?.promptAnswer && (
            <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100">
              <div className="text-xs font-extrabold uppercase tracking-wider text-purple-900 mb-1">
                {user.profile.promptQuestion}
              </div>
              <div className="text-sm font-semibold text-purple-950">
                "{user.profile.promptAnswer}"
              </div>
            </div>
          )}

          {/* 6-PILLAR COMPATIBILITY BREAKDOWN */}
          <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-4 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-purple-400" />
                <h3 className="text-base font-bold text-white">
                  6-Pillar Compatibility Analysis
                </h3>
              </div>
              <span className="text-sm font-black text-purple-300">
                {compatibility?.overallScore}% Overall
              </span>
            </div>

            {/* Highlights Chips */}
            {compatibility?.highlights && compatibility.highlights.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {compatibility.highlights.map((hl: string, i: number) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-800/60 text-purple-200 border border-purple-700/50 flex items-center gap-1"
                  >
                    <Check size={12} className="text-emerald-400" />
                    {hl}
                  </span>
                ))}
              </div>
            )}

            {/* Pillar Score Bars */}
            {compatibility?.pillars && (
              <div className="space-y-2.5 pt-2">
                {Object.entries(compatibility.pillars).map(([k, v]: [string, any]) => (
                  <div key={k} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-slate-300">
                      <span>{v.label}</span>
                      <span className="font-bold text-purple-300">{v.score}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-indigo-400 rounded-full"
                        style={{ width: `${v.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* FLAT DETAILS (IF USER HAS FLAT) */}
          {user.housingProfile && (
            <div className="p-5 rounded-2xl border border-gray-200 space-y-4">
              <div className="flex items-center gap-2 text-gray-900 font-bold text-base">
                <Home size={18} className="text-purple-600" />
                <span>Flat Details · {user.housingProfile.sector}</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-gray-50 rounded-xl">
                  <div className="text-[11px] text-gray-500 font-medium">Monthly Rent</div>
                  <div className="text-sm font-black text-gray-900">
                    ₹{user.housingProfile.rent.toLocaleString()} / mo
                  </div>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <div className="text-[11px] text-gray-500 font-medium">Deposit</div>
                  <div className="text-sm font-black text-gray-900">
                    ₹{user.housingProfile.deposit.toLocaleString()}
                  </div>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <div className="text-[11px] text-gray-500 font-medium">Configuration</div>
                  <div className="text-sm font-black text-gray-900">
                    {user.housingProfile.flatType}
                  </div>
                </div>
              </div>

              {housingPhotos.length > 0 && (
                <div>
                  <div className="text-xs font-bold text-gray-700 mb-2">Flat Photos</div>
                  <div className="grid grid-cols-3 gap-2">
                    {housingPhotos.map((hp, i) => (
                      <img
                        key={i}
                        src={hp}
                        alt="Flat photo"
                        className="h-24 w-full object-cover rounded-xl"
                      />
                    ))}
                  </div>
                </div>
              )}

              {amenities.length > 0 && (
                <div>
                  <div className="text-xs font-bold text-gray-700 mb-2">Amenities Included</div>
                  <div className="flex flex-wrap gap-1.5">
                    {amenities.map((am, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700"
                      >
                        ✓ {am}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Trust & Safety Actions */}
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
            <button
              onClick={() => setReportOpen(true)}
              className="text-gray-500 hover:text-red-600 flex items-center gap-1 font-semibold"
            >
              <Flag size={13} />
              <span>Report User</span>
            </button>

            <button
              onClick={handleBlock}
              disabled={blocked}
              className="text-gray-500 hover:text-red-600 flex items-center gap-1 font-semibold"
            >
              <Ban size={13} />
              <span>{blocked ? 'Blocked' : 'Block User'}</span>
            </button>
          </div>

          {/* Report Form Modal inside */}
          {reportOpen && (
            <div className="p-4 bg-red-50/80 border border-red-200 rounded-2xl space-y-3">
              <div className="font-bold text-red-950 text-xs">
                Submit Report to Bucolish Trust & Safety
              </div>
              {reportSubmitted ? (
                <div className="text-xs text-green-700 font-bold">
                  ✓ Report received. Our moderation team has flagged this account.
                </div>
              ) : (
                <>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full text-xs p-2 rounded-xl bg-white border border-red-200"
                  >
                    <option value="SCAM">Scam / Fake Listing</option>
                    <option value="HARASSMENT">Harassment / Inappropriate Language</option>
                    <option value="FAKE_PROFILE">Fake Profile or Stolen Photos</option>
                    <option value="MONEY_REQUEST">Asking for Advance Money</option>
                    <option value="OTHER">Other Violation</option>
                  </select>
                  <textarea
                    rows={2}
                    value={reportDesc}
                    onChange={(e) => setReportDesc(e.target.value)}
                    placeholder="Briefly describe the issue..."
                    className="w-full text-xs p-2 rounded-xl bg-white border border-red-200"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setReportOpen(false)}
                      className="text-xs px-3 py-1 text-gray-600"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleReport}
                      className="text-xs px-3 py-1 bg-red-600 text-white rounded-lg font-bold"
                    >
                      Submit Report
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => {
                onClose();
                onSwipe('PASS');
              }}
              className="btn-outline !py-3.5 justify-center font-bold text-sm"
            >
              <X size={18} />
              <span>Pass</span>
            </button>
            <button
              onClick={() => {
                onClose();
                onSwipe('LIKE');
              }}
              className="btn-primary !py-3.5 justify-center font-bold text-sm"
            >
              <Heart size={18} />
              <span>Connect</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
