import { PaperTheme, Stamp, PenPalProfile, Letter, UserProfile } from '@/types/dma';

export const PAPER_THEMES: PaperTheme[] = [
  {
    id: 'parchment',
    name: 'Klasik Parşömen',
    className: 'paper-parchment',
    bgHex: '#f4ebd9',
    textHex: '#2c211b',
  },
  {
    id: 'straw',
    name: 'Eski Saman Kağıdı',
    className: 'paper-straw',
    bgHex: '#ede3cb',
    textHex: '#241c16',
  },
  {
    id: 'night',
    name: 'Gece Daktilosu',
    className: 'paper-night',
    bgHex: '#1e1b18',
    textHex: '#e3d5c1',
  },
  {
    id: 'rose',
    name: 'Gül Kurusu Zarf',
    className: 'paper-rose',
    bgHex: '#f7ece9',
    textHex: '#3b2220',
  },
];

export const STAMPS: Stamp[] = [
  {
    id: 'stamp-1',
    name: 'Kapadokya Balonları',
    country: 'Türkiye',
    flag: '🇹🇷',
    imageUrl: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=150&auto=format&fit=crop&q=80',
    year: '1992',
    rarity: 'common',
  },
  {
    id: 'stamp-2',
    name: 'Sakura Çiçekleri',
    country: 'Japonya',
    flag: '🇯🇵',
    imageUrl: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=150&auto=format&fit=crop&q=80',
    year: '1988',
    rarity: 'rare',
  },
  {
    id: 'stamp-3',
    name: 'Vintage Daktilo Klasik',
    country: 'İngiltere',
    flag: '🇬🇧',
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=150&auto=format&fit=crop&q=80',
    year: '1979',
    rarity: 'legendary',
  },
  {
    id: 'stamp-4',
    name: 'Kuzey Işıkları',
    country: 'Norveç',
    flag: '🇳🇴',
    imageUrl: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=150&auto=format&fit=crop&q=80',
    year: '1995',
    rarity: 'rare',
  },
  {
    id: 'stamp-5',
    name: 'Saha Sahaf Kitabevi',
    country: 'Fransa',
    flag: '🇫🇷',
    imageUrl: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=150&auto=format&fit=crop&q=80',
    year: '1984',
    rarity: 'common',
  },
];

export const INITIAL_USER: UserProfile = {
  id: 'user-me',
  pseudonym: 'NostaljikDüşünür',
  title: 'Mektup Tutkunu & Gece Yazarı',
  bio: 'Hızlı mesajlaşmanın gürültüsünden kaçıp içini kelimelere dökmeyi seven biri. Kahve, eski kitaplar ve daktilo sesini çok severim.',
  age: 41,
  country: 'Türkiye',
  city: 'İstanbul',
  languages: ['Türkçe', 'İngilizce'],
  interests: ['Edebiyat', 'Nostalji', 'Müzik', 'Sakin Yaşam', 'Felsefe'],
  avatarColor: '#8b261a',
  stampsCollected: ['stamp-1', 'stamp-2', 'stamp-3', 'stamp-4'],
};

