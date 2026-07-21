'use client';

import React, { useState } from 'react';
import { useDMA } from '@/context/DMAContext';
import { X, Lock, Mail, User, ShieldCheck, Phone, MapPin, KeyRound, Sparkles, Check } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, login, register } = useDMA();
  const [mode, setMode] = useState<'register' | 'login'>('register');

  // Form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pseudonym, setPseudonym] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState(28);
  const [city, setCity] = useState('İstanbul');
  const [interestsStr, setInterestsStr] = useState('');
  const [error, setError] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [gender, setGender] = useState<'Kadın' | 'Erkek' | 'Belirtmek İstemiyorum' | ''>('');
  const [isSubmittedAttempt, setIsSubmittedAttempt] = useState(false);

  // Email Verification Step State
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [codeInput, setCodeInput] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSendCode = async () => {
    setIsSubmittedAttempt(true);
    // Validate mandatory registration details before generating verification code
    if (!firstName.trim() || !lastName.trim() || !phoneNumber.trim() || !pseudonym.trim() || !city.trim() || !interestsStr.trim() || !gender) {
      setError('Lütfen kırmızıyla işaretli tüm alanları doldurun.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Lütfen geçerli bir e-posta adresi girin.');
      return;
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);
    setIsCodeSent(true);
    setError('');

    try {
      const res = await fetch('/api/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Doğrulama kodu gönderilemedi.');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('E-posta sunucusu bağlantı hatası.');
    }
  };

  const initiateRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittedAttempt(true);
    if (!firstName.trim()) {
      setError('Lütfen Adınızı girin.');
      return;
    }
    if (!lastName.trim()) {
      setError('Lütfen Soyadınızı girin.');
      return;
    }
    if (!phoneNumber.trim()) {
      setError('Lütfen Telefon Numaranızı girin.');
      return;
    }
    if (!pseudonym.trim()) {
      setError('Lütfen Rumuzunuzu (Takma Ad) belirleyin.');
      return;
    }
    if (!gender) {
      setError('Lütfen Cinsiyetinizi seçin.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Lütfen geçerli bir e-posta adresi girin.');
      return;
    }
    if (!isCodeSent) {
      setError('Lütfen önce e-postanıza doğrulama kodu gönderin.');
      return;
    }
    if (codeInput.trim() !== generatedCode) {
      setError('Girdiğiniz doğrulama kodu hatalı. Lütfen kontrol edin.');
      setCodeInput('');
      return;
    }
    if (!password.trim()) {
      setError('Lütfen şifre belirleyin.');
      return;
    }
    if (!acceptedTerms) {
      setError('Devam etmek için lütfen telif hakları ve saygı kuralları onay kutusunu işaretleyin.');
      return;
    }

    const interests = interestsStr
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const fullName = `${firstName.trim()} ${lastName.trim()}`;

    register({
      pseudonym,
      fullName,
      phoneNumber,
      email,
      age: Number(age),
      city,
      country: 'Türkiye',
      interests,
      gender: gender as 'Kadın' | 'Erkek',
    });

    // Reset verification states
    setIsCodeSent(false);
    setCodeInput('');
    setGeneratedCode('');
    setError('');
    setIsSubmittedAttempt(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pseudonym.trim()) {
      setError('Lütfen Rumuzunuzu veya E-postanızı girin.');
      return;
    }
    login(pseudonym, password);
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-3xl bg-white border border-gray-200 shadow-2xl overflow-hidden flex flex-col my-8">
        
        {/* Modal Header (Büyütüldü) */}
        <div className="px-8 py-6 bg-gradient-to-r from-rose-950 via-rose-900 to-amber-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-amber-300">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-wide">mektuparkadasi.net</h3>
              <p className="text-base text-amber-100 font-bold">Kullanıcı Girişi & Güvenli Kayıt</p>
            </div>
          </div>

          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-200 transition cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-gray-200 bg-gray-50 text-lg font-extrabold">
          <button
            onClick={() => { setMode('register'); setError(''); setIsSubmittedAttempt(false); setGender(''); }}
            className={`flex-1 py-4 text-center transition border-b-2 cursor-pointer ${
              mode === 'register'
                ? 'border-rose-700 text-rose-750 bg-white'
                : 'border-transparent text-gray-650 hover:text-gray-900'
            }`}
          >
            ✨ Üye Ol
          </button>

          <button
            onClick={() => { setMode('login'); setError(''); setIsSubmittedAttempt(false); setGender(''); }}
            className={`flex-1 py-4 text-center transition border-b-2 cursor-pointer ${
              mode === 'login'
                ? 'border-rose-700 text-rose-750 bg-white'
                : 'border-transparent text-gray-650 hover:text-gray-900'
            }`}
          >
            🔑 Üye Girişi
          </button>
        </div>

        {/* Form Body */}
        <div className="p-8 space-y-6">
          {error && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-base font-extrabold">
              ⚠️ {error}
            </div>
          )}

          {mode === 'register' ? (
            /* =========================================================
               ÜYE KAYIT FORMU (Büyütüldü - Onay Kodu Gönderme & Kutusu Dahil)
               ========================================================= */
            <form onSubmit={initiateRegistration} className="space-y-5 text-lg">
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-955 font-extrabold mb-1.5 text-base">Adı *</label>
                  <input
                    type="text"
                    required
                    placeholder="Adınız"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    className={`w-full bg-gray-50 border-2 rounded-xl px-4 py-3 text-gray-955 focus:outline-none text-lg font-bold transition-all ${
                      isSubmittedAttempt && !firstName.trim()
                        ? 'border-rose-500 bg-rose-50/20'
                        : 'border-gray-200 focus:border-rose-700'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-gray-955 font-extrabold mb-1.5 text-base">Soyadı *</label>
                  <input
                    type="text"
                    required
                    placeholder="Soyadınız"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    className={`w-full bg-gray-50 border-2 rounded-xl px-4 py-3 text-gray-955 focus:outline-none text-lg font-bold transition-all ${
                      isSubmittedAttempt && !lastName.trim()
                        ? 'border-rose-500 bg-rose-50/20'
                        : 'border-gray-200 focus:border-rose-700'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-955 font-extrabold mb-1.5 text-base">Telefon Numarası *</label>
                  <input
                    type="tel"
                    required
                    placeholder="05XX XXX XX XX"
                    value={phoneNumber}
                    onChange={e => setPhoneNumber(e.target.value)}
                    className={`w-full bg-gray-50 border-2 rounded-xl px-4 py-3 text-gray-955 focus:outline-none text-lg font-bold transition-all ${
                      isSubmittedAttempt && !phoneNumber.trim()
                        ? 'border-rose-500 bg-rose-50/20'
                        : 'border-gray-200 focus:border-rose-700'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-gray-955 font-extrabold mb-1.5 text-base">Rumuz (Takma Ad) *</label>
                  <input
                    type="text"
                    required
                    placeholder="Mektup Takma Adı"
                    value={pseudonym}
                    onChange={e => setPseudonym(e.target.value)}
                    className={`w-full bg-gray-50 border-2 rounded-xl px-4 py-3 text-gray-955 focus:outline-none text-lg font-bold transition-all ${
                      isSubmittedAttempt && !pseudonym.trim()
                        ? 'border-rose-500 bg-rose-50/20'
                        : 'border-gray-200 focus:border-rose-700'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-955 font-extrabold mb-1.5 text-base">Yaş *</label>
                  <input
                    type="number"
                    required
                    placeholder="Yaş"
                    value={age}
                    onChange={e => setAge(Number(e.target.value))}
                    className={`w-full bg-gray-50 border-2 rounded-xl px-4 py-3 text-gray-955 focus:outline-none text-lg font-bold transition-all ${
                      isSubmittedAttempt && (!age || age <= 0)
                        ? 'border-rose-500 bg-rose-50/20'
                        : 'border-gray-200 focus:border-rose-700'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-gray-955 font-extrabold mb-1.5 text-base">Memleketi / Şehir *</label>
                  <input
                    type="text"
                    required
                    placeholder="Şehir"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className={`w-full bg-gray-50 border-2 rounded-xl px-4 py-3 text-gray-955 focus:outline-none text-lg font-bold transition-all ${
                      isSubmittedAttempt && !city.trim()
                        ? 'border-rose-500 bg-rose-50/20'
                        : 'border-gray-200 focus:border-rose-700'
                    }`}
                  />
                </div>
              </div>

              {/* Cinsiyet Seçimi (Yeni Hane - 3 Seçenek) */}
              <div>
                <label className="block text-gray-955 font-extrabold mb-1.5 text-base">Cinsiyetiniz *</label>
                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setGender('Kadın')}
                    className={`py-3.5 rounded-xl border-2 font-bold text-[13px] sm:text-base cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
                      gender === 'Kadın'
                        ? 'bg-rose-50 border-rose-700 text-rose-800 ring-2 ring-rose-200'
                        : isSubmittedAttempt && !gender
                        ? 'border-rose-500 bg-rose-50/20 text-rose-700'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    👩 Kadın
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('Erkek')}
                    className={`py-3.5 rounded-xl border-2 font-bold text-[13px] sm:text-base cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
                      gender === 'Erkek'
                        ? 'bg-rose-50 border-rose-700 text-rose-800 ring-2 ring-rose-200'
                        : isSubmittedAttempt && !gender
                        ? 'border-rose-500 bg-rose-50/20 text-rose-700'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    👨 Erkek
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('Belirtmek İstemiyorum')}
                    className={`py-3.5 rounded-xl border-2 font-bold text-[11px] sm:text-xs leading-tight cursor-pointer transition-all flex items-center justify-center gap-1.5 text-center ${
                      gender === 'Belirtmek İstemiyorum'
                        ? 'bg-rose-50 border-rose-700 text-rose-800 ring-2 ring-rose-200'
                        : isSubmittedAttempt && !gender
                        ? 'border-rose-500 bg-rose-50/20 text-rose-700'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    👤 Belirtme
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-gray-955 font-extrabold mb-1.5 text-base">İlgi Alanları *</label>
                <input
                  type="text"
                  required
                  placeholder="Edebiyat, Nostalji, Doğa"
                  value={interestsStr}
                  onChange={e => setInterestsStr(e.target.value)}
                  className={`w-full bg-gray-50 border-2 rounded-xl px-4 py-3 text-gray-955 focus:outline-none text-lg font-bold transition-all ${
                    isSubmittedAttempt && !interestsStr.trim()
                      ? 'border-rose-500 bg-rose-50/20'
                      : 'border-gray-200 focus:border-rose-700'
                  }`}
                />
              </div>

              <div>
                <label className="block text-gray-955 font-extrabold mb-1.5 text-base">E-posta Adresi *</label>
                <div className="flex gap-3">
                  <input
                    type="email"
                    required
                    placeholder="eposta@ornek.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className={`flex-1 bg-gray-50 border-2 rounded-xl px-4 py-3 text-gray-955 focus:outline-none text-lg font-bold transition-all ${
                      isSubmittedAttempt && (!email.trim() || !email.includes('@'))
                        ? 'border-rose-500 bg-rose-50/20'
                        : 'border-gray-200 focus:border-rose-700'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={handleSendCode}
                    className="px-5 py-3 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-extrabold text-base shadow-md cursor-pointer transition whitespace-nowrap"
                  >
                    {isCodeSent ? 'Tekrar Gönder' : 'Onay Kodu Gönder'}
                  </button>
                </div>
                
                {isCodeSent && (
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-955 text-sm sm:text-base leading-relaxed mt-2 animate-fadeIn font-semibold">
                    📬 <strong>{email}</strong> adresinize doğrulama kodu gönderildi! Lütfen gelen kutunuzu (veya gereksiz klasörünü) kontrol edip kodu giriniz.
                  </div>
                )}
              </div>

              {/* Onay Kodu Giriş Kutusu (Sadece Kod Gönderildiğinde Görünür) */}
              {isCodeSent && (
                <div className="animate-fadeIn space-y-2">
                  <label className="block text-gray-955 font-extrabold mb-1.5 text-base">E-posta Doğrulama Kodu *</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="6 Haneli Doğrulama Kodu"
                      value={codeInput}
                      onChange={e => setCodeInput(e.target.value)}
                      className={`w-full bg-gray-50 border-2 rounded-xl px-4 py-3.5 text-gray-955 focus:outline-none text-lg font-bold tracking-widest text-center transition-all ${
                        codeInput.trim() === generatedCode
                          ? 'border-emerald-500 bg-emerald-50/30'
                          : codeInput.length === 6
                          ? 'border-rose-500 bg-rose-50/30'
                          : isSubmittedAttempt && !codeInput.trim()
                          ? 'border-rose-500 bg-rose-50/20'
                          : 'border-gray-200 focus:border-rose-700'
                      }`}
                    />
                    {codeInput.trim() === generatedCode && (
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-600 font-extrabold text-sm flex items-center gap-1 bg-emerald-100/90 px-3 py-1 rounded-full border border-emerald-300">
                        <Check className="w-4.5 h-4.5" /> Doğrulandı
                      </span>
                    )}
                  </div>
                  {codeInput.trim() === generatedCode ? (
                    <p className="text-emerald-700 text-sm font-bold text-center">✅ Kod eşleşti! Artık kaydolabilirsiniz.</p>
                  ) : codeInput.length === 6 ? (
                    <p className="text-rose-750 text-sm font-bold text-center">❌ Kod hatalı. Lütfen tekrar kontrol edin.</p>
                  ) : null}
                </div>
              )}

              <div>
                <label className="block text-gray-955 font-extrabold mb-1.5 text-base">Şifre *</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className={`w-full bg-gray-50 border-2 rounded-xl px-4 py-3 text-gray-955 focus:outline-none text-lg font-bold transition-all ${
                    isSubmittedAttempt && !password.trim()
                      ? 'border-rose-500 bg-rose-50/20'
                      : 'border-gray-200 focus:border-rose-700'
                  }`}
                />
              </div>

              {/* Telif & Topluluk Kuralları Checkbox (Büyütüldü) */}
              <div className="flex items-start gap-3 pt-2">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  checked={acceptedTerms}
                  onChange={e => setAcceptedTerms(e.target.checked)}
                  className={`w-6 h-6 rounded cursor-pointer mt-0.5 transition-all ${
                    isSubmittedAttempt && !acceptedTerms
                      ? 'ring-2 ring-rose-500 border-rose-500 bg-rose-50/20'
                      : 'border-gray-300 text-rose-700 focus:ring-rose-500'
                  }`}
                />
                <label htmlFor="terms" className="text-sm sm:text-base text-gray-800 leading-relaxed cursor-pointer font-bold select-none">
                  Paylaştığım mektupların özgün olduğunu, telif haklarını ihlal etmediğini ve topluluk kurallarına (saygı çerçevesinde argo/küfür/hakaret içermeyen dil) uyacağımı kabul ediyorum. *
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-4.5 rounded-2xl bg-gradient-to-r from-rose-700 to-red-800 hover:from-rose-800 hover:to-red-900 text-white font-extrabold text-lg sm:text-xl shadow-xl transition transform active:scale-95 cursor-pointer mt-3"
              >
                ✨ Üye Ol & Mektup Sandığını Aç
              </button>
            </form>
          ) : (
            /* =========================================================
               ÜYE GİRİŞ FORMU (Büyütüldü)
               ========================================================= */
            <form onSubmit={handleLogin} className="space-y-6 text-lg">
              <div>
                <label className="block text-gray-950 font-extrabold mb-2.5 text-base sm:text-lg">Rumuz veya E-posta</label>
                <input
                  type="text"
                  required
                  placeholder="Kayıtlı Rumuzun veya E-postan"
                  value={pseudonym}
                  onChange={e => setPseudonym(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4.5 py-3.5 text-gray-950 focus:outline-none focus:border-rose-700 text-lg font-bold"
                />
              </div>

              <div>
                <label className="block text-gray-950 font-extrabold mb-2.5 text-base sm:text-lg">Şifre</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4.5 py-3.5 text-gray-950 focus:outline-none focus:border-rose-700 text-lg font-bold"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4.5 rounded-2xl bg-gradient-to-r from-rose-700 to-red-800 hover:from-rose-800 hover:to-red-900 text-white font-extrabold text-lg sm:text-xl shadow-xl transition transform active:scale-95 cursor-pointer mt-2"
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
