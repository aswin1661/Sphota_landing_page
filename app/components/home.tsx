import Image from "next/image";
import Link from "next/link";

export default function Home() {
    return(
        <div
            className="relative flex w-screen h-screen items-center justify-center bg-cover bg-center"
            style={{ backgroundImage: "url('/images/home.jpg')" }}
        >
            {/* Fixed watermark in top left */}
            <div className="fixed top-4 left-4 z-20 opacity-80">
                <Image src="/images/IEEE logo Full White.png" alt="Watermark" width={80} height={50} />
            </div>

            {/* Centered Nav Bar */}
            <nav className="absolute top-10 left-1/2 -translate-x-1/2 z-30">
                <div className="flex gap-10  px-8 py-4">
                    <Link href="/" className="cinzel-decorative-regular hover:text-yellow-300 transition">Home</Link>
                    <Link href="/about" className="cinzel-decorative-regular hover:text-yellow-300 transition">About</Link>
                    <Link href="/register" className="cinzel-decorative-regular hover:text-yellow-300 transition">Register</Link>
                </div>
            </nav>
            <div className="absolute inset-0 pointer-events-none opacity-90"
                style={{
                    background: "linear-gradient(to bottom, black 0%, rgba(0,0,0,0.85) 20%, rgba(0,0,0,0) 40%, rgba(0,0,0,0) 60%, rgba(0, 0, 0, 1) 100%, black 100%)"
                }}
            ></div>
            <h1 className="pt-[30vh] fixed cinzel-decorative-regular text-4xl">SPHOTA</h1>
            <h3 className=" fixed text-center pt-[50vh] cinzel-text text-md">Lorem Ipsum is simply dummy text of the printing and typesetting industry.<br/>
             Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, <br/>
              when an unknown printer</h3>
            {/* Play Button with Clip Animation */}
                <button className="mt-[75vh]">
                    R E J I S T E R
                    <div id="clip">
                        <div id="leftTop" className="corner"></div>
                        <div id="rightBottom" className="corner"></div>
                        <div id="rightTop" className="corner"></div>
                        <div id="leftBottom" className="corner"></div>
                    </div>
                    <span id="rightArrow" className="arrow"></span>
                    <span id="leftArrow" className="arrow"></span>
                </button>
        </div>
    )
}