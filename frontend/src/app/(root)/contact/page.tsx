import ContactInfo from "@/components/contact/contact-info";
import HeroSection from "@/components/contact/hero-section";
import MapSection from "@/components/contact/map-section";
import { CallToAction } from "@/components/home/cta-section";
import React from "react";

const Contact = () => {
  return (
    <div>
      <HeroSection />
      <ContactInfo />
      <CallToAction />
      <MapSection />
    </div>
  );
};

export default Contact;
