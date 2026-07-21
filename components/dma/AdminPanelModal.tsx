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
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-3xl bg-white border border-gray-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Admin Header (Sade & Büyük Font) */}
        <div className="px-8 py-6 bg-gradient-to-r from-rose-950 via-rose-900 to-amber-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-amber-300 shadow-lg">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-2xl font-bold tracking-wide">
                  Platform Yönetim & Gizlilik Paneli
                </h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-700 text-white font-bold uppercase tracking-wider">
                  Yönetici
                </span>
              </div>
              <p className="text-sm text-amber-200/90 font-medium">
                mektuparkadasi.net • Uçtan Uca Gizlilik & Yönetim Merkezi
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-200 transition cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Tabs (Büyük & Okunaklı) */}
        <div className="px-8 py-4 bg-gray-50 border-b border-gray-200 flex items-center gap-3 overflow-x-auto text-base font-bold">
          <button
            onClick={() => setAdminTab('privacy')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl transition cursor-pointer ${
              adminTab === 'privacy'
                ? 'bg-rose-700 text-white shadow'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
            }`}
          >
            <Shield className="w-5 h-5" />
            <span>Gizlilik Güvencesi</span>
          </button>

          <button
            onClick={() => setAdminTab('letters')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl transition cursor-pointer ${
              adminTab === 'letters'
                ? 'bg-rose-700 text-white shadow'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
            }`}
          >
            <Mail className="w-5 h-5" />
            <span>Mektup Akışı ({letters.length})</span>
          </button>

          <button
            onClick={() => setAdminTab('users')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl transition cursor-pointer ${
              adminTab === 'users'
                ? 'bg-rose-700 text-white shadow'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
            }`}
          >
            <Users className="w-5 h-5" />
            <span>Kullanıcılar ({penpals.length})</span>
          </button>
        </div>

        {/* Modal Body (Büyük Fontlar) */}
        <div className="p-8 overflow-y-auto space-y-6 flex-1 text-base text-gray-900">
          {adminTab === 'privacy' && (
            <div className="space-y-6">
              {/* Trust Status Card */}
              <div className="p-6 rounded-2xl bg-emerald-50 border-2 border-emerald-200 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 flex-shrink-0">
                    <Lock className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-emerald-950">
                      %100 Kişiye Özel Mektuplaşma Garantisi Aktif
                    </h3>
                    <p className="text-base text-emerald-900 leading-relaxed font-sans mt-1">
                      Platformdaki tüm mektuplar sadece gönderen ve alıcı arasındadır. Dışarıdan veya diğer ziyaretçilerden tamamen gizlidir.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3">
                  <div className="p-4 rounded-xl bg-white border border-emerald-200 text-center shadow-sm">
                    <span className="text-2xl font-bold text-rose-700 block">Anonim</span>
                    <span className="text-xs text-gray-600 font-bold">Gerçek Ad & Fotoğraf Yok</span>
                  </div>
                  <div className="p-4 rounded-xl bg-white border border-emerald-200 text-center shadow-sm">
                    <span className="text-2xl font-bold text-emerald-700 block">Kişiye Özel</span>
                    <span className="text-xs text-gray-600 font-bold">Sandıklar Tamamen Gizli</span>
                  </div>
                  <div className="p-4 rounded-xl bg-white border border-emerald-200 text-center shadow-sm">
                    <span className="text-2xl font-bold text-amber-700 block">Denetim</span>
                    <span className="text-xs text-gray-600 font-bold">Yönetici Moderasyonu</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {adminTab === 'letters' && (
            <div className="space-y-4">
              <h3 className="font-serif text-xl font-bold text-gray-900">
                Sistemdeki Mektup Akışı (Denetim Görünümü)
              </h3>
              <div className="space-y-3">
                {letters.map(l => (
                  <div key={l.id} className="p-4 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between gap-4">
                    <div>
                      <div className="font-bold text-gray-900 text-base">
                        {l.senderName} ➔ {l.recipientName} ({l.subject})
                      </div>
                      <div className="text-sm text-gray-600 font-medium mt-1">
                        Tarih: {new Date(l.sentAt).toLocaleDateString('tr-TR')} • Durum: {l.status}
                      </div>
                    </div>

                    <span className="px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-900 font-bold text-xs">
                      Gizli İletim
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {adminTab === 'users' && (
            <div className="space-y-4">
              <h3 className="font-serif text-xl font-bold text-gray-900">
                Kayıtlı Mektup Arkadaşları Listesi
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {penpals.map(p => (
                  <div key={p.id} className="p-4 rounded-xl bg-gray-50 border border-gray-200 flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-full bg-rose-700 text-white font-bold flex items-center justify-center text-lg flex-shrink-0">
                      {p.pseudonym[0]}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-base">{p.pseudonym} ({p.flag} {p.country})</div>
                      <div className="text-sm text-gray-600 font-medium">{p.age} yaş • {p.lettersExchangedCount} mektup</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-sm text-gray-600 font-bold">
          <span>🛡️ Yönetim Paneli Güvenliği: Aktif</span>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-bold text-base transition cursor-pointer"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
