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
import { baseUrl } from "../../../config";
import Link from "next/link";
import { ArrowLeft, Trash } from "lucide-react";
import { IEmployee } from "@/types/employee.types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const formSchema = z.object({
  name: z.string(),
  adminId: z.string(),
  technicians: z.array(z.string()).optional(),
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
  const [managers, setManagers] = useState<IEmployee[]>([]);
  const [technicians, setTechnicians] = useState<IEmployee[]>([]);
  const [selectedTechnicians, setSelectedTechnicians] = useState<IEmployee[]>(
    []
  );

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
        setTechnicians(techniciansRes.data.data);

        if (initialData?.technicians) {
          const selected = techniciansRes.data.data.filter((tech: IEmployee) =>
            initialData.technicians?.includes(tech.id)
          );
          setSelectedTechnicians(selected);
        }
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

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);

      if (initialData?.technicians && technicians.length > 0) {
        const technicianIds = initialData.technicians.map((t: any) => t.id);
        const selected = technicians.filter((tech: IEmployee) =>
          technicianIds.includes(tech.id)
        );
        setSelectedTechnicians(selected);
      } else {
        setSelectedTechnicians([]);
      }
    }
  }, [initialData, form, technicians]);

  const isEdit = !!initialData;

  const handleTechnicianSelect = (techId: string) => {
    if (!techId) return;
    const tech = technicians.find((t) => t.id === techId);
    if (tech && !selectedTechnicians.some((t) => t.id === tech.id)) {
      setSelectedTechnicians((prev) => [...prev, tech]);
    }
  };

  const removeTechnician = (id: string) => {
    setSelectedTechnicians((prev) => prev.filter((t) => t.id !== id));
  };

  const onSubmit = async (values: DepartmentFormValues) => {
    try {
      setLoading(true);

      const payload = {
        ...values,
        adminId:
          !values.adminId || values.adminId === "none" ? null : values.adminId,
        technicians: selectedTechnicians.map((t) => t.id),
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
              <div className="grid grid-cols-2">
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
                <div>
                  <FormLabel>Technicians</FormLabel>

                  <div className="my-3">
                    {selectedTechnicians.length > 0 ? (
                      <div className="grid grid-cols-2">
                        {selectedTechnicians.map((tech) => (
                          <div
                            key={tech.id}
                            className="flex items-center gap-2 border border-gray-200 w-fit p-2 rounded-lg"
                          >
                            <Avatar className="w-8 h-8">
                              <AvatarImage
                                src={
                                  `${tech.profilePicture}?tr=w-32,h-32` ||
                                  "/default.webp"
                                }
                                alt={tech.name}
                                className="object-cover"
                              />
                              <AvatarFallback className="text-xs">
                                {tech.name[0] || "T"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h2 className="text-black font-semibold text-sm">
                                {tech.name}
                              </h2>
                              <p className="text-gray-600 capitalize text-xs">
                                {tech.role
                                  ? tech.role.charAt(0).toUpperCase() +
                                    tech.role.slice(1).toLowerCase()
                                  : ""}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeTechnician(tech.id)}
                              className="text-red-500 text-xs ml-2 cursor-pointer"
                            >
                              <Trash size={18} />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>

                  <Select
                    onValueChange={(techId) => {
                      handleTechnicianSelect(techId);
                    }}
                    disabled={loading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Technician" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {technicians.map((tech) => (
                        <SelectItem key={tech.id} value={tech.id}>
                          <div className="flex items-center gap-2">
                            <Avatar className="w-8 h-8">
                              <AvatarImage
                                src={
                                  `${tech.profilePicture}?tr=w-32,h-32` ||
                                  "/default.webp"
                                }
                                alt={tech.name}
                                className="object-cover"
                              />
                              <AvatarFallback className="text-xs">
                                {tech.name[0] || "T"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h2 className="text-black font-semibold text-sm">
                                {tech.name}
                              </h2>
                              <p className="text-gray-600 capitalize text-xs">
                                {tech.role
                                  ? tech.role.charAt(0).toUpperCase() +
                                    tech.role.slice(1).toLowerCase()
                                  : ""}
                              </p>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
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
