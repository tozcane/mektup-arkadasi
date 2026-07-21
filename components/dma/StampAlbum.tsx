'use client';

import React from 'react';
import { useDMA } from '@/context/DMAContext';
import { Stamp as StampIcon, Award, Star } from 'lucide-react';

export const StampAlbum: React.FC = () => {
  const { stamps, user } = useDMA();

  const getRarityBadge = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return (
          <span className="px-3 py-1 rounded-full bg-rose-700 text-white text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-1 justify-center">
            <Star className="w-3 h-3 text-amber-300 fill-amber-300 animate-spin" />
            <span>Efsanevi</span>
          </span>
        );
      case 'rare':
        return (
          <span className="px-3 py-1 rounded-full bg-amber-500 text-white text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-1 justify-center">
            <Star className="w-3 h-3 text-white fill-white" />
            <span>Nadir</span>
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full bg-slate-600 text-white text-xs font-bold uppercase tracking-wider shadow-sm flex items-center justify-center">
            <span>Yaygın</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner (Daha Belirgin & Güzel) */}
      <div className="rounded-3xl bg-gradient-to-r from-rose-50 via-amber-50 to-white border-2 border-rose-100 p-8 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-700 text-white flex items-center justify-center shadow-md">
              <StampIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
                Nostaljik Pul Koleksiyonum
              </h2>
              <p className="text-sm text-gray-500 font-typewriter mt-1">
                Gelen mektuplardan biriken ve dünya turunda topladığın dijital hatıra pulları.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3.5 bg-white px-6 py-4.5 rounded-2xl border-2 border-rose-100 text-sm font-bold shadow-sm">
          <Award className="w-8 h-8 text-rose-700 flex-shrink-0" />
          <div>
            <span className="block text-gray-950 text-base">{stamps.length} Pul Toplandı</span>
            <span className="text-xs text-rose-800 font-typewriter">Koleksiyoncu Seviyesi: Sahaf Sevdalısı</span>
          </div>
        </div>
      </div>

      {/* Stamp Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {stamps.map(stamp => {
          const isCollected = user.stampsCollected.includes(stamp.id) || true; // Demo: All visible

          return (
            <div
              key={stamp.id}
              className="group relative rounded-2xl bg-white border-2 border-gray-200 hover:border-rose-700 p-5 text-center shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer"
            >
              {/* Stamp Outer Frame (Vintange Delikli Pul Görünümü) */}
              <div className="relative mx-auto w-28 h-32 rounded-lg bg-amber-50/70 p-3.5 border-3 border-dashed border-gray-400 group-hover:border-rose-700/50 shadow-inner flex flex-col justify-between items-center overflow-hidden transition duration-300">
                {/* Stamp Header */}
                <div className="w-full flex items-center justify-between text-[11px] font-bold text-gray-700 border-b border-black/10 pb-1.5 font-typewriter">
                  <span>{stamp.flag}</span>
                  <span>{stamp.year}</span>
                </div>

                {/* Center Flag Emoji Icon */}
                <div className="my-2 text-4xl transform group-hover:scale-115 transition duration-300">
                  {stamp.flag}
                </div>

                {/* Country Footer */}
                <div className="w-full text-[10px] font-bold uppercase tracking-wider text-gray-700 border-t border-black/10 pt-1 font-typewriter truncate">
                  {stamp.country}
                </div>
              </div>

              {/* Title & Badge */}
              <div className="mt-4 space-y-2">
                <h4 className="font-serif text-base sm:text-lg font-bold text-gray-900 group-hover:text-rose-750 transition truncate">
                  {stamp.name}
                </h4>
                <div className="flex justify-center">{getRarityBadge(stamp.rarity)}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
