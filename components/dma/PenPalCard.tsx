'use client';

import React from 'react';
import { PenPalProfile } from '@/types/dma';
import { MapPin, Clock, BookOpen, PenTool } from 'lucide-react';
import { useDMA } from '@/context/DMAContext';

interface PenPalCardProps {
  profile: PenPalProfile;
}

export const PenPalCard: React.FC<PenPalCardProps> = ({ profile }) => {
  const { openWriterModal } = useDMA();

  return (
    <div className="group relative rounded-2xl bg-white border border-gray-200 hover:border-rose-400 p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden">
      {/* Top Flag Frame Border Decor */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-600 via-amber-500 to-rose-600" />

      {/* Stamp Flag on Top Right */}
      <div className="absolute top-3.5 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs text-amber-900 font-typewriter font-bold shadow-sm">
        <span className="text-base">{profile.flag}</span>
        <span>{profile.country}</span>
      </div>

      <div>
        {/* Avatar & Pseudonym */}
        <div className="flex items-center gap-3 mb-4 mt-1">
          <div
            className="w-12 h-12 rounded-full border-2 border-amber-300 flex items-center justify-center font-serif text-xl font-bold text-white shadow-sm"
            style={{ backgroundColor: profile.avatarStyle }}
          >
            {profile.pseudonym[0]}
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-gray-900 group-hover:text-rose-700 transition">
              {profile.pseudonym}
            </h3>
            <p className="text-xs text-gray-500 font-typewriter">
              {profile.gender ? `${profile.gender}, ` : ''}{profile.age} yaşında
            </p>
          </div>
        </div>

        {/* Title & Bio */}
        <div className="mb-4">
          <p className="text-xs font-bold text-amber-800 mb-1 italic font-serif">
            "{profile.title}"
          </p>
          <p className="text-xs text-gray-600 leading-relaxed line-clamp-3 font-sans">
            {profile.bio}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {profile.interests.map((interest, idx) => (
            <span
              key={idx}
              className="text-[10px] px-2 py-0.5 rounded bg-gray-100 text-gray-700 border border-gray-200 font-medium"
            >
              #{interest}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Meta & Action */}
      <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1" title="Mektup varış süresi">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>~{profile.estimatedDeliveryHours}s yol</span>
          </div>
          <div className="flex items-center gap-1" title="Mektup sayısı">
            <BookOpen className="w-3.5 h-3.5 text-rose-600" />
            <span>{profile.lettersExchangedCount} mektup</span>
          </div>
        </div>

        <button
          onClick={() => openWriterModal(profile)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs transition active:scale-95 shadow-sm"
        >
          <PenTool className="w-3.5 h-3.5" />
          <span>Mektup Yaz</span>
        </button>
      </div>
    </div>
  );
};
