import { useEffect, useState } from "react";

interface CountdownProps {
  targetDate: string; // ISO string or date string
}

export default function Countdown({ targetDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date(targetDate);
    const timer = setInterval(() => {
      const now = new Date();
      const diff = target.getTime() - now.getTime();
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / (1000 * 60)) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  // Helper to render each time part in a circle
  const Circle = ({ value, label }: { value: number | string; label: string }) => (
    <div className="flex flex-col items-center mx-1">
      <div className="w-10 h-10 md:w-16 md:h-16 rounded-full bg-black/70 border-2 md:border-4 border-blue-400 flex items-center justify-center text-white text-lg md:text-2xl font-bold shadow-lg">
        {value}
      </div>
      <span className="text-white text-[10px] md:text-xs mt-1 uppercase tracking-widest">{label}</span>
    </div>
  );

  return (
    <div className="flex items-center justify-center gap-1 md:gap-4">
      <Circle value={timeLeft.days} label="Days" />
      <Circle value={timeLeft.hours} label="Hours" />
      <Circle value={timeLeft.minutes} label="Minutes" />
      <Circle value={timeLeft.seconds} label="Seconds" />
    </div>
  );
}



{  /* Usage Example:
<Countdown targetDate="2025-12-31T00:00:00" /> */ }