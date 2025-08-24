"use client";

import { CreateTicketForm } from "@/components/dashboard/tickets/create-ticket-form";

function AddTicket() {
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-2 md:p-8 pt-6">
        <CreateTicketForm />
      </div>
    </div>
  );
}

export default AddTicket;
