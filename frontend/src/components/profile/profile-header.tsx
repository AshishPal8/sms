"use client";

import * as z from "zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Heading } from "@/components/ui/heading";
import ImageUpload from "@/components/ui/image-upload";
import { baseUrl } from "@/config";
import { Checkbox } from "../ui/checkbox";
import DatePicker from "../ui/date-picker";
import AddressInput from "../ui/AddressInput";
import { Address as AddressType } from "@/types/address.types";
import { addressSchema } from "@/schemas/addressSchema";
import useAuthStore from "@/store/user";
import { format } from "date-fns";

const formSchema = z.object({
  firstname: z.string().min(2, "Enter your name."),
  lastname: z.string().optional(),
  email: z.email("Enter a valid email"),
  phone: z.string().optional(),
  profilePicture: z.string().optional(),
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

type ProfileFormValues = z.infer<typeof formSchema>;

export const ProfileHeader = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const currentToken = useAuthStore.getState().token;

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      phone: "",
      address: undefined,
      profilePicture: "",
      insuranceCompany: "",
      policyNumber: "",
      policyExpiryDate: undefined,
      insuranceContactNo: "",
      insuranceDeductable: 0,
      isRoofCovered: false,
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${baseUrl}/user/auth/me`, {
          withCredentials: true,
        });
        const { data } = res.data;

        form.reset({
          firstname: data.firstname || "",
          lastname: data.lastname || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
          profilePicture: data.profilePicture || "",
          insuranceCompany: data.insuranceCompany || "",
          policyNumber: data.policyNumber || "",
          policyExpiryDate: data.policyExpiryDate || "",
          insuranceContactNo: data.insuranceContactNo || "",
          insuranceDeductable: data.insuranceDeductable || "",
          isRoofCovered: data.isRoofCovered || "",
        });
      } catch (error) {
        toast.error("Failed to load profile details");
        console.error(error);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchProfile();
  }, [form]);

  // Submit handler
  const onSubmit = async (values: ProfileFormValues) => {
    try {
      setLoading(true);
      const res = await axios.patch(`${baseUrl}/user/auth/update`, values, {
        withCredentials: true,
      });

      const { data } = res.data;

      toast.success("Profile updated successfully");

      useAuthStore.getState().setCredentials(
        {
          id: data.id,
          firstname: data.firstname,
          lastname: data.lastname,
          email: data.email,
          role: data.role || "CUSTOMER",
        },
        currentToken || ""
      );
      router.refresh();
    } catch (error) {
      toast.error("Failed to update profile");
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="max-w-3xl mx-auto flex items-center justify-center h-40">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="">
      <div className="flex items-center mb-2 gap-4">
        <Link
          href="/"
          className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center"
        >
          <ArrowLeft size={25} />
        </Link>
        <Heading
          title="Your Profile"
          description="Manage and update your profile information"
        />
      </div>

      <Separator />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full mt-4"
        >
          <div className=" bg-white rounded-xl border-2 border-gray-200 shadow p-5">
            {/* Profile Picture */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-4">
              <FormField
                control={form.control}
                name="profilePicture"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ImageUpload
                        value={field.value ? [field.value] : []}
                        disabled={loading}
                        multiple={false}
                        onChange={(url) =>
                          field.onChange(
                            typeof url === "string" ? url : url[0] || ""
                          )
                        }
                        onRemove={() => field.onChange("")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Name */}
              <FormField
                control={form.control}
                name="firstname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Enter name"
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
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Enter name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input disabled placeholder="Enter email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Enter phone no."
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
                        value={field.value ? new Date(field.value) : undefined}
                        onChange={(date) =>
                          field.onChange(
                            date ? format(date, "yyyy-MM-dd") : undefined
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
            <Button disabled={loading} className="ml-auto" type="submit">
              {loading ? "Updating..." : "Update Profile"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