export const MOCK_PENPALS: PenPalProfile[] = [
  {
    id: 'penpal-1',
    pseudonym: 'SessizLiman',
    fullName: 'Ahmet Yılmaz',
    phoneNumber: '0532 123 45 67',
    email: 'ahmet.yilmaz@email.com',
    title: 'Şehir karmaşasından uzakta bir ruh',
    bio: 'Yoğun iş temposu ve sosyal medyanın sahteliği beni çok yordu. Fotoğrafların değil, samimi düşüncelerin konuşulduğu uzun mektupları özledim. Doğa ve kitaplar en büyük sığınağım.',
    age: 38,
    country: 'Türkiye',
    city: 'İzmir',
    flag: '🇹🇷',
    languages: ['Türkçe', 'İngilizce'],
    interests: ['Hayat Yorgunluğu', 'Gece Sohbetleri', 'Doğa', 'Klasik Müzik'],
    avatarStyle: '#2e4a3e',
    lettersExchangedCount: 14,
    joinedDate: 'Ekim 2025',
    status: 'active',
    distanceKm: 480,
    estimatedDeliveryHours: 4,
  },
  {
    id: 'penpal-2',
    pseudonym: 'Sora',
    fullName: 'Sayaka Tanaka',
    phoneNumber: '+81 90 1234 5678',
    email: 'sayaka.sora@email.com',
    title: 'Kyoto\'da çay ustası ve amatör şair',
    bio: 'Japonya\'dan Türkçe öğrenmeye çalışan ve farklı kültürlerle derin mektuplaşmak isteyen biriyim. Birkaç günde bir gelen mektubun posta kutumda belirmesi harika bir duygu.',
    age: 35,
    country: 'Japonya',
    city: 'Kyoto',
    flag: '🇯🇵',
    languages: ['Japonca', 'İngilizce', 'Türkçe (Başlangıç)'],
    interests: ['Yabancı Dil Pratiği', 'Edebiyat', 'Çay Seremonisi', 'Nostalji'],
    avatarStyle: '#7c3a21',
    lettersExchangedCount: 8,
    joinedDate: 'Kasım 2025',
    status: 'active',
    distanceKm: 8900,
    estimatedDeliveryHours: 18,
  },
  {
    id: 'penpal-3',
    pseudonym: 'GeceBekçisi',
    fullName: 'Stefan Müller',
    phoneNumber: '+49 176 1234567',
    email: 'stefan.berlin@email.com',
    title: 'Gece vakti yazmayı seven bir mimar',
    bio: 'İşim gereği hep estetik ve çizgilerle uğraşıyorum ama en çok kelimelerdeki estetiği seviyorum. İş ve ev hayatının monotonluğundan uzaklaşıp içimi dökebileceğim bir mektup arkadaşı arıyorum.',
    age: 44,
    country: 'Almanya',
    city: 'Berlin',
    flag: '🇩🇪',
    languages: ['Almanca', 'Türkçe', 'İngilizce'],
    interests: ['Mimari & Sanat', 'Gece Sohbetleri', 'Felsefe', 'Sinema'],
    avatarStyle: '#1f3a52',
    lettersExchangedCount: 22,
    joinedDate: 'Ağustos 2025',
    status: 'active',
    distanceKm: 1750,
    estimatedDeliveryHours: 8,
  },
  {
    id: 'penpal-4',
    pseudonym: 'MaviParşömen',
    fullName: 'Zeynep Aksoy',
    phoneNumber: '0543 987 65 43',
    email: 'zeynep.aksoy@email.com',
    title: 'Eski sahaf sevdalısı & Öğretmen',
    bio: '1980\'lerde okul yıllarımda mektup arkadaşım vardı. O heyecanı dijitalde ama aynı yavaşlıkta yeniden yaşamak harika bir fikir. Eski plaklar, tarih ve günlük yaşam üzerine mektuplaşalım.',
    age: 49,
    country: 'Türkiye',
    city: 'Bursa',
    flag: '🇹🇷',
    languages: ['Türkçe', 'Fransızca'],
    interests: ['Tarih', 'Sahaflar & Kitaplar', 'Nostalji 80ler/90lar', 'Edebiyat'],
    avatarStyle: '#5c2c47',
    lettersExchangedCount: 5,
    joinedDate: 'Aralık 2025',
    status: 'active',
    distanceKm: 240,
    estimatedDeliveryHours: 3,
  },
];

// Generate initial sample letters
const now = new Date();
const hoursAgo = (h: number) => new Date(now.getTime() - h * 3600 * 1000).toISOString();
const hoursLater = (h: number) => new Date(now.getTime() + h * 3600 * 1000).toISOString();

