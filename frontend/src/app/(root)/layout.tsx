import { Header } from "@/components/layout/header";
import React from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="pt-[60px]">{children}</main>
    </>
  );
}
