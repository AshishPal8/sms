"use client";
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
import { Filter } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const FilterDropdown = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [sort, setSort] = useState(searchParams.get("sortOrder") || "asc");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (sort) params.set("sortOrder", sort);
    else params.delete("sortOrder");

    params.set("page", "1");
    router.push(`?${params.toString()}`);
    setDropdownOpen(false);
  };

  const removeFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    params.delete("sortOrder");
    params.delete("page");

    router.push(`?${params.toString()}`);

    setSort("");
    setDropdownOpen(false);
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
      <DropdownMenuContent align="end" className="p-5">
        <div className="flex gap-4">
          <div className="mb-4">
            <Label className="block font-medium mb-2">Order</Label>
            <Select onValueChange={(value) => setSort(value)} value={sort}>
              <SelectTrigger>
                <SelectValue placeholder="Order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">ASC</SelectItem>
                <SelectItem value="desc">DESC</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 w-full">
          <Button
            variant="default"
            onClick={applyFilters}
            className="px-4 py-2 rounded"
          >
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FilterDropdown;
