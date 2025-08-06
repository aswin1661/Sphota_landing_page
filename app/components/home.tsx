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
    <div className="relative w-full min-h-screen   overflow-x-hidden">
      {/* Background section */}
      <section
        className="relative flex w-full h-screen items-center justify-center bg-cover bg-center transition-opacity duration-700"
        style={{ backgroundImage: "url('/images/home.jpeg')" }}
      >

        {/* Video overlay */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-25 opacity-35"
        >
          <source src="/videos/2.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Black filter overlay */}
<div className="absolute inset-0 bg-black flex flex-row opacity-10 z-60 pointer-events-none" />

        {/* Watermark Logo */}
       <div className="absolute top-6 left-9 z-20 opacity-85 flex items-center gap-2">
  <Image
    src="/images/logos.png"
    alt="Watermark"
    width={120}
    height={62.5}
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
      <div
  className="absolute bottom-0 left-0 w-full opacity-80 h-1/4 z-50 pointer-events-none"
  style={{
    background: "linear-gradient(to top, black, transparent)",
  }}
></div>

        {/* Heading */}
        <h1 className="absolute pt-[20vh] berserker text-5xl animated animatedFadeInUp fadeInUp text-white drop-shadow-md z-30">
          SPHOTA
        </h1>

        {/* Description */}
        <h1 className="absolute text-center pt-[35vh] tahoma animated animatedFadeInUp fadeInUp text-white text-[1.9vh] lg:text-[2vh] px-[5vw] z-30">
          24 hours. Your sphota. Our Celebration
        </h1>

        {/* Register Button */}
        <button
          onClick={handleRegisterClick}
          className="button z-99 animated animatedFadeInUp fadeInUp mt-[65vh] z-30"
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

        <a
  href="https://drive.google.com/your-download-link"
  target="_blank"
  rel="noopener noreferrer"
  className="absolute mt-[80vh] text-white text-sm underline z-30 tahoma hover:text-blue-300 transition"
>
  Be our sponsors
</a>


        {/* Countdown */}
        <div className="absolute mt-[45vh] animated animatedFadeInUp fadeInUp text-white text-center px-6 py-2 rounded-lg ">
          <Countdown targetDate="2025-08-23T00:00:00" />
        </div>
      </section>
    </div>
  );
}


function NavLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link href={href} passHref>
      <span
        onClick={onClick}
        className="tahoma text-white hover:text-blue-300 transition cursor-pointer"
      >
        {children}
      </span>
    </Link>
  );
}

function MobileNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <div className="md:hidden flex items-center justify-end w-full relative z-[9999]">
      {/* Hamburger / X icon */}
      <button
        ref={buttonRef}
        className="relative w-8 h-8 mr-[8vw] mt-[2.5vh] focus:outline-none z-[9999]"
        onClick={toggleMenu}
        aria-label="Toggle navigation menu"
      >
        <span
          className={`absolute h-[2px] w-8 bg-white transition-all duration-300 ease-in-out top-0 ${
            menuOpen ? 'rotate-45 top-2' : ''
          }`}
        />
            <span
              className={`absolute h-[2px] w-8 bg-white transition-all duration-300 ease-in-out top-2 ${
                menuOpen ? '-rotate-45 top-2' : ''
              }`}
            />
        <span
          className={`absolute h-[2px] w-8 bg-white transition-all duration-300 ease-in-out top-4 ${
            menuOpen ? 'opacity-0' : ''
          }`}
        />
      </button>

      {/* Glassy dark popup */}
      {menuOpen && (
        <>

          {/* Menu */}
          <div
             ref={menuRef}
             className="fixed top-50 left-1/2 -translate-x-1/2 -translate-y-1/2 
             bg-black/60 backdrop-blur-xl border border-white/10 
             rounded-3xl p-6 z-50 w-[80vw] max-w-xs flex flex-col items-center gap-6 
             shadow-2xl animate-popupGlass"
>

            <NavLink href="/" onClick={() => setMenuOpen(false)}>
              Home
            </NavLink>
            <NavLink href="#about" onClick={() => setMenuOpen(false)}>
              About
            </NavLink>
            <NavLink href="#spo" onClick={() => setMenuOpen(false)}>
              Sponsors
            </NavLink>
            <NavLink href="#time" onClick={() => setMenuOpen(false)}>
              Timeline
            </NavLink>
            <NavLink href="#faq" onClick={() => setMenuOpen(false)}>
              FAQ&apos;s
            </NavLink>
          </div>
        </>
      )}
    </div>
  );
}
