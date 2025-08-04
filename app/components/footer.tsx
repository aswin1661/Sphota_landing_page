'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function Footer() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="w-screen h-full text-white bg-gradient-to-b from-black to-gray-900 px-10 py-10">
      <div className="max-w-6xl mx-auto flex flex-col justify-between items-center gap-8">
        {/* Logo Section */}

        {/* Logo Section */}
<div className="flex items-center gap-2">
  <div className="transform scale-[0.9] origin-left">
    <Image
      src="/images/logos.png"
      alt="Sphota Logo"
      width={120}
      height={75}
      className="object-contain"
    />
  </div>
  <span className="text-xl font-semibold berserker self-center">Sphota</span>
</div>

        {/* Links Section */}
        <div className="flex flex-row md:flex-row gap-4 text-gray-300 text-sm">
          <a href="#home" className="hover:text-white transition">Home</a>
          <a href="#about" className="hover:text-white transition">About</a>
          <a href="#spo" className="hover:text-white transition">Partners</a>
          <a href="/register" className="hover:text-white transition">Register</a>
        </div>

        {/* Copyright */}
        {year && (
          <div className="text-xs text-gray-400 text-center md:text-right">
            © {year} Sphota. All rights reserved.
          </div>
        )}
      </div>
    </footer>
  );
}
