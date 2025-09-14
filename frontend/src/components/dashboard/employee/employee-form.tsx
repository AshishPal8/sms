"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useEffect, useMemo, useRef, useState } from "react";
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
import ImageUpload from "@/components/ui/image-upload";
import axios from "axios";
import { baseUrl } from "../../../config";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { handleApiError } from "@/lib/handleApiErrors";

const formSchema = z.object({
  firstname: z.string().min(2, { error: "Firstname is required" }),
  lastname: z.string().optional(),
  email: z.string(),
  phone: z.string().optional(),
  password: z.string().min(6).optional(),
  role: z.enum(["SUPERADMIN", "TECHNICIAN", "MANAGER", "ASSISTANT"]),
  profilePicture: z.string().optional(),
  isActive: z.boolean(),
  divisionId: z.string().nullable().optional(),
  departmentId: z.string().nullable().optional(),
  managerId: z.string().nullable().optional(),
});

type EmployeeFormValues = z.infer<typeof formSchema>;

interface EmployeeFormProps {
  initialData?: EmployeeFormValues & { id?: string };
}

export const EmployeeForm = ({ initialData }: EmployeeFormProps) => {
  const router = useRouter();
  const initialManagerRef = useRef<string | null>(null);

  const [divisions, setDivisions] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [fetchingDivisions, setFetchingDivisions] = useState(false);

  const [departmentsResponse, setDepartmentsResponse] = useState<any | null>(
    null
  );
  const [fetchingDepartments, setFetchingDepartments] = useState(false);

  const [loading, setLoading] = useState(false);
  const [initialDataApplied, setInitialDataApplied] = useState(false);

  const { setError } = useForm<EmployeeFormValues>();

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      firstname: "",
      lastname: "",
      email: "",
      phone: "",
      password: "",
      role: "TECHNICIAN",
      profilePicture: "",
      isActive: true,
      divisionId: null,
      departmentId: null,
      managerId: null,
    },
  });

  const selectedRole = form.watch("role");
  const selectedDivisionId = form.watch("divisionId");
  const selectedDepartmentId = form.watch("departmentId");

  useEffect(() => {
    if (initialData) {
      form.reset({
        ...initialData,
        password: "",
      });
      setInitialDataApplied(false); // Reset the flag when new initial data comes
    }
  }, [initialData, form]);

  const isEdit = !!initialData;

  // Fetch divisions on component mount
  useEffect(() => {
    const fetchDivisions = async () => {
      setFetchingDivisions(true);
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
    };

    fetchDivisions();
  }, []);

  // Set initial division when divisions are loaded (for edit mode)
  useEffect(() => {
    if (
      !isEdit ||
      !initialData?.divisionId ||
      !divisions.length ||
      initialDataApplied
    ) {
      return;
    }

    const exists = divisions.some((d) => d.id === initialData.divisionId);
    if (exists && form.getValues("divisionId") !== initialData.divisionId) {
      form.setValue("divisionId", initialData.divisionId);
    }
  }, [divisions, isEdit, initialData?.divisionId, initialDataApplied, form]);

  // Fetch departments when division changes
  useEffect(() => {
    if (!selectedDivisionId) {
      setDepartmentsResponse(null);
      form.setValue("departmentId", null);
      form.setValue("managerId", null);
      return;
    }

    const fetchDepartments = async () => {
      setFetchingDepartments(true);
      try {
        const res = await axios.get(
          `${baseUrl}/divisions/dept/${encodeURIComponent(selectedDivisionId)}`,
          { withCredentials: true }
        );
        const data = res.data?.data ?? null;
        setDepartmentsResponse(data);
      } catch (err) {
        console.error("Failed to fetch departments for division", err);
        toast.error("Failed to load departments for selected division");
        setDepartmentsResponse(null);
      } finally {
        setFetchingDepartments(false);
      }
    };

    fetchDepartments();
  }, [selectedDivisionId, form]);

  // Apply initial department and manager after departments are loaded
  useEffect(() => {
    if (
      !isEdit ||
      !initialData ||
      initialDataApplied ||
      !departmentsResponse?.departments
    ) {
      return;
    }

    const initialDepartmentExists = departmentsResponse.departments.some(
      (d: any) => d.id === initialData.departmentId
    );

    if (initialData.departmentId && initialDepartmentExists) {
      // set the department first
      form.setValue("departmentId", initialData.departmentId);

      // only remember manager to apply later if role is TECHNICIAN
      if (
        initialData.managerId &&
        (initialData.role === "TECHNICIAN" ||
          form.getValues("role") === "TECHNICIAN")
      ) {
        // store in ref — we'll apply when selectedDepartmentId updates
        initialManagerRef.current = initialData.managerId;
      } else {
        // nothing to apply, mark applied now
        setInitialDataApplied(true);
      }
    } else {
      // no initial department to apply -> mark applied to avoid re-run
      setInitialDataApplied(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [departmentsResponse, isEdit, initialData]);

  // --- watch selectedDepartmentId and apply manager if we have one waiting
  useEffect(() => {
    if (!initialManagerRef.current) return;

    // ensure selectedDepartmentId matches the initialData's department (safety)
    if (selectedDepartmentId === initialData?.departmentId) {
      // optionally check manager exists in the department's managers
      const dept = (departmentsResponse?.departments ?? []).find(
        (d: any) => d.id === selectedDepartmentId
      );
      const managerExists = dept?.managers?.some(
        (m: any) => m.id === initialManagerRef.current
      );

      if (managerExists) {
        form.setValue("managerId", initialManagerRef.current);
      } else {
        // if manager not found, we don't set it
        console.warn("initial manager id not found in department managers");
      }

      // clear the ref and mark applied
      initialManagerRef.current = null;
      setInitialDataApplied(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDepartmentId]);

  // Handle department changes (clear manager when department changes, except for initial load)
  useEffect(() => {
    if (!initialDataApplied) {
      return; // Don't clear during initial data application
    }

    if (!selectedDepartmentId) {
      form.setValue("managerId", null);
      return;
    }

    // Clear manager when department changes (user-driven change)
    form.setValue("managerId", null);
  }, [selectedDepartmentId, initialDataApplied, form]);

  const departmentOptions = useMemo(() => {
    return departmentsResponse?.departments ?? [];
  }, [departmentsResponse]);

  const managerOptions = useMemo(() => {
    if (!selectedDepartmentId) return [];
    const dept = departmentOptions.find(
      (d: any) => d.id === selectedDepartmentId
    );
    return dept?.managers ?? [];
  }, [departmentOptions, selectedDepartmentId]);

  const onSubmit = async (values: EmployeeFormValues) => {
    try {
      setLoading(true);

      const payload = {
        ...values,
        departmentId: values.departmentId ?? null,
        managerId: values.managerId ?? null,
      };

      if (isEdit) {
        await axios.put(
          `${baseUrl}/employees/update/${initialData.id}`,
          payload,

          {
            withCredentials: true,
          }
        );
      } else {
        await axios.post(`${baseUrl}/employees/add`, payload, {
          withCredentials: true,
        });
      }

      toast.success(`Employee ${isEdit ? "updated" : "created"} successfully`);
      router.push("/dashboard/employees");
    } catch (error: unknown) {
      handleApiError<EmployeeFormValues>(error, setError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center mb-2 gap-4">
          <Link
            href="/dashboard/employees"
            className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center"
          >
            <ArrowLeft size={25} />
          </Link>
          <Heading
            title={isEdit ? "Update Employee" : "Add Employee"}
            description={
              isEdit
                ? "Update employee details"
                : "Add a new employee for your company"
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
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="Enter first name"
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
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="Enter last name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder={
                            isEdit
                              ? "Leave blank to keep current password"
                              : "Enter a password"
                          }
                          autoComplete={
                            isEdit ? "new-password" : "new-password"
                          }
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select
                        disabled={loading}
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="SUPERADMIN">
                            Super admin
                          </SelectItem>
                          <SelectItem value="MANAGER">Manager</SelectItem>
                          <SelectItem value="TECHNICIAN">Technician</SelectItem>
                          <SelectItem value="ASSISTANT">Assistant</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2">
                {(selectedRole === "MANAGER" ||
                  selectedRole === "TECHNICIAN") && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* division select */}
                    <FormField
                      control={form.control}
                      name="divisionId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Division</FormLabel>
                          <FormControl>
                            <Select
                              value={field.value ?? ""}
                              onValueChange={(val) =>
                                field.onChange(val || null)
                              }
                              disabled={loading || fetchingDivisions}
                            >
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={
                                    fetchingDivisions
                                      ? "Loading divisions..."
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
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* department select */}
                    <FormField
                      control={form.control}
                      name="departmentId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Department</FormLabel>
                          <FormControl>
                            <Select
                              value={field.value ?? ""}
                              onValueChange={(val) =>
                                field.onChange(val || null)
                              }
                              disabled={
                                loading ||
                                !selectedDivisionId ||
                                fetchingDepartments
                              }
                            >
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={
                                    !selectedDivisionId
                                      ? "Choose division first"
                                      : fetchingDepartments
                                      ? "Loading departments..."
                                      : "Select department"
                                  }
                                />
                              </SelectTrigger>
                              <SelectContent>
                                {departmentOptions.length === 0 ? (
                                  <SelectItem value="no">
                                    No departments
                                  </SelectItem>
                                ) : (
                                  departmentOptions.map((dep: any) => (
                                    <SelectItem key={dep.id} value={dep.id}>
                                      {dep.name}
                                    </SelectItem>
                                  ))
                                )}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {selectedRole === "TECHNICIAN" && (
                  <>
                    {/* manager select - managers of selected department */}
                    <FormField
                      control={form.control}
                      name="managerId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Manager</FormLabel>
                          <FormControl>
                            <Select
                              value={field.value ?? ""}
                              onValueChange={(val) =>
                                field.onChange(val || null)
                              }
                              disabled={loading || !selectedDepartmentId}
                            >
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={
                                    !selectedDepartmentId
                                      ? "Choose department first"
                                      : "Select manager"
                                  }
                                />
                              </SelectTrigger>
                              <SelectContent>
                                {managerOptions.length === 0 ? (
                                  <SelectItem value="no">
                                    No managers
                                  </SelectItem>
                                ) : (
                                  managerOptions.map((mgr: any) => (
                                    <SelectItem key={mgr.id} value={mgr.id}>
                                      {mgr.name}
                                    </SelectItem>
                                  ))
                                )}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
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
