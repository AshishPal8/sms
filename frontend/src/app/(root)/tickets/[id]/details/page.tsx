"use client";
import { ITicketById } from "@/types/ticket.types";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import TicketHeader from "@/components/profile/ticket-header";
import TicketItemForm from "@/components/profile/ticket-item-form";
import api from "@/lib/api";

const TicketDetails = () => {
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [ticket, setTicket] = useState<ITicketById | null>(null);

  const fetchTicket = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/tickets/item/${params.id}`);

      const data = res.data?.data;
      if (data) {
        setTicket(data);
      }
    } catch (error) {
      console.error("Failed to fetch ticket:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicket();
  }, []);

  const handleItemCreated = async () => {
    await fetchTicket();
  };

  if (loading) {
    return (
      <div className="w-[90%] mx-auto py-10 text-center text-gray-500">
        Loading ticket details...
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="w-[90%] mx-auto py-10 text-center text-red-500">
        Ticket not found.
      </div>
    );
  }

  return (
    <div>
      <TicketHeader ticket={ticket} />
      <TicketItemForm ticket={ticket} onItemCreated={handleItemCreated} />
    </div>
  );
};

export default TicketDetails;
