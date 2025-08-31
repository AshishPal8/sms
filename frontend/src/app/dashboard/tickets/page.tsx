"use client";
import TicketFilters from "@/components/dashboard/tickets/filters-header";
import TicketsData from "@/components/dashboard/tickets/tickets-data";
import React, { Suspense, useState } from "react";

const Tickets = () => {
  const [view, setView] = useState<"table" | "card">("table");

  return (
    <div className="p-2 md:p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <TicketFilters view={view} setView={setView} />
        <TicketsData view={view} />
      </Suspense>
    </div>
  );
};

export default Tickets;
