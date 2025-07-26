import Home from "./components/home";

export default async function Page() {
await new Promise((resolve) => setTimeout(resolve, 1000));
  return (
    <div>
      <Home/>
    </div>
  );
}