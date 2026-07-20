'use client';

import React, { useState } from 'react';
import { useDMA } from '@/context/DMAContext';
import { PAPER_THEMES } from '@/data/mockData';
import { X, Reply, Stamp as StampIcon, Heart, Calendar, Lock } from 'lucide-react';
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
      particleCount: 40,
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
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#1a110e] border border-[#3b2a22] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Bar */}
        <div className="px-6 py-4 bg-[#231713] border-b border-[#3b2a22] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#8b261a] text-white flex items-center justify-center font-serif text-base font-bold shadow">
              {readingLetter.senderName[0]}
            </div>
            <div>
              <h2 className="font-serif text-base font-bold text-[#f4ebd9]">
                {readingLetter.senderName} {readingLetter.senderFlag}
              </h2>
              <p className="text-[11px] text-[#a89078] font-typewriter">
                Teslim Edildi: {new Date(readingLetter.deliveredAt || readingLetter.sentAt).toLocaleDateString('tr-TR')}
              </p>
            </div>
          </div>

          <button
            onClick={closeReaderModal}
            className="p-2 rounded-lg bg-[#2e1f18] text-[#a89078] hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {isWaxSealed ? (
            /* Sealed Envelope Interactive Screen */
            <div className="my-8 py-12 px-6 rounded-xl border border-[#4a3429] bg-gradient-to-b from-[#2a1b15] to-[#1e130f] text-center flex flex-col items-center justify-center space-y-6 shadow-2xl">
              <div className="w-16 h-16 rounded-full bg-[#8b261a]/20 border border-[#8b261a] flex items-center justify-center text-[#e07a5f] animate-pulse">
                <Lock className="w-8 h-8" />
              </div>

              <div>
                <h3 className="font-serif text-xl font-bold text-[#f4ebd9] mb-2">
                  Mühürlü Bir Mektubun Var!
                </h3>
                <p className="text-xs text-[#a89078] max-w-md mx-auto font-typewriter leading-relaxed">
                  {readingLetter.senderName} sana özenle bir mektup hazırladı ve mühürledi. Mektubu okumak için aşağıdaki balmumu mühüre dokun veya tıkla.
                </p>
              </div>

              {/* Red Wax Seal Button */}
              <button
                onClick={handleBreakSeal}
                className="relative group w-24 h-24 rounded-full bg-gradient-to-br from-[#9e1c1c] via-[#751212] to-[#470a0a] border-4 border-[#c94949]/30 text-white font-serif font-bold shadow-2xl transform transition active:scale-90 hover:scale-105 flex flex-col items-center justify-center wax-seal-pulse"
              >
                <div className="text-[10px] uppercase font-typewriter tracking-widest text-[#f8d7da]">
                  Mühürü Kır
                </div>
                <div className="text-2xl mt-1">💌</div>
              </button>
            </div>
          ) : (
            /* Open Letter View on Vintage Paper */
            <div
              className={`rounded-xl p-6 sm:p-8 ${paperTheme.className} relative shadow-2xl space-y-6 transition-all duration-500 animate-fadeIn`}
            >
              {/* Top Stamp & Metadata */}
              <div className="flex items-start justify-between border-b border-black/15 pb-4">
                <div>
                  <h1 className="font-serif text-xl sm:text-2xl font-bold mb-1">
                    {readingLetter.subject}
                  </h1>
                  <p className="text-xs font-typewriter opacity-70">
                    Gönderen: <span className="font-bold">{readingLetter.senderName}</span> ({readingLetter.senderFlag})
                  </p>
                </div>

                {/* Stamp */}
                <div className="p-2 rounded bg-white/20 border border-black/10 text-center shadow">
                  <span className="text-2xl">{readingLetter.stampFlag}</span>
                  <span className="text-[9px] font-typewriter block uppercase tracking-tighter opacity-80 mt-0.5">
                    {readingLetter.stampName}
                  </span>
                </div>
              </div>

              {/* Letter Content Body */}
              <div className="font-typewriter text-sm sm:text-base leading-relaxed whitespace-pre-line text-[#2c211b]">
                {readingLetter.content}
              </div>

              {/* Signature Footer */}
              <div className="pt-6 border-t border-black/15 flex items-center justify-between text-xs font-handwriting text-2xl">
                <span>{readingLetter.senderName}</span>
                <span className="text-xs font-typewriter opacity-60">
                  {new Date(readingLetter.sentAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Reply Actions */}
        {!isWaxSealed && (
          <div className="px-6 py-4 bg-[#231713] border-t border-[#3b2a22] flex items-center justify-between">
            <button
              onClick={closeReaderModal}
              className="px-4 py-2 rounded-lg bg-[#2e1f18] hover:bg-[#3b2a22] text-[#a89078] text-xs font-medium transition"
            >
              Kapat
            </button>

            {penpal && (
              <button
                onClick={handleReply}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#8b261a] to-[#b83b28] hover:from-[#a83222] hover:to-[#d44834] text-white text-xs sm:text-sm font-bold shadow-lg transition transform active:scale-95"
              >
                <Reply className="w-4 h-4" />
                <span>Mektuba Yanıt Yaz</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
