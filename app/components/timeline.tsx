'use client';

import { useEffect, useRef, useState } from 'react';

export default function TimeLine() {
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [visibleSections, setVisibleSections] = useState<number[]>([]);

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

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      sectionRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  const timelineData = [
    { year: '2017', text: 'Lorem ipsum dolor sit amet...' },
    { year: '2016', text: 'Lorem ipsum dolor sit amet...' },
    { year: '2015', text: 'Lorem ipsum dolor sit amet...' },
    { year: '2012', text: 'Lorem ipsum dolor sit amet...' },
    { year: '2011', text: 'Lorem ipsum dolor sit amet...' },
    { year: '2007', text: 'Lorem ipsum dolor sit amet...' },
  ];

  return (
    <div
      className="relative w-screen min-h-screen bg-cover bg-center py-24 px-4"
      style={{ backgroundImage: "url('/images/home.jpg')" }}
    >
      {/* Background overlays */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, black 0%, rgba(0,0,0,0.85) 15%, rgba(0,0,0,0) 40%, rgba(0,0,0,0) 70%, rgba(0, 0, 0, 1) 100%)',
        }}
      />
      <div className="absolute inset-0 bg-black/25" />

      <div className="timeline">
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
                className={`content transition-opacity duration-700 ${
                  isVisible
                    ? isLeft
                      ? 'fade-in-left'
                      : 'fade-in-right'
                    : 'opacity-0'
                }`}
              >
                <h2>{item.year}</h2>
                <p>{item.text}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
