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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#1a110e] border border-[#3b2a22] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Bar */}
        <div className="px-6 py-4 bg-[#231713] border-b border-[#3b2a22] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-[#d4a373]" />
            <h2 className="font-serif text-lg font-bold text-[#f4ebd9]">
              Anonim Profilimi Düzenle
            </h2>
          </div>

          <button
            onClick={() => setIsProfileModalOpen(false)}
            className="p-2 rounded-lg bg-[#2e1f18] text-[#a89078] hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1 font-sans text-xs">
          <div>
            <label className="block text-[#d4a373] font-typewriter mb-1">Rumuz (Takma Ad)</label>
            <input
              type="text"
              value={pseudonym}
              onChange={e => setPseudonym(e.target.value)}
              className="w-full bg-[#231713] border border-[#3b2a22] rounded-lg px-3 py-2 text-[#f4ebd9] font-typewriter focus:outline-none focus:border-[#8b261a]"
            />
            <p className="text-[10px] text-[#a89078] mt-1 font-serif italic">
              Gerçek adın gizli tutulur. Mektup arkadaşlarının göreceği tek isim budur.
            </p>
          </div>

          <div>
            <label className="block text-[#d4a373] font-typewriter mb-1">Başlık / Mottan</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-[#231713] border border-[#3b2a22] rounded-lg px-3 py-2 text-[#f4ebd9] focus:outline-none focus:border-[#8b261a]"
            />
          </div>

          <div>
            <label className="block text-[#d4a373] font-typewriter mb-1">Biyografi & Mektup Beklentilerin</label>
            <textarea
              rows={3}
              value={bio}
              onChange={e => setBio(e.target.value)}
              className="w-full bg-[#231713] border border-[#3b2a22] rounded-lg px-3 py-2 text-[#f4ebd9] focus:outline-none focus:border-[#8b261a] resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#d4a373] font-typewriter mb-1">Yaşın</label>
              <input
                type="number"
                value={age}
                onChange={e => setAge(Number(e.target.value))}
                className="w-full bg-[#231713] border border-[#3b2a22] rounded-lg px-3 py-2 text-[#f4ebd9] focus:outline-none focus:border-[#8b261a]"
              />
            </div>
            <div>
              <label className="block text-[#d4a373] font-typewriter mb-1">Şehir / Ülke</label>
              <input
                type="text"
                value={city}
                onChange={e => setCity(e.target.value)}
                className="w-full bg-[#231713] border border-[#3b2a22] rounded-lg px-3 py-2 text-[#f4ebd9] focus:outline-none focus:border-[#8b261a]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#d4a373] font-typewriter mb-1">
              İlgi Alanların (Virgülle ayırarak yaz)
            </label>
            <input
              type="text"
              value={interestsText}
              onChange={e => setInterestsText(e.target.value)}
              className="w-full bg-[#231713] border border-[#3b2a22] rounded-lg px-3 py-2 text-[#f4ebd9] focus:outline-none focus:border-[#8b261a]"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-[#231713] border-t border-[#3b2a22] flex items-center justify-between">
          <button
            onClick={() => setIsProfileModalOpen(false)}
            className="px-4 py-2 rounded-lg bg-[#2e1f18] text-[#a89078] hover:text-white transition text-xs"
          >
            Vazgeç
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[#8b261a] hover:bg-[#a83222] text-white font-bold text-xs shadow transition"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>Kaydedildi</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Kaydet</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
