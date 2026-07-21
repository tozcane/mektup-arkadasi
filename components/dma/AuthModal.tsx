'use client';

import React, { useState } from 'react';
import { useDMA } from '@/context/DMAContext';
import { X, Lock, Mail, User, ShieldCheck, Phone, MapPin, KeyRound, Sparkles, Check } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, login, register } = useDMA();
  const [mode, setMode] = useState<'register' | 'login'>('register');

  // Form states
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pseudonym, setPseudonym] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState(28);
  const [city, setCity] = useState('İstanbul');
  const [interestsStr, setInterestsStr] = useState('Edebiyat, Nostalji, Gece Sohbetleri');
  const [error, setError] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // Email Verification Step State
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [codeInput, setCodeInput] = useState('');

  if (!isAuthModalOpen) return null;

  const initiateRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError('Lütfen Adınızı ve Soyadınızı girin.');
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
    if (!email.trim() || !email.includes('@')) {
      setError('Lütfen geçerli bir e-posta adresi girin.');
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

    // Generate a 6-digit verification code and proceed to code entry step
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);
    setIsVerifying(true);
    setError('');
  };

  const handleVerifyAndRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (codeInput.trim() !== generatedCode) {
      setError('Girdiğiniz doğrulama kodu hatalı. Lütfen kontrol edin.');
      return;
    }

    const interests = interestsStr
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    register({
      pseudonym,
      fullName,
      phoneNumber,
      email,
      age: Number(age),
      city,
      country: 'Türkiye',
      interests,
    });

    // Reset verification states
    setIsVerifying(false);
    setError('');
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
        
        {/* Modal Header */}
        <div className="px-8 py-6 bg-gradient-to-r from-rose-950 via-rose-900 to-amber-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-amber-300">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-2xl font-bold tracking-wide">mektuparkadasi.net</h3>
              <p className="text-sm text-amber-200/90 font-medium">Kullanıcı Girişi & Güvenli Kayıt</p>
            </div>
          </div>

          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-200 transition cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Selection (Verification step has no tabs) */}
        {!isVerifying && (
          <div className="flex border-b border-gray-200 bg-gray-50 text-base font-bold">
            <button
              onClick={() => { setMode('register'); setError(''); }}
              className={`flex-1 py-4 text-center transition border-b-2 cursor-pointer ${
                mode === 'register'
                  ? 'border-rose-700 text-rose-700 bg-white'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              ✨ Üye Ol (Kayıt Ol)
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
        )}

        {/* Form Body */}
        <div className="p-8 space-y-6">
          {error && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-bold">
              ⚠️ {error}
            </div>
          )}

          {isVerifying ? (
            /* =========================================================
               E-POSTA DOĞRULAMA KODU EKRANI (STEP 2)
               ========================================================= */
            <form onSubmit={handleVerifyAndRegister} className="space-y-6 text-base">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-sm sm:text-base leading-relaxed text-center space-y-2">
                <p className="font-bold text-lg text-rose-800">📬 E-posta Doğrulama Kodu</p>
                <p>
                  <strong>{email}</strong> adresinize 6 haneli doğrulama kodu gönderilmiştir. Lütfen gelen kodu giriniz.
                </p>
              </div>

              {/* Simulation Code Helper */}
              <div className="p-3 rounded-xl bg-gray-100 border border-gray-200 text-gray-700 text-center font-mono text-sm">
                Simüle Edilen E-posta Doğrulama Kodu: <span className="font-bold text-rose-700 text-base">{generatedCode}</span>
              </div>

              <div>
                <label className="block text-gray-900 font-bold mb-2 text-base text-center">Doğrulama Kodu *</label>
                <input
                  type="text"
                  required
                  placeholder="------"
                  value={codeInput}
                  onChange={e => setCodeInput(e.target.value)}
                  className="w-full text-center bg-gray-50 border-2 border-gray-300 rounded-xl px-4 py-3.5 text-gray-900 focus:outline-none focus:border-rose-700 text-xl font-bold tracking-widest"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setIsVerifying(false)}
                  className="flex-1 py-3.5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-base cursor-pointer"
                >
                  Geri Dön
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold text-base shadow-lg cursor-pointer"
                >
                  Doğrula ve Kaydol
                </button>
              </div>
            </form>
          ) : mode === 'register' ? (
            /* =========================================================
               ÜYE KAYIT FORMU (MANDATORY FIELDS - STEP 1)
               ========================================================= */
            <form onSubmit={initiateRegistration} className="space-y-4 text-base">
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-900 font-bold mb-1.5 text-sm sm:text-base">Adı Soyadı *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ad Soyad"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-3.5 py-2.5 text-gray-950 focus:outline-none focus:border-rose-700 text-base"
                  />
                </div>
                <div>
                  <label className="block text-gray-900 font-bold mb-1.5 text-sm sm:text-base">Telefon Numarası *</label>
                  <input
                    type="tel"
                    required
                    placeholder="05XX XXX XX XX"
                    value={phoneNumber}
                    onChange={e => setPhoneNumber(e.target.value)}
                    className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-3.5 py-2.5 text-gray-950 focus:outline-none focus:border-rose-700 text-base"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-900 font-bold mb-1.5 text-sm sm:text-base">Rumuz (Takma Ad) *</label>
                  <input
                    type="text"
                    required
                    placeholder="Mektup Takma Adı"
                    value={pseudonym}
                    onChange={e => setPseudonym(e.target.value)}
                    className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-3.5 py-2.5 text-gray-950 focus:outline-none focus:border-rose-700 text-base font-medium"
                  />
                </div>
                <div>
                  <label className="block text-gray-900 font-bold mb-1.5 text-sm sm:text-base">Yaş *</label>
                  <input
                    type="number"
                    required
                    placeholder="Yaş"
                    value={age}
                    onChange={e => setAge(Number(e.target.value))}
                    className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-3.5 py-2.5 text-gray-950 focus:outline-none focus:border-rose-700 text-base"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-900 font-bold mb-1.5 text-sm sm:text-base">Memleketi / Şehir *</label>
                  <input
                    type="text"
                    required
                    placeholder="Şehir"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-3.5 py-2.5 text-gray-950 focus:outline-none focus:border-rose-700 text-base"
                  />
                </div>
                <div>
                  <label className="block text-gray-900 font-bold mb-1.5 text-sm sm:text-base">İlgi Alanları *</label>
                  <input
                    type="text"
                    required
                    placeholder="Edebiyat, Nostalji, Doğa"
                    value={interestsStr}
                    onChange={e => setInterestsStr(e.target.value)}
                    className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-3.5 py-2.5 text-gray-950 focus:outline-none focus:border-rose-700 text-base"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-900 font-bold mb-1.5 text-sm sm:text-base">E-posta Adresi *</label>
                <input
                  type="email"
                  required
                  placeholder="eposta@ornek.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-3.5 py-2.5 text-gray-950 focus:outline-none focus:border-rose-700 text-base"
                />
              </div>

              <div>
                <label className="block text-gray-900 font-bold mb-1.5 text-sm sm:text-base">Şifre *</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-3.5 py-2.5 text-gray-950 focus:outline-none focus:border-rose-700 text-base"
                />
              </div>

              {/* Telif & Topluluk Kuralları Checkbox */}
              <div className="flex items-start gap-2.5 pt-2">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  checked={acceptedTerms}
                  onChange={e => setAcceptedTerms(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-rose-700 focus:ring-rose-500 cursor-pointer mt-0.5"
                />
                <label htmlFor="terms" className="text-xs sm:text-sm text-gray-650 leading-relaxed cursor-pointer font-medium select-none">
                  Paylaştığım mektupların özgün olduğunu, telif haklarını ihlal etmediğini ve topluluk kurallarına (saygı çerçevesinde argo/küfür/hakaret içermeyen dil) uyacağımı kabul ediyorum. *
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-700 to-red-800 hover:from-rose-800 hover:to-red-900 text-white font-bold text-lg shadow-xl transition transform active:scale-95 cursor-pointer mt-3"
              >
                ✨ Doğrulama Kodu Gönder & Kaydol
              </button>
            </form>
          ) : (
            /* =========================================================
               ÜYE GİRİŞ FORMU
               ========================================================= */
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
