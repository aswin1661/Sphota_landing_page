export default function Home() {
    return(
        <div
            className="relative flex w-screen h-screen items-center justify-center bg-cover bg-center"
            style={{ backgroundImage: "url('/images/home.jpg')" }}
        >
            <div className="absolute inset-0 pointer-events-none opacity-90"
                style={{
                    background: "linear-gradient(to bottom, black 0%, rgba(0,0,0,0.85) 20%, rgba(0,0,0,0) 40%, rgba(0,0,0,0) 60%, rgba(0, 0, 0, 1) 100%, black 100%)"
                }}
            ></div>
            <>
            
            </>
        </div>
    )
}