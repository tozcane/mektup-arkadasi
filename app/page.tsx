'use client';

import React, { useState } from 'react';
import { DMAProvider, useDMA } from '@/context/DMAContext';
import { Navbar } from '@/components/layout/Navbar';
import { PenPalCard } from '@/components/dma/PenPalCard';
import { LetterWriterModal } from '@/components/dma/LetterWriterModal';
import { LetterReaderModal } from '@/components/dma/LetterReaderModal';
import { EnRouteSection } from '@/components/dma/EnRouteSection';
import { StampAlbum } from '@/components/dma/StampAlbum';
import { ProfileModal } from '@/components/dma/ProfileModal';
import { AuthModal } from '@/components/dma/AuthModal';
import Footer from '@/components/layout/Footer';
import { Mail, Search, Sparkles, Feather, Lock, CheckCircle2, ShieldCheck, Heart, LogIn, Compass, Stamp as StampIcon } from 'lucide-react';

function MainContent() {
  const {
    activeTab,
    setActiveTab,
    letters,
    penpals,
    openReaderModal,
    openWriterModal,
    user,
    setIsAuthModalOpen,
  } = useDMA();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');

  const filteredPenpals = penpals.filter(p => {
    const matchesSearch =
      p.pseudonym.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.country.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTopic =
      selectedTopic === 'all' || p.interests.some(i => i.toLowerCase().includes(selectedTopic.toLowerCase()));

    return matchesSearch && matchesTopic;
  });

  const deliveredLetters = letters.filter(l => l.status !== 'en_route');
  const unreadLetters = letters.filter(l => l.status === 'delivered_unread');

  return (
    <div className="relative min-h-screen bg-white text-gray-900 font-sans selection:bg-rose-700 selection:text-white">
      {/* Side Overlays (Left Man, Right Woman) */}
      <div className="bg-couple-overlay-left" />
      <div className="bg-couple-overlay-right" />

      {/* Navigation Header */}
      <Navbar onAutoAssignPenPal={() => openWriterModal(penpals[0])} />

      {/* Main Container */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 py-10 sm:py-12 space-y-10">
        
        {/* Main Content Card Frame */}
        <div className="relative p-3 sm:p-6 rounded-3xl bg-gray-950/5 border border-gray-200/80 shadow-2xl backdrop-blur-md">
          
          {/* Card Body Container */}
          <div className="bg-white/95 backdrop-blur-lg p-6 sm:p-12 rounded-2xl shadow-xl space-y-10 border border-gray-100">

            {!user.isLoggedIn ? (
              /* =========================================================
                 ZİYARETÇİ / İLK KARŞILAMA SAYFASI (OKUNAKLI BÜYÜTÜLMÜŞ FONT)
                 ========================================================= */
              <section className="space-y-8 py-6 text-center max-w-4xl mx-auto">
                
                {/* 1. Brand Badge */}
                <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-sm sm:text-base font-typewriter font-bold shadow-sm">
                  <Sparkles className="w-5 h-5 text-amber-500 animate-spin" />
                  <span>mektuparkadasi.net — Nostaljik & Yavaş İletişim Kulübü</span>
                </div>

                {/* 2. Hero Title (Büyütüldü) */}
                <h1 className="font-serif text-4xl sm:text-[3.5rem] font-bold text-gray-900 leading-tight tracking-tight">
                  Fotoğrafların Değil, Düşüncelerin Konuşulduğu Köşe.
                </h1>

                {/* 3. Hero Subtitle (Büyütüldü) */}
                <p className="text-base sm:text-xl text-gray-700 font-typewriter leading-relaxed max-w-3xl mx-auto font-medium">
                  Hızlı dünyanın gürültüsünden uzaklaşın. Fotoğraf yok, anlık telaş yok. Dünyanın dört bir yanından insanlarla samimi mektuplar yazışın, beklemenin heyecanını yaşayın.
                </p>

                {/* 4. Action Buttons (Büyütüldü) */}
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-5">
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-4.5 rounded-2xl bg-gradient-to-r from-rose-700 to-red-800 hover:from-rose-800 hover:to-red-900 text-white font-bold text-base sm:text-lg shadow-xl transition transform active:scale-95 cursor-pointer"
                  >
                    <Feather className="w-6 h-6" />
                    <span>✨ Üye Ol & Mektup Sandığını Aç</span>
                  </button>

                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-4.5 rounded-2xl bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-800 font-bold text-base sm:text-lg transition cursor-pointer"
                  >
                    <LogIn className="w-6 h-6 text-gray-700" />
                    <span>🔑 Zaten Üyeyim, Giriş Yap</span>
                  </button>
                </div>

                {/* 5. Trust & Privacy Notice */}
                <div className="pt-8 border-t border-gray-100 space-y-8">
                  <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-left max-w-3xl mx-auto flex items-start gap-4 shadow-sm">
                    <ShieldCheck className="w-8 h-8 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div className="space-y-1.5">
                      <span className="font-serif font-bold text-emerald-950 text-base sm:text-lg block">
                        🔐 %100 Uçtan Uca Gizlilik & Güven Garantisi
                      </span>
                      <p className="text-emerald-900 leading-relaxed font-sans text-sm sm:text-base">
                        Mektuplarınız tamamen size ve mektup arkadaşınıza özeldir. Dışarıdan veya ziyaretçilerden tamamen gizlidir. Gerçek ad ve soyad istenmez, sadece rumuzunuzla iletişim kurarsınız.
                      </p>
                    </div>
                  </div>

                  {/* 6. Özellik Kartları (Büyütüldü) */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left pt-2">
                    
                    {/* Kart 1: Anonim & Fotoğrafsız */}
                    <div className="relative p-6 rounded-2xl bg-gradient-to-b from-amber-50/80 to-white border-2 border-amber-200/80 shadow-md hover:shadow-lg transition group space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 text-amber-900 flex items-center justify-center text-2xl shadow-sm">
                        🎭
                      </div>
                      <h3 className="font-serif font-bold text-lg sm:text-xl text-gray-900 group-hover:text-rose-800 transition">
                        Anonim & Fotoğrafsız
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-700 font-typewriter leading-relaxed">
                        Dış görünüş veya unvan yok. Sadece önyargısız duygu ve düşünceler konuşur.
                      </p>
                    </div>

                    {/* Kart 2: Balmumu Mühür */}
                    <div className="relative p-6 rounded-2xl bg-gradient-to-b from-rose-50/80 to-white border-2 border-rose-200/80 shadow-md hover:shadow-lg transition group space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-rose-100 border border-rose-300 text-rose-900 flex items-center justify-center text-2xl shadow-sm">
                        🕯️
                      </div>
                      <h3 className="font-serif font-bold text-lg sm:text-xl text-gray-900 group-hover:text-rose-800 transition">
                        Balmumu Mühür
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-700 font-typewriter leading-relaxed">
                        Mektubunuzu özel balmumu mühürle kapatın, alıcısı sandığında heyecanla kırsın.
                      </p>
                    </div>

                    {/* Kart 3: Yavaş & Değerli Teslimat */}
                    <div className="relative p-6 rounded-2xl bg-gradient-to-b from-emerald-50/80 to-white border-2 border-emerald-200/80 shadow-md hover:shadow-lg transition group space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-900 flex items-center justify-center text-2xl shadow-sm">
                        🕊️
                      </div>
                      <h3 className="font-serif font-bold text-lg sm:text-xl text-gray-900 group-hover:text-rose-800 transition">
                        Yavaş & Değerli Teslimat
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-700 font-typewriter leading-relaxed">
                        Mektuplar anında gitmez, mesafe kat eder. Beklemek mektubu kıymetli kılar.
                      </p>
                    </div>

                  </div>
                </div>

              </section>
            ) : (
              /* =========================================================
                 ÜYE GİRİŞİ YAPILDIKTAN SONRAKİ DASHBOARD (BÜYÜTÜLMÜŞ FONT)
                 ========================================================= */
              <div className="space-y-8">
                
                {/* User Welcome Header */}
                <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3.5">
                  <ShieldCheck className="w-7 h-7 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="font-serif font-bold text-emerald-900 text-lg sm:text-xl block">
                      Hoş Geldin {user.pseudonym}! 🔐 %100 Özel Sandığın Aktif
                    </span>
                    <p className="text-emerald-800 text-sm sm:text-base leading-relaxed font-sans">
                      Sandığındaki tüm mektuplar tamamen sana özeldir. Başka kimse göremez.
                    </p>
                  </div>
                </div>

                {/* 1. Mektup Sandığı (Gelen Kutusu) */}
                {activeTab === 'inbox' && (
                  <section className="space-y-6">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                      <div>
                        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2.5">
                          <span>📩 Mektup Sandığım</span>
                          {unreadLetters.length > 0 && (
                            <span className="text-xs px-3 py-0.5 rounded-full bg-rose-700 text-white font-bold font-typewriter animate-pulse">
                              {unreadLetters.length} Mühürlü Mektup!
                            </span>
                          )}
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-500 font-typewriter mt-1">
                          Gizli ve kişiye özel gelen mühürlü mektupların ve arşivin.
                        </p>
                      </div>
                    </div>

                    {deliveredLetters.length === 0 ? (
                      <div className="rounded-2xl bg-gray-50 border border-gray-200 p-10 text-center space-y-3">
                        <Mail className="w-14 h-14 text-gray-400 mx-auto opacity-60" />
                        <h3 className="font-serif text-xl font-bold text-gray-800">Sandığın Henüz Boş</h3>
                        <p className="text-xs sm:text-sm text-gray-500 font-typewriter max-w-sm mx-auto">
                          Sana henüz ulaşan bir mektup yok. Mektup arkadaşlarına yazarak ilk mektubu gönderebilirsin!
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {deliveredLetters.map(letter => {
                          const isUnread = letter.status === 'delivered_unread';

                          return (
                            <div
                              key={letter.id}
                              onClick={() => openReaderModal(letter)}
                              className={`group relative rounded-2xl p-6 border transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-sm hover:shadow-md ${
                                isUnread
                                  ? 'bg-gradient-to-b from-rose-50/90 to-amber-50/90 border-rose-300 hover:border-rose-400 ring-2 ring-rose-200'
                                  : 'bg-white border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`w-11 h-11 rounded-full flex items-center justify-center font-serif font-bold text-white text-lg shadow-sm ${
                                      isUnread ? 'bg-rose-700 animate-bounce' : 'bg-gray-800'
                                    }`}
                                  >
                                    {letter.senderName[0]}
                                  </div>
                                  <div>
                                    <h3 className="font-serif text-lg sm:text-xl font-bold text-gray-900 group-hover:text-rose-700 transition">
                                      {letter.senderName} {letter.senderFlag}
                                    </h3>
                                    <p className="text-xs sm:text-sm text-gray-500 font-typewriter">
                                      {new Date(letter.deliveredAt || letter.sentAt).toLocaleDateString('tr-TR')}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/80 border border-amber-200 text-xs sm:text-sm text-amber-900 font-typewriter font-bold">
                                  <span>{letter.stampFlag}</span>
                                  <span>{letter.stampName}</span>
                                </div>
                              </div>

                              <div className="mb-4">
                                <h4 className="font-serif text-base sm:text-lg font-bold text-gray-900 mb-1">
                                  {letter.subject}
                                </h4>
                                <p className="text-xs sm:text-sm text-gray-600 font-typewriter line-clamp-2 leading-relaxed">
                                  {letter.content}
                                </p>
                              </div>

                              <div className="pt-3 border-t border-gray-200/60 flex items-center justify-between text-xs sm:text-sm">
                                {isUnread ? (
                                  <div className="flex items-center gap-1.5 text-rose-700 font-typewriter font-bold">
                                    <Lock className="w-4 h-4" />
                                    <span>Balmumu Mühürü Kır & Oku</span>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-1.5 text-emerald-700 font-typewriter font-medium">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                    <span>Okundu & Arşivde</span>
                                  </div>
                                )}

                                <span className="text-xs sm:text-sm font-bold text-gray-800 group-hover:translate-x-1 transition font-typewriter">
                                  Oku →
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </section>
                )}

                {/* Tab 2: Yoldaki Mektuplar */}
                {activeTab === 'en_route' && <EnRouteSection letters={letters} />}

                {/* Tab 3: Mektup Arkadaşı Bul */}
                {activeTab === 'penpals' && (
                  <section className="space-y-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
                      <div className="relative w-full sm:w-72">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Rumuz, ülke veya biyografi ara..."
                          value={searchQuery}
                          onChange={e => setSearchQuery(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-xs sm:text-sm font-typewriter text-gray-900 focus:outline-none focus:border-rose-600"
                        />
                      </div>

                      <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                        {[
                          { id: 'all', label: 'Tümü' },
                          { id: 'Edebiyat', label: '📖 Edebiyat' },
                          { id: 'Hayat Yorgunluğu', label: '☕ Yorgun Ruhlar' },
                          { id: 'Gece Sohbetleri', label: '🌙 Gece Yazarları' },
                          { id: 'Yabancı Dil', label: '🌍 Dil Pratiği' },
                        ].map(topic => (
                          <button
                            key={topic.id}
                            onClick={() => setSelectedTopic(topic.id)}
                            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-typewriter whitespace-nowrap border transition ${
                              selectedTopic === topic.id
                                ? 'bg-rose-700 border-rose-700 text-white font-bold'
                                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            {topic.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {filteredPenpals.map(profile => (
                        <PenPalCard key={profile.id} profile={profile} />
                      ))}
                    </div>
                  </section>
                )}

                {/* Tab 4: Pul Albümü */}
                {activeTab === 'stamps' && <StampAlbum />}

              </div>
            )}

          </div>

        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Global Modals */}
      <LetterWriterModal />
      <LetterReaderModal />
      <ProfileModal />
      <AuthModal />
    </div>
  );
}

export default function Home() {
  return (
    <DMAProvider>
      <MainContent />
    </DMAProvider>
  );
}