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
import { baseUrl } from "@/config";
import Link from "next/link";
import { ArrowLeft, Trash } from "lucide-react";
import { IEmployee } from "@/types/employee.types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MultiSelect } from "@/components/ui/multi-select";

const formSchema = z.object({
  name: z.string(),
  adminId: z.string(),
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

  console.log(initialData);

  const [loading, setLoading] = useState(false);
  const [managers, setManagers] = useState<IEmployee[]>([]);
  const [technicians, setTechnicians] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const [managersRes, techniciansRes] = await Promise.all([
          axios.get(`${baseUrl}/employees?role=MANAGER`, {
            withCredentials: true,
          }),
          axios.get(`${baseUrl}/employees?role=TECHNICIAN`, {
            withCredentials: true,
          }),
        ]);

        setManagers(managersRes.data.data);

        const mappedTechnicians = techniciansRes.data.data.map(
          (tech: IEmployee) => ({
            value: tech.id,
            label: tech.name,
          })
        );

        setTechnicians(mappedTechnicians);
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
      adminId: "",
      technicians: [],
      isActive: true,
    },
  });

  console.log("Initial form values:", form.getValues());

  useEffect(() => {
    if (initialData) {
      form.reset({
        ...initialData,
        technicians: initialData.technicians?.map((tech) => tech.id) || [],
      });
    }
  }, [initialData, form]);

  const isEdit = !!initialData;

  const onSubmit = async (values: DepartmentFormValues) => {
    console.log("submitting...");
    try {
      setLoading(true);

      const payload = {
        ...values,
        adminId:
          !values.adminId || values.adminId === "none" ? null : values.adminId,
        technicians: values.technicians,
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
      router.push("/dashboard/departments");
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
            href="/dashboard/departments"
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
              <div className="grid grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="adminId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Manager</FormLabel>
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
                          {managers.map((manager) => (
                            <SelectItem key={manager.id} value={manager.id}>
                              <div className="flex items-center gap-2">
                                <Avatar className="w-8 h-8">
                                  <AvatarImage
                                    src={
                                      `${manager.profilePicture}?tr=w-32,h-32` ||
                                      "/default.webp"
                                    }
                                    alt={manager.name}
                                    className="object-cover"
                                  />
                                  <AvatarFallback className="text-xs">
                                    {manager.name[0] || "T"}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <h2 className="text-black font-semibold text-sm">
                                    {manager.name}
                                  </h2>
                                  <p className="text-gray-600 capitalize text-xs">
                                    {manager.role
                                      ? manager.role.charAt(0).toUpperCase() +
                                        manager.role.slice(1).toLowerCase()
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
                  name="technicians"
                  render={({ field }) => (
                    <FormItem className="col-span-3">
                      <FormLabel>Technicians</FormLabel>
                      <FormControl>
                        <MultiSelect
                          options={technicians}
                          value={field.value || []}
                          onValueChange={field.onChange}
                          defaultValue={field.value || []}
                          placeholder="Select Technicians"
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
