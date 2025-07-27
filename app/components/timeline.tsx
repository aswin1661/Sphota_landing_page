'use client';

import { useEffect, useRef, useState } from 'react';

interface Event {
  name: string;
  description: string;
}

const events: Event[] = [
  { name: 'Name', description: 'Registration Opens' },
  { name: 'Name', description: 'First Round Submissions' },
  { name: 'Name', description: 'Shortlist Announcement' },
  { name: 'Name', description: 'Final Event' },
];

export default function TimeLine() {
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const [openedIndex, setOpenedIndex] = useState<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const newVisible: number[] = [];
        entries.forEach((entry) => {
          const index = Number(entry.target.getAttribute('data-index'));
          if (entry.isIntersecting) {
            newVisible.push(index);
          }
        });
        setVisibleItems((prev) => Array.from(new Set([...prev, ...newVisible])));
      },
      { threshold: 0.3 }
    );

    itemRefs.current.forEach((el) => el && observer.observe(el));
    return () => itemRefs.current.forEach((el) => el && observer.unobserve(el));
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenedIndex(null);
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <>
      <div
        className="relative w-screen min-h-screen bg-cover bg-center py-24 px-4"
        style={{ backgroundImage: "url('/images/home.jpg')" }}
      >
        {/* Background Gradient Overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-100"
          style={{
            background:
              "linear-gradient(to bottom, black 0%, rgba(0,0,0,0.85) 15%, rgba(0,0,0,0) 40%, rgba(0,0,0,0) 70%, rgba(0, 0, 0, 1) 100%)",
          }}
        />
            <div className="absolute inset-0 bg-black/25" />
        {/* Vertical Center Line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-blue-500 z-10 transform -translate-x-1/2" />

        {/* Timeline Items */}
        <div className="relative z-20 max-w-5xl mx-auto flex flex-col gap-20">
          {events.map((event, index) => {
            const isLeft = index % 2 === 0;
            const isVisible = visibleItems.includes(index);

            return (
              <div
                key={index}
                ref={(el) => {
  itemRefs.current[index] = el;
}} 

                data-index={index}
                className={`relative w-full flex items-center justify-center md:justify-${
                  isLeft ? 'start' : 'end'
                } max-w-full md:max-w-[50vw] mx-auto`}
              >
                {/* Dot on center line */}
                <span className="absolute left-1/2 w-4 h-4 bg-blue-500 rounded-full z-20 transform -translate-x-1/2" />

                {/* Timeline Card */}
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenedIndex(index);
                  }}
                  className={`cursor-pointer max-w-sm p-6 bg-black z-30 text-white transition-all duration-700 ${
                    isVisible ? (isLeft ? 'fade-in-left' : 'fade-in-right') : 'opacity-0 translate-y-4'
                  }`}
                >
                  <div className="text-blue-300 font-semibold">{event.name}</div>
                  <div className="text-lg">{event.description}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal Overlay & Dialog */}
      {openedIndex !== null && (
        <div
          onClick={() => setOpenedIndex(null)}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          {/* Background Dim Filter */}
          <div className="absolute inset-0 bg-black/50" />

          {/* Dialog Box */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 bg-gray-900 bg-opacity-90 text-white rounded-lg p-8 max-w-md w-full mx-4 shadow-lg transition-all"
          >
            <h2 className="text-xl font-bold mb-4">{events[openedIndex].name}</h2>
            <p className="text-lg">{events[openedIndex].description}</p>
            <button
              onClick={() => setOpenedIndex(null)}
              className="mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
            >
              Close
            </ button>
          </div>
        </div>
      )}
    </>
  );
}
