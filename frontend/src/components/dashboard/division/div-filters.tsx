import React from "react";
import SearchInput from "../search-input";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import FilterDropdown from "./filter-dropdown";

const DivisionsFilters = () => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 w-full">
      <SearchInput placeholder="Search with Name" />
      <div className="flex gap-2 items-center">
        <FilterDropdown />
        <Link href="/dashboard/divisions/add">
          <Button className="cursor-pointer">
            <Plus size={20} /> Add
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default DivisionsFilters;
