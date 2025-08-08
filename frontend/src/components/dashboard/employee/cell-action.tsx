"use client";

import { Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { baseUrl } from "../../../../config";

interface EmployeeActionsProps {
  id: string;
}

export function EmployeeActions({ id }: EmployeeActionsProps) {
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/dashboard/employees/${id}`);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${baseUrl}/employees/delete/${id}`, {
        withCredentials: true,
      });
      toast.success("Employee deleted successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete employee");
      console.error(error);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleEdit}
        className="p-2 bg-blue-200 rounded text-blue-800 hover:bg-blue-300"
      >
        <Edit size={16} />
      </button>
      <button
        onClick={handleDelete}
        className="p-2 bg-red-200 rounded text-red-600 hover:bg-red-300"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
