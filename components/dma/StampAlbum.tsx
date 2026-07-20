'use client';

import React from 'react';
import { useDMA } from '@/context/DMAContext';
import { Stamp as StampIcon, Sparkles, Award } from 'lucide-react';

export const StampAlbum: React.FC = () => {
  const { stamps, user } = useDMA();

  const getRarityBadge = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return <span className="px-2 py-0.5 rounded bg-[#8b261a] text-white text-[10px] font-bold uppercase tracking-wider">Efsanevi</span>;
      case 'rare':
        return <span className="px-2 py-0.5 rounded bg-[#d4a373] text-[#1e130f] text-[10px] font-bold uppercase tracking-wider">Nadir</span>;
      default:
        return <span className="px-2 py-0.5 rounded bg-[#3b2a22] text-[#c4b5a5] text-[10px] font-bold uppercase tracking-wider">Yaygın</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#231713] via-[#2d1e17] to-[#1a110e] border border-[#3b2a22] p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <StampIcon className="w-5 h-5 text-[#d4a373]" />
            <h2 className="font-serif text-xl font-bold text-[#f4ebd9]">Nostaljik Pul Koleksiyonum</h2>
          </div>
          <p className="text-xs text-[#a89078] font-typewriter">
            Gelen mektuplardan biriken ve dünya turunda topladığın dijital hatıra pulları.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-[#1e130f] px-4 py-2 rounded-xl border border-[#3b2a22] text-xs font-typewriter">
          <Award className="w-5 h-5 text-[#8b261a]" />
          <div>
            <span className="block text-[#f4ebd9] font-bold">{stamps.length} Pul Toplandı</span>
            <span className="text-[10px] text-[#a89078]">Koleksiyoncu Seviyesi: Sahaf Sevdalısı</span>
          </div>
        </div>
      </div>

      {/* Stamp Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {stamps.map(stamp => {
          const isCollected = user.stampsCollected.includes(stamp.id) || true; // Demo: All visible

          return (
            <div
              key={stamp.id}
              className="group relative rounded-xl bg-[#231713] border border-[#3b2a22] hover:border-[#8b261a] p-4 text-center shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Stamp Outer Frame */}
              <div className="relative mx-auto w-24 h-28 rounded-lg bg-[#f4ebd9] p-2 border-2 border-dashed border-[#8b261a]/40 shadow-inner flex flex-col justify-between items-center overflow-hidden">
                {/* Stamp Header */}
                <div className="w-full flex items-center justify-between text-[10px] font-typewriter text-[#2c211b] border-b border-black/10 pb-1">
                  <span>{stamp.flag}</span>
                  <span className="font-bold">{stamp.year}</span>
                </div>

                {/* Center Image / Icon */}
                <div className="my-1 text-3xl">
                  {stamp.flag}
                </div>

                {/* Country Footer */}
                <div className="w-full text-[9px] font-typewriter uppercase tracking-wider font-bold text-[#2c211b] border-t border-black/10 pt-0.5 truncate">
                  {stamp.country}
                </div>
              </div>

              {/* Title & Badge */}
              <div className="mt-3">
                <h4 className="font-serif text-sm font-bold text-[#f4ebd9] truncate">
                  {stamp.name}
                </h4>
                <div className="mt-1 flex justify-center">{getRarityBadge(stamp.rarity)}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
