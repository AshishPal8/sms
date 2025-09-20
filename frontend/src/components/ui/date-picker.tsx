"use client";
import React, { useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import useSettingsStore from "@/store/settings";

type Props = {
  value?: Date | null;
  onChange: (d: Date | undefined) => void;
  disabled?: boolean;
  placeholder?: string;
};

export default function DatePicker({
  value,
  onChange,
  disabled,
  placeholder = "Select date",
}: Props) {
  const [open, setOpen] = useState(false);
  const dateFormat = useSettingsStore((s) => s.getDateFormat());

  const formatted = value ? format(value, dateFormat) : placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start text-left font-normal"
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {formatted}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="start" side="bottom" className="w-auto p-0">
        <Calendar
          mode="single"
          selected={value ?? undefined}
          onSelect={(selectedDate) => {
            onChange(selectedDate);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
