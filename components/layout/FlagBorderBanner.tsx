'use client';

import React from 'react';

const FLAGS = [
  { code: 'TR', flag: '🇹🇷', country: 'Türkiye' },
  { code: 'JP', flag: '🇯🇵', country: 'Japonya' },
  { code: 'GB', flag: '🇬🇧', country: 'İngiltere' },
  { code: 'FR', flag: '🇫🇷', country: 'Fransa' },
  { code: 'DE', flag: '🇩🇪', country: 'Almanya' },
  { code: 'IT', flag: '🇮🇹', country: 'İtalya' },
  { code: 'ES', flag: '🇪🇸', country: 'İspanya' },
  { code: 'BR', flag: '🇧🇷', country: 'Brezilya' },
  { code: 'CA', flag: '🇨🇦', country: 'Kanada' },
  { code: 'AU', flag: '🇦🇺', country: 'Avustralya' },
  { code: 'EG', flag: '🇪🇬', country: 'Mısır' },
  { code: 'IN', flag: '🇮🇳', country: 'Hindistan' },
  { code: 'MX', flag: '🇲🇽', country: 'Meksika' },
  { code: 'KR', flag: '🇰🇷', country: 'Güney Kore' },
  { code: 'SE', flag: '🇸🇪', country: 'İsveç' },
  { code: 'GR', flag: '🇬🇷', country: 'Yunanistan' },
  { code: 'US', flag: '🇺🇸', country: 'ABD' },
  { code: 'NL', flag: '🇳🇱', country: 'Hollanda' },
  { code: 'AR', flag: '🇦🇷', country: 'Arjantin' },
  { code: 'NO', flag: '🇳🇴', country: 'Norveç' },
];

export const FlagBorderBanner: React.FC = () => {
  return (
    <div className="w-full bg-[#18181b] border-b-2 border-amber-600/60 py-2 px-4 shadow-md select-none overflow-hidden">
      {/* Repeating Flag Ticker */}
      <div className="flex items-center space-x-4 overflow-x-auto no-scrollbar py-0.5 justify-between">
        {FLAGS.map((f, i) => (
          <div
            key={i}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-white shadow-sm flex-shrink-0 hover:border-amber-500 transition transform hover:scale-105"
            title={`${f.country} - Mektup Arkadaşı Çerçevesi`}
          >
            <span className="text-lg">{f.flag}</span>
            <span className="text-[10px] font-typewriter text-amber-400 font-bold uppercase tracking-widest">
              {f.code}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
