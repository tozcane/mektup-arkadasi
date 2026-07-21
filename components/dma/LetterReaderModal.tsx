'use client';

import React, { useState } from 'react';
import { useDMA } from '@/context/DMAContext';
import { PAPER_THEMES } from '@/data/mockData';
import { X, Reply, Stamp as StampIcon, Lock, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

export const LetterReaderModal: React.FC = () => {
  const { readingLetter, closeReaderModal, openWriterModal, penpals } = useDMA();
  const [isUnsealed, setIsUnsealed] = useState(false);

  if (!readingLetter) return null;

  const paperTheme = PAPER_THEMES.find(t => t.id === readingLetter.paperTheme) || PAPER_THEMES[0];
  const penpal = penpals.find(p => p.id === readingLetter.senderId);

  // If the letter is unread and not unsealed yet, show the wax seal presentation card
  const isWaxSealed = readingLetter.status === 'delivered_unread' && !isUnsealed;

  const handleBreakSeal = () => {
    setIsUnsealed(true);
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#8b261a', '#e07a5f', '#f4ebd9'],
    });
  };

  const handleReply = () => {
    closeReaderModal();
    if (penpal) {
      openWriterModal(penpal);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white border border-gray-200 shadow-2xl overflow-hidden flex flex-col my-8">
        
        {/* Header Bar */}
        <div className="px-8 py-6 bg-gradient-to-r from-rose-950 via-rose-900 to-amber-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-full bg-white/10 border border-white/20 flex items-center justify-center font-serif text-xl font-bold text-white shadow-sm">
              {readingLetter.senderName[0]}
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold tracking-wide">
                {readingLetter.senderName} {readingLetter.senderFlag}
              </h2>
              <p className="text-sm text-amber-200/90 font-medium">
                Teslim Edildi: {new Date(readingLetter.deliveredAt || readingLetter.sentAt).toLocaleDateString('tr-TR')}
              </p>
            </div>
          </div>

          <button
            onClick={closeReaderModal}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-200 transition cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Area (Büyük Fontlar) */}
        <div className="p-8 overflow-y-auto flex-1 text-base text-gray-900">
          {isWaxSealed ? (
            /* Sealed Envelope Interactive Screen */
            <div className="my-6 py-12 px-8 rounded-2xl border-2 border-rose-200 bg-gradient-to-b from-rose-50/50 to-white text-center flex flex-col items-center justify-center space-y-6 shadow-md">
              <div className="w-16 h-16 rounded-full bg-rose-100 border border-rose-300 flex items-center justify-center text-rose-700 animate-pulse shadow-sm">
                <Lock className="w-8 h-8" />
              </div>

              <div>
                <h3 className="font-serif text-2xl font-bold text-gray-950 mb-2">
                  Mühürlü Bir Mektubun Var!
                </h3>
                <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto leading-relaxed">
                  {readingLetter.senderName} sana özenle bir mektup hazırladı ve mühürledi. Mektubu okumak için aşağıdaki balmumu mühüre dokun veya tıkla.
                </p>
              </div>

              {/* Red Wax Seal Button */}
              <button
                onClick={handleBreakSeal}
                className="relative group w-24 h-24 rounded-full bg-gradient-to-br from-red-600 via-red-800 to-rose-950 border-4 border-rose-200 text-white font-serif font-bold shadow-xl transform transition active:scale-90 hover:scale-105 flex flex-col items-center justify-center wax-seal-pulse cursor-pointer"
              >
                <div className="text-[10px] uppercase font-bold tracking-widest text-rose-100">
                  Mühürü Kır
                </div>
                <div className="text-3xl mt-1">💌</div>
              </button>
            </div>
          ) : (
            /* Open Letter View on Parchment Paper Sheet */
            <div
              className={`rounded-2xl p-8 border border-gray-200 shadow-inner relative space-y-6 transition-all duration-500 animate-fadeIn ${paperTheme.className}`}
            >
              {/* Top Stamp & Metadata */}
              <div className="flex items-start justify-between border-b border-black/15 pb-4">
                <div>
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold mb-1.5 text-gray-900">
                    {readingLetter.subject}
                  </h1>
                  <p className="text-xs sm:text-sm font-medium opacity-70 text-gray-800">
                    Gönderen: <span className="font-bold">{readingLetter.senderName}</span> ({readingLetter.senderFlag})
                  </p>
                </div>

                {/* Stamp */}
                <div className="p-2 rounded bg-white/80 border border-black/10 text-center shadow flex flex-col items-center">
                  <span className="text-3xl">{readingLetter.stampFlag}</span>
                  <span className="text-[10px] font-bold block uppercase tracking-tighter opacity-80 mt-1 text-black/70">
                    {readingLetter.stampName}
                  </span>
                </div>
              </div>

              {/* Letter Content Body (Lora font, large) */}
              <div className="font-serif text-base sm:text-lg leading-relaxed whitespace-pre-line text-gray-900 min-h-[220px]">
                {readingLetter.content}
              </div>

              {/* Signature Footer */}
              <div className="pt-6 border-t border-black/15 flex items-center justify-between text-base font-bold text-gray-850">
                <span className="font-handwriting text-2xl">{readingLetter.senderName}</span>
                <span className="text-xs sm:text-sm font-medium opacity-60">
                  {new Date(readingLetter.sentAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Reply Actions */}
        {!isWaxSealed && (
          <div className="px-8 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-base font-bold">
            <button
              onClick={closeReaderModal}
              className="px-6 py-2.5 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 transition cursor-pointer"
            >
              Kapat
            </button>

            {penpal && (
              <button
                onClick={handleReply}
                className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-rose-700 to-red-800 hover:from-rose-800 hover:to-red-900 text-white text-base font-bold shadow-lg transition transform active:scale-95 cursor-pointer"
              >
                <Reply className="w-5 h-5" />
                <span>Mektuba Yanıt Yaz</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
