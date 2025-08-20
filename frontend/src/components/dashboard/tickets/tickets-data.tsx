"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { format } from "date-fns";
import { DataTable } from "@/components/ui/data-table";
import { baseUrl } from "../../../config";
import Pagination from "../pagination";
import { TicketActions } from "./cell-action";
import { priorityStyles, statusStyles } from "@/styles/color";
import { Badge } from "@/components/ui/badge";
import { ITicket } from "@/types/ticket.types";

const TicketsData = () => {
  const searchParams = useSearchParams();
  const [tickets, setTickets] = useState([]);
  const [totalPage, setTotalPage] = useState(0);

  const search = searchParams.get("search") || "";
  const sortOrder = searchParams.get("sortOrder") || "desc";
  const priority = searchParams.get("priority") || "";
  const status = searchParams.get("status") || "";
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
  }, [search, sortOrder, priority, status, fromDate, toDate, page]);

  const formatTickets = tickets.map((ticket: ITicket) => ({
    id: ticket.id,
    name: ticket.name,
    title: ticket.title,
    priority: ticket.priority,
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
      <DataTable columns={columns} data={formatTickets} />
      <Pagination page={Number(page)} totalPages={totalPage} />
    </div>
  );
};

export default TicketsData;
