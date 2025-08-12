'use client';
import { useState } from "react";
import React from "react";

const faqs = [
  {
    question: 'What is Sphota?',
    answer: 'SPHOTA is a 24-hour offline hackathon organized by IEEE SB UCEK and IEEE SB STIST. It brings engineering students from across Kerala for a Celebration of creativity, code, and collaboration',
  },
  {
    question: 'Who can participate in Sphota events?',
    answer: 'Anyone with interest in technology, creativity, and learning is welcome to participate.',
  },
  {
    question: 'How do I register?',
    answer: 'You can register via our official website by filling out the registration form available on the registration by completing the payment.',
  },
  {
    question: 'Is there a fee to join?',
    answer: 'Yes, Sphota events have a fee payment for all registered participants.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      className="w-screen h-screen overflow-y-auto bg-gradient-to-b text-white px-6 py-16 flex flex-col items-center"
      id="faq"
    >
      <div
        className="absolute flex w-screen h-screen items-center overflow-hidden flex-col justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/images/webp/faq.webp')" }}
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-100"
          style={{
            background:
              "linear-gradient(to bottom, black 0%, rgba(0,0,0,0.85) 15%, rgba(0,0,0,0) 40%, rgba(0,0,0,0) 70%, rgba(0, 0, 0, 1) 100%)",
          }}
        ></div>
        <div className="h-screen w-screen absolute bg-black opacity-25 z-0"></div>
        
        <h2 className="text-4xl z-10 font-bold mb-10 text-center berserker">
          Frequently Asked Questions
        </h2>

        <div className="max-w-2xl z-10 w-full space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-black/50 rounded-lg mr-[5vw] ml-[5vw] shadow-md transition-all duration-300"
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
                  openIndex === index
                    ? 'max-h-40 opacity-100'
                    : 'max-h-0 opacity-0 overflow-hidden'
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
