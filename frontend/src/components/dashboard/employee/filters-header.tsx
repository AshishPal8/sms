import React from "react";
import SearchInput from "../search-input";
import FilterDropdown from "./filter-dropdown";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const EmployeeFilters = () => {
  return (
    <div className="flex justify-between items-center">
      <SearchInput />
      <div className="flex gap-2 items-center justify-center">
        <FilterDropdown />
        <Link href="/dashboard/employees/add">
          <Button>Add</Button>
        </Link>
      </div>
    </div>
  );
};

export default EmployeeFilters;
