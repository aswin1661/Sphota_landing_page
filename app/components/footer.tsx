'use client';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="w-screen h-full text-white  bg-gradient-to-b from-black to-gray-900 px-10 py-10" >
        
      <div className="max-w-6xl mx-auto flex flex-col  justify-between items-center gap-8">
        
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-5 relative">
            <Image src="/images/IEEE logo Full White.png" alt="Sphota Logo" className="object-contain" width={120} height={75} />
          </div>
          <span className="text-xl mt-10 font-semibold berserker">Sphota</span>
        </div>

        {/* Links Section */}
        <div className="flex flex-row md:flex-row gap-4 text-gray-300 text-sm">
          <a href="#about" className="hover:text-white transition">About</a>
          <a href="#events" className="hover:text-white transition">Events</a>
          <a href="#team" className="hover:text-white transition">Team</a>
          <a href="#contact" className="hover:text-white transition">Contact</a>
        </div>

        {/* Copyright */}
        <div className="text-xs text-gray-400 text-center md:text-right">
          © {new Date().getFullYear()} Sphota. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
