"use client";

import { UpdateTicketForm } from "@/components/dashboard/tickets/update-ticket-form";

function UpdateTicket() {
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-2 md:p-8 pt-6">
        <UpdateTicketForm />
      </div>
    </div>
  );
}

export default UpdateTicket;
