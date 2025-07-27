'use client';
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [bgVisible, setBgVisible] = useState(false);

  useEffect(() => {
    // Trigger background fade-in shortly after mount
    const timer = setTimeout(() => {
      setBgVisible(true);
    }, 100); // adjust if needed

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`relative flex w-screen h-screen items-center justify-center bg-cover bg-center transition-opacity duration-700 ${
        bgVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ backgroundImage: "url('/images/home.jpeg')" }}
    >
      {/* Watermark Logo */}
      <div className="absolute top-4 left-4 z-20 opacity-85">
        <Image src="/images/IEEE logo Full White.png" alt="Watermark" width={80} height={50} />
      </div>

      {/* Navigation Bar */}
      <nav className="absolute top-6 left-1/2 -translate-x-1/2 z-30 w-full max-w-3xl px-2 flex justify-center sm:justify-center">
        {/* Desktop Nav */}
        <div className="hidden md:flex gap-10 px-8 py-4 rounded-full">
          <Link href="/" className="tahoma text-white hover:text-blue-300 transition">Home</Link>
          <Link href="/about" className="tahoma text-white hover:text-blue-300 transition">About</Link>
          <Link href="/about" className="tahoma text-white hover:text-blue-300 transition">Sponsers</Link>
          <Link href="/about" className="tahoma text-white hover:text-blue-300 transition">Timeline</Link>
          <Link href="/register" className="tahoma text-white hover:text-blue-300 transition">FAQ&apos;S</Link>
        </div>

        {/* Mobile Nav Button */}
        <MobileNav />
      </nav>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-80"
  style={{
    background: "linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.6) 15%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.6) 70%, rgba(0,0,0,0.85) 80%, black 100%)"
  }}
></div>


      {/* Heading and Description */}
      <h1 className="animated animatedFadeInUp fadeInUp absolute pt-[10vh] berserker text-5xl">SPHOTA</h1>
      <h3 className="animated animatedFadeInUp fadeInUp absolute text-center pt-[30vh] tahoma text-white text-[1.3vh] lg:text-[2vh] mr-[5vw] ml-[5vw] sm:text-[1.3vh]">
        Lorem Ipsum is simply dummy text of the printing and typesetting industry.<br />
        Lorem Ipsum has been the industry&apos;s standard dummy text ever since the 1500s, <br />
        when an unknown printer
      </h3>

      {/* Register Button */}
      <button className="animated animatedFadeInUp fadeInUp button mt-[55vh]">
        R E G I S T E R
        <div id="clip">
          <div id="leftTop" className="corner"></div>
          <div id="rightBottom" className="corner"></div>
          <div id="rightTop" className="corner"></div>
          <div id="leftBottom" className="corner"></div>
        </div>
        <span id="rightArrow" className="arrow"></span>
        <span id="leftArrow" className="arrow"></span>
      </button>
    </div>
  );
}

// ✅ Separated Mobile Nav for cleanliness
function MobileNav() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="md:hidden flex items-center justify-end w-full">
      <button
        className="px-4 py-4 mr-[5vw] text-white lg-auto text-[3vh]"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Open navigation menu"
      >
        ☰
      </button>
      {menuOpen && (
        <span className="absolute top-12 right-0 flex flex-col gap-2 bg-black/90 rounded-lg p-4 z-40 min-w-[150px]">
          <Link href="/" className="tahoma text-white hover:text-blue-300 transition" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link href="/about" className="tahoma text-white hover:text-blue-300 transition" onClick={() => setMenuOpen(false)}>About</Link>
          <Link href="/about" className="tahoma text-white hover:text-blue-300 transition" onClick={() => setMenuOpen(false)}>Sponsers</Link>
          <Link href="/about" className="tahoma text-white hover:text-blue-300 transition" onClick={() => setMenuOpen(false)}>Timeline</Link>
          <Link href="/register" className="tahoma text-white hover:text-blue-300 transition">FAQ&apos;S</Link>
        </span>
      )}
    </div>
  );
}