"use client";

import { EmployeeForm } from "@/components/dashboard/employee/employee-form";

function EditEmployeeForm() {
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <EmployeeForm />
      </div>
    </div>
  );
}

export default EditEmployeeForm;
