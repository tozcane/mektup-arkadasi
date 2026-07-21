'use client';

import React, { useState } from 'react';
import { useDMA } from '@/context/DMAContext';
import { Mail, Compass, Stamp as StampIcon, Send, ShieldCheck, PenTool, Lock, Sparkles, LogIn, LogOut } from 'lucide-react';
import { ActiveTab } from '@/types/dma';
import { AdminPanelModal } from '@/components/dma/AdminPanelModal';
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
    logout,
  } = useDMA();

  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const unreadCount = letters.filter(l => l.status === 'delivered_unread').length;
  const enRouteCount = letters.filter(l => l.status === 'en_route').length;

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'inbox',
      label: 'Mektup Sandığım',
      icon: <Mail className="w-4 h-4" />,
      badge: unreadCount,
    },
    {
      id: 'en_route',
      label: 'Yoldaki Mektuplar',
      icon: <Send className="w-4 h-4" />,
      badge: enRouteCount,
    },
    {
      id: 'penpals',
      label: 'Tüm Mektup Arkadaşları',
      icon: <Compass className="w-4 h-4" />,
    },
    {
      id: 'stamps',
      label: 'Pul Albümü',
      icon: <StampIcon className="w-4 h-4" />,
    },
  ];

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
          {/* Brand Logo & Title (Tam İdeal Orta Boyut) */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-700 to-rose-900 text-white flex items-center justify-center shadow-md">
              <PenTool className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-xl text-gray-900 tracking-tight">
                  Mektup Arkadaşı
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                  <Lock className="w-3 h-3" />
                  <span>%100 Özel & Gizli</span>
                </span>
              </div>
              <p className="text-[11px] text-rose-700 font-serif italic font-bold">mektuparkadasi.net</p>
            </div>
          </div>

          {/* Navigation Tabs (Giriş Yapıldığında Görünür - İdeal Orta Boyut) */}
          {user.isLoggedIn && (
            <nav className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto py-1">
              {navItems.map(item => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-gray-900 text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {item.icon}
                    <span className="font-sans">{item.label}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="w-5 h-5 rounded-full bg-rose-600 text-white text-[11px] font-bold flex items-center justify-center shadow animate-pulse">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          )}

          {/* Action Controls */}
          <div className="flex items-center gap-2">
            {/* Admin Button */}
            <button
              onClick={() => setIsAdminOpen(true)}
              title="Yönetim Paneli"
              className="flex items-center gap-1 px-2.5 py-2 rounded-lg bg-gray-100 border border-gray-200 text-gray-700 hover:bg-gray-200 text-xs sm:text-sm font-medium transition cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-rose-700" />
              <span className="hidden md:inline">Yönetim</span>
            </button>

            {/* Auth Buttons */}
            {user.isLoggedIn ? (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIsProfileModalOpen(true)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-800 text-xs sm:text-sm transition cursor-pointer"
                >
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] text-white"
                    style={{ backgroundColor: user.avatarColor }}
                  >
                    {user.pseudonym[0]}
                  </div>
                  <span className="hidden md:inline font-typewriter font-bold">{user.pseudonym}</span>
                </button>

                <button
                  onClick={logout}
                  title="Çıkış Yap"
                  className="p-2 rounded-lg bg-gray-100 hover:bg-rose-50 hover:text-rose-700 border border-gray-200 text-gray-600 text-xs transition cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold shadow transition active:scale-95 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Giriş Yap / Üye Ol</span>
              </button>
            )}

            {/* Write Letter Button */}
            <button
              onClick={() => {
                if (!user.isLoggedIn) {
                  setIsAuthModalOpen(true);
                } else {
                  openWriterModal();
                }
              }}
              className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs sm:text-sm font-bold shadow transition transform active:scale-95 cursor-pointer"
            >
              <PenTool className="w-4 h-4" />
              <span>Mektup Yaz</span>
            </button>
          </div>
        </div>
      </header>

      {/* Auth & Admin Modals */}
      <AuthModal />
      <AdminPanelModal isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
    </>
  );
};
