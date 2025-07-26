import Home from "./components/home";

export default async function Page() {
await new Promise((resolve) => setTimeout(resolve, 2500));
  return (
    <div>
      <Home/>
    </div>
  );
}