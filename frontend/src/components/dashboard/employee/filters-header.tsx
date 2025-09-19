"use client";
import React from "react";
import SearchInput from "../search-input";
import FilterDropdown from "./filter-dropdown";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import useAuthStore from "@/store/user";
import { roles } from "@/lib/utils";

const EmployeeFilters = () => {
  const { user } = useAuthStore();
  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 w-full">
      <SearchInput placeholder="Search with Name & Email" />
      <div className="flex gap-2 items-center">
        <FilterDropdown />
        {user?.role === roles.SUPERADMIN && (
          <Link href="/dashboard/employees/add">
            <Button className="cursor-pointer">
              <Plus size={20} /> Add
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default EmployeeFilters;
