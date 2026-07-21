import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mektup Arkadaşı — mektuparkadasi.net",
  description: "mektuparkadasi.net — Hızlı dünyanın gürültüsünden uzak, samimi, anonim ve yavaş iletişim sunan mektup arkadaşlığı platformu.",
  keywords: ["mektuparkadasi.net", "Mektup Arkadaşı", "Penpal", "Slow Tech", "Nostaljik Mektup", "Anonim Sohbet", "Mektuplaşma"],
  authors: [{ name: "mektuparkadasi.net Ekibi" }],
  metadataBase: new URL("https://mektuparkadasi.net"),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1a1412",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Inter:wght@400;500;600;700&family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=Playfair+Display:ital,wght@0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#140e0c] text-[#f4ebd9] font-sans antialiased selection:bg-[#8b261a] selection:text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}
