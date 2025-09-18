"use client";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Wrench, Snowflake, Zap, Shield, Clock, Users } from "lucide-react";
import TitleDescription from "./title-desc";
import Image from "next/image";
import Link from "next/link";

const services = [
  {
    icon: Wrench,
    image: "/plumbing.png",
    title: "Plumbing Services",
    description: "Complete plumbing solutions from repairs to installations.",
    subtitle:
      "Emergency leak fixes, pipe replacements, and water heater services.",
    details:
      "Professional licensed plumbers available 24/7 for all your needs.",
    features: [
      "Emergency Repairs",
      "Pipe Installation",
      "Water Heaters",
      "Drain Cleaning",
    ],
  },
  {
    icon: Zap,
    image: "/roof.png",
    title: "Electronic Services",
    description:
      "Comprehensive electrical work including wiring and installations.",
    subtitle: "Licensed and insured electricians for all electrical needs.",
    details: "Smart home setups, panel upgrades, and safety inspections.",
    features: [
      "Electrical Wiring",
      "Panel Upgrades",
      "Smart Home Setup",
      "Safety Inspections",
    ],
  },
  {
    icon: Snowflake,
    image: "/ac.png",
    title: "AC & HVAC",
    description:
      "Professional AC installation, maintenance, and repair services.",
    subtitle: "Keep your home comfortable year-round with expert technicians.",
    details: "Energy-efficient solutions for optimal indoor climate control.",
    features: [
      "AC Installation",
      "System Maintenance",
      "Emergency Repairs",
      "Energy Audits",
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export default function Services() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <TitleDescription
          title="Our Professional Services"
          desc="From emergency repairs to complete installations, we provide
            comprehensive home services with unmatched quality and reliability."
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
        >
          {services.map((service, index) => (
            <motion.div key={index} variants={cardVariants}>
              <Card className="h-full rounded-3xl border-0 shadow-lg hover:shadow-2xl transition-all duration-300 group bg-white p-0">
                <CardContent className="p-4">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="mb-6 rounded-2xl overflow-hidden"
                  >
                    <Image
                      src={service.image}
                      alt={service.title}
                      className="w-full h-48 object-cover"
                      width={500}
                      height={500}
                    />
                  </motion.div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-gray-700 mb-2 leading-relaxed font-medium">
                    {service.description}
                  </p>

                  <p className="text-gray-600 mb-2 leading-relaxed">
                    {service.subtitle}
                  </p>

                  <p className="text-gray-500 mb-8 leading-relaxed">
                    {service.details}
                  </p>
                  <Link href="/book-a-service">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                      Book Now
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-center p-8 bg-white rounded-3xl shadow-lg"
          >
            <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Licensed & Insured
            </h3>
            <p className="text-gray-600">
              Fully licensed professionals with comprehensive insurance coverage
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-center p-8 bg-white rounded-3xl shadow-lg"
          >
            <Clock className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              24/7 Availability
            </h3>
            <p className="text-gray-600">
              Round-the-clock emergency services when you need us most
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-center p-8 bg-white rounded-3xl shadow-lg"
          >
            <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Expert Technicians
            </h3>
            <p className="text-gray-600">
              Highly trained and certified professionals with years of
              experience
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
