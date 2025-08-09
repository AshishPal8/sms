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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { baseUrl } from "../../../../config";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { IEmployee } from "@/types/employee.types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const formSchema = z.object({
  name: z.string(),
  adminId: z.string(),
  isActive: z.boolean(),
});

type DepartmentFormValues = z.infer<typeof formSchema>;

interface DepartmentFormProps {
  initialData?: DepartmentFormValues & { id?: string };
}

export const DepartmentForm = ({ initialData }: DepartmentFormProps) => {
  const router = useRouter();

  console.log("initial Data", initialData);

  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState<IEmployee[]>([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get(`${baseUrl}/employees`, {
          withCredentials: true,
        });

        const { data } = await res.data;
        setEmployees(data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, []);

  const form = useForm<DepartmentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      adminId: "",
      isActive: true,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  const isEdit = !!initialData;

  const onSubmit = async (values: DepartmentFormValues) => {
    try {
      setLoading(true);

      const payload = {
        ...values,
        adminId:
          !values.adminId || values.adminId === "none" ? null : values.adminId,
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
        await axios.post(`${baseUrl}/departments/add`, payload, {
          withCredentials: true,
        });
      }

      toast.success(
        `Department ${isEdit ? "updated" : "created"} successfully`
      );
      router.push("/dashboard/superadmin/departments");
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
            href="/dashboard/superadmin/departments"
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
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="adminId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employee</FormLabel>
                    <Select
                      disabled={loading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Employee" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem
                          value="none"
                          className="text-black font-semibold text-[12px]"
                        >
                          None
                        </SelectItem>
                        {employees.map((employee) => (
                          <SelectItem key={employee.id} value={employee.id}>
                            <div className="rounded-xl flex items-center justify-center gap-2 cursor-pointer">
                              <Avatar className="w-8 h-8">
                                <AvatarImage
                                  src={
                                    employee.profilePicture || "/default.webp"
                                  }
                                  alt=""
                                />
                                <AvatarFallback className="text-xs">
                                  {employee.name[0] || "E"}
                                </AvatarFallback>
                              </Avatar>
                              <div className="hidden md:block">
                                <h2 className="text-black font-semibold text-[12px]">
                                  {employee.name}
                                </h2>
                                <p className="text-gray-600 capitalize text-[10px] font-medium">
                                  {employee.role
                                    ? employee.role.charAt(0).toUpperCase() +
                                      employee.role.slice(1).toLowerCase()
                                    : ""}
                                </p>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
