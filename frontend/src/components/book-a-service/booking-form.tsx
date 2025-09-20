"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AddressInput from "../ui/AddressInput";
import { Address as AddressType } from "@/types/address.types";
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
import { Checkbox } from "../ui/checkbox";
import { toast } from "sonner";
import { addressSchema } from "@/schemas/addressSchema";
import DatePicker from "../ui/date-picker";
import { handleApiError } from "@/lib/handleApiErrors";
import { format } from "date-fns";
import useSettingsStore from "@/store/settings";

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
  firstname: z.string().min(2, "Enter your name."),
  lastname: z.string().optional(),
  phone: z
    .string()
    .min(7, "Enter a valid phone.")
    .regex(/^[0-9+()\-\s]+$/, "Only digits and + ( ) - allowed."),
  address: addressSchema.optional(),
  insuranceCompany: z.string().optional(),
  policyNumber: z.string().optional(),
  policyExpiryDate: z.string().optional(),
  insuranceContactNo: z.string().optional(),
  insuranceDeductable: z
    .number()
    .min(0, "Deductable cannot be negative")
    .optional(),
  isRoofCovered: z.boolean().default(false).optional(),
});

type TicketFormValues = z.infer<typeof formSchema>;

export default function BookingForm() {
  const [submitted, setSubmitted] = useState<null | { id: string }>(null);
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const dateFormat = useSettingsStore((s) => s.getDateFormat());

  const form = useForm<TicketFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      firstname: "",
      lastname: "",
      phone: "",
      address: undefined,
      insuranceCompany: "",
      policyNumber: "",
      policyExpiryDate: undefined,
      insuranceContactNo: "",
      insuranceDeductable: 0,
      isRoofCovered: false,
    },
  });

  const { setValue, reset } = form;

  useEffect(() => {
    const fetchCustomerProfile = async () => {
      try {
        const res = await axios.get(`${baseUrl}/user/auth/me`, {
          withCredentials: true,
        });

        if (res.status === 200) {
          const profile = await res.data.data;
          if (profile.firstname) setValue("firstname", profile.firstname);
          if (profile.lastname) setValue("lastname", profile.lastname);
          if (profile.phone) setValue("phone", profile.phone);

          if (profile.address) {
            if (typeof profile.address === "string") {
              // convert string to object -> put in locality
              setValue("address", profile.address);
            } else {
              // assume object matches addressSchema
              setValue("address", profile.address);
            }
          }

          if (profile.insuranceCompany)
            setValue("insuranceCompany", profile.insuranceCompany);
          if (profile.policyNumber)
            setValue("policyNumber", profile.policyNumber);
          if (profile.policyExpiryDate)
            setValue("policyExpiryDate", profile.policyExpiryDate);
          if (profile.insuranceContactNo)
            setValue("insuranceContactNo", profile.insuranceContactNo);
          if (profile.insuranceDeductable)
            setValue("insuranceDeductable", profile.insuranceDeductable);
          if (profile.isRoofCovered)
            setValue("isRoofCovered", profile.isRoofCovered);
        }
      } catch (error) {
        console.error("No logged-in user or failed to fetch profile", error);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchCustomerProfile();
  }, [setValue]);

  async function onSubmit(values: TicketFormValues) {
    try {
      setLoading(true);

      const res = await axios.post(`${baseUrl}/user/ticket/create`, values, {
        withCredentials: true,
      });

      if (res.status !== 201) {
        console.error("Failed to create ticket");
        return;
      }

      const result = res.data.data;
      setSubmitted({ id: result.id });
      toast.success("Thanks! Our team will reach out soon.");
      reset();
    } catch (err) {
      handleApiError(err);
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
          <Button asChild>
            <Link href="/profile">View Ticket</Link>
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="firstname"
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
                  name="lastname"
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

                <FormField
                  control={form.control}
                  name="insuranceCompany"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Insurance Company</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="Enter insurance company"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="policyNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Insurance Policy No.</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="Enter insurance policy no."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="policyExpiryDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Policy Expiry Date</FormLabel>
                      <FormControl>
                        <DatePicker
                          value={
                            field.value ? new Date(field.value) : undefined
                          }
                          onChange={(date) =>
                            field.onChange(
                              date ? format(date, dateFormat) : undefined
                            )
                          }
                          disabled={loading}
                          placeholder="Select policy expiry date"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="insuranceContactNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Insurance Contact No</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="Enter insurance contact no."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="insuranceDeductable"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Insurance Deductable (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          disabled={loading}
                          placeholder="Enter insurance deductable in %"
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value ? Number(e.target.value) : ""
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isRoofCovered"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Roof Covered</FormLabel>
                      <FormControl>
                        <Checkbox
                          disabled={loading}
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      {/* AddressInput is a controlled component: pass field.value and field.onChange */}
                      <AddressInput
                        value={field.value as AddressType | undefined}
                        onChange={(val) => field.onChange(val)}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-center pt-8">
              <Button type="submit">submit</Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
}
