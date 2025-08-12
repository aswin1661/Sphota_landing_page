'use client';

import Image from "next/image";
import React, { useEffect, useState } from "react";

export default function About() {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const aboutSection = document.getElementById("about");
      if (aboutSection) {
        const rect = aboutSection.getBoundingClientRect();
        if (rect.top < window.innerHeight - 150) {
          setAnimate(true);
          window.removeEventListener("scroll", handleScroll); // Trigger once
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="relative flex overflow-hidden w-screen h-full items-center flex-col justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/images/webp/about.webp')" }}
      id="about"
    >
      {/* Gradient Overlay */}
      <div
        className="absolute inset-0 z-10 pointer-events-none opacity-100"
        style={{
          background:
            "linear-gradient(to bottom, black 0%, rgba(0,0,0,0.85) 15%, rgba(0,0,0,0) 40%, rgba(0,0,0,0) 70%, rgba(0,0,0,1) 100%)",
        }}
      ></div>

      {/* Video Overlay */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-20"
      >
        <source src="/videos/overlay2.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Main Content */}
      <div className="h-screen w-screen mt-10 flex flex-col items-center justify-center text-white relative z-10">
        {/* Dark overlay */}
        <div className="h-screen w-screen absolute bg-black opacity-40 z-0"></div>

        {/* Title */}
        <h2
          className={`berserker text-5xl mb-6 text-center ${
            animate ? "animated animatedFadeInUp fadeInUp" : "opacity-0"
          }`}
        >
          About Sphota
        </h2>

        {/* Description */}
        <h3
          className={`text-center tahoma text-white text-[1.3vh] sm:text-[1.3vh] lg:text-[2vh] mr-[5vw] ml-[5vw] mb-6 ${
            animate ? "animated animatedFadeInUp fadeInUp" : "opacity-0"
          }`}
        >
          SPHOTA is a 24-hour offline hackathon organized by IEEE SB UCEK and
          IEEE SB STIST. It brings engineering students
          <br />
          from across Kerala for a Celebration of creativity, code, and
          collaboration.
        </h3>

        {/* Content Row */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center w-full mt-6">
          {/* Logo */}
          <div
            className={`flex-shrink-0 ml-[2vw] ${
              animate ? "animated animatedFadeInUp fadeInUp" : "opacity-0"
            }`}
          >
            <Image
              src="/images/sphotalogo.png"
              alt="Sphota Logo"
              className="brightness-170 float"
              width={156.25}
              height={98.75}
            />
          </div>

          {/* Bullet Points */}
          <ul
            className={`circle-bullet mt-[4vh] text-white tahoma mr-[5vw] ml-[5vw] text-sm lg:text-base text-left max-w-md ${
              animate ? "animated animatedFadeInUp fadeInUp" : "opacity-0"
            }`}
          >
            <li>Organized by IEEE SB UCEK & IEEE SB STIST.</li>
            <li>24-hour in-person hackathon.</li>
            <li>Teams of 2 to 4.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
