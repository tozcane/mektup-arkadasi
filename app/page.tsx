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
import { Mail, Search, Sparkles, Feather, Lock, CheckCircle2, ShieldCheck, Heart, RefreshCw } from 'lucide-react';
import { PenPalProfile } from '@/types/dma';

function MainContent() {
  const {
    activeTab,
    setActiveTab,
    letters,
    penpals,
    openReaderModal,
    openWriterModal,
  } = useDMA();

  const [assignedPenPalIndex, setAssignedPenPalIndex] = useState<number>(0);
  const [assignedMessage, setAssignedMessage] = useState<string>('🎉 Sistem tarafından sana özel bir mektup arkadaşı atandı!');
  const [isAssigning, setIsAssigning] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');

  const assignedPenPal: PenPalProfile = penpals[assignedPenPalIndex % penpals.length] || penpals[0];

  const handleAutoAssign = () => {
    setIsAssigning(true);
    setTimeout(() => {
      const nextIdx = (assignedPenPalIndex + 1) % penpals.length;
      setAssignedPenPalIndex(nextIdx);
      setAssignedMessage('✨ Yeni mektup arkadaşın başarıyla atandı! Mektubunu kaleme alabilirsin.');
      setIsAssigning(false);
    }, 600);
  };

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
      {/* Split Background Images on Left & Right Flanks */}
      <div className="bg-couple-overlay-left" />
      <div className="bg-couple-overlay-right" />

      {/* Navigation Header */}
      <Navbar onAutoAssignPenPal={handleAutoAssign} />

      {/* Main Container */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 py-8 space-y-8">
        
        {/* Main Content Card Frame */}
        <div className="relative p-2 sm:p-4 rounded-3xl bg-gray-950/5 border border-gray-200/80 shadow-2xl backdrop-blur-md">
          
          {/* Card Body Container */}
          <div className="bg-white/95 backdrop-blur-lg p-6 sm:p-8 rounded-2xl shadow-xl space-y-8 border border-gray-100">

            {/* 1. Hero & Automated PenPal Assignment Section */}
            <section className="space-y-6 border-b border-gray-200 pb-8">
              
              {/* Trust & Privacy Assurance Banner */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
                <ShieldCheck className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <span className="font-serif font-bold text-emerald-900 text-sm block">
                    🔐 %100 Uçtan Uca Gizlilik & Güven Garantisi
                  </span>
                  <p className="text-emerald-800 leading-relaxed font-sans">
                    Yazdığınız tüm mektuplar <strong>tamamen kişiye özeldir</strong>. Platformdaki diğer kullanıcılar veya ziyaretçiler mektuplarınızı <u>asla göremez</u>. Güvenliğiniz için sadece sistem yönetim panelinden denetleme yapılır.
                  </p>
                </div>
              </div>

              {/* Assigned PenPal Highlight Card (Atanan Mektup Arkadaşı) */}
              <div className="relative rounded-2xl bg-gradient-to-br from-amber-50 via-rose-50 to-orange-50 border-2 border-rose-200 p-6 sm:p-8 shadow-md">
                <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
                  <div className="flex items-center gap-2 text-rose-800 font-bold text-xs sm:text-sm font-typewriter">
                    <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
                    <span>{assignedMessage}</span>
                  </div>

                  <button
                    onClick={handleAutoAssign}
                    disabled={isAssigning}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition shadow"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isAssigning ? 'animate-spin' : ''}`} />
                    <span>Başka Arkadaş Ata</span>
                  </button>
                </div>

                {/* Assigned Profile Card */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-white/90 p-5 rounded-xl border border-rose-100 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-16 h-16 rounded-full border-4 border-amber-300 flex items-center justify-center font-serif text-2xl font-bold text-white shadow-lg flex-shrink-0"
                      style={{ backgroundColor: assignedPenPal.avatarStyle }}
                    >
                      {assignedPenPal.pseudonym[0]}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-serif text-xl font-bold text-gray-900">
                          {assignedPenPal.pseudonym}
                        </h3>
                        <span className="text-xl">{assignedPenPal.flag}</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-typewriter font-bold">
                          {assignedPenPal.country}
                        </span>
                      </div>

                      <p className="text-xs text-gray-600 italic font-serif mt-0.5">
                        "{assignedPenPal.title}"
                      </p>

                      <p className="text-xs text-gray-700 font-sans mt-2 line-clamp-2 max-w-lg">
                        {assignedPenPal.bio}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {assignedPenPal.interests.map((tag, i) => (
                          <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-gray-100 text-gray-700 font-medium">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => openWriterModal(assignedPenPal)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-rose-700 to-red-800 hover:from-rose-800 hover:to-red-900 text-white font-bold text-sm shadow-lg transition transform active:scale-95 flex-shrink-0"
                  >
                    <Feather className="w-4 h-4" />
                    <span>{assignedPenPal.pseudonym}'e Mektup Yaz ✍️</span>
                  </button>
                </div>
              </div>

            </section>


            {/* 2. Received Letters Section (Hala Yazanların Mektupları Var Altta) */}
            {activeTab === 'inbox' && (
              <section className="space-y-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-gray-900 flex items-center gap-2">
                      <span>📩 Sana Yazanların Mektupları</span>
                      {unreadLetters.length > 0 && (
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-700 text-white font-bold font-typewriter animate-pulse">
                          {unreadLetters.length} Mühürlü Mektup!
                        </span>
                      )}
                    </h2>
                    <p className="text-xs text-gray-500 font-typewriter mt-1">
                      Gizli ve kişiye özel gelen mühürlü mektupların ve arşivin.
                    </p>
                  </div>
                </div>

                {deliveredLetters.length === 0 ? (
                  <div className="rounded-2xl bg-gray-50 border border-gray-200 p-10 text-center space-y-3">
                    <Mail className="w-12 h-12 text-gray-400 mx-auto opacity-60" />
                    <h3 className="font-serif text-lg font-bold text-gray-800">Sandığın Henüz Boş</h3>
                    <p className="text-xs text-gray-500 font-typewriter max-w-sm mx-auto">
                      Sana henüz ulaşan bir mektup yok. Mektup arkadaşına yazarak ilk mektubu gönderebilirsin!
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
                          {/* Card Header */}
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
                                <h3 className="font-serif text-lg font-bold text-gray-900 group-hover:text-rose-700 transition">
                                  {letter.senderName} {letter.senderFlag}
                                </h3>
                                <p className="text-[11px] text-gray-500 font-typewriter">
                                  {new Date(letter.deliveredAt || letter.sentAt).toLocaleDateString('tr-TR')}
                                </p>
                              </div>
                            </div>

                            {/* Stamp Tag */}
                            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100/80 border border-amber-200 text-[11px] text-amber-900 font-typewriter font-bold">
                              <span>{letter.stampFlag}</span>
                              <span>{letter.stampName}</span>
                            </div>
                          </div>

                          {/* Letter Content Preview */}
                          <div className="mb-4">
                            <h4 className="font-serif text-base font-bold text-gray-900 mb-1">
                              {letter.subject}
                            </h4>
                            <p className="text-xs text-gray-600 font-typewriter line-clamp-2 leading-relaxed">
                              {letter.content}
                            </p>
                          </div>

                          {/* Action Footer */}
                          <div className="pt-3 border-t border-gray-200/60 flex items-center justify-between text-xs">
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

                            <span className="text-xs font-bold text-gray-800 group-hover:translate-x-1 transition font-typewriter">
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
                      className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-xs font-typewriter text-gray-900 focus:outline-none focus:border-rose-600"
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
                        className={`px-3 py-1.5 rounded-lg text-xs font-typewriter whitespace-nowrap border transition ${
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

        </div>
      </main>

      {/* Global Modals */}
      <LetterWriterModal />
      <LetterReaderModal />
      <ProfileModal />
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