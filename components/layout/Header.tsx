"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const menu = [
  { title: "Magazin", href: "/kategori/magazin" },
  { title: "TV", href: "/kategori/tv" },
  { title: "Müzik", href: "/kategori/muzik" },
  { title: "Sinema", href: "/kategori/sinema" },
  { title: "Yaşam", href: "/kategori/yasam" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-white p-1">
            <Image
              src="/logo.png"
              alt="Vitrin Magazin Logo"
              width={40}
              height={40}
              className="object-contain"
              priority
            />
          </div>

          <div>
            <h1 className="text-2xl font-black text-white">
              VİTRİN
            </h1>
            <p className="text-xs tracking-[4px] text-zinc-500">
              MAGAZİN
            </p>
          </div>
        </Link>

        <nav className="hidden gap-8 lg:flex">
          {menu.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="font-semibold text-zinc-300 transition hover:text-pink-500"
            >
              {item.title}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">

          <Link
            href="/arama"
            className="rounded-full border border-white/10 p-3 hover:border-pink-500"
          >
            🔍
          </Link>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-full border border-white/10 p-3 hover:border-pink-500 lg:hidden text-lg"
            aria-label="Menüyü Aç"
          >
            {isOpen ? "✕" : "☰"}
          </button>

        </div>

      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="border-t border-white/10 bg-black/95 backdrop-blur-2xl lg:hidden">
          <nav className="flex flex-col px-6 py-6 gap-4">
            {menu.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="rounded-xl border border-white/5 bg-zinc-900/50 px-5 py-4 text-lg font-bold text-zinc-300 transition hover:border-pink-500 hover:text-pink-400"
              >
                {item.title}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}