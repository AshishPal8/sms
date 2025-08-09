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
    name: employee.name,
    email: employee.email,
    role: employee.role.toLowerCase(),
    createdAt: employee.createdAt
      ? format(new Date(employee.createdAt), "dd-MM-yyyy")
      : null,
  }));

  const columns = [
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
