import { HeroSection } from "@/components/about/hero-section";
import { ServicesOverview } from "@/components/about/service-overview";
import { StatsSection } from "@/components/about/stats-section";
import { TestimonialsSection } from "@/components/about/testimonials-section";
import { WhyChooseUs } from "@/components/about/why-choose-us";
import { CallToAction } from "@/components/home/cta-section";
import React from "react";

const About = () => {
  return (
    <div>
      <HeroSection />
      <StatsSection />
      <ServicesOverview />
      <TestimonialsSection />
      <WhyChooseUs />
      <CallToAction />
    </div>
  );
};

export default About;
