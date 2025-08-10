// src/hooks/usePreloadAssets.ts
import { useEffect, useState } from "react";

export default function usePreloadAssets(assets: string[], extraDelay = 500, timeout = 8000) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let loadedCount = 0;
    const total = assets.length;

    const handleLoad = () => {
      loadedCount++;
      if (loadedCount >= total) {
        setTimeout(() => setIsLoaded(true), extraDelay); // delay for smoothness
      }
    };

    // Timeout safety — prevents infinite loader
    const failSafe = setTimeout(() => {
      setIsLoaded(true);
    }, timeout);

    assets.forEach((src) => {
      if (/\.(mp4|webm)$/i.test(src)) {
        const video = document.createElement("video");
        video.src = src;
        video.preload = "auto";
        video.muted = true; // avoids autoplay restrictions
        video.onloadeddata = handleLoad; // fires reliably
        video.onerror = handleLoad; // still count errors
      } else {
        const img = new Image();
        img.src = src;
        img.onload = handleLoad;
        img.onerror = handleLoad; // count broken images too
      }
    });

    return () => clearTimeout(failSafe);
  }, [assets, extraDelay, timeout]);

  return isLoaded;
}