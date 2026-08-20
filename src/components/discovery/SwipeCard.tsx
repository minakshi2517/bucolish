'use client';

import React, { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import {
  MapPin,
  ShieldCheck,
  Sparkles,
  Info,
  Home,
  Check,
  X,
  Briefcase,
  Link2,
  Calendar,
  Building,
} from 'lucide-react';

interface SwipeCardProps {
  item: any;
  onSwipe: (action: 'PASS' | 'LIKE' | 'SUPER_LIKE') => void;
  onOpenDetails: (item: any) => void;
}

export default function SwipeCard({ item, onSwipe, onOpenDetails }: SwipeCardProps) {
  const { user, compatibility } = item;
  const [photoIndex, setPhotoIndex] = useState(0);

  // Photos parsing
  let photos: string[] = [];
  try {
    photos = JSON.parse(user.profile?.photos || '[]');
  } catch {
    photos = user.avatar ? [user.avatar] : [];
  }
  if (photos.length === 0 && user.avatar) photos = [user.avatar];

  // Motion drag values
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-250, 250], [-14, 14]);
  const opacityLike = useTransform(x, [30, 120], [0, 1]);
  const opacityPass = useTransform(x, [-30, -120], [0, 1]);

  // Lifestyle tags
  let tags: string[] = [];
  try {
    tags = JSON.parse(user.lifestyleAnswers?.summaryTags || '[]');
  } catch {
    tags = [];
  }
  if (tags.length === 0) tags = ['Verified Resident', 'Gurugram', 'Non-Smoker'];

  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.x > 110 || info.velocity.x > 500) {
      onSwipe('LIKE');
    } else if (info.offset.x < -110 || info.velocity.x < -500) {
      onSwipe('PASS');
    } else if (info.offset.y < -130) {
      onSwipe('SUPER_LIKE');
    }
  };

  const handleCardTap = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;

    if (clickX < width * 0.35) {
      if (photoIndex > 0) setPhotoIndex(photoIndex - 1);
    } else if (clickX > width * 0.65) {
      if (photoIndex < photos.length - 1) setPhotoIndex(photoIndex + 1);
    } else {
      onOpenDetails(item);
    }
  };

  return (
    <motion.div
      style={{ x, rotate }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      onClick={handleCardTap}
      className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing select-none touch-none"
    >
      <div className="relative w-full h-full rounded-[24px] overflow-hidden bg-slate-950 shadow-2xl border border-slate-800">
        {/* Main High-Res Photo */}
        <img
          src={
            photos[photoIndex] ||
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'
          }
          alt={user.name}
          className="w-full h-full object-cover pointer-events-none"
        />

        {/* Sophisticated Dark Vignette Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-black/20 pointer-events-none" />

        {/* Photo Progress Indicators */}
        {photos.length > 1 && (
          <div className="absolute top-3 left-4 right-4 z-20 flex gap-1.5 pointer-events-none">
            {photos.map((_, i) => (
              <div
                key={i}
                className="h-1 rounded-full flex-1 bg-white/25 overflow-hidden"
              >
                <div
                  className={`h-full transition-all duration-300 ${
                    i === photoIndex ? 'bg-white w-full' : i < photoIndex ? 'bg-white w-full' : 'w-0'
                  }`}
                />
              </div>
            ))}
          </div>
        )}

        {/* LinkUp / Skip Action Stamps */}
        <motion.div
          style={{ opacity: opacityLike }}
          className="absolute top-12 left-6 z-30 border-2 border-purple-400 text-purple-200 font-extrabold text-sm tracking-wider px-3.5 py-1.5 rounded-xl rotate-[-10deg] uppercase pointer-events-none bg-slate-950/85 backdrop-blur-md shadow-lg flex items-center gap-1.5"
        >
          <Link2 size={16} strokeWidth={2.5} className="text-purple-400" />
          <span>LINKUP</span>
        </motion.div>

        <motion.div
          style={{ opacity: opacityPass }}
          className="absolute top-12 right-6 z-30 border-2 border-slate-400 text-slate-300 font-extrabold text-sm tracking-wider px-3.5 py-1.5 rounded-xl rotate-[10deg] uppercase pointer-events-none bg-slate-950/85 backdrop-blur-md shadow-lg flex items-center gap-1.5"
        >
          <X size={16} strokeWidth={2.5} />
          <span>SKIP SECTOR</span>
        </motion.div>

        {/* Top Badges */}
        <div className="absolute top-7 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5 bg-purple-700 text-white backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold shadow-md border border-purple-500/40">
            <Sparkles size={13} className="text-yellow-300" />
            <span>{compatibility?.overallScore || 88}% Harmony Score</span>
          </div>

          {user.verification?.overallStatus === 'VERIFIED' && (
            <div className="flex items-center gap-1 bg-slate-900/90 text-emerald-400 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold border border-emerald-500/40 shadow-md">
              <ShieldCheck size={13} />
              <span>Verified Resident</span>
            </div>
          )}
        </div>

        {/* Bottom Card Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-5 z-20 text-white flex flex-col justify-end pointer-events-auto">
          {/* User Name, Age, Profession */}
          <div className="flex items-end justify-between mb-1.5">
            <div>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-bold tracking-tight text-white">
                  {user.name || 'Resident'}
                </h3>
                {user.profile?.age && (
                  <span className="text-xl font-medium text-slate-300">
                    {user.profile.age}
                  </span>
                )}
              </div>

              {user.profile?.occupation && (
                <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium mt-0.5">
                  <Briefcase size={12} className="text-purple-400" />
                  <span>
                    {user.profile.occupation}
                    {user.profile.company ? ` at ${user.profile.company}` : ''}
                  </span>
                </div>
              )}
            </div>

            {/* Inspect Details */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenDetails(item);
              }}
              className="p-2.5 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md text-white transition-all shadow-md border border-white/15"
              title="Inspect Bucolish Harmony Breakdown"
            >
              <Info size={17} />
            </button>
          </div>

          {/* Location & Housing Status */}
          <div className="flex items-center gap-1.5 text-xs text-purple-200 font-semibold mb-2.5">
            <MapPin size={13} className="text-purple-400 shrink-0" />
            <span>
              {user.housingProfile
                ? `${user.housingProfile.flatType} in ${user.housingProfile.sector} (₹${user.housingProfile.rent.toLocaleString()}/mo)`
                : `Targeting ${
                    user.profile?.preferredLocations
                      ? JSON.parse(user.profile.preferredLocations)[0] || 'Gurugram'
                      : 'Gurugram'
                  } (₹${(user.profile?.budgetMin || 15000).toLocaleString()} – ₹${(
                    user.profile?.budgetMax || 30000
                  ).toLocaleString()}/mo)`}
            </span>
          </div>

          {/* Lifestyle Tags */}
          <div className="flex flex-wrap gap-1.5">
            {tags.slice(0, 3).map((tag, i) => (
              <span
                key={i}
                className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-slate-900/80 backdrop-blur-md text-slate-200 border border-slate-700"
              >
                {tag}
              </span>
            ))}
            {user.housingProfile && (
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-purple-900/80 text-purple-200 backdrop-blur-md flex items-center gap-1 border border-purple-700">
                <Home size={11} /> Flat Available
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
