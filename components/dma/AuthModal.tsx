'use client';

import React, { useState } from 'react';
import { useDMA } from '@/context/DMAContext';
import { X, Lock, Mail, User, Sparkles, Check, KeyRound, ShieldCheck } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, login, register } = useDMA();
  const [mode, setMode] = useState<'register' | 'login'>('register');

  // Form states
  const [pseudonym, setPseudonym] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState(28);
  const [city, setCity] = useState('İstanbul');
  const [interestsStr, setInterestsStr] = useState('Edebiyat, Nostalji, Gece Sohbetleri');
  const [error, setError] = useState('');

  if (!isAuthModalOpen) return null;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pseudonym.trim()) {
      setError('Lütfen mektuplarında görünecek bir Rumuz (Takma Ad) belirle.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Lütfen geçerli bir e-posta adresi gir.');
      return;
    }

    const interests = interestsStr
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    register({
      pseudonym,
      email,
      age: Number(age),
      city,
      country: 'Türkiye',
      interests,
    });

    setError('');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pseudonym.trim()) {
      setError('Lütfen Rumuzunu veya E-postanı gir.');
      return;
    }
    login(pseudonym);
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-3xl bg-white border border-gray-200 shadow-2xl overflow-hidden flex flex-col my-8">
        
        {/* Modal Header */}
        <div className="px-8 py-6 bg-gradient-to-r from-rose-950 via-rose-900 to-amber-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-amber-300">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-2xl font-bold tracking-wide">mektuparkadasi.net</h3>
              <p className="text-sm text-amber-200/90 font-medium">Kullanıcı Girişi & Üyelik</p>
            </div>
          </div>

          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-200 transition cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-gray-200 bg-gray-50 text-base font-bold">
          <button
            onClick={() => { setMode('register'); setError(''); }}
            className={`flex-1 py-4 text-center transition border-b-2 cursor-pointer ${
              mode === 'register'
                ? 'border-rose-700 text-rose-700 bg-white'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            ✨ Üye Ol
          </button>

          <button
            onClick={() => { setMode('login'); setError(''); }}
            className={`flex-1 py-4 text-center transition border-b-2 cursor-pointer ${
              mode === 'login'
                ? 'border-rose-700 text-rose-700 bg-white'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            🔑 Giriş Yap
          </button>
        </div>

        {/* Form Body */}
        <div className="p-8 space-y-6">
          {error && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-bold">
              {error}
            </div>
          )}

          {mode === 'register' ? (
            <form onSubmit={handleRegister} className="space-y-5 text-base">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-sm sm:text-base leading-relaxed flex items-start gap-3">
                <ShieldCheck className="w-6 h-6 text-amber-700 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Gerçek Ad ve Soyad İstenmez!</strong> Mektuplarında sadece belirleyeceğin rumuz (takma ad) görünür.
                </div>
              </div>

              <div>
                <label className="block text-gray-900 font-bold mb-2 text-base">Rumuz (Takma Ad) *</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: GeceOkuru, SessizLiman, NostaljiRuhu"
                  value={pseudonym}
                  onChange={e => setPseudonym(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-rose-700 text-base font-medium"
                />
              </div>

              <div>
                <label className="block text-gray-900 font-bold mb-2 text-base">E-posta Adresi *</label>
                <input
                  type="email"
                  required
                  placeholder="eposta@ornek.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-rose-700 text-base font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-900 font-bold mb-2 text-base">Yaş</label>
                  <input
                    type="number"
                    value={age}
                    onChange={e => setAge(Number(e.target.value))}
                    className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-rose-700 text-base font-medium"
                  />
                </div>
                <div>
                  <label className="block text-gray-900 font-bold mb-2 text-base">Şehir</label>
                  <input
                    type="text"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-rose-700 text-base font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-900 font-bold mb-2 text-base">İlgi Alanların (Virgülle Ayırın)</label>
                <input
                  type="text"
                  value={interestsStr}
                  onChange={e => setInterestsStr(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-rose-700 text-base font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-700 to-red-800 hover:from-rose-800 hover:to-red-900 text-white font-bold text-lg shadow-xl transition transform active:scale-95 cursor-pointer mt-2"
              >
                ✨ Kaydol & Sandığımı Aç
              </button>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="space-y-5 text-base">
              <div>
                <label className="block text-gray-900 font-bold mb-2 text-base">Rumuz veya E-posta</label>
                <input
                  type="text"
                  required
                  placeholder="Kayıtlı Rumuzun veya E-postan"
                  value={pseudonym}
                  onChange={e => setPseudonym(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-rose-700 text-base font-medium"
                />
              </div>

              <div>
                <label className="block text-gray-900 font-bold mb-2 text-base">Şifre</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-rose-700 text-base font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-700 to-red-800 hover:from-rose-800 hover:to-red-900 text-white font-bold text-lg shadow-xl transition transform active:scale-95 cursor-pointer mt-2"
              >
                🔑 Hesabıma Giriş Yap
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
