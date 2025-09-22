"use client";

import { CircleUserRound, Edit, Trash2 } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import AlertModal from "@/modals/alert-modal";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";

interface DepartmentActionsProps {
  id: string;
  onDeleteSuccess?: (id: string) => void;
}

export function DepartmentActions({
  id,
  onDeleteSuccess,
}: DepartmentActionsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { divId } = useParams();

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const showingDeleted = searchParams.get("deleted") === "true";

  const handleEdit = () => {
    router.push(`/dashboard/divisions/${divId}/departments/${id}`);
  };

  const handleDeptEmployees = () => {
    router.push(`/dashboard/divisions/${divId}/departments/${id}/employees`);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await api.delete(`/departments/delete/${id}`);
      if (onDeleteSuccess) onDeleteSuccess(id);
      toast.success("Department deleted successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete department");
      console.error(error);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  if (showingDeleted) {
    return null;
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDelete}
        loading={loading}
      />

      <div className="flex items-center gap-2">
        <Button
          size="icon"
          onClick={handleEdit}
          className="p-2 bg-blue-200 rounded text-blue-800 hover:bg-blue-300"
        >
          <Edit size={16} />
        </Button>
        <Button
          size="icon"
          onClick={() => setOpen(true)}
          className="p-2 bg-red-200 rounded text-red-600 hover:bg-red-300"
        >
          <Trash2 size={16} />
        </Button>
        <Button
          size="icon"
          onClick={handleDeptEmployees}
          className="p-2 bg-green-300 rounded text-green-600 hover:bg-green-400"
        >
          <CircleUserRound size={16} />
        </Button>
      </div>
    </>
  );
}
