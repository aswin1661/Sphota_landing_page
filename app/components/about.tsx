'use client';
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import React from "react";

export default function About() {
     const [bgVisible, setBgVisible] = useState(false);
    
      useEffect(() => {
        // Trigger background fade-in shortly after mount
        const timer = setTimeout(() => {
          setBgVisible(true);
        }, 100); // adjust if needed
    
        return () => clearTimeout(timer);
      }, []);
    return (
          <div className={`relative flex w-screen h-full items-center flex-col justify-center bg-cover bg-center transition-opacity duration-700 ${
                        bgVisible ? 'opacity-100' : 'opacity-0' }`}
                            style={{ backgroundImage: "url('/images/about.jpg')" }}>
     {/* Gradient Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-100"
                style={{
                background: "linear-gradient(to bottom, black 0%, rgba(0,0,0,0.85) 15%, rgba(0,0,0,0) 40%, rgba(0,0,0,0) 70%, rgba(0, 0, 0, 1) 100%, black 100%)"
                }}
            ></div>
            <div className=" h-screen w-screen mt-10 flex  flex-col items-center justify-center text-white">
                <div className="h-screen w-screen absolute bg-black opacity-55"></div>
            <h2 className="animated animatedFadeInUp fadeInUp berserker text-5xl mb-6 text-center">
                About Sphota
            </h2>

            <h3 className="animated animatedFadeInUp fadeInUp text-center tahoma text-white text-[1.3vh] sm:text-[1.3vh] lg:text-[2vh] mb-6">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry.<br />
                Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, <br />
                when an unknown printer
            </h3>

            {/* Responsive row */}
            <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center w-full gap-8 mt-6">
                
                {/* Image */}
                <div className="flex-shrink-0 fade-in-left">
                    <Image src="/images/image.jpg" alt="Watermark" width={252} height={158} />
                </div>

                {/* Bullet list*/}
                <ul className="square-bullet mt-[1vh] fade-in-right text-white tahoma text-sm lg:text-base text-left max-w-md">
                    <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
                    <li>Quisque vel leo a justo elementum ullamcorper.</li>
                    <li>Mauris in lorem non metus pharetra pulvinar.</li>
                    <li>Vestibulum ante ipsum primis in faucibus orci luctus.</li>
                </ul>
            </div>

            {/* Button */}
            <button className="mt-3 px-6 py-2 fade-in-right bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                Learn More
            </button>
            </div>
        </div>
    );
}
