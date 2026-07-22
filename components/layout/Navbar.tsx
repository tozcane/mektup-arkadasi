'use client';

import React from 'react';
import { useDMA } from '@/context/DMAContext';
import { Mail, Compass, Stamp as StampIcon, Send, PenTool, Lock, LogIn, LogOut, Eye, ShieldAlert } from 'lucide-react';
import { ActiveTab } from '@/types/dma';
import { AuthModal } from '@/components/dma/AuthModal';

export const Navbar: React.FC<{ onAutoAssignPenPal: () => void }> = ({ onAutoAssignPenPal }) => {
  const {
    activeTab,
    setActiveTab,
    letters,
    user,
    openWriterModal,
    setIsProfileModalOpen,
    setIsAuthModalOpen,
    setAuthModalTab,
    logout,
    isAdminViewMode,
    setIsAdminViewMode,
  } = useDMA();

  const unreadCount = letters.filter(l => l.status === 'delivered_unread').length;
  const enRouteCount = letters.filter(l => l.status === 'en_route').length;

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'inbox',
      label: 'Mektup Sandığım',
      icon: <Mail className="w-5 h-5" />,
      badge: unreadCount,
    },
    {
      id: 'en_route',
      label: 'Yoldaki Mektuplar',
      icon: <Send className="w-5 h-5" />,
      badge: enRouteCount,
    },
    {
      id: 'penpals',
      label: 'Tüm Mektup Arkadaşları',
      icon: <Compass className="w-5 h-5" />,
    },
    {
      id: 'stamps',
      label: 'Pul Albümü',
      icon: <StampIcon className="w-5 h-5" />,
    },
  ];

  const showNavTabs = user.isLoggedIn && (!user.isAdmin || !isAdminViewMode);

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b-2 border-gray-150 shadow-md">
        <div className="max-w-[1560px] mx-auto px-6 py-5 flex flex-wrap items-center justify-between gap-6">
          
          {/* Brand Logo & Title (Büyütüldü) */}
          <div className="flex items-center gap-4">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-red-700 to-rose-900 text-white flex items-center justify-center shadow-lg transform hover:rotate-6 transition duration-200">
              <PenTool className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <span className="font-serif font-bold text-2xl sm:text-3xl text-gray-900 tracking-tight">
                  Mektup Arkadaşı
                </span>
                <span className="hidden sm:inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border-2 border-emerald-250 font-bold shadow-sm">
                  <Lock className="w-3.5 h-3.5" />
                  <span>%100 Özel & Gizli</span>
                </span>
              </div>
              <p className="text-xs sm:text-sm text-rose-700 font-serif italic font-bold tracking-wide mt-0.5">mektuparkadasi.net</p>
            </div>
          </div>

          {/* Navigation Tabs (Yazı ve Boyut Büyütüldü) */}
          {showNavTabs && (
            <nav className="flex items-center space-x-2 sm:space-x-3 overflow-x-auto py-1.5">
              {navItems.map(item => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`relative flex items-center gap-2.5 px-4.5 py-3 rounded-xl text-sm sm:text-base font-bold transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-gray-900 text-white shadow-md'
                        : 'text-gray-650 hover:text-gray-900 hover:bg-gray-100 border border-transparent hover:border-gray-200'
                    }`}
                  >
                    {item.icon}
                    <span className="font-sans">{item.label}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="w-6 h-6 rounded-full bg-rose-600 text-white text-xs font-bold flex items-center justify-center shadow animate-pulse">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          )}

          {/* Action Controls (Boyutları ve Paddingleri Büyütüldü) */}
          <div className="flex items-center gap-3">
            
            {/* Admin Mode Switcher Toggle */}
            {user.isLoggedIn && user.isAdmin && (
              <button
                onClick={() => setIsAdminViewMode(!isAdminViewMode)}
                className={`flex items-center gap-2 px-4.5 py-3 rounded-xl text-sm sm:text-base font-extrabold shadow-md transition cursor-pointer ${
                  isAdminViewMode
                    ? 'bg-emerald-950 text-emerald-300 border-2 border-emerald-800'
                    : 'bg-rose-950 text-rose-300 border-2 border-rose-800 animate-pulse'
                }`}
              >
                {isAdminViewMode ? (
                  <>
                    <Eye className="w-5 h-5 text-emerald-400" />
                    <span>Admin Paneli (Açık)</span>
                  </>
                ) : (
                  <>
                    <ShieldAlert className="w-5 h-5 text-rose-400 animate-bounce" />
                    <span>Normal Üye Görünümü</span>
                  </>
                )}
              </button>
            )}

            {/* Profile / Login Controls */}
            {user.isLoggedIn ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsProfileModalOpen(true)}
                  className="px-6 py-3.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-955 border-2 border-amber-200 text-sm sm:text-base font-extrabold shadow transition active:scale-95 cursor-pointer flex items-center gap-2"
                >
                  <div
                    className="w-5 h-5 rounded-full border border-amber-450 flex items-center justify-center font-serif text-xs font-bold text-white"
                    style={{ backgroundColor: user.avatarColor }}
                  >
                    {user.pseudonym[0]}
                  </div>
                  <span>Profilimi Düzenle</span>
                </button>
                
                <button
                  onClick={logout}
                  title="Çıkış Yap"
                  className="p-3 rounded-xl bg-gray-100 hover:bg-rose-50 hover:text-rose-750 border border-gray-250 text-gray-700 transition cursor-pointer"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => { setAuthModalTab('login'); setIsAuthModalOpen(true); }}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm sm:text-base font-extrabold shadow-lg transition active:scale-95 cursor-pointer"
              >
                <LogIn className="w-5 h-5" />
                <span>Giriş Yap / Üye Ol</span>
              </button>
            )}

            {/* Write Letter Button (Büyütüldü) */}
            {(!user.isAdmin || !isAdminViewMode) && (
              <button
                onClick={() => {
                  if (!user.isLoggedIn) {
                    setAuthModalTab('login');
                    setIsAuthModalOpen(true);
                  } else {
                    openWriterModal();
                  }
                }}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-sm sm:text-base font-extrabold shadow-lg transition transform active:scale-95 cursor-pointer"
              >
                <PenTool className="w-5 h-5" />
                <span>Mektup Yaz</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Modals */}
      <AuthModal />
    </>
  );
};
