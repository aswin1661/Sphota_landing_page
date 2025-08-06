'use client';
import Image from 'next/image';
import { useEffect, useRef, useState } from "react";
import React from "react";

const partners = [
   '',
  '/images/mediaone.jpg',
  '/images/unibic.png',
  '',
];

export default function Partners() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      {
        root: null,
        threshold: 0.3,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  return (
    <section className="relative min-h-[100dvh] w-screen overflow-hidden py-12" 
    id='spo'>
      {/* Background */}
      <div
        ref={sectionRef}
        className={`relative flex w-full min-h-[100dvh] overflow-hidden items-center flex-col justify-center bg-cover bg-center transition-opacity duration-700 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ backgroundImage: "url('/images/partners.jpeg')" }}
      >
        
        {/* Video overlay */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-30"
        >
          <source src="/videos/overlay3.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Gradient overlays */}
        <div
          className="absolute inset-0 z-11 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, black 0%, rgba(0,0,0,0.85) 15%, rgba(0,0,0,0) 40%, rgba(0,0,0,0) 70%, rgba(0, 0, 0, 1) 100%)",
          }}
        />
        <div className="absolute inset-0 bg-black opacity-30 z-10" />

        {/* Foreground Content */}
        <div className="relative z-10 flex flex-col items-center px-4">
          <h2
            className={`${
              isVisible ? 'animate-fade-in-up' : 'opacity-0'
            } text-center text-white text-2xl md:text-4xl font-semibold mb-8 berserker`}
          >
            Our Partners
          </h2>

          <div className="flex justify-center gap-6 flex-wrap">
            {partners.map((logo, index) => (
              <div
                key={index}
                className={`${
                  isVisible ? 'animate-fade-in-up' : 'opacity-0'
                } bg-[#0000008a] border p-7 rounded-md hover:scale-105 transition duration-300`}
              >
                <Image
                  src={logo}
                  alt={`Partner ${index + 1}`}
                  width={150}
                  height={50}
                  className="object-contain transition duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
