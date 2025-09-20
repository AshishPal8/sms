"use client";
import axios from "axios";
import { format } from "date-fns";
import { DataTable } from "@/components/ui/data-table";
import React, { useEffect, useState } from "react";
import { baseUrl } from "../../../config";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { DepartmentActions } from "./cell-action";
import Pagination from "../pagination";
import useSettingsStore from "@/store/settings";

interface IManager {
  id: string;
  firstname: string;
  lastname?: string;
}

interface IDepartment {
  id: string;
  name: string;
  managers?: IManager[];
  createdAt: string;
  isActive: boolean;
}

const DepartmentData = () => {
  const { divId } = useParams();

  const searchParams = useSearchParams();
  const [departments, setDepartments] = useState([]);
  const [totalPage, setTotalPage] = useState(0);
  const dateFormat = useSettingsStore((state) => state.getDateFormat());

  const router = useRouter();

  const search = searchParams.get("search") || "";
  const sortOrderParam = searchParams.get("sortOrder") || "desc";
  const sortByParam = searchParams.get("sortBy") || "createdAt";
  const active = searchParams.get("active") || true;
  const page = searchParams.get("page") || 1;

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await axios.get(`${baseUrl}/departments/${divId}`, {
          params: {
            search,
            sortOrder: sortOrderParam,
            sortBy: sortByParam,
            active,
            page,
          },
          withCredentials: true,
        });

        const { data, meta } = await res.data;
        setDepartments(data);
        setTotalPage(meta.totalPages);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    fetchDepartments();
  }, [search, sortOrderParam, sortByParam, page, active, divId]);

  const formatDepartments = departments.map((department: IDepartment) => ({
    id: department.id,
    name: department.name,
    assignedTo:
      department.managers && department.managers.length > 0
        ? department.managers
            .map((manager) => `${manager.firstname} ${manager.lastname}`)
            .join(", ")
        : "Not Assigned",
    isActive: department.isActive,
    createdAt: format(new Date(department.createdAt), dateFormat),
  }));

  const columns = [
    { header: "Department", accessor: "name", sortable: true, sortKey: "name" },
    { header: "Assigned To", accessor: "assignedTo" },
    {
      header: "Active",
      accessor: "isActive",
      sortable: true,
      sortKey: "isActive",
    },
    {
      header: "Created At",
      accessor: "createdAt",
      sortable: true,
      sortKey: "createdAt",
    },
    {
      header: "Actions",
      accessor: "id",
      render: (id: string) => (
        <DepartmentActions
          id={id}
          onDeleteSuccess={(deletedId: string) => {
            setDepartments((prev) => prev.filter((d) => d.id !== deletedId));
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

    const params = new URLSearchParams(searchParams.toString());
    params.set("sortBy", sortKey);
    params.set("sortOrder", nextOrder);
    params.set("page", "1");
    router.push(`${location.pathname}?${params.toString()}`);
  };

  return (
    <div className="mt-4">
      <DataTable
        columns={columns}
        data={formatDepartments}
        sortBy={sortByParam}
        sortOrder={(sortOrderParam as "asc" | "desc") || "desc"}
        onSort={onSort}
      />
      <Pagination page={Number(page)} totalPages={totalPage} />
    </div>
  );
};

export default DepartmentData;
