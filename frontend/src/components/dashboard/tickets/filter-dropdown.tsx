"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, Filter } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { TicketPriorityOptions, TicketStatusOptions } from "@/lib/ticket";
import { Calendar } from "@/components/ui/calendar";

const FilterDropdown = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [fromDate, setFromDate] = useState<Date | undefined>(
    searchParams.get("fromDate")
      ? new Date(searchParams.get("fromDate")!)
      : undefined
  );
  const [toDate, setToDate] = useState<Date | undefined>(
    searchParams.get("toDate")
      ? new Date(searchParams.get("toDate")!)
      : undefined
  );
  const [priority, setPriority] = useState(searchParams.get("priority") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "");
  const [sortOrder, setSortOrder] = useState(
    searchParams.get("sortOrder") || "desc"
  );
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [fromDateOpen, setFromDateOpen] = useState(false);
  const [toDateOpen, setToDateOpen] = useState(false);

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (fromDate) params.set("fromDate", format(fromDate, "yyyy-MM-dd"));
    else params.delete("fromDate");

    if (toDate) params.set("toDate", format(toDate, "yyyy-MM-dd"));
    else params.delete("toDate");

    if (priority) params.set("priority", priority);
    else params.delete("priority");

    if (status) params.set("status", status);
    else params.delete("status");

    if (sortOrder) params.set("sortOrder", sortOrder);
    else params.delete("sortOrder");

    params.set("page", "1");
    router.push(`?${params.toString()}`);
    setDropdownOpen(false);
  };

  const removeFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    params.delete("fromDate");
    params.delete("toDate");
    params.delete("priority");
    params.delete("status");
    params.delete("sortOrder");
    params.delete("page");

    router.push(`?${params.toString()}`);

    setFromDate(undefined);
    setToDate(undefined);
    setPriority("");
    setStatus("");
    setSortOrder("desc");
    setDropdownOpen(false);
  };

  const handleFromDateSelect = (date: Date | undefined) => {
    setFromDate(date);
    setFromDateOpen(false);
  };

  const handleToDateSelect = (date: Date | undefined) => {
    setToDate(date);
    setToDateOpen(false);
  };

  return (
    <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <div className="rounded-lg flex items-center justify-center gap-3 cursor-pointer border border-gray-200 px-2 py-2">
          <Filter size={20} />
          <div className="hidden md:block">
            <p className="text-black font-medium">Filters</p>
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="p-5 w-[350px]">
        <div className="flex flex-col gap-4">
          {/* From Date */}
          <div>
            <Label className="block font-medium mb-2">From Date</Label>
            <div className="relative">
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
                onClick={() => {
                  setFromDateOpen(!fromDateOpen);
                  setToDateOpen(false); // Close other date picker
                }}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {fromDate ? format(fromDate, "dd-MM-yyyy") : "Pick a date"}
              </Button>
              {fromDateOpen && (
                <div className="absolute top-full left-0 z-50 mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                  <Calendar
                    mode="single"
                    selected={fromDate}
                    onSelect={handleFromDateSelect}
                    autoFocus
                    className="p-3"
                  />
                </div>
              )}
            </div>
          </div>

          {/* To Date */}
          <div>
            <Label className="block font-medium mb-2">To Date</Label>
            <div className="relative">
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
                onClick={() => {
                  setToDateOpen(!toDateOpen);
                  setFromDateOpen(false); // Close other date picker
                }}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {toDate ? format(toDate, "dd-MM-yyyy") : "Pick a date"}
              </Button>
              {toDateOpen && (
                <div className="absolute top-full left-0 z-50 mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                  <Calendar
                    mode="single"
                    selected={toDate}
                    onSelect={handleToDateSelect}
                    autoFocus
                    className="p-3"
                    disabled={(date) => (fromDate ? date < fromDate : false)}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Priority */}
          <div>
            <Label className="block font-medium mb-2">Priority</Label>
            <Select onValueChange={(v) => setPriority(v)} value={priority}>
              <SelectTrigger>
                <SelectValue placeholder="Select Priority" />
              </SelectTrigger>
              <SelectContent>
                {TicketPriorityOptions.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div>
            <Label className="block font-medium mb-2">Status</Label>
            <Select onValueChange={(v) => setStatus(v)} value={status}>
              <SelectTrigger>
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                {TicketStatusOptions.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sort Order */}
          <div>
            <Label className="block font-medium mb-2">Sort Order</Label>
            <Select onValueChange={(v) => setSortOrder(v)} value={sortOrder}>
              <SelectTrigger>
                <SelectValue placeholder="Sort Order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">ASC</SelectItem>
                <SelectItem value="desc">DESC</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-center gap-2 w-full">
            <Button onClick={applyFilters} className="px-4 py-2 rounded">
              Apply
            </Button>
            <Button
              variant="secondary"
              onClick={removeFilters}
              className="px-4 py-2 rounded"
            >
              Remove
            </Button>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FilterDropdown;
