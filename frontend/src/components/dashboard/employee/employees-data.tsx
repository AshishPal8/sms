"use client";
import { DataTable } from "@/components/ui/data-table";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { baseUrl } from "../../../../config";
import { useSearchParams } from "next/navigation";
import { EmployeeActions } from "./cell-action";
import Pagination from "../pagination";
import { IEmployee } from "@/types/employee.types";

const columns = [
  { header: "Name", accessor: "name" },
  { header: "Email", accessor: "email" },
  {
    header: "Role",
    accessor: "role",
    render: (value: string) => <span className="capitalize">{value}</span>,
  },
  {
    header: "Actions",
    accessor: "id",
    render: (id: string) => <EmployeeActions id={id} />,
  },
];

const EmployeesData = () => {
  const searchParams = useSearchParams();
  const [employees, setEmployees] = useState([]);
  const [totalPage, setTotalPage] = useState(0);

  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "desc";
  const role = searchParams.get("role") || "";
  const page = searchParams.get("page") || 1;

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get(`${baseUrl}/employees`, {
          params: {
            search,
            sort,
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
  }, [role, search, sort, page]);

  const formatEmployees = employees.map((employee: IEmployee) => ({
    id: employee.id,
    name: employee.name,
    email: employee.email,
    role: employee.role.toLowerCase(),
  }));

  return (
    <div>
      <DataTable columns={columns} data={formatEmployees} />
      <Pagination page={Number(page)} totalPages={totalPage} />
    </div>
  );
};

export default EmployeesData;
