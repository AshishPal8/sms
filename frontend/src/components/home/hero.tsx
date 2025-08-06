import { ArrowRight, CheckCircle, Star } from "lucide-react";
import React from "react";
import { Badge } from "../ui/badge";
import Link from "next/link";
import { Button } from "../ui/button";

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 to-white py-20 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-6">
              <Badge
                variant="secondary"
                className="bg-blue-100 text-blue-700 hover:bg-blue-100"
              >
                <Star className="h-3 w-3 mr-1" />
                Trusted by 500+ organizations
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Streamline Your
                <span className="text-blue-600"> Service Requests</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Manage tickets, track progress, and deliver exceptional service
                with our comprehensive service request management platform
                designed for modern teams.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="#demo">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  View Demo
                </Button>
              </Link>
            </div>

            <div className="flex items-center space-x-6 pt-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-gray-600">No setup fees</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-gray-600">14-day free trial</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-white rounded-xl shadow-2xl p-6 border border-gray-100">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="h-20 bg-blue-50 rounded border border-blue-200"></div>
                    <div className="h-20 bg-green-50 rounded border border-green-200"></div>
                    <div className="h-20 bg-purple-50 rounded border border-purple-200"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-100 rounded"></div>
                    <div className="h-3 bg-gray-100 rounded w-5/6"></div>
                    <div className="h-3 bg-gray-100 rounded w-4/6"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
