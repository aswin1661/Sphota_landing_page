'use client';
import { useRouter } from 'next/navigation';

export default function ThankYou() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white px-4">
      <h1 className="text-4xl md:text-5xl font-bold text-violet-400 mb-4">
        Thank You!
      </h1>
      <p className="text-lg md:text-xl text-gray-300 mb-8 text-center max-w-xl">
        Your registration has been submitted successfully.
        Check your email for payment details and next steps.
      </p>

      <button
        onClick={() => router.push('/')}
        className="px-6 py-2 bg-white hover:bg-gray-400 text-purple-900 rounded transition"
      >
        Go Back
      </button>
    </div>
  );
}
