"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";
import TitleDescription from "../home/title-desc";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Homeowner",
    content:
      "Exceptional service! They fixed our plumbing emergency within hours and the technician was professional and knowledgeable. Highly recommend!",
    rating: 5,
    image: "/professional-woman-smiling-headshot.png",
  },
  {
    name: "Mike Chen",
    role: "Property Manager",
    content:
      "We use them for all our properties. Their roof repair work is top-notch and they always complete projects on time and within budget.",
    rating: 5,
    image: "/professional-man-smiling-headshot.png",
  },
  {
    name: "Emily Rodriguez",
    role: "Business Owner",
    content:
      "The AC installation for our office was seamless. Great communication throughout the process and excellent follow-up service.",
    rating: 5,
    image: "/professional-businesswoman-smiling-headshot.jpg",
  },
];

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-5 sm:py-8 md:py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <TitleDescription
          title="What Our Customers Say"
          desc="Don't just take our word for it. Here's what our satisfied
            customers have to say about our services."
        />

        <div className="relative max-w-4xl mx-auto">
          <Card className="border-2">
            <CardContent className="p-8 md:p-12">
              <div className="text-center space-y-6">
                <div className="flex justify-center mb-4">
                  {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <blockquote className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                  "{testimonials[currentIndex].content}"
                </blockquote>

                <div className="flex items-center justify-center gap-4">
                  <img
                    src={testimonials[currentIndex].image || "/placeholder.svg"}
                    alt={testimonials[currentIndex].name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="text-left">
                    <div className="font-semibold">
                      {testimonials[currentIndex].name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {testimonials[currentIndex].role}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation dots */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex
                    ? "bg-primary"
                    : "bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
