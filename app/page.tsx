'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

import About from './components/about';
import FAQ from './components/faq';
import Footer from './components/footer';
import Home from './components/home';
import Partners from './components/partner';
import Timeline from './components/timeline';
import Loader from './components/Loading';

export default function Page() {
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(false); 
  const pathname = usePathname(); 

  // Initial media preload
  useEffect(() => {
    const preloadMedia = async () => {
      await new Promise((resolve) => setTimeout(resolve, 2500)); 
      setIsLoading(false);
    };
    preloadMedia();
  }, []);

  // Route change detection
  useEffect(() => {
    if (!isLoading) {
      setLoading(true);
      const timer = setTimeout(() => setLoading(false), 1000); 
      return () => clearTimeout(timer);
    }
  }, [pathname, isLoading]);

  if (isLoading || loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
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
