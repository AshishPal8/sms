"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { baseUrl } from "../../../config";

const schema = z.object({
  title: z
    .string()
    .min(5, "Please enter a short title (min 5 characters).")
    .max(80),
  description: z
    .string()
    .min(20, "Please describe the issue (min 20 characters).")
    .max(1200),
  address: z.string().min(6, "Enter a valid address."),
  name: z.string().min(2, "Enter your name."),
  phone: z
    .string()
    .min(7, "Enter a valid phone.")
    .regex(/^[0-9+()\-\s]+$/, "Only digits and + ( ) - allowed."),
  email: z.email("Enter a valid email.").optional().or(z.literal("")),
  specialInstructions: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function BookingForm() {
  const [submitted, setSubmitted] = useState<null | { id: string }>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  useEffect(() => {
    const fetchCustomerProfile = async () => {
      try {
        const res = await axios.get(`${baseUrl}/user/auth/me`, {
          withCredentials: true,
        });

        if (res.status === 200) {
          const profile = await res.data.data;
          if (profile.name) setValue("name", profile.name);
          if (profile.email) setValue("email", profile.email);
          if (profile.phone) setValue("phone", profile.phone);
          if (profile.address) setValue("phone", profile.address);
        }
      } catch (error) {
        console.error("No logged-in user or failed to fetch profile", error);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchCustomerProfile();
  }, [setValue]);

  async function onSubmit(data: FormData) {
    const res = await axios.post(`${baseUrl}/user/ticket/create`, data, {
      withCredentials: true,
    });

    if (res.status !== 201) {
      console.error("Failed to create ticket");
      return;
    }

    const result = res.data.data;
    setSubmitted({ id: result.id });
  }

  if (loadingProfile) {
    return <p>Loading form...</p>;
  }

  if (submitted) {
    return (
      <Card className="rounded-2xl border-0 bg-white p-8 shadow-xl text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">
          Booking Request Received!
        </h2>
        <p className="text-slate-600 mb-6">
          Thank you for choosing ProService. We&apos;ve received your request
          and will contact you within 2 hours to confirm details and provide an
          arrival window.
        </p>
        <div className="bg-slate-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-slate-600">
            Confirmation ID:{" "}
            <span className="font-bold text-slate-900">{submitted.id}</span>
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            asChild
            className="rounded-full bg-blue-600 hover:bg-blue-700"
          >
            <Link href="/">Return Home</Link>
          </Button>
          <Button variant="outline" className="rounded-full bg-transparent">
            Book Another Service
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <Card className="rounded-2xl border-0 bg-white p-8 shadow-xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-2xl font-bold text-slate-900 mb-2">
                Tell us about the issue
              </h2>
              <p className="text-slate-600">
                Provide details so we can prepare the right tools and parts
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Issue Title
              </label>
              <Input
                placeholder="e.g., Kitchen sink leaking under cabinet"
                {...register("title")}
                className="rounded-lg"
              />
              {errors.title && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Detailed Description
              </label>
              <Textarea
                className="min-h-32 rounded-lg"
                placeholder="Describe the problem in detail. When did it start? What have you tried? Any recent changes or work done?"
                {...register("description")}
              />
              {errors.description && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>
          <div className="space-y-6 mt-10">
            <div>
              <h2 className="font-display text-2xl font-bold text-slate-900 mb-2">
                Contact information
              </h2>
              <p className="text-slate-600">
                How can we reach you to confirm the appointment?
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Full Name
                </label>
                <Input
                  placeholder="John Smith"
                  {...register("name")}
                  className="rounded-lg"
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Phone Number
                </label>
                <Input
                  placeholder="(555) 123-4567"
                  {...register("phone")}
                  className="rounded-lg"
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email (Optional)
              </label>
              <Input
                type="email"
                placeholder="john@example.com"
                {...register("email")}
                className="rounded-lg"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Address
              </label>
              <Input
                type="text"
                placeholder="xyz, new yourk"
                {...register("address")}
                className="rounded-lg"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-center pt-8">
            <Button
              type="submit"
              className="rounded-full bg-blue-600 hover:bg-blue-700"
            >
              submit
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
