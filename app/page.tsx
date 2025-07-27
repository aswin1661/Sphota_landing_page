import About from "./components/about";
import Home from "./components/home";
import Timeline from "./components/timeline";

export default function Page() {
  return (
    <div>
      <Home/> 
      <About/>
      <Timeline/>
    </div>
  );
}