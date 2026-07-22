'use client';

import React, { useState, useEffect } from 'react';
import { Letter } from '@/types/dma';
import { Send, Clock, Plane, MapPin, Sparkles } from 'lucide-react';
import { useDMA } from '@/context/DMAContext';

interface EnRouteSectionProps {
  letters: Letter[];
}

export const EnRouteSection: React.FC<EnRouteSectionProps> = ({ letters }) => {
  const { openReaderModal, user } = useDMA();
  const enRouteLetters = letters.filter(
    l => l.status === 'en_route' && (l.senderId === user.id || l.recipientId === user.id)
  );

  if (enRouteLetters.length === 0) {
    return (
      <div className="rounded-3xl bg-gray-50 border border-gray-200 p-12 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700 mx-auto shadow-sm">
          <Send className="w-8 h-8 opacity-75" />
        </div>
        <h3 className="font-serif text-2xl font-bold text-gray-900">Şu Anda Yolda Olan Mektup Yok</h3>
        <p className="text-base text-gray-600 max-w-md mx-auto leading-relaxed">
          Mektup arkadaşlarına kaleme aldığın mektuplar veya sana gelenler burada yolculuk eder. Yavaş teslimat heyecanını yaşamak için bir mektup kaleme alabilirsin!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2.5">
            <span>🕊️ Yoldaki Mektuplar</span>
            <span className="text-xs px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 font-bold font-typewriter">
              {enRouteLetters.length} Mektup Süzülüyor
            </span>
          </h2>
          <p className="text-sm text-gray-500 font-typewriter mt-1">
            Yavaş teslimat simülasyonu: Mektuplar anında gitmez, mesafe kat eder.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {enRouteLetters.map(letter => (
          <EnRouteCard key={letter.id} letter={letter} />
        ))}
      </div>
    </div>
  );
};

const EnRouteCard: React.FC<{ letter: Letter }> = ({ letter }) => {
  const { user } = useDMA();
  const isOutgoing = letter.senderId === user.id;

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
    <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-md relative overflow-hidden space-y-4">
      {/* Top Banner Tag Indicator */}
      <div className="flex items-center justify-between pb-1 border-b border-gray-50">
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-typewriter shadow-sm border ${
          isOutgoing
            ? 'bg-amber-50 border-amber-250 text-amber-900'
            : 'bg-rose-50 border-rose-250 text-rose-900 ring-2 ring-rose-100/50'
        }`}>
          {isOutgoing ? '📤 Giden Mektubun' : '📥 Gelen Mektubun'}
        </span>
        
        <span className="text-[10px] text-gray-500 font-typewriter font-medium">
          {isOutgoing 
            ? `${letter.recipientName} alıcısına doğru gidiyor` 
            : `${letter.senderName} sana gönderdi, geliyor`}
        </span>
      </div>

      {/* Flight / Pigeon Trail Background Effect */}
      <div className="flex items-center justify-between text-xs sm:text-sm text-gray-605 font-typewriter font-bold pt-1">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-rose-700" />
          <span>{letter.senderName} ({letter.senderFlag}) {letter.senderId === user.id ? '(Sen)' : ''}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span>{letter.recipientName} {letter.recipientId === user.id ? '(Sen)' : ''}</span>
          <MapPin className="w-4 h-4 text-rose-700" />
        </div>
      </div>

      {/* Subject Line */}
      <div>
        <h4 className="font-serif text-lg font-bold text-gray-900 truncate">
          {letter.subject}
        </h4>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Pul: {letter.stampFlag} {letter.stampName}
        </p>
      </div>

      {/* Progress Travel Bar */}
      <div className="relative py-2.5">
        <div className="h-2.5 w-full rounded-full bg-gray-105 border border-gray-200 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-rose-700 via-rose-500 to-amber-500 transition-all duration-500"
            style={{ width: `${timeLeft.progress}%` }}
          />
        </div>

        {/* Animated Flying Pigeon / Plane on Bar */}
        <div
          className="absolute top-[3px] transition-all duration-500 transform -translate-x-1/2"
          style={{ left: `${Math.max(5, Math.min(95, timeLeft.progress))}%` }}
        >
          <div className="w-7 h-7 rounded-full bg-rose-700 text-white flex items-center justify-center shadow-lg animate-bounce">
            <Plane className={`w-4 h-4 transform ${isOutgoing ? 'rotate-45' : '-rotate-135 scale-y-[-1]'}`} />
          </div>
        </div>
      </div>

      {/* Countdown Timer */}
      <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs sm:text-sm font-bold">
        <div className="flex items-center gap-1.5 text-rose-700 font-typewriter">
          <Clock className="w-4.5 h-4.5 animate-spin text-rose-600" />
          <span>
            {timeLeft.hours}s {timeLeft.minutes}d {timeLeft.seconds}sn varışa kaldı
          </span>
        </div>

        <span className="text-xs text-gray-500 font-typewriter">
          %{Math.round(timeLeft.progress)} Yol tamamlandı
        </span>
      </div>
    </div>
  );
};
