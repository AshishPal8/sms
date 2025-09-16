"use client";

import DivisionsData from "@/components/dashboard/division/div-data";
import DivisionsFilters from "@/components/dashboard/division/div-filters";
import React, { Suspense } from "react";

const Divisions = () => {
  return (
    <div className="p-2 md:p-4 min-h-[95vh]">
      <Suspense fallback={<div>Loading...</div>}>
        <DivisionsFilters />
        <DivisionsData />
      </Suspense>
    </div>
  );
};

export default Divisions;
