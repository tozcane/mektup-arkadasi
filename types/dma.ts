export type PaperThemeId = 'parchment' | 'straw' | 'night' | 'rose';

export interface PaperTheme {
  id: PaperThemeId;
  name: string;
  className: string;
  bgHex: string;
  textHex: string;
}

export interface Stamp {
  id: string;
  name: string;
  country: string;
  flag: string;
  imageUrl: string;
  year: string;
  rarity: 'common' | 'rare' | 'legendary';
}

export interface PenPalProfile {
  id: string;
  pseudonym: string;
  title: string;
  bio: string;
  age: number;
  country: string;
  city: string;
  flag: string;
  languages: string[];
  interests: string[];
  avatarStyle: string; // e.g. color or icon identifier
  lettersExchangedCount: number;
  joinedDate: string;
  status: 'active' | 'away';
  distanceKm: number;
  estimatedDeliveryHours: number;
}

export interface Letter {
  id: string;
  senderId: string;
  senderName: string;
  senderFlag: string;
  recipientId: string;
  recipientName: string;
  subject: string;
  content: string;
  paperTheme: PaperThemeId;
  stampId: string;
  stampName: string;
  stampFlag: string;
  sentAt: string; // ISO string
  estimatedDeliveryAt: string; // ISO string
  deliveredAt?: string;
  status: 'en_route' | 'delivered_unread' | 'delivered_read';
  isReplied?: boolean;
}

export type ActiveTab = 'inbox' | 'en_route' | 'penpals' | 'stamps';

export interface UserProfile {
  id: string;
  pseudonym: string;
  email?: string;
  isLoggedIn?: boolean;
  isAdmin?: boolean;
  registeredAt?: string;
  title: string;
  bio: string;
  age: number;
  country: string;
  city: string;
  languages: string[];
  interests: string[];
  avatarColor: string;
  stampsCollected: string[]; // stamp IDs
}
