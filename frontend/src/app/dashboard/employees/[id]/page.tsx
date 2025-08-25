"use client";

import { EmployeeForm } from "@/components/dashboard/employee/employee-form";
import axios from "axios";
import { useEffect, useState } from "react";
import { baseUrl } from "../../../../../config";
import { useParams } from "next/navigation";
import { Role } from "@/types/role.types";

function EditEmployee() {
  const [employee, setEmployee] = useState<{
    name: string;
    email: string;
    phone: string;
    password: string;
    role: Role;
    isActive: boolean;
  }>({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "TECHNICIAN",
    isActive: true,
  });
  const { id } = useParams();

  useEffect(() => {
    if (!id) return;

    const fetchEmployee = async () => {
      const res = await axios.get(`${baseUrl}/employees/${id}`, {
        withCredentials: true,
      });

      const { data } = res.data;

      setEmployee(data);
    };

    fetchEmployee();
  }, [id]);

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <EmployeeForm initialData={employee} />
      </div>
    </div>
  );
}

export default EditEmployee;
