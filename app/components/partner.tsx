'use client';
import Image from 'next/image';

const partners = [
  '/logoipsum1.png',
  '/logoipsum2.png',
  '/logoipsum3.png',
  '/logoipsum4.png',
];

export default function Partners() {
  return (
    <section className="relative overflow-hidden py-12">
      {/* Blurred radial gradient background */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-black">
          <div
            className="absolute inset-0 bg-center bg-no-repeat bg-cover blur-3xl opacity-50"
            style={{
              background: `radial-gradient(circle at center, rgba(9, 30, 134, 0.7), rgba(0,0,0,1))`,
            }}
          />
        </div>
      </div>

      {/* Foreground content */}
      <div className="relative z-10">
        <div className="text-center text-white text-2xl font-semibold mb-8">Our Partners</div>
        <div className="flex justify-center gap-6 flex-wrap">
          {partners.map((logo, index) => (
            <div
              key={index}
              className="bg-white/10 p-4 rounded-md hover:scale-105 transition"
            >
              <Image
                src={logo}
                alt={`Partners ${index + 1}`}
                width={150}
                height={50}
                className="object-contain grayscale hover:grayscale-0 transition duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
