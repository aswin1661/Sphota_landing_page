'use client';
import { useEffect, useState } from 'react';

import About from './components/about';
import FAQ from './components/faq';
import Footer from './components/footer';
import Home from './components/home';
import Partners from './components/partner';
import Timeline from './components/timeline';
import  Loader  from './components/Loading';

export default function Page() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const preloadMedia = async () => {
      const mediaUrls: string[] = [
        // ✅ Replace these with actual file paths
        '/images/bg-home.jpg',
        '/images/bg-about.jpg',
        '/videos/intro.mp4',
        // Add more if needed
      ];

      const preloadImage = (url: string): Promise<void> =>
        new Promise((resolve) => {
          const img = new Image();
          img.src = url;
          img.onload = () => resolve();
          img.onerror = () => resolve(); // Avoid breaking load if image fails
        });

      const preloadVideo = (url: string): Promise<void> =>
        new Promise((resolve) => {
          const video = document.createElement('video');
          video.src = url;
          video.onloadeddata = () => resolve();
          video.onerror = () => resolve();
        });

      await Promise.all(
        mediaUrls.map((url) =>
          url.endsWith('.mp4') ? preloadVideo(url) : preloadImage(url)
        )
      );

      setIsLoading(false);
    };

    preloadMedia();
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex align-center justify-center items-cen">
        <Loader />
      </div>
    );
  }

  return (
    <div>
      <Home />
      <About />
      <Timeline />
      <FAQ />
      <Partners />
      <Footer />
    </div>
  );
}
