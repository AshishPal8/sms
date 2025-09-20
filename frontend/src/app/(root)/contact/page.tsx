import ContactForm from "@/components/contact/contact-form";
import ContactInfo from "@/components/contact/contact-info";
import HeroSection from "@/components/contact/hero-section";
import MapSection from "@/components/contact/map-section";
import React from "react";

const Contact = () => {
  return (
    <div>
      <HeroSection />
      <ContactInfo />
      <ContactForm />
      <MapSection />
    </div>
  );
};

export default Contact;
