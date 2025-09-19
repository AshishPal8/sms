import { Button } from "@/components/ui/button";
import Image from "next/image";

export function HeroSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-balance leading-tight">
                Your Trusted Home Service{" "}
                <span className="text-accent">Experts</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
                For over 15 years, we&apos;ve been providing reliable,
                professional home services to families across the region. From
                emergency repairs to routine maintenance, our certified
                technicians deliver quality workmanship you can trust.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="text-lg px-8 py-6">
                Get Free Estimate
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-6 bg-transparent"
              >
                Call (555) 123-4567
              </Button>
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">15+</div>
                <div className="text-sm text-muted-foreground">
                  Years Experience
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">10K+</div>
                <div className="text-sm text-muted-foreground">
                  Happy Customers
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">24/7</div>
                <div className="text-sm text-muted-foreground">
                  Emergency Service
                </div>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/placeholder-65efl.png"
                alt="Professional technician working on home repair"
                width={500}
                height={600}
                className="w-full h-auto object-cover"
              />
            </div>
            {/* Floating card */}
            <div className="absolute -bottom-6 -left-6 bg-card p-6 rounded-xl shadow-lg border">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-accent-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold">Licensed & Insured</div>
                  <div className="text-sm text-muted-foreground">
                    Fully certified professionals
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
