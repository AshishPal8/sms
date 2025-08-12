"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { format } from "date-fns";
import { DataTable } from "@/components/ui/data-table";
import { baseUrl } from "../../../../config";
import { EmployeeActions } from "./cell-action";
import Pagination from "../pagination";
import { IEmployee } from "@/types/employee.types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const EmployeesData = () => {
  const searchParams = useSearchParams();
  const [employees, setEmployees] = useState([]);
  const [totalPage, setTotalPage] = useState(0);

  const search = searchParams.get("search") || "";
  const sortOrder = searchParams.get("sortOrder") || "desc";
  const role = searchParams.get("role") || "";
  const page = searchParams.get("page") || 1;

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get(`${baseUrl}/employees`, {
          params: {
            search,
            sortOrder,
            role,
            page,
          },
          withCredentials: true,
        });

        const { data, meta } = await res.data;
        setEmployees(data);
        setTotalPage(meta.totalPages);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, [role, search, sortOrder, page]);

  const formatEmployees = employees.map((employee: IEmployee) => ({
    id: employee.id,
    profile: employee.profilePicture,
    name: employee.name,
    email: employee.email,
    role: employee.role.toLowerCase(),
    createdAt: employee.createdAt
      ? format(new Date(employee.createdAt), "dd-MM-yyyy")
      : null,
  }));

  const columns = [
    {
      header: "Profile",
      accessor: "profile",
      render: (value: string, row: any) => (
        <Avatar className="w-12 h-12">
          <AvatarImage
            src={`${value}?tr=w-50,h-50`}
            alt={row.name}
            className="w-12 h-12 object-cover"
          />
          <AvatarFallback>
            {row.name ? row.name.charAt(0).toUpperCase() : "?"}
          </AvatarFallback>
        </Avatar>
      ),
    },
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email" },
    {
      header: "Role",
      accessor: "role",
      render: (value: string) => <span className="capitalize">{value}</span>,
    },
    {
      header: "Created At",
      accessor: "createdAt",
      render: (value: string) => <span className="capitalize">{value}</span>,
    },
    {
      header: "Actions",
      accessor: "id",
      render: (id: string) => (
        <EmployeeActions
          id={id}
          onDeleteSuccess={(deletedId: string) => {
            setEmployees((prev) => prev.filter((e) => e.id !== deletedId));
          }}
        />
      ),
    },
  ];

  return (
    <div>
      <DataTable columns={columns} data={formatEmployees} />
      <Pagination page={Number(page)} totalPages={totalPage} />
    </div>
  );
};

export default EmployeesData;
