'use client';

import { useEffect, useRef, useState } from 'react';
import React from "react";
export default function TimeLine() {
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [visibleSections, setVisibleSections] = useState<number[]>([]);
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
  
      const currentSection = sectionRef.current;
      if (currentSection) {
        observer.observe(currentSection);
      }
  
      return () => {
        if (currentSection) observer.unobserve(currentSection);
      };
    }, []);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        setVisibleSections((prev) => {
          const newVisible = [...prev];

          entries.forEach((entry) => {
            const index = Number(entry.target.getAttribute('data-index'));
            if (entry.isIntersecting && !newVisible.includes(index)) {
              newVisible.push(index);
            } else if (!entry.isIntersecting && newVisible.includes(index)) {
              // Remove index if it's no longer visible
              const idx = newVisible.indexOf(index);
              if (idx > -1) newVisible.splice(idx, 1);
            }
          });

          return [...newVisible];
        });
      },
      { threshold: 0.3 }
    );

    const currentSectionRefs = sectionRefs.current;
    currentSectionRefs.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      currentSectionRefs.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  const timelineData = [
    { name: 'Registration Opens',date:'09/08/2025', },
    { name: 'Registration Closes',date:'21/08/2025', },
    { name: 'Hackathon Kick-Off',date:'23/08/2025 (10:00 am)', },
    { name: 'Hackathon Ends',date:'24/08/2025 (10:00 am)', },
    { name: 'Closing Ceremony & Awards',date:'24/08/2025 (11:00 am)', },
  ];

  return (
    <div
      className="relative w-screen overflow-hidden min-h-screen bg-cover bg-center py-24 px-4"
      style={{ backgroundImage: "url('/images/webp/timeline.webp')" }}
    id='time'
    >
      {/* Background overlays */}
      <div
        className="absolute inset-0 z-1  pointer-events-none"
        style={{
        
          background:
            'linear-gradient(to bottom, black 0%, rgba(0,0,0,0.85) 15%, rgba(0,0,0,0) 40%, rgba(0,0,0,0) 70%, rgba(0, 0, 0, 1) 100%)',
        }}
      /> {/* Video overlay */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-30"
        >
          <source src="/videos/overlay.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      <div className="absolute inset-0 z-8 bg-black/10" />
       <div className="relative z-30">
    <h2
      ref={sectionRef}
      className={`${
        isVisible ? 'animated animatedFadeInUp fadeIn' : 'opacity-0'
      } berserker text-5xl mb-6 text-center text-white`}
    >
      Timeline
    </h2>
  </div>


      <div className="timeline z-99">
        {timelineData.map((item, index) => {
          const isLeft = index % 2 === 0;
          const isVisible = visibleSections.includes(index);
          return (
            <div
              key={index}
              ref={(el) => {
                sectionRefs.current[index] = el;
              }}
              data-index={index}
              className={`container ${isLeft ? 'left' : 'right'}`}
            >
              <div
                className={`content transition-opacity flex flex-col items-center duration-700 ${
                  isVisible
                    ? isLeft
                      ? 'fade-in-left'
                      : 'fade-in-right'
                    : 'opacity-0' 
                }`}
              >
                
                <h1 className={`duration-700 text-xs ${
                  isVisible
                    ? isLeft
                      ? 'fade-in-left'
                      : 'fade-in-right'
                    : 'opacity-0' 
                }`} >{item.date}</h1>
                <h2  className='mt-[1.5vh] text-lg font-bold' >{item.name}</h2>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}














