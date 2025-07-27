import About from "./components/about";
import FAQ from "./components/faq";
import Footer from "./components/footer";
import Home from "./components/home";
import Partners from "./components/partner";
import Timeline from "./components/timeline";

export default function Page() {
  return (
    <div>
       <Home/> 
      <About/>
      <Timeline/> 
      <FAQ />
      <Partners />
      <Footer />
    </div>
  );
}