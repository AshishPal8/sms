"use client";

import type React from "react";

import { useEffect, useState } from "react";

interface StatItemProps {
  number: number;
  suffix: string;
  label: string;
  icon: React.ReactNode;
}

function StatItem({ number, suffix, label, icon }: StatItemProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (count < number) {
        setCount(count + Math.ceil(number / 100));
      }
    }, 20);

    return () => clearTimeout(timer);
  }, [count, number]);

  return (
    <div className="text-center space-y-4">
      <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
        <div className="text-accent">{icon}</div>
      </div>
      <div>
        <div className="text-4xl font-bold text-accent">
          {Math.min(count, number).toLocaleString()}
          {suffix}
        </div>
        <div className="text-muted-foreground font-medium">{label}</div>
      </div>
    </div>
  );
}

export function StatsSection() {
  return (
    <section className="py-20 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Trusted by Thousands</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our track record speaks for itself. Here&apos;s what we&apos;ve
            accomplished over the years.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          <StatItem
            number={10000}
            suffix="+"
            label="Services Completed"
            icon={
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
          />
          <StatItem
            number={15}
            suffix="+"
            label="Years Experience"
            icon={
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
          />
          <StatItem
            number={99}
            suffix="%"
            label="Customer Satisfaction"
            icon={
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            }
          />
          <StatItem
            number={50}
            suffix="+"
            label="Certified Technicians"
            icon={
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            }
          />
        </div>
      </div>
    </section>
  );
}
