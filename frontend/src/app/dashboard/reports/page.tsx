"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const Reports = () => {
  return (
    <div>
      <Link href="/dashboard/reports/tickets">
        <Button>Ticket Reports</Button>
      </Link>
    </div>
  );
};

export default Reports;
