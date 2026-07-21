'use client';

import React, { useState } from 'react';
import { useDMA } from '@/context/DMAContext';
import { ShieldCheck, Lock, X, Table, Mail, User } from 'lucide-react';

export const AdminPanelModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { letters, penpals } = useDMA();
  const [selectedUserForLetters, setSelectedUserForLetters] = useState<string | null>(null);

  if (!isOpen) return null;

  // Filter letters for the clicked/selected user (both sent or received by this user)
  const userLetters = selectedUserForLetters
    ? letters.filter(
        l =>
          l.senderId === selectedUserForLetters ||
          l.recipientId === selectedUserForLetters ||
          l.senderName === selectedUserForLetters ||
          l.recipientName === selectedUserForLetters
      )
    : [];

  const selectedPseudonymName = selectedUserForLetters;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-5xl rounded-3xl bg-white border border-gray-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header Bar (Sade & Sakin) */}
        <div className="px-8 py-5 border-b border-gray-250 bg-gray-50 flex items-center justify-between text-gray-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-100 border border-gray-300 flex items-center justify-center text-gray-700">
              <Table className="w-5.5 h-5.5" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold">
                Platform Üye Kayıtları (Excel Görünümü)
              </h2>
              <p className="text-xs text-gray-500 font-medium">
                mektuparkadasi.net • Sistem Yöneticisi Denetim Tablosu
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-650 transition cursor-pointer"
          >
            <X className="w-5.5 h-5.5" />
          </button>
        </div>

        {/* Tablo Gövdesi (Sakin Excel Tablosu) */}
        <div className="p-8 overflow-y-auto space-y-6 flex-1 text-sm text-gray-900">
          
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-start gap-2.5">
            <Lock className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm">
              💡 <strong>Yönetici Bilgilendirmesi:</strong> Excel tablosundaki herhangi bir üyenin <strong>Rumuz (Takma Ad)</strong> bilgisine tıklayarak, o üyenin gönderdiği ve aldığı tüm mektup yazışmalarını aşağıda listeleyebilirsiniz.
            </p>
          </div>

          {/* Excel Style Table Grid */}
          <div className="border border-gray-300 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse bg-white">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-300 text-gray-800 font-bold text-xs sm:text-sm">
                  <th className="p-3 border-r border-gray-300">Adı Soyadı</th>
                  <th className="p-3 border-r border-gray-300">Telefon</th>
                  <th className="p-3 border-r border-gray-300">E-posta</th>
                  <th className="p-3 border-r border-gray-300 text-rose-800">Rumuz (Yazışmalar İçin Tıkla)</th>
                  <th className="p-3 border-r border-gray-300">Yaş</th>
                  <th className="p-3">Şehir (Memleket)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-xs sm:text-sm text-gray-800">
                {penpals.map((p, idx) => (
                  <tr key={p.id || idx} className="hover:bg-gray-50/80 transition">
                    <td className="p-3 border-r border-gray-250 font-medium">
                      {p.fullName || 'Tahir Özcan Ersöz'}
                    </td>
                    <td className="p-3 border-r border-gray-250 font-mono text-gray-700">
                      {p.phoneNumber || '0532 999 88 77'}
                    </td>
                    <td className="p-3 border-r border-gray-250 font-mono text-gray-700">
                      {p.email || 'tahir@email.com'}
                    </td>
                    <td className="p-3 border-r border-gray-250">
                      <button
                        onClick={() => setSelectedUserForLetters(p.pseudonym)}
                        className={`text-rose-700 font-bold hover:underline cursor-pointer flex items-center gap-1 ${
                          selectedUserForLetters === p.pseudonym ? 'bg-rose-50 px-2 py-0.5 rounded border border-rose-200' : ''
                        }`}
                      >
                        🎭 {p.pseudonym}
                      </button>
                    </td>
                    <td className="p-3 border-r border-gray-250 font-bold">{p.age}</td>
                    <td className="p-3 font-medium">{p.city}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* User Correspondences View (Seçilen Rumuzun Yazışmaları) */}
          {selectedUserForLetters && (
            <div className="p-6 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                <h3 className="font-serif text-lg font-bold text-amber-950 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-rose-700" />
                  <span>"{selectedPseudonymName}" Kullanıcısının Tüm Yazışmaları ({userLetters.length} Mektup)</span>
                </h3>
                <button
                  onClick={() => setSelectedUserForLetters(null)}
                  className="text-xs text-rose-800 hover:underline font-bold cursor-pointer"
                >
                  Kapat
                </button>
              </div>

              {userLetters.length === 0 ? (
                <p className="text-sm text-gray-500 font-serif italic text-center py-6">
                  Bu kullanıcının henüz gönderdiği veya aldığı bir mektup bulunmuyor.
                </p>
              ) : (
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
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

        {/* Footer (Sade ve Temiz - Alttaki Şerit Kaldırıldı) */}
        <div className="px-8 py-5 border-t border-gray-250 bg-gray-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-bold text-base transition cursor-pointer"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
