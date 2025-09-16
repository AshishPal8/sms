"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
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
import { IEmployee } from "@/types/employee.types";
import { MultiSelect } from "@/components/ui/multi-select";
import { alphaNumbericRegex } from "@/lib/regex";

const formSchema = z.object({
  name: z
    .string()
    .min(2, { error: "Name must be at least 2 characters" })
    .max(30, { error: "Name cannot exceed 30 characters" })
    .regex(alphaNumbericRegex, {
      error: "Only letters, numbers, and spaces are allowed",
    }),
  managers: z.array(z.string()).optional(),
  technicians: z.array(z.string()).optional(),
  isActive: z.boolean(),
});

type DepartmentFormValues = z.infer<typeof formSchema>;

interface DepartmentFormProps {
  initialData?: DepartmentFormValues & {
    id?: string;
  };
}

export const DepartmentForm = ({ initialData }: DepartmentFormProps) => {
  const router = useRouter();
  const { divId } = useParams();

  console.log("initial data", initialData);

  const [loading, setLoading] = useState(false);
  const [managers, setManagers] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const managersRes = await axios.get(
          `${baseUrl}/employees?role=MANAGER`,
          {
            withCredentials: true,
          }
        );

        const mappedManagers = managersRes.data.data.map((m: IEmployee) => ({
          value: m.id,
          label: `${m.firstname} ${m.lastname}`,
        }));

        setManagers(mappedManagers);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, [initialData]);

  const form = useForm<DepartmentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      managers: [],
      isActive: true,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        ...initialData,
        managers: initialData.managers?.map((manager) => manager.id) || [],
      });
    }
  }, [initialData, form]);

  const isEdit = !!initialData;

  const onSubmit = async (values: DepartmentFormValues) => {
    try {
      setLoading(true);

      const payload = {
        ...values,
        managers: values.managers,
      };

      if (isEdit) {
        await axios.put(
          `${baseUrl}/departments/update/${initialData.id}`,
          payload,
          {
            withCredentials: true,
          }
        );
      } else {
        await axios.post(`${baseUrl}/departments/add/${divId}`, payload, {
          withCredentials: true,
        });
      }

      toast.success(
        `Department ${isEdit ? "updated" : "created"} successfully`
      );
      router.push(`/dashboard/divisions/${divId}/departments`);
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
            href={`/dashboard/divisions/${divId}/departments`}
            className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center"
          >
            <ArrowLeft size={25} />
          </Link>
          <Heading
            title={isEdit ? "Update Department" : "Add Department"}
            description={
              isEdit
                ? "Update department details"
                : "Add a new department for your company"
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
                        maxLength={30}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="managers"
                  render={({ field }) => (
                    <FormItem className="col-span-3">
                      <FormLabel>Managers</FormLabel>
                      <FormControl>
                        <MultiSelect
                          options={managers}
                          value={field.value || []}
                          onValueChange={field.onChange}
                          defaultValue={field.value || []}
                          placeholder="Select managers"
                          maxCount={50}
                          className=""
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
