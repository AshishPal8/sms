import DepartmentData from "@/components/dashboard/departments/dep-data";
import DepartmentFilters from "@/components/dashboard/departments/dep-filters";
import React from "react";

const Departments = () => {
  return (
    <div className="p-2 md:p-4">
      <DepartmentFilters />
      <DepartmentData />
    </div>
  );
};

export default Departments;
