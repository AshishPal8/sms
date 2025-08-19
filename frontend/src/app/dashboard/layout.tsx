import React from "react";
import DashSidebar from "@/components/dashboard/dash-sidebar";
import DashHeader from "@/components/dashboard/dash-header";
import { Nunito_Sans } from "next/font/google";

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className={`flex w-full ${nunitoSans.className}`}>
      <div className="hidden md:block w-1/5">
        <DashSidebar />
      </div>
      <div className="w-full md:w-4/5">
        <div>
          <DashHeader />
          <div className="bg-[#F5F6F9] min-h-[90vh] pt-14">{children}</div>
        </div>
      </div>
    </main>
  );
}
