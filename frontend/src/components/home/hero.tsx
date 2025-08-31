"use client";
import Image from "next/image";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative w-full">
      <div className="relative mx-auto w-full">
        <div className="relative overflow-hidden rounded-none md:rounded-[32px]">
          <div className="relative aspect-[16/9] w-full md:aspect-[21/9]">
            <Image
              src="/hero.png"
              alt="Professional technician providing home services"
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

            {/* Motion Content */}
            <motion.div
              className="absolute bottom-4 left-4 right-4 text-white md:bottom-12 md:left-12 md:right-12"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Heading */}
              <motion.h1
                className="font-display text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight drop-shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Expert Home Services
                <span className="block text-blue-300">You Can Trust</span>
              </motion.h1>

              {/* Subtext */}
              <motion.p
                className="mt-3 max-w-lg sm:max-w-2xl text-sm sm:text-base md:text-lg lg:text-xl text-white/90"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Professional plumbing, electrical, and HVAC services. Licensed,
                insured, and available 24/7 for emergencies.
              </motion.p>

              {/* Buttons */}
              <motion.div
                className="mt-6 sm:mt-8 flex flex-col sm:flex-row flex-wrap items-center gap-3 sm:gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Button
                  asChild
                  size="lg"
                  className="w-full sm:w-auto rounded-full bg-blue-600 px-6 sm:px-8 py-3 text-white hover:bg-blue-700 hover-lift"
                >
                  <Link href="/book-a-service">Book Service Now</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto rounded-full border-white/70 bg-white/10 px-6 sm:px-8 py-3 text-white backdrop-blur-sm hover:bg-white/20 hover-lift"
                >
                  <a href="tel:+1-555-0123">Call (555) 012-3456</a>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
