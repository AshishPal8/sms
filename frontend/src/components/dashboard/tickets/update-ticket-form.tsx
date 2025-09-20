import {
  TicketPriorityOptions,
  TicketStatusOptions,
  TicketUrgencyOptions,
} from "@/lib/ticket";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { toast } from "sonner";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ImageUpload from "@/components/ui/image-upload";
import { Button } from "@/components/ui/button";
import { ITicketById } from "@/types/ticket.types";
import api from "@/lib/api";

export const updateTicketSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),

  priority: z.enum(TicketPriorityOptions).optional(),
  status: z.enum(TicketStatusOptions).optional(),
  urgencyLevel: z.enum(TicketUrgencyOptions).optional(),
  assets: z
    .array(
      z.object({
        url: z.url("Invalid asset URL"),
      })
    )
    .optional(),
});

type UpdateTicketFormValues = z.infer<typeof updateTicketSchema>;

export const UpdateTicketForm = () => {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [ticket, setTicket] = useState<ITicketById | null>(null);

  const form = useForm<UpdateTicketFormValues>({
    resolver: zodResolver(updateTicketSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "LOW",
      status: "OPEN",
      urgencyLevel: "COLD",
      assets: [],
    },
  });

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/tickets/${params.id}`);

        const data = res.data?.data;
        if (data) {
          setTicket(data);

          form.reset({
            title: data.title || "",
            description: data.description || "",
            priority: data.priority || "LOW",
            status: data.status || "OPEN",
            assets: data.assets || [],
          });
        }
      } catch (error) {
        console.error("Failed to fetch ticket:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [params.id, form]);

  const onSubmit = async (values: UpdateTicketFormValues) => {
    try {
      setLoading(true);
      await api.put(`/tickets/update/${params.id}`, values);

      toast.success("Ticket created successfully");
      router.push("/dashboard/tickets");
    } catch (error) {
      toast.error("Something went wrong!");
      console.error("Error creating ticket:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center mb-2 gap-4">
        <Link
          href="/dashboard/tickets"
          className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center"
        >
          <ArrowLeft size={25} />
        </Link>
        <Heading
          title="Update Ticket"
          description="Fill out the form to update the ticket"
        />
      </div>

      <Separator />

      <div className="max-w-3xl mx-auto">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 w-full mt-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Customer Name
                </p>
                <p className="text-lg font-semibold">{ticket?.name ?? "-"}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Phone
                </p>
                <p className="text-lg font-semibold">{ticket?.phone ?? "-"}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Email
                </p>
                <p className="text-lg font-semibold">{ticket?.email ?? "-"}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Address
                </p>
                <p className="text-lg font-semibold">
                  {ticket?.address ?? "-"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Insurance Company
                </p>
                <p className="text-lg font-semibold">
                  {ticket?.customer.insuranceCompany ?? "-"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Insurance Deductable
                </p>
                <p className="text-lg font-semibold">
                  {ticket?.customer.insuranceDeductable ?? "-"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Roof covered
                </p>
                <p className="text-lg font-semibold">
                  {ticket?.customer.isRoofCovered ?? "-"}
                </p>
              </div>
            </div>
            <Separator />
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

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select
                      disabled={loading}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TicketPriorityOptions.map((p) => (
                          <SelectItem key={p} value={p}>
                            {p}
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
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      disabled={loading}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TicketStatusOptions.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
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
                name="urgencyLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Urgency</FormLabel>
                    <Select
                      disabled={loading}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select urgency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TicketUrgencyOptions.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
      </div>
    </div>
  );
};
