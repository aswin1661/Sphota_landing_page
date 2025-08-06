'use client';

import { useEffect } from 'react';

export default function RegisterPage() {
  useEffect(() => {
    window.location.href =
      'https://airtable.com/embed/applq6fD1AFdFLj66/pagfyeyuKn4iE6rOD/form';
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white text-xl">
      Redirecting to registration form...
    </div>
  );
}
