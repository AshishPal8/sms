"use client";
import { motion } from "motion/react";
import { Wrench, UserCheck, CheckCircle2 } from "lucide-react";
import TitleDescription from "./title-desc";

const steps = [
  {
    title: "Submit Your Request",
    description: "Tell us what you need and when — we'll handle the rest.",
    icon: Wrench,
  },
  {
    title: "Tech Assigned",
    description: "A licensed technician is matched and contacts you directly.",
    icon: UserCheck,
  },
  {
    title: "Service Delivered",
    description: "We complete the job to your satisfaction — guaranteed.",
    icon: CheckCircle2,
  },
];

export default function HowItWorks() {
  return (
    <section className="py-5 sm:py-8 md:py-16 bg-[#F5F6F9] px-3 sm:px-6">
      <TitleDescription
        title="How It Works"
        desc="A simple, transparent process from start to finish."
      />

      {/* Timeline */}
      <div className="relative max-w-5xl mx-auto flex flex-col gap-4 md:gap-0 sm:flex-row items-center justify-between">
        {steps.map((step, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: idx * 0.3 }}
            viewport={{ once: true }}
            className="relative z-10 flex flex-col items-center text-center max-w-xs"
          >
            {/* Icon Circle */}
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg">
              <step.icon className="w-8 h-8" />
            </div>

            {/* Title */}
            <h3 className="mt-2 md:mt-6 text-lg font-semibold text-slate-900">
              {step.title}
            </h3>
            <p className="mt-2 text-slate-600 text-sm">{step.description}</p>

            {/* Connector Line */}
            {idx < steps.length - 1 && (
              <div className="hidden sm:block absolute top-8 left-[60%] right-[-60%] h-[2px] border-t-2 border-dotted border-blue-400" />
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
