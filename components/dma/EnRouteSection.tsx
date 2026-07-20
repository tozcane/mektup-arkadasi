'use client';

import React, { useState, useEffect } from 'react';
import { Letter } from '@/types/dma';
import { Send, Clock, Plane, MapPin, Sparkles } from 'lucide-react';
import { useDMA } from '@/context/DMAContext';

interface EnRouteSectionProps {
  letters: Letter[];
}

export const EnRouteSection: React.FC<EnRouteSectionProps> = ({ letters }) => {
  const { openReaderModal } = useDMA();
  const enRouteLetters = letters.filter(l => l.status === 'en_route');

  if (enRouteLetters.length === 0) {
    return (
      <div className="rounded-2xl bg-[#1e130f] border border-[#3b2a22] p-8 sm:p-12 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#2a1b15] border border-[#4a3429] flex items-center justify-center text-[#d4a373] mx-auto">
          <Send className="w-8 h-8 opacity-60" />
        </div>
        <h3 className="font-serif text-xl font-bold text-[#f4ebd9]">Şu Anda Yolda Olan Mektup Yok</h3>
        <p className="text-xs text-[#a89078] max-w-md mx-auto font-typewriter leading-relaxed">
          Mektup arkadaşlarına kaleme aldığın mektuplar veya sana gelenler burada yolculuk eder. Yavaş teslimat heyecanını yaşamak için bir mektup kaleme alabilirsin!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-xl font-bold text-[#f4ebd9] flex items-center gap-2">
            <span>🕊️ Yoldaki Mektuplar</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#8b261a]/30 text-[#e07a5f] border border-[#8b261a]/50 font-typewriter">
              {enRouteLetters.length} Mektup Süzülüyor
            </span>
          </h2>
          <p className="text-xs text-[#a89078] font-typewriter mt-1">
            DMA yolculuk simülasyonu: Mektuplar anında gitmez, mesafe kat eder.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {enRouteLetters.map(letter => (
          <EnRouteCard key={letter.id} letter={letter} />
        ))}
      </div>
    </div>
  );
};

const EnRouteCard: React.FC<{ letter: Letter }> = ({ letter }) => {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number; progress: number }>({
    hours: 0,
    minutes: 0,
    seconds: 0,
    progress: 0,
  });

  useEffect(() => {
    const calculateTime = () => {
      const sent = new Date(letter.sentAt).getTime();
      const target = new Date(letter.estimatedDeliveryAt).getTime();
      const now = new Date().getTime();

      const totalDuration = target - sent;
      const elapsed = now - sent;

      const remaining = Math.max(0, target - now);
      const hours = Math.floor(remaining / (1000 * 60 * 60));
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

      const progress = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));

      setTimeLeft({ hours, minutes, seconds, progress });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [letter]);

  return (
    <div className="rounded-xl bg-gradient-to-b from-[#231713] to-[#1a110e] border border-[#3b2a22] p-5 shadow-lg relative overflow-hidden space-y-4">
      {/* Flight / Pigeon Trail Background Effect */}
      <div className="flex items-center justify-between text-xs text-[#d4a373] font-typewriter">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-[#8b261a]" />
          <span>{letter.senderName} ({letter.senderFlag})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span>{letter.recipientName}</span>
          <MapPin className="w-4 h-4 text-[#d4a373]" />
        </div>
      </div>

      {/* Subject Line */}
      <div>
        <h4 className="font-serif text-base font-bold text-[#f4ebd9] truncate">
          {letter.subject}
        </h4>
        <p className="text-[11px] text-[#a89078] font-typewriter mt-0.5">
          Pul: {letter.stampFlag} {letter.stampName}
        </p>
      </div>

      {/* Progress Travel Bar */}
      <div className="relative py-2">
        <div className="h-2 w-full rounded-full bg-[#140e0c] border border-[#3b2a22] overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#8b261a] via-[#e07a5f] to-[#d4a373] transition-all duration-500"
            style={{ width: `${timeLeft.progress}%` }}
          />
        </div>

        {/* Animated Flying Pigeon / Plane on Bar */}
        <div
          className="absolute top-[3px] transition-all duration-500 transform -translate-x-1/2"
          style={{ left: `${Math.max(5, Math.min(95, timeLeft.progress))}%` }}
        >
          <div className="w-6 h-6 rounded-full bg-[#8b261a] text-white flex items-center justify-center shadow-lg animate-bounce">
            <Plane className="w-3.5 h-3.5 transform rotate-45" />
          </div>
        </div>
      </div>

      {/* Countdown Timer */}
      <div className="pt-2 border-t border-[#33231a] flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-[#e07a5f] font-typewriter font-bold">
          <Clock className="w-4 h-4 animate-spin" />
          <span>
            {timeLeft.hours}s {timeLeft.minutes}d {timeLeft.seconds}sn varışa kaldı
          </span>
        </div>

        <span className="text-[10px] text-[#8e7865] font-typewriter">
          %{Math.round(timeLeft.progress)} Yol tamamlandı
        </span>
      </div>
    </div>
  );
};
