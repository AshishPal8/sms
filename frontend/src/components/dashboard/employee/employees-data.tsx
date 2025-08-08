"use client";
import { DataTable } from "@/components/ui/data-table";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { baseUrl } from "../../../../config";
import { useSearchParams } from "next/navigation";
import { EmployeeActions } from "./cell-action";

interface IEmployee {
  id: string;
  name: string;
  email: string;
  role: string;
}

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

  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "desc";
  const role = searchParams.get("role") || "";

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get(`${baseUrl}/employees`, {
          params: {
            search,
            sort,
            role,
          },
          withCredentials: true,
        });

        const { data } = await res.data;
        setEmployees(data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, [role, search, sort]);

  const formatEmployees = employees.map((employee: IEmployee) => ({
    id: employee.id,
    name: employee.name,
    email: employee.email,
    role: employee.role.toLowerCase(),
  }));

  return (
    <div>
      <DataTable columns={columns} data={formatEmployees} />
    </div>
  );
};

export default EmployeesData;
