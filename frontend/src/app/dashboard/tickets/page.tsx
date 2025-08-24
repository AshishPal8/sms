"use client";
import TicketFilters from "@/components/dashboard/tickets/filters-header";
import TicketsData from "@/components/dashboard/tickets/tickets-data";
import React, { Suspense } from "react";

const Tickets = () => {
  return (
    <div className="p-2 md:p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <TicketFilters />
        <TicketsData />
      </Suspense>
    </div>
  );
};

export default Tickets;
