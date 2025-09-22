import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CallToAction() {
  return (
    <section className="max-w-7xl mx-auto my-16 py-20 px-4 sm:px-6 lg:px-8 bg-primary rounded-3xl text-primary-foreground relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-balance">
              Ready to Experience Professional Service?
            </h2>
            <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto leading-relaxed">
              Don&apos;t let home issues stress you out. Contact our expert team
              today for a free consultation and discover why thousands of
              homeowners trust us with their most important investment.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/book-a-service">
              <Button
                size="lg"
                variant="secondary"
                className="text-lg px-8 py-6"
              >
                Book a Service
              </Button>
            </Link>
            <Link href="tel:+15551234567">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
              >
                Call (555) 123-4567
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
