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
import { Switch } from "@/components/ui/switch";
import axios from "axios";
import { baseUrl } from "@/config";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const formSchema = z.object({
  name: z.string(),
  managers: z.array(z.string()).optional(),
  technicians: z.array(z.string()).optional(),
  isActive: z.boolean(),
});

type DivisionFormValues = z.infer<typeof formSchema>;

interface DivisionFormProps {
  initialData?: DivisionFormValues & {
    id?: string;
  };
}

export const DivisionForm = ({ initialData }: DivisionFormProps) => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const form = useForm<DivisionFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      isActive: true,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  const isEdit = !!initialData;

  const onSubmit = async (values: DivisionFormValues) => {
    try {
      setLoading(true);

      if (isEdit) {
        await axios.put(
          `${baseUrl}/divisions/update/${initialData.id}`,
          values,
          {
            withCredentials: true,
          }
        );
      } else {
        await axios.post(`${baseUrl}/divisions/add`, values, {
          withCredentials: true,
        });
      }

      toast.success(`Division ${isEdit ? "updated" : "created"} successfully`);
      router.push("/dashboard/divisions");
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
            href="/dashboard/divisions"
            className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center"
          >
            <ArrowLeft size={25} />
          </Link>
          <Heading
            title={isEdit ? "Update Division" : "Add Division"}
            description={
              isEdit
                ? "Update division details"
                : "Add a new division for your company"
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
                name="name"
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
                name="isActive"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Active</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={loading}
                        />
                        <span>{field.value ? "Active" : "Inactive"}</span>
                      </div>
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
