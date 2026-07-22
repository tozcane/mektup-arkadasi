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
  ];

  const showNavTabs = user.isLoggedIn && (!user.isAdmin || !isAdminViewMode);

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b-2 border-gray-150 shadow-md">
        <div className="max-w-[1560px] mx-auto px-6 py-3 flex flex-nowrap items-center justify-between gap-4 overflow-x-auto scrollbar-none">
          
          {/* Brand Logo & Title (Sleek and compact) */}
          <div className="flex items-center gap-3.5 flex-shrink-0">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-700 to-rose-900 text-white flex items-center justify-center shadow transform hover:rotate-6 transition duration-200">
              <PenTool className="w-5.5 h-5.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-xl sm:text-2xl text-gray-900 tracking-tight">
                  Mektup Arkadaşı
                </span>
                <span className="hidden md:inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-250 font-bold">
                  <Lock className="w-3 h-3" />
                  <span>Özel & Gizli</span>
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-rose-700 font-serif italic font-bold tracking-wide">mektuparkadasi.net</p>
            </div>
          </div>

          {/* Navigation Tabs (Single line with horizontal scrolling on small screens) */}
          {showNavTabs && (
            <nav className="flex items-center space-x-2 overflow-x-auto py-1 flex-shrink-0 scrollbar-none">
              {navItems.map(item => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`relative flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer flex-shrink-0 ${
                      isActive
                        ? 'bg-gray-900 text-white shadow-sm'
                        : 'text-gray-650 hover:text-gray-900 hover:bg-gray-50 border border-transparent hover:border-gray-200'
                    }`}
                  >
                    {item.icon}
                    <span className="font-sans whitespace-nowrap">{item.label}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="w-5 h-5 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center shadow animate-pulse">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          )}

          {/* Action Controls (Clean and tight) */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            
            {/* Admin Mode Switcher Toggle */}
            {user.isLoggedIn && user.isAdmin && (
              <button
                onClick={() => setIsAdminViewMode(!isAdminViewMode)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold shadow-sm transition cursor-pointer flex-shrink-0 ${
                  isAdminViewMode
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : 'bg-rose-955 text-rose-300 border border-rose-800 animate-pulse'
                }`}
              >
                {isAdminViewMode ? (
                  <>
                    <Eye className="w-4 h-4 text-emerald-400" />
                    <span>Admin</span>
                  </>
                ) : (
                  <>
                    <ShieldAlert className="w-4 h-4 text-rose-400 animate-bounce" />
                    <span>Normal Görünüm</span>
                  </>
                )}
              </button>
            )}

            {/* Profile / Login Controls */}
            {user.isLoggedIn ? (
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => setIsProfileModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-250 text-xs sm:text-sm font-bold shadow-sm transition active:scale-95 cursor-pointer flex items-center gap-1.5 flex-shrink-0"
                >
                  <div
                    className="w-4.5 h-4.5 rounded-full flex items-center justify-center font-serif text-[10px] font-bold text-white"
                    style={{ backgroundColor: user.avatarColor }}
                  >
                    {user.pseudonym[0]}
                  </div>
                  <span>Profilim</span>
                </button>
                
                <button
                  onClick={logout}
                  title="Çıkış Yap"
                  className="p-2.5 rounded-xl bg-gray-50 hover:bg-rose-50 hover:text-rose-700 border border-gray-200 text-gray-700 transition cursor-pointer flex-shrink-0"
                >
                  <LogOut className="w-4.5 h-4.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => { setAuthModalTab('login'); setIsAuthModalOpen(true); }}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold shadow transition active:scale-95 cursor-pointer flex-shrink-0"
              >
                <LogIn className="w-4 h-4" />
                <span>Giriş Yap / Üye Ol</span>
              </button>
            )}

            {/* Write Letter Button */}
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
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs sm:text-sm font-bold shadow transition transform active:scale-95 cursor-pointer flex-shrink-0"
              >
                <PenTool className="w-4 h-4" />
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
