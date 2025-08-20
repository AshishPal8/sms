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
import { baseUrl } from "../../config";
import ImageUpload from "../ui/image-upload";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

const formSchema = z.object({
  title: z
    .string()
    .min(5, "Please enter a short title (min 5 characters).")
    .max(80),
  description: z
    .string()
    .min(20, "Please describe the issue (min 20 characters).")
    .max(1200),
  assets: z
    .array(z.object({ url: z.string().url("Invalid asset URL") }))
    .optional(),
  name: z.string().min(2, "Enter your name."),
  phone: z
    .string()
    .min(7, "Enter a valid phone.")
    .regex(/^[0-9+()\-\s]+$/, "Only digits and + ( ) - allowed."),
  address: z.string().min(6, "Enter a valid address."),
});

type TicketFormValues = z.infer<typeof formSchema>;

export default function BookingForm() {
  const [submitted, setSubmitted] = useState<null | { id: string }>(null);
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const form = useForm<TicketFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      name: "",
      phone: "",
      address: "",
    },
  });

  const { setValue } = form;

  useEffect(() => {
    const fetchCustomerProfile = async () => {
      try {
        const res = await axios.get(`${baseUrl}/user/auth/me`, {
          withCredentials: true,
        });

        if (res.status === 200) {
          const profile = await res.data.data;
          if (profile.name) setValue("name", profile.name);
          if (profile.phone) setValue("phone", profile.phone);
          if (profile.address) setValue("address", profile.address);
        }
      } catch (error) {
        console.error("No logged-in user or failed to fetch profile", error);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchCustomerProfile();
  }, [setValue]);

  async function onSubmit(data: TicketFormValues) {
    try {
      setLoading(true);
      const res = await axios.post(`${baseUrl}/user/ticket/create`, data, {
        withCredentials: true,
      });

      if (res.status !== 201) {
        console.error("Failed to create ticket");
        return;
      }

      const result = res.data.data;
      setSubmitted({ id: result.id });
    } catch (err) {
      console.error("Error creating ticket", err);
    } finally {
      setLoading(false);
    }
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
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 w-full mt-4"
          >
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-2xl font-bold text-slate-900 mb-2">
                  Tell us about the issue
                </h2>
                <p className="text-slate-600">
                  Provide details so we can prepare the right tools and parts
                </p>
              </div>
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="e.g., Kitchen sink leaking under cabinet"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Detailed Description</FormLabel>
                    <FormControl>
                      <Textarea
                        disabled={loading}
                        placeholder="Describe the problem in detail. When did it start? What have you tried? Any recent changes or work done?"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="assets"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ImageUpload
                        value={(field.value || []).map((a) => a.url)}
                        disabled={loading}
                        multiple={true}
                        onChange={(urls) => {
                          field.onChange(
                            Array.isArray(urls)
                              ? urls.map((u) => ({ url: u }))
                              : []
                          );
                        }}
                        onRemove={(url) => {
                          field.onChange(
                            (field.value || []).filter((a) => a.url !== url)
                          );
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="John Smith"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="(555) 123-4567"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="xyz, New York"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex justify-center pt-8">
              <Button
                type="submit"
                className="rounded-full bg-blue-600 hover:bg-blue-700"
              >
                submit
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
}
