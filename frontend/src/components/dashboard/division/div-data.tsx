"use client";
import axios from "axios";
import { format } from "date-fns";
import { DataTable } from "@/components/ui/data-table";
import React, { useEffect, useState } from "react";
import { baseUrl } from "../../../config";
import { useSearchParams } from "next/navigation";
import { DevisionActions } from "./cell-action";
import Pagination from "../pagination";

interface IDivision {
  id: string;
  name: string;
  createdAt: string;
  isActive: boolean;
}

const DivisionsData = () => {
  const searchParams = useSearchParams();
  const [divisions, setdivisions] = useState([]);
  const [totalPage, setTotalPage] = useState(0);

  const search = searchParams.get("search") || "";
  const sortOrder = searchParams.get("sortOrder") || "desc";
  const page = searchParams.get("page") || 1;

  useEffect(() => {
    const fetchDivisions = async () => {
      try {
        const res = await axios.get(`${baseUrl}/divisions`, {
          params: {
            search,
            sortOrder,
            page,
          },
          withCredentials: true,
        });

        const { data, meta } = await res.data;
        setdivisions(data);
        setTotalPage(meta.totalPages);
      } catch (error) {
        console.error("Error fetching divisions:", error);
      }
    };

    fetchDivisions();
  }, [search, sortOrder, page]);

  const formatDivisions = divisions.map((division: IDivision) => ({
    id: division.id,
    name: division.name,
    isActive: division.isActive,
    createdAt: format(new Date(division.createdAt), "dd-MM-yyyy"),
  }));

  const columns = [
    { header: "Division Name", accessor: "name" },
    { header: "Active", accessor: "isActive" },
    {
      header: "Created At",
      accessor: "createdAt",
    },
    {
      header: "Actions",
      accessor: "id",
      render: (id: string) => (
        <DevisionActions
          id={id}
          onDeleteSuccess={(deletedId: string) => {
            setdivisions((prev) => prev.filter((d) => d.id !== deletedId));
          }}
        />
      ),
    },
  ];

  return (
    <div className="mt-4">
      <DataTable columns={columns} data={formatDivisions} />
      <Pagination page={Number(page)} totalPages={totalPage} />
    </div>
  );
};

export default DivisionsData;
