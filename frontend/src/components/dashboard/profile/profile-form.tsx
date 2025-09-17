"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
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
import axios from "axios";
import { baseUrl } from "../../../config";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import useAuthStore from "@/store/user";

const formSchema = z.object({
  firstname: z.string(),
  lastname: z.string(),
  email: z.string(),
  phone: z.string().optional(),
  profilePicture: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof formSchema>;

interface ProfileFormProps {
  initialData?: ProfileFormValues & { id?: string };
}

export const ProfileForm = ({ initialData }: ProfileFormProps) => {
  const router = useRouter();
  const currentToken = useAuthStore.getState().token;

  const [loading, setLoading] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      firstname: "",
      lastname: "",
      email: "",
      phone: "",
      profilePicture: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        ...initialData,
      });
    }
  }, [form, initialData]);

  const isEdit = !!initialData;

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      setLoading(true);

      if (isEdit) {
        const res = await axios.put(
          `${baseUrl}/employees/update/${initialData.id}`,
          values,
          {
            withCredentials: true,
          }
        );

        const { data } = res.data;

        useAuthStore.getState().setCredentials(
          {
            id: data.id,
            firstname: data.firstname,
            lastname: data.lastname,
            email: data.email,
            role: data.role || "CUSTOMER",
            profilePicture: data.profilePicture,
          },
          currentToken || ""
        );
      }

      toast.success(`Profile ${isEdit ? "updated" : "created"} successfully`);
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong!");
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center mb-2 gap-4">
          <Link
            href="/dashboard"
            className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center"
          >
            <ArrowLeft size={25} />
          </Link>
          <Heading
            title={isEdit ? "Profile" : ""}
            description={
              isEdit ? "Update profile details" : "Add a new profile"
            }
          />
        </div>
        <Separator />
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 w-full mt-4"
          >
            <div className="grid grid-cols-1 gap-5">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Firstname</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="Enter Firstname"
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
                      <FormLabel>Lastname</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="Enter Fastname"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        disabled={loading}
                        placeholder="Enter email"
                        {...field}
                        readOnly
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
            </div>

            <Button disabled={loading} className="ml-auto" type="submit">
              {isEdit ? "Update" : "Save"}
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
};
