'use client';
import { useState } from 'react';

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

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      className="w-screen h-screen overflow-y-auto bg-gradient-to-br from-black via-gray-900 to-purple-900 text-white px-6 py-16 flex flex-col items-center"
    >
      <h2 className="text-4xl font-bold mb-10 text-center">Frequently Asked Questions</h2>

      <div className="max-w-2xl w-full space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white/10 rounded-lg shadow-md transition-all duration-300"
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
    </section>
  );
}
