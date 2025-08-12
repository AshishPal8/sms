import { Clock, Shield, Star } from "lucide-react";

export default function ServiceHero() {
  return (
    <section className="w-full py-8 md:py-10">
      <div className="">
        <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-white to-cyan-50 border border-blue-100 shadow-lg">
          <div className="px-8 py-12 md:px-12 md:py-16">
            <div className="max-w-3xl">
              {/* Trust badges */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-800">
                  <Shield className="h-4 w-4" />
                  Licensed & Insured
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-800">
                  <Clock className="h-4 w-4" />
                  24/7 Emergency
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-sm font-medium text-orange-800">
                  <Star className="h-4 w-4" />
                  4.9/5 Rating
                </div>
              </div>

              <h1 className="font-display text-3xl font-bold text-slate-900 md:text-4xl">
                Book Your Service
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-slate-600">
                Get professional home services with upfront pricing, licensed
                technicians, and same-day availability. Complete the form below
                and we&apos;ll confirm your appointment within 15 minutes.
              </p>

              {/* Quick stats */}
              <div className="mt-8 grid grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">30min</div>
                  <div className="text-sm text-slate-600">Avg Response</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">25k+</div>
                  <div className="text-sm text-slate-600">Jobs Completed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600">100%</div>
                  <div className="text-sm text-slate-600">Satisfaction</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
