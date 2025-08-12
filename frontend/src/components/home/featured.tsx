import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const services = [
  {
    title: "Plumbing Services",
    description:
      "From leaky faucets to complete pipe replacements, our certified plumbers handle it all.",
    features: [
      "Emergency repairs",
      "Water heater installation",
      "Drain cleaning",
      "Pipe replacement",
    ],
    img: "/plumbing.png",
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "Electrical Work",
    description:
      "Safe, code-compliant electrical services for your home's power needs.",
    features: [
      "Panel upgrades",
      "Outlet installation",
      "Lighting fixtures",
      "Wiring repairs",
    ],
    img: "/electrician.png",
    color: "from-yellow-500 to-orange-500",
  },
  {
    title: "HVAC Services",
    description:
      "Keep your home comfortable year-round with our heating and cooling experts.",
    features: [
      "AC repair & install",
      "Furnace maintenance",
      "Duct cleaning",
      "Thermostat upgrade",
    ],
    img: "/ac.png",
    color: "from-green-500 to-emerald-500",
  },
];

export default function FeatureCards() {
  return (
    <section id="services" className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold text-slate-900 md:text-5xl">
            Professional Home Services
          </h2>
          <p className="mt-4 text-lg text-slate-600 md:text-xl">
            Expert technicians, quality work, and reliable service you can count
            on
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <Card
              key={i}
              className="group overflow-hidden rounded-2xl border-0 bg-white shadow-lg hover-lift"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={service.img || "/placeholder.svg"}
                  alt={service.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="font-display text-xl font-semibold text-slate-900">
                  {service.title}
                </h3>
                <p className="mt-2 text-slate-600">{service.description}</p>
                <ul className="mt-4 space-y-2">
                  {service.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-center text-sm text-slate-600"
                    >
                      <div className="mr-2 h-1.5 w-1.5 rounded-full bg-blue-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  variant="ghost"
                  className="mt-4 w-full rounded-full text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                >
                  Learn More →
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button
            size="lg"
            className="rounded-full bg-blue-600 px-8 py-3 text-white hover:bg-blue-700 hover-lift"
          >
            Get Free Estimate
          </Button>
        </div>
      </div>
    </section>
  );
}
