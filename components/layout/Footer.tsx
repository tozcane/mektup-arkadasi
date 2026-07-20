import Image from "next/image";
import Link from "next/link";

const categories = [
  "Magazin",
  "TV",
  "Müzik",
  "Sinema",
  "Yaşam",
];

export default function Footer() {
  return (
    <footer className="mt-32 border-t border-white/10 bg-black">

      <div className="mx-auto max-w-7xl px-6 py-20">

        <div className="grid gap-14 lg:grid-cols-[2fr_1fr_1fr]">

          <div>

            <div className="flex items-center gap-4">

              <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-white p-1">
                <Image
                  src="/logo.png"
                  alt="Vitrin Magazin Logo"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>

              <div>

                <h2 className="text-3xl font-black text-white">
                  VİTRİN
                </h2>

                <p className="tracking-[5px] text-zinc-500">
                  MAGAZİN
                </p>

              </div>

            </div>

            <p className="mt-8 max-w-lg leading-8 text-zinc-400">
              Magazin, televizyon, müzik, sinema ve yaşam dünyasındaki en sıcak
              gelişmeleri modern bir deneyimle okuyucularına ulaştıran dijital
              magazin platformu.
            </p>

          </div>

          <div>

            <h3 className="text-xl font-black text-white">
              Kategoriler
            </h3>

            <div className="mt-6 space-y-4">

              {categories.map((item) => (
                <Link
                  key={item}
                  href={`/kategori/${item.toLowerCase()}`}
                  className="block text-zinc-400 transition hover:text-pink-400"
                >
                  {item}
                </Link>
              ))}

            </div>

          </div>

          <div>

            <h3 className="text-xl font-black text-white">
              Bizi Takip Et
            </h3>

            <div className="mt-6 space-y-4">

              <a href="#" className="block text-zinc-400 hover:text-pink-400">
                Instagram
              </a>

              <a href="#" className="block text-zinc-400 hover:text-pink-400">
                X (Twitter)
              </a>

              <a href="#" className="block text-zinc-400 hover:text-pink-400">
                YouTube
              </a>

              <a href="#" className="block text-zinc-400 hover:text-pink-400">
                TikTok
              </a>

            </div>

          </div>

        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm text-zinc-500 md:flex-row">

          <p>
            © 2026 VİTRİN Magazin. Tüm hakları saklıdır.
          </p>

          <div className="flex gap-6">

            <Link href="/gizlilik" className="hover:text-white">
              Gizlilik
            </Link>

            <Link href="/kullanim" className="hover:text-white">
              Kullanım Şartları
            </Link>

            <Link href="/iletisim" className="hover:text-white">
              İletişim
            </Link>

          </div>

        </div>

      </div>

    </footer>
  );
}