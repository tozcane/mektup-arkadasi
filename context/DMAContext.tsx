'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Letter, PenPalProfile, UserProfile, ActiveTab, Stamp, PaperThemeId } from '@/types/dma';
import { INITIAL_LETTERS, MOCK_PENPALS, INITIAL_USER, STAMPS } from '@/data/mockData';

interface DMAContextType {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  user: UserProfile;
  updateUser: (updated: Partial<UserProfile>) => void;
  penpals: PenPalProfile[];
  letters: Letter[];
  stamps: Stamp[];
  
  // Authentication State & Actions
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  login: (pseudonymOrEmail: string, password?: string) => boolean;
  register: (params: {
    pseudonym: string;
    fullName: string;
    phoneNumber: string;
    email: string;
    age: number;
    city: string;
    country: string;
    interests: string[];
  }) => void;
  logout: () => void;

  // Moderation Panel Actions
  suspendUser: (id: string) => void;
  activateUser: (id: string) => void;
  deleteUser: (id: string) => void;

  // Modals & Active State
  writingRecipient: PenPalProfile | null;
  openWriterModal: (recipient?: PenPalProfile) => void;
  closeWriterModal: () => void;
  
  readingLetter: Letter | null;
  openReaderModal: (letter: Letter) => void;
  closeReaderModal: () => void;
  
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: (open: boolean) => void;

  // Actions
  sendLetter: (params: {
    recipientId: string;
    recipientName: string;
    subject: string;
    content: string;
    paperTheme: PaperThemeId;
    stampId: string;
  }) => void;
  markLetterAsRead: (letterId: string) => void;
  
  // Ambiance Audio
  isAudioPlaying: boolean;
  toggleAudio: () => void;
}

const DMAContext = createContext<DMAContextType | undefined>(undefined);

