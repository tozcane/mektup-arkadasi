/**
 * mektuparkadasi.net — Güvenlik, Telif ve Saygı Denetim Yardımcıları
 */

// 1. Küfür, Argo ve Hakaret Filtre Kelime Listesi (Turkish Profanity & Abuse List)
const ABUSIVE_WORDS = [
  'salak', 'aptal', 'gerizekali', 'gerizekalı', 'mal', 'şerefsiz', 'serefsiz', 'piç', 'pic', 
  'oç', 'göt', 'got', 'siktir', 'sik', 'amk', 'amına', 'orospu', 'pezevenk', 'yavşak', 'yavsak',
  'kaltak', 'it', 'köpek', 'kopek', 'salakça', 'aptalca', 'gerzek'
];

/**
 * Metin içinde hakaret veya küfür içerip içermediğini denetler.
 */
export function containsAbusiveLanguage(text: string): boolean {
  if (!text) return false;
  const normalized = text.toLowerCase()
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c');

  return ABUSIVE_WORDS.some(word => {
    // Kelime sınırları içinde tam eşleşme veya alt kelime denetimi
    const regex = new RegExp(`\\b${word}\\b|${word}`, 'i');
    return regex.test(normalized);
  });
}

/**
 * XSS Saldırılarını önlemek için kullanıcı girdilerini temizler (Sanitize).
 */
export function sanitizeInput(text: string): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}
