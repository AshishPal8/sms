import Featured from "@/components/home/featured";
import Hero from "@/components/home/hero";
import Stats from "@/components/home/stats";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto pt-10">
      <Hero />
      <Stats />
      <Featured />
    </div>
  );
}
