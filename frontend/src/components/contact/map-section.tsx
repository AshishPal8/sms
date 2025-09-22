"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import TitleDescription from "../home/title-desc";

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

export default function MapSection() {
  return (
    <section className="py-5 sm:py-8 md:py-10 bg-white">
      <div className="container mx-auto px-4">
        <TitleDescription
          title="Visit Our Location"
          desc=" Stop by our office to discuss your project in person or get expert
            advice from our team."
        />

        <div className="">
          {/* Map */}
          <motion.div
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-xl h-[400px] bg-slate-100">
              {/* Embedded Google Maps */}
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.1234567890123!2d-74.0059413!3d40.7127753!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQyJzQ2LjAiTiA3NMKwMDAnMjEuNCJX!5e0!3m2!1sen!2sus!4v1234567890123"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Our Location"
              />

              {/* Overlay with company info */}
              <div className="absolute top-4 left-4 bg-white p-4 rounded-lg shadow-lg max-w-xs">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-5 h-5 text-purple-600" />
                  <span className="font-semibold text-slate-900">
                    SMS head office
                  </span>
                </div>
                <p className="text-sm text-slate-600">123 Service Street</p>
                <p className="text-sm text-slate-600">City, ST 12345</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
