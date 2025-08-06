'use client';
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import React from "react";

export default function About() {
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
    <div
      ref={sectionRef}
      className={`relative flex overflow-hidden w-screen h-full items-center flex-col justify-center bg-cover bg-center transition-opacity duration-700 `}
      style={{ backgroundImage: "url('/images/about.jpeg')" }}
      id="about"
    >
      {/* Gradient Overlay */}
      <div
        className="absolute inset-0 z-10 pointer-events-none opacity-100"
        style={{
          background:
            "linear-gradient(to bottom, black 0%, rgba(0,0,0,0.85) 15%, rgba(0,0,0,0) 40%, rgba(0,0,0,0) 70%, rgba(0, 0, 0, 1) 100%)",
        }}
      ></div>
       {/* Video overlay */}
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

      <div className="h-screen w-screen mt-10 flex flex-col items-center justify-center text-white">
        <div className="h-screen w-screen absolute bg-black opacity-40 z-0"></div>

        <h2
          className={`${
            isVisible ? 'animated animatedFadeInUp fadeInUp' : 'opacity-0'
          } berserker text-5xl mb-6 text-center z-10`}
        >
          About Sphota
        </h2>

        <h3
          className={`${
            isVisible ? 'animated animatedFadeInUp fadeInUp' : 'opacity-0'
          } text-center tahoma text-white text-[1.3vh] sm:text-[1.3vh] lg:text-[2vh] mr-[5vw] ml-[5vw] mb-6 z-10`}
        >
         SPHOTA is a 24-hour offline hackathon organized by IEEE SB UCEK and IEEE SB STIST. It brings engineering students <br/> from across Kerala for a Celebration of creativity, code, and collaboration.
        </h3>

        {/* Responsive row */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center w-full gap-8 mt-6 z-10">
          {/* Image */}
          <div
            className={`flex-shrink-0 ${
              isVisible ? 'animated animatedFadeInUp fadeInUp' : 'opacity-0'
            }`}
          >
            <Image
              src="/images/image.jpg"
              alt="Watermark"
              width={252}
              height={158}
              min-width={125}
              min-height={79}
            />
          </div>

          {/* Bullet list */}
          <ul
  className={`circle-bullet mt-[1vh] text-white tahoma mr-[5vw] ml-[5vw] text-sm lg:text-base text-left max-w-md ${
    isVisible ? 'animated animatedFadeInUp fadeInUp' : 'opacity-0'
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
