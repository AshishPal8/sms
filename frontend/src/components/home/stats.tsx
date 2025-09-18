"use client";
import React from "react";
import { motion } from "motion/react";
import CountUp from "react-countup";
import TitleDescription from "./title-desc";

const stats = [
  { label: "Active Users", value: 2500, suffix: "+" },
  { label: "Tickets Resolved", value: 50000, suffix: "+" },
  { label: "Response Time", value: 2, suffix: "h" },
  { label: "Satisfaction", value: 98, suffix: "%" },
];

export default function Stats() {
  return (
    <section className="relative py-5 sm:py-8 md:py-20">
      {/* Background Accent */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.08),transparent)]" />

      <div className="relative max-w-7xl mx-auto px-3 lg:px-8">
        <TitleDescription
          title="Trusted by Thousands of Homeowners"
          desc=" We deliver fast, reliable, and professional service every time."
        />

        <div className="grid grid-cols-2 gap-3 md:gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="relative rounded-2xl bg-white shadow-lg p-8 text-center hover:shadow-xl transition-shadow"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.8 }}
            >
              {/* Fancy Gradient Accent Circle */}
              <div className="absolute -top-4 left-1/2 h-10 w-10 -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 blur-md opacity-30" />

              <div className="text-xl sm:text-2xl md:text-4xl font-extrabold text-blue-600">
                <CountUp end={stat.value} duration={2} />
                {stat.suffix}
              </div>
              <div className="mt-2 text-gray-600 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
