"use client";
import { motion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import TitleDescription from "./title-desc";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Homeowner",
    content:
      "Excellent service! They fixed our plumbing emergency quickly and professionally. The technician was courteous and explained everything clearly. Highly recommended!",
    rating: 5,
    image:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face",
  },
  {
    name: "Mike Davis",
    role: "Business Owner",
    content:
      "Outstanding HVAC installation for our office. Professional team, fair pricing, and great follow-up service. Our employees are much more comfortable now!",
    rating: 5,
    image:
      "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face",
  },
  {
    name: "Emily Rodriguez",
    role: "Property Manager",
    content:
      "Reliable electrical services for all our properties. Always on time, clean work, and competitive rates. They've become our go-to service provider.",
    rating: 5,
    image:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face",
  },
];

export default function Testimonials() {
  return (
    <section className="py-16 bg-blue-50">
      <div className="container mx-auto px-4">
        <TitleDescription
          title="What Our Customers Say"
          desc="Don't just take our word for it. Here's what real
            customers have to say about our professional services and commitment
            to excellence."
        />

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, staggerChildren: 0.2 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <Card className="h-full rounded-3xl border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white p-0">
                <CardContent className="p-8">
                  <Quote className="w-10 h-10 text-blue-600 mb-6 opacity-60" />

                  <p className="text-gray-700 mb-6 leading-relaxed text-lg">
                    {`"${testimonial.content}"`}
                  </p>

                  <div className="flex items-center mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>

                  <div className="flex items-center">
                    <motion.img
                      whileHover={{ scale: 1.1 }}
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-14 h-14 rounded-full object-cover mr-4 border-3 border-blue-100"
                    />
                    <div>
                      <div className="font-semibold text-gray-900 text-lg">
                        {testimonial.name}
                      </div>
                      <div className="text-blue-600 font-medium">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
