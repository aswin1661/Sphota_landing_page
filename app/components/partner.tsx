'use client';
import Image from 'next/image';
import { useEffect, useRef, useState } from "react";
import React from "react";

const partners = [
  '/logoipsum1.png',
  '/logoipsum2.png',
  '/logoipsum3.png',
  '/logoipsum4.png',
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
    <section className="relative h-screen w-screen overflow-hidden py-12">
      {/* Blurred radial gradient background */}
      <div
        ref={sectionRef}
        className={`relative flex w-screen h-full items-center flex-col justify-center bg-cover bg-center transition-opacity duration-700 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ backgroundImage: "url('/images/about.jpg')" }}
      >
         <div
        className="absolute inset-0 pointer-events-none opacity-100"
        style={{
          background:
            "linear-gradient(to bottom, black 0%, rgba(0,0,0,0.85) 15%, rgba(0,0,0,0) 40%, rgba(0,0,0,0) 70%, rgba(0, 0, 0, 1) 100%)",
        }}
      ></div>
       <div className="h-screen w-screen absolute bg-black opacity-55 z-0"></div>
        {/* Foreground content */}
        <div className="relative items-center z-10">
          <div className={`${
            isVisible ? 'animated animatedFadeInUp fadeInUp' : 'opacity-0'
          } text-center text-white text-2xl font-semibold mb-8 berserker`}>Our Partners</div>
          <div className="flex justify-center gap-6 flex-wrap">
            {partners.map((logo, index) => (
              <div
                key={index}
                className={`${
            isVisible ? 'animated animatedFadeInUp fadeInUp' : 'opacity-0'
          } bg-[#0000008a] border p-7 rounded-md hover:scale-105 transition`}
              >
                <Image
                  src={logo}
                  alt={`Partner ${index + 1}`}
                  width={150}
                  height={50}
                  className="object-contain grayscale hover:grayscale-0 transition duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
