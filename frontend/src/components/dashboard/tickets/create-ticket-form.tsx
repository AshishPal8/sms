import {
  TicketPriorityOptions,
  TicketStatusOptions,
  TicketUrgencyOptions,
} from "@/lib/ticket";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { addressSchema } from "@/schemas/addressSchema";
import DatePicker from "@/components/ui/date-picker";
import { format } from "date-fns";
import AddressInput from "@/components/ui/AddressInput";
import { Address as AddressType } from "@/types/address.types";
import useSettingsStore from "@/store/settings";
import api from "@/lib/api";

export const createTicketSchema = z
  .object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().optional(),

    firstname: z.string().min(2, "Enter your name."),
    lastname: z.string().optional(),
    phone: z.string().trim().optional(),
    email: z.email("Enter a valid email").optional(),
    address: addressSchema.optional(),
    insuranceCompany: z.string().optional(),
    policyNumber: z.string().optional(),
    policyExpiryDate: z.string().optional(),
    insuranceContactNo: z.string().optional(),
    insuranceDeductable: z
      .number()
      .min(0, "Deductable cannot be negative")
      .optional(),
    isRoofCovered: z.boolean().default(false).optional(),

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
  })
  .refine((v) => Boolean(v.email) || Boolean(v.phone), {
    path: ["email"],
    message: "Provide at least email or phone",
  });

type CreateTicketFormValues = z.infer<typeof createTicketSchema>;

export const CreateTicketForm = () => {
  const dateFormat = useSettingsStore((s) => s.getDateFormat());

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<CreateTicketFormValues>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: {
      title: "",
      description: "",
      firstname: "",
      lastname: "",
      phone: "",
      email: "",
      address: undefined,
      insuranceCompany: "",
      insuranceDeductable: 0,
      policyNumber: "",
      policyExpiryDate: undefined,
      insuranceContactNo: "",
      priority: "LOW",
      status: "OPEN",
      urgencyLevel: "COLD",
      assets: [],
      isRoofCovered: false,
    },
  });

  const onSubmit = async (values: CreateTicketFormValues) => {
    try {
      setLoading(true);
      await api.post(`/tickets/create`, values);

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
                name="firstname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer First Name</FormLabel>
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
                    <FormLabel>Customer Last Name</FormLabel>
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
                name="insuranceCompany"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Insurance Company</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Enter insurance company"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="insuranceDeductable"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Insurance Deductable</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        disabled={loading}
                        placeholder="Enter insurance deductable in %"
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? Number(e.target.value) : ""
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="policyNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Insurance Policy No.</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Enter insurance policy no."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="policyExpiryDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Policy Expiry Date</FormLabel>
                    <FormControl>
                      <DatePicker
                        value={field.value ? new Date(field.value) : undefined}
                        onChange={(date) =>
                          field.onChange(
                            date ? format(date, dateFormat) : undefined
                          )
                        }
                        disabled={loading}
                        placeholder="Select policy expiry date"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="insuranceContactNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Insurance Contact No</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Enter insurance contact no."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isRoofCovered"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Roof Covered</FormLabel>
                    <FormControl>
                      <Checkbox
                        disabled={loading}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    {/* AddressInput is a controlled component: pass field.value and field.onChange */}
                    <AddressInput
                      value={field.value as AddressType | undefined}
                      onChange={(val) => field.onChange(val)}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
