'use client';

import React, { useState } from 'react';
import { useDMA } from '@/context/DMAContext';
import { PAPER_THEMES } from '@/data/mockData';
import { PaperThemeId } from '@/types/dma';
import { X, Send, Stamp as StampIcon, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { containsAbusiveLanguage, sanitizeInput } from '@/utils/security';

export const LetterWriterModal: React.FC = () => {
  const { writingRecipient, closeWriterModal, sendLetter, stamps, user } = useDMA();

  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [paperTheme, setPaperTheme] = useState<PaperThemeId>('parchment');
  const [selectedStampId, setSelectedStampId] = useState<string>(stamps[0]?.id || 'stamp-1');
  const [isSealing, setIsSealing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!writingRecipient) return null;

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const selectedTheme = PAPER_THEMES.find(t => t.id === paperTheme) || PAPER_THEMES[0];
  const selectedStamp = stamps.find(s => s.id === selectedStampId) || stamps[0];

  const handleSend = () => {
    if (!subject.trim()) {
      setErrorMsg('Lütfen mektubuna bir başlık ver.');
      return;
    }
    if (wordCount < 30) {
      setErrorMsg('Mektup çok kısa! En az 30 kelimelik samimi bir mektup yazmanı öneririz.');
      return;
    }

    // Security & Abuse Check
    if (containsAbusiveLanguage(subject) || containsAbusiveLanguage(content)) {
      setErrorMsg('⚠️ Mektubunuz topluluk kurallarımıza aykırı (argo, küfür veya hakaret) kelimeler barındırmaktadır. Mektup Arkadaşı samimiyet ve saygı esasına dayanır. Lütfen daha saygılı bir dil kullanın.');
      return;
    }

    const sanitizedSubject = sanitizeInput(subject);
    const sanitizedContent = sanitizeInput(content);

    setErrorMsg('');
    setIsSealing(true);

    // Trigger nostalgia sealing effect
    setTimeout(() => {
      confetti({
        particleCount: 55,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#8b261a', '#d4a373', '#f4ebd9'],
      });

      sendLetter({
        recipientId: writingRecipient.id,
        recipientName: writingRecipient.pseudonym,
        subject: sanitizedSubject,
        content: sanitizedContent,
        paperTheme,
        stampId: selectedStampId,
      });

      setIsSealing(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-3xl bg-white border border-gray-200 shadow-2xl overflow-hidden flex flex-col my-8">
        
        {/* Header Bar */}
        <div className="px-8 py-6 bg-gradient-to-r from-rose-950 via-rose-900 to-amber-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center font-serif text-xl font-bold text-white shadow-md"
              style={{ backgroundColor: writingRecipient.avatarStyle }}
            >
              {writingRecipient.pseudonym[0]}
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold tracking-wide">
                {writingRecipient.pseudonym} için Mektup Yaz
              </h2>
              <p className="text-sm text-amber-200/90 font-medium">
                {writingRecipient.flag} {writingRecipient.country} • ~{writingRecipient.estimatedDeliveryHours} saat teslimat süresi
              </p>
            </div>
          </div>

          <button
            onClick={closeWriterModal}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-200 transition cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body Scrollable (Büyük Fontlar) */}
        <div className="p-8 overflow-y-auto space-y-6 flex-1 text-base text-gray-900">
          
          {/* Controls: Theme & Stamp Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Paper Theme Picker */}
            <div>
              <label className="block text-base font-bold text-gray-900 mb-2">
                Kağıt Dokusu & Teması
              </label>
              <div className="grid grid-cols-2 gap-3">
                {PAPER_THEMES.map(theme => (
                  <button
                    key={theme.id}
                    onClick={() => setPaperTheme(theme.id)}
                    className={`px-4 py-3 rounded-xl text-sm font-bold text-left border-2 transition flex items-center justify-between cursor-pointer ${
                      paperTheme === theme.id
                        ? 'border-rose-700 bg-rose-50/50 text-rose-900 shadow-sm'
                        : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>{theme.name}</span>
                    {paperTheme === theme.id && <CheckCircle2 className="w-4 h-4 text-rose-700" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Stamp Selector */}
            <div>
              <label className="block text-base font-bold text-gray-900 mb-2">
                Dijital Pul Seçimi
              </label>
              <div className="flex gap-2.5 overflow-x-auto pb-1.5">
                {stamps.map(stamp => (
                  <button
                    key={stamp.id}
                    onClick={() => setSelectedStampId(stamp.id)}
                    className={`relative flex-shrink-0 p-2 rounded-xl border-2 transition cursor-pointer ${
                      selectedStampId === stamp.id
                        ? 'border-rose-700 bg-rose-50/50 ring-2 ring-rose-200'
                        : 'border-gray-200 bg-white opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div className="text-center">
                      <span className="text-xl block">{stamp.flag}</span>
                      <span className="text-xs font-bold text-gray-800 block truncate max-w-[70px] mt-0.5">
                        {stamp.name}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Letter Stationery Paper Sheet */}
          <div
            className={`rounded-2xl p-8 border-2 border-gray-200/60 shadow-inner relative min-h-[360px] flex flex-col justify-between ${selectedTheme.className}`}
          >
            {/* Stamp Displayed on Top Right of Letter Sheet */}
            <div className="absolute top-6 right-6 p-2 rounded bg-white/80 backdrop-blur border border-black/10 shadow flex flex-col items-center">
              <span className="text-3xl">{selectedStamp.flag}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider mt-1 text-black/70">
                {selectedStamp.country}
              </span>
            </div>

            <div>
              {/* Subject Input */}
              <input
                type="text"
                placeholder="Mektup Başlığı (Örn: Yağmurlu bir İstanbul gününden selamlar...)"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                className="w-full bg-transparent border-b-2 border-black/20 pb-3 mb-6 font-serif text-xl sm:text-2xl font-bold focus:outline-none focus:border-black/50 placeholder:opacity-50 text-gray-900"
              />

              {/* Main Letter Body */}
              <textarea
                placeholder={`Sevgili ${writingRecipient.pseudonym},\n\nBuraya içinden geçenleri içtenlikle kaleme alabilirsin... Fotoğrafsız, telaşsız ve samimi.`}
                value={content}
                onChange={e => setContent(e.target.value)}
                rows={11}
                className="w-full bg-transparent font-serif text-base sm:text-lg leading-relaxed focus:outline-none resize-none placeholder:opacity-50 text-gray-900"
              />
            </div>

            {/* Word Counter & Guidelines */}
            <div className="pt-4 border-t border-black/10 flex items-center justify-between text-xs sm:text-sm font-medium opacity-80">
              <span>Kelime Sayısı: {wordCount} (Önerilen: 30+ kelime)</span>
              <span>Gönderen Rumuz: {user.pseudonym}</span>
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="flex items-center gap-2.5 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-bold">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-8 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-base font-bold">
          <p className="text-xs sm:text-sm text-gray-600 hidden sm:block font-serif italic">
            "Mektup mühürlendiğinde anında ulaşmaz, sabırla beklenir."
          </p>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={closeWriterModal}
              className="px-6 py-2.5 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 transition cursor-pointer text-base"
            >
              Vazgeç
            </button>

            <button
              onClick={handleSend}
              disabled={isSealing}
              className={`flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-rose-700 to-red-800 hover:from-rose-800 hover:to-red-900 text-white text-base font-bold shadow-lg transition transform active:scale-95 cursor-pointer ${
                isSealing ? 'opacity-80 cursor-wait' : ''
              }`}
            >
              {isSealing ? (
                <>
                  <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Balmumu Mühür Basılıyor...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 animate-pulse" />
                  <span>Mühürle ve Gönder</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
