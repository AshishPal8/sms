import EmployeesData from "@/components/dashboard/employee/employees-data";
import EmployeeFilters from "@/components/dashboard/employee/filters-header";
import React from "react";

const Employees = () => {
  return (
    <div className="p-2 md:p-4">
      <EmployeeFilters />
      <EmployeesData />
    </div>
  );
};

export default Employees;