export const INITIAL_LETTERS: Letter[] = [
  {
    id: 'letter-1',
    senderId: 'penpal-1',
    senderName: 'SessizLiman',
    senderFlag: '🇹🇷',
    recipientId: 'user-me',
    recipientName: 'NostaljikDüşünür',
    subject: 'İlk Mektup: Yağmurlu Bir İzmir Akşamından Selamlar',
    content: `Sevgili Dostum NostaljikDüşünür,

Posta kutumda mektup isteğini gördüğümde çocukluğumdaki o heyecanı yeniden hissettim. Günümüzün anlık ve tüketim odaklı dünyasında böyle sakin bir köşede buluşabilmek ne güzel.

İzmir'de bugün ince bir yağmur var. Balkonda oturmuş, bir fincan sıcak ıhlamur eşliğinde bu satırları yazıyorum. İnsan büyüdükçe ve iş hayatının monotonluğuna girdikçe, yüzeysel muhabbetlerden kaçıp gerçek bağlar arıyor. Sanırım seninle ortak noktamız tam olarak bu yorgunluk ve arayış.

Senin orada havalar nasıl? En son hangi kitabı okudun veya daktilonda hangi düşünceleri biriktirdin?

Bir sonraki mektubunu sabırsızlıkla (ve o nostaljik bekleyişle) bekleyeceğim.

Sevgi ve selamlarımla,
SessizLiman`,
    paperTheme: 'parchment',
    stampId: 'stamp-1',
    stampName: 'Kapadokya Balonları',
    stampFlag: '🇹🇷',
    sentAt: hoursAgo(12),
    estimatedDeliveryAt: hoursAgo(2),
    deliveredAt: hoursAgo(2),
    status: 'delivered_unread',
  },
  {
    id: 'letter-2',
    senderId: 'penpal-2',
    senderName: 'Sora',
    senderFlag: '🇯🇵',
    recipientId: 'user-me',
    recipientName: 'NostaljikDüşünür',
    subject: 'Kyoto\'dan Mektup: Sonbahar Yaprakları ve Mektup Geleneği',
    content: `Merhaba NostaljikDüşünür,

Kyoto'dan sana bu mektubu göndermek benim için çok heyecan verici. Mektubum sana ulaşana kadar kıtaları aşacak ve 18 saatlik bir yolculuk yapacak. İşte bu yavaşlık mektubun kıymetini arttırıyor.

Burada sonbahar tam anlamıyla yaşanıyor. Akçaağaç yaprakları kızardı ve tapınak bahçelerinde sessizlik hakim. Sana mektubumla birlikte Kyoto bahçelerinden özel bir dijital Sakura pulu da iliştiriyorum.

Senin hayatında son zamanlarda seni en çok dinlendiren veya düşündüren şey ne oldu? Bana dürüstçe içini dökebilirsin.

Mektubunu bekliyorum,
Sora`,
    paperTheme: 'straw',
    stampId: 'stamp-2',
    stampName: 'Sakura Çiçekleri',
    stampFlag: '🇯🇵',
    sentAt: hoursAgo(24),
    estimatedDeliveryAt: hoursAgo(6),
    deliveredAt: hoursAgo(6),
    status: 'delivered_read',
  },
  {
    id: 'letter-3',
    senderId: 'user-me',
    senderName: 'NostaljikDüşünür',
    senderFlag: '🇹🇷',
    recipientId: 'penpal-3',
    recipientName: 'GeceBekçisi',
    subject: 'Berlin\'e Yola Çıkan Mektup: Gece Yazıları ve Nostalji',
    content: `Sevgili GeceBekçisi,

Gece yarısı İstanbul'da daktilo sesleri eşliğinde bu mektubu yazıyorum. Mimarlık ve estetik üzerine söylediklerin beni çok etkiledi. Gerçekten de kelimelerin mimarisi, binalarınkinden çok daha derin ve kalıcı olabiliyor.

Bu mektup sana doğru yola çıktı. Tahminen 6 saat sonra Berlin'deki posta kutunda belirecek. Beklemenin ve yavaşlığın tadını çıkaralım.

Selamlar,
NostaljikDüşünür`,
    paperTheme: 'night',
    stampId: 'stamp-3',
    stampName: 'Vintage Daktilo',
    stampFlag: '🇬🇧',
    sentAt: hoursAgo(2),
    estimatedDeliveryAt: hoursLater(6),
    status: 'en_route',
  },
];
