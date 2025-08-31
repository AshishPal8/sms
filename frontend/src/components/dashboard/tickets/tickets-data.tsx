"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { format } from "date-fns";
import { DataTable } from "@/components/ui/data-table";
import { baseUrl } from "../../../config";
import Pagination from "../pagination";
import { TicketActions } from "./cell-action";
import { priorityStyles, statusStyles, urgencyStyles } from "@/styles/color";
import { Badge } from "@/components/ui/badge";
import { ITicket } from "@/types/ticket.types";

const TicketsData = ({ view }: { view: "table" | "card" }) => {
  const searchParams = useSearchParams();
  const [tickets, setTickets] = useState([]);
  const [totalPage, setTotalPage] = useState(0);

  const search = searchParams.get("search") || "";
  const sortOrder = searchParams.get("sortOrder") || "desc";
  const priority = searchParams.get("priority") || "";
  const status = searchParams.get("status") || "";
  const urgencyLevel = searchParams.get("urgencyLevel") || "";
  const fromDate = searchParams.get("fromDate") || "";
  const toDate = searchParams.get("toDate") || "";
  const page = Number(searchParams.get("page")) || 1;

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await axios.get(`${baseUrl}/tickets`, {
          params: {
            search,
            sortOrder,
            priority,
            status,
            urgencyLevel,
            fromDate,
            toDate,
            page,
          },
          withCredentials: true,
        });

        const { data, meta } = await res.data;
        setTickets(data);
        setTotalPage(meta.totalPages);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    };

    fetchTickets();
  }, [
    search,
    sortOrder,
    priority,
    status,
    urgencyLevel,
    fromDate,
    toDate,
    page,
  ]);

  const formatTickets = tickets.map((ticket: ITicket) => ({
    id: ticket.id,
    name: ticket.name,
    title: ticket.title,
    priority: ticket.priority,
    urgencyLevel: ticket.urgencyLevel,
    status: ticket.status,
    createdAt: ticket.createdAt
      ? format(new Date(ticket.createdAt), "dd-MM-yyyy")
      : null,
  }));

  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Title", accessor: "title" },
    {
      header: "Priority",
      accessor: "priority",
      render: (value: string) => (
        <Badge
          className={`capitalize font-bold px-3 rounded-md ${
            priorityStyles[value] || ""
          }`}
        >
          {value.toLowerCase()}
        </Badge>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      render: (value: string) => (
        <Badge
          className={`capitalize font-bold px-3 rounded-md ${
            statusStyles[value] || ""
          }`}
        >
          {value.replace("_", " ").toLowerCase()}
        </Badge>
      ),
    },
    {
      header: "Urgency",
      accessor: "urgencyLevel",
      render: (value: string) => (
        <Badge
          className={`capitalize font-bold px-3 rounded-md ${
            urgencyStyles[value] || ""
          }`}
        >
          {value.replace("_", " ").toLowerCase()}
        </Badge>
      ),
    },
    {
      header: "Created At",
      accessor: "createdAt",
    },
    {
      header: "Actions",
      accessor: "id",
      render: (id: string) => (
        <TicketActions
          id={id}
          onDeleteSuccess={(deletedId: string) => {
            setTickets((prev) => prev.filter((e) => e.id !== deletedId));
          }}
        />
      ),
    },
  ];

  return (
    <div>
      {view === "table" ? (
        <DataTable columns={columns} data={formatTickets} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {tickets.map((ticket: ITicket) => (
            <div
              key={ticket.id}
              className="p-5 border rounded-xl shadow-sm bg-white flex flex-col justify-between"
            >
              <div>
                <p className="text-xs text-gray-400">
                  Created:{" "}
                  {ticket.createdAt
                    ? format(new Date(ticket.createdAt), "dd-MM-yyyy")
                    : "N/A"}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  Name: {ticket.name}
                </p>
                <h3 className="font-bold text-lg mb-2">{ticket.title}</h3>

                <div className="flex flex-col gap-2 mb-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm text-gray-600">Priority: </p>
                    <Badge
                      className={`capitalize font-bold px-3 rounded-md ${
                        priorityStyles[ticket.priority] || ""
                      }`}
                    >
                      {ticket.priority.toLowerCase()}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm text-gray-600">Status: </p>
                    <Badge
                      className={`capitalize font-bold px-3 rounded-md ${
                        statusStyles[ticket.status] || ""
                      }`}
                    >
                      {ticket.status.replace("_", " ").toLowerCase()}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm text-gray-600">Urgency: </p>
                    <Badge
                      className={`capitalize font-bold px-3 rounded-md ${
                        urgencyStyles[ticket.urgencyLevel] || ""
                      }`}
                    >
                      {ticket.urgencyLevel.toLowerCase()}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Actions at bottom center */}
              <div className="mt-4 flex justify-center">
                <TicketActions
                  id={ticket.id}
                  onDeleteSuccess={(deletedId: string) =>
                    setTickets((prev) => prev.filter((e) => e.id !== deletedId))
                  }
                />
              </div>
            </div>
          ))}
        </div>
      )}
      <Pagination page={Number(page)} totalPages={totalPage} />
    </div>
  );
};

export default TicketsData;
