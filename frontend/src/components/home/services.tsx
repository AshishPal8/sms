"use client";
import Image from "next/image";
import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TitleDescription from "./title-desc";
import Link from "next/link";

const services = [
  {
    title: "Plumbing Services",
    description:
      "Fix leaks, install heaters, and keep your water running smoothly.",
    features: ["Emergency", "Heater", "Drain", "Pipes"],
    img: "/plumbing.png",
  },
  {
    title: "Electrical Work",
    description: "Safe, certified electrical installations & repairs.",
    features: ["Wiring", "Panels", "Outlets", "Lighting"],
    img: "/electrician.png",
  },
  {
    title: "HVAC Services",
    description: "Stay comfortable year-round with reliable heating & cooling.",
    features: ["AC Repair", "Furnace", "Ducts", "Thermostat"],
    img: "/ac.png",
  },
];

export default function Services() {
  return (
    <section id="services" className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <TitleDescription
          title=" Professional Home Services"
          desc="Expert technicians, quality work, and reliable service you can count on."
        />

        {/* Cards */}
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="relative flex flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-md hover:shadow-lg transition-all">
                {/* Top Image */}
                <div className="relative h-56 w-full">
                  <Image
                    src={service.img}
                    alt={service.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Content */}
                <div className="flex flex-col px-6 flex-grow">
                  <h3 className="text-lg sm:text-xl font-semibold text-slate-900">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 flex-grow">
                    {service.description}
                  </p>

                  {/* Feature tags */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {service.features.map((feature, idx) => (
                      <span
                        key={idx}
                        className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* Action */}
                  <Link href="/book-a-service">
                    <Button
                      variant="ghost"
                      className="mt-6 self-start rounded-full text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                    >
                      Book Now →
                    </Button>
                  </Link>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
