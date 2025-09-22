import Hero from "@/components/home/hero";
import HowItWorks from "@/components/home/how-it-works";
import Stats from "@/components/home/stats";
import Services from "@/components/home/services";
import Testimonials from "@/components/home/testimonial";
import { CallToAction } from "@/components/home/cta-section";

export default function Home() {
  return (
    <div className="pt-2 md:pt-10">
      <Hero />
      <Stats />
      <HowItWorks />
      <Services />
      <Testimonials />
      <CallToAction />
    </div>
  );
}
