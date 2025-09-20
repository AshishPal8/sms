"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { DataTable } from "@/components/ui/data-table";
import { EmployeeActions } from "./cell-action";
import Pagination from "../pagination";
import { IEmployee } from "@/types/employee.types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { defaultProfile } from "@/data/assets";
import useSettingsStore from "@/store/settings";
import api from "@/lib/api";

const EmployeesData = () => {
  const searchParams = useSearchParams();
  const [employees, setEmployees] = useState([]);
  const [totalPage, setTotalPage] = useState(0);
  const dateFormat = useSettingsStore((state) => state.getDateFormat());
  const router = useRouter();

  const search = searchParams.get("search") || "";
  const sortOrderParam = searchParams.get("sortOrder") || "desc";
  const sortByParam = searchParams.get("sortBy") || "createdAt";
  let role = searchParams.get("role") || "";
  if (role === "NONE") {
    role = "";
  }
  const page = searchParams.get("page") || 1;
  const active = searchParams.get("active") || true;
  const isDeleted = searchParams.get("deleted") || false;

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await api.get(`/employees`, {
          params: {
            search,
            sortOrder: sortOrderParam,
            sortBy: sortByParam,
            role,
            page,
            active,
            deleted: isDeleted,
          },
        });

        const { data, meta } = await res.data;
        setEmployees(data);
        setTotalPage(meta.totalPages);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, [role, search, sortOrderParam, sortByParam, page, active, isDeleted]);

  const formatEmployees = employees.map((employee: IEmployee) => ({
    id: employee.id,
    profile: employee.profilePicture?.trim()
      ? employee.profilePicture
      : defaultProfile,
    name: `${employee.firstname} ${employee.lastname}`,
    email: employee.email,
    role: employee.role.toLowerCase(),
    createdAt: employee.createdAt
      ? format(new Date(employee.createdAt), dateFormat)
      : null,
  }));

  const columns = [
    {
      header: "Profile",
      accessor: "profile",
      render: (value: string, row: any) => (
        <Avatar className="w-12 h-12">
          <AvatarImage
            src={`${value}`}
            alt={row.name}
            className="w-12 h-12 object-cover"
          />
          <AvatarFallback>
            {row.name ? row.name.charAt(0).toUpperCase() : "?"}
          </AvatarFallback>
        </Avatar>
      ),
    },
    { header: "Name", accessor: "name", sortable: true, sortKey: "firstname" },
    { header: "Email", accessor: "email", sortable: true, sortKey: "email" },
    {
      header: "Role",
      accessor: "role",
      render: (value: string) => <span className="capitalize">{value}</span>,
      sortable: true,
      sortKey: "role",
    },
    {
      header: "Created At",
      accessor: "createdAt",
      render: (value: string) => <span className="capitalize">{value}</span>,
      sortable: true,
      sortKey: "createdAt",
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

  const onSort = (sortKey: string) => {
    const currentSortBy = searchParams.get("sortBy") || null;
    const currentOrder = searchParams.get("sortOrder") || "desc";

    let nextOrder: "asc" | "desc" = "asc";
    if (currentSortBy === sortKey) {
      nextOrder = currentOrder === "asc" ? "desc" : "asc";
    }

    // update url params (preserve other params)
    const params = new URLSearchParams(searchParams.toString());
    params.set("sortBy", sortKey);
    params.set("sortOrder", nextOrder);
    params.set("page", "1"); // reset to first page on sort change
    router.push(`${location.pathname}?${params.toString()}`);
  };

  return (
    <div className="mt-4">
      <DataTable
        columns={columns}
        data={formatEmployees}
        sortBy={sortByParam}
        sortOrder={(sortOrderParam as "asc" | "desc") || "desc"}
        onSort={onSort}
      />
      <Pagination page={Number(page)} totalPages={totalPage} />
    </div>
  );
};

export default EmployeesData;
