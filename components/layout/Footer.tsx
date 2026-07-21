'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PenTool, ShieldCheck, Heart } from 'lucide-react';
import { AdminPanelModal } from '@/components/dma/AdminPanelModal';

export default function Footer() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  return (
    <footer className="mt-20 border-t border-gray-200 bg-white/95 backdrop-blur text-gray-700 py-10 relative z-20">
      <div className="max-w-6xl mx-auto px-4 space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-gray-100 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-700 to-rose-900 text-white flex items-center justify-center shadow">
              <PenTool className="w-5 h-5" />
            </div>
            <div>
              <span className="font-serif font-bold text-xl text-gray-900 block">mektuparkadasi.net</span>
              <p className="text-xs text-gray-500 font-typewriter">Hızlı Dünyanın Gürültüsünden Uzak, Yavaş İletişim Kulübü</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs font-bold text-gray-600 font-typewriter">
            <span>🔒 %100 Gizli & Anonim</span>
            <span>🕯️ Mühürlü Mektuplar</span>
            <span>🕊️ Yavaş Teslimat</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 font-typewriter">
          <p>© 2026 mektuparkadasi.net. Tüm hakları saklıdır.</p>

          <div className="flex items-center gap-4">
            <span className="text-gray-400">Sevgi ve samimiyetle tasarlandı</span>
            {/* Secret Admin Button for Platform Owner */}
            <button
              onClick={() => setIsAdminOpen(true)}
              title="Yönetim Paneli Girişi"
              className="p-1 rounded text-gray-400 hover:text-gray-900 transition cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <AdminPanelModal isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
    </footer>
  );
}