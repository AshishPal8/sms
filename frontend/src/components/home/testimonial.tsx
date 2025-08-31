"use client";
import { motion } from "motion/react";
import Image from "next/image";
import { Star } from "lucide-react";
import TitleDescription from "./title-desc";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Homeowner, NY",
    image: "/testimonials/user1.jpg",
    review:
      "The team was fantastic! They fixed my water heater within hours. Professional and friendly service.",
    rating: 5,
  },
  {
    name: "Michael Lee",
    role: "Restaurant Owner, CA",
    image: "/testimonials/user2.jpg",
    review:
      "Quick response for an electrical emergency. I felt safe and informed every step of the way.",
    rating: 5,
  },
  {
    name: "Emily Davis",
    role: "Homeowner, TX",
    image: "/testimonials/user3.jpg",
    review:
      "Our AC broke in summer heat — they had it running the same day! Couldn’t be happier.",
    rating: 4,
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <TitleDescription
          title="What Our Customers Say"
          desc="Trusted by thousands of happy homeowners and businesses."
        />

        {/* Cards */}
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              viewport={{ once: true }}
              className="rounded-2xl bg-white p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              {/* User */}
              <div className="flex items-center gap-4">
                <Image
                  src={t.image}
                  alt={t.name}
                  width={56}
                  height={56}
                  className="h-14 w-14 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-slate-900">{t.name}</p>
                  <p className="text-sm text-slate-500">{t.role}</p>
                </div>
              </div>

              {/* Review */}
              <p className="mt-4 text-slate-600 text-sm sm:text-base">
                “{t.review}”
              </p>

              {/* Rating */}
              <div className="mt-4 flex">
                {Array.from({ length: t.rating }).map((_, idx) => (
                  <Star
                    key={idx}
                    className="h-5 w-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
                {Array.from({ length: 5 - t.rating }).map((_, idx) => (
                  <Star key={idx} className="h-5 w-5 text-gray-300" />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
