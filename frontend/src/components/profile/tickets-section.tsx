"use client";
import { baseUrl } from "@/config";
import { ITicketById } from "@/types/ticket.types";
import axios from "axios";
import { ArrowRightCircle, CheckCircle2, Shield } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Heading } from "../ui/heading";
import { statusStyles } from "@/styles/color";
import Link from "next/link";
import { Card } from "../ui/card";
import { Button } from "../ui/button";

const TicketsSection = () => {
  const [tickets, setTickets] = useState<ITicketById[]>([]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await axios.get(`${baseUrl}/user/ticket`, {
          withCredentials: true,
        });
        const { data } = res.data;
        setTickets(data);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    };

    fetchTickets();
  }, []);

  return (
    <section className="my-8">
      {tickets.length > 0 ? (
        <div className="mx-2">
          <div className="my-5">
            <Heading
              title="Your Tickets"
              description="Manage and track your tickets"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="rounded-2xl bg-gradient-to-br from-blue-400 via-white to-cyan-400 border border-blue-100"
              >
                <div className="px-2 py-3 md:px-4 md:py-5 md:col-span-2">
                  <div className="max-w-3xl">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                      <div
                        className={`inline-flex capitalize items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${
                          statusStyles[ticket.status.toUpperCase()]
                        }`}
                      >
                        <Shield className="h-4 w-4" />
                        {ticket?.status.toLowerCase()}
                      </div>
                      <Link
                        href={`/tickets/${ticket.id}/details`}
                        className={`inline-flex capitalize items-center gap-2 rounded-full px-4 py-2 text-sm font-medium border border-primary`}
                      >
                        View Details
                        <ArrowRightCircle className="h-4 w-4" />
                      </Link>
                    </div>

                    <h1 className="font-display text-2xl font-bold text-slate-900 md:text-3xl">
                      {ticket.title}
                    </h1>
                    <p className="mt-4 max-w-2xl text-lg text-slate-600 line-clamp-1">
                      {ticket.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <Card className="rounded-2xl border-0 bg-white p-8 shadow-xl text-center">
          <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="font-display text-2xl font-bold text-slate-900 mb-2">
            No Tickets Yet!
          </h2>
          <p className="text-slate-600 mb-2">
            Thank you for choosing ProService. We&apos;ve received your request
            and will contact you within 2 hours to confirm details and provide
            an arrival window.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button>
              <Link href="/book-a-service">Create First Ticket</Link>
            </Button>
          </div>
        </Card>
      )}
    </section>
  );
};

export default TicketsSection;
