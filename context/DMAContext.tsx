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
  const [penpals] = useState<PenPalProfile[]>(MOCK_PENPALS);
  const [letters, setLetters] = useState<Letter[]>(INITIAL_LETTERS);
  const [stamps] = useState<Stamp[]>(STAMPS);
  
  const [writingRecipient, setWritingRecipient] = useState<PenPalProfile | null>(null);
  const [isWritingOpen, setIsWritingOpen] = useState(false);
  const [readingLetter, setReadingLetter] = useState<Letter | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

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
    }, 10000); // Check every 10 seconds

    return () => clearInterval(timer);
  }, []);

  const updateUser = (updated: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...updated }));
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
    
    // Delivery takes hours based on penpal distance or mock 6 hours
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