export const DMAProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('inbox');
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [penpals, setPenpals] = useState<PenPalProfile[]>(MOCK_PENPALS);
  const [letters, setLetters] = useState<Letter[]>(INITIAL_LETTERS);
  const [stamps] = useState<Stamp[]>(STAMPS);
  
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [writingRecipient, setWritingRecipient] = useState<PenPalProfile | null>(null);
  const [isWritingOpen, setIsWritingOpen] = useState(false);
  const [readingLetter, setReadingLetter] = useState<Letter | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  // Load user session from LocalStorage on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('mektup_user_session');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (e) {
      console.error('Session load error', e);
    }
  }, []);

  // Synchronize en_route letter delivery timers
  useEffect(() => {
    const timer = setInterval(() => {
      setLetters(prevLetters =>
        prevLetters.map(letter => {
          if (letter.status === 'en_route') {
            const deliveryTime = new Date(letter.estimatedDeliveryAt).getTime();
            const now = new Date().getTime();
            if (now >= deliveryTime) {
              return {
                ...letter,
                status: 'delivered_unread',
                deliveredAt: new Date().toISOString(),
              };
            }
          }
          return letter;
        })
      );
    }, 10000);

    return () => clearInterval(timer);
  }, []);

  const updateUser = (updated: Partial<UserProfile>) => {
    setUser(prev => {
      const nextUser = { ...prev, ...updated };
      try {
        localStorage.setItem('mektup_user_session', JSON.stringify(nextUser));
      } catch (e) {}
      return nextUser;
    });
  };

  const login = (pseudonymOrEmail: string, password?: string): boolean => {
    const adminUsername = (process.env.NEXT_PUBLIC_ADMIN_USERNAME || 'tahir_admin').toLowerCase();
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'Mektup2026!Gizli';

    const inputUser = pseudonymOrEmail.trim().toLowerCase();
    const isOwnerAdmin =
      (inputUser === adminUsername || inputUser === 'tahir_admin' || inputUser === 'admin@mektuparkadasi.net') &&
      password === adminPassword;

    const nextUser: UserProfile = {
      ...user,
      pseudonym: isOwnerAdmin ? 'Site Yöneticisi' : (pseudonymOrEmail || 'NostaljikOkur'),
      isLoggedIn: true,
      isAdmin: isOwnerAdmin,
    };
    setUser(nextUser);
    try {
      localStorage.setItem('mektup_user_session', JSON.stringify(nextUser));
    } catch (e) {}
    setIsAuthModalOpen(false);
    return true;
  };

  const register = ({
    pseudonym,
    fullName,
    phoneNumber,
    email,
    age,
    city,
    country,
    interests,
  }: {
    pseudonym: string;
    fullName: string;
    phoneNumber: string;
    email: string;
    age: number;
    city: string;
    country: string;
    interests: string[];
  }) => {
    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      pseudonym: pseudonym.trim() || 'NostaljikDüşünür',
      fullName: fullName.trim(),
      phoneNumber: phoneNumber.trim(),
      email: email.trim(),
      isLoggedIn: true,
      registeredAt: new Date().toISOString(),
      title: 'Mektup Arkadaşı Kulübü Üyesi',
      bio: 'Sakinlik, samimiyet ve nostaljik mektuplar yazmayı seven yeni bir üye.',
      age: age || 30,
      city: city || 'İstanbul',
      country: country || 'Türkiye',
      languages: ['Türkçe', 'İngilizce'],
      interests: interests.length > 0 ? interests : ['Edebiyat', 'Nostalji'],
      avatarColor: '#8b261a',
      stampsCollected: ['stamp-1', 'stamp-2'],
    };

    setUser(newUser);
    try {
      localStorage.setItem('mektup_user_session', JSON.stringify(newUser));
    } catch (e) {}

    // Add user to the PenPalProfile list so they show up in admin panel
    const newPenpal: PenPalProfile = {
      id: newUser.id,
      pseudonym: newUser.pseudonym,
      fullName: newUser.fullName,
      phoneNumber: newUser.phoneNumber,
      email: newUser.email,
      title: newUser.title,
      bio: newUser.bio,
      age: newUser.age,
      country: newUser.country,
      city: newUser.city,
      flag: '🇹🇷',
      languages: newUser.languages,
      interests: newUser.interests,
      avatarStyle: newUser.avatarColor,
      lettersExchangedCount: 0,
      joinedDate: 'Şimdi',
      status: 'active',
      distanceKm: 0,
      estimatedDeliveryHours: 1,
    };

    setPenpals(prev => [...prev, newPenpal]);

    // Generate automatic welcome letter
    const welcomeLetter: Letter = {
      id: `welcome-${Date.now()}`,
      senderId: penpals[0]?.id || 'penpal-1',
      senderName: penpals[0]?.pseudonym || 'SessizLiman',
      senderFlag: penpals[0]?.flag || '🇹🇷',
      recipientId: newUser.id,
      recipientName: newUser.pseudonym,
      subject: `Hoş Geldin ${newUser.pseudonym}! Mektup Sandığın Hazır 🕯️`,
      content: `Sevgili ${newUser.pseudonym},

mektuparkadasi.net ailesine hoş geldin!

Bu mektup sana özel olarak hazırlamış olduğum nostaljik bir karşılama yazısıdır. Hızlı dünyanın karmaşasından ve yüzeysel mesajlarından uzaklaşıp; sakin ve derin yazışmalar yapabileceğin bu özel köşede seninle buluştuğuma çok sevindim.

Sandığın artık tamamen sana özel ve mühürlü. İlk mektubunu yazmak veya benimle dertleşmek istersen tek tıkla mektup kaleme alabilirsin.

Sevgi ve selamlarımla,
SessizLiman`,
      paperTheme: 'parchment',
      stampId: 'stamp-1',
      stampName: 'Kapadokya Balonları',
      stampFlag: '🇹🇷',
      sentAt: new Date().toISOString(),
      estimatedDeliveryAt: new Date().toISOString(),
      deliveredAt: new Date().toISOString(),
      status: 'delivered_unread',
    };

    setLetters(prev => [welcomeLetter, ...prev]);
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    const guestUser: UserProfile = {
      ...user,
      isLoggedIn: false,
    };
    setUser(guestUser);
    try {
      localStorage.removeItem('mektup_user_session');
    } catch (e) {}
  };

  // Moderation Methods
  const suspendUser = (id: string) => {
    setPenpals(prev =>
      prev.map(p => (p.id === id ? { ...p, status: 'away' as const } : p))
    );
  };

  const activateUser = (id: string) => {
    setPenpals(prev =>
      prev.map(p => (p.id === id ? { ...p, status: 'active' as const } : p))
    );
  };

  const deleteUser = (id: string) => {
    setPenpals(prev => prev.filter(p => p.id !== id));
  };

  const openWriterModal = (recipient?: PenPalProfile) => {
    setWritingRecipient(recipient || penpals[0]);
    setIsWritingOpen(true);
  };

  const closeWriterModal = () => {
    setIsWritingOpen(false);
    setWritingRecipient(null);
  };

  const openReaderModal = (letter: Letter) => {
    setReadingLetter(letter);
    if (letter.status === 'delivered_unread') {
      markLetterAsRead(letter.id);
    }
  };

  const closeReaderModal = () => {
    setReadingLetter(null);
  };

  const markLetterAsRead = (letterId: string) => {
    setLetters(prev =>
      prev.map(l => (l.id === letterId ? { ...l, status: 'delivered_read' } : l))
    );
  };

  const sendLetter = ({
    recipientId,
    recipientName,
    subject,
    content,
    paperTheme,
    stampId,
  }: {
    recipientId: string;
    recipientName: string;
    subject: string;
    content: string;
    paperTheme: PaperThemeId;
    stampId: string;
  }) => {
    const selectedStamp = stamps.find(s => s.id === stampId) || stamps[0];
    const targetPenpal = penpals.find(p => p.id === recipientId);
    
    const deliveryHours = targetPenpal ? targetPenpal.estimatedDeliveryHours : 6;
    const now = new Date();
    const deliveryDate = new Date(now.getTime() + deliveryHours * 3600 * 1000);

    const newLetter: Letter = {
      id: `letter-${Date.now()}`,
      senderId: user.id,
      senderName: user.pseudonym,
      senderFlag: '🇹🇷',
      recipientId,
      recipientName,
      subject,
      content,
      paperTheme,
      stampId: selectedStamp.id,
      stampName: selectedStamp.name,
      stampFlag: selectedStamp.flag,
      sentAt: now.toISOString(),
      estimatedDeliveryAt: deliveryDate.toISOString(),
      status: 'en_route',
    };

    setLetters(prev => [newLetter, ...prev]);
    closeWriterModal();
    setActiveTab('en_route');
  };

  const toggleAudio = () => {
    setIsAudioPlaying(prev => !prev);
  };

  return (
    <DMAContext.Provider
      value={{
        activeTab,
        setActiveTab,
        user,
        updateUser,
        penpals,
        letters,
        stamps,
        isAuthModalOpen,
        setIsAuthModalOpen,
        login,
        register,
        logout,
        suspendUser,
        activateUser,
        deleteUser,
        writingRecipient: isWritingOpen ? writingRecipient : null,
        openWriterModal,
        closeWriterModal,
        readingLetter,
        openReaderModal,
        closeReaderModal,
        isProfileModalOpen,
        setIsProfileModalOpen,
        sendLetter,
        markLetterAsRead,
        isAudioPlaying,
        toggleAudio,
      }}
    >
      {children}
    </DMAContext.Provider>
  );
};

export const useDMA = () => {
  const context = useContext(DMAContext);
  if (!context) {
    throw new Error('useDMA must be used within a DMAProvider');
  }
  return context;
};
