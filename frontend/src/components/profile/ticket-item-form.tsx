"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
import { baseUrl } from "@/config";
import { ITicketById } from "@/types/ticket.types";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const createTicketItemSchema = z.object({
  ticketId: z.string().min(1, "Ticket ID is required"),

  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),

  assets: z
    .array(
      z.object({
        url: z.url("Invalid asset URL"),
      })
    )
    .optional(),
});

type CreateTicketItemFormValues = z.infer<typeof createTicketItemSchema>;

const TicketItemForm = ({ ticket }: { ticket: ITicketById }) => {
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const form = useForm<CreateTicketItemFormValues>({
    resolver: zodResolver(createTicketItemSchema),
    defaultValues: {
      ticketId: ticket.id,
      title: "",
      description: "",
      assets: [],
    },
  });

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

export default TicketItemForm;
