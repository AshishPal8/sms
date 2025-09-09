"use client";

import { Edit, Trash2, View } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { baseUrl } from "@/config";
import { useState } from "react";
import AlertModal from "@/modals/alert-modal";
import { Button } from "@/components/ui/button";

interface DivisionActionsProps {
  id: string;
  onDeleteSuccess?: (id: string) => void;
}

export function DevisionActions({ id, onDeleteSuccess }: DivisionActionsProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleEdit = () => {
    router.push(`/dashboard/divisions/${id}`);
  };
  const handleView = () => {
    router.push(`/dashboard/divisions/${id}/departments`);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await axios.delete(`${baseUrl}/divisions/delete/${id}`, {
        withCredentials: true,
      });
      if (onDeleteSuccess) onDeleteSuccess(id);
      toast.success("Division deleted successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete division");
      console.error(error);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

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
          onClick={handleView}
          className="p-2 bg-blue-200 rounded text-green-800 hover:bg-green-300"
        >
          <View size={16} />
        </Button>
      </div>
    </>
  );
}
