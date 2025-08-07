import React from "react";
import DashSidebar from "@/components/dashboard/dash-sidebar";
import DashHeader from "@/components/dashboard/dash-header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex w-full">
      <div className="hidden md:block w-1/5">
        <DashSidebar />
      </div>
      <div className="w-full md:w-4/5">
        <div>
          <DashHeader />
          {children}
        </div>
      </div>
    </main>
  );
}
