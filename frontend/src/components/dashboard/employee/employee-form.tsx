"use client";

import * as z from "zod";
import { useForm, useWatch } from "react-hook-form";
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
import ImageUpload from "@/components/ui/image-upload";
import Link from "next/link";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { handleApiError } from "@/lib/handleApiErrors";
import { alphaNumbericRegex } from "@/lib/regex";
import api from "@/lib/api";

const formSchema = z.object({
  firstname: z
    .string()
    .min(2, { error: "Firstname must be at least 2 characters" })
    .max(30, { error: "Firstname cannot exceed 30 characters" })
    .regex(alphaNumbericRegex, {
      error: "Only letters, numbers, and spaces are allowed",
    }),
  lastname: z
    .string()
    .max(30, { error: "Lastname cannot exceed 30 characters" })
    .regex(alphaNumbericRegex, {
      error: "Only letters, numbers, and spaces are allowed",
    })
    .optional()
    .refine((val) => !val || val.length >= 2, {
      error: "Lastname must be at least 2 characters if provided",
    }),
  email: z.string(),
  phone: z.string().optional(),
  password: z
    .string()
    .min(6, { error: "Password must be at least 6 charactors" })
    .optional()
    .or(z.literal("")),
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

  const [divisions, setDivisions] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [managers, setManagers] = useState<any[]>([]);
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

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

  const selectedDivisionId = useWatch({
    control: form.control,
    name: "divisionId",
  });
  const selectedDepartmentId = useWatch({
    control: form.control,
    name: "departmentId",
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        ...initialData,
      });
    }
  }, [initialData, form]);

  const isEdit = !!initialData;

  useEffect(() => {
    const fetchDivisions = async () => {
      try {
        const res = await api.get(`/divisions/active`);
        setDivisions(res.data?.data ?? []);
      } catch (err) {
        console.error("Failed to fetch divisions", err);
        toast.error("Failed to load divisions");
      }
    };
    fetchDivisions();
  }, []);

  // fetch departments when division changes
  useEffect(() => {
    if (!selectedDivisionId) {
      setDepartments([]);
      form.setValue("departmentId", null);
      return;
    }
    const fetchDepartments = async () => {
      try {
        const res = await api.get(`/divisions/dept/${selectedDivisionId}`);
        setDepartments(res.data?.data?.departments ?? []);
      } catch (err) {
        console.error("Failed to fetch departments", err);
        toast.error("Failed to load departments");
      }
    };
    fetchDepartments();
  }, [selectedDivisionId]);

  useEffect(() => {
    if (!selectedDepartmentId) {
      setManagers([]);
      form.setValue("managerId", null);
      return;
    }
    const dept = departments.find((d) => d.id === selectedDepartmentId);
    setManagers(dept?.managers ?? []);
  }, [selectedDepartmentId, departments]);

  const onSubmit = async (values: EmployeeFormValues) => {
    try {
      setLoading(true);

      const payload = {
        ...values,
        departmentId: values.departmentId ?? null,
        managerId: values.managerId ?? null,
      };

      if (isEdit) {
        await api.put(`/employees/update/${initialData.id}`, payload);
      } else {
        await api.post(`/employees/add`, payload);
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
                          maxLength={30}
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
                          maxLength={30}
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
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "");
                            field.onChange(value);
                          }}
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={10}
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
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder={
                              isEdit
                                ? "Leave blank to keep current password"
                                : "Enter a password"
                            }
                            autoComplete="new-password"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                          >
                            {showPassword ? (
                              <EyeOff size={18} />
                            ) : (
                              <Eye size={18} />
                            )}
                          </button>
                        </div>
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
              <div className="grid grid-cols-2 gap-4">
                {(form.watch("role") === "MANAGER" ||
                  form.watch("role") === "TECHNICIAN") && (
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
                              // clear downstream selections
                              form.setValue("departmentId", null);
                              form.setValue("managerId", null);
                            }}
                            disabled={loading}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={"Select division"} />
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
                )}
                {selectedDivisionId &&
                  (form.getValues("role") === "MANAGER" ||
                    form.getValues("role") === "TECHNICIAN") && (
                    <FormField
                      control={form.control}
                      name="departmentId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Department</FormLabel>
                          <FormControl>
                            <Select
                              value={field.value ?? ""}
                              onValueChange={(v) => {
                                field.onChange(v || null);
                                // clearing manager handled by department watch effect
                              }}
                              disabled={loading}
                            >
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={
                                    departments.length
                                      ? "Select department"
                                      : "No departments"
                                  }
                                />
                              </SelectTrigger>
                              <SelectContent>
                                {departments.map((dep: any) => (
                                  <SelectItem key={dep.id} value={dep.id}>
                                    {dep.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                {/* Manager (managers of selected department) */}
                {selectedDepartmentId &&
                  form.getValues("role") === "TECHNICIAN" && (
                    <FormField
                      control={form.control}
                      name="managerId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Manager</FormLabel>
                          <FormControl>
                            <Select
                              value={field.value ?? ""}
                              onValueChange={(v) => field.onChange(v || null)}
                              disabled={loading || managers.length === 0}
                            >
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={
                                    managers.length
                                      ? "Select manager"
                                      : "No managers"
                                  }
                                />
                              </SelectTrigger>
                              <SelectContent>
                                {managers.length > 0 ? (
                                  managers.map((mgr: any) => (
                                    <SelectItem key={mgr.id} value={mgr.id}>
                                      {`${mgr.firstname ?? mgr.name ?? ""} ${
                                        mgr.lastname ?? ""
                                      }`.trim()}
                                    </SelectItem>
                                  ))
                                ) : (
                                  <SelectItem value="no-managers" disabled>
                                    No managers
                                  </SelectItem>
                                )}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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
