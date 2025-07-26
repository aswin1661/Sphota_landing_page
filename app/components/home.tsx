'use client';
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
    const [menuOpen, setMenuOpen] = useState(false);

    return(
        <div
            className="relative flex w-screen h-screen items-center justify-center bg-cover bg-center"
            style={{ backgroundImage: "url('/images/home.jpg')" }}
        >
            {/* Fixed watermark in top left */}
            <div className="fixed top-4 left-4 z-20 opacity-80">
                <Image src="/images/IEEE logo Full White.png" alt="Watermark" width={80} height={50} />
            </div>

            {/* Responsive Nav Bar */}
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
                <div className="md:hidden flex items-center justify-end w-full">
                    <button
                        className=" px-4 py-4  mr-[5vw] text-white lg-auto text-[3vh]"
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
            </nav>
            <div className="absolute inset-0 pointer-events-none opacity-90"
                style={{
                    background: "linear-gradient(to bottom, black 0%, rgba(0,0,0,0.85) 20%, rgba(0,0,0,0) 40%, rgba(0,0,0,0) 60%, rgba(0, 0, 0, 1) 100%, black 100%)"
                }}
            ></div>
           
            <h1 className="pt-[30vh] fixed berserker text-5xl">SPHOTA</h1>
            <h3 className="fixed text-center pt-[50vh] tahoma text-white text-[1.3vh]">
  Lorem Ipsum is simply dummy text of the printing and typesetting industry.<br />
  Lorem Ipsum has been the industry&apos;s standard dummy text ever since the 1500s, <br />
  when an unknown printer
</h3>

            {/* Play Button with Clip Animation */}
            <button className="button mt-[70vh]">
                R E J I S T E R
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
    )
}