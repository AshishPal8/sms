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
import { ITicketById, ITicketItem } from "@/types/ticket.types";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const createTicketItemSchema = z.object({
  ticketId: z.string().min(1, "Ticket ID is required"),

  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),

  assignedToAdminId: z.string().optional(),
  assignedToCustomerId: z.string().optional(),

  divisionId: z.string().nullable().optional(),

  assets: z
    .array(
      z.object({
        url: z.url("Invalid asset URL"),
      })
    )
    .optional(),
});

type CreateTicketItemFormValues = z.infer<typeof createTicketItemSchema>;

const TicketDetailForm = ({
  ticket,
  onItemCreated,
}: {
  ticket: ITicketById;
  onItemCreated: () => void;
}) => {
  const [divisions, setDivisions] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [departmentsByDivision, setDepartmentsByDivision] = useState<any[]>([]);
  const [selectedDepartmentManagers, setSelectedDepartmentManagers] = useState<
    IEmployee[]
  >([]);
  const [techniciansUnderManager, setTechniciansUnderManager] = useState<
    IEmployee[]
  >([]);
  const [selectedDeptId, setSelectedDeptId] = useState<string | "">("");
  const [fetchingDivisions, setFetchingDivisions] = useState(false);

  const [loading, setLoading] = useState(false);
  const [assignTo, setAssignTo] = useState<
    "CUSTOMER" | "DIVISION" | "TECHNICIAN" | ""
  >("");

  const { user } = useAuthStore();

  const form = useForm<CreateTicketItemFormValues>({
    resolver: zodResolver(createTicketItemSchema),
    defaultValues: {
      ticketId: ticket.id,
      title: "",
      description: "",
      assignedToAdminId: "",
      assignedToCustomerId: "",
      divisionId: null,
      assets: [],
    },
  });

  const divisionSelected = useWatch({
    control: form.control,
    name: "divisionId",
  });
  const managerSelected = useWatch({
    control: form.control,
    name: "assignedToAdminId",
  });

  useEffect(() => {
    const fetchDivisions = async () => {
      setFetchingDivisions(true);
      if (user?.role === roles.SUPERADMIN || user?.role === roles.ASSISTANT) {
        try {
          const res = await axios.get(`${baseUrl}/divisions/active`, {
            withCredentials: true,
          });
          setDivisions(res.data?.data ?? []);
        } catch (err) {
          console.error("Failed to fetch divisions", err);
          toast.error("Failed to load divisions");
        } finally {
          setFetchingDivisions(false);
        }
      }
    };
    fetchDivisions();
  }, [user?.role]);

  useEffect(() => {
    if (!divisionSelected) {
      setDepartmentsByDivision([]);
      setSelectedDeptId("");
      setSelectedDepartmentManagers([]);
      form.setValue("assignedToAdminId", ""); // clear manager selection
      return;
    }

    let mounted = true;
    const fetchDepartmentsForDivision = async () => {
      setFetchingDivisions(true); // reuse your existing flag or create a new one
      try {
        const res = await axios.get(
          `${baseUrl}/divisions/dept/${encodeURIComponent(divisionSelected)}`,
          { withCredentials: true }
        );
        const payload = res?.data?.data ?? null;
        if (!payload) {
          setDepartmentsByDivision([]);
          return;
        }
        if (mounted) {
          // payload.departments is expected to contain managers[]
          setDepartmentsByDivision(payload.departments ?? []);
          // clear lower-level selections
          setSelectedDeptId("");
          setSelectedDepartmentManagers([]);
          form.setValue("assignedToAdminId", "");
        }
      } catch (err) {
        console.error("Failed to fetch departments for division", err);
        toast.error("Failed to load departments");
        if (mounted) {
          setDepartmentsByDivision([]);
        }
      } finally {
        setFetchingDivisions(false);
      }
    };

    fetchDepartmentsForDivision();

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [divisionSelected]);

  useEffect(() => {
    if (!selectedDeptId) {
      setSelectedDepartmentManagers([]);
      form.setValue("assignedToAdminId", "");
      return;
    }

    const dept = departmentsByDivision.find(
      (d: any) => d.id === selectedDeptId
    );
    const mgrs = dept?.managers ?? [];
    setSelectedDepartmentManagers(mgrs);
    form.setValue("assignedToAdminId", ""); // reset manager pick
  }, [selectedDeptId, departmentsByDivision, form]);

  useEffect(() => {
    // if (!managerSelected) {
    //   setTechniciansUnderManager([]);
    //   return;
    // }

    let mounted = true;
    const fetchTechs = async () => {
      if (user?.role === roles.MANAGER) {
        try {
          const res = await axios.get(
            `${baseUrl}/employees?managerId=${encodeURIComponent(
              user?.id ?? ""
            )}&role=TECHNICIAN`,
            { withCredentials: true }
          );
          const payload = res?.data?.data ?? res?.data ?? [];
          if (mounted) setTechniciansUnderManager(payload);
        } catch (err) {
          console.error("Failed to fetch technicians for manager", err);
          if (mounted) setTechniciansUnderManager([]);
        }
      }
    };

    fetchTechs();

    return () => {
      mounted = false;
    };
  }, [user?.id]);

  useEffect(() => {
    if (assignTo === "CUSTOMER") {
      form.setValue("assignedToCustomerId", ticket.customer.id);
      form.setValue("assignedToAdminId", "");
      form.setValue("divisionId", null);
      setSelectedDeptId("");
    } else if (assignTo === "DIVISION") {
      // reset customer/admin picks and keep division flow
      form.setValue("assignedToCustomerId", "");
      form.setValue("assignedToAdminId", "");
      form.setValue("divisionId", null);
      setSelectedDeptId("");
    } else if (assignTo === "TECHNICIAN") {
      // manager -> choose tech, reset other picks
      form.setValue("assignedToCustomerId", "");
      form.setValue("assignedToAdminId", "");
      form.setValue("divisionId", null);
      setSelectedDeptId("");
    } else {
      // none selected
      form.setValue("assignedToCustomerId", "");
      form.setValue("assignedToAdminId", "");
      form.setValue("divisionId", null);
      setSelectedDeptId("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assignTo]);

  const onSubmit = async (values: CreateTicketItemFormValues) => {
    try {
      setLoading(true);
      const res = await axios.post(`${baseUrl}/tickets/item/create`, values, {
        withCredentials: true,
      });

      const newItem: ITicketItem = res.data?.data;

      if (newItem) {
        onItemCreated();
        form.reset();
        toast.success("Ticket item created successfully");
      }
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
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Enter subject"
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
                          value as "CUSTOMER" | "DIVISION" | "TECHNICIAN"
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
                          <SelectItem value="DIVISION">Division</SelectItem>
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
                        Assign to{" "}
                        <strong>{`${ticket.customer.firstname} ${ticket.customer.lastname}`}</strong>
                      </Label>
                    </div>
                  )}

                  {/* show division -> department -> manager chain only when Division flow is selected */}
                  {assignTo === "DIVISION" && (
                    <>
                      <FormField
                        control={form.control}
                        name="divisionId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Division</FormLabel>
                            <FormControl>
                              <Select
                                value={field.value ?? ""}
                                onValueChange={(v) => {
                                  field.onChange(v || null);
                                  // clear dept & manager when division changes
                                  setSelectedDeptId("");
                                  form.setValue("assignedToAdminId", "");
                                }}
                                disabled={fetchingDivisions}
                              >
                                <SelectTrigger>
                                  <SelectValue
                                    placeholder={
                                      fetchingDivisions
                                        ? "Loading..."
                                        : "Select division"
                                    }
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  {divisions.map((d) => (
                                    <SelectItem key={d.id} value={d.id}>
                                      {d.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      {/* show departments only after a division selected */}
                      {divisionSelected && (
                        <FormItem>
                          <FormLabel>Department</FormLabel>
                          <FormControl>
                            <Select
                              value={selectedDeptId ?? ""}
                              onValueChange={(v) => {
                                setSelectedDeptId(v || "");
                                form.setValue("assignedToAdminId", "");
                              }}
                              disabled={!departmentsByDivision.length}
                            >
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={
                                    departmentsByDivision.length
                                      ? "Select department"
                                      : "No departments"
                                  }
                                />
                              </SelectTrigger>
                              <SelectContent>
                                {departmentsByDivision.map((dept: any) => (
                                  <SelectItem key={dept.id} value={dept.id}>
                                    {dept.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                        </FormItem>
                      )}

                      {/* manager list for selected department */}
                      {selectedDeptId && (
                        <FormField
                          control={form.control}
                          name="assignedToAdminId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Manager</FormLabel>
                              <FormControl>
                                <Select
                                  value={field.value ?? ""}
                                  onValueChange={(v) => field.onChange(v || "")}
                                  disabled={!selectedDepartmentManagers.length}
                                >
                                  <SelectTrigger>
                                    <SelectValue
                                      placeholder={
                                        selectedDepartmentManagers.length
                                          ? "Select manager"
                                          : "No managers"
                                      }
                                    />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {selectedDepartmentManagers.map(
                                      (mgr: any) => (
                                        <SelectItem key={mgr.id} value={mgr.id}>
                                          <div className="flex items-center gap-2">
                                            <Avatar className="w-8 h-8">
                                              <AvatarImage
                                                src={
                                                  `${mgr.profilePicture}` ||
                                                  "/default.webp"
                                                }
                                                alt={`${mgr.firstname} ${mgr.lastname}`}
                                              />
                                              <AvatarFallback className="text-xs">
                                                {mgr.firstname?.[0] ?? "M"}
                                              </AvatarFallback>
                                            </Avatar>
                                            <div>
                                              <h2 className="text-sm">
                                                {`${mgr.firstname} ${mgr.lastname}`}
                                              </h2>
                                              <p className="text-gray-600 capitalize text-xs">
                                                {mgr.role
                                                  ? mgr.role
                                                      .charAt(0)
                                                      .toUpperCase() +
                                                    mgr.role
                                                      .slice(1)
                                                      .toLowerCase()
                                                  : ""}
                                              </p>
                                            </div>
                                          </div>
                                        </SelectItem>
                                      )
                                    )}
                                  </SelectContent>
                                </Select>
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      )}
                    </>
                  )}

                  {/* manager -> technician path (for managers assigning to their techs) */}
                  {assignTo === "TECHNICIAN" && (
                    <FormField
                      control={form.control}
                      name="assignedToAdminId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Technician</FormLabel>
                          <FormControl>
                            <Select
                              value={field.value ?? ""}
                              onValueChange={(v) => field.onChange(v || "")}
                              disabled={!techniciansUnderManager.length}
                            >
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={
                                    techniciansUnderManager.length
                                      ? "Select technician"
                                      : "No technicians"
                                  }
                                />
                              </SelectTrigger>
                              <SelectContent>
                                {techniciansUnderManager.map((t: any) => (
                                  <SelectItem key={t.id} value={t.id}>
                                    {t.firstname} {t.lastname}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
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
