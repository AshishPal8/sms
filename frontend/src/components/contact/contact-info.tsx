"use client";

import { motion } from "motion/react";
import { Clock, Phone, Mail, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import TitleDescription from "../home/title-desc";

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
  ];

  return (
    <section className="py-5 sm:py-8 md:py-10 bg-white">
      <div className="container mx-auto px-4">
        <TitleDescription
          title="Multiple Ways to Connect"
          desc="Choose the most convenient way to reach us. We're here to help
            with all your home service needs."
        />

        <div className="grid lg:grid-cols-2 gap-12">
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

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="space-y-6"
          >
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

            <motion.div variants={fadeInUp}>
              <Card className="p-6">
                <CardContent className="p-0">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900">
                        Technical support
                      </h3>
                      <div className="space-y-1 text-slate-600">
                        <p>Phone: (555) 123-4567</p>
                        <p>Emergency: (555) 911-HELP</p>
                        <p>Email: info@sms.com</p>
                      </div>
                    </div>
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
