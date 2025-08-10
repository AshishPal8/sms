"use client";
import EmployeesData from "@/components/dashboard/employee/employees-data";
import EmployeeFilters from "@/components/dashboard/employee/filters-header";
import React, { Suspense } from "react";

const Employees = () => {
  return (
    <div className="p-2 md:p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <EmployeeFilters />
        <EmployeesData />
      </Suspense>
    </div>
  );
};

export default Employees;
