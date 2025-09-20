"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { DepartmentForm } from "@/components/dashboard/departments/dep-form";
import api from "@/lib/api";

function EditDepartment() {
  const [department, setDepartment] = useState({
    name: "",
    adminId: "",
    isActive: true,
  });
  const { depId } = useParams();

  useEffect(() => {
    if (!depId) return;

    const fetchDepartment = async () => {
      const res = await api.get(`/departments/by-id/${depId}`);

      const { data } = res.data;

      setDepartment(data);
    };

    fetchDepartment();
  }, [depId]);

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <DepartmentForm initialData={department} />
      </div>
    </div>
  );
}

export default EditDepartment;
