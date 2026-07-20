'use client';

import React, { useState } from 'react';
import { useDMA } from '@/context/DMAContext';
import { PAPER_THEMES } from '@/data/mockData';
import { PaperThemeId } from '@/types/dma';
import { X, Send, Stamp as StampIcon, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export const LetterWriterModal: React.FC = () => {
  const { writingRecipient, closeWriterModal, sendLetter, stamps } = useDMA();

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
      setErrorMsg('Mektup çok kısa! DMA ruhuna uygun olarak en az 30 kelimelik samimi bir mektup kaleme almanı öneririz.');
      return;
    }

    setErrorMsg('');
    setIsSealing(true);

    // Trigger nostalgia sealing effect
    setTimeout(() => {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#8b261a', '#d4a373', '#f4ebd9'],
      });

      sendLetter({
        recipientId: writingRecipient.id,
        recipientName: writingRecipient.pseudonym,
        subject,
        content,
        paperTheme,
        stampId: selectedStampId,
      });

      setIsSealing(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl bg-[#1a110e] border border-[#3b2a22] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Bar */}
        <div className="px-6 py-4 bg-[#231713] border-b border-[#3b2a22] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center font-serif text-lg font-bold text-white shadow"
              style={{ backgroundColor: writingRecipient.avatarStyle }}
            >
              {writingRecipient.pseudonym[0]}
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-[#f4ebd9]">
                {writingRecipient.pseudonym} için Mektup Yaz
              </h2>
              <p className="text-xs text-[#a89078] font-typewriter">
                {writingRecipient.flag} {writingRecipient.country} • ~{writingRecipient.estimatedDeliveryHours} saat teslimat süresi
              </p>
            </div>
          </div>

          <button
            onClick={closeWriterModal}
            className="p-2 rounded-lg bg-[#2e1f18] text-[#a89078] hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Scrollable */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Controls: Theme & Stamp Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Paper Theme Picker */}
            <div>
              <label className="block text-xs font-serif text-[#d4a373] mb-1.5">
                Kağıt Dokusu & Teması
              </label>
              <div className="grid grid-cols-2 gap-2">
                {PAPER_THEMES.map(theme => (
                  <button
                    key={theme.id}
                    onClick={() => setPaperTheme(theme.id)}
                    className={`px-3 py-2 rounded-lg text-xs font-typewriter text-left border transition flex items-center justify-between ${
                      paperTheme === theme.id
                        ? 'border-[#8b261a] bg-[#3b271d] text-[#f4ebd9] shadow'
                        : 'border-[#33231a] bg-[#1a110e] text-[#a89078] hover:bg-[#251a15]'
                    }`}
                  >
                    <span>{theme.name}</span>
                    {paperTheme === theme.id && <CheckCircle2 className="w-3.5 h-3.5 text-[#e07a5f]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Stamp Selector */}
            <div>
              <label className="block text-xs font-serif text-[#d4a373] mb-1.5">
                Dijital Pul Seçimi
              </label>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {stamps.map(stamp => (
                  <button
                    key={stamp.id}
                    onClick={() => setSelectedStampId(stamp.id)}
                    className={`relative flex-shrink-0 p-1.5 rounded-lg border transition ${
                      selectedStampId === stamp.id
                        ? 'border-[#8b261a] bg-[#3b271d] ring-2 ring-[#8b261a]/50'
                        : 'border-[#3b2a22] bg-[#231713] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div className="text-center">
                      <span className="text-lg block">{stamp.flag}</span>
                      <span className="text-[10px] text-[#d4a373] font-typewriter block truncate max-w-[65px]">
                        {stamp.name}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Letter Envelope / Stationery Paper Sheet */}
          <div
            className={`rounded-xl p-6 transition-all duration-300 ${selectedTheme.className} relative min-h-[320px] flex flex-col justify-between`}
          >
            {/* Stamp Displayed on Top Right of Letter Sheet */}
            <div className="absolute top-4 right-4 p-2 rounded bg-white/10 backdrop-blur border border-black/10 shadow flex flex-col items-center">
              <span className="text-2xl">{selectedStamp.flag}</span>
              <span className="text-[9px] font-typewriter uppercase tracking-wider font-bold mt-1 text-black/70">
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
                className="w-full bg-transparent border-b border-black/20 pb-2 mb-4 font-serif text-lg sm:text-xl font-bold focus:outline-none focus:border-black/50 placeholder:opacity-50"
              />

              {/* Main Letter Body (Typewriter font) */}
              <textarea
                placeholder={`Sevgili ${writingRecipient.pseudonym},\n\nBuraya içinden geçenleri içtenlikle kaleme alabilirsin... Fotoğrafsız, telaşsız ve samimi.`}
                value={content}
                onChange={e => setContent(e.target.value)}
                rows={10}
                className="w-full bg-transparent font-typewriter text-sm sm:text-base leading-relaxed focus:outline-none resize-none placeholder:opacity-50"
              />
            </div>

            {/* Word Counter & Guidelines */}
            <div className="pt-4 border-t border-black/10 flex items-center justify-between text-xs opacity-75 font-typewriter">
              <span>Kelime Sayısı: {wordCount} (Önerilen: 30+ kelime)</span>
              <span>Rumuzun: NostaljikDüşünür</span>
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-[#8b261a]/20 border border-[#8b261a] text-[#e07a5f] text-xs font-sans">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-[#231713] border-t border-[#3b2a22] flex items-center justify-between">
          <p className="text-xs text-[#a89078] hidden sm:block font-serif italic">
            "Mektup mühürlendiğinde anında ulaşmaz, sabırla beklenir."
          </p>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={closeWriterModal}
              className="px-4 py-2 rounded-lg bg-[#2e1f18] hover:bg-[#3b2a22] text-[#a89078] text-xs font-medium transition"
            >
              Vazgeç
            </button>

            <button
              onClick={handleSend}
              disabled={isSealing}
              className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#8b261a] to-[#b83b28] hover:from-[#a83222] hover:to-[#d44834] text-white text-sm font-bold shadow-xl transition transform active:scale-95 ${
                isSealing ? 'opacity-80 cursor-wait' : ''
              }`}
            >
              {isSealing ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Balmumu Mühür Basılıyor...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
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
