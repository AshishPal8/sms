"use client";

import { motion } from "framer-motion";
import { Clock, Phone, Mail, MapPin, Calendar, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function ContactInfo() {
  const businessHours = [
    { day: "Monday - Friday", hours: "8:00 AM - 6:00 PM" },
    { day: "Saturday", hours: "9:00 AM - 4:00 PM" },
    { day: "Sunday", hours: "Emergency Only" },
  ];

  const contactMethods = [
    {
      icon: Phone,
      title: "Phone Support",
      description: "Call us for immediate assistance",
      value: "(555) 123-4567",
      color: "purple",
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us your questions anytime",
      value: "info@homeservices.com",
      color: "blue",
    },
    {
      icon: MapPin,
      title: "Visit Our Office",
      description: "Come see us in person",
      value: "123 Service St, City, ST 12345",
      color: "green",
    },
    {
      icon: Calendar,
      title: "Schedule Online",
      description: "Book your appointment online",
      value: "Book Now",
      color: "orange",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.h2
            variants={fadeInUp}
            className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4"
          >
            Multiple Ways to <span className="text-purple-600">Connect</span>
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-xl text-slate-600 max-w-2xl mx-auto text-pretty"
          >
            Choose the most convenient way to reach us. We&apos;re here to help
            with all your home service needs.
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Methods */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="space-y-6"
          >
            {contactMethods.map((method, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-0">
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-12 h-12 bg-${method.color}-100 rounded-lg flex items-center justify-center flex-shrink-0`}
                      >
                        <method.icon
                          className={`w-6 h-6 text-${method.color}-600`}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 mb-1">
                          {method.title}
                        </h3>
                        <p className="text-slate-600 text-sm mb-2">
                          {method.description}
                        </p>
                        <p className="font-medium text-slate-900">
                          {method.value}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Business Hours & Additional Info */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Business Hours */}
            <motion.div variants={fadeInUp}>
              <Card className="p-6">
                <CardContent className="p-0">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-6 h-6 text-slate-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900">
                      Business Hours
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {businessHours.map((schedule, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0"
                      >
                        <span className="text-slate-600">{schedule.day}</span>
                        <span className="font-medium text-slate-900">
                          {schedule.hours}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Emergency Services */}
            <motion.div variants={fadeInUp}>
              <Card className="p-6 bg-red-50 border-red-200">
                <CardContent className="p-0">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <Shield className="w-6 h-6 text-red-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-red-900">
                      Emergency Services
                    </h3>
                  </div>
                  <p className="text-red-700 mb-3">
                    Need urgent repairs? We offer 24/7 emergency services for
                    critical issues.
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                    <span className="font-semibold text-red-900">
                      Emergency Hotline: (555) 911-HELP
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Service Areas */}
            <motion.div variants={fadeInUp}>
              <Card className="p-6">
                <CardContent className="p-0">
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">
                    Service Areas
                  </h3>
                  <p className="text-slate-600 mb-3">
                    We proudly serve the following areas:
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-slate-700">• Downtown</span>
                    <span className="text-slate-700">• Suburbs</span>
                    <span className="text-slate-700">• North District</span>
                    <span className="text-slate-700">• South Valley</span>
                    <span className="text-slate-700">• East Side</span>
                    <span className="text-slate-700">• West End</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
