'use client';

import React, { useState } from 'react';
import { useDMA } from '@/context/DMAContext';
import { X, User, Save, Check } from 'lucide-react';

export const ProfileModal: React.FC = () => {
  const { user, updateUser, isProfileModalOpen, setIsProfileModalOpen } = useDMA();

  const [pseudonym, setPseudonym] = useState(user.pseudonym);
  const [title, setTitle] = useState(user.title);
  const [bio, setBio] = useState(user.bio);
  const [age, setAge] = useState(user.age);
  const [city, setCity] = useState(user.city);
  const [interestsText, setInterestsText] = useState(user.interests.join(', '));
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isProfileModalOpen) return null;

  const handleSave = () => {
    const interests = interestsText
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    updateUser({
      pseudonym,
      title,
      bio,
      age: Number(age),
      city,
      interests,
    });

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setIsProfileModalOpen(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-3xl bg-white border border-gray-200 shadow-2xl overflow-hidden flex flex-col my-8">
        
        {/* Header Bar */}
        <div className="px-8 py-6 bg-gradient-to-r from-rose-950 via-rose-900 to-amber-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-amber-300">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold tracking-wide">
                Anonim Profilimi Düzenle
              </h2>
              <p className="text-sm text-amber-200/90 font-medium">Kimliğini ve İlgi Alanlarını Güncelle</p>
            </div>
          </div>

          <button
            onClick={() => setIsProfileModalOpen(false)}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-200 transition cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Body (Büyük ve Rahat Okunabilir) */}
        <div className="p-8 space-y-6 overflow-y-auto flex-1 text-base text-gray-900">
          <div>
            <label className="block text-gray-900 font-bold mb-2 text-base">Rumuz (Takma Ad)</label>
            <input
              type="text"
              value={pseudonym}
              onChange={e => setPseudonym(e.target.value)}
              className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-rose-700 text-base font-medium"
            />
            <p className="text-xs sm:text-sm text-gray-500 mt-2 font-serif italic">
              Gerçek adın tamamen gizlidir. Mektup arkadaşının göreceği tek isim budur.
            </p>
          </div>

          <div>
            <label className="block text-gray-900 font-bold mb-2 text-base">Başlık / Mottan</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-rose-700 text-base font-medium"
            />
          </div>

          <div>
            <label className="block text-gray-900 font-bold mb-2 text-base">Biyografi & Mektup Beklentilerin</label>
            <textarea
              rows={4}
              value={bio}
              onChange={e => setBio(e.target.value)}
              className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-rose-700 text-base font-medium resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-900 font-bold mb-2 text-base">Yaşın</label>
              <input
                type="number"
                value={age}
                onChange={e => setAge(Number(e.target.value))}
                className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-rose-700 text-base font-medium"
              />
            </div>
            <div>
              <label className="block text-gray-900 font-bold mb-2 text-base">Şehir / Ülke</label>
              <input
                type="text"
                value={city}
                onChange={e => setCity(e.target.value)}
                className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-rose-700 text-base font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-900 font-bold mb-2 text-base">
              İlgi Alanların (Virgülle Ayırın)
            </label>
            <input
              type="text"
              value={interestsText}
              onChange={e => setInterestsText(e.target.value)}
              className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-rose-700 text-base font-medium"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-8 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-base font-bold">
          <button
            onClick={() => setIsProfileModalOpen(false)}
            className="px-6 py-2.5 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 transition cursor-pointer"
          >
            Vazgeç
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold transition shadow-lg cursor-pointer"
          >
            {savedSuccess ? (
              <>
                <Check className="w-5 h-5" />
                <span>Kaydedildi</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Kaydet</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
