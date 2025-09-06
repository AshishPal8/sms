"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Column<T> {
  header: string;
  accessor: keyof T;
  render?: (value: any, row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
}

export function DataTable<T>({ columns, data }: DataTableProps<T>) {
  return (
    <Table className="border border-gray-200 bg-white rounded-xl shadow-sm overflow-hidden">
      <TableHeader className="bg-gray-50">
        <TableRow className="border-b border-gray-200">
          {columns.map((col, i) => (
            <TableHead
              key={i}
              className="font-semibold text-sm uppercase tracking-wide text-gray-600 px-4 py-3"
            >
              {col.header}
            </TableHead>
          ))}
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
