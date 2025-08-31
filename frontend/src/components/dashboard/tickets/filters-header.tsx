import React from "react";
import SearchInput from "../search-input";
import FilterDropdown from "./filter-dropdown";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CreditCard, Plus, Table } from "lucide-react";
import useAuthStore from "@/store/user";
import { roles } from "@/lib/utils";

const TicketFilters = ({
  view,
  setView,
}: {
  view: "table" | "card";
  setView: (v: "table" | "card") => void;
}) => {
  const { user } = useAuthStore();
  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 w-full">
      <SearchInput placeholder="Search with name, email, title, description" />
      <div className="flex gap-2 items-center">
        <div className="flex items-center gap-1 border rounded-md">
          <Button
            size="icon"
            onClick={() => setView("table")}
            className={`px-3 py-1 rounded-md cursor-pointer hover:bg-primary hover:text-primary-foreground ${
              view === "table"
                ? "bg-primary text-primary-foreground "
                : "bg-white text-gray-600"
            }`}
          >
            <Table size={16} />
          </Button>
          <Button
            size="icon"
            onClick={() => setView("card")}
            className={`px-3 py-1 rounded-md hover:bg-primary hover:text-primary-foreground ${
              view === "card"
                ? "bg-primary text-primary-foreground"
                : "bg-white text-gray-600"
            }`}
          >
            <CreditCard size={16} />
          </Button>
        </div>
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
