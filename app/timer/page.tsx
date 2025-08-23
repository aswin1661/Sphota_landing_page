"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

export default function TimerPage() {
    const [mounted, setMounted] = useState(false);
    const [timerActive, setTimerActive] = useState(false);
    const [timeLeft, setTimeLeft] = useState({
        hours: 23,
        minutes: 25,
        seconds: 0
    });
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!timerActive) {
            if (timerRef.current) clearInterval(timerRef.current);
            return;
        }
        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                const { hours, minutes, seconds } = prev;
                if (hours === 0 && minutes === 0 && seconds === 0) {
                    if (timerRef.current) clearInterval(timerRef.current);
                    playNotification();
                    setTimerActive(false);
                    return prev;
                }
                if (seconds === 0) {
                    if (minutes === 0) {
                        if (hours === 0) {
                            return { hours: 0, minutes: 0, seconds: 0 };
                        }
                        return { hours: hours - 1, minutes: 59, seconds: 59 };
                    }
                    return { hours, minutes: minutes - 1, seconds: 59 };
                }
                return { hours, minutes, seconds: seconds - 1 };
            });
        }, 1000);
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [timerActive]);

    function startTimer() {
        setTimeLeft({ hours: 24, minutes: 0, seconds: 0 });
        setTimerActive(true);
    }

    function playNotification() {
        // Play a system notification sound
        const audio = new Audio('/notification.mp3');
        audio.play();
        // Optionally show a browser notification
        if (window.Notification && Notification.permission === "granted") {
            new Notification("Timer Ended!", { body: "The 24-hour timer has finished." });
        } else if (window.Notification && Notification.permission !== "denied") {
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    new Notification("Timer Ended!", { body: "The 24-hour timer has finished." });
                }
            });
        }
    }

    const sponsors = [
        '/images/scopeindia.png',
        '/images/unibic.png',
        '/images/webp/mediaone.webp',
        '/images/Dnet.jpg',
        '/images/Gtech.jpg',
        '/images/Stack up.png',
        '/images/bestrong.png',
        '/images/asswathy.png',
    ];

    if (!mounted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-zinc-900">
                <div className=" mx-auto px-4 py-8">
                    <h1 className="text-center text-6xl berserker md:text-6xl text-white mb-12 mt-[15vh]">
                        SPHOTA
                    </h1>
                    <div className="flex justify-center mt-[15vh] items-center space-x-8 mb-16">
                        <div className="text-center">
                            <div className="text-7xl font-bold text-white mb-2">24</div>
                            <div className="text-xl text-zinc-400">Hours</div>
                        </div>
                        <div className="text-7xl font-bold text-white">:</div>
                        <div className="text-center">
                            <div className="text-7xl font-bold text-white mb-2">00</div>
                            <div className="text-xl text-zinc-400">Minutes</div>
                        </div>
                        <div className="text-7xl font-bold text-white">:</div>
                        <div className="text-center">
                            <div className="text-7xl font-bold text-white mb-2">00</div>
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
                <div className="flex flex-col items-center mt-[15vh] mb-16">
                    <div className="flex justify-center items-center space-x-8 mb-8">
                        <div className="text-center">
                            <div className="text-7xl font-bold text-white mb-2">
                                {timeLeft.hours.toString().padStart(2, '0')}
                            </div>
                            <div className="text-xl text-zinc-400">Hours</div>
                        </div>
                        <div className="text-7xl font-bold text-white">:</div>
                        <div className="text-center">
                            <div className="text-7xl font-bold text-white mb-2">
                                {timeLeft.minutes.toString().padStart(2, '0')}
                            </div>
                            <div className="text-xl text-zinc-400">Minutes</div>
                        </div>
                        <div className="text-7xl font-bold text-white">:</div>
                        <div className="text-center">
                            <div className="text-7xl font-bold text-white mb-2">
                                {timeLeft.seconds.toString().padStart(2, '0')}
                            </div>
                            <div className="text-xl text-zinc-400">Seconds</div>
                        </div>
                    </div>
                    <button
                        onClick={startTimer}
                        disabled={timerActive}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-md font-bold hover:bg-blue-700 transition-all disabled:opacity-50"
                    >
                        {timerActive ? "Running..." : "Start 24 Hour Timer"}
                    </button>
                </div>

                {/* Sponsors Carousel - Continuous Scroll */}
                <div className="px-4 max-w-full mt-[10vh] mx-auto overflow-hidden">
                    <div className="sponsor-marquee">
                        <div className="sponsor-track">
                            {/* First set of sponsors */}
                            {sponsors.map((sponsor, index) => (
                                <div key={`first-${index}`} className="flex-shrink-0 w-40 h-32 sm:h-40 flex items-center justify-center relative mr-8">
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
                                <div key={`second-${index}`} className="flex-shrink-0 w-40 h-32 sm:h-40 flex items-center justify-center relative mr-8">
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
                </div>

                <style jsx>{`
                    .sponsor-marquee {
                        position: relative;
                        width: 100%;
                        overflow: hidden;
                    }
                    .sponsor-track {
                        display: flex;
                        width: max-content;
                        animation: sponsor-scroll 40s linear infinite;
                    }
                    @keyframes sponsor-scroll {
                        0% {
                            transform: translateX(0);
                        }
                        100% {
                            transform: translateX(-50%);
                        }
                    }
                    .sponsor-track:hover {
                        animation-play-state: paused;
                    }
                `}</style>
            </div>
        </div>
    );
}