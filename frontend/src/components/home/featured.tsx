import { BarChart3, Clock, Shield, Users } from "lucide-react";
import React from "react";
import { Card, CardContent } from "../ui/card";

const Featured = () => {
  const features = [
    {
      icon: <Users className="h-8 w-8 text-blue-600" />,
      title: "Multi-Role Access",
      description:
        "Designed for assistants, managers, technicians, and superadmins with role-based permissions.",
    },
    {
      icon: <Clock className="h-8 w-8 text-blue-600" />,
      title: "Real-Time Tracking",
      description:
        "Track ticket progress with live updates and comprehensive timeline views.",
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-blue-600" />,
      title: "Advanced Analytics",
      description:
        "Get insights into team performance and service request patterns.",
    },
    {
      icon: <Shield className="h-8 w-8 text-blue-600" />,
      title: "Secure & Reliable",
      description:
        "Enterprise-grade security with role-based access control and data protection.",
    },
  ];

  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-6 mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Everything you need to manage service requests
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From ticket creation to resolution, our platform provides all the
            tools your team needs to deliver exceptional service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white"
            >
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Featured;
