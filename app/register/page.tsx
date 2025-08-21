'use client';
import { useRouter } from 'next/navigation';
export default function RegisterPage() {
   const router = useRouter();
const handleRegisterClick = () => {
    router.push('/');
  };

  return (
    <div className="flex flex-col gap-9 items-center justify-center min-h-screen bg-black text-white text-xl">
      <p className='animated animatedFadeInUp fadeInUp' >
      Oops! Registration is no longer available....
      </p>
      <button
      onClick={handleRegisterClick}
          className="button animated animatedFadeInUp fadeInUp z-30"
        >
          G O - H O M E
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
  );
}
