import About from "./components/about";
import FAQ from "./components/faq";
import Home from "./components/home";
import Partners from "./components/partner";
import Timeline from "./components/timeline";

export default function Page() {
  return (
    <div>
       <Home/> 
      <About/>
      <Timeline/> 
      <Partners />
      <FAQ />
    </div>
  );
}