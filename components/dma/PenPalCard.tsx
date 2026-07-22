'use client';

import React from 'react';
import { PenPalProfile } from '@/types/dma';
import { MapPin, Clock, BookOpen, PenTool } from 'lucide-react';
import { useDMA } from '@/context/DMAContext';

interface PenPalCardProps {
  profile: PenPalProfile;
}

export const PenPalCard: React.FC<PenPalCardProps> = ({ profile }) => {
  const { openWriterModal, hasReachedLetterLimit } = useDMA();

  return (
    <div className="group relative rounded-2xl bg-white border border-gray-200 hover:border-rose-400 p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden">
      {/* Top Flag Frame Border Decor */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-600 via-amber-500 to-rose-600" />

      {/* Stamp Flag on Top Right */}
      <div className="absolute top-4 right-4 flex items-center gap-1 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded text-xs text-gray-700 font-bold font-typewriter">
        <span>{profile.flag}</span>
        <span>{profile.country}</span>
      </div>

      <div className="space-y-4">
        {/* Profile Info */}
        <div className="flex items-center gap-3.5">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center font-serif text-xl font-bold text-white shadow-sm"
            style={{ backgroundColor: profile.avatarStyle }}
          >
            {profile.pseudonym[0]}
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-gray-900 group-hover:text-rose-700 transition flex items-center gap-1.5">
              <span>{profile.pseudonym}</span>
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-gray-150 text-gray-800 text-[10px] font-sans">
                {profile.gender}
              </span>
            </h3>
            <p className="text-xs text-gray-500 flex items-center gap-1 font-typewriter">
              <MapPin className="w-3.5 h-3.5 text-gray-400" />
              <span>{profile.distanceKm} km uzakta</span>
            </p>
          </div>
        </div>

        {/* Bio */}
        <div>
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
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs transition active:scale-95 shadow-sm cursor-pointer ${
            hasReachedLetterLimit
              ? 'bg-gray-400 hover:bg-gray-500 text-white'
              : 'bg-rose-700 hover:bg-rose-800 text-white'
          }`}
          title={hasReachedLetterLimit ? 'Posta çantanız dolu! Aynı anda en fazla 2 mektubunuz yolda olabilir.' : undefined}
        >
          <PenTool className="w-3.5 h-3.5" />
          <span>{hasReachedLetterLimit ? 'Limit Doldu' : 'Mektup Yaz'}</span>
        </button>
      </div>
    </div>
  );
};
