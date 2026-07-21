'use client';

import React, { useState, useEffect } from 'react';
import { DMAProvider, useDMA } from '@/context/DMAContext';
import { Navbar } from '@/components/layout/Navbar';
import { PenPalCard } from '@/components/dma/PenPalCard';
import { LetterWriterModal } from '@/components/dma/LetterWriterModal';
import { LetterReaderModal } from '@/components/dma/LetterReaderModal';
import { EnRouteSection } from '@/components/dma/EnRouteSection';
import { StampAlbum } from '@/components/dma/StampAlbum';
import { ProfileModal } from '@/components/dma/ProfileModal';
import { AuthModal } from '@/components/dma/AuthModal';
import { Mail, Search, Sparkles, Feather, Lock, CheckCircle2, ShieldCheck, LogIn, Compass, Stamp as StampIcon, Table, Send } from 'lucide-react';

const STATUS_OPTIONS = [
  '🟢 Çevrimiçi',
  '🟢 Çevrimiçi',
  '⚪ Çevrimdışı',
  '✍️ Mektup Yazıyor...',
  '📬 Mektup Okuyor...',
  '☕ Uzakta (Kahve Arası)',
];

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
  const [selectedUserForLetters, setSelectedUserForLetters] = useState<string | null>(null);
  const [expandedLetterId, setExpandedLetterId] = useState<string | null>(null);

  // Dynamic user live status state for admin excel sheet
  const [liveStatuses, setLiveStatuses] = useState<Record<string, string>>({});

  // Initialize and simulate live user status updates
  useEffect(() => {
    // Initial load
    const initial: Record<string, string> = {};
    penpals.forEach(p => {
      initial[p.id] = STATUS_OPTIONS[Math.floor(Math.random() * STATUS_OPTIONS.length)];
    });
    setLiveStatuses(initial);

    // Live update interval
    const interval = setInterval(() => {
      setLiveStatuses(prev => {
        const next = { ...prev };
        // Randomly update 1 or 2 users' statuses
        const randomPenpal = penpals[Math.floor(Math.random() * penpals.length)];
        if (randomPenpal) {
          next[randomPenpal.id] = STATUS_OPTIONS[Math.floor(Math.random() * STATUS_OPTIONS.length)];
        }
        return next;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [penpals]);

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

  // Filter letters for the clicked/selected user in admin view
  const userLetters = selectedUserForLetters
    ? letters.filter(
        l =>
          l.senderId === selectedUserForLetters ||
          l.recipientId === selectedUserForLetters ||
          l.senderName === selectedUserForLetters ||
          l.recipientName === selectedUserForLetters
      )
    : [];

  return (
    <div className="relative min-h-screen bg-white text-gray-900 font-sans selection:bg-rose-700 selection:text-white">
      {/* Side Overlays (Left Man, Right Woman) - Hide for Admin */}
      {!user.isAdmin && (
        <>
          <div className="bg-couple-overlay-left" />
          <div className="bg-couple-overlay-right" />
        </>
      )}

      {/* Navigation Header */}
      <Navbar onAutoAssignPenPal={() => openWriterModal(penpals[0])} />

      {/* Main Container */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 py-10 sm:py-12 space-y-10">
        
        {/* Main Content Card Frame */}
        <div className="relative p-3 sm:p-6 rounded-3xl bg-gray-950/5 border border-gray-200/80 shadow-2xl backdrop-blur-md">
          
          {/* Card Body Container */}
          <div className="bg-white/95 backdrop-blur-lg p-6 sm:p-12 rounded-2xl shadow-xl space-y-10 border border-gray-100">

            {!user.isLoggedIn ? (
              /* =========================================================
                 ZİYARETÇİ / İLK KARŞILAMA SAYFASI
                 ========================================================= */
              <section className="space-y-8 py-6 text-center max-w-4xl mx-auto">
                
                {/* 1. Brand Badge */}
                <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-sm sm:text-base font-typewriter font-bold shadow-sm">
                  <Sparkles className="w-5 h-5 text-amber-500 animate-spin" />
                  <span>mektuparkadasi.net — Nostaljik & Yavaş İletişim Kulübü</span>
                </div>

                {/* 2. Hero Title */}
                <h1 className="font-serif text-4xl sm:text-[3.5rem] font-bold text-gray-900 leading-tight tracking-tight">
                  Fotoğrafların Değil, Düşüncelerin Konuşulduğu Köşe.
                </h1>

                {/* 3. Hero Subtitle */}
                <p className="text-base sm:text-xl text-gray-700 font-typewriter leading-relaxed max-w-3xl mx-auto font-medium">
                  Hızlı dünyanın gürültüsünden uzaklaşın. Fotoğraf yok, anlık telaş yok. Dünyanın dertlerinden uzak samimi mektuplar yazışın, beklemenin heyecanını yaşayın.
                </p>

                {/* 4. Action Buttons */}
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

                  {/* 6. Özellik Kartları */}
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
            ) : user.isAdmin ? (
              /* =========================================================
                 YÖNETİCİ GİRİŞİ YAPILDIĞINDA GÖRÜLECEK EXCEL TABLOSU (DİREKT EKRANDA)
                 ========================================================= */
              <div className="space-y-10">
                
                {/* 1. Üyeler Bölümü */}
                <div className="space-y-6">
                  <div className="border-b border-gray-200 pb-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 border border-gray-300 flex items-center justify-center text-gray-700 shadow-sm">
                      <Table className="w-5.5 h-5.5" />
                    </div>
                    <div>
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
                        Platform Üye Kayıtları (Excel Görünümü)
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-500 font-typewriter mt-1">
                        Sisteme kayıt olan üyelerin detaylı Excel kayıt listesi.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-start gap-2.5">
                    <Lock className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs sm:text-sm">
                      💡 Üyelerin <strong>Rumuz (Takma Ad)</strong> bilgisine tıklayarak, o üyenin gönderdiği ve aldığı tüm mektup yazışmalarını tablonun hemen altında inceleyebilirsiniz.
                    </p>
                  </div>

                  {/* Excel Style Table Grid */}
                  <div className="border border-gray-300 rounded-2xl overflow-hidden shadow-md">
                    <table className="w-full text-left border-collapse bg-white">
                      <thead>
                        <tr className="bg-gray-100 border-b border-gray-300 text-gray-800 font-bold text-xs sm:text-sm">
                          <th className="p-4 border-r border-gray-300">Adı Soyadı</th>
                          <th className="p-4 border-r border-gray-300">Telefon</th>
                          <th className="p-4 border-r border-gray-300">E-posta</th>
                          <th className="p-4 border-r border-gray-300 text-rose-800">Rumuz (Yazışmalar İçin Tıkla)</th>
                          <th className="p-4 border-r border-gray-300">Yaş</th>
                          <th className="p-4 border-r border-gray-300">Şehir (Memleket)</th>
                          <th className="p-4 text-emerald-800">Aktif Durum (Canlı)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 text-xs sm:text-sm text-gray-800">
                        {penpals.map((p, idx) => (
                          <tr key={p.id || idx} className="hover:bg-gray-50/80 transition">
                            <td className="p-4 border-r border-gray-250 font-medium">
                              {p.fullName || 'Tahir Özcan Ersöz'}
                            </td>
                            <td className="p-4 border-r border-gray-250 font-mono text-gray-700">
                              {p.phoneNumber || '0532 999 88 77'}
                            </td>
                            <td className="p-4 border-r border-gray-250 font-mono text-gray-700">
                              {p.email || 'tahir@email.com'}
                            </td>
                            <td className="p-4 border-r border-gray-250">
                              <button
                                onClick={() => setSelectedUserForLetters(p.pseudonym)}
                                className={`text-rose-700 font-bold hover:underline cursor-pointer flex items-center gap-1.5 ${
                                  selectedUserForLetters === p.pseudonym ? 'bg-rose-50 px-3 py-1 rounded-lg border border-rose-200' : ''
                                }`}
                              >
                                🎭 {p.pseudonym}
                              </button>
                            </td>
                            <td className="p-4 border-r border-gray-250 font-bold">{p.age}</td>
                            <td className="p-4 border-r border-gray-250 font-medium">{p.city}</td>
                            <td className="p-4 font-bold font-typewriter text-xs text-gray-900 transition-colors duration-500">
                              {liveStatuses[p.id] || '🟢 Çevrimiçi'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 2. Özel Seçilen Üyenin Yazışmaları */}
                {selectedUserForLetters && (
                  <div className="p-6 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-4 animate-fadeIn">
                    <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                      <h3 className="font-serif text-lg font-bold text-amber-950 flex items-center gap-2">
                        <Mail className="w-5 h-5 text-rose-700" />
                        <span>"{selectedUserForLetters}" Kullanıcısının Özel Yazışmaları ({userLetters.length} Mektup)</span>
                      </h3>
                      <button
                        onClick={() => setSelectedUserForLetters(null)}
                        className="text-xs sm:text-sm text-rose-800 hover:underline font-bold cursor-pointer"
                      >
                        Kapat
                      </button>
                    </div>

                    {userLetters.length === 0 ? (
                      <p className="text-sm text-gray-500 font-serif italic text-center py-6">
                        Bu kullanıcının henüz gönderdiği veya aldığı bir mektup bulunmuyor.
                      </p>
                    ) : (
                      <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
                        {userLetters.map(letter => (
                          <div key={letter.id} className="p-4 rounded-xl bg-white border border-amber-200 shadow-sm space-y-2">
                            <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-gray-700">
                              <span>Gönderen: <strong className="text-gray-900">{letter.senderName}</strong></span>
                              <span>Alıcı: <strong className="text-gray-900">{letter.recipientName}</strong></span>
                              <span className="font-mono text-gray-500">{new Date(letter.sentAt).toLocaleDateString('tr-TR')}</span>
                            </div>
                            <div className="border-t border-gray-100 pt-2">
                              <h4 className="font-bold text-gray-900 text-sm">{letter.subject}</h4>
                              <p className="text-xs sm:text-sm text-gray-600 font-serif leading-relaxed mt-1 whitespace-pre-line">
                                {letter.content}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 3. Tüm Platform Mektup Akışı (Birbirlerine gönderilen mektuplar) */}
                <div className="space-y-6 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 border border-gray-300 flex items-center justify-center text-gray-700 shadow-sm">
                      <Send className="w-5 h-5 text-rose-700" />
                    </div>
                    <div>
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
                        Tüm Platform Yazışmaları (Mektup Akışı)
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-500 font-typewriter mt-1">
                        Üyelerin birbirlerine yazdığı tüm güncel mektup trafiği ve içerikleri.
                      </p>
                    </div>
                  </div>

                  <div className="border border-gray-300 rounded-2xl overflow-hidden shadow-md">
                    <table className="w-full text-left border-collapse bg-white">
                      <thead>
                        <tr className="bg-gray-100 border-b border-gray-300 text-gray-800 font-bold text-xs sm:text-sm">
                          <th className="p-4 border-r border-gray-300">Gönderen</th>
                          <th className="p-4 border-r border-gray-300">Alıcı</th>
                          <th className="p-4 border-r border-gray-300">Mektup Başlığı (Konu)</th>
                          <th className="p-4 border-r border-gray-300">Gönderim Tarihi</th>
                          <th className="p-4 border-r border-gray-300">Durum</th>
                          <th className="p-4">İçerik</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 text-xs sm:text-sm text-gray-800">
                        {letters.map((letter) => {
                          const isExpanded = expandedLetterId === letter.id;
                          return (
                            <React.Fragment key={letter.id}>
                              <tr className="hover:bg-gray-50/80 transition">
                                <td className="p-4 border-r border-gray-250 font-bold text-rose-900">
                                  🎭 {letter.senderName} {letter.senderFlag}
                                </td>
                                <td className="p-4 border-r border-gray-250 font-bold text-emerald-900">
                                  🎭 {letter.recipientName}
                                </td>
                                <td className="p-4 border-r border-gray-250 font-medium text-gray-900">
                                  {letter.subject}
                                </td>
                                <td className="p-4 border-r border-gray-250 font-mono text-gray-600">
                                  {new Date(letter.sentAt).toLocaleDateString('tr-TR')}
                                </td>
                                <td className="p-4 border-r border-gray-250 font-bold">
                                  {letter.status === 'en_route' ? (
                                    <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                                      🕊️ Yolda
                                    </span>
                                  ) : letter.status === 'delivered_unread' ? (
                                    <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200">
                                      🕯️ Mühürlü
                                    </span>
                                  ) : (
                                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                                      📖 Okundu
                                    </span>
                                  )}
                                </td>
                                <td className="p-4">
                                  <button
                                    onClick={() => setExpandedLetterId(isExpanded ? null : letter.id)}
                                    className="text-xs font-bold text-rose-700 hover:underline cursor-pointer"
                                  >
                                    {isExpanded ? 'Gizle ▲' : 'Oku/Genişlet ▼'}
                                  </button>
                                </td>
                              </tr>
                              {isExpanded && (
                                <tr className="bg-amber-50/20">
                                  <td colSpan={6} className="p-6 border-b border-gray-300">
                                    <div className="p-6 rounded-xl bg-white border border-amber-200 shadow-inner space-y-3 max-w-4xl">
                                      <div className="flex items-center justify-between text-xs text-gray-500 border-b border-gray-100 pb-2">
                                        <span>Konu: <strong>{letter.subject}</strong></span>
                                        <span>Pul: {letter.stampFlag} {letter.stampName}</span>
                                      </div>
                                      <p className="font-serif text-sm sm:text-base text-gray-800 leading-relaxed whitespace-pre-line">
                                        {letter.content}
                                      </p>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </React.Fragment>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            ) : (
              /* =========================================================
                 NORMAL ÜYE GİRİŞİ YAPILDIKTAN SONRAKİ DASHBOARD (BÜYÜTÜLMÜŞ FONT)
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