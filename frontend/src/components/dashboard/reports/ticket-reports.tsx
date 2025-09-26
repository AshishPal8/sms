"use client";

import * as z from "zod";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useEffect, useRef, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { ArrowLeft, Printer } from "lucide-react";
import { handleApiError } from "@/lib/handleApiErrors";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import useSettingsStore from "@/store/settings";
import { format } from "date-fns";
import { priorityStyles, statusStyles, urgencyStyles } from "@/styles/color";
import { printReportAsPDF } from "@/lib/printToPdf";

const formSchema = z.object({
  divisionId: z.string().nullable().optional(),
  departmentId: z.string().nullable().optional(),
  adminId: z.string().nullable().optional(),
});

type ReportFormValues = z.infer<typeof formSchema>;

export const TicketReportsComp = () => {
  const [divisions, setDivisions] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [managers, setManagers] = useState<any[]>([]);
  const [report, setReport] = useState<any | null>(null);
  const reportRef = useRef<HTMLDivElement | null>(null);

  const [loading, setLoading] = useState(false);

  const dateFormat = useSettingsStore((state) => state.getDateFormat());

  const { setError } = useForm<ReportFormValues>();

  const form = useForm<ReportFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      divisionId: null,
      departmentId: null,
      adminId: null,
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
      form.setValue("adminId", null);
      return;
    }
    const dept = departments.find((d) => d.id === selectedDepartmentId);
    setManagers(dept?.managers ?? []);
  }, [selectedDepartmentId, departments]);

  const onSubmit = async (values: ReportFormValues) => {
    try {
      setLoading(true);

      const payload = {
        departmentId: values.departmentId ?? null,
        adminId: values.adminId ?? null,
      };

      const res = await api.get(`/tickets/report`, { params: payload });

      setReport(res.data?.data ?? null);

      toast.success(`Ticket fetched successfully successfully`);
    } catch (error: unknown) {
      handleApiError<ReportFormValues>(error, setError);
    } finally {
      setLoading(false);
    }
  };

  const DepartmentReport = ({ d }: { d: any }) => {
    if (!d) return null;

    const handlePrint = () => {
      printReportAsPDF();
    };

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">
                  Department Report ({`${d.total ?? 0} Tickets`})
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Totals & manager breakdown
                </p>
              </div>
              <div className="flex gap-2 no-print">
                <Button onClick={handlePrint} variant="outline" size="sm">
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <div className="text-sm font-medium mb-2">Status</div>
                <div className="space-y-1">
                  {Object.entries(d.byStatus || {}).map(([k, v]) => (
                    <div
                      key={k}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="capitalize">{k.replace("_", " ")}</div>
                      <div className="font-medium">{v}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-sm font-medium mb-2">Priority</div>
                <div className="space-y-1">
                  {Object.entries(d.byPriority || {}).map(([k, v]) => (
                    <div
                      key={k}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="capitalize">{k}</div>
                      <div className="font-medium">{v}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-sm font-medium mb-2">Urgency</div>
                <div className="space-y-1">
                  {Object.entries(d.byUrgency || {}).map(([k, v]) => (
                    <div
                      key={k}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="capitalize">{k}</div>
                      <div className="font-medium">{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Separator className="my-3" />

            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-medium">Managers</div>
                <div className="text-sm text-muted-foreground">
                  {(d.managers || []).length} managers
                </div>
              </div>

              <Table className="border border-gray-200 bg-white rounded-xl shadow-sm overflow-hidden">
                <TableHeader className="bg-gray-50">
                  <TableRow className="border-b border-gray-200">
                    <TableHead className="font-semibold text-sm uppercase tracking-wide text-gray-600 px-4 py-3">
                      Name
                    </TableHead>
                    <TableHead className="font-semibold text-sm uppercase tracking-wide text-gray-600 px-4 py-3">
                      Tickets Assigned
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(d.managers || []).map((m: any) => (
                    <TableRow
                      key={m.adminId}
                      className="border-b border-gray-200"
                    >
                      <TableCell className="font-semibold text-sm uppercase tracking-wide text-gray-600 px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-medium">{m.name}</div>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold text-sm uppercase tracking-wide text-gray-600 px-4 py-3">
                        {m.ticketsAssignedCount}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <Separator className="my-4" />

            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-medium">Tickets Preview</div>
                <div className="text-sm text-muted-foreground">
                  Showing {(d.ticketsPreview || []).length} items
                </div>
              </div>

              <Table className="border border-gray-200 bg-white rounded-xl shadow-sm overflow-hidden">
                <TableHeader className="bg-gray-50">
                  <TableRow className="border-b border-gray-200">
                    <TableHead className="font-semibold text-sm uppercase tracking-wide text-gray-600 px-4 py-3">
                      Title
                    </TableHead>
                    <TableHead className="font-semibold text-sm uppercase tracking-wide text-gray-600 px-4 py-3">
                      Status
                    </TableHead>
                    <TableHead className="font-semibold text-sm uppercase tracking-wide text-gray-600 px-4 py-3">
                      Priority
                    </TableHead>
                    <TableHead className="font-semibold text-sm uppercase tracking-wide text-gray-600 px-4 py-3">
                      Urgency
                    </TableHead>
                    <TableHead className="font-semibold text-sm uppercase tracking-wide text-gray-600 px-4 py-3">
                      Created
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(d.ticketsPreview || []).map((t: any) => (
                    <TableRow key={t.id} className="border-b border-gray-200">
                      <TableCell className="font-semibold text-sm uppercase tracking-wide text-gray-600 px-4 py-3">
                        {t.title}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`capitalize font-bold px-3 rounded-md ${
                            statusStyles[t.status] || ""
                          }`}
                        >
                          {t.status.replace("_", " ").toLowerCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`capitalize font-bold px-3 rounded-md ${
                            priorityStyles[t.priority] || ""
                          }`}
                        >
                          {t.priority.replace("_", " ").toLowerCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`capitalize font-bold px-3 rounded-md ${
                            urgencyStyles[t.urgency] || ""
                          }`}
                        >
                          {t.urgency.replace("_", " ").toLowerCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold text-sm uppercase tracking-wide text-gray-600 px-4 py-3">
                        {format(new Date(t.createdAt), dateFormat)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const AdminReport = ({ d }: { d: any }) => {
    if (!d) return null;

    const closedCount = Object.entries(d.byStatus || {}).reduce(
      (acc: number, [k, v]: any) =>
        k !== "OPEN" && k !== "IN_PROGRESS" && k !== "INPROGRESS"
          ? acc + v
          : acc,
      0
    );

    const handlePrint = () => {
      printReportAsPDF();
    };

    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">
                Employee Report ({d.totalAssigned ?? d.totalAssignedToTech ?? 0}
                ) Tickets
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {d.name} • {d.role}
              </p>
            </div>

            <div className="flex gap-2 no-print">
              <Button onClick={handlePrint} variant="outline" size="sm">
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Open</div>
              <div className="text-lg font-semibold">
                {d.byStatus?.OPEN ?? 0}
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">In Progress</div>
              <div className="text-lg font-semibold">
                {d.byStatus?.IN_PROGRESS ?? d.byStatus?.INPROGRESS ?? 0}
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Closed</div>
              <div className="text-lg font-semibold">{closedCount}</div>
            </div>

            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Total</div>
              <div className="text-lg font-semibold">
                {d.totalAssigned ?? d.totalAssignedToTech ?? 0}
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          <div>
            <div className="text-sm font-medium mb-2">Tickets Preview</div>

            <Table className="border border-gray-200 bg-white rounded-xl shadow-sm overflow-hidden">
              <TableHeader className="bg-gray-50">
                <TableRow className="border-b border-gray-200">
                  <TableHead className="font-semibold text-sm uppercase tracking-wide text-gray-600 px-4 py-3">
                    Title
                  </TableHead>
                  <TableHead className="font-semibold text-sm uppercase tracking-wide text-gray-600 px-4 py-3">
                    Status
                  </TableHead>
                  <TableHead className="font-semibold text-sm uppercase tracking-wide text-gray-600 px-4 py-3">
                    Priority
                  </TableHead>
                  <TableHead className="font-semibold text-sm uppercase tracking-wide text-gray-600 px-4 py-3">
                    Urgency
                  </TableHead>
                  <TableHead className="font-semibold text-sm uppercase tracking-wide text-gray-600 px-4 py-3">
                    Created
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(d.ticketsPreview || []).map((t: any) => (
                  <TableRow key={t.id} className="border-b border-gray-200">
                    <TableCell className="font-semibold text-sm uppercase tracking-wide text-gray-600 px-4 py-3">
                      {t.title}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`capitalize font-bold px-3 rounded-md ${
                          statusStyles[t.status] || ""
                        }`}
                      >
                        {t.status.replace("_", " ").toLowerCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`capitalize font-bold px-3 rounded-md ${
                          priorityStyles[t.priority] || ""
                        }`}
                      >
                        {t.priority.replace("_", " ").toLowerCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`capitalize font-bold px-3 rounded-md ${
                          urgencyStyles[t.urgency] || ""
                        }`}
                      >
                        {t.urgency.replace("_", " ").toLowerCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold text-sm uppercase tracking-wide text-gray-600 px-4 py-3">
                      {format(new Date(t.createdAt), dateFormat)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      <div className="max-w-full mx-auto p-4">
        <div className="flex items-center mb-2 gap-4">
          <Link
            href="/dashboard/reports"
            className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center"
          >
            <ArrowLeft size={25} />
          </Link>
          <Heading
            title={"Ticket Reports"}
            description="Generate detailed ticket reports"
          />
        </div>
        <Separator />
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 w-full mt-4 grid grid-cols-4 gap-3"
          >
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
                        form.setValue("adminId", null);
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
                      disabled={loading || !selectedDivisionId}
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

            <FormField
              control={form.control}
              name="adminId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employee</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value ?? ""}
                      onValueChange={(v) => field.onChange(v || null)}
                      disabled={
                        loading ||
                        !selectedDepartmentId ||
                        managers.length === 0
                      }
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            managers.length ? "Select employee" : "No employee"
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

            <Button disabled={loading} className="ml-auto" type="submit">
              Generate
            </Button>
          </form>
        </Form>

        <div
          ref={reportRef}
          className="mt-6 bg-white p-4 shadow rounded report-container"
        >
          {!report && (
            <div className="text-slate-500">No report loaded yet.</div>
          )}
          {report && report.managers && <DepartmentReport d={report} />}
          {report && !report.managers && <AdminReport d={report} />}
        </div>
      </div>
    </>
  );
};
