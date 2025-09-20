"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import axios from "axios";
import { baseUrl } from "../../../config";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { allowedDateFormat } from "@/lib/utils";
import useSettingsStore from "@/store/settings";

const formSchema = z.object({
  dateFormat: z.string(),
});

type SettingsFormValues = z.infer<typeof formSchema>;

interface SettingsFormProps {
  initialData?: SettingsFormValues & { id?: string };
}

export const SettingsForm = ({ initialData }: SettingsFormProps) => {
  const router = useRouter();
  const setSettings = useSettingsStore((state) => state.setSettings);

  const [loading, setLoading] = useState(false);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      dateFormat: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [form, initialData]);

  const isEdit = !!initialData;

  const onSubmit = async (values: SettingsFormValues) => {
    try {
      setLoading(true);

      if (isEdit) {
        const res = await axios.post(`${baseUrl}/settings/update`, values, {
          withCredentials: true,
        });

        const { data } = res.data;

        setSettings(data);
        //store using zustand in local storage
      }

      toast.success(`Settins ${isEdit ? "updated" : "created"} successfully`);
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong!");
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="">
        {/* <div className="flex items-center mb-2 gap-4">
          <Heading
            title="Settings"
            description="Update you organisation settings"
          />
        </div>
        <Separator /> */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 w-full mt-4"
          >
            <div className="grid grid-cols-1 gap-5">
              <FormField
                control={form.control}
                name="dateFormat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date Format</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value ?? ""}
                        onValueChange={(v) => {
                          field.onChange(v || null);
                        }}
                        disabled={loading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={"Select date format"} />
                        </SelectTrigger>
                        <SelectContent>
                          {allowedDateFormat.map((format) => (
                            <SelectItem key={format.key} value={format.key}>
                              {format.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
