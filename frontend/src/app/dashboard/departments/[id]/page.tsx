"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { baseUrl } from "@/config";
import { useParams } from "next/navigation";
import { DepartmentForm } from "@/components/dashboard/departments/dep-form";

function EditDepartment() {
  const [department, setDepartment] = useState({
    name: "",
    adminId: "",
    isActive: true,
  });
  const { id } = useParams();

  useEffect(() => {
    if (!id) return;

    const fetchDepartment = async () => {
      const res = await axios.get(`${baseUrl}/departments/${id}`, {
        withCredentials: true,
      });

      const { data } = res.data;

      setDepartment(data);
    };

    fetchDepartment();
  }, [id]);

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <DepartmentForm initialData={department} />
      </div>
    </div>
  );
}

export default EditDepartment;
