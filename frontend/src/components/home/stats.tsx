import React from "react";

const Stats = () => {
  const stats = [
    { label: "Active Users", value: "2,500+" },
    { label: "Tickets Resolved", value: "50,000+" },
    { label: "Response Time", value: "< 2h" },
    { label: "Satisfaction", value: "98%" },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-blue-600">
                {stat.value}
              </div>
              <div className="text-gray-600 mt-2">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
