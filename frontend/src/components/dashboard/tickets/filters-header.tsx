import React from "react";
import SearchInput from "../search-input";
import FilterDropdown from "./filter-dropdown";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import useAuthStore from "@/store/user";
import { roles } from "@/lib/utils";

const TicketFilters = () => {
  const { user } = useAuthStore();
  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 w-full">
      <SearchInput placeholder="Search with name, email, title, description" />
      <div className="flex gap-2 items-center">
        <FilterDropdown />
        {(user.role === roles.ASSISTANT || user.role === roles.SUPERADMIN) && (
          <Link href="/dashboard/tickets/add">
            <Button className="cursor-pointer">
              <Plus size={20} /> Add
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default TicketFilters;
