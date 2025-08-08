"use client";

import { DepartmentForm } from "@/components/dashboard/departments/dep-form";

function AddDepartment() {
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <DepartmentForm />
      </div>
    </div>
  );
}

export default AddDepartment;
