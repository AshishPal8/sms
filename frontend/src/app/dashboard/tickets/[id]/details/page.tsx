"use client";
import { ITicketById } from "@/types/ticket.types";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import TicketDetailHero from "@/components/dashboard/tickets/detail-hero";
import { baseUrl } from "@/config";
import TicketDetailForm from "@/components/dashboard/tickets/ticket-detail-form";

const TicketDetails = () => {
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [ticket, setTicket] = useState<ITicketById | null>(null);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${baseUrl}/tickets/item/${params.id}`, {
          withCredentials: true,
        });

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

    fetchTicket();
  }, [params.id]);

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
      <TicketDetailHero ticket={ticket} />
      <TicketDetailForm ticket={ticket} />
    </div>
  );
};

export default TicketDetails;
