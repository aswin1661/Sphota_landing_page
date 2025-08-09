'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function Footer() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="w-screen h-full text-white bg-gradient-to-b from-black to-gray-900 px-10 py-10 relative overflow-hidden">
      <div className="max-w-6xl mx-auto mb-[7vh] flex flex-col justify-between items-center gap-8 relative z-10">
        <span className="absolute mt-[2vh] text-2xl font-semibold berserker self-center">Sphota</span>
      </div>
      <div className="max-w-6xl mx-auto mb-[9vh] flex flex-col justify-between items-center gap-8 relative z-10">
        {/* Watermark Logos in Row */}
        <div className="flex top-0 items-center gap-6">
          <Image
            src="/images/ucek.png"
            alt="UCEK Logo"
            width={46.16}
            height={30.76}
            className="object-contain invert"
          />
          <Image
              src="/images/webp/logos.webp"
              alt="Sphota Logo"
              width={120}
              height={75}
              className="object-contain"
            />
            <Image
            src="/images/stist.png"
            alt="STIST Logo"
            width={46.15}
            height={30.76}
            className="object-contain"
          />
        </div>
         

        {/* Links */}
        <div className="flex flex-row  absolute mt-[11vh] md:flex-row gap-9 text-gray-300 text-sm">
          <a href="#home" className="hover:text-white transition">Home</a>
          <a href="#about" className="hover:text-white transition">About</a>
          <a href="#spo" className="hover:text-white transition">Partners</a>
          <a href="/register" className="hover:text-white transition">Register</a>
        </div>

        {/* Copyright */}
        {year && (
          <div className="text-xs absolute mt-[17vh] text-gray-400 text-center md:text-right">
            © {year} Sphota. All rights reserved.
          </div>
        )}
        <div className='w-screen h-[1vh]'></div>
      </div>
    </footer>
  );
}
