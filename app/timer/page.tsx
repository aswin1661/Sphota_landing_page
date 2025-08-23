"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function TimerPage() {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        
        // Set your target date here
        const targetDate = new Date('2025-02-15T00:00:00');

        const timer = setInterval(() => {
            const now = new Date().getTime();
            const difference = targetDate.getTime() - now;

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((difference % (1000 * 60)) / 1000)
                });
            }
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Fix image paths - remove 'public/' prefix
    const sponsors = [
        '/images/scopeindia.png',
        '/images/unibic.png',
        '/images/webp/mediaone.webp',
        '/images/Dnet.jpg',
            '/images/Gtech.jpg',
            '/images/Stack up.png',
            '/images/bestrong.png',
            '/images/asswathy.png',
        // Add more sponsor image paths
    ];

    // Prevent hydration mismatch
    if (!mounted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-zinc-900">
                <div className=" mx-auto px-4 py-8">
                    <h1 className="text-center text-6xl berserker md:text-6xl text-white mb-12 mt-[15vh]">
                        SPHOTA
                    </h1>
                    <div className="flex justify-center mt-[15vh] items-center space-x-8 mb-16">
                        <div className="text-center">
                            <div className="text-5xl md:text-7xl font-bold text-white mb-2">00</div>
                            <div className="text-xl text-zinc-400">Days</div>
                        </div>
                        <div className="text-5xl md:text-7xl font-bold text-white">:</div>
                        <div className="text-center">
                            <div className="text-5xl md:text-7xl font-bold text-white mb-2">00</div>
                            <div className="text-xl text-zinc-400">Hours</div>
                        </div>
                        <div className="text-5xl md:text-7xl font-bold text-white">:</div>
                        <div className="text-center">
                            <div className="text-5xl md:text-7xl font-bold text-white mb-2">00</div>
                            <div className="text-xl text-zinc-400">Minutes</div>
                        </div>
                        <div className="text-5xl md:text-7xl font-bold text-white">:</div>
                        <div className="text-center">
                            <div className="text-5xl md:text-7xl font-bold text-white mb-2">00</div>
                            <div className="text-xl text-zinc-400">Seconds</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-zinc-900">
            <div className="container mx-auto px-4 py-8">
                {/* Title */}
                <h1 className="text-center text-6xl berserker md:text-6xl text-white mb-12 mt-[15vh]">
                    SPHOTA
                </h1>

                {/* Timer */}
                <div className="flex justify-center mt-[15vh] items-center space-x-8 mb-16">
                    <div className="text-center">
                        <div className="text-5xl md:text-7xl font-bold text-white mb-2">
                            {timeLeft.days.toString().padStart(2, '0')}
                        </div>
                        <div className="text-xl text-zinc-400">Days</div>
                    </div>
                    <div className="text-5xl md:text-7xl font-bold text-white">:</div>
                    <div className="text-center">
                        <div className="text-5xl md:text-7xl font-bold text-white mb-2">
                            {timeLeft.hours.toString().padStart(2, '0')}
                        </div>
                        <div className="text-xl text-zinc-400">Hours</div>
                    </div>
                    <div className="text-5xl md:text-7xl font-bold text-white">:</div>
                    <div className="text-center">
                        <div className="text-5xl md:text-7xl font-bold text-white mb-2">
                            {timeLeft.minutes.toString().padStart(2, '0')}
                        </div>
                        <div className="text-xl text-zinc-400">Minutes</div>
                    </div>
                    <div className="text-5xl md:text-7xl font-bold text-white">:</div>
                    <div className="text-center">
                        <div className="text-5xl md:text-7xl font-bold text-white mb-2">
                            {timeLeft.seconds.toString().padStart(2, '0')}
                        </div>
                        <div className="text-xl text-zinc-400">Seconds</div>
                    </div>
                </div>

                {/* Sponsors Carousel - Continuous Scroll */}
                <div className="mt-16 px-4 max-w-full mt-[20vh] mx-auto overflow-hidden">
                    <div className="flex animate-scroll">
                        {/* First set of sponsors */}
                        {sponsors.map((sponsor, index) => (
                            <div key={`first-${index}`} className="flex-shrink-0 w-40 h-32 sm:h-40 flex items-center justify-center relative mr-16">
                                <Image
                                    src={sponsor}
                                    alt={`Sponsor ${index + 1}`}
                                    fill
                                    className="object-contain transition-all duration-300"
                                    sizes="160px"
                                    priority={index < 2}
                                />
                            </div>
                        ))}
                        {/* Duplicate set for seamless loop */}
                        {sponsors.map((sponsor, index) => (
                            <div key={`second-${index}`} className="flex-shrink-0 w-40 h-32 sm:h-40 flex items-center justify-center relative mr-16">
                                <Image
                                    src={sponsor}
                                    alt={`Sponsor ${index + 1}`}
                                    fill
                                    className="object-contain transition-all duration-300"
                                    sizes="160px"
                                />
                            </div>
                        ))}
                        {/* Third set for extra seamlessness */}
                        {sponsors.map((sponsor, index) => (
                            <div key={`third-${index}`} className="flex-shrink-0 w-40 h-32 sm:h-40 flex items-center justify-center relative mr-16">
                                <Image
                                    src={sponsor}
                                    alt={`Sponsor ${index + 1}`}
                                    fill
                                    className="object-contain transition-all duration-300"
                                    sizes="160px"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Add custom CSS for animation */}
                <style jsx>{`
                    @keyframes scroll {
                        0% {
                            transform: translateX(0);
                        }
                        100% {
                            transform: translateX(calc(-100% / 3));
                        }
                    }
                    
                    .animate-scroll {
                        animation: scroll 30s linear infinite;
                        width: calc(300%);
                    }
                    
                    .animate-scroll:hover {
                        animation-play-state: paused;
                    }
                `}</style>
            </div>
        </div>
    );
}