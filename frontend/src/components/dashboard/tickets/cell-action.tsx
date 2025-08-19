"use client";

import { Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { baseUrl } from "../../../../config";
import AlertModal from "@/modals/alert-modal";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import useAuthStore from "@/store/user";
import { roles } from "@/lib/utils";

interface TicketActionsProps {
  id: string;
  onDeleteSuccess?: (id: string) => void;
}

export function TicketActions({ id, onDeleteSuccess }: TicketActionsProps) {
  const router = useRouter();
  const { user } = useAuthStore();

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  if (!user) {
    return null;
  }

  const handleEdit = () => {
    router.push(`/dashboard/tickets/${id}`);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await axios.delete(`${baseUrl}/tickets/delete/${id}`, {
        withCredentials: true,
      });
      if (onDeleteSuccess) onDeleteSuccess(id);
      toast.success("Ticket deleted successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete ticket");
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
        {user.role === roles.ASSISTANT ||
          (user.role === roles.SUPERADMIN && (
            <Button
              size="icon"
              onClick={() => setOpen(true)}
              className="p-2 bg-red-200 rounded text-red-600 hover:bg-red-300"
            >
              <Trash2 size={16} />
            </Button>
          ))}
      </div>
    </>
  );
}
