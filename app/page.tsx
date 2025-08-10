'use client';
import { preloadAssets } from "./assetsList";
import usePreloadAssets from "./hooks/usePreloadAssests";

import About from './components/about';
import FAQ from './components/faq';
import Footer from './components/footer';
import Home from './components/home';
import Partners from './components/partner';
import Timeline from './components/timeline';
import Loading from "./loading";

export default function Page() {
    const isLoaded = usePreloadAssets(preloadAssets, 500); // extra 500ms delay for smoothness

  return (
     <>
      {!isLoaded ? (
        <div className="loader">
          <Loading hidden={isLoaded} />
        </div>
      ) : (
        <>
           <Home />
           <About />
           <Timeline />
           <FAQ />
           <Partners />
           <Footer />
        </>
      )}
    </>
  );
}
