import React from "react";
import { Header } from "@/components/layout/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className={``}>
      <Header />

      <div className="bg-[#F5F6F9] min-h-[90vh] mt-[60px]">{children}</div>
    </main>
  );
}
