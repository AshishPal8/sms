"use client";

import DepartmentData from "@/components/dashboard/departments/dep-data";
import DepartmentFilters from "@/components/dashboard/departments/dep-filters";
import React, { Suspense } from "react";

const Departments = () => {
  return (
    <div className="p-2 md:p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <DepartmentFilters />
        <DepartmentData />
      </Suspense>
    </div>
  );
};

export default Departments;
