import { TicketPriorityOptions, TicketStatusOptions } from "@/lib/ticket";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { baseUrl } from "../../../config";
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

export const createTicketSchema = z
  .object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().optional(),

    name: z.string().optional(),
    phone: z.string().trim().optional(),
    email: z.email("Enter a valid email").optional(),
    address: z.string().optional(),

    priority: z.enum(TicketPriorityOptions).optional(),
    status: z.enum(TicketStatusOptions).optional(),
    assets: z
      .array(
        z.object({
          url: z.url("Invalid asset URL"),
        })
      )
      .optional(),
  })
  .refine((v) => Boolean(v.email) || Boolean(v.phone), {
    path: ["email"],
    message: "Provide at least email or phone",
  });

type CreateTicketFormValues = z.infer<typeof createTicketSchema>;

export const CreateTicketForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<CreateTicketFormValues>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: {
      title: "",
      description: "",
      name: "",
      phone: "",
      email: "",
      address: "",
      priority: "LOW",
      status: "OPEN",
      assets: [],
    },
  });

  const onSubmit = async (values: CreateTicketFormValues) => {
    try {
      setLoading(true);
      await axios.post(`${baseUrl}/tickets/create`, values, {
        withCredentials: true,
      });

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
          title="Create Ticket"
          description="Fill out the form to create a new ticket"
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
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer Name</FormLabel>
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
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Enter phone number"
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
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Enter address"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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

            <div className="grid grid-cols-2 gap-5">
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
