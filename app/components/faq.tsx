'use client';
import { useEffect, useRef, useState } from "react";
import React from "react";

const faqs = [
  {
    question: 'What is Sphota?',
    answer: 'Sphota is an innovative platform designed to foster communication and collaboration in unique ways.',
  },
  {
    question: 'Who can participate in Sphota events?',
    answer: 'Anyone with interest in technology, creativity, and learning is welcome to participate.',
  },
  {
    question: 'How do I register?',
    answer: 'You can register via our official website by filling out the registration form available on the homepage.',
  },
  {
    question: 'Is there a fee to join?',
    answer: 'No, Sphota events are completely free for all registered participants.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
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

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      className="w-screen h-screen overflow-y-auto  bg-gradient-to-b  text-white px-6 py-16 flex flex-col items-center"
    >
      <div
        ref={sectionRef}
        className={`absolute flex w-screen h-screen items-center overflow-hidden flex-col justify-center bg-cover bg-center  `}
        style={{ backgroundImage: "url('/images/faq.jpg')" }}
      >
              <div
        className="absolute inset-0 pointer-events-none opacity-100"
        style={{
          background:
            "linear-gradient(to bottom, black 0%, rgba(0,0,0,0.85) 15%, rgba(0,0,0,0) 40%, rgba(0,0,0,0) 70%, rgba(0, 0, 0, 1) 100%)",
        }}
      ></div>
       <div className="h-screen w-screen absolute bg-black opacity-45 z-0"></div> 
        <h2 className={`${
            isVisible ? 'animated animatedFadeInUp fadeInUp' : 'opacity-0'
          } text-4xl z-10 font-bold mb-10 text-center berserker `}>Frequently Asked Questions</h2>
        <div className="max-w-2xl z-10 w-full space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`${
            isVisible ? 'animated animatedFadeInUp fadeInUp' : 'opacity-0'
          } bg-black/50 rounded-lg mr-[5vw] ml-[5vw] shadow-md transition-all duration-300`}
            >
              <button
                onClick={() => toggle(index)}
                className="w-full text-left px-6 py-4 font-semibold text-lg flex justify-between items-center"
              >
                <span>{faq.question}</span>
                <span className="text-xl">{openIndex === index ? '−' : '+'}</span>
              </button>
              <div
                className={`px-6 pb-4 text-gray-300 transition-all duration-300 ${
                  openIndex === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                }`}
              >
                {faq.answer}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
