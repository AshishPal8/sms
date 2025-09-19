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
import { Switch } from "@/components/ui/switch";
import { roles } from "@/data/dashboard";
import { Filter } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const FilterDropdown = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [role, setRole] = useState(searchParams.get("role") || "");
  const [sort, setSort] = useState(searchParams.get("sortOrder") || "desc");

  const initialActive =
    searchParams.get("active") !== null
      ? searchParams.get("active") === "true"
      : true;
  const initialDelete =
    searchParams.get("deleted") !== null
      ? searchParams.get("deleted") === "true"
      : false;
  const [active, setActive] = useState<boolean>(initialActive);
  const [isDeleted, setIsDeleted] = useState<boolean>(initialDelete);

  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const urlRole = searchParams.get("role") ?? "";
    setRole(urlRole);

    const urlSort = searchParams.get("sortOrder") ?? "desc";
    setSort(urlSort);

    const urlActive = searchParams.get("active");
    setActive(urlActive === null ? true : urlActive === "true");
    const urlDelete = searchParams.get("deleted");
    setIsDeleted(urlDelete === null ? false : urlDelete === "true");
  }, [searchParams]);

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (role) params.set("role", role);
    else params.delete("role");

    if (sort) params.set("sortOrder", sort);
    else params.delete("sortOrder");

    params.set("active", active ? "true" : "false");
    params.set("deleted", isDeleted ? "true" : "false");

    params.set("page", "1");
    router.push(`?${params.toString()}`);
    setDropdownOpen(false);
  };

  const removeFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    params.delete("role");
    params.delete("sortOrder");
    params.delete("page");
    params.delete("active");
    params.delete("deleted");
    params.delete("sortBy");

    router.push(`?${params.toString()}`);

    setRole("");
    setSort("");
    setActive(true);
    setIsDeleted(false);
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
        <div className="grid grid-cols-2 gap-4">
          <div className="mb-2">
            <Label className="block font-medium mb-2">Role</Label>
            <Select onValueChange={(value) => setRole(value)} value={role}>
              <SelectTrigger>
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                {/* <SelectItem value="">All Roles</SelectItem> */}
                <SelectItem key="NONE" value="NONE">
                  None
                </SelectItem>
                {roles.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="mb-2">
            <Label className="block font-medium mb-2">Order</Label>
            <Select onValueChange={(value) => setSort(value)} value={sort}>
              <SelectTrigger>
                <SelectValue placeholder="Order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">DESC</SelectItem>
                <SelectItem value="asc">ASC</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <Switch
              checked={active}
              onCheckedChange={(val: boolean) => setActive(val)}
            />
            <span className="text-sm text-muted-foreground">
              {active ? "Active" : "Inactive"}
            </span>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <Switch
              checked={isDeleted}
              onCheckedChange={(val: boolean) => setIsDeleted(val)}
            />
            <span className="text-sm text-muted-foreground">
              {isDeleted ? "Deleted" : "Not Deleted"}
            </span>
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
