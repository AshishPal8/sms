import React from "react";
import { Header } from "@/components/layout/header";
import Footer from "@/components/layout/footer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className={``}>
      <Header />

      <div className="min-h-[90vh] mt-[60px]">{children}</div>
      <Footer />
    </main>
  );
}
