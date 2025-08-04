'use client';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

const Countdown = dynamic(() => import("./Countdown"), { ssr: false });

export default function Home() {
  const router = useRouter();

  const handleRegisterClick = () => {
    router.push('/register');
  };

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden">
      {/* Background section */}
      <section
        className="relative flex w-full h-screen items-center justify-center bg-cover bg-center transition-opacity duration-700"
        style={{ backgroundImage: "url('/images/home.jpeg')" }}
      >

        {/* ✅ Video overlay */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-25 opacity-18"
        >
          <source src="/videos/overlay.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* 🔳 Black filter overlay */}
<div className="absolute inset-0 bg-black opacity-30 z-60 pointer-events-none" />

        {/* Watermark Logo */}
        <div className="absolute top-7 left-5 z-20 opacity-85">
          <Image
            src="/images/logos.png"
            alt="Watermark"
            width={100}
            height={50}
            priority
          />
        </div>

        {/* Navigation Bar */}
        <nav className="absolute animated animatedFadeInUp fadeInUp top-6 left-1/2 -translate-x-1/2 z-30 w-full max-w-3xl px-2 flex justify-center sm:justify-center">
          <div className="hidden md:flex gap-10 px-8 py-4 rounded-full">
            <NavLink href="/">Home</NavLink>
            <NavLink href="#about">About</NavLink>
            <NavLink href="#spo">Sponsers</NavLink>
            <NavLink href="#time">Timeline</NavLink>
            <NavLink href="#faq">FAQ&apos;S</NavLink>
          </div>
          <MobileNav />
        </nav>

       {/* Gradient Overlay */}
      <div
        className="absolute inset-0 z-12 pointer-events-none opacity-100"
        style={{
          background:
            "linear-gradient(to bottom, black 0%, rgba(0,0,0,0.85) 15%, rgba(0,0,0,0) 40%, rgba(0,0,0,0) 70%, rgba(0, 0, 0, 1) 100%)",
        }}
        id='home'
      ></div>

        {/* Heading */}
        <h1 className="absolute pt-[25vh] berserker text-5xl animated animatedFadeInUp fadeInUp text-white drop-shadow-md z-30">
          SPHOTA
        </h1>

        {/* Description */}
        <h1 className="absolute text-center pt-[40vh] tahoma animated animatedFadeInUp fadeInUp text-white text-[1.9vh] lg:text-[2vh] px-[5vw] z-30">
          24 hours. Your sphota. Our Celebration
        </h1>

        {/* Register Button */}
        <button
          onClick={handleRegisterClick}
          className="button z-99 animated animatedFadeInUp fadeInUp mt-[70vh] z-30"
        >
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

        {/* Countdown */}
        <div className="absolute mt-[50vh] animated animatedFadeInUp fadeInUp text-white text-center px-6 py-2 rounded-lg ">
          <Countdown targetDate="2025-08-23T00:00:00" />
        </div>
      </section>
    </div>
  );
}

// ✅ Reusable link with styling
function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="tahoma text-white hover:text-blue-300 transition"
    >
      {children}
    </Link>
  );
}

// ✅ Mobile nav with outside click detection
function MobileNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <div className="md:hidden flex items-center justify-end w-full">
      <button
        className="px-4 py-4 mr-[5vw] text-white text-[3vh]"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Open navigation menu"
      >
        ☰
      </button>
      {menuOpen && (
        <span
          ref={menuRef}
          className="absolute top-5 right-0 mr-[15vw] flex flex-col gap-5 bg-black/70 rounded-3xl p-4 z-40 min-w-[150px]"
        >
          <NavLink href="/">Home</NavLink>
          <NavLink href="#about">About</NavLink>
          <NavLink href="#spo">Sponsers</NavLink>
          <NavLink href="#time">Timeline</NavLink>
          <NavLink href="#faq">FAQ&apos;S</NavLink>
        </span>
      )}
    </div>
  );
}
