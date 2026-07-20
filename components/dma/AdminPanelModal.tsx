'use client';

import React, { useState } from 'react';
import { useDMA } from '@/context/DMAContext';
import { Shield, ShieldCheck, Lock, Eye, AlertTriangle, X, Check, Users, Mail, RefreshCw } from 'lucide-react';

export const AdminPanelModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { letters, penpals } = useDMA();
  const [adminTab, setAdminTab] = useState<'privacy' | 'letters' | 'users'>('privacy');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl bg-[#140b08] border border-[#8b261a]/60 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Admin Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#2a0e08] via-[#1a0b08] to-[#120705] border-b border-[#8b261a]/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#8b261a]/30 border border-[#8b261a] flex items-center justify-center text-[#e07a5f] shadow-lg">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-lg font-bold text-[#f4ebd9]">
                  Platform Yönetim & Gizlilik Denetim Paneli
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#8b261a] text-white font-typewriter font-bold uppercase tracking-wider">
                  Yönetici Erişimi
                </span>
              </div>
              <p className="text-xs text-[#a89078] font-typewriter">
                Mektup Arkadaşı • Uçtan Uca Gizlilik & Yönetim Merkezi
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-[#2e1f18] text-[#a89078] hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 py-3 bg-[#1c0f0a] border-b border-[#3b2a22] flex items-center gap-2">
          <button
            onClick={() => setAdminTab('privacy')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-typewriter transition ${
              adminTab === 'privacy'
                ? 'bg-[#8b261a] text-white font-bold'
                : 'bg-[#2a1b15] text-[#a89078] hover:text-[#f4ebd9]'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Gizlilik Güvencesi</span>
          </button>

          <button
            onClick={() => setAdminTab('letters')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-typewriter transition ${
              adminTab === 'letters'
                ? 'bg-[#8b261a] text-white font-bold'
                : 'bg-[#2a1b15] text-[#a89078] hover:text-[#f4ebd9]'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Mektup Akışı & Moderasyon ({letters.length})</span>
          </button>

          <button
            onClick={() => setAdminTab('users')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-typewriter transition ${
              adminTab === 'users'
                ? 'bg-[#8b261a] text-white font-bold'
                : 'bg-[#2a1b15] text-[#a89078] hover:text-[#f4ebd9]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Kullanıcı Kayıtları ({penpals.length})</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {adminTab === 'privacy' && (
            <div className="space-y-6">
              {/* Trust Status Card */}
              <div className="p-6 rounded-xl bg-gradient-to-r from-[#24130c] to-[#1a0e08] border border-[#3b2a22] space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#2e4a3e]/30 border border-[#2e4a3e] flex items-center justify-center text-[#52b788]">
                    <Lock className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#f4ebd9]">
                      %100 Kişiye Özel Mektuplaşma Garantisi Aktif
                    </h3>
                    <p className="text-xs text-[#a89078] font-typewriter">
                      Platformdaki tüm mektuplar sadece gönderen ve alıcı arasındadır. Dışarıdan veya diğer kullanıcılardan tamamen gizlidir.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 rounded-lg bg-[#140b08] border border-[#3b2a22] text-center">
                    <span className="text-xl font-bold text-[#e07a5f] block">Anonim</span>
                    <span className="text-[10px] text-[#a89078] font-typewriter">Gerçek Ad & Fotoğraf Yok</span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#140b08] border border-[#3b2a22] text-center">
                    <span className="text-xl font-bold text-[#52b788] block">Kişiye Özel</span>
                    <span className="text-[10px] text-[#a89078] font-typewriter">Başkası Mektupları Göremez</span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#140b08] border border-[#3b2a22] text-center">
                    <span className="text-xl font-bold text-[#d4a373] block">Denetim</span>
                    <span className="text-[10px] text-[#a89078] font-typewriter">Yönetici Moderasyonu</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {adminTab === 'letters' && (
            <div className="space-y-3">
              <h3 className="font-serif text-sm font-bold text-[#d4a373]">
                Sistemdeki Mektuplar (Yönetici Denetim Görünümü)
              </h3>
              <div className="space-y-2">
                {letters.map(l => (
                  <div key={l.id} className="p-3 rounded-lg bg-[#1a0f0b] border border-[#3b2a22] flex items-center justify-between">
                    <div>
                      <div className="font-bold text-[#f4ebd9]">
                        {l.senderName} ➔ {l.recipientName} ({l.subject})
                      </div>
                      <div className="text-[10px] text-[#a89078] font-typewriter mt-0.5">
                        Tarih: {new Date(l.sentAt).toLocaleDateString('tr-TR')} • Durum: {l.status}
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded bg-[#2e1f18] text-[#d4a373] font-typewriter text-[10px]">
                      Özel İletim
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {adminTab === 'users' && (
            <div className="space-y-3">
              <h3 className="font-serif text-sm font-bold text-[#d4a373]">
                Kayıtlı Mektup Arkadaşları Listesi
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {penpals.map(p => (
                  <div key={p.id} className="p-3 rounded-lg bg-[#1a0f0b] border border-[#3b2a22] flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#8b261a] text-white font-bold flex items-center justify-center text-xs">
                      {p.pseudonym[0]}
                    </div>
                    <div>
                      <div className="font-bold text-[#f4ebd9]">{p.pseudonym} ({p.flag} {p.country})</div>
                      <div className="text-[10px] text-[#a89078] font-typewriter">{p.age} yaş • {p.lettersExchangedCount} mektup</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#1c0f0a] border-t border-[#3b2a22] flex items-center justify-between text-xs text-[#a89078] font-typewriter">
          <span>Yönetim Paneli Güvenliği: Aktif</span>
          <button onClick={onClose} className="px-4 py-1.5 rounded bg-[#8b261a] text-white font-bold">
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
