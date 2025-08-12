import Image from "next/image";
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
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white md:bottom-12 md:left-12 md:right-12">
              <div>
                <h1 className="font-display text-3xl font-bold tracking-tight drop-shadow-lg md:text-6xl lg:text-7xl">
                  Expert Home Services
                  <span className="block text-blue-300">You Can Trust</span>
                </h1>
              </div>
              <div>
                <p className="mt-4 max-w-2xl text-lg text-white/90 md:text-xl">
                  Professional plumbing, electrical, and HVAC services.
                  Licensed, insured, and available 24/7 for emergencies.
                </p>
              </div>
              <div>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Button
                    asChild
                    size="lg"
                    className="rounded-full bg-blue-600 px-8 py-3 text-white hover:bg-blue-700 hover-lift"
                  >
                    <Link href="/book-a-service">Book Service Now</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="rounded-full border-white/70 bg-white/10 px-8 py-3 text-white backdrop-blur-sm hover:bg-white/20 hover-lift"
                  >
                    <a href="tel:+1-555-0123">Call (555) 012-3456</a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Trust indicators */}
        <div>
          <div className="mx-auto mt-8 flex w-full max-w-7xl flex-col items-center px-4 text-center md:px-8">
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-600 md:gap-8 md:text-base">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span>Licensed & Insured</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                <span>24/7 Emergency Service</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-orange-500"></div>
                <span>Same-Day Service</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                <span>100% Satisfaction Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
