"use client";
import axios from "axios";
import { format } from "date-fns";
import { DataTable } from "@/components/ui/data-table";
import React, { useEffect, useState } from "react";
import { baseUrl } from "../../../config";
import { useRouter, useSearchParams } from "next/navigation";
import { DevisionActions } from "./cell-action";
import Pagination from "../pagination";
import useSettingsStore from "@/store/settings";

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
  const dateFormat = useSettingsStore((state) => state.getDateFormat());

  const router = useRouter();

  const search = searchParams.get("search") || "";
  const sortOrderParam = searchParams.get("sortOrder") || "desc";
  const sortByParam = searchParams.get("sortBy") || "createdAt";
  const active = searchParams.get("active") || true;
  const page = searchParams.get("page") || 1;

  useEffect(() => {
    const fetchDivisions = async () => {
      try {
        const res = await axios.get(`${baseUrl}/divisions`, {
          params: {
            search,
            sortOrder: sortOrderParam,
            sortBy: sortByParam,
            page,
            active,
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
  }, [search, sortOrderParam, sortByParam, page, active]);

  const formatDivisions = divisions.map((division: IDivision) => ({
    id: division.id,
    name: division.name,
    isActive: division.isActive,
    createdAt: format(new Date(division.createdAt), dateFormat),
  }));

  const columns = [
    {
      header: "Division Name",
      accessor: "name",
      sortable: true,
      sortKey: "name",
    },
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
        <DevisionActions
          id={id}
          onDeleteSuccess={(deletedId: string) => {
            setdivisions((prev) => prev.filter((d) => d.id !== deletedId));
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
        data={formatDivisions}
        sortBy={sortByParam}
        sortOrder={(sortOrderParam as "asc" | "desc") || "desc"}
        onSort={onSort}
      />
      <Pagination page={Number(page)} totalPages={totalPage} />
    </div>
  );
};

export default DivisionsData;
