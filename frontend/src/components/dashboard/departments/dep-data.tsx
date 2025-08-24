"use client";
import axios from "axios";
import { format } from "date-fns";
import { DataTable } from "@/components/ui/data-table";
import React, { useEffect, useState } from "react";
import { baseUrl } from "../../../config";
import { useSearchParams } from "next/navigation";
import { DepartmentActions } from "./cell-action";
import Pagination from "../pagination";

interface IDepartment {
  id: string;
  name: string;
  admin?: {
    name: string;
  };
  createdAt: string;
  isActive: boolean;
}

const DepartmentData = () => {
  const searchParams = useSearchParams();
  const [departments, setDepartments] = useState([]);
  const [totalPage, setTotalPage] = useState(0);

  const search = searchParams.get("search") || "";
  const sortOrder = searchParams.get("sortOrder") || "desc";
  const page = searchParams.get("page") || 1;

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await axios.get(`${baseUrl}/departments`, {
          params: {
            search,
            sortOrder,
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
  }, [search, sortOrder, page]);

  const formatDepartments = departments.map((department: IDepartment) => ({
    id: department.id,
    name: department.name,
    assignedTo: department.admin?.name || "Not Assigned",
    isActive: department.isActive,
    createdAt: format(new Date(department.createdAt), "dd-MM-yyyy"),
  }));

  const columns = [
    { header: "Department", accessor: "name" },
    { header: "Assigned To", accessor: "assignedTo" },
    { header: "Active", accessor: "isActive" },
    {
      header: "Created At",
      accessor: "createdAt",
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

  return (
    <div>
      <DataTable columns={columns} data={formatDepartments} />
      <Pagination page={Number(page)} totalPages={totalPage} />
    </div>
  );
};

export default DepartmentData;
