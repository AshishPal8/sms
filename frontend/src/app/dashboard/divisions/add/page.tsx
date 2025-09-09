"use client";

import { DivisionForm } from "@/components/dashboard/division/div-form";

function AddDivision() {
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <DivisionForm />
      </div>
    </div>
  );
}

export default AddDivision;
