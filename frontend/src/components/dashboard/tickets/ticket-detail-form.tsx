"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import ImageUpload from "@/components/ui/image-upload";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { baseUrl } from "@/config";
import { roles } from "@/lib/utils";
import useAuthStore from "@/store/user";
import { IEmployee } from "@/types/employee.types";
import { ITicketById } from "@/types/ticket.types";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const createTicketItemSchema = z.object({
  ticketId: z.string().min(1, "Ticket ID is required"),

  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),

  assignedToAdminId: z.string().optional(),
  assignedToDeptId: z.string().optional(),
  assignedToCustomerId: z.string().optional(),

  assets: z
    .array(
      z.object({
        url: z.url("Invalid asset URL"),
      })
    )
    .optional(),
});

type CreateTicketItemFormValues = z.infer<typeof createTicketItemSchema>;

const TicketDetailForm = ({ ticket }: { ticket: ITicketById }) => {
  const [departments, setDepartments] = useState([]);
  const [technicians, setTechnicians] = useState<IEmployee[]>([]);
  const [loading, setLoading] = useState(false);
  const [assignTo, setAssignTo] = useState<
    "CUSTOMER" | "DEPARTMENT" | "TECHNICIAN" | ""
  >("");

  const router = useRouter();
  const { user } = useAuthStore();

  console.log("departments", departments);

  const form = useForm<CreateTicketItemFormValues>({
    resolver: zodResolver(createTicketItemSchema),
    defaultValues: {
      ticketId: ticket.id,
      title: "",
      description: "",
      assignedToAdminId: "",
      assignedToDeptId: "",
      assignedToCustomerId: "",
      assets: [],
    },
  });

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await axios.get(`${baseUrl}/departments/active`, {
          withCredentials: true,
        });

        const { data } = res.data;
        setDepartments(data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    fetchDepartments();
  }, []);

  useEffect(() => {
    const fetchTechnicians = async () => {
      if (user?.role === roles.MANAGER) {
        try {
          const res = await axios.get(
            `${baseUrl}/employees/dept/${user?.departmentId}`,
            {
              withCredentials: true,
            }
          );
          setTechnicians(res.data.data);
        } catch (error) {
          console.error("Error fetching technicians:", error);
        }
      }
    };
    fetchTechnicians();
  }, [user?.role, user?.departmentId]);

  useEffect(() => {
    if (assignTo === "CUSTOMER") {
      form.setValue("assignedToCustomerId", ticket.customer.id);
      form.setValue("assignedToDeptId", "");
      form.setValue("assignedToAdminId", "");
    } else if (assignTo === "DEPARTMENT") {
      form.setValue("assignedToCustomerId", "");
      form.setValue("assignedToAdminId", "");
    } else if (assignTo === "TECHNICIAN") {
      form.setValue("assignedToDeptId", "");
      form.setValue("assignedToCustomerId", "");
    } else {
      form.setValue("assignedToCustomerId", "");
      form.setValue("assignedToDeptId", "");
      form.setValue("assignedToAdminId", "");
    }
  }, [assignTo, form, ticket.customer.id]);

  const onSubmit = async (values: CreateTicketItemFormValues) => {
    try {
      setLoading(true);
      await axios.post(`${baseUrl}/tickets/item/create`, values, {
        withCredentials: true,
      });

      toast.success("Ticket item created successfully");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong!");
      console.error("Error creating ticket item:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-[90%] py-8 md:py-10 mx-auto">
      <Card>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 w-full mt-8"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Enter ticket title"
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
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        disabled={loading}
                        placeholder="Enter description"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {user?.role !== roles.TECHNICIAN && (
                <div className="grid grid-cols-2 gap-5">
                  <div className=" space-y-2">
                    <FormLabel>Assigned To</FormLabel>
                    <Select
                      disabled={loading}
                      value={assignTo}
                      onValueChange={(value) =>
                        setAssignTo(
                          value as "CUSTOMER" | "DEPARTMENT" | "TECHNICIAN"
                        )
                      }
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select assignment type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="CUSTOMER">Customer</SelectItem>
                        {user?.role !== "MANAGER" && (
                          <SelectItem value="DEPARTMENT">Department</SelectItem>
                        )}
                        {user?.role === "MANAGER" && (
                          <SelectItem value="TECHNICIAN">Technician</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  {assignTo === "CUSTOMER" && (
                    <div className="flex items-center gap-2 mt-6">
                      <Checkbox
                        id="customer-checkbox"
                        checked={!!form.watch("assignedToCustomerId")}
                        onCheckedChange={(checked) =>
                          form.setValue(
                            "assignedToCustomerId",
                            checked ? ticket.customer.id : ""
                          )
                        }
                      />
                      <Label htmlFor="customer-checkbox">
                        Assign to <strong>{ticket.customer.name}</strong>
                      </Label>
                    </div>
                  )}

                  {assignTo === "DEPARTMENT" && (
                    <FormField
                      control={form.control}
                      name="assignedToDeptId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Department</FormLabel>
                          <Select
                            disabled={loading}
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select department" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {departments.map((dept) => (
                                <SelectItem key={dept.id} value={dept.id}>
                                  {dept.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {assignTo === "TECHNICIAN" && user?.role === "MANAGER" && (
                    <FormField
                      control={form.control}
                      name="assignedToAdminId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Technician</FormLabel>
                          <Select
                            disabled={loading}
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select technician" />
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
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              )}
              <FormField
                control={form.control}
                name="assets"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assets</FormLabel>
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
              <Button disabled={loading} className="ml-auto" type="submit">
                Save
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </section>
  );
};

export default TicketDetailForm;
