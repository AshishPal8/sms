"use client";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PhoneCall } from "lucide-react";

export default function CTASection() {
  return (
    <section className="relative py-20 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white">
      <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-10" />{" "}
      {/* optional subtle bg pattern */}
      <div className="relative mx-auto max-w-7xl px-6 text-center">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl font-bold sm:text-4xl md:text-5xl"
        >
          Ready to Fix Your Home Issues Today?
        </motion.h2>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-4 max-w-2xl mx-auto text-base sm:text-lg text-white/90"
        >
          From plumbing emergencies to electrical upgrades — our experts are
          just one click away.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4"
        >
          <Button
            asChild
            size="lg"
            className="rounded-full bg-white text-blue-600 hover:bg-gray-100 shadow-md"
          >
            <Link href="/book-a-service">Book Service Now</Link>
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="rounded-full border-white/80 bg-white/10 text-white backdrop-blur hover:bg-white/20 flex items-center gap-2"
          >
            <PhoneCall className="h-5 w-5" />
            <a href="tel:+1-555-0123">(555) 012-3456</a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
