"use client";

import React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";

interface Column<T> {
  header: string;
  accessor: keyof T;
  render?: (value: any, row: T) => React.ReactNode;
  sortable?: boolean;
  sortKey?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  sortBy?: string | null;
  sortOrder?: "asc" | "desc" | null;
  onSort?: (sortKey: string) => void;
}

export function DataTable<T>({
  columns,
  data,
  sortBy = null,
  sortOrder = null,
  onSort,
}: DataTableProps<T>) {
  const renderSortIcon = (colSortKey: string) => {
    if (!onSort)
      return (
        <ChevronsUpDown size={14} className="inline-block text-gray-400" />
      );

    if (sortBy !== colSortKey) {
      return (
        <ChevronsUpDown size={14} className="inline-block text-gray-400" />
      );
    }

    return sortOrder === "asc" ? (
      <ChevronUp size={14} className="inline-block text-gray-600" />
    ) : (
      <ChevronDown size={14} className="inline-block text-gray-600" />
    );
  };

  const handleHeaderClick = (col: Column<T>) => {
    if (!col.sortable || !onSort) return;
    const key = col.sortKey ?? String(col.accessor);
    onSort(key);
  };

  return (
    <Table className="border border-gray-200 bg-white rounded-xl shadow-sm overflow-hidden">
      <TableHeader className="bg-gray-50">
        <TableRow className="border-b border-gray-200">
          {columns.map((col, i) => {
            const colSortKey = col.sortKey ?? String(col.accessor);
            return (
              <TableHead
                key={i}
                className={`font-semibold text-sm uppercase tracking-wide text-gray-600 px-4 py-3 ${
                  col.sortable ? "cursor-pointer select-none" : ""
                }`}
                onClick={() => handleHeaderClick(col)}
                role={col.sortable ? "button" : undefined}
                aria-sort={
                  col.sortable && sortBy === colSortKey
                    ? sortOrder === "asc"
                      ? "ascending"
                      : "descending"
                    : "none"
                }
              >
                <div className="flex items-center gap-2">
                  <span>{col.header}</span>
                  {col.sortable && <span>{renderSortIcon(colSortKey)}</span>}
                </div>
              </TableHead>
            );
          })}
        </TableRow>
      </TableHeader>

      <TableBody>
        {data.length > 0 ? (
          data.map((row, i) => (
            <TableRow
              key={i}
              className="odd:bg-white even:bg-gray-50 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
            >
              {columns.map((col, j) => (
                <TableCell
                  key={j}
                  className="px-4 py-3 text-gray-700 text-sm whitespace-nowrap"
                >
                  {col.render
                    ? col.render(row[col.accessor], row)
                    : String(row[col.accessor] ?? "")}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={columns.length}
              className="text-center py-6 text-gray-500 text-sm"
            >
              No data found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
