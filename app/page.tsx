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
import { Mail, Search, Sparkles, Feather, Lock, CheckCircle2, ShieldCheck, LogIn, Compass, Stamp as StampIcon, Table, Send, ArrowLeft } from 'lucide-react';

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
    setAuthModalTab,
    suspendUser,
    activateUser,
    deleteUser,
    isAdminViewMode,
  } = useDMA();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [selectedUserForLetters, setSelectedUserForLetters] = useState<string | null>(null);
  const [expandedLetterId, setExpandedLetterId] = useState<string | null>(null);
  const [inboxSubTab, setInboxSubTab] = useState<'received' | 'sent'>('received');

  // Admin section view state: 'menu' | 'users' | 'letters'
  const [adminActiveView, setAdminActiveView] = useState<'menu' | 'users' | 'letters'>('menu');

  // Dynamic user live status state for admin excel sheet
  const [liveStatuses, setLiveStatuses] = useState<Record<string, string>>({});

  // Initialize and simulate live user status updates
  useEffect(() => {
    const initial: Record<string, string> = {};
    penpals.forEach(p => {
      initial[p.id] = STATUS_OPTIONS[Math.floor(Math.random() * STATUS_OPTIONS.length)];
    });
    setLiveStatuses(initial);

    const interval = setInterval(() => {
      setLiveStatuses(prev => {
        const next = { ...prev };
        const activePenpals = penpals.filter(p => p.status === 'active');
        if (activePenpals.length > 0) {
          const randomPenpal = activePenpals[Math.floor(Math.random() * activePenpals.length)];
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
  const receivedLetters = letters.filter(l => l.recipientId === user.id && l.status !== 'en_route');
  const sentLetters = letters.filter(l => l.senderId === user.id && l.status !== 'en_route');

  // Stats calculations for logged-in user dashboard
  const receivedCount = letters.filter(l => l.recipientId === user.id && l.status !== 'en_route').length;
  const sentCount = letters.filter(l => l.senderId === user.id).length;
  const transitCount = letters.filter(l => l.status === 'en_route').length;

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

      {/* Main Container (Büyütüldü - Dikey Boşluklar Sıfırlandı) */}
      <main className="relative z-10 max-w-7xl lg:max-w-[1560px] mx-auto px-4 sm:px-6 pt-0 pb-0">
        
        {/* Card Body Container (Yayılmış, Çerçevesiz, Üst-Alt Sıfırlanmış) */}
        <div className="bg-white/95 backdrop-blur-lg p-6 sm:p-12 rounded-b-3xl rounded-t-none shadow-xl space-y-10 border-x border-b border-gray-200">

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
                  Görselliğin Gürültüsünden Uzak, Kelimelerin Kalbine Yolculuk.
                </h1>

                {/* 3. Hero Subtitle (Büyütüldü) */}
                <p className="text-lg sm:text-2xl text-gray-700 font-typewriter leading-relaxed max-w-4xl mx-auto font-medium">
                  Hızlı dünyanın gürültüsünden uzaklaşın. Fotoğraf yok, anlık telaş yok. Dünyanın dertlerinden uzak samimi mektuplar yazışın, beklemenin heyecanını yaşayın.
                </p>

                {/* 4. Action Buttons (Geliştirildi) */}
                <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-6 max-w-2xl mx-auto">
                  <button
                    onClick={() => { setAuthModalTab('register'); setIsAuthModalOpen(true); }}
                    className="w-full sm:flex-1 flex items-center justify-center gap-3 px-12 py-5 rounded-2xl bg-gradient-to-r from-rose-700 via-rose-850 to-red-800 hover:from-rose-850 hover:to-red-900 text-white font-extrabold text-lg sm:text-xl shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-200 transform active:scale-95 cursor-pointer"
                  >
                    <Feather className="w-6 h-6 animate-pulse" />
                    <span>Üye Ol</span>
                  </button>

                  <button
                    onClick={() => { setAuthModalTab('login'); setIsAuthModalOpen(true); }}
                    className="w-full sm:flex-1 flex items-center justify-center gap-3 px-12 py-5 rounded-2xl bg-white hover:bg-gray-50 border-3 border-gray-900 text-gray-900 font-extrabold text-lg sm:text-xl shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 transform active:scale-95 cursor-pointer"
                  >
                    <LogIn className="w-6 h-6 text-gray-900" />
                    <span>Üye Girişi</span>
                  </button>
                </div>

                 {/* 5. Poetic Essence Description (Büyütüldü) */}
                 <div className="pt-8 border-t border-gray-150 max-w-4xl mx-auto text-left space-y-4">
                   <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-rose-850 tracking-wide text-center">
                     🕯️ Yavaşlığın, Derinliğin ve Kelimelerin Kutsal Yuvası
                   </h2>
                   <p className="text-base sm:text-lg text-gray-800 leading-relaxed font-typewriter text-center font-bold">
                     mektuparkadasi.net; hızın, anlık beğenilerin ve dijital gürültünün arasında kaybolan ruhlar için sakin bir limandır. Burası, fotoğrafların ötesinde, kelimelerin ve samimi düşüncelerin değer bulduğu yavaş bir dünyadır. Bir mektubu yazmanın özeni, gönderilen pulun hatırası ve o mektubun yola çıkıp alıcısına ulaşmasını heyecanla beklemenin nostaljik büyüsüdür. Ruhların önyargısızca, sadece samimi kelimelerin sıcaklığında buluştuğu bu kulüpte, yavaş iletişimin asaletini yeniden keşfediyoruz.
                   </p>
                 </div>

                 {/* 6. Özellik Kartları (Açıklamalar & Başlıklar Büyütüldü) */}
                 <div className="pt-4 space-y-10">
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                     
                     {/* Kart 1: Anonim & Fotoğrafsız */}
                     <div className="relative p-8 rounded-3xl bg-gradient-to-b from-amber-50/75 to-white border-2 border-amber-200/70 shadow-md hover:shadow-xl transition duration-300 group space-y-4">
                       <div className="w-13 h-13 rounded-2xl bg-amber-100 border border-amber-300 text-amber-900 flex items-center justify-center text-3xl shadow-sm transform group-hover:scale-105 transition">
                         🎭
                       </div>
                       <h3 className="font-serif font-extrabold text-2xl sm:text-3xl text-gray-950 group-hover:text-rose-850 transition">
                         Anonim & Fotoğrafsız
                       </h3>
                       <p className="text-base text-gray-800 font-typewriter leading-relaxed font-semibold">
                         Profil resmi, unvan veya sosyal statü yok. Sadece düşüncelerinizle ve rumuzunuzla var olursunuz; böylece önyargısız, samimi ve derin bağlar kurarsınız.
                       </p>
                     </div>

                     {/* Kart 2: Balmumu Mühür */}
                     <div className="relative p-8 rounded-3xl bg-gradient-to-b from-rose-50/75 to-white border-2 border-rose-200/70 shadow-md hover:shadow-xl transition duration-300 group space-y-4">
                       <div className="w-13 h-13 rounded-2xl bg-rose-100 border border-rose-350 text-rose-900 flex items-center justify-center text-3xl shadow-sm transform group-hover:scale-105 transition">
                         🕯️
                       </div>
                       <h3 className="font-serif font-extrabold text-2xl sm:text-3xl text-gray-950 group-hover:text-rose-850 transition">
                         Balmumu Mühür
                       </h3>
                       <p className="text-base text-gray-800 font-typewriter leading-relaxed font-semibold">
                         Yazdığınız mektubu nostaljik balmumu mühürle kapatırsınız. Alıcı üye, mektubu açıp okumak için bu mührü heyecanla kırarak açar.
                       </p>
                     </div>

                     {/* Kart 3: Yavaş & Değerli Teslimat */}
                     <div className="relative p-8 rounded-3xl bg-gradient-to-b from-emerald-50/75 to-white border-2 border-emerald-200/70 shadow-md hover:shadow-xl transition duration-300 group space-y-4">
                       <div className="w-13 h-13 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-900 flex items-center justify-center text-3xl shadow-sm transform group-hover:scale-105 transition">
                         🕊️
                       </div>
                       <h3 className="font-serif font-extrabold text-2xl sm:text-3xl text-gray-950 group-hover:text-rose-850 transition">
                         Yavaş & Değerli Teslimat
                       </h3>
                       <p className="text-base text-gray-800 font-typewriter leading-relaxed font-semibold">
                         Mektuplar anlık mesajlar gibi saniyeler içinde gitmez; aradaki mesafeye göre saatler sürer. Beklemek mektubun kıymetini ve heyecanını katlar.
                       </p>
                     </div>

                   </div>

                   {/* 7. Trust & Privacy Notice (Küçültüldü & Detaylandırıldı) */}
                   <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-left max-w-3xl mx-auto flex items-start gap-4 shadow-sm">
                     <ShieldCheck className="w-8 h-8 text-emerald-600 flex-shrink-0 mt-0.5" />
                     <div className="space-y-1.5">
                       <span className="font-serif font-bold text-emerald-950 text-base sm:text-lg block">
                         🔐 %100 Uçtan Uca Gizlilik & Güven Garantisi
                       </span>
                       <p className="text-emerald-800 leading-relaxed font-sans text-xs sm:text-sm font-semibold">
                         Mektuplarınız tamamen size ve mektup arkadaşınıza özeldir. Dışarıdan veya ziyaretçilerden tamamen gizlidir. Gerçek ad ve soyadınız sadece güvenliğiniz için istenmektedir; bu bilgiler mektup arkadaşlarınızla kesinlikle paylaşılmayacak ve hiçbir yerde gözükmeyecektir. İletişimi sadece rumuzunuzla güvenle sürdürürsünüz.
                       </p>
                     </div>
                   </div>
                 </div>

              </section>
            ) : (user.isAdmin && isAdminViewMode) ? (
              /* =========================================================
                 YÖNETİCİ SEÇİM PANELİ (ÜYELER VS MEKTUP AKIŞI SEÇİM DASHBOARD'U)
                 ========================================================= */
              <div className="space-y-8 animate-fadeIn">
                
                {/* Admin View 1: Main Menu */}
                {adminActiveView === 'menu' && (
                  <div className="space-y-8 py-6 text-center max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-sm sm:text-base font-typewriter font-bold shadow-sm">
                      <ShieldCheck className="w-5 h-5 text-rose-700" />
                      <span>mektuparkadasi.net • Yönetim Portalı</span>
                    </div>

                    <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900">
                      Hangi Bölümü İncelemek İstersiniz?
                    </h1>
                    <p className="text-base text-gray-600 max-w-2xl mx-auto font-typewriter">
                      Lütfen denetlemek veya müdahale etmek istediğiniz yönetim tablosunu seçin.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 max-w-3xl mx-auto">
                      
                      {/* Kart 1: Üye Kayıtları Excel Tablosu */}
                      <button
                        onClick={() => setAdminActiveView('users')}
                        className="p-8 rounded-3xl border-2 border-gray-200 bg-white hover:border-rose-700 hover:shadow-2xl transition-all duration-300 text-left group cursor-pointer space-y-4 shadow-md"
                      >
                        <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center justify-center shadow-sm group-hover:scale-110 transition">
                          <Table className="w-8 h-8" />
                        </div>
                        <h3 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 group-hover:text-rose-700 transition">
                          📊 Üye Kayıtları (Excel)
                        </h3>
                        <p className="text-sm text-gray-500 font-typewriter leading-relaxed">
                          Adı, soyadı, telefonu, e-postası ve rumuzu ile tüm kayıtlı kullanıcıların Excel listesi. Hesap dondurma ve iptal etme yetkisi.
                        </p>
                        <div className="pt-2 flex items-center justify-between text-xs font-bold text-gray-400 group-hover:text-rose-700 transition">
                          <span>Kayıtlı Üye: {penpals.length}</span>
                          <span>Görüntüle →</span>
                        </div>
                      </button>

                      {/* Kart 2: Tüm Yazışmalar (Mektup Akışı) */}
                      <button
                        onClick={() => setAdminActiveView('letters')}
                        className="p-8 rounded-3xl border-2 border-gray-200 bg-white hover:border-rose-700 hover:shadow-2xl transition-all duration-300 text-left group cursor-pointer space-y-4 shadow-md"
                      >
                        <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center justify-center shadow-sm group-hover:scale-110 transition">
                          <Send className="w-8 h-8" />
                        </div>
                        <h3 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 group-hover:text-rose-700 transition">
                          🕊️ Mektup Akışı (Tüm Trafik)
                        </h3>
                        <p className="text-sm text-gray-500 font-typewriter leading-relaxed">
                          Üyelerin birbirlerine yazdığı tüm mektup akışı. Gönderen, alıcı, gönderim zamanı, mektup pulu ve mektup mektup okuma/detay paneli.
                        </p>
                        <div className="pt-2 flex items-center justify-between text-xs font-bold text-gray-400 group-hover:text-rose-700 transition">
                          <span>Toplam Mektup: {letters.length}</span>
                          <span>Görüntüle →</span>
                        </div>
                      </button>

                    </div>
                  </div>
                )}

                {/* Admin View 2: Excel Users Table */}
                {adminActiveView === 'users' && (
                  <div className="space-y-6 animate-fadeIn">
                    
                    {/* Back Button & Header */}
                    <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => { setAdminActiveView('menu'); setSelectedUserForLetters(null); }}
                          className="p-2.5 rounded-xl border border-gray-300 hover:bg-gray-100 text-gray-700 transition flex items-center justify-center cursor-pointer"
                        >
                          <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
                            Platform Üye Kayıtları (Excel Görünümü)
                          </h2>
                          <p className="text-xs sm:text-sm text-gray-500 font-typewriter mt-1">
                            Sisteme kayıt olan üyelerin detaylı Excel kayıt listesi ve yönetim araçları.
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => { setAdminActiveView('menu'); setSelectedUserForLetters(null); }}
                        className="text-xs sm:text-sm font-bold text-rose-700 hover:underline font-typewriter cursor-pointer"
                      >
                        ⬅️ Ana Menüye Dön
                      </button>
                    </div>

                    <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-start gap-2.5">
                      <Lock className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <p className="text-xs sm:text-sm">
                        💡 Üyelerin <strong>Rumuz</strong> sütununa tıklayarak yazışmalarını görebilir; en sağdaki <strong>İşlemler</strong> sütununu kullanarak hesapları dondurabilir, aktif edebilir veya tamamen silebilirsiniz.
                      </p>
                    </div>

                    {/* Excel Style Table Grid */}
                    <div className="border border-gray-300 rounded-2xl overflow-hidden shadow-md overflow-x-auto">
                      <table className="w-full text-left border-collapse bg-white min-w-[900px]">
                        <thead>
                          <tr className="bg-gray-100 border-b border-gray-300 text-gray-800 font-bold text-xs sm:text-sm">
                            <th className="p-4 border-r border-gray-300">Adı Soyadı</th>
                            <th className="p-4 border-r border-gray-300">Telefon</th>
                            <th className="p-4 border-r border-gray-300">E-posta</th>
                            <th className="p-4 border-r border-gray-300 text-rose-800">Rumuz (Yazışmalar İçin Tıkla)</th>
                            <th className="p-4 border-r border-gray-300">Yaş</th>
                            <th className="p-4 border-r border-gray-300">Şehir (Memleket)</th>
                            <th className="p-4 border-r border-gray-300 text-emerald-800">Aktif Durum (Canlı)</th>
                            <th className="p-4 text-rose-900">Yönetimsel İşlemler</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 text-xs sm:text-sm text-gray-800">
                          {penpals.map((p, idx) => {
                            const isSuspended = p.status === 'away';
                            return (
                              <tr key={p.id || idx} className={`hover:bg-gray-50/80 transition ${isSuspended ? 'bg-gray-100/50 opacity-80' : ''}`}>
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
                                 <td className="p-4 border-r border-gray-250 font-bold">
                                   {p.gender ? `${p.gender}, ` : ''}{p.age}
                                 </td>
                                <td className="p-4 border-r border-gray-250 font-medium">{p.city}</td>
                                <td className="p-4 border-r border-gray-250 font-bold font-typewriter text-xs text-gray-900">
                                  {isSuspended ? (
                                    <span className="text-gray-500">⚪ Donduruldu</span>
                                  ) : (
                                    liveStatuses[p.id] || '🟢 Çevrimiçi'
                                  )}
                                </td>
                                <td className="p-4 flex items-center gap-2">
                                  {isSuspended ? (
                                    <button
                                      onClick={() => activateUser(p.id)}
                                      className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs cursor-pointer transition"
                                    >
                                      🟢 Aktif Et
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => suspendUser(p.id)}
                                      className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 font-bold text-xs cursor-pointer transition"
                                    >
                                      ⚪ Dondur
                                    </button>
                                  )}
                                  <button
                                    onClick={() => {
                                      if (confirm(`${p.pseudonym} üyesini silmek istediğinize emin misiniz?`)) {
                                        deleteUser(p.id);
                                      }
                                    }}
                                    className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 font-bold text-xs cursor-pointer transition"
                                  >
                                    ❌ İptal Et (Sil)
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Clicked user correspondence details display */}
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
                  </div>
                )}

                {/* Admin View 3: Platform Letter Traffic Flow */}
                {adminActiveView === 'letters' && (
                  <div className="space-y-6 animate-fadeIn">
                    
                    {/* Back Button & Header */}
                    <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => { setAdminActiveView('menu'); setExpandedLetterId(null); }}
                          className="p-2.5 rounded-xl border border-gray-300 hover:bg-gray-100 text-gray-700 transition flex items-center justify-center cursor-pointer"
                        >
                          <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
                            Tüm Platform Yazışmaları (Mektup Akışı)
                          </h2>
                          <p className="text-xs sm:text-sm text-gray-500 font-typewriter mt-1">
                            Üyelerin birbirlerine yazdığı tüm güncel mektup trafiği ve içerikleri.
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => { setAdminActiveView('menu'); setExpandedLetterId(null); }}
                        className="text-xs sm:text-sm font-bold text-rose-700 hover:underline font-typewriter cursor-pointer"
                      >
                        ⬅️ Ana Menüye Dön
                      </button>
                    </div>

                    <div className="border border-gray-300 rounded-2xl overflow-hidden shadow-md overflow-x-auto">
                      <table className="w-full text-left border-collapse bg-white min-w-[900px]">
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
                )}

              </div>
            ) : (
              /* =========================================================
                 NORMAL ÜYE GİRİŞİ YAPILDIKTAN SONRAKİ DASHBOARD (BÜYÜTÜLMÜŞ FONT)
                 ========================================================= */
              <div className="space-y-8 animate-fadeIn">

                {/* 1. Mektup Sandığı (Gelen Kutusu) */}
                {activeTab === 'inbox' && (
                  <section className="space-y-8">
                    
                    {/* Kişiselleştirilmiş Üye Dashboard Paneli */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      
                      {/* Sol Kolon: Özel Üye Kartı (Mektup Arkadaşı Resmi Üyelik Belgesi) */}
                      <div className="relative p-6 rounded-3xl bg-gradient-to-br from-amber-50 to-white border-2 border-amber-200 shadow-xl overflow-hidden flex flex-col justify-between space-y-4">
                        {/* Retro Pul Çerçeve Dekoru */}
                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-700 via-amber-400 to-rose-700" />
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                            <span className="text-xs font-extrabold text-amber-900 tracking-wider font-typewriter">
                              OFFICIAL PENPAL CARD
                            </span>
                            <span className="text-xs px-2.5 py-0.5 rounded bg-amber-100 text-amber-955 border border-amber-300 font-bold">
                              ÜYE
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            <div
                              className="w-14 h-14 rounded-full border-2 border-amber-400 flex items-center justify-center font-serif text-2xl font-bold text-white shadow-md"
                              style={{ backgroundColor: user.avatarColor }}
                            >
                              {user.pseudonym[0]}
                            </div>
                            <div>
                              <h3 className="font-serif text-xl font-bold text-gray-900">
                                {user.pseudonym}
                              </h3>
                              <p className="text-xs text-gray-500 font-typewriter">Rumuz ile Güvenli İletişim</p>
                            </div>
                          </div>

                          <div className="border-t border-amber-100 pt-3 space-y-2 text-sm text-gray-800 font-medium">
                            <div className="flex justify-between">
                              <span className="text-gray-500 font-bold">Ad Soyad:</span>
                              <span className="font-bold text-gray-955">{user.fullName || 'Belirtilmedi'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500 font-bold">Cinsiyet:</span>
                              <span className="font-bold text-gray-955">{user.gender || 'Belirtilmedi'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500 font-bold">Yaş / Şehir:</span>
                              <span className="font-bold text-gray-955">{user.age} • {user.city}</span>
                            </div>
                          </div>

                          {/* Canlı Mektup İstatistik Grubu */}
                          <div className="border-t border-amber-100 pt-3 grid grid-cols-3 gap-2 text-center text-xs">
                            <div className="p-2 rounded bg-amber-100/50 border border-amber-200">
                              <span className="block text-gray-500 font-bold">Gelen</span>
                              <span className="text-base font-extrabold text-rose-800">{receivedCount}</span>
                            </div>
                            <div className="p-2 rounded bg-amber-100/50 border border-amber-200">
                              <span className="block text-gray-500 font-bold">Giden</span>
                              <span className="text-base font-extrabold text-amber-900">{sentCount}</span>
                            </div>
                            <div className="p-2 rounded bg-amber-100/50 border border-amber-200">
                              <span className="block text-gray-500 font-bold">Yolda</span>
                              <span className="text-base font-extrabold text-emerald-800 animate-pulse">{transitCount}</span>
                            </div>
                          </div>
                        </div>

                        <div className="border-t border-amber-200 pt-2 flex items-center justify-between text-xs text-amber-900 font-bold">
                          <span>🎫 No: #{user.id.substring(user.id.indexOf('-') + 1, user.id.indexOf('-') + 9) || '2026'}</span>
                          <span>📬 {user.stampsCollected.length} Pul</span>
                        </div>
                      </div>

                      {/* Sağ Kolon (2 Sütun genişliğinde): Kişiselleştirilmiş Karşılama ve Harekete Geçirici Buton */}
                      <div className="lg:col-span-2 p-8 rounded-3xl bg-gradient-to-br from-rose-900 via-rose-950 to-amber-950 text-white flex flex-col justify-between shadow-xl space-y-6">
                        <div className="space-y-4">
                          <h2 className="font-serif text-3xl font-bold tracking-wide text-amber-100">
                            Merhaba Sevgili {user.pseudonym}, Sakin Limana Hoş Geldin! 🕯️
                          </h2>
                          <p className="text-base sm:text-lg leading-relaxed font-sans text-gray-200 font-semibold">
                            Burası görselliğin gürültüsünden uzak, kelimelerin ve samimi düşüncelerin değer bulduğu yavaş bir dünyadır. 
                            Profilin tamamen sana özel ve güvenlidir. Mektup arkadaşların senin gerçek ismini asla göremez, yalnızca rumuzunla ({user.pseudonym}) iletişim kurarsın.
                          </p>
                          <p className="text-xs sm:text-sm text-amber-200/90 font-typewriter italic leading-relaxed font-bold">
                            İlk adımı atmak için hemen bir mektup arkadaşı arayabilir ve ilk nostaljik mektubunu yazıp pulunu yapıştırarak yola çıkarabilirsin.
                          </p>
                        </div>

                        <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
                          {/* MEKTUP ARKADAŞI ARA & KEŞFET BUTONU */}
                          <button
                            onClick={() => setActiveTab('penpals')}
                            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-extrabold text-base sm:text-lg shadow-lg hover:shadow-2xl hover:-translate-y-0.5 transition-all cursor-pointer"
                          >
                            <Search className="w-5 h-5" />
                            <span>🔍 Mektup Arkadaşı Ara & Keşfet</span>
                          </button>
                        </div>
                      </div>

                    </div>

                    {/* Alt Başlık & Alt Sekme Seçimi */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-4 pt-4">
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
                          Gizli ve kişiye özel mektup sandığınız: Gelen ve giden nostaljik mektuplarınız.
                        </p>
                      </div>

                      {/* Gelen / Giden Alt Sekme Seçici (Segmented Control) */}
                      <div className="flex bg-gray-105 p-1 rounded-xl border border-gray-200 self-start md:self-auto">
                        <button
                          onClick={() => setInboxSubTab('received')}
                          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                            inboxSubTab === 'received'
                              ? 'bg-rose-700 text-white shadow-sm'
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          <span>📥 Gelen</span>
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            inboxSubTab === 'received' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
                          }`}>
                            {receivedCount}
                          </span>
                        </button>

                        <button
                          onClick={() => setInboxSubTab('sent')}
                          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                            inboxSubTab === 'sent'
                              ? 'bg-rose-700 text-white shadow-sm'
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          <span>📤 Giden</span>
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            inboxSubTab === 'sent' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
                          }`}>
                            {sentCount}
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Mektupların Listelenmesi */}
                    {inboxSubTab === 'received' ? (
                      /* =========================================================
                         GELEN MEKTUPLAR
                         ========================================================= */
                      receivedLetters.length === 0 ? (
                        <div className="rounded-2xl bg-gray-50 border border-gray-200 p-10 text-center space-y-4">
                          <Mail className="w-14 h-14 text-gray-400 mx-auto opacity-60" />
                          <h3 className="font-serif text-xl font-bold text-gray-800">Gelen Kutun Henüz Boş</h3>
                          <p className="text-xs sm:text-sm text-gray-500 font-typewriter max-w-sm mx-auto">
                            Sana henüz ulaşan bir mektup yok. Mektup arkadaşlarına yazarak ilk mektubu gönderebilirsin!
                          </p>
                          <button
                            onClick={() => setActiveTab('penpals')}
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-sm font-bold shadow-md transition cursor-pointer"
                          >
                            <span>🔍 İlk Mektup Arkadaşını Bul</span>
                          </button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          {receivedLetters.map(letter => {
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
                                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 group-hover:text-rose-700 transition">
                                        {letter.senderName} {letter.senderFlag}
                                      </h3>
                                      <p className="text-sm sm:text-base text-gray-500 font-typewriter">
                                        {new Date(letter.deliveredAt || letter.sentAt).toLocaleDateString('tr-TR')}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/80 border border-amber-200 text-sm sm:text-base text-amber-900 font-typewriter font-bold">
                                    <span>{letter.stampFlag}</span>
                                    <span>{letter.stampName}</span>
                                  </div>
                                </div>

                                <div className="mb-4">
                                  <h4 className="font-serif text-lg sm:text-xl font-bold text-gray-900 mb-1">
                                    {letter.subject}
                                  </h4>
                                  <p className="text-sm sm:text-base text-gray-700 font-typewriter line-clamp-2 leading-relaxed">
                                    {letter.content}
                                  </p>
                                </div>

                                <div className="pt-3 border-t border-gray-200/60 flex items-center justify-between text-sm sm:text-base">
                                  {isUnread ? (
                                    <div className="flex items-center gap-1.5 text-rose-700 font-typewriter font-extrabold">
                                      <Lock className="w-4.5 h-4.5" />
                                      <span>Balmumu Mühürü Kır & Oku</span>
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-1.5 text-emerald-700 font-typewriter font-bold">
                                      <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600" />
                                      <span>Okundu & Arşivde</span>
                                    </div>
                                  )}

                                  <span className="text-sm sm:text-base font-extrabold text-gray-800 group-hover:translate-x-1 transition font-typewriter">
                                    Oku →
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )
                    ) : (
                      /* =========================================================
                         GİDEN MEKTUPLAR
                         ========================================================= */
                      sentLetters.length === 0 ? (
                        <div className="rounded-2xl bg-gray-50 border border-gray-200 p-10 text-center space-y-4">
                          <Send className="w-14 h-14 text-gray-400 mx-auto opacity-60" />
                          <h3 className="font-serif text-xl font-bold text-gray-800">Gönderdiğin Mektup Yok</h3>
                          <p className="text-xs sm:text-sm text-gray-500 font-typewriter max-w-sm mx-auto">
                            Henüz kimseye mektup göndermemişsin. Mektup arkadaşı arayıp hemen bir mektup yazmaya başlayabilirsin!
                          </p>
                          <button
                            onClick={() => setActiveTab('penpals')}
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-sm font-bold shadow-md transition cursor-pointer"
                          >
                            <span>🔍 Mektup Arkadaşı Ara & Yaz</span>
                          </button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          {sentLetters.map(letter => {
                            const recipientProfile = penpals.find(p => p.id === letter.recipientId);
                            const recFlag = recipientProfile?.flag || '🇹🇷';

                            return (
                              <div
                                key={letter.id}
                                onClick={() => openReaderModal(letter)}
                                className="group relative rounded-2xl p-6 border bg-white border-gray-200 hover:border-gray-300 transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-sm hover:shadow-md"
                              >
                                <div className="flex items-start justify-between mb-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-11 h-11 rounded-full flex items-center justify-center font-serif font-bold text-white text-lg shadow-sm bg-amber-800">
                                      {letter.recipientName[0]}
                                    </div>
                                    <div>
                                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 group-hover:text-amber-800 transition">
                                        Alıcı: {letter.recipientName} {recFlag}
                                      </h3>
                                      <p className="text-sm sm:text-base text-gray-500 font-typewriter">
                                        Gönderildi: {new Date(letter.sentAt).toLocaleDateString('tr-TR')}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/80 border border-amber-200 text-sm sm:text-base text-amber-900 font-typewriter font-bold">
                                    <span>{letter.stampFlag}</span>
                                    <span>{letter.stampName}</span>
                                  </div>
                                </div>

                                <div className="mb-4">
                                  <h4 className="font-serif text-lg sm:text-xl font-bold text-gray-900 mb-1">
                                    {letter.subject}
                                  </h4>
                                  <p className="text-sm sm:text-base text-gray-700 font-typewriter line-clamp-2 leading-relaxed">
                                    {letter.content}
                                  </p>
                                </div>

                                <div className="pt-3 border-t border-gray-200/60 flex items-center justify-between text-sm sm:text-base">
                                  <div className="flex items-center gap-1.5 text-emerald-700 font-typewriter font-bold">
                                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600" />
                                    <span>Gönderildi & Ulaştı</span>
                                  </div>

                                  <span className="text-sm sm:text-base font-extrabold text-gray-800 group-hover:translate-x-1 transition font-typewriter">
                                    Detayları Gör →
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                    ))}
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